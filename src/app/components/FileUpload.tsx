"use client";
import { useState, useRef } from 'react';
import Swal from 'sweetalert2';

interface FileUploadProps {
  onFileSelected: (file: File | null) => void;  // Cambiar de onFileUploaded
  currentUrl?: string;
  category?: string; // Nueva prop para categoría
}

export default function FileUpload({ onFileSelected, currentUrl, category = 'logos' }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validar tipo de archivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        title: 'Tipo de archivo no válido',
        text: 'Por favor selecciona una imagen (PNG, JPG, JPEG, GIF, WebP)',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Validar extensión del archivo
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      Swal.fire({
        title: 'Extensión de archivo no válida',
        text: 'Por favor selecciona una imagen con extensión válida (PNG, JPG, JPEG, GIF, WebP)',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Archivo muy grande',
        text: 'El archivo debe ser menor a 5MB',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // ← CAMBIAR: Solo notificar que hay un archivo seleccionado
    onFileSelected(file);  // ← En lugar de uploadToS3(file)
  };

  // ← COMENTAR: Función uploadToS3 ya no se usa
  /*
  const uploadToS3 = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

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
          category: category
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener URL de subida');
      }

      const { uploadUrl, key, bucketName } = await response.json();
      setUploadProgress(30);

      // 2. Subir archivo directamente a S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Error al subir archivo a S3');
      }

      setUploadProgress(100);

      // 3. Construir URL final del archivo
      const finalUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
      
      setIsUploading(false);
      setUploadProgress(0);
      
      // Notificar al componente padre
      // onFileUploaded(finalUrl);  // ← Comentado ya que no se usa
      
      Swal.fire({
        title: '¡Archivo subido exitosamente!',
        text: `El archivo se ha subido correctamente a S3 en la categoría: ${category}`,
        icon: 'success',
        confirmButtonColor: '#3086d6'
      });

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      
      console.error('Error al subir archivo:', error);
      
      Swal.fire({
        title: 'Error al subir archivo',
        text: 'No se pudo subir el archivo. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };
  */

  const removeFile = () => {
    setPreviewUrl(null);
    onFileSelected(null); // Notificar que no hay archivo seleccionado
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Área de drag & drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Preview del logo"
              className="w-24 h-24 mx-auto object-contain rounded-lg border border-gray-200"
            />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Logo seleccionado</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
              >
                🗑️ Remover
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📁</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Arrastra y suelta tu logo aquí
              </p>
              <p className="text-sm text-gray-500 mt-1">
                o haz clic para seleccionar archivo
              </p>
            </div>
            <div className="text-xs text-gray-400">
              PNG, JPG, JPEG hasta 5MB
            </div>
          </div>
        )}
      </div>

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Barra de progreso */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subiendo archivo...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
