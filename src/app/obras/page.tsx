"use client";
import { useState, useEffect, useRef } from "react";

interface Obra {
  id: number;
  title: string;
  client_id: number;
  category: string;
  description: string;
  detaileddescription?: string;
  year: string;
  area?: string;
  location: string;
  status: string;
  main_image: string;
  gallery_images: string[];
  features: string[];
  specifications: string[];
  is_featured: boolean;
  is_active: boolean;
  is_visible_web: boolean;
  created_at: string;
  updated_at: string;
  // Información del cliente (para mostrar)
  client_name?: string;
  client_surname?: string;
  client_company?: string;
  client_email?: string;
  client_logo?: string;
  client_display_name?: string;
}

export default function Obras() {
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [isVisible, setIsVisible] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const [obras, setObras] = useState<Obra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs para los contenedores de miniaturas
  const mobileThumbnailsRef = useRef<HTMLDivElement>(null);
  const desktopThumbnailsRef = useRef<HTMLDivElement>(null);

  // Función para cargar obras desde la API
  const loadObras = async () => {
    setIsLoading(true);
    setError(null);
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
          // Filtrar solo obras visibles en web
          const visibleObras = result.data.filter((obra: Obra) => obra.is_visible_web);
          setObras(visibleObras);
        } else {
          setError('Error al cargar las obras');
        }
      } else {
        setError('Error al conectar con el servidor');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadObras();
    setIsVisible(true);
    // Animación para las tarjetas
    setTimeout(() => setAnimateCards(true), 800);
  }, []);

  // Limpiar scroll al desmontar el componente
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Scroll automático a la miniatura seleccionada
  useEffect(() => {
    if (isModalOpen && selectedObra) {
      scrollToThumbnail(currentImageIndex);
    }
  }, [currentImageIndex, isModalOpen]);

  const categories = [
    { id: "todas", name: "Todas las obras", icon: "🏗️" },
    { id: "residencial", name: "Residencial", icon: "🏠" },
    { id: "comercial", name: "Comercial", icon: "🏢" },
    { id: "industrial", name: "Industrial", icon: "🏭" },
    { id: "aseo-industrial", name: "Aseo Industrial", icon: "🧹" },
    { id: "infraestructura", name: "Infraestructura", icon: "🌉" },
    { id: "renovacion", name: "Renovación", icon: "🔨" }
  ];


  const filteredObras = selectedCategory === "todas" 
    ? obras 
    : obras.filter(obra => obra.category === selectedCategory);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === selectedCategory) return;
    
    // Activar estado de filtrado para mostrar animación
    setIsFiltering(true);
    setSelectedCategory(categoryId);
    
    // Hacer scroll automático hacia la sección de obras después de un pequeño delay
    // para que el estado se actualice primero
    setTimeout(() => {
      const obrasSection = document.getElementById('obras-grid');
      if (obrasSection) {
        obrasSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
      
      // Desactivar el estado de filtrado después de la animación
      setTimeout(() => {
        setIsFiltering(false);
      }, 800);
    }, 100);
  };

  const openModal = (obra: Obra) => {
    setSelectedObra(obra);
    setIsModalOpen(true);
    setCurrentImageIndex(0);
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedObra(null);
    setCurrentImageIndex(0);
    // Restaurar scroll del body
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (selectedObra && selectedObra.gallery_images) {
      setCurrentImageIndex((prev) => 
        prev === selectedObra.gallery_images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedObra && selectedObra.gallery_images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedObra.gallery_images.length - 1 : prev - 1
      );
    }
  };

  const nextThumbnail = () => {
    if (selectedObra && selectedObra.gallery_images) {
      setCurrentImageIndex((prev) => 
        prev === selectedObra.gallery_images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevThumbnail = () => {
    if (selectedObra && selectedObra.gallery_images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedObra.gallery_images.length - 1 : prev - 1
      );
    }
  };

  // Función para hacer scroll automático a la miniatura seleccionada
  const scrollToThumbnail = (index: number) => {
    if (mobileThumbnailsRef.current) {
      const thumbnailWidth = 88; // w-20 (80px) + gap-2 (8px)
      const scrollPosition = index * thumbnailWidth - (mobileThumbnailsRef.current.clientWidth / 2) + (thumbnailWidth / 2);
      mobileThumbnailsRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
    
    if (desktopThumbnailsRef.current) {
      const thumbnailWidth = 72; // w-16 (64px) + gap-2 (8px)
      const scrollPosition = index * thumbnailWidth - (desktopThumbnailsRef.current.clientWidth / 2) + (thumbnailWidth / 2);
      desktopThumbnailsRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-500";
      case "En Progreso":
        return "bg-blue-500";
      case "Planificado":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEmptyCategoryMessage = (categoryId: string) => {
    switch (categoryId) {
      case "residencial":
        return {
          title: "Obras Residenciales en Preparación",
          message: "Estamos preparando nuevos proyectos residenciales. ¡Vuelve pronto!"
        };
      case "comercial":
        return {
          title: "Obras Comerciales en Preparación",
          message: "Estamos preparando nuevos proyectos comerciales. ¡Vuelve pronto!"
        };
      case "industrial":
        return {
          title: "Obras Industriales en Preparación",
          message: "Estamos preparando nuevos proyectos industriales. ¡Vuelve pronto!"
        };
      case "aseo-industrial":
        return {
          title: "Proyectos de Aseo Industrial en Preparación",
          message: "Estamos preparando nuevos proyectos de aseo industrial. ¡Vuelve pronto!"
        };
      case "infraestructura":
        return {
          title: "Proyectos de Infraestructura en Preparación",
          message: "Estamos preparando nuevos proyectos de infraestructura. ¡Vuelve pronto!"
        };
      case "renovacion":
        return {
          title: "Proyectos de Renovación en Preparación",
          message: "Estamos preparando nuevos proyectos de renovación. ¡Vuelve pronto!"
        };
      default:
        return {
          title: "No se encontraron obras",
          message: "Intenta con otra categoría o vuelve más tarde"
        };
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(10px);
          }
          50% {
            opacity: 1;
            transform: scale(1.02) translateY(-2px);
          }
          70% {
            transform: scale(0.98) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9) rotate(3deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse 1.5s infinite;
        }
        
        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out;
        }
        
        /* Ocultar scrollbar para miniaturas */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Responsive improvements for very small screens */
        @media (max-width: 480px) {
          .xs\:inline {
            display: inline !important;
          }
          .xs\:hidden {
            display: none !important;
          }
        }
        
        /* Line clamp utility for text truncation */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Smooth touch interactions for mobile */
        @media (hover: none) and (pointer: coarse) {
          .hover\:scale-105:hover {
            transform: none;
          }
          .hover\:shadow-2xl:hover {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
        }
        
        /* Animación de filtrado */
        @keyframes filterUpdate {
          0% {
            opacity: 0.7;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .filtering {
          animation: filterUpdate 0.8s ease-out;
        }
      `}</style>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-gray-900/90">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        </div>
        
        <div className={`relative z-10 text-center text-white max-w-4xl px-4 py-8 sm:py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
            Nuestras Obras
          </h1>
          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-12 text-gray-200 transition-all duration-500 px-4 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Proyectos que transforman espacios y construyen el futuro
          </p>
          
          {/* Botones integrados en el flujo */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-md mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
            <a
              href="#obras"
              className="text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-center text-sm sm:text-base"
              style={{backgroundColor: '#1e4e78', border: '1px solid rgba(46, 116, 180, 0.2)'}}
            >
              Explorar obras
            </a>
            <a
              href="/contacto"
              className="text-gray-900 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-center text-sm sm:text-base"
              style={{backgroundColor: '#bcd6ee', border: '1px solid rgba(156, 195, 231, 0.3)'}}
            >
              Solicitar cotización
            </a>
          </div>
        </div>
      </section>

      {/* Filtros Section */}
      <section id="obras" className="py-8 sm:py-12 lg:py-16 scroll-mt-20" style={{
        background: 'linear-gradient(to bottom, #2e74b4 0%, #2e74b4 95%, rgba(46, 116, 180, 0.8) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-12 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">Explora Nuestros Proyectos</h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto px-4">
              Filtra por categoría para encontrar exactamente lo que buscas
            </p>
          </div>

          {/* Filtros - Mejorado para móviles */}
          <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-150 text-sm sm:text-base ${
                  selectedCategory === category.id
                    ? 'text-white shadow-xl relative'
                    : 'bg-white text-gray-700 hover:bg-white/90 border border-white/30'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? '#1e4e78' : 'rgba(255, 255, 255, 0.9)',
                  transitionDelay: `${index * 50}ms`,
                  animation: isVisible ? 'bounceIn 0.4s ease-out' : 'none'
                }}
              >
                <span className="text-lg sm:text-xl transform transition-transform duration-300 group-hover:scale-110">{category.icon}</span>
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </div>

          {/* Estadísticas - Mejorado para móviles */}
          <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { number: obras.length, label: "Proyectos Totales", color: "text-blue-600", bgColor: "bg-blue-50" },
              { number: obras.filter(o => o.status === "Completado").length, label: "Completados", color: "text-green-600", bgColor: "bg-green-50" },
              { number: obras.filter(o => o.status === "En Progreso").length, label: "En Progreso", color: "text-blue-600", bgColor: "bg-blue-50" },
              { number: [...new Set(obras.map(o => o.location))].length, label: "Ciudades", color: "text-purple-600", bgColor: "bg-purple-50" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  animation: isVisible ? 'slideInUp 0.5s ease-out' : 'none'
                }}
              >
                <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.color} mb-1 sm:mb-2 transition-all duration-700`}>
                  {isVisible ? stat.number : 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Obras Grid */}
      <section id="obras-grid" className={`py-8 sm:py-12 lg:py-16 scroll-mt-20 ${isFiltering ? 'filtering' : ''}`} style={{
        background: 'linear-gradient(to bottom, #9cc3e7 0%, #9cc3e7 95%, rgba(156, 195, 231, 0.8) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título dinámico de la categoría seleccionada */}
          <div className={`text-center mb-8 sm:mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {selectedCategory === "todas" 
                ? "Todas Nuestras Obras" 
                : `${categories.find(c => c.id === selectedCategory)?.name}`
              }
            </h2>
            <p className="text-lg text-gray-700">
              {selectedCategory === "todas" 
                ? `Mostrando ${filteredObras.length} proyectos` 
                : `${filteredObras.length} proyecto${filteredObras.length !== 1 ? 's' : ''} encontrado${filteredObras.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          
          {/* Estado de carga */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando obras...</p>
            </div>
          )}

          {/* Estado de error */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={loadObras}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Grid de obras */}
          {!isLoading && !error && (
            <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 transition-all duration-500 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {filteredObras.map((obra, index) => (
                <div
                  key={obra.id}
                  className={`bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 border border-gray-100 ${
                    animateCards
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-20'
                  }`}
                  style={{ 
                    transitionDelay: animateCards ? `${index * 100}ms` : '0ms',
                    transitionProperty: animateCards ? 'opacity, transform' : 'all',
                    transitionDuration: animateCards ? '500ms' : '1ms',
                    transitionTimingFunction: 'ease-out'
                  }}
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={obra.main_image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"}
                      alt={obra.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(obra.status)}`}>
                        {obra.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                      <span className="bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {obra.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 transition-all duration-300 hover:text-blue-600 leading-tight">{obra.title}</h3>
                      <span className="text-xl sm:text-2xl transform transition-transform duration-300 hover:scale-110 hover:rotate-12">{categories.find(c => c.id === obra.category)?.icon}</span>
                    </div>
                    
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">{obra.description}</p>
                    
                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <span className="font-semibold mr-1 sm:mr-2">📍</span>
                        <span className="truncate">{obra.location}</span>
                      </div>
                      {obra.area && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <span className="font-semibold mr-1 sm:mr-2">📐</span>
                          <span>{obra.area}</span>
                        </div>
                      )}
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <span className="font-semibold mr-1 sm:mr-2">👤</span>
                        <span className="truncate">{obra.client_display_name || obra.client_name || 'Sin asignar'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {obra.features.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{backgroundColor: '#bcd6ee', color: '#1e4e78'}}
                        >
                          {feature}
                        </span>
                      ))}
                      {obra.features.length > 2 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{backgroundColor: '#9cc3e7', color: '#1e4e78'}}
                        >
                          +{obra.features.length - 2} más
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => openModal(obra)}
                      className="w-full text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-sm sm:text-base"
                      style={{backgroundColor: '#2e74b4'}}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredObras.length === 0 && (
            <div className={`text-center py-12 sm:py-16 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-4xl sm:text-6xl mb-4">🔍</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{getEmptyCategoryMessage(selectedCategory).title}</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4 mb-6">{getEmptyCategoryMessage(selectedCategory).message}</p>
              
              {selectedCategory !== "todas" && (
                <button
                  onClick={() => handleCategoryChange("todas")}
                  className="inline-flex items-center px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                  style={{backgroundColor: '#2e74b4'}}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Ver todas las obras
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32" style={{
        background: 'linear-gradient(to bottom, #bcd6ee 0%, #bcd6ee 95%, rgba(188, 214, 238, 0.8) 100%)'
      }}>
        <div className={`max-w-4xl mx-auto text-center px-4 transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 px-4">
            Cuéntanos sobre tu proyecto y te ayudaremos a hacerlo realidad
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="/contacto"
              className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-sm sm:text-base"
              style={{backgroundColor: '#1e4e78'}}
            >
              Solicitar cotización
            </a>
            <a
              href="/nosotros"
              className="text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-sm sm:text-base"
              style={{backgroundColor: '#9cc3e7', border: '2px solid #9cc3e7'}}
            >
              Conocer más
            </a>
          </div>
        </div>
      </section>

      {/* Modal de Detalles - Optimizado para móviles */}
      {isModalOpen && selectedObra && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
          {/* Modal para móviles - Pantalla completa */}
          <div className="md:hidden h-full w-full bg-white flex flex-col">
            {/* Header fijo para móviles */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-lg font-bold text-gray-900 truncate">{selectedObra.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(selectedObra.status)}`}>
                    {selectedObra.status}
                  </span>
                  <span className="text-xs text-gray-600">{selectedObra.location} • {selectedObra.year}</span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido scrolleable para móviles */}
            <div className="flex-1 overflow-y-auto">
              {/* Cliente info */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categories.find(c => c.id === selectedObra.category)?.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{selectedObra.client_display_name || selectedObra.client_name || 'Sin asignar'}</span>
                </div>
              </div>

              {/* Galería */}
              <div className="p-4">
                <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 mb-4">
                  {selectedObra.gallery_images?.[currentImageIndex]?.includes('video') || selectedObra.gallery_images?.[currentImageIndex]?.includes('youtube') ? (
                    <iframe
                      src={selectedObra.gallery_images[currentImageIndex]}
                      className="w-full h-full"
                      title="Video de la obra"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={selectedObra.gallery_images?.[currentImageIndex] || selectedObra.main_image}
                      alt={`${selectedObra.title} - Imagen ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {selectedObra.gallery_images && selectedObra.gallery_images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedObra.gallery_images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Miniaturas - Carrusel horizontal */}
                {selectedObra.gallery_images && selectedObra.gallery_images.length > 1 && (
                  <div className="relative mb-6">
                    <div ref={mobileThumbnailsRef} className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {selectedObra.gallery_images.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                            currentImageIndex === index ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                          }`}
                        >
                          <img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    
                    {/* Botones de navegación para miniaturas */}
                    <button
                      onClick={prevThumbnail}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextThumbnail}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Información */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedObra.detaileddescription || selectedObra.description}</p>
                  </div>

                  {selectedObra.specifications && selectedObra.specifications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Especificaciones</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {selectedObra.specifications.map((spec, index) => (
                          <div key={index} className="py-2 border-b border-gray-200 last:border-b-0">
                            <span className="font-semibold text-gray-900">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedObra.features.map((feature: string, index: number) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-sm font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <a
                      href="/contacto"
                      className="w-full text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                      style={{backgroundColor: '#1e4e78'}}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Solicitar información
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

                            {/* Modal para tablets y desktop */}
                  <div className="hidden md:flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[85vh] shadow-2xl animate-fade-in-scale flex flex-col overflow-hidden">
              {/* Header para desktop - Compacto */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-gray-900 truncate">{selectedObra.title}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(selectedObra.status)}`}>
                      {selectedObra.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{selectedObra.location}</span>
                    <span>•</span>
                    <span>{selectedObra.year}</span>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categories.find(c => c.id === selectedObra.category)?.icon}</span>
                      <span className="font-medium">{selectedObra.client_display_name || selectedObra.client_name || 'Sin asignar'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenido para desktop - Layout compacto */}
              <div className="flex-1 flex overflow-hidden">
                {/* Galería desktop - Proporción 16:9 */}
                <div className="w-3/5 p-5 flex flex-col">
                  {/* Imagen principal con aspect ratio 16:9 */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                    {selectedObra.gallery_images?.[currentImageIndex]?.includes('video') || selectedObra.gallery_images?.[currentImageIndex]?.includes('youtube') ? (
                      <iframe
                        src={selectedObra.gallery_images[currentImageIndex]}
                        className="w-full h-full"
                        title="Video de la obra"
                        allowFullScreen
                      />
                    ) : (
                      <img
                        src={selectedObra.gallery_images?.[currentImageIndex] || selectedObra.main_image}
                        alt={`${selectedObra.title} - Imagen ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {selectedObra.gallery_images && selectedObra.gallery_images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                          {currentImageIndex + 1} / {selectedObra.gallery_images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Miniaturas - Carrusel horizontal */}
                  {selectedObra.gallery_images && selectedObra.gallery_images.length > 1 && (
                    <div className="relative mb-3">
                      <div ref={desktopThumbnailsRef} className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {selectedObra.gallery_images.map((image: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                              currentImageIndex === index ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      
                      {/* Botones de navegación para miniaturas */}
                      <button
                        onClick={prevThumbnail}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-lg z-10"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextThumbnail}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-lg z-10"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                  {/* Descripción integrada debajo de las imágenes */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descripción
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{selectedObra.detaileddescription || selectedObra.description}</p>
                  </div>
                </div>

                {/* Panel lateral: Especificaciones y características */}
                <div className="w-2/5 bg-gray-50 border-l border-gray-200 overflow-y-auto p-5 space-y-4">
                  {/* Especificaciones */}
                  {selectedObra.specifications && selectedObra.specifications.length > 0 && (
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m5-9h4a2 2 0 012 2v6a2 2 0 01-2 2h-4m-5-9v12" />
                        </svg>
                        Especificaciones
                      </h3>
                      <div className="bg-white rounded-lg p-3 space-y-2 border border-gray-100 shadow-sm">
                        {selectedObra.specifications.map((spec, index) => (
                          <div key={index} className="py-1.5 border-b border-gray-50 last:border-b-0">
                            <span className="font-semibold text-gray-900 text-xs">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Características */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Características
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedObra.features.map((feature: string, index: number) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-100">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botón de contacto */}
                  <div className="pt-3 border-t border-gray-200">
                    <a
                      href="/contacto"
                      className="w-full text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                      style={{backgroundColor: '#1e4e78'}}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Solicitar información
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>


  );
} 