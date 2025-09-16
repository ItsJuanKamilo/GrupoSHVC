"use client";

import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";

export default function DynamicHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    setIsAuthenticated(!!token);
    setUserRole(role);
    setIsLoading(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-800/40 border-b border-gray-700/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
                         <img 
               src="https://gruposhvc.s3.dualstack.us-east-1.amazonaws.com/archivos_gruposhvc/archivos_principal/Only_Logo.jpg"
               alt="Grupo SHVC Logo"
               className="w-24 h-44 object-contain hover:scale-105 transition-all duration-300"
             />
                         <div className="flex flex-col">
               <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
                 Grupo SHVC
               </h1>
               <p className="text-sm text-white/80 tracking-wide">
                 Ingeniería y Construcción
               </p>
             </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-2" aria-label="Menú principal">
            <a
              href="/"
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group py-3 px-6 rounded-2xl hover:bg-gray-700/20 active:scale-95 transform backdrop-blur-sm border border-gray-600/20 hover:border-gray-500/30"
            >
              Inicio
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-white/60 to-white/40 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 rounded-full"></span>
            </a>
            <a
              href="/obras"
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group py-3 px-6 rounded-2xl hover:bg-gray-700/20 active:scale-95 transform backdrop-blur-sm border border-gray-600/20 hover:border-gray-500/30"
            >
              Obras
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-white/60 to-white/40 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 rounded-full"></span>
            </a>
            <a
              href="/clientes"
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group py-3 px-6 rounded-2xl hover:bg-gray-700/20 active:scale-95 transform backdrop-blur-sm border border-gray-600/20 hover:border-gray-500/30"
            >
              Clientes
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-white/60 to-white/40 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 rounded-full"></span>
            </a>
            <a
              href="/nosotros"
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group py-3 px-6 rounded-2xl hover:bg-gray-700/20 active:scale-95 transform backdrop-blur-sm border border-gray-600/20 hover:border-gray-500/30"
            >
              Nosotros
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-white/60 to-white/40 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 rounded-full"></span>
            </a>
            <a
              href="/contacto"
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group py-3 px-6 rounded-2xl hover:bg-gray-700/20 active:scale-95 transform backdrop-blur-sm border border-gray-600/20 hover:border-gray-500/30"
            >
              Contacto
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-white/60 to-white/40 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 rounded-full"></span>
            </a>
          </nav>

                     <div className="flex items-center space-x-4">
             <a
               href={isAuthenticated ? (userRole === "admin" ? "/panel" : "/dashboard") : "/login"}
               className="hidden lg:inline-flex bg-gradient-to-r from-gray-700/20 to-gray-600/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-2xl hover:from-gray-600/30 hover:to-gray-500/20 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 font-semibold border border-gray-600/20 hover:border-gray-500/40 tracking-wide"
             >
               Acceso Clientes
             </a>
             <MobileMenu />
           </div>
        </div>
      </div>
    </header>
  );
}
