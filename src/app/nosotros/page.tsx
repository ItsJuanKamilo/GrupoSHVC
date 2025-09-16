"use client";
import { useEffect, useState } from "react";


export default function Nosotros() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
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
            Sobre Nosotros
          </h1>
          <p className={`text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-gray-200 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Más de 15 años construyendo el futuro con excelencia y compromiso
          </p>
          
          {/* Botones integrados en el flujo */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
            <a
              href="#historia"
              className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-center"
              style={{backgroundColor: '#1e4e78', border: '1px solid rgba(46, 116, 180, 0.2)'}}
            >
              Nuestra historia
            </a>
            <a
              href="#valores"
              className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-center"
              style={{backgroundColor: '#bcd6ee', border: '1px solid rgba(188, 214, 238, 0.2)', color: '#1e4e78'}}
            >
              Nuestros valores
            </a>
          </div>
        </div>
      </section>

      {/* Historia Section */}
      <section id="historia" className="py-32 scroll-mt-20" style={{
        background: 'linear-gradient(to bottom, #2e74b4 0%, #2e74b4 95%, rgba(46, 116, 180, 0.8) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Nuestra Historia</h2>
              <div className="space-y-6 text-lg text-white/90">
                <p>
                  Fundada en 2008, nuestra empresa nació con la visión de transformar el sector de la construcción 
                  a través de la innovación, la calidad y el compromiso con nuestros clientes.
                </p>
                <p>
                  Comenzamos como un pequeño equipo de profesionales apasionados por la construcción, 
                  y hoy somos una empresa líder con más de 200 proyectos completados exitosamente.
                </p>
                <p>
                  Nuestro crecimiento ha sido impulsado por la confianza de nuestros clientes, 
                  la excelencia en cada proyecto y la innovación constante en nuestros métodos de trabajo.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">200+</div>
                  <div className="text-sm text-white/80">Proyectos Completados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">15+</div>
                  <div className="text-sm text-white/80">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">50+</div>
                  <div className="text-sm text-white/80">Profesionales</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="aspect-video rounded-2xl mb-6 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #2e74b4, #1e4e78)'}}>
                  <span className="text-6xl">🏗️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
                <p className="text-gray-600">
                  Construir espacios que inspiren, innoven y perduren, 
                  superando las expectativas de nuestros clientes en cada proyecto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section id="valores" className="py-32 scroll-mt-20" style={{
        background: 'linear-gradient(to bottom, #9cc3e7 0%, #9cc3e7 95%, rgba(156, 195, 231, 0.8) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nuestros Valores</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Los principios que guían cada decisión y cada proyecto que emprendemos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{backgroundColor: '#2e74b4'}}>
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Excelencia</h3>
              <p className="text-gray-600">
                Buscamos la perfección en cada detalle, desde la planificación hasta la entrega final.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{backgroundColor: '#1e4e78'}}>
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Confianza</h3>
              <p className="text-gray-600">
                Construimos relaciones duraderas basadas en la transparencia y el cumplimiento.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{backgroundColor: '#9cc3e7'}}>
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovación</h3>
              <p className="text-gray-600">
                Adoptamos nuevas tecnologías y métodos para mejorar continuamente.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{backgroundColor: '#bcd6ee'}}>
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sostenibilidad</h3>
              <p className="text-gray-600">
                Comprometidos con el medio ambiente y las prácticas responsables.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{backgroundColor: '#2e74b4'}}>
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Seguridad</h3>
              <p className="text-gray-600">
                La seguridad de nuestro equipo y clientes es nuestra prioridad absoluta.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{backgroundColor: '#1e4e78'}}>
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Compromiso</h3>
              <p className="text-gray-600">
                Cumplimos con los plazos y presupuestos acordados sin excepciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo Section */}
      <section className="py-32" style={{
        background: 'linear-gradient(to bottom, #bcd6ee 0%, #bcd6ee 95%, rgba(188, 214, 238, 0.8) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nuestro Equipo</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Profesionales expertos comprometidos con la excelencia en cada proyecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #2e74b4, #1e4e78)'}}>
                <span className="text-3xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Carlos Rodríguez</h3>
              <p className="font-semibold mb-4" style={{color: '#2e74b4'}}>Director General</p>
              <p className="text-gray-600 text-sm">
                Más de 20 años de experiencia en gestión de proyectos de construcción.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #9cc3e7, #2e74b4)'}}>
                <span className="text-3xl">👩‍💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ana Martínez</h3>
              <p className="font-semibold mb-4" style={{color: '#2e74b4'}}>Arquitecta Principal</p>
              <p className="text-gray-600 text-sm">
                Especialista en diseño sostenible y arquitectura moderna.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #bcd6ee, #9cc3e7)'}}>
                <span className="text-3xl">👨‍🔧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Miguel López</h3>
              <p className="font-semibold mb-4" style={{color: '#2e74b4'}}>Ingeniero de Proyectos</p>
              <p className="text-gray-600 text-sm">
                Experto en planificación y ejecución de obras complejas.
              </p>
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
            ¿Listo para construir juntos?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Únete a los clientes satisfechos que han confiado en nosotros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              style={{backgroundColor: '#1e4e78'}}
            >
              Contáctanos
            </a>
            <a
              href="/obras"
              className="text-gray-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              style={{backgroundColor: '#9cc3e7', border: '2px solid #9cc3e7'}}
            >
              Ver nuestras obras
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 