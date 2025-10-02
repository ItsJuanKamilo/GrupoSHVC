export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white" style={{background: '#1e4e78'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center justify-center md:justify-start space-x-4 text-center md:text-left">
              <img 
                src="https://gruposhvc.s3.dualstack.us-east-1.amazonaws.com/archivos_gruposhvc/archivos_principal/Only_Logo.jpg"
                alt="Grupo SHVC Logo"
                className="w-16 h-28 object-contain hover:scale-105 transition-all duration-300"
              />
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold text-white tracking-tight">Grupo SHVC</h3>
                <p className="text-sm text-white/80 tracking-wide">Ingeniería y Construcción</p>
              </div>
            </div>
              <p className="text-gray-300 mb-6 max-w-md mx-auto md:mx-0 text-center md:text-left">
               Somos una constructora con más de 17 años de experiencia, formada por profesionales 
               que desde 2007 han trabajado juntos construyendo para otras empresas. En 2023 decidieron unirse para formar 
               <strong> Grupo SHVC</strong> y abordar proyectos propios.
             </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-white">Servicios</h4>
                         <ul className="space-y-3 text-gray-300 flex flex-col items-center md:items-start">
               <li><a href="/obras?categoria=residencial" className="hover:text-white transition-colors duration-300">
                 Construcción Residencial
               </a></li>
               <li><a href="/obras?categoria=comercial" className="hover:text-white transition-colors duration-300">
                 Planos y Diseño
               </a></li>
               <li><a href="/obras?categoria=industrial" className="hover:text-white transition-colors duration-300">
                 Mantenciones Industriales
               </a></li>
             </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-white">Contacto</h4>
                         <ul className="space-y-3 text-gray-300">
               <li className="flex items-center justify-center md:justify-start">
                 <a href="https://wa.me/56979925704" className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                   <span>+56 9 7992 5704 (WhatsApp)</span>
                 </a>
               </li>
                               <li className="flex items-center justify-center md:justify-start">
                  <a href="mailto:shernandez@gruposhvc.cl" className="hover:text-white transition-colors duration-300">
                    shernandez@gruposhvc.cl
                  </a>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <span>Lun - Vie: 8:00 - 18:00</span>
                </li>
             </ul>
          </div>
        </div>
                 <div className="border-t mt-12 pt-8" style={{borderColor: '#9cc3e7'}}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <img 
                src="https://gruposhvc.s3.dualstack.us-east-1.amazonaws.com/archivos_gruposhvc/archivos_principal/Only_Logo.jpg"
                alt="Grupo SHVC Logo"
                className="w-6 h-10 object-contain"
              />
              <p className="text-gray-400 text-sm">© 2025 Grupo SHVC. Todos los derechos reservados.</p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/contacto" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Contacto</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


