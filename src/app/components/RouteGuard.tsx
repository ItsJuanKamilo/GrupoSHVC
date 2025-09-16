"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionTimeout } from "../hooks/useSessionTimeout";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export default function RouteGuard({ children, allowedRoles, redirectTo }: RouteGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Activar timeout de sesión de 1 hora
  useSessionTimeout(60);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");

      if (!token) {
        // No hay token, redirigir a login
        router.push("/login");
        return;
      }

      if (!userRole) {
        // No hay rol, redirigir a login
        router.push("/login");
        return;
      }

      if (!allowedRoles.includes(userRole)) {
        // Rol no autorizado, redirigir según el rol
        if (userRole === "admin") {
          router.push("/panel");
        } else {
          router.push("/dashboard");
        }
        return;
      }

      // Usuario autorizado
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #1e4e78 0%, #2e74b4 25%, #9cc3e7 75%, #bcd6ee 100%)'
      }}>
        <div className="text-white text-xl">Verificando permisos...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
