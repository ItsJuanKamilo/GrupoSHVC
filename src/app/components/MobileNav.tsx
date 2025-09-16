"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-blue-600 p-2"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
          <div className="px-4 py-2 space-y-1">
            <a
              href="#inicio"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </a>
            <a
              href="#servicios"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Servicios
            </a>
            <a
              href="#proyectos"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Proyectos
            </a>
            <a
              href="#contacto"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </a>
            <Link
              href="/login"
              prefetch={false}
              className="block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Acceso Clientes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 