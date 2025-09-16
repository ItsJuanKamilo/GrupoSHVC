"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Funciones para manejo de RUT (mismas que en login)
const formatRUT = (rut: string): string => {
  const cleanRUT = rut.replace(/[^0-9kK]/g, '');
  
  if (cleanRUT.length <= 1) return cleanRUT;
  
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();
  
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

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    name: "",           // Primer nombre (obligatorio)
    name_1: "",         // Segundo nombre (opcional)
    surname: "",        // Primer apellido (obligatorio)
    surname_1: "",      // Segundo apellido (obligatorio)
    rut: "",           // RUT sin dígito verificador
    dv: "",            // Dígito verificador
    password_hash: "",  // Contraseña (obligatorio)
    email: "",         // Correo electrónico (obligatorio)
    phone: "",         // Teléfono (obligatorio)
    company: "",       // Nombre de la empresa (opcional)
    website: "",       // Sitio web (opcional)
    description: ""    // Descripción (opcional)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rutError, setRutError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Función para capitalizar la primera letra
    const capitalizeFirstLetter = (str: string) => {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    
    // Aplicar capitalización solo a campos de nombres y apellidos
    const fieldsToCapitalize = ['name', 'name_1', 'surname', 'surname_1'];
    const processedValue = fieldsToCapitalize.includes(name) ? capitalizeFirstLetter(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatRUT(inputValue);
    const cleaned = cleanRUT(inputValue);
    
    if (cleaned.length >= 2) {
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1).toUpperCase();
      
      setFormData((prev) => ({
        ...prev,
        rut: body,
        dv: dv,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        rut: cleaned,
        dv: "",
      }));
    }
    
    setRutError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar RUT antes de enviar
    const fullRUT = formData.rut + formData.dv;
    if (!validateRUT(fullRUT)) {
      setRutError("RUT inválido");
      return;
    }
    
    setIsLoading(true);

    // Preparar datos para envío según la estructura esperada por el Lambda
    const dataToSend = {
      rut: formData.rut + '-' + formData.dv, // RUT completo
      dv: formData.dv,
      name: formData.name,
      name_1: formData.name_1,
      surname: formData.surname,
      surname_1: formData.surname_1,
      phone: formData.phone,
      email: formData.email,
      password: formData.password_hash, // El Lambda espera 'password'
      company: formData.company,
      website: formData.website,
      description: formData.description
    };

    try {
      // Llamada a la API Lambda para guardar en la tabla waiting
      const response = await fetch('https://47eh80tfbg.execute-api.us-east-1.amazonaws.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setIsLoading(false);
        setIsSubmitted(true);
      } else {
        throw new Error('Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  if (isSubmitted) {
    return (
      <section className="relative min-h-screen pt-32 overflow-hidden" style={{
        background: 'linear-gradient(to bottom right, #1e4e78 0%, #2e74b4 20%, #1e4e78 40%, #1e4e78 60%, #2e74b4 80%, #1e4e78 100%)'
      }}>
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl animate-[float_14s_ease-in-out_infinite]" style={{backgroundColor: 'rgba(46, 116, 180, 0.3)'}} />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl animate-[float_16s_ease-in-out_infinite_reverse]" style={{backgroundColor: 'rgba(156, 195, 231, 0.25)'}} />

        <div className="relative z-10 max-w-md mx-auto px-6">
          <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-10 text-center">
            <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
              <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Solicitud enviada!</h2>
            <p className="text-white/70 mb-6">
              Su solicitud ha sido enviada y está en revisión. Un administrador se pondrá en contacto con usted en las próximas 24-48 horas.
            </p>
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center px-5 py-3 rounded-xl text-white font-semibold"
              style={{backgroundColor: '#1e4e78'}}
            >
              Volver al inicio
            </Link>
          </div>
        </div>

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

  return (
    <section className="relative min-h-screen pt-32 overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, #1e4e78 0%, #2e74b4 20%, #1e4e78 40%, #1e4e78 60%, #2e74b4 80%, #1e4e78 100%)'
    }}>
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl animate-[float_14s_ease-in-out_infinite]" style={{backgroundColor: 'rgba(46, 116, 180, 0.3)'}} />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl animate-[float_16s_ease-in-out_infinite_reverse]" style={{backgroundColor: 'rgba(156, 195, 231, 0.25)'}} />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-4xl px-6">
        <div
          className={`text-center mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Grupo SHVC</h1>
          <h2 className="text-xl font-semibold text-white drop-shadow-md">Solicitar acceso de cliente</h2>
          <p className="mt-4 text-white drop-shadow-sm">
            Complete el formulario para solicitar acceso a su proyecto personalizado
          </p>
        </div>

        <div
          className={`relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6 sm:p-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Información Personal */}
            <div className="border-b border-white/20 pb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white drop-shadow-sm">
                    Primer Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="name_1" className="block text-sm font-medium text-white drop-shadow-sm">
                    Segundo Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    name="name_1"
                    id="name_1"
                    value={formData.name_1}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-white drop-shadow-sm">
                    Primer Apellido *
                  </label>
                  <input
                    type="text"
                    name="surname"
                    id="surname"
                    required
                    value={formData.surname}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="surname_1" className="block text-sm font-medium text-white drop-shadow-sm">
                    Segundo Apellido *
                  </label>
                  <input
                    type="text"
                    name="surname_1"
                    id="surname_1"
                    required
                    value={formData.surname_1}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                  />
                </div>
              </div>

                             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                 <div>
                   <label htmlFor="rut" className="block text-sm font-medium text-white drop-shadow-sm">
                     RUT *
                   </label>
                   <input
                     type="text"
                     name="rut"
                     id="rut"
                     required
                     value={formData.rut + (formData.dv ? '-' + formData.dv : '')}
                     onChange={handleRUTChange}
                     placeholder="12.345.678-9"
                     maxLength={12}
                     className={`mt-2 block w-full rounded-xl bg-white/10 border px-4 py-3 text-white placeholder-white/60 outline-none transition sm:text-sm ${
                       rutError 
                         ? 'border-red-400/60 focus:ring-2 focus:ring-red-400/20' 
                         : 'border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20'
                     }`}
                   />
                   {rutError && (
                     <p className="mt-1 text-sm text-red-300">{rutError}</p>
                   )}
                 </div>

                 <div>
                   <label htmlFor="password_hash" className="block text-sm font-medium text-white drop-shadow-sm">
                     Contraseña *
                   </label>
                   <input
                     type="password"
                     name="password_hash"
                     id="password_hash"
                     required
                     value={formData.password_hash}
                     onChange={handleChange}
                     className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                   />
                 </div>
               </div>

               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                 <div>
                   <label htmlFor="email" className="block text-sm font-medium text-white drop-shadow-sm">
                     Correo electrónico *
                   </label>
                   <input
                     type="email"
                     name="email"
                     id="email"
                     required
                     value={formData.email}
                     onChange={handleChange}
                     className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                   />
                 </div>

                 <div>
                   <label htmlFor="phone" className="block text-sm font-medium text-white drop-shadow-sm">
                     Teléfono *
                   </label>
                   <input
                     type="tel"
                     name="phone"
                     id="phone"
                     required
                     value={formData.phone}
                     onChange={handleChange}
                     className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                   />
                 </div>
               </div>
            </div>

            {/* Información Empresarial */}
            <div className="border-b border-white/20 pb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Información Empresarial (Opcional)</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white drop-shadow-sm">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-white drop-shadow-sm">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.ejemplo.com"
                    className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                  />
                </div>
              </div>

              
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white drop-shadow-sm">
                Descripción del Proyecto *
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-2 block w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 sm:text-sm"
                placeholder="Describa brevemente su proyecto, necesidades específicas y cualquier información adicional relevante..."
              />
            </div>

            <div className="flex items-start">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-400/30"
                />
                <span className="text-sm text-white drop-shadow-sm">
                  Acepto que Grupo SHVC me contacte para discutir mi proyecto y recibir información sobre servicios. *
                </span>
              </label>
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
                  Enviando solicitud...
                </>
              ) : (
                <>Enviar solicitud</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              prefetch={false} 
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/5 border backdrop-blur-sm hover:bg-white/10 text-sm transition-all duration-200 text-white"
              style={{borderColor: '#9cc3e7'}}
            >
              ¿Ya tiene acceso? Iniciar sesión
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link 
              href="/" 
              prefetch={false} 
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/5 border backdrop-blur-sm hover:bg-white/10 text-sm transition-all duration-200 text-white"
              style={{borderColor: '#bcd6ee'}}
            >
              ← Volver al inicio
            </Link>
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