"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Interfaz para los clientes
interface Client {
  id: number;
  company: string;
  logo_url: string;
  name: string;
  is_active: boolean;
}

export default function Clientes() {
  const [isVisible, setIsVisible] = useState(false);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Cargar clientes reales del endpoint get_clients
    const fetchClientes = async () => {
      try {
        const response = await fetch('https://60w42l85z2.execute-api.us-east-1.amazonaws.com/get_clients');
        const data = await response.json();
        
        if (data.clients) {
          // Filtrar solo clientes activos
          const clientesActivos = data.clients.filter((client: Client) => client.is_active);
          setClientes(clientesActivos);
        }
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-gray-900/90">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        </div>
        
        <div className={`relative z-10 text-center text-white max-w-4xl px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
            Clientes que confiaron en nosotros
          </h1>
          <p className={`text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-gray-200 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Empresas líderes que han elegido Grupo SHVC para sus proyectos
          </p>
          
          {/* Botones integrados en el flujo */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
            <a
              href="#clientes"
              className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-center"
              style={{backgroundColor: '#1e4e78', border: '1px solid rgba(46, 116, 180, 0.2)'}}
            >
              Ver clientes
            </a>
            <Link
              href="/contacto"
              prefetch={false}
              className="text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-center"
              style={{backgroundColor: '#bcd6ee', border: '1px solid rgba(156, 195, 231, 0.3)'}}
            >
              Únete a nosotros
            </Link>
          </div>
        </div>
      </section>

      {/* Clientes Section */}
      <section id="clientes" className="py-16 scroll-mt-20" style={{
        background: 'linear-gradient(to bottom, #9cc3e7 0%, #9cc3e7 95%, rgba(156, 195, 231, 0.8) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nuestros Clientes</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Empresas de diversos sectores que han confiado en nuestra experiencia y calidad
            </p>
          </div>

          {/* Grid de Clientes */}
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : clientes.length > 0 ? (
              clientes.map((cliente, index) => (
                <div
                  key={cliente.id}
                  className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 border border-gray-100 transition-all duration-500 ${
                    isVisible
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-20'
                  }`}
                  style={{ 
                    transitionDelay: isVisible ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">
                      {cliente.logo_url ? (
                        <img 
                          src={cliente.logo_url} 
                          alt={cliente.company || 'Cliente'} 
                          className="w-16 h-16 mx-auto object-contain rounded-lg"
                        />
                      ) : (
                        "🏢" // Logo por defecto si no hay imagen
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cliente.company || cliente.name}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No hay clientes activos para mostrar</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{
        background: 'linear-gradient(to bottom, #9cc3e7 0%, #9cc3e7 95%, rgba(156, 195, 231, 0.8) 100%)'
      }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            ¿Quieres ser nuestro próximo cliente?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Únete a las empresas que ya confían en Grupo SHVC para sus proyectos
          </p>
          <Link
            href="/contacto"
            prefetch={false}
            className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            style={{backgroundColor: '#1e4e78'}}
          >
            Contáctanos
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
} 