"use client";
import { useState, useEffect } from "react";

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button 
        onClick={toggleMenu}
        className="lg:hidden text-white/90 hover:text-white transition-all duration-300 p-3.5 rounded-2xl hover:bg-gray-700/30 backdrop-blur-sm border border-gray-600/20 hover:border-gray-500/30 active:scale-95"
        aria-label="Abrir menú"
      >
        <div className="flex flex-col space-y-1.5">
          <div className={`w-7 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-7 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-7 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </div>
      </button>

            {/* Menú móvil desplegable */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-gray-800/40 backdrop-blur-xl border-b border-gray-700/20 shadow-2xl transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? "max-h-screen opacity-100 visible" 
          : "max-h-0 opacity-0 invisible"
      }`}>
        <div className="px-6 py-6 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <a
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center text-white hover:text-white transition-all duration-300 font-medium py-4 px-6 rounded-2xl bg-gray-700 hover:bg-gray-600 active:scale-95 transform backdrop-blur-sm border border-gray-600 hover:border-gray-500"
            >
              <span className="text-lg">🏠</span>
              <span className="ml-3">Inicio</span>
            </a>
            <a
              href="/obras"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center text-white hover:text-white transition-all duration-300 font-medium py-4 px-6 rounded-2xl bg-gray-700 hover:bg-gray-600 active:scale-95 transform backdrop-blur-sm border border-gray-600 hover:border-gray-500"
            >
              <span className="text-lg">🏗️</span>
              <span className="ml-3">Obras</span>
            </a>
            <a
              href="/clientes"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center text-white hover:text-white transition-all duration-300 font-medium py-4 px-6 rounded-2xl bg-gray-700 hover:bg-gray-600 active:scale-95 transform backdrop-blur-sm border border-gray-600 hover:border-gray-500"
            >
              <span className="text-lg">👥</span>
              <span className="ml-3">Clientes</span>
            </a>
            <a
              href="/nosotros"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center text-white hover:text-white transition-all duration-300 font-medium py-4 px-6 rounded-2xl bg-gray-700 hover:bg-gray-600 active:scale-95 transform backdrop-blur-sm border border-gray-600 hover:border-gray-500"
            >
              <span className="text-lg">🏢</span>
              <span className="ml-3">Nosotros</span>
            </a>
            <a
              href="/contacto"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center text-white hover:text-white transition-all duration-300 font-medium py-4 px-6 rounded-2xl bg-gray-700 hover:bg-gray-600 active:scale-95 transform backdrop-blur-sm border border-gray-600 hover:border-gray-500"
            >
              <span className="text-lg">📞</span>
              <span className="ml-3">Contacto</span>
            </a>
          </div>
          
                      <div className="pt-4 border-t border-gray-600/20 lg:hidden">
              <a
                href={isAuthenticated ? (userRole === "admin" ? "/panel" : "/dashboard") : "/login"}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-600 backdrop-blur-sm text-white px-6 py-4 rounded-2xl hover:from-gray-600 hover:to-gray-500 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 font-semibold border border-gray-600 hover:border-gray-500 tracking-wide"
              >
                <span className="text-lg mr-2">🔐</span>
                Acceso Clientes
              </a>
            </div>
        </div>
      </div>
    </>
  );
} 