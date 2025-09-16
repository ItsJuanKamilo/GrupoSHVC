"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Funciones para manejo de RUT
const formatRUT = (rut: string): string => {
  // Remover todo lo que no sea número o K
  const cleanRUT = rut.replace(/[^0-9kK]/g, '');
  
  if (cleanRUT.length <= 1) return cleanRUT;
  
  // Separar cuerpo y dígito verificador
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();
  
  // Formatear el cuerpo con puntos
  let formattedBody = '';
  for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      formattedBody = '.' + formattedBody;
    }
    formattedBody = body[i] + formattedBody;
  }
  
  return formattedBody + '-' + dv;
};

const cleanRUT = (rut: string): string => {
  return rut.replace(/[^0-9kK]/g, '');
};

const validateRUT = (rut: string): boolean => {
  const cleanedRUT = cleanRUT(rut);
  if (cleanedRUT.length < 2) return false;
  
  const body = cleanedRUT.slice(0, -1);
  const dv = cleanedRUT.slice(-1).toUpperCase();
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDV = 11 - (sum % 11);
  const finalDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();
  
  return dv === finalDV;
};

export default function LoginPage() {
  const router = useRouter();
  const [rut, setRUT] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rutError, setRutError] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatRUT(inputValue);
    setRUT(formatted);
    setRutError("");
    setLoginError(""); // Limpiar error de login cuando el usuario empiece a escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setRutError("");
    setLoginError("");
    
    // Validar RUT antes de enviar
    if (!validateRUT(rut)) {
      setRutError("RUT inválido");
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Enviar RUT con guión al backend (formato: 24995965-0)
      const rutWithDash = rut.replace(/\./g, '');
      const response = await fetch(
        "https://47eh80tfbg.execute-api.us-east-1.amazonaws.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rut: rutWithDash, password }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        // Error de login - mostrar en la card
        setLoginError(data.message || "Credenciales incorrectas");
      } else {
        // Login exitoso → decodificar token y redirigir según rol
        localStorage.setItem("token", data.token);
        
        // Decodificar el token JWT para obtener el rol
        try {
          const tokenParts = data.token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          const userRole = payload.role;
          
          // Guardar el rol en localStorage
          localStorage.setItem("userRole", userRole === 1 ? "admin" : "cliente");
          
          // Redirigir según el rol
          if (userRole === 1) {
            // Admin - redirigir al panel
            router.push("/panel");
          } else {
            // Cliente - redirigir al dashboard
            router.push("/dashboard");
          }
        } catch (decodeError) {
          console.error("Error decodificando token:", decodeError);
          // Si no se puede decodificar, asumir que es cliente
          localStorage.setItem("userRole", "cliente");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
      setLoginError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <section className="relative min-h-screen pt-10 overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, #1e4e78 0%, #2e74b4 20%, #1e4e78 40%, #1e4e78 60%, #2e74b4 80%, #1e4e78 100%)'
    }}>
      {/* Background liquid blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full blur-3xl animate-[float_14s_ease-in-out_infinite]" style={{backgroundColor: 'rgba(46, 116, 180, 0.3)'}} />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl animate-[float_16s_ease-in-out_infinite_reverse]" style={{backgroundColor: 'rgba(156, 195, 231, 0.25)'}} />

      <div className="relative z-10 max-w-md mx-auto px-6">
        {/* Card */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl">
            {/* subtle glow ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />

            <div className="relative px-6 pt-4 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
              <div className="flex flex-col items-center text-center mb-5">
                <img
                  src="https://gruposhvc.s3.dualstack.us-east-1.amazonaws.com/archivos_gruposhvc/archivos_principal/Only_Logo.jpg"
                  alt="Grupo SHVC Logo"
                  className="w-32 h-32 object-contain"
                />
                <h1 className="text-xl font-bold text-white -mt-4 drop-shadow-lg">Grupo SHVC</h1>
                <p className="mt-1 text-white text-sm drop-shadow-md">Acceso Clientes</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="rut" className="block text-sm font-medium text-white drop-shadow-sm">
                    RUT
                  </label>
                  <div className="mt-2">
                    <input
                      id="rut"
                      name="rut"
                      type="text"
                      autoComplete="off"
                      required
                      value={rut}
                      onChange={handleRUTChange}
                      placeholder="12.345.678-9"
                      maxLength={12}
                      className={`w-full rounded-xl bg-white/10 border px-4 py-3 text-white placeholder-white/60 outline-none transition ${
                        rutError 
                          ? 'border-red-400/60 focus:ring-2 focus:ring-red-400/20' 
                          : 'border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20'
                      }`}
                    />
                    {rutError && (
                      <p className="mt-1 text-sm text-red-300">{rutError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white drop-shadow-sm">
                    Contraseña
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError(""); // Limpiar error cuando el usuario escriba
                      }}
                      placeholder="••••••••"
                      className={`w-full rounded-xl bg-white/10 border px-4 py-3 text-white placeholder-white/60 outline-none transition ${
                        loginError 
                          ? 'border-red-400/60 focus:ring-2 focus:ring-red-400/20' 
                          : 'border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20'
                      }`}
                    />
                    {loginError && (
                      <div className="mt-2 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                        <p className="text-sm text-red-300 flex items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {loginError}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 select-none">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-400/30"
                    />
                    <span className="text-sm text-white drop-shadow-sm">Recordarme</span>
                  </label>

                  <a href="#" className="text-sm text-blue-300 hover:text-blue-200" style={{color: '#9cc3e7'}}>
                    ¿Olvidó su contraseña?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition disabled:opacity-60 cursor-pointer"
                  style={{
                    backgroundColor: '#1e4e78',
                    boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3), 0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0a12 12 0 100 24v-4a8 8 0 01-8-8z" />
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>Iniciar sesión</>
                  )}
                </button>

                <div className="mt-6 flex items-center gap-3 select-none">
                  <div className="h-px flex-1 bg-white/15" />
                  <span className="text-xs text-white drop-shadow-sm">¿Nuevo cliente?</span>
                  <div className="h-px flex-1 bg-white/15" />
                </div>

                <Link
                  href="/registro"
                  prefetch={false}
                  className="inline-flex w-full items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
                  style={{borderColor: '#9cc3e7', backgroundColor: 'rgba(156, 195, 231, 0.1)'}}
                >
                  Solicitar acceso
                </Link>

                {/* Volver al inicio */}
                <div className="text-center mt-4">
                  <Link 
                    href="/" 
                    prefetch={false} 
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/5 border border-white/20 backdrop-blur-sm text-white hover:text-white/80 hover:bg-white/10 text-sm transition-all duration-200"
                  >
                    ← Volver al inicio
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Margen inferior para separar del footer */}
      <div className="h-16"></div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-16px) }
          100% { transform: translateY(0px) }
        }
      `}</style>
    </section>
  );
}