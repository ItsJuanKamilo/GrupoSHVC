"use client";
import { useState, useEffect } from "react";
import RouteGuard from "../components/RouteGuard";
import Swal from 'sweetalert2';
import FileUpload from "../components/FileUpload";

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

interface WaitingRequest {
  id: number;
  rut: string;
  dv: string;
  name: string;
  name_1?: string;
  surname: string;
  surname_1: string;
  phone: string;
  email: string;
  company?: string;
  website?: string;
  description?: string;
  status: string;
  admin_comment?: string;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: number;
  user_id: number;
  rut: string;
  dv: string;
  name: string;
  name_1?: string;
  surname: string;
  surname_1: string;
  phone: string;
  email: string;
  company?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateClientData {
  rut: string;
  dv: string;
  name: string;
  name_1?: string;
  surname: string;
  surname_1: string;
  phone: string;
  email: string;
  company?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  password: string;
}

interface Project {
  id: number;
  title: string;
  client_id: number;
  category: string;
  description: string;
  year: string;
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
  documents?: { [key: string]: { title: string; url: string; description: string; }; };
    // Información del cliente (para mostrar)
    client_name?: string;
    client_surname?: string;
    client_company?: string;
    client_email?: string;
    client_logo?: string;
    client_display_name?: string;
}

interface CreateProjectData {
  title: string;
  client_id: number;
  category: string;
  description: string;
  year: string;
  location: string;
  status: string;
  main_image: string;
  gallery_images: string[];
  features: string[];
  specifications: string[];
  is_featured: boolean;
  is_visible_web: boolean;
}

export default function Panel() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("inicio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [waitingRequests, setWaitingRequests] = useState<WaitingRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showInactiveClients, setShowInactiveClients] = useState(false);
  const [selectedLogoUrl, setSelectedLogoUrl] = useState<string>('');
  const [editingLogoUrl, setEditingLogoUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [rutValue, setRutValue] = useState('');
  const [rutError, setRutError] = useState('');
  
  // Estados para gestión de proyectos
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showInactiveProjects, setShowInactiveProjects] = useState(false);
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<File[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSpecifications, setSelectedSpecifications] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState<string>('');
  const [newSpecification, setNewSpecification] = useState<string>('');
  
  // Estados para gestión de imágenes en edición
  const [currentMainImage, setCurrentMainImage] = useState<string>('');
  const [currentGalleryImages, setCurrentGalleryImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImagesToUpload, setNewImagesToUpload] = useState<File[]>([]);
  
  // Estados para gestión de documentos
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedProjectForDocument, setSelectedProjectForDocument] = useState<Project | null>(null);
  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [documentDescription, setDocumentDescription] = useState<string>('');

  // Estilos CSS para eliminar outlines de botones
  const buttonStyles = `
    button:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    button:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }
  `;

