"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Interfaz para los clientes
interface Client {
  id: number;
  company: string;
  logo_url: string;
  name: string;
  is_active: boolean;
}

// Interfaz para proyectos destacados
interface FeaturedProject {
  id: number;
  title: string;
  client_id: number;
  category: string;
  description: string;
  year: string;
  location: string;
  status: string;
  main_image: string;
  is_featured: boolean;
  is_visible_web: boolean;
  // Información del cliente
  client_name?: string;
  client_surname?: string;
  client_company?: string;
  client_display_name?: string;
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  // Función para cargar proyectos destacados
  const loadFeaturedProjects = async () => {
    setIsLoadingFeatured(true);
    try {
      const response = await fetch('https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/get_projects?show_inactive=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Filtrar solo proyectos destacados y visibles en web
          const featured = result.data.filter((project: FeaturedProject) => 
            project.is_featured && project.is_visible_web
          );
          setFeaturedProjects(featured);
        }
      }
    } catch (error) {
      console.error('Error al cargar proyectos destacados:', error);
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  useEffect(() => {
    // Solo hacer scroll si no estamos en la parte superior
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
    
    setIsVisible(true);
    loadFeaturedProjects();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  // Función para obtener el ícono de la categoría
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'residencial': '🏠',
      'comercial': '🏢',
      'industrial': '🏭',
      'aseo-industrial': '🧹',
      'infraestructura': '🌉',
      'renovacion': '🔨'
    };
    return icons[category] || '🏗️';
  };

  const slides = [
    {
      id: 1,
      image: "https://gruposhvc.s3.dualstack.us-east-1.amazonaws.com/archivos_gruposhvc/archivos_principal/quincho.jpeg",
      title: "Construcción Residencial",
      subtitle: "Casas y departamentos de alta calidad",
    },
    {
      id: 2,
      image: "https://gruposhvc.s3.dualstack.us-east-1.amazonaws.com/archivos_gruposhvc/archivos_principal/planos.png",
      title: "Planos y Diseño",
      subtitle: "Servicios profesionales de planos y documentación técnica",
    },
    {
      id: 3,
      image: "https://gruposhvc.s3.dualstack.us-east-1.amazonaws.com/archivos_gruposhvc/archivos_principal/mantencion%20electrica.jpeg",
      title: "Mantenciones Industriales",
      subtitle: "Mantenimiento industrial y sub estaciones eléctricas",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Nuevo carrusel de clientes
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const clientCarouselRef = useRef<HTMLDivElement>(null);

  // Cargar clientes reales del endpoint get_clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('https://60w42l85z2.execute-api.us-east-1.amazonaws.com/get_clients');
        const data = await response.json();
        
        if (data.clients) {
          // Filtrar solo clientes activos
          const clientesActivos = data.clients.filter((client: Client) => client.is_active);
          setClients(clientesActivos);
        }
      } catch (error) {
        console.error('Error al obtener clientes:', error);
        // Si falla, usar datos de ejemplo como fallback
        setClients([
          { id: 1, name: "Constructora ABC", logo_url: "", company: "Constructora ABC", is_active: true },
          { id: 2, name: "Inmobiliaria XYZ", logo_url: "", company: "Inmobiliaria XYZ", is_active: true },
          { id: 3, name: "Arquitectura Moderna", logo_url: "", company: "Arquitectura Moderna", is_active: true },
          { id: 4, name: "Grupo Constructor", logo_url: "", company: "Grupo Constructor", is_active: true },
          { id: 5, name: "Desarrollo Inmobiliario", logo_url: "", company: "Desarrollo Inmobiliario", is_active: true }
        ]);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isPaused || isResetting) return;

    const interval = setInterval(() => {
      setCarouselPosition(prev => {
        const newPosition = prev + 1;
        const maxScroll = clientCarouselRef.current?.scrollWidth || 0;
        const containerWidth = clientCarouselRef.current?.clientWidth || 0;
        
        // Si llegamos al final, resetear al inicio
        if (newPosition >= maxScroll - containerWidth) {
          setIsResetting(true);
          return 0;
        }
        return newPosition;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, isResetting]);

  useEffect(() => {
    if (typeof window === 'undefined' || !clientCarouselRef.current) return;

    if (isResetting) {
      // Transición suave al inicio
      clientCarouselRef.current.style.scrollBehavior = 'smooth';
      clientCarouselRef.current.scrollLeft = 0;
      
      // Después de la transición, reanudar el movimiento
      setTimeout(() => {
        if (clientCarouselRef.current) {
          clientCarouselRef.current.style.scrollBehavior = 'auto';
          setIsResetting(false);
        }
      }, 800);
    } else {
      // Movimiento normal
      clientCarouselRef.current.style.scrollBehavior = 'auto';
      clientCarouselRef.current.scrollLeft = carouselPosition;
    }
  }, [carouselPosition, isResetting]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .auto-scroll {
          animation: scroll 60s linear infinite;
        }
        .carousel-container {
          cursor: grab;
        }
        .carousel-container:active {
          cursor: grabbing;
        }
        .carousel-container::-webkit-scrollbar {
          display: none;
        }
        .carousel-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Line clamp utility for text truncation */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      {/* Hero Carousel */}
      <section id="inicio" className="relative h-screen overflow-hidden bg-black">
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              aria-label={`Slide ${index + 1}: ${slide.title}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/50" />
                {/* Overlay de transición liquid glass al borde inferior */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-3 sm:h-4 md:h-5">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40 backdrop-blur-[1px]" />
                </div>
              </div>

              <div className="relative h-full flex flex-col items-center justify-center px-4">
                <div className={`text-center text-white max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
                    {slide.title}
                  </h1>
                  <p className={`text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
                    {slide.subtitle}
                  </p>
                  
                  {/* Botones integrados en el flujo */}
                  <div className={`flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
                    <a
                      href="/obras"
                      tabIndex={index === currentSlide ? 0 : -1}
                      className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-center cursor-pointer"
                      style={{
                        backgroundColor: '#1e4e78', 
                        border: '1px solid rgba(46, 116, 180, 0.2)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(0) scale(1)',
                        pointerEvents: index === currentSlide ? 'auto' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (index === currentSlide) {
                          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index === currentSlide) {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                        }
                      }}
                    >
                      Nuestras obras
                    </a>
                    <a
                      href="/contacto"
                      tabIndex={index === currentSlide ? 0 : -1}
                      className="text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-center cursor-pointer"
                      style={{
                        backgroundColor: '#bcd6ee', 
                        border: '1px solid rgba(156, 195, 231, 0.3)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(0) scale(1)',
                        pointerEvents: index === currentSlide ? 'auto' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (index === currentSlide) {
                          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index === currentSlide) {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                        }
                      }}
                    >
                      Contáctanos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
                              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  index === currentSlide 
                    ? "bg-white/90 scale-125 shadow-lg" 
                    : "bg-white/30 hover:bg-white/50 hover:scale-110"
                }`}
            />
          ))}
        </div>

        {/* Flechas */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-4 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg z-20"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-4 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg z-20"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Sección de Clientes */}
      <section id="clientes" className="py-32 bg-primary overflow-hidden relative z-20" style={{
        background: 'linear-gradient(to bottom, #2e74b4 0%, #2e74b4 95%, rgba(46, 116, 180, 0.8) 100%)'
      }}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Nuestros Clientes</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto px-4">
            Trabajamos con empresas líderes en el sector de la construcción y desarrollo inmobiliario
          </p>
        </div>

        {/* Nuevo Carrusel de Logos */}
        <div className="relative w-full">
          <div
            ref={clientCarouselRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-hidden"
            style={{ 
              scrollBehavior: 'smooth',
              userSelect: 'none',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {loadingClients ? (
              // Mostrar skeleton loading centrado mientras carga
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="flex gap-6 sm:gap-8 lg:gap-12">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-white/30 min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] h-[160px] sm:h-[180px] lg:h-[200px] flex-shrink-0"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse mb-3 sm:mb-4 lg:mb-5"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : clients.length > 0 ? (
              clients.map((client, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] h-[160px] sm:h-[180px] lg:h-[200px] flex-shrink-0"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 lg:mb-5">
                  {client.logo_url ? (
                    <img 
                      src={client.logo_url} 
                      alt={client.company || client.name} 
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-2xl">
                      {client.company ? client.company.charAt(0) : client.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 text-center">
                  {client.company || client.name}
                </h3>
              </div>
            ))
            ) : (
              // Mensaje si no hay clientes
              <div className="w-full flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏢</div>
                  <p className="text-black text-lg font-medium">No hay clientes disponibles en este momento</p>
                  <p className="text-gray-800 text-sm mt-2">Los clientes aparecerán aquí cuando se registren</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

             {/* Sección de Obras Populares */}
       <section className="py-32 bg-primary-light relative z-20" style={{
         background: 'linear-gradient(to bottom, #9cc3e7 0%, #9cc3e7 95%, rgba(156, 195, 231, 0.8) 100%)'
       }}>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Obras Destacadas</h2>
             <p className="text-xl text-gray-700 max-w-3xl mx-auto">
               Nuestros proyectos más populares y reconocidos en el sector de la construcción
             </p>
           </div>

           {/* Estado de carga */}
           {isLoadingFeatured && (
             <div className="text-center py-12">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               <p className="mt-4 text-gray-600">Cargando obras destacadas...</p>
             </div>
           )}

           {/* Grid de proyectos destacados */}
           {!isLoadingFeatured && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {featuredProjects.length > 0 ? (
                 featuredProjects.slice(0, 6).map((project) => (
                   <div key={project.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                     {/* Imagen del proyecto */}
                     <div className="relative h-48 overflow-hidden">
                       <img
                         src={project.main_image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"}
                         alt={project.title}
                         className="w-full h-full object-cover"
                       />
                       <div className="absolute top-3 right-3">
                         <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                           {project.year}
                         </span>
                       </div>
                     </div>

                     {/* Contenido */}
                     <div className="p-6">
                       <div className="flex items-center justify-between mb-3">
                         <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                         <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                       </div>
                       
                       <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                       
                       <div className="space-y-2">
                         <div className="flex items-center text-sm text-gray-500">
                           <span className="font-semibold mr-2">📍</span>
                           <span className="truncate">{project.location}</span>
                         </div>
                         <div className="flex items-center text-sm text-gray-500">
                           <span className="font-semibold mr-2">👤</span>
                           <span className="truncate">{project.client_display_name || project.client_name || 'Sin asignar'}</span>
                         </div>
                         <div className="flex items-center text-sm text-gray-500">
                           <span className="font-semibold mr-2">📊</span>
                           <span className="capitalize">{project.status}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="col-span-full text-center py-12">
                   <div className="text-6xl mb-4">🏗️</div>
                   <h3 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h3>
                   <p className="text-gray-600">Estamos preparando nuestras obras destacadas</p>
                 </div>
               )}
             </div>
           )}

           <div className="text-center mt-12">
             <a
               href="/obras"
               className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
               style={{backgroundColor: '#2e74b4'}}
             >
               Ver todas las obras
               <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
               </svg>
             </a>
           </div>
         </div>
       </section>

       {/* Sección Quienes Somos */}
       <section className="py-32 bg-accent-blue relative z-20" style={{
         background: 'linear-gradient(to bottom, #bcd6ee 0%, #bcd6ee 95%, rgba(188, 214, 238, 0.8) 100%)'
       }}>
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Quiénes Somos</h2>
           <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
             Somos una constructora líder con más de 15 años de experiencia, especializada en proyectos residenciales y comerciales. 
             Hemos completado más de 200 proyectos exitosos, siempre superando las expectativas de nuestros clientes.
           </p>
           
           <div className="grid grid-cols-3 gap-8 mb-12">
             <div className="text-center">
               <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
               <div className="text-sm text-gray-600">Proyectos</div>
             </div>
             <div className="text-center">
               <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
               <div className="text-sm text-gray-600">Años</div>
             </div>
             <div className="text-center">
               <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
               <div className="text-sm text-gray-600">Profesionales</div>
             </div>
           </div>

           <a
             href="/nosotros"
                           className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              style={{backgroundColor: '#1e4e78'}}
           >
             Conoce más sobre nosotros
             <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
           </a>
         </div>
       </section>

      {/* Footer está en layout */}
    </div>
  );
}
