"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RouteGuard from "../components/RouteGuard";

// Interfaz para proyectos del cliente
interface ClientProject {
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
  documents?: {
    [key: string]: {
      title: string;
      url: string;
      description: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("photos");
  const [isLoading, setIsLoading] = useState(true);
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);


  // Función para cargar proyectos del cliente
  const loadClientProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No se encontró token");
      return;
    }

    try {
      // Extraer client_id del token
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const clientId = payload.client_id;

      if (!clientId) {
        console.error("No se encontró client_id en el token");
        setIsLoadingProjects(false);
        return;
      }

      setIsLoadingProjects(true);
      const response = await fetch(`https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/get_projects?client_id=${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setClientProjects(result.data);
          // Seleccionar el primer proyecto por defecto
          if (result.data.length > 0) {
            setSelectedProject(result.data[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar proyectos del cliente:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Verificar token al cargar la página
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    if (!token) {
      router.push("/login");
    } else if (userRole !== "cliente") {
      // Si no es cliente, redirigir según su rol
      if (userRole === "admin") {
        router.push("/panel");
      } else {
        router.push("/login");
      }
    } else {
      setIsLoading(false);
      loadClientProjects();
    }
  }, [router]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

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

  // Función para calcular el progreso basado en el estado
  const getProgressFromStatus = (status: string) => {
    const progressMap: { [key: string]: number } = {
      'Planificado': 10,
      'En Progreso': 50,
      'Completado': 100,
      'Pausado': 30
    };
    return progressMap[status] || 0;
  };

  // Función para obtener el ícono del documento
  const getDocumentIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'contract': '📄',
      'plans': '📋',
      'budget': '📊',
      'general': '📄',
      'technical': '🔧',
      'legal': '⚖️',
      'financial': '💰'
    };
    return icons[type] || '📄';
  };

  // Función para obtener el color del documento
  const getDocumentColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'contract': 'bg-red-100 text-red-800',
      'plans': 'bg-blue-100 text-blue-800',
      'budget': 'bg-green-100 text-green-800',
      'general': 'bg-gray-100 text-gray-800',
      'technical': 'bg-purple-100 text-purple-800',
      'legal': 'bg-orange-100 text-orange-800',
      'financial': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };


  // Mostrar loading mientras se verifica el token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard allowedRoles={["cliente"]}>
      <div className="min-h-screen bg-gray-50 pt-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con botón de logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Selector de proyecto */}
        {clientProjects.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Proyecto
            </label>
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const project = clientProjects.find(p => p.id === parseInt(e.target.value));
                setSelectedProject(project || null);
              }}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {clientProjects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title} - {project.year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Project Overview */}
        {isLoadingProjects ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Cargando proyectos...</span>
            </div>
          </div>
        ) : selectedProject ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getCategoryIcon(selectedProject.category)}</span>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProject.status === "En Progreso" ? "bg-blue-100 text-blue-800" :
                    selectedProject.status === "Completado" ? "bg-green-100 text-green-800" :
                    selectedProject.status === "Planificado" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {selectedProject.status}
                  </span>
                  <span>Año: {selectedProject.year}</span>
                  <span>📍 {selectedProject.location}</span>
                </div>
                {selectedProject.description && (
                  <p className="text-gray-600 mt-2">{selectedProject.description}</p>
                )}
              </div>
              <div className="mt-4 lg:mt-0">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Progreso General</p>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${getProgressFromStatus(selectedProject.status)}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{getProgressFromStatus(selectedProject.status)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay proyectos</h3>
              <p className="text-gray-600">No se encontraron proyectos asignados a tu cuenta.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: "photos", name: "Fotos", icon: "📸" },
                { id: "documents", name: "Documentos", icon: "📄" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">

            {/* Photos Tab */}
            {activeTab === "photos" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Fotos del proyecto</h3>
                </div>
                
                {selectedProject ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Imagen principal */}
                    {selectedProject.main_image && (
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={selectedProject.main_image}
                          alt="Imagen principal"
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-1">Imagen Principal</h4>
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Principal
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Galería de imágenes */}
                    {selectedProject.gallery_images && selectedProject.gallery_images.length > 0 ? (
                      selectedProject.gallery_images.map((image, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 mb-1">Imagen {index + 1}</h4>
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Galería
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <div className="text-4xl mb-4">📸</div>
                        <p className="text-gray-600">No hay imágenes adicionales en la galería</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📸</div>
                    <p className="text-gray-600">Selecciona un proyecto para ver las fotos</p>
                  </div>
                )}
              </div>
            )}


            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Documentos del proyecto</h3>
                </div>
                
                {selectedProject ? (
                  <div className="space-y-4">
                    {selectedProject.documents && Object.keys(selectedProject.documents).length > 0 ? (
                      Object.entries(selectedProject.documents).map(([key, document]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${getDocumentColor(key)}`}>
                              <span className={`text-lg ${getDocumentColor(key).includes('red') ? 'text-red-600' : 
                                getDocumentColor(key).includes('blue') ? 'text-blue-600' :
                                getDocumentColor(key).includes('green') ? 'text-green-600' :
                                getDocumentColor(key).includes('purple') ? 'text-purple-600' :
                                getDocumentColor(key).includes('orange') ? 'text-orange-600' :
                                getDocumentColor(key).includes('yellow') ? 'text-yellow-600' :
                                'text-gray-600'}`}>
                                {getDocumentIcon(key)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{document.title}</h4>
                              <p className="text-sm text-gray-600">{document.description}</p>
                            </div>
                          </div>
                          <a
                            href={document.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                          >
                            Descargar
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">📄</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay documentos</h3>
                        <p className="text-gray-600">No se encontraron documentos para este proyecto.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-gray-600">Selecciona un proyecto para ver los documentos</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </RouteGuard>
  );
} 