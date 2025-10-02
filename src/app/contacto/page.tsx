"use client";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

export default function Contacto() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      message: ""
    };

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: '¡Mensaje enviado!',
      text: 'Nos pondremos en contacto contigo pronto.',
      icon: 'success',
      confirmButtonText: 'Perfecto',
      confirmButtonColor: '#3B82F6',
      background: '#ffffff',
      backdrop: `
        rgba(0,0,123,0.4)
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")
      `,
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        confirmButton: 'rounded-xl px-6 py-3 font-semibold'
      }
    });
  };

  const showErrorAlert = (message: string) => {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#EF4444',
      background: '#ffffff',
      backdrop: `
        rgba(239,68,68,0.4)
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")
      `,
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        confirmButton: 'rounded-xl px-6 py-3 font-semibold'
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showErrorAlert("Por favor, completa todos los campos correctamente.");
      return;
    }

    setIsLoading(true);
  
    try {
      // 1. Enviar datos al endpoint del Lambda para guardar en la base de datos
      const response = await fetch('https://47eh80tfbg.execute-api.us-east-1.amazonaws.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setIsLoading(false);
        showErrorAlert(result.message || "Error al enviar el mensaje. Inténtalo de nuevo.");
        return; // Si la inserción en la base de datos falla, no enviamos el correo
      }
  
      // 2. Enviar el correo utilizando el otro endpoint (solo si la base de datos fue exitosa)
      const emailResponse = await fetch('https://ldyf9h2az4.execute-api.us-east-1.amazonaws.com/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });
  
      const emailResult = await emailResponse.json();
  
      if (emailResponse.ok) {
        setIsLoading(false);
        showSuccessAlert();  // Mensaje de éxito si ambos pasos son exitosos
        // Limpiar formulario
        setFormData({
          name: "",
          email: "",
          message: ""
        });
      } else {
        setIsLoading(false);
        showErrorAlert(emailResult.message || "Error al enviar el correo. Inténtalo de nuevo.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error al enviar el mensaje:', error);
      showErrorAlert("Error de conexión. Por favor, inténtalo de nuevo.");
    }
  };
  

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-gray-900/90">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        </div>
        
        <div className={`relative z-10 text-center text-white max-w-4xl px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
            Contáctanos
          </h1>
          <p className={`text-xl md:text-2xl mb-8 text-gray-200 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Estamos aquí para ayudarte con tu próximo proyecto
          </p>
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section className="py-32" style={{
        background: 'linear-gradient(to bottom, #2e74b4 0%, #2e74b4 95%, rgba(46, 116, 180, 0.8) 100%)'
      }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Información de Contacto */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Hablemos</h2>
              <p className="text-xl text-white/90 mb-8">
                ¿Tienes un proyecto en mente? Nos encantaría escuchar sobre él. 
                Completa el formulario y nos pondremos en contacto contigo.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{backgroundColor: '#1e4e78'}}>
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Teléfono</h3>
                    <p className="text-white/80">+56 9 7992 5704</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{backgroundColor: '#9cc3e7'}}>
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p className="text-white/80">shernandez@gruposhvc.cl</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{backgroundColor: '#bcd6ee'}}>
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Dirección</h3>
                    <p className="text-white/80">J FERNANDEZ 5331 HUECHURABA</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{backgroundColor: '#2e74b4'}}>
                    <span className="text-2xl">🕒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Horarios</h3>
                    <p className="text-white/80">Lun - Vie: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                      errors.name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                      errors.email 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 placeholder-gray-500 ${
                      errors.message 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Cuéntanos sobre tu proyecto..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl transform ${
                    isLoading 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:shadow-2xl hover:-translate-y-1 hover:scale-105 active:scale-95'
                  }`}
                  style={{backgroundColor: '#1e4e78'}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'Enviar mensaje'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-32" style={{
        background: 'linear-gradient(to bottom, #bcd6ee 0%, #bcd6ee 95%, rgba(188, 214, 238, 0.8) 100%)'
      }}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Contáctanos hoy mismo y comencemos a construir tu proyecto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+56979925704"
              className="text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              style={{backgroundColor: '#1e4e78'}}
            >
              📞 Llamar ahora
            </a>
            <a
              href="mailto:shernandez@gruposhvc.cl"
              className="text-gray-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              style={{backgroundColor: '#9cc3e7', border: '2px solid #9cc3e7'}}
            >
              📧 Enviar email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 