  useEffect(() => {
    // Solo manejar la animación de entrada
    const timeoutId = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeoutId);
  }, []);

  // Bloquear scroll del body cuando cualquier modal esté abierto
  useEffect(() => {
    const hasModalOpen = showCreateModal || showEditModal || showCreateProjectModal || showEditProjectModal || showDocumentModal;
    if (hasModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCreateModal, showEditModal, showCreateProjectModal, showEditProjectModal, showDocumentModal]);

  // Cargar solicitudes pendientes cuando se selecciona el menú
  useEffect(() => {
    if (selectedMenu === "solicitudes") {
      loadWaitingRequests();
    }
  }, [selectedMenu]);

  // Cargar clientes cuando se selecciona el menú
  useEffect(() => {
    if (selectedMenu === "clientes") {
      loadClients();
    }
  }, [selectedMenu]);

  // Cargar proyectos cuando se selecciona el menú
  useEffect(() => {
    if (selectedMenu === "obras") {
      loadProjects();
    }
  }, [selectedMenu]);

  const loadWaitingRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await fetch('https://47eh80tfbg.execute-api.us-east-1.amazonaws.com/get_waiting', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setWaitingRequests(result.waitingRequests || []);
      } else {
        console.error('Error al cargar solicitudes');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const loadClients = async () => {
    setIsLoadingClients(true);
    try {
      const response = await fetch('https://60w42l85z2.execute-api.us-east-1.amazonaws.com/get_clients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

              if (response.ok) {
          const result = await response.json();
          setClients(result.clients || []);
        } else {
        console.error('Error al cargar clientes');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleCreateClient = async (clientData: CreateClientData) => {
    setIsCreatingClient(true);

    try {
      const response = await fetch('https://60w42l85z2.execute-api.us-east-1.amazonaws.com/create_client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Cerrar modal y limpiar formulario
        setShowCreateModal(false);
        setSelectedLogoUrl('');
        setSelectedFile(null);
        setRutValue('');
        setRutError('');
        
        // Mostrar éxito
        Swal.fire({
          title: '¡Cliente creado!',
          text: result.message,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          timerProgressBar: true
        });
        
        // Recargar lista de clientes
        loadClients();
      } else {
        const errorData = await response.json();
        
        // Mostrar error (modal permanece abierto)
        Swal.fire({
          title: 'Error',
          text: errorData.message || 'Error al crear cliente',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Mostrar error (modal permanece abierto)
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado al crear el cliente',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsCreatingClient(false);
    }
  };

  // Funciones para formateo de RUT
  const formatRUT = (rut: string): string => {
    // Remover todo lo que no sea número o K
    const cleanRUT = rut.replace(/[^0-9kK]/g, '');
    
    // Limitar longitud máxima (8 dígitos + 1 DV = 9 caracteres)
    if (cleanRUT.length > 9) {
      return rutValue; // No permitir más caracteres
    }
    
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

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRUT(e.target.value);
    setRutValue(formatted);
    
    // Validar RUT solo si tiene al menos 2 caracteres
    if (formatted.length >= 2) {
      const isValid = validateRUT(formatted);
      setRutError(isValid ? '' : 'RUT inválido');
    } else {
      setRutError('');
    }
  };

  // Función para validar RUT chileno
  const validateRUT = (rut: string): boolean => {
    const cleanedRUT = rut.replace(/[^0-9kK]/g, '');
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

  const handleUpdateClient = async (clientData: Partial<Client> & { id: number }) => {
    // Mostrar loading
    Swal.fire({
      title: 'Actualizando cliente...',
      text: 'Por favor espera mientras se procesan los cambios',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      
      const response = await fetch('https://60w42l85z2.execute-api.us-east-1.amazonaws.com/update_client', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Cerrar loading y mostrar éxito
        Swal.fire({
          title: '¡Cliente actualizado!',
          text: result.message,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          timerProgressBar: true
        });
        loadClients();
      } else {
        const errorData = await response.json();
        
        // Cerrar loading y mostrar error
        Swal.fire({
          title: 'Error',
          text: errorData.message || 'Error al actualizar cliente',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Cerrar loading y mostrar error
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado al actualizar el cliente',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  // Función para desactivar cliente usando el endpoint deactivate_client con método PUT
  const handleDeactivateClient = async (id: number) => {
    
    const result = await Swal.fire({
      title: '¿Desactivar cliente?',
      text: 'El cliente no podrá acceder al sistema pero sus datos se mantendrán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Mostrar loading
      Swal.fire({
        title: 'Desactivando cliente...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await fetch('https://60w42l85z2.execute-api.us-east-1.amazonaws.com/desactivate_client', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ client_id: id }),
        });

        if (response.ok) {
          const result = await response.json();
          
          // Cerrar loading y mostrar éxito
          Swal.fire({
            title: '¡Cliente desactivado!',
            text: result.message,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            timer: 2000,
            timerProgressBar: true
          });
          loadClients();
        } else {
          const errorData = await response.json();
          
          // Cerrar loading y mostrar error
          Swal.fire({
            title: 'Error',
            text: errorData.message || 'Error al desactivar cliente',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        }
      } catch (error) {
        // Cerrar loading y mostrar error
        Swal.fire({
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  // Funciones para gestión de proyectos
  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
        const response = await fetch('https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/get_projects?show_inactive=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setProjects(result.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCreateProject = async (projectData: CreateProjectData) => {
    // Mostrar loading
    Swal.fire({
      title: 'Creando proyecto...',
      text: 'Por favor espera mientras se procesan las imágenes y se crea el proyecto',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // 1. Crear proyecto primero (sin imágenes)
      const createResponse = await fetch('https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/create_project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Error al crear proyecto');
      }

      const createResult = await createResponse.json();
      const newProjectId = createResult.data.id;

      // 2. Subir imágenes usando el ID del proyecto
      let newMainImageUrl = null;
      const newGalleryUrls: string[] = [];

      // Subir imagen principal si existe
      if (selectedMainImage) {
        try {
          newMainImageUrl = await uploadProjectFileToS3(selectedMainImage, newProjectId, true);
        } catch (error) {
          console.error('Error al subir imagen principal:', error);
          // Continuar sin imagen principal
        }
      }

      // Subir imágenes de galería
      for (const file of selectedGalleryImages) {
        try {
          const uploadedUrl = await uploadProjectFileToS3(file, newProjectId, false);
          newGalleryUrls.push(uploadedUrl);
        } catch (error) {
          console.error('Error al subir imagen de galería:', file.name, error);
          // Continuar con las demás imágenes
        }
      }

      // 3. Actualizar proyecto con las URLs de las imágenes (solo si se subieron imágenes)
      if (newMainImageUrl || newGalleryUrls.length > 0) {
        const updateResponse = await fetch('https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/update_project', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: newProjectId,
            main_image: newMainImageUrl,
            gallery_images: newGalleryUrls
          }),
        });

        if (!updateResponse.ok) {
          console.warn('Error al actualizar proyecto con imágenes, pero el proyecto fue creado');
        }
      }
      
      // Cerrar loading y mostrar éxito
      Swal.fire({
        title: '¡Proyecto creado!',
        text: 'El proyecto se ha creado exitosamente',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        timer: 2000,
        timerProgressBar: true
      });
      
      // Limpiar estados
      setSelectedMainImage(null);
      setSelectedGalleryImages([]);
      
      loadProjects();
    } catch (error) {
      console.error('Error:', error);
      
      // Cerrar loading y mostrar error
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado al crear el proyecto',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleUpdateProject = async (projectData: Partial<Project> & { id: number }) => {
    // Mostrar loading
    Swal.fire({
      title: 'Actualizando proyecto...',
      text: 'Por favor espera mientras se procesan las imágenes y se actualiza el proyecto',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // 1. Eliminar imágenes marcadas para eliminación
      if (imagesToDelete.length > 0) {
        for (const imageUrl of imagesToDelete) {
          try {
            await deleteImageFromS3(imageUrl);
          } catch (error) {
            console.error('Error al eliminar imagen:', imageUrl, error);
            // Continuar con las demás imágenes
          }
        }
      }

      // 2. Subir nuevas imágenes
      let newMainImageUrl = currentMainImage;
      const newGalleryUrls: string[] = [...currentGalleryImages];

      // Subir nuevas imágenes si existen
      if (selectedMainImage || selectedGalleryImages.length > 0) {
        const projectTitle = projectData.title || editingProject?.title || 'proyecto';
        
        // Primero subir imagen principal si existe
        if (selectedMainImage) {
          try {
            const uploadedUrl = await uploadProjectFileToS3(selectedMainImage, projectData.id, true);
            newMainImageUrl = uploadedUrl;
          } catch (error) {
            console.error('Error al subir imagen principal:', error);
          }
        }
        
        // Luego subir imágenes de galería
        for (const file of selectedGalleryImages) {
          try {
            const uploadedUrl = await uploadProjectFileToS3(file, projectData.id, false);
            newGalleryUrls.push(uploadedUrl);
          } catch (error) {
            console.error('Error al subir imagen de galería:', file.name, error);
            // Continuar con las demás imágenes
          }
        }
      }

      // 3. Actualizar el proyecto con las nuevas URLs
      const updatedProjectData = {
        ...projectData,
        main_image: newMainImageUrl,
        gallery_images: newGalleryUrls
      };

      const response = await fetch('https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/update_project', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProjectData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Cerrar loading y mostrar éxito
        Swal.fire({
          title: '¡Proyecto actualizado!',
          text: result.message,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          timerProgressBar: true
        });
        
        // Limpiar estados
        setImagesToDelete([]);
        setNewImagesToUpload([]);
        
        loadProjects();
      } else {
        const errorData = await response.json();
        
        // Cerrar loading y mostrar error
        Swal.fire({
          title: 'Error',
          text: errorData.message || 'Error al actualizar proyecto',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Cerrar loading y mostrar error
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado al actualizar el proyecto',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleDeactivateProject = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Desactivar proyecto?',
      text: 'El proyecto no se mostrará en la web pero se mantendrá en el sistema.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Mostrar loading
      Swal.fire({
        title: 'Desactivando proyecto...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await fetch('https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/desactivate_project', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });

        if (response.ok) {
          const result = await response.json();
          
          // Cerrar loading y mostrar éxito
          Swal.fire({
            title: '¡Proyecto desactivado!',
            text: result.message,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            timer: 2000,
            timerProgressBar: true
          });
          loadProjects();
        } else {
          const errorData = await response.json();
          
          // Cerrar loading y mostrar error
          Swal.fire({
            title: 'Error',
            text: errorData.message || 'Error al desactivar proyecto',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        }
      } catch (error) {
        // Cerrar loading y mostrar error
        Swal.fire({
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  const handleActivateProject = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Activar proyecto?',
      text: 'El proyecto se mostrará nuevamente en la web.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Mostrar loading
      Swal.fire({
        title: 'Activando proyecto...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await fetch('https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/activate_project', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });

        if (response.ok) {
          const result = await response.json();
          
          // Cerrar loading y mostrar éxito
          Swal.fire({
            title: '¡Proyecto activado!',
            text: result.message,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            timer: 2000,
            timerProgressBar: true
          });
          loadProjects();
        } else {
          const errorData = await response.json();
          
          // Cerrar loading y mostrar error
          Swal.fire({
            title: 'Error',
            text: errorData.message || 'Error al activar proyecto',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        }
      } catch (error) {
        // Cerrar loading y mostrar error
        Swal.fire({
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  // Función para subir documento a S3
  const uploadDocumentToS3 = async (file: File, projectId: number, documentType: string) => {
    try {
      const response = await fetch('https://8qw7aj41d3.execute-api.us-east-1.amazonaws.com/get_document_upload_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          obraId: projectId.toString(),
          documentType: documentType,
          metadata: {
            projectId: projectId,
            documentType: documentType
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener URL de subida');
      }

      const { uploadUrl, key } = await response.json();

      // Subir archivo a S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Error al subir archivo');
      }

      return key;
    } catch (error) {
      console.error('Error al subir documento:', error);
      throw error;
    }
  };

  // Función para agregar documento a proyecto
  const handleAddDocument = async () => {
    if (!selectedProjectForDocument || !selectedDocumentFile || !documentType || !documentTitle) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos obligatorios',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Mostrar loading
    Swal.fire({
      title: 'Subiendo documento...',
      text: 'Por favor espera mientras se sube el archivo',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Subir documento a S3
      const documentKey = await uploadDocumentToS3(
        selectedDocumentFile,
        selectedProjectForDocument.id,
        documentType
      );

      // Construir URL del documento
      const documentUrl = `https://gruposhvc.s3.amazonaws.com/${documentKey}`;

      // Obtener documentos actuales del proyecto
      const currentDocuments = selectedProjectForDocument.documents || {};
      
      // Agregar nuevo documento
      const updatedDocuments = {
        ...currentDocuments,
        [documentType]: {
          title: documentTitle,
          url: documentUrl,
          description: documentDescription || ''
        }
      };

      // Actualizar proyecto en la base de datos
      const response = await fetch('https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/update_project', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedProjectForDocument.id,
          documents: updatedDocuments
        }),
      });

      if (response.ok) {
        // Cerrar loading y mostrar éxito
        Swal.fire({
          title: '¡Documento agregado!',
          text: 'El documento se ha subido exitosamente',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          timerProgressBar: true
        });

        // Cerrar modal y limpiar estados
        setShowDocumentModal(false);
        setSelectedProjectForDocument(null);
        setSelectedDocumentFile(null);
        setDocumentType('');
        setDocumentTitle('');
        setDocumentDescription('');

        // Recargar proyectos
        loadProjects();
      } else {
        const errorData = await response.json();
        
        // Cerrar loading y mostrar error
        Swal.fire({
          title: 'Error',
          text: errorData.message || 'Error al agregar documento',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      // Cerrar loading y mostrar error
      Swal.fire({
        title: 'Error de conexión',
        text: 'No se pudo subir el documento',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  // Función para eliminar documento
  const handleDeleteDocument = async (projectId: number, documentType: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar documento?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const project = projects.find(p => p.id === projectId);
        if (!project || !project.documents) return;

        // Obtener la URL del documento antes de eliminarlo
        const documentToDelete = project.documents[documentType];
        if (!documentToDelete) return;

        // Obtener la URL del documento
        const documentUrl = documentToDelete.url;
        

        // Eliminar archivo de S3
        try {
          await deleteImageFromS3(documentUrl);
        } catch (s3Error) {
          console.error('Error al eliminar documento de S3:', s3Error);
          // Continuar con la eliminación de la BD aunque falle S3
        }

        // Actualizar base de datos
        const updatedDocuments = { ...project.documents };
        delete updatedDocuments[documentType];

        const response = await fetch('https://aiz9w4y8mb.execute-api.us-east-1.amazonaws.com/update_project', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: projectId,
            documents: updatedDocuments
          }),
        });

        if (response.ok) {
          // Actualizar el estado local del proyecto para reflejar el cambio inmediatamente
          if (selectedProjectForDocument) {
            const updatedProject = {
              ...selectedProjectForDocument,
              documents: updatedDocuments
            };
            setSelectedProjectForDocument(updatedProject);
          }

          // Actualizar también la lista de proyectos
          setProjects(prevProjects => 
            prevProjects.map(p => 
              p.id === projectId 
                ? { ...p, documents: updatedDocuments }
                : p
            )
          );

          Swal.fire({
            title: '¡Documento eliminado!',
            text: 'El documento se ha eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            timer: 2000,
            timerProgressBar: true
          });
        } else {
          const errorData = await response.json();
          Swal.fire({
            title: 'Error',
            text: errorData.message || 'Error al eliminar documento',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error de conexión',
          text: 'No se pudo eliminar el documento',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  // Función para subir archivo a S3 (logos)
  const uploadFileToS3 = async (file: File): Promise<string> => {
    try {
      console.log('Iniciando subida de archivo:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // 1. Obtener URL de subida del Lambda
      const response = await fetch('https://8qw7aj41d3.execute-api.us-east-1.amazonaws.com/get_upload_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          category: 'logos'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al obtener URL de subida:', response.status, errorText);
        throw new Error(`Error al obtener URL de subida: ${response.status}`);
      }

      const { uploadUrl, key, bucketName } = await response.json();
      console.log('URL de subida obtenida:', { uploadUrl, key, bucketName });

      // 2. Subir archivo directamente a S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Error al subir archivo a S3:', uploadResponse.status, errorText);
        throw new Error(`Error al subir archivo a S3: ${uploadResponse.status}`);
      }

      // 3. Construir URL final del archivo
      const finalUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
      console.log('Archivo subido exitosamente:', finalUrl);
      
      return finalUrl;
    } catch (error) {
      console.error('Error al subir archivo:', error);
      throw error;
    }
  };

  // Función para subir archivo de proyecto a S3
  const uploadProjectFileToS3 = async (file: File, projectId: number, isMainImage: boolean = false): Promise<string> => {
    try {

      // Redimensionar imagen antes de subir
      let processedFile = file;
      try {
        processedFile = await resizeImage(file, 1920, 1080, '#FFFFFF');
      } catch (resizeError) {
        console.warn('Error al redimensionar imagen, usando original:', resizeError);
        // Continuar con el archivo original si falla el redimensionamiento
      }
      
      // Usar ID del proyecto como identificador de carpeta (siempre consistente)
      const projectFolderId = projectId.toString();
      
      // Determinar el tipo de archivo
      const fileType = isMainImage ? 'main' : 'gallery';
      const timestamp = Date.now();
      const fileName = `${fileType}_${timestamp}_${processedFile.name}`;
      
      
      // 1. Obtener URL de subida del Lambda (endpoint específico para obras)
      const response = await fetch('https://8qw7aj41d3.execute-api.us-east-1.amazonaws.com/get_obra_upload_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: fileName,
          fileType: processedFile.type,
          fileSize: processedFile.size,
          obraId: projectFolderId,  // Usar ID del proyecto como obraId (consistente)
          metadata: {
            isMainImage: isMainImage,
            projectId: projectId
          }
        }),
      });

      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al obtener URL de subida: ${response.status} - ${errorText}`);
      }

      const { uploadUrl, key, bucketName } = await response.json();

      // 2. Subir archivo directamente a S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: processedFile,
        headers: {
          'Content-Type': processedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Error al subir archivo a S3:', uploadResponse.status, errorText);
        throw new Error(`Error al subir archivo a S3: ${uploadResponse.status}`);
      }

      // 3. Construir URL final del archivo
      const finalUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
      console.log('Archivo subido exitosamente:', finalUrl);
      
      return finalUrl;

    } catch (error) {
      console.error('Error al subir archivo:', error);
      throw error;
    }
  };

  // Función para eliminar imagen de S3
  const deleteImageFromS3 = async (imageUrl: string): Promise<void> => {
    try {
      
      // Extraer la key de S3 de la URL
      const url = new URL(imageUrl);
      const key = url.pathname.substring(1); // Remover el primer slash
      
      const response = await fetch('https://8qw7aj41d3.execute-api.us-east-1.amazonaws.com/delete_file', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: key }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al eliminar archivo: ${response.status} - ${errorText}`);
      }

    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  };

  // Función para eliminar imagen de la galería actual
  const handleDeleteCurrentImage = async (imageUrl: string, isMainImage: boolean = false) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar imagen?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        // Agregar a la lista de imágenes a eliminar
        setImagesToDelete(prev => [...prev, imageUrl]);
        
        // Actualizar el estado local inmediatamente
        if (isMainImage) {
          setCurrentMainImage('');
        } else {
          setCurrentGalleryImages(prev => prev.filter(img => img !== imageUrl));
        }

        Swal.fire({
          title: 'Eliminada',
          text: 'La imagen será eliminada al guardar los cambios',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      Swal.fire('Error', 'No se pudo eliminar la imagen', 'error');
    }
  };

  // Función para seleccionar nuevas imágenes para la galería
  const handleSelectNewGalleryImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedGalleryImages(prev => [...prev, ...files]); // Agregar a selectedGalleryImages, no a newImagesToUpload
      Swal.fire({
        title: 'Imágenes seleccionadas',
        text: `${files.length} imagen(es) se subirán al guardar`,
        icon: 'info',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  // Función para seleccionar nueva imagen principal
  const handleSelectNewMainImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMainImage(file); // Agregar a selectedMainImage, no a newImagesToUpload
      setCurrentMainImage(''); // Limpiar la actual
      Swal.fire({
        title: 'Imagen seleccionada',
        text: 'La nueva imagen principal se subirá al guardar',
        icon: 'info',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  // Función para redimensionar imagen manteniendo proporción
  const resizeImage = async (file: File, targetWidth: number = 1920, targetHeight: number = 1080, fillColor: string = '#FFFFFF'): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('No se pudo obtener contexto del canvas'));
        return;
      }

      img.onload = () => {
        // Calcular dimensiones manteniendo proporción (letterboxing - sin recortar)
        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

        if (imgAspect > targetAspect) {
          // Imagen más ancha que el target - ajustar por ancho para que quepa completo
          drawWidth = targetWidth;
          drawHeight = targetWidth / imgAspect;
          offsetY = (targetHeight - drawHeight) / 2;
        } else {
          // Imagen más alta que el target - ajustar por altura para que quepa completo
          drawHeight = targetHeight;
          drawWidth = targetHeight * imgAspect;
          offsetX = (targetWidth - drawWidth) / 2;
        }

        // Configurar canvas al tamaño objetivo
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Rellenar fondo con color blanco
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Dibujar imagen completa centrada (sin recortar)
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Convertir a blob y luego a File
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Error al procesar la imagen'));
            return;
          }

          // Crear nuevo archivo con el nombre original
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });


          resolve(resizedFile);
        }, 'image/jpeg', 0.9); // Calidad 90%
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleRequestAction = async (id: number, action: 'approve' | 'reject', comment: string) => {
    // Mostrar loading
    const actionText = action === 'approve' ? 'Aprobando' : 'Rechazando';
    Swal.fire({
      title: `${actionText} solicitud...`,
      text: 'Por favor espera mientras se procesa la solicitud',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch('https://47eh80tfbg.execute-api.us-east-1.amazonaws.com/approve_waiting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action,
          adminComment: comment
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Cerrar loading y mostrar éxito
        Swal.fire({
          title: 'Solicitud procesada',
          text: result.message,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          timerProgressBar: true
        });
        // Recargar las solicitudes
        loadWaitingRequests();
      } else {
        console.error('Error al actualizar solicitud');
        const errorData = await response.json();
        
        // Cerrar loading y mostrar error
        Swal.fire({
          title: 'Error',
          text: errorData.message || 'Error al procesar solicitud',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Cerrar loading y mostrar error
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado al procesar la solicitud',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const menuItems: MenuItem[] = [
    { id: "inicio", name: "Inicio", icon: "🏠", active: true },
    { id: "obras", name: "Gestionar Obras", icon: "🏗️", active: false },
    { id: "clientes", name: "Gestionar Clientes", icon: "👥", active: false },
    { id: "solicitudes", name: "Solicitudes Pendientes", icon: "⏳", active: false },
  ];

  // Opciones predefinidas para proyectos
  const projectCategories = [
    { value: 'residencial', label: 'Residencial', icon: '🏠' },
    { value: 'comercial', label: 'Comercial', icon: '🏢' },
    { value: 'industrial', label: 'Industrial', icon: '🏭' },
    { value: 'aseo-industrial', label: 'Aseo Industrial', icon: '🧹' },
    { value: 'infraestructura', label: 'Infraestructura', icon: '🌉' },
    { value: 'renovacion', label: 'Renovación', icon: '🔨' }
  ];

  const projectStatuses = [
    { value: 'Planificado', label: 'Planificado' },
    { value: 'En Progreso', label: 'En Progreso' },
    { value: 'Completado', label: 'Completado' },
    { value: 'Cancelado', label: 'Cancelado' }
  ];


  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId);
    // Actualizar estado activo de los menús
    menuItems.forEach(item => {
      item.active = item.id === menuId;
    });
    // Cerrar sidebar en móviles después de hacer clic
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "inicio":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bienvenido al Panel de Control</h2>
              <p className="text-gray-600 mb-6">
                Gestiona obras, clientes y administra el contenido de la plataforma desde este panel centralizado.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Estadísticas</h3>
                  <p className="text-gray-600 text-sm">Vista general del sistema</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Acciones Rápidas</h3>
                  <p className="text-gray-600 text-sm">Funciones más utilizadas</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                  <div className="text-3xl mb-3">🔔</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notificaciones</h3>
                  <p className="text-gray-600 text-sm">Alertas del sistema</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "obras":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestionar Proyectos</h2>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Activos: {projects.filter(p => p.is_active).length}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Inactivos: {projects.filter(p => !p.is_active).length}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Destacados: {projects.filter(p => p.is_featured).length}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={loadProjects}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium cursor-pointer focus:outline-none"
                  >
                    🔄 Actualizar
                  </button>
                  <button 
                    onClick={() => setShowInactiveProjects(!showInactiveProjects)}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-colors duration-200 font-medium cursor-pointer focus:outline-none ${
                      showInactiveProjects 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    {showInactiveProjects ? '👁️ Ver Activos' : '👻 Ver Inactivos'}
                  </button>
                  <button 
                    onClick={async () => {
                      setShowCreateProjectModal(true);
                      // Cargar clientes directamente desde la API
                      try {
                        const response = await fetch('https://60w42l85z2.execute-api.us-east-1.amazonaws.com/get_clients', {
                          method: 'GET',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });
                        if (response.ok) {
                          const result = await response.json();
                          setClients(result.clients || []);
                        }
                      } catch (error) {
                        console.error('Error al cargar clientes:', error);
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium cursor-pointer focus:outline-none"
                  >
                    + Nuevo Proyecto
                  </button>
                </div>
              </div>
              
              {isLoadingProjects ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : projects.filter(project => showInactiveProjects ? !project.is_active : project.is_active).length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600 text-center py-8">
                    {showInactiveProjects ? 'No hay proyectos inactivos.' : 'No hay proyectos activos.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects
                    .filter(project => showInactiveProjects ? !project.is_active : project.is_active)
                    .map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {project.main_image ? (
                              <img 
                                src={project.main_image} 
                                alt={project.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-lg">
                                🏗️
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  project.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {project.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  project.is_featured 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {project.is_featured ? 'Destacado' : 'Normal'}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  project.is_visible_web 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {project.is_visible_web ? 'Visible Web' : 'Oculto Web'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                              <p><strong className="text-gray-900">Categoría:</strong> {project.category}</p>
                              <p><strong className="text-gray-900">Cliente:</strong> {project.client_display_name || project.client_name || 'Sin asignar'}</p>
                              <p><strong className="text-gray-900">Estado:</strong> {project.status}</p>
                              <p><strong className="text-gray-900">Año:</strong> {project.year}</p>
                            </div>
                            <div>
                              <p><strong className="text-gray-900">Ubicación:</strong> {project.location}</p>
                              <p><strong className="text-gray-900">Imágenes:</strong> {project.gallery_images?.length || 0}</p>
                              <p><strong className="text-gray-900">Creado:</strong> {new Date(project.created_at).toLocaleDateString('es-CL')}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-sm text-gray-700">
                              <strong className="text-gray-900">Descripción:</strong> {project.description}
                            </p>
                          </div>

                          {project.features && project.features.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-700 mb-1"><strong className="text-gray-900">Características:</strong></p>
                              <div className="flex flex-wrap gap-1">
                                {project.features.slice(0, 3).map((feature, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                    {feature}
                                  </span>
                                ))}
                                {project.features.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                    +{project.features.length - 3} más
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={async () => {
                              setEditingProject(project);
                              setSelectedFeatures(project.features || []);
                              setSelectedSpecifications(project.specifications || []);
                              
                              // Inicializar estados de imágenes
                              setCurrentMainImage(project.main_image || '');
                              setCurrentGalleryImages(project.gallery_images || []);
                              setImagesToDelete([]);
                              setNewImagesToUpload([]);
                              
                              // Cargar clientes para el select
                              await loadClients();
                              
                              setShowEditProjectModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProjectForDocument(project);
                              setSelectedDocumentFile(null);
                              setDocumentType('');
                              setDocumentTitle('');
                              setDocumentDescription('');
                              setShowDocumentModal(true);
                            }}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none"
                          >
                            📄 Documentos
                          </button>
                          {project.is_active ? (
                            <button
                              onClick={() => handleDeactivateProject(project.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none"
                            >
                              🚫 Desactivar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateProject(project.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none"
                            >
                              ✅ Activar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case "clientes":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestionar Clientes</h2>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Activos: {clients.filter(c => c.is_active).length}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Inactivos: {clients.filter(c => !c.is_active).length}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={loadClients}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium cursor-pointer focus:outline-none"
                  >
                    🔄 Actualizar
                  </button>
                  <button 
                    onClick={() => setShowInactiveClients(!showInactiveClients)}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-colors duration-200 font-medium cursor-pointer focus:outline-none ${
                      showInactiveClients 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    {showInactiveClients ? '👥 Ver Activos' : '👻 Ver Inactivos'}
                  </button>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium cursor-pointer focus:outline-none"
                  >
                    + Nuevo Cliente
                  </button>
                </div>
              </div>
              
              {isLoadingClients ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : clients.filter(client => showInactiveClients ? !client.is_active : client.is_active).length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600 text-center py-8">
                    {showInactiveClients ? 'No hay clientes inactivos.' : 'No hay clientes activos.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clients
                    .filter(client => showInactiveClients ? !client.is_active : client.is_active)
                    .map((client) => (
                    <div key={client.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {client.logo_url ? (
                              <img 
                                src={client.logo_url} 
                                alt={`Logo ${client.company || 'Cliente'}`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                {client.name.charAt(0)}
                              </div>
                            )}
                            <h3 className="font-semibold text-gray-900">
                              {client.name} {client.name_1} {client.surname} {client.surname_1}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              client.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {client.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>RUT:</strong> {client.rut}-{client.dv}</p>
                              <p><strong>Email:</strong> {client.email}</p>
                              <p><strong>Teléfono:</strong> {client.phone}</p>
                            </div>
                            <div>
                              {client.company && <p><strong>Empresa:</strong> {client.company}</p>}
                              {client.website && <p><strong>Sitio Web:</strong> {client.website}</p>}
                              <p><strong>Registrado:</strong> {new Date(client.created_at).toLocaleDateString('es-CL')}</p>
                            </div>
                          </div>
                          
                          {client.description && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600">
                                <strong>Descripción:</strong> {client.description}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setEditingClient(client);
                              setEditingLogoUrl(client.logo_url || '');
                              setShowEditModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeactivateClient(client.user_id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none"
                          >
                            🚫 Desactivar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "solicitudes":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Solicitudes Pendientes</h2>
                <button 
                  onClick={loadWaitingRequests}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium cursor-pointer focus:outline-none"
                >
                  🔄 Actualizar
                </button>
              </div>
              
              {isLoadingRequests ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : waitingRequests.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600 text-center py-8">
                    No hay solicitudes pendientes de revisión.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {waitingRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {request.name} {request.name_1} {request.surname} {request.surname_1}
                            </h3>
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Pendiente
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>RUT:</strong> {request.rut}-{request.dv}</p>
                              <p><strong>Email:</strong> {request.email}</p>
                              <p><strong>Teléfono:</strong> {request.phone}</p>
                            </div>
                            <div>
                              {request.company && <p><strong>Empresa:</strong> {request.company}</p>}
                              {request.website && <p><strong>Sitio Web:</strong> {request.website}</p>}
                              <p><strong>Fecha:</strong> {new Date(request.created_at).toLocaleDateString('es-CL')}</p>
                            </div>
                          </div>
                          
                          {request.description && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600">
                                <strong>Descripción:</strong> {request.description}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleRequestAction(request.id, 'approve', 'Solicitud aprobada')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none"
                          >
                            ✅ Aprobar
                          </button>
                          <button
                            onClick={() => handleRequestAction(request.id, 'reject', 'Solicitud rechazada')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none"
                          >
                            ❌ Rechazar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <style jsx>{buttonStyles}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Contenido principal con sidebar */}
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 shadow-lg border-r min-h-screen" style={{backgroundColor: '#1e4e78', borderColor: '#2C71B8'}}>
            <div className="p-6">
              {/* Logo del panel en sidebar */}
              <div className="flex items-center space-x-3 mb-8">
                <img 
                  src="https://gruposhvc.s3.dualstack.us-east-1.amazonaws.com/archivos_gruposhvc/archivos_principal/Only_Logo.jpg"
                  alt="Grupo SHVC Logo"
                  className="w-10 h-16 object-contain"
                />
                <div>
                  <h2 className="text-lg font-bold" style={{color: '#FFFFFF'}}>Panel Admin</h2>
                  <p className="text-sm" style={{color: '#B3CCE6'}}>Grupo SHVC</p>
                </div>
              </div>
              
              {/* Menu Items */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                                       <button
                       key={item.id}
                       onClick={() => handleMenuClick(item.id)}
                       className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 shadow-sm cursor-pointer focus:outline-none focus:ring-0 ${
                         selectedMenu === item.id
                           ? 'shadow-lg'
                           : ''
                       }`}
                       style={{
                         backgroundColor: selectedMenu === item.id ? '#1e4e78' : '#B3CCE6',
                         color: selectedMenu === item.id ? '#FFFFFF' : '#1e4e78',
                         border: selectedMenu === item.id ? '2px solid #B3CCE6' : 'none',
                         boxShadow: selectedMenu === item.id ? '0 10px 15px -3px rgba(30, 78, 120, 0.3), 0 4px 6px -2px rgba(30, 78, 120, 0.2)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                         outline: 'none'
                       }}
                     >
                       <span className="font-medium">{item.name}</span>
                     </button>
                ))}
                
                {/* Botón de cerrar sesión */}
                <button
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: '¿Cerrar sesión?',
                      text: '¿Estás seguro de que quieres salir del sistema?',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#3085d6',
                      confirmButtonText: 'Sí, salir',
                      cancelButtonText: 'Cancelar'
                    });

                    if (result.isConfirmed) {
                      localStorage.removeItem("token");
                      localStorage.removeItem("userRole");
                      window.location.href = "/login";
                    }
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium shadow-sm hover:bg-red-700 cursor-pointer focus:outline-none"
                  style={{backgroundColor: '#dc2626'}}
                >
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              </nav>
            </div>
          </div>

                     {/* Mobile Sidebar Overlay */}
           {isSidebarOpen && (
             <div 
               className="lg:hidden fixed inset-0 bg-black/50 z-[55]"
               style={{top: '80px'}}
               onClick={() => setIsSidebarOpen(false)}
             />
           )}

                                          {/* Mobile Sidebar */}
            <div className={`lg:hidden fixed inset-y-0 left-0 z-[60] w-64 shadow-xl transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`} style={{backgroundColor: '#1e4e78', top: '80px'}}>
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-3">
                   <img 
                     src="https://gruposhvc.s3.dualstack.us-east-1.amazonaws.com/archivos_gruposhvc/archivos_principal/Only_Logo.jpg"
                     alt="Grupo SHVC Logo"
                     className="w-8 h-12 object-contain"
                   />
                   <div>
                     <h2 className="text-lg font-bold" style={{color: '#FFFFFF'}}>Panel Admin</h2>
                     <p className="text-sm" style={{color: '#B3CCE6'}}>Grupo SHVC</p>
                   </div>
                 </div>
                                    <button
                     onClick={() => setIsSidebarOpen(false)}
                     style={{color: '#B3CCE6'}}
                     className="hover:text-white cursor-pointer focus:outline-none"
                   >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
               
               {/* Menu Items Mobile */}
               <nav className="space-y-2">
                 {menuItems.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => handleMenuClick(item.id)}
                     className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 shadow-sm cursor-pointer focus:outline-none focus:ring-0 ${
                       selectedMenu === item.id
                         ? 'shadow-lg'
                         : ''
                     }`}
                     style={{
                       backgroundColor: selectedMenu === item.id ? '#1e4e78' : '#B3CCE6',
                       color: selectedMenu === item.id ? '#FFFFFF' : '#1e4e78',
                       border: selectedMenu === item.id ? '2px solid #B3CCE6' : 'none',
                       boxShadow: selectedMenu === item.id ? '0 10px 15px -3px rgba(30, 78, 120, 0.3), 0 4px 6px -2px rgba(30, 78, 120, 0.2)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                       outline: 'none'
                     }}
                   >
                     <span className="font-medium">{item.name}</span>
                   </button>
                 ))}
                 
                                   {/* Botón de cerrar sesión móvil */}
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: '¿Cerrar sesión?',
                        text: '¿Estás seguro de que quieres salir del sistema?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Sí, salir',
                        cancelButtonText: 'Cancelar'
                      });

                      if (result.isConfirmed) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userRole");
                        window.location.href = "/login";
                      }
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium shadow-sm hover:bg-red-700 cursor-pointer focus:outline-none"
                    style={{backgroundColor: '#dc2626'}}
                  >
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
               </nav>
             </div>
           </div>

                     {/* Main Content */}
           <div className="flex-1 lg:ml-0">
             <div className="p-4 lg:p-8 pt-24 lg:pt-8">
              <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>

                          {/* Mobile Menu Button - Solo visible en móvil */}
         <div className="lg:hidden fixed bottom-6 right-6 z-[65]">
           <button
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="text-white p-4 rounded-full shadow-lg transition-colors duration-200 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
             style={{backgroundColor: '#2C71B8'}}
           >
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
         </div>

         {/* Modal Crear Cliente */}
         {showCreateModal && (
           <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
               <div className="p-6">
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                   <h3 className="text-2xl font-bold" style={{color: '#1e4e78'}}>Nuevo Cliente</h3>
                   <button
                     onClick={() => setShowCreateModal(false)}
                     className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer focus:outline-none p-1 rounded-full hover:bg-gray-100"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                 </div>

                 <form onSubmit={async (e) => {
                   e.preventDefault();
                   const formData = new FormData(e.currentTarget);
                   
                   // Separar RUT completo en número y DV
                   const rutCompleto = formData.get('rut_completo') as string;
                   let rut = '';
                   let dv = '';
                   
                   if (rutCompleto) {
                     // Remover guiones, puntos y espacios
                     const rutLimpio = rutCompleto.replace(/[.-]/g, '').replace(/\s/g, '');
                     
                     // Separar número y DV (el último carácter es el DV)
                     if (rutLimpio.length > 1) {
                       rut = rutLimpio.slice(0, -1);
                       dv = rutLimpio.slice(-1);
                     }
                   }
                   
                   // ← AGREGAR: Subir archivo a S3 si existe uno nuevo
                   let finalLogoUrl = selectedLogoUrl;
                   
                   if (selectedFile) {
                     try {
                       finalLogoUrl = await uploadFileToS3(selectedFile);
                     } catch (error) {
                       console.error('Error al subir archivo:', error);
                       await Swal.fire({
                         title: 'Error al subir imagen',
                         text: 'No se pudo subir la imagen. Inténtalo de nuevo.',
                         icon: 'error',
                         confirmButtonColor: '#d33'
                       });
                       return;
                     }
                   }
                   
                   const clientData = {
                     rut: rut,
                     dv: dv,
                     name: formData.get('name') as string,
                     name_1: formData.get('name_1') as string,
                     surname: formData.get('surname') as string,
                     surname_1: formData.get('surname_1') as string,
                     phone: formData.get('phone') as string,
                     email: formData.get('email') as string,
                     company: formData.get('company') as string,
                     website: formData.get('website') as string,
                     logo_url: finalLogoUrl,  // ← Usar la URL final (nueva o existente)
                     description: formData.get('description') as string,
                     password: formData.get('password') as string,
                   };
                   await handleCreateClient(clientData);
                 }} className="space-y-4">
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>RUT *</label>
                     <input
                       name="rut_completo"
                       type="text"
                       value={rutValue}
                       onChange={handleRUTChange}
                       maxLength={12}
                       className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                         rutError 
                           ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                           : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                       }`}
                       placeholder="Ej: 12345678-9"
                       required
                     />
                     {rutError && (
                       <p className="mt-1 text-sm text-red-600">{rutError}</p>
                     )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Nombre *</label>
                       <input
                         name="name"
                         type="text"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="Ej: Juan"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Segundo Nombre</label>
                       <input
                         name="name_1"
                         type="text"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="Ej: Carlos"
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Apellido *</label>
                       <input
                         name="surname"
                         type="text"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="Ej: Pérez"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Segundo Apellido</label>
                       <input
                         name="surname_1"
                         type="text"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="Ej: González"
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Teléfono *</label>
                       <input
                         name="phone"
                         type="tel"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="Ej: +56912345678"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Email *</label>
                       <input
                         name="email"
                         type="email"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="Ej: juan@empresa.com"
                         required
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Empresa</label>
                       <input
                         name="company"
                         type="text"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="Ej: Empresa ABC Ltda."
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Sitio Web</label>
                       <input
                         name="website"
                         type="url"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="Ej: https://www.empresa.com"
                       />
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Logo de la Empresa</label>
                             <FileUpload
          onFileSelected={setSelectedFile}
          currentUrl=""
          category="logos"
        />
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Descripción</label>
                     <textarea
                       name="description"
                       rows={3}
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
                       placeholder="Descripción de la empresa o cliente..."
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Contraseña *</label>
                     <input
                       name="password"
                       type="password"
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                       placeholder="Contraseña segura"
                       required
                     />
                   </div>

                   <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                     <button
                       type="button"
                       onClick={() => {
                         setShowCreateModal(false);
                         setSelectedLogoUrl('');
                         setSelectedFile(null);  // ← Limpiar archivo seleccionado
                         setRutValue(''); // ← Limpiar RUT
                         setRutError(''); // ← Limpiar error RUT
                       }}
                       className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none font-medium border border-gray-300"
                     >
                       Cancelar
                     </button>
                     <button
                       type="submit"
                       disabled={isCreatingClient}
                       className="px-6 py-3 text-white rounded-lg transition-all duration-200 cursor-pointer focus:outline-none font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                       style={{backgroundColor: '#2C71B8'}}
                     >
                       {isCreatingClient ? (
                         <div className="flex items-center">
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Creando...
                         </div>
                       ) : (
                         'Crear Cliente'
                       )}
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           </div>
         )}

         {/* Modal Editar Cliente */}
         {showEditModal && editingClient && (
           <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
               <div className="p-6">
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                   <h3 className="text-2xl font-bold" style={{color: '#1e4e78'}}>Editar Cliente</h3>
                   <button
                     onClick={() => {
                       setShowEditModal(false);
                       setEditingClient(null);
                       setSelectedFile(null);  // ← Limpiar archivo seleccionado
                     }}
                     className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer focus:outline-none p-1 rounded-full hover:bg-gray-100"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                 </div>

                 <form onSubmit={async (e) => {
                   e.preventDefault();
                   const formData = new FormData(e.currentTarget);
                   
                   // Separar RUT completo en número y DV
                   const rutCompleto = formData.get('rut_completo') as string;
                   let rut = '';
                   let dv = '';
                   
                   if (rutCompleto) {
                     // Remover guiones, puntos y espacios
                     const rutLimpio = rutCompleto.replace(/[.-]/g, '').replace(/\s/g, '');
                     
                     // Separar número y DV (el último carácter es el DV)
                     if (rutLimpio.length > 1) {
                       rut = rutLimpio.slice(0, -1);
                       dv = rutLimpio.slice(-1);
                     }
                   }
                   
                   // ← AGREGAR: Subir archivo a S3 si existe uno nuevo
                   let finalLogoUrl = editingClient.logo_url || '';
                   
                   if (selectedFile) {
                     try {
                       finalLogoUrl = await uploadFileToS3(selectedFile);
                     } catch (error) {
                       console.error('Error al subir archivo:', error);
                       await Swal.fire({
                         title: 'Error al subir imagen',
                         text: 'No se pudo subir la imagen. Inténtalo de nuevo.',
                         icon: 'error',
                         confirmButtonColor: '#d33'
                       });
                       return;
                     }
                   }
                   
                   const clientData = {
                     id: editingClient.user_id, // Cambiar de editingClient.id a editingClient.user_id
                     rut: rut,
                     dv: dv,
                     name: formData.get('name') as string,
                     name_1: formData.get('name_1') as string,
                     surname: formData.get('surname') as string,
                     surname_1: formData.get('surname_1') as string,
                     phone: formData.get('phone') as string,
                     email: formData.get('email') as string,
                     company: formData.get('company') as string,
                     website: formData.get('website') as string,
                     logo_url: finalLogoUrl,  // ← Usar la URL final (nueva o existente)
                     description: formData.get('description') as string,
                     password: formData.get('password') as string,
                   };
                   
                   
                   handleUpdateClient(clientData);
                   setShowEditModal(false);
                   setEditingClient(null);
                   setEditingLogoUrl('');
                   setSelectedFile(null);  // ← Limpiar archivo seleccionado
                 }} className="space-y-4">
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>RUT *</label>
                     <input
                       name="rut_completo"
                       type="text"
                       defaultValue={`${editingClient.rut}-${editingClient.dv}`}
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                       required
                     />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Nombre *</label>
                       <input
                         name="name"
                         type="text"
                         defaultValue={editingClient.name}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Segundo Nombre</label>
                       <input
                         name="name_1"
                         type="text"
                         defaultValue={editingClient.name_1 || ''}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Apellido *</label>
                       <input
                         name="surname"
                         type="text"
                         defaultValue={editingClient.surname}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Segundo Apellido</label>
                       <input
                         name="surname_1"
                         type="text"
                         defaultValue={editingClient.surname_1 || ''}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Teléfono *</label>
                       <input
                         name="phone"
                         type="tel"
                         defaultValue={editingClient.phone}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Email *</label>
                       <input
                         name="email"
                         type="email"
                         defaultValue={editingClient.email}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Empresa</label>
                       <input
                         name="company"
                         type="text"
                         defaultValue={editingClient.company || ''}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Sitio Web</label>
                       <input
                         name="website"
                         type="url"
                         defaultValue={editingClient.website || ''}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                       />
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Logo de la Empresa</label>
                             <FileUpload
          onFileSelected={setSelectedFile}
          currentUrl={editingClient.logo_url || ''}
          category="logos"
        />
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Descripción</label>
                     <textarea
                       name="description"
                       rows={3}
                       defaultValue={editingClient.description || ''}
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 resize-none"
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Nueva Contraseña (dejar vacío para mantener la actual)</label>
                     <input
                       name="password"
                       type="password"
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                     />
                   </div>

                   <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                     <button
                       type="button"
                       onClick={() => {
                         setShowEditModal(false);
                         setEditingClient(null);
                         setEditingLogoUrl('');
                       }}
                       className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none font-medium border border-gray-300"
                     >
                       Cancelar
                     </button>
                     <button
                       type="submit"
                       className="px-6 py-3 text-white rounded-lg transition-all duration-200 cursor-pointer focus:outline-none font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                       style={{backgroundColor: '#2C71B8'}}
                     >
                       Actualizar Cliente
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           </div>
         )}

         {/* Modal Crear Proyecto - Optimizado para móviles */}
         {showCreateProjectModal && (
           <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
             {/* Modal para móviles - Pantalla completa */}
             <div className="md:hidden h-full w-full bg-white flex flex-col">
               {/* Header fijo para móviles */}
               <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
                 <div className="flex-1 min-w-0 pr-4">
                   <h2 className="text-lg font-bold text-gray-900">Nuevo Proyecto</h2>
                   <p className="text-sm text-gray-600 mt-1">Crear un nuevo proyecto</p>
                 </div>
                 <button
                   onClick={() => {
                     setShowCreateProjectModal(false);
                     setSelectedMainImage(null);
                     setSelectedGalleryImages([]);
                     setSelectedFeatures([]);
                     setSelectedSpecifications([]);
                     setNewFeature('');
                     setNewSpecification('');
                   }}
                   className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                 >
                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>

               {/* Contenido scrolleable para móviles */}
               <div className="flex-1 overflow-y-auto">
                 <div className="p-4">

                 <form onSubmit={async (e) => {
                   e.preventDefault();
                   const formData = new FormData(e.currentTarget);
                   
                   const projectTitle = formData.get('title') as string;
                   
                   // Subir imagen principal
                   let mainImageUrl = '';
                   if (selectedMainImage && editingProject) {
                     try {
                       mainImageUrl = await uploadProjectFileToS3(selectedMainImage, editingProject.id, true);
                     } catch (error) {
                       await Swal.fire({
                         title: 'Error al subir imagen principal',
                         text: 'No se pudo subir la imagen. Inténtalo de nuevo.',
                         icon: 'error',
                         confirmButtonColor: '#d33'
                       });
                       return;
                     }
                   }

                   // Subir imágenes de galería
                   const galleryUrls: string[] = [];
                   if (editingProject) {
                     for (const file of selectedGalleryImages) {
                       try {
                         const url = await uploadProjectFileToS3(file, editingProject.id, false);
                         galleryUrls.push(url);
                       } catch (error) {
                         console.error('Error al subir imagen de galería:', error);
                       }
                     }
                   }
                   
                   const projectData = {
                     title: formData.get('title') as string,
                     client_id: parseInt(formData.get('client_id') as string),
                     category: formData.get('category') as string,
                     description: formData.get('description') as string,
                     year: formData.get('year') as string,
                     location: formData.get('location') as string,
                     status: formData.get('status') as string,
                     main_image: mainImageUrl,
                     gallery_images: galleryUrls,
                     features: selectedFeatures,
                     specifications: selectedSpecifications,
                     is_featured: formData.get('is_featured') === 'on',
                     is_visible_web: formData.get('is_visible_web') === 'on',
                   };
                   
                   handleCreateProject(projectData);
                   setShowCreateProjectModal(false);
                   setSelectedMainImage(null);
                   setSelectedGalleryImages([]);
                   setSelectedFeatures([]);
                   setSelectedSpecifications([]);
                 }} className="space-y-6">
                   
                   {/* Información básica */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Título del Proyecto *</label>
                       <input
                         name="title"
                         type="text"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="Ej: Residencial Los Pinos"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Cliente *</label>
                       <select
                         name="client_id"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       >
                         <option value="">Seleccionar cliente</option>
                         {clients.filter(c => c.is_active).map(client => (
                           <option key={client.id} value={client.id}>
                             {client.company || `${client.name} ${client.surname}`} - {client.email}
                           </option>
                         ))}
                       </select>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Categoría *</label>
                       <select
                         name="category"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       >
                         <option value="">Seleccionar categoría</option>
                         {projectCategories.map(cat => (
                           <option key={cat.value} value={cat.value}>
                             {cat.icon} {cat.label}
                           </option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Estado *</label>
                       <select
                         name="status"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       >
                         {projectStatuses.map(status => (
                           <option key={status.value} value={status.value}>
                             {status.label}
                           </option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Año</label>
                       <input
                         name="year"
                         type="text"
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                         placeholder="2024"
                       />
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Ubicación</label>
                     <input
                       name="location"
                       type="text"
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500"
                       placeholder="Ej: Santiago, Chile"
                     />
                   </div>

                   {/* Descripción */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Descripción *</label>
                     <textarea
                       name="description"
                       rows={4}
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
                       placeholder="Descripción completa del proyecto..."
                       required
                     />
                   </div>

                   {/* Gestión de Imágenes */}
                   <div className="space-y-6">
                     <h3 className="text-lg font-semibold" style={{color: '#1e4e78'}}>📸 Gestión de Imágenes</h3>
                     
                     {/* Imagen Principal */}
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>🖼️ Imagen Principal</label>
                       
                       {selectedMainImage ? (
                         <div className="relative inline-block">
                           <img 
                             src={URL.createObjectURL(selectedMainImage)} 
                             alt="Imagen principal seleccionada" 
                             className="w-32 h-32 object-cover rounded-lg border-2 border-blue-300"
                           />
                           <button
                             type="button"
                             onClick={() => setSelectedMainImage(null)}
                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                           >
                             🗑️
                           </button>
                         </div>
                       ) : (
                         <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                           Sin imagen
                         </div>
                       )}
                       
                       <div className="mt-2">
                         <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) setSelectedMainImage(file);
                           }}
                           className="hidden"
                           id="create-main-image"
                         />
                         <label
                           htmlFor="create-main-image"
                           className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                         >
                           📁 {selectedMainImage ? 'Cambiar' : 'Seleccionar'} Imagen Principal
                         </label>
                       </div>
                     </div>

                     {/* Galería */}
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>🖼️ Galería de Imágenes</label>
                       
                       {/* Imágenes seleccionadas */}
                       {selectedGalleryImages.length > 0 && (
                         <div className="mb-4">
                           <p className="text-sm text-gray-600 mb-2">Imágenes seleccionadas:</p>
                           <div className="flex flex-wrap gap-2">
                             {selectedGalleryImages.map((file, index) => (
                               <div key={index} className="relative">
                                 <img 
                                   src={URL.createObjectURL(file)} 
                                   alt={`Galería ${index + 1}`} 
                                   className="w-20 h-20 object-cover rounded-lg border-2 border-green-300"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => {
                                     setSelectedGalleryImages(prev => prev.filter((_, i) => i !== index));
                                   }}
                                   className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                 >
                                   🗑️
                                 </button>
                                 <span className="absolute -bottom-1 left-0 right-0 bg-green-500 text-white text-xs text-center rounded-b-lg">
                                   {file.name.length > 10 ? file.name.substring(0, 10) + '...' : file.name}
                                 </span>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}

                       {/* Agregar nuevas imágenes */}
                       <div>
                         <input
                           type="file"
                           multiple
                           accept="image/*"
                           onChange={(e) => {
                             const files = Array.from(e.target.files || []);
                             setSelectedGalleryImages(prev => [...prev, ...files]);
                           }}
                           className="hidden"
                           id="create-gallery-images"
                         />
                         <label
                           htmlFor="create-gallery-images"
                           className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                         >
                           📁 Agregar Imágenes a la Galería
                         </label>
                       </div>
                     </div>
                   </div>

                   {/* Características */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Características</label>
                     <p className="text-sm text-gray-600 mb-3">Agrega servicios, instalaciones o elementos que incluye el proyecto (ej: piscina, gimnasio, seguridad 24/7)</p>
                     
                     {/* Agregar nueva característica */}
                     <div className="mb-3">
                       <div className="flex gap-2">
                         <input
                           type="text"
                           value={newFeature}
                           onChange={(e) => setNewFeature(e.target.value)}
                           placeholder="Agregar nueva característica..."
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500"
                         />
                         <button
                           type="button"
                           onClick={() => {
                             if (newFeature.trim() && !selectedFeatures.includes(newFeature.trim())) {
                               setSelectedFeatures([...selectedFeatures, newFeature.trim()]);
                               setNewFeature('');
                             }
                           }}
                           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                         >
                           + Agregar
                         </button>
                       </div>
                     </div>


                     {/* Características seleccionadas */}
                     {selectedFeatures.length > 0 && (
                       <div>
                         <p className="text-sm font-medium text-gray-700 mb-2">Características seleccionadas:</p>
                         <div className="flex flex-wrap gap-2">
                           {selectedFeatures.map((feature, idx) => (
                             <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                               {feature}
                               <button
                                 type="button"
                                 onClick={() => setSelectedFeatures(selectedFeatures.filter(f => f !== feature))}
                                 className="text-blue-600 hover:text-blue-800 font-bold"
                               >
                                 ×
                               </button>
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Especificaciones */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Especificaciones</label>
                     <p className="text-sm text-gray-600 mb-3">Agrega datos técnicos, medidas o detalles específicos del proyecto (ej: 1500 m², 3 pisos, capacidad 500 personas)</p>
                     
                     {/* Agregar nueva especificación */}
                     <div className="mb-3">
                       <div className="flex gap-2">
                         <input
                           type="text"
                           value={newSpecification}
                           onChange={(e) => setNewSpecification(e.target.value)}
                           placeholder="Agregar nueva especificación..."
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500"
                         />
                         <button
                           type="button"
                           onClick={() => {
                             if (newSpecification.trim() && !selectedSpecifications.includes(newSpecification.trim())) {
                               setSelectedSpecifications([...selectedSpecifications, newSpecification.trim()]);
                               setNewSpecification('');
                             }
                           }}
                           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                         >
                           + Agregar
                         </button>
                       </div>
                     </div>


                     {/* Especificaciones seleccionadas */}
                     {selectedSpecifications.length > 0 && (
                       <div>
                         <p className="text-sm font-medium text-gray-700 mb-2">Especificaciones seleccionadas:</p>
                         <div className="flex flex-wrap gap-2">
                           {selectedSpecifications.map((spec, idx) => (
                             <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                               {spec}
                               <button
                                 type="button"
                                 onClick={() => setSelectedSpecifications(selectedSpecifications.filter(s => s !== spec))}
                                 className="text-green-600 hover:text-green-800 font-bold"
                               >
                                 ×
                               </button>
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Configuración */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         name="is_featured"
                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                       />
                       <label className="text-sm font-medium text-gray-700">Proyecto Destacado</label>
                     </div>
                     <div className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         name="is_visible_web"
                         defaultChecked
                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                       />
                       <label className="text-sm font-medium text-gray-700">Visible en Web</label>
                     </div>
                   </div>

                   <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                     <button
                       type="button"
                       onClick={() => {
                         setShowCreateProjectModal(false);
                         setSelectedMainImage(null);
                         setSelectedGalleryImages([]);
                         setSelectedFeatures([]);
                         setSelectedSpecifications([]);
                       }}
                       className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none font-medium border border-gray-300"
                     >
                       Cancelar
                     </button>
                     <button
                       type="submit"
                       className="px-6 py-3 text-white rounded-lg transition-all duration-200 cursor-pointer focus:outline-none font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                       style={{backgroundColor: '#2C71B8'}}
                     >
                       Crear Proyecto
                     </button>
                   </div>
                 </form>
                 </div>
               </div>
             </div>

             {/* Modal para tablets y desktop */}
             <div className="hidden md:flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[85vh] shadow-2xl animate-fade-in-scale flex flex-col overflow-hidden">
                 {/* Header para desktop - Compacto */}
                 <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white">
                   <div className="flex-1 min-w-0 pr-4">
                     <h2 className="text-xl font-bold text-gray-900">Nuevo Proyecto</h2>
                     <p className="text-sm text-gray-600 mt-1">Crear un nuevo proyecto</p>
                   </div>
                   <button
                     onClick={() => {
                       setShowCreateProjectModal(false);
                       setSelectedMainImage(null);
                       setSelectedGalleryImages([]);
                       setSelectedFeatures([]);
                       setSelectedSpecifications([]);
                       setNewFeature('');
                       setNewSpecification('');
                     }}
                     className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                   >
                     <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                 </div>

                 {/* Contenido para desktop - Layout compacto */}
                 <div className="flex-1 overflow-y-auto">
                   <div className="p-5">
                     <form onSubmit={async (e) => {
                       e.preventDefault();
                       const formData = new FormData(e.currentTarget);
                       
                       const projectTitle = formData.get('title') as string;
                       
                       // Subir imagen principal
                       let mainImageUrl = '';
                       if (selectedMainImage && editingProject) {
                         try {
                           mainImageUrl = await uploadProjectFileToS3(selectedMainImage, editingProject.id, true);
                         } catch (error) {
                           await Swal.fire({
                             title: 'Error al subir imagen principal',
                             text: 'No se pudo subir la imagen. Inténtalo de nuevo.',
                             icon: 'error',
                             confirmButtonColor: '#d33'
                           });
                           return;
                         }
                       }

                       // Subir imágenes de galería
                       const galleryUrls: string[] = [];
                       if (editingProject) {
                         for (const file of selectedGalleryImages) {
                           try {
                             const url = await uploadProjectFileToS3(file, editingProject.id, false);
                             galleryUrls.push(url);
                           } catch (error) {
                             console.error('Error al subir imagen de galería:', error);
                           }
                         }
                       }
                       
                       const projectData = {
                         title: formData.get('title') as string,
                         client_id: parseInt(formData.get('client_id') as string),
                         category: formData.get('category') as string,
                         description: formData.get('description') as string,
                         year: formData.get('year') as string,
                         location: formData.get('location') as string,
                         status: formData.get('status') as string,
                         main_image: mainImageUrl,
                         gallery_images: galleryUrls,
                         features: selectedFeatures,
                         specifications: selectedSpecifications,
                         is_featured: formData.get('is_featured') === 'on',
                         is_visible_web: formData.get('is_visible_web') === 'on',
                       };
                       
                       handleCreateProject(projectData);
                       setShowCreateProjectModal(false);
                       setSelectedMainImage(null);
                       setSelectedGalleryImages([]);
                       setSelectedFeatures([]);
                       setSelectedSpecifications([]);
                     }} className="space-y-6">
                       
                       {/* Sección 1: Información Principal */}
                       <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                         <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                           <span className="mr-2">📋</span>
                           Información Principal
                         </h4>
                         
                         <div className="space-y-4">
                           {/* Título - Ocupa todo el ancho */}
                           <div>
                             <label className="block text-sm font-semibold mb-1 text-gray-700">Título del Proyecto *</label>
                             <input
                               name="title"
                               type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500 text-sm"
                               placeholder="Ej: Residencial Los Pinos"
                               required
                             />
                           </div>

                           {/* Cliente y Categoría en la misma fila */}
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                             <div>
                               <label className="block text-sm font-semibold mb-1 text-gray-700">Cliente *</label>
                               <select
                                 name="client_id"
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 text-sm"
                                 required
                               >
                                 <option value="">Seleccionar cliente</option>
                                 {clients.filter(c => c.is_active).map(client => (
                                   <option key={client.id} value={client.id}>
                                     {client.company || `${client.name} ${client.surname}`} - {client.email}
                                   </option>
                                 ))}
                               </select>
                             </div>
                             <div>
                               <label className="block text-sm font-semibold mb-1 text-gray-700">Categoría *</label>
                               <select
                                 name="category"
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 text-sm"
                                 required
                               >
                                 <option value="">Seleccionar categoría</option>
                                 {projectCategories.map(cat => (
                                   <option key={cat.value} value={cat.value}>
                                     {cat.icon} {cat.label}
                                   </option>
                                 ))}
                               </select>
                             </div>
                           </div>

                           {/* Estado, Año y Ubicación en una fila */}
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                             <div>
                               <label className="block text-sm font-semibold mb-1 text-gray-700">Estado *</label>
                               <select
                                 name="status"
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 text-sm"
                                 required
                               >
                                 {projectStatuses.map(status => (
                                   <option key={status.value} value={status.value}>
                                     {status.label}
                                   </option>
                                 ))}
                               </select>
                             </div>
                             <div>
                               <label className="block text-sm font-semibold mb-1 text-gray-700">Año</label>
                               <input
                                 name="year"
                                 type="text"
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500 text-sm"
                                 placeholder="2024"
                               />
                             </div>
                             <div>
                               <label className="block text-sm font-semibold mb-1 text-gray-700">Ubicación</label>
                               <input
                                 name="location"
                                 type="text"
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500 text-sm"
                                 placeholder="Ej: Santiago, Chile"
                               />
                             </div>
                           </div>

                           {/* Descripción */}
                           <div>
                             <label className="block text-sm font-semibold mb-1 text-gray-700">Descripción *</label>
                             <textarea
                               name="description"
                               rows={2}
                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none text-sm"
                               placeholder="Descripción completa del proyecto..."
                               required
                             />
                           </div>
                         </div>
                       </div>

                       {/* Sección 2: Gestión de Imágenes */}
                       <div className="bg-green-50 rounded-lg p-4 sm:p-6">
                         <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                           <span className="mr-2">📸</span>
                           Gestión de Imágenes
                         </h4>
                         
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           {/* Imagen Principal */}
                           <div>
                             <label className="block text-sm font-semibold mb-2 text-gray-700">🖼️ Imagen Principal</label>
                             
                             <div className="flex items-start gap-4">
                               {selectedMainImage ? (
                                 <div className="relative">
                                   <img 
                                     src={URL.createObjectURL(selectedMainImage)} 
                                     alt="Imagen principal seleccionada" 
                                     className="w-24 h-24 object-cover rounded-lg border-2 border-blue-300"
                                   />
                                   <button
                                     type="button"
                                     onClick={() => setSelectedMainImage(null)}
                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                   >
                                     ×
                                   </button>
                                 </div>
                               ) : (
                                 <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                                   Sin imagen
                                 </div>
                               )}
                               
                               <div className="flex-1">
                                 <input
                                   type="file"
                                   accept="image/*"
                                   onChange={(e) => {
                                     const file = e.target.files?.[0];
                                     if (file) setSelectedMainImage(file);
                                   }}
                                   className="hidden"
                                   id="create-main-image-desktop"
                                 />
                                 <label
                                   htmlFor="create-main-image-desktop"
                                   className="inline-flex items-center px-2 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer text-xs"
                                 >
                                   📁 {selectedMainImage ? 'Cambiar' : 'Seleccionar'}
                                 </label>
                               </div>
                             </div>
                           </div>

                           {/* Galería */}
                           <div>
                             <label className="block text-sm font-semibold mb-2 text-gray-700">🖼️ Galería de Imágenes</label>
                             
                             {/* Imágenes seleccionadas */}
                             {selectedGalleryImages.length > 0 && (
                               <div className="mb-3">
                                 <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                                   {selectedGalleryImages.map((file, index) => (
                                     <div key={index} className="relative">
                                       <img 
                                         src={URL.createObjectURL(file)} 
                                         alt={`Galería ${index + 1}`} 
                                         className="w-12 h-12 object-cover rounded border border-green-300"
                                       />
                                       <button
                                         type="button"
                                         onClick={() => {
                                           setSelectedGalleryImages(prev => prev.filter((_, i) => i !== index));
                                         }}
                                         className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                       >
                                         ×
                                       </button>
                                     </div>
                                   ))}
                                 </div>
                                 <p className="text-xs text-gray-600 mt-1">{selectedGalleryImages.length} imagen(es) seleccionada(s)</p>
                               </div>
                             )}

                             {/* Agregar nuevas imágenes */}
                             <div>
                               <input
                                 type="file"
                                 multiple
                                 accept="image/*"
                                 onChange={(e) => {
                                   const files = Array.from(e.target.files || []);
                                   setSelectedGalleryImages(prev => [...prev, ...files]);
                                 }}
                                 className="hidden"
                                 id="create-gallery-images-desktop"
                               />
                               <label
                                 htmlFor="create-gallery-images-desktop"
                                 className="inline-flex items-center px-2 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer text-xs"
                               >
                                 📁 Agregar Imágenes
                               </label>
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Sección 3: Características y Especificaciones */}
                       <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
                         <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                           <span className="mr-2">⚙️</span>
                           Características y Especificaciones
                         </h4>
                         
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           {/* Características */}
                           <div>
                             <label className="block text-sm font-semibold mb-2 text-gray-700">Características</label>
                             <p className="text-xs text-gray-600 mb-2">Servicios, instalaciones o elementos del proyecto</p>
                             
                             {/* Agregar nueva característica */}
                             <div className="mb-2">
                               <div className="flex gap-2">
                                 <input
                                   type="text"
                                   value={newFeature}
                                   onChange={(e) => setNewFeature(e.target.value)}
                                   placeholder="Ej: piscina, gimnasio..."
                                   className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500 text-xs"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => {
                                     if (newFeature.trim() && !selectedFeatures.includes(newFeature.trim())) {
                                       setSelectedFeatures([...selectedFeatures, newFeature.trim()]);
                                       setNewFeature('');
                                     }
                                   }}
                                   className="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-medium text-xs"
                                 >
                                   +
                                 </button>
                               </div>
                             </div>

                             {/* Características seleccionadas */}
                             {selectedFeatures.length > 0 && (
                               <div className="max-h-24 overflow-y-auto">
                                 <div className="flex flex-wrap gap-1">
                                   {selectedFeatures.map((feature, idx) => (
                                     <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                       {feature}
                                       <button
                                         type="button"
                                         onClick={() => setSelectedFeatures(selectedFeatures.filter(f => f !== feature))}
                                         className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                                       >
                                         ×
                                       </button>
                                     </span>
                                   ))}
                                 </div>
                               </div>
                             )}
                           </div>

                           {/* Especificaciones */}
                           <div>
                             <label className="block text-sm font-semibold mb-2 text-gray-700">Especificaciones</label>
                             <p className="text-xs text-gray-600 mb-2">Datos técnicos, medidas o detalles específicos</p>
                             
                             {/* Agregar nueva especificación */}
                             <div className="mb-2">
                               <div className="flex gap-2">
                                 <input
                                   type="text"
                                   value={newSpecification}
                                   onChange={(e) => setNewSpecification(e.target.value)}
                                   placeholder="Ej: 1500 m², 3 pisos..."
                                   className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500 text-xs"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => {
                                     if (newSpecification.trim() && !selectedSpecifications.includes(newSpecification.trim())) {
                                       setSelectedSpecifications([...selectedSpecifications, newSpecification.trim()]);
                                       setNewSpecification('');
                                     }
                                   }}
                                   className="px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 font-medium text-xs"
                                 >
                                   +
                                 </button>
                               </div>
                             </div>

                             {/* Especificaciones seleccionadas */}
                             {selectedSpecifications.length > 0 && (
                               <div className="max-h-24 overflow-y-auto">
                                 <div className="flex flex-wrap gap-1">
                                   {selectedSpecifications.map((spec, idx) => (
                                     <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                       {spec}
                                       <button
                                         type="button"
                                         onClick={() => setSelectedSpecifications(selectedSpecifications.filter(s => s !== spec))}
                                         className="text-green-600 hover:text-green-800 font-bold text-sm"
                                       >
                                         ×
                                       </button>
                                     </span>
                                   ))}
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       </div>

                       {/* Sección 4: Configuración */}
                       <div className="bg-orange-50 rounded-lg p-4 sm:p-6">
                         <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                           <span className="mr-2">⚙️</span>
                           Configuración del Proyecto
                         </h4>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="flex items-center space-x-3">
                             <input
                               type="checkbox"
                               name="is_featured"
                               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                             />
                             <label className="text-sm font-medium text-gray-700">Proyecto Destacado</label>
                           </div>
                           <div className="flex items-center space-x-3">
                             <input
                               type="checkbox"
                               name="is_visible_web"
                               defaultChecked
                               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                             />
                             <label className="text-sm font-medium text-gray-700">Visible en Web</label>
                           </div>
                         </div>
                       </div>

                       {/* Botones */}
                       <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                         <button
                           type="button"
                           onClick={() => {
                             setShowCreateProjectModal(false);
                             setSelectedMainImage(null);
                             setSelectedGalleryImages([]);
                             setSelectedFeatures([]);
                             setSelectedSpecifications([]);
                           }}
                           className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 text-sm"
                         >
                           Cancelar
                         </button>
                         <button
                           type="submit"
                           className="px-4 py-2 text-white rounded-md transition-all duration-200 cursor-pointer focus:outline-none font-medium shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                           style={{backgroundColor: '#2C71B8'}}
                         >
                           Crear Proyecto
                         </button>
                       </div>
                     </form>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* Modal Editar Proyecto */}
         {showEditProjectModal && editingProject && (
           <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
               <div className="p-6">
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                   <h3 className="text-2xl font-bold" style={{color: '#1e4e78'}}>Editar Proyecto</h3>
                   <button
                     onClick={() => {
                       setShowEditProjectModal(false);
                       setEditingProject(null);
                       setSelectedMainImage(null);
                       setSelectedGalleryImages([]);
                       setSelectedFeatures([]);
                       setSelectedSpecifications([]);
                       
                       // Limpiar estados de gestión de imágenes
                       setCurrentMainImage('');
                       setCurrentGalleryImages([]);
                       setImagesToDelete([]);
                       setNewImagesToUpload([]);
                       setNewFeature('');
                       setNewSpecification('');
                     }}
                     className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer focus:outline-none p-1 rounded-full hover:bg-gray-100"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                 </div>

                 <form onSubmit={async (e) => {
                   e.preventDefault();
                   const formData = new FormData(e.currentTarget);
                   
                   const projectTitle = formData.get('title') as string;
                   
                   // Preparar datos del proyecto para actualización
                   const projectData = {
                     id: editingProject.id,
                     title: formData.get('title') as string,
                     client_id: parseInt(formData.get('client_id') as string),
                     category: formData.get('category') as string,
                     description: formData.get('description') as string,
                     year: formData.get('year') as string,
                     location: formData.get('location') as string,
                     status: formData.get('status') as string,
                     features: selectedFeatures,
                     specifications: selectedSpecifications,
                     is_featured: formData.get('is_featured') === 'on',
                     is_visible_web: formData.get('is_visible_web') === 'on',
                   };
                   
                   // Las imágenes se manejan directamente en handleUpdateProject
                   
                   // Usar la función handleUpdateProject que maneja correctamente las imágenes
                   handleUpdateProject(projectData);
                   setShowEditProjectModal(false);
                   setEditingProject(null);
                   setSelectedMainImage(null);
                   setSelectedGalleryImages([]);
                   setSelectedFeatures([]);
                   setSelectedSpecifications([]);
                   
                   // Limpiar estados de gestión de imágenes
                   setCurrentMainImage('');
                   setCurrentGalleryImages([]);
                   setImagesToDelete([]);
                   setNewImagesToUpload([]);
                 }} className="space-y-6">
                   
                   {/* Información básica */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Título del Proyecto *</label>
                       <input
                         name="title"
                         type="text"
                         defaultValue={editingProject.title}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Cliente *</label>
                       <select
                         name="client_id"
                         value={editingProject.client_id}
                         onChange={(e) => setEditingProject({...editingProject, client_id: parseInt(e.target.value)})}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       >
                         <option value="">Seleccionar cliente</option>
                         {clients.filter(c => c.is_active).map(client => (
                           <option key={client.id} value={client.id}>
                             {client.company || `${client.name} ${client.surname}`} - {client.email}
                           </option>
                         ))}
                       </select>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Categoría *</label>
                       <select
                         name="category"
                         value={editingProject.category}
                         onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       >
                         {projectCategories.map(cat => (
                           <option key={cat.value} value={cat.value}>
                             {cat.icon} {cat.label}
                           </option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Estado *</label>
                       <select
                         name="status"
                         value={editingProject.status}
                         onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                         required
                       >
                         {projectStatuses.map(status => (
                           <option key={status.value} value={status.value}>
                             {status.label}
                           </option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Año</label>
                       <input
                         name="year"
                         type="text"
                         defaultValue={editingProject.year}
                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                       />
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Ubicación</label>
                     <input
                       name="location"
                       type="text"
                       defaultValue={editingProject.location}
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                     />
                   </div>

                   {/* Descripción */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Descripción *</label>
                     <textarea
                       name="description"
                       rows={4}
                       defaultValue={editingProject.description}
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 resize-none"
                       required
                     />
                   </div>

                   {/* Gestión de Imágenes */}
                   <div className="space-y-6">
                     <h3 className="text-lg font-semibold" style={{color: '#1e4e78'}}>📸 Gestión de Imágenes</h3>
                     
                     {/* Imagen Principal */}
                     <div>
                       <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>🖼️ Imagen Principal</label>
                       
                       {/* Mostrar imagen principal actual o nueva seleccionada */}
                       {selectedMainImage ? (
                         <div className="relative inline-block">
                           <img 
                             src={URL.createObjectURL(selectedMainImage)} 
                             alt="Nueva imagen principal seleccionada" 
                             className="w-32 h-32 object-cover rounded-lg border-2 border-blue-300"
                           />
                           <button
                             type="button"
                             onClick={() => setSelectedMainImage(null)}
                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                           >
                             🗑️
                           </button>
                           <span className="absolute -bottom-1 left-0 right-0 bg-blue-500 text-white text-xs text-center rounded-b-lg">
                             Nueva imagen
                           </span>
                         </div>
                       ) : currentMainImage ? (
                         <div className="relative inline-block">
                           <img 
                             src={currentMainImage} 
                             alt="Imagen principal actual" 
                             className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                           />
                           <button
                             type="button"
                             onClick={() => handleDeleteCurrentImage(currentMainImage, true)}
                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                           >
                             🗑️
                           </button>
                           <span className="absolute -bottom-1 left-0 right-0 bg-gray-500 text-white text-xs text-center rounded-b-lg">
                             Actual
                           </span>
                         </div>
                       ) : (
                         <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                           Sin imagen
                         </div>
                       )}
                       
                       <div className="mt-2">
                         <input
                           type="file"
                           accept="image/*"
                           onChange={handleSelectNewMainImage}
                           className="hidden"
                           id="new-main-image"
                         />
                         <label
                           htmlFor="new-main-image"
                           className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                         >
                           📁 {currentMainImage ? 'Cambiar' : 'Seleccionar'} Imagen Principal
                         </label>
                       </div>
                     </div>

                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>🖼️ Galería de Imágenes</label>
                     
                     {/* Imágenes actuales */}
                     {currentGalleryImages.length > 0 && (
                       <div className="mb-4">
                         <p className="text-sm text-gray-600 mb-2">Imágenes actuales:</p>
                         <div className="flex flex-wrap gap-2">
                           {currentGalleryImages.map((imageUrl, index) => (
                             <div key={index} className="relative">
                               <img 
                                 src={imageUrl} 
                                 alt={`Galería ${index + 1}`} 
                                 className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300"
                               />
                               <button
                                 type="button"
                                 onClick={() => handleDeleteCurrentImage(imageUrl, false)}
                                 className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                               >
                                 🗑️
                               </button>
                               <span className="absolute -bottom-1 left-0 right-0 bg-gray-500 text-white text-xs text-center rounded-b-lg">
                                 Actual
                               </span>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     {/* Nuevas imágenes seleccionadas */}
                     {selectedGalleryImages.length > 0 && (
                       <div className="mb-4">
                         <p className="text-sm text-gray-600 mb-2">Nuevas imágenes seleccionadas:</p>
                         <div className="flex flex-wrap gap-2">
                           {selectedGalleryImages.map((file, index) => (
                             <div key={index} className="relative">
                               <img 
                                 src={URL.createObjectURL(file)} 
                                 alt={`Nueva galería ${index + 1}`} 
                                 className="w-20 h-20 object-cover rounded-lg border-2 border-green-300"
                               />
                               <button
                                 type="button"
                                 onClick={() => {
                                   setSelectedGalleryImages(prev => prev.filter((_, i) => i !== index));
                                 }}
                                 className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                               >
                                 🗑️
                               </button>
                               <span className="absolute -bottom-1 left-0 right-0 bg-green-500 text-white text-xs text-center rounded-b-lg">
                                 Nueva
                               </span>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     {/* Agregar nuevas imágenes */}
                     <div>
                       <input
                         type="file"
                         multiple
                         accept="image/*"
                         onChange={handleSelectNewGalleryImages}
                         className="hidden"
                         id="new-gallery-images"
                       />
                       <label
                         htmlFor="new-gallery-images"
                         className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                       >
                         📁 Agregar Imágenes a la Galería
                       </label>
                     </div>

                     {/* Mostrar nuevas imágenes seleccionadas */}
                     {newImagesToUpload.length > 0 && (
                       <div className="mt-4">
                         <p className="text-sm text-gray-600 mb-2">Nuevas imágenes a subir:</p>
                         <div className="flex flex-wrap gap-2">
                           {newImagesToUpload.map((file, index) => (
                             <div key={index} className="relative">
                               <img 
                                 src={URL.createObjectURL(file)} 
                                 alt={file.name} 
                                 className="w-20 h-20 object-cover rounded-lg border-2 border-green-300"
                               />
                               <span className="absolute -bottom-1 left-0 right-0 bg-green-500 text-white text-xs text-center rounded-b-lg">
                                 {file.name.length > 10 ? file.name.substring(0, 10) + '...' : file.name}
                               </span>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                   </div>

                   {/* Características */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Características</label>
                     <p className="text-sm text-gray-600 mb-3">Agrega servicios, instalaciones o elementos que incluye el proyecto (ej: piscina, gimnasio, seguridad 24/7)</p>
                     
                     {/* Agregar nueva característica */}
                     <div className="mb-3">
                       <div className="flex gap-2">
                         <input
                           type="text"
                           value={newFeature}
                           onChange={(e) => setNewFeature(e.target.value)}
                           placeholder="Agregar nueva característica..."
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500"
                         />
                         <button
                           type="button"
                           onClick={() => {
                             if (newFeature.trim() && !selectedFeatures.includes(newFeature.trim())) {
                               setSelectedFeatures([...selectedFeatures, newFeature.trim()]);
                               setNewFeature('');
                             }
                           }}
                           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                         >
                           + Agregar
                         </button>
                       </div>
                     </div>


                     {/* Características seleccionadas */}
                     {selectedFeatures.length > 0 && (
                       <div>
                         <p className="text-sm font-medium text-gray-700 mb-2">Características seleccionadas:</p>
                         <div className="flex flex-wrap gap-2">
                           {selectedFeatures.map((feature, idx) => (
                             <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                               {feature}
                               <button
                                 type="button"
                                 onClick={() => setSelectedFeatures(selectedFeatures.filter(f => f !== feature))}
                                 className="text-blue-600 hover:text-blue-800 font-bold"
                               >
                                 ×
                               </button>
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Especificaciones */}
                   <div>
                     <label className="block text-sm font-semibold mb-2" style={{color: '#1e4e78'}}>Especificaciones</label>
                     <p className="text-sm text-gray-600 mb-3">Agrega datos técnicos, medidas o detalles específicos del proyecto (ej: 1500 m², 3 pisos, capacidad 500 personas)</p>
                     
                     {/* Agregar nueva especificación */}
                     <div className="mb-3">
                       <div className="flex gap-2">
                         <input
                           type="text"
                           value={newSpecification}
                           onChange={(e) => setNewSpecification(e.target.value)}
                           placeholder="Agregar nueva especificación..."
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500"
                         />
                         <button
                           type="button"
                           onClick={() => {
                             if (newSpecification.trim() && !selectedSpecifications.includes(newSpecification.trim())) {
                               setSelectedSpecifications([...selectedSpecifications, newSpecification.trim()]);
                               setNewSpecification('');
                             }
                           }}
                           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                         >
                           + Agregar
                         </button>
                       </div>
                     </div>


                     {/* Especificaciones seleccionadas */}
                     {selectedSpecifications.length > 0 && (
                       <div>
                         <p className="text-sm font-medium text-gray-700 mb-2">Especificaciones seleccionadas:</p>
                         <div className="flex flex-wrap gap-2">
                           {selectedSpecifications.map((spec, idx) => (
                             <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                               {spec}
                               <button
                                 type="button"
                                 onClick={() => setSelectedSpecifications(selectedSpecifications.filter(s => s !== spec))}
                                 className="text-green-600 hover:text-green-800 font-bold"
                               >
                                 ×
                               </button>
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Configuración */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         name="is_featured"
                         defaultChecked={editingProject.is_featured}
                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                       />
                       <label className="text-sm font-medium text-gray-700">Proyecto Destacado</label>
                     </div>
                     <div className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         name="is_visible_web"
                         defaultChecked={editingProject.is_visible_web}
                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                       />
                       <label className="text-sm font-medium text-gray-700">Visible en Web</label>
                     </div>
                   </div>

                   <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                     <button
                       type="button"
                       onClick={() => {
                         setShowEditProjectModal(false);
                         setEditingProject(null);
                         setSelectedMainImage(null);
                         setSelectedGalleryImages([]);
                         setSelectedFeatures([]);
                         setSelectedSpecifications([]);
                         
                         // Limpiar estados de gestión de imágenes
                         setCurrentMainImage('');
                         setCurrentGalleryImages([]);
                         setImagesToDelete([]);
                         setNewImagesToUpload([]);
                       }}
                       className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none font-medium border border-gray-300"
                     >
                       Cancelar
                     </button>
                     <button
                       type="submit"
                       className="px-6 py-3 text-white rounded-lg transition-all duration-200 cursor-pointer focus:outline-none font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                       style={{backgroundColor: '#2C71B8'}}
                     >
                       Actualizar Proyecto
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           </div>
         )}

         {/* Modal Gestión de Documentos */}
         {showDocumentModal && selectedProjectForDocument && (
           <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
               <div className="p-6">
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                   <h3 className="text-2xl font-bold" style={{color: '#1e4e78'}}>
                     📄 Documentos - {selectedProjectForDocument.title}
                   </h3>
                   <button
                     onClick={() => {
                       setShowDocumentModal(false);
                       setSelectedProjectForDocument(null);
                       setSelectedDocumentFile(null);
                       setDocumentType('');
                       setDocumentTitle('');
                       setDocumentDescription('');
                     }}
                     className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                   >
                     ×
                   </button>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* Sección: Documentos existentes */}
                   <div>
                     <h4 className="text-lg font-semibold mb-4" style={{color: '#1e4e78'}}>
                       Documentos Actuales
                     </h4>
                     
                     {selectedProjectForDocument.documents && Object.keys(selectedProjectForDocument.documents).length > 0 ? (
                       <div className="space-y-3">
                         {Object.entries(selectedProjectForDocument.documents).map(([type, doc]) => (
                           <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                             <div className="flex items-center space-x-3">
                               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                 <span className="text-blue-600 font-bold text-sm">
                                   {type === 'contract' ? '📋' : 
                                    type === 'plans' ? '📐' : 
                                    type === 'budget' ? '💰' : 
                                    type === 'technical' ? '🔧' : 
                                    type === 'legal' ? '⚖️' : 
                                    type === 'financial' ? '💳' : '📄'}
                                 </span>
                               </div>
                               <div>
                                 <p className="font-medium text-black">{doc.title}</p>
                                 <p className="text-sm text-gray-600">{doc.description}</p>
                               </div>
                             </div>
                             <div className="flex items-center space-x-2">
                               <a
                                 href={doc.url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                               >
                                 Ver
                               </a>
                               <button
                                 onClick={() => handleDeleteDocument(selectedProjectForDocument.id, type)}
                                 className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                               >
                                 Eliminar
                               </button>
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="text-center py-8 text-gray-600">
                         <div className="text-4xl mb-2">📄</div>
                         <p className="text-black">No hay documentos agregados</p>
                       </div>
                     )}
                   </div>

                   {/* Sección: Agregar nuevo documento */}
                   <div>
                     <h4 className="text-lg font-semibold mb-4" style={{color: '#1e4e78'}}>
                       Agregar Nuevo Documento
                     </h4>
                     
                     <div className="space-y-4">
                       {/* Tipo de documento */}
                       <div>
                         <label className="block text-sm font-medium text-black mb-2">
                           Tipo de Documento *
                         </label>
                         <select
                           value={documentType}
                           onChange={(e) => setDocumentType(e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                         >
                           <option value="">Seleccionar tipo</option>
                           <option value="contract">Contrato</option>
                           <option value="plans">Planos</option>
                           <option value="budget">Presupuesto</option>
                           <option value="technical">Especificaciones Técnicas</option>
                           <option value="legal">Documentos Legales</option>
                           <option value="financial">Documentos Financieros</option>
                           <option value="general">General</option>
                         </select>
                       </div>

                       {/* Título del documento */}
                       <div>
                         <label className="block text-sm font-medium text-black mb-2">
                           Título del Documento *
                         </label>
                         <input
                           type="text"
                           value={documentTitle}
                           onChange={(e) => setDocumentTitle(e.target.value)}
                           placeholder="Ej: Contrato de Construcción"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500"
                         />
                       </div>

                       {/* Descripción */}
                       <div>
                         <label className="block text-sm font-medium text-black mb-2">
                           Descripción
                         </label>
                         <textarea
                           value={documentDescription}
                           onChange={(e) => setDocumentDescription(e.target.value)}
                           placeholder="Descripción del documento (opcional)"
                           rows={3}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500"
                         />
                       </div>

                       {/* Selección de archivo */}
                       <div>
                         <label className="block text-sm font-medium text-black mb-2">
                           Archivo *
                         </label>
                         <input
                           type="file"
                           accept=".pdf,.doc,.docx"
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               setSelectedDocumentFile(file);
                             }
                           }}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                         />
                         {selectedDocumentFile && (
                           <p className="mt-2 text-sm text-black font-medium">
                             Archivo seleccionado: {selectedDocumentFile.name}
                           </p>
                         )}
                       </div>

                       {/* Botones */}
                       <div className="flex space-x-3 pt-4">
                         <button
                           onClick={handleAddDocument}
                           disabled={!selectedDocumentFile || !documentType || !documentTitle}
                           className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                         >
                           📤 Subir Documento
                         </button>
                         <button
                           onClick={() => {
                             setShowDocumentModal(false);
                             setSelectedProjectForDocument(null);
                             setSelectedDocumentFile(null);
                             setDocumentType('');
                             setDocumentTitle('');
                             setDocumentDescription('');
                           }}
                           className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                         >
                           Cancelar
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}
      </div>
    </RouteGuard>
  );
}
