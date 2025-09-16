# 🏗️ Grupo SHVC - Página Web Corporativa

Página web profesional para Grupo SHVC, una constructora especializada en proyectos residenciales y comerciales.

## ✨ Características

### 🏠 Página Principal
- **Diseño moderno y responsivo** con Tailwind CSS
- **Secciones informativas**: Servicios, Proyectos, Contacto
- **Navegación fluida** con scroll suave
- **Call-to-actions** estratégicamente ubicados

### 🔐 Sistema de Clientes
- **Login seguro** para acceso de clientes
- **Registro de nuevos clientes** con formulario completo
- **Dashboard personalizado** con información del proyecto
- **Gestión de archivos**: fotos, documentos, estados de pago

### 📱 Experiencia Móvil
- **Navegación móvil** optimizada
- **Diseño responsivo** en todos los dispositivos
- **Interacciones táctiles** mejoradas

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.4.4
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Ruteo**: App Router (estructura moderna)
- **Linting**: ESLint configurado
- **Alias**: @/ para importaciones limpias

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd gruposhvc

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   └── MobileNav.tsx   # Navegación móvil
│   ├── dashboard/           # Dashboard de clientes
│   │   └── page.tsx        # Página principal del dashboard
│   ├── login/              # Sistema de autenticación
│   │   └── page.tsx        # Página de login
│   ├── registro/           # Registro de nuevos clientes
│   │   └── page.tsx        # Formulario de registro
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
```

## 🎨 Páginas Implementadas

### 1. Página Principal (`/`)
- **Header** con navegación y logo
- **Hero Section** con llamada a la acción
- **Sección de Servicios** con iconos y descripciones
- **Galería de Proyectos** con estados
- **Call-to-Action** para contacto
- **Footer** con información de contacto

### 2. Login (`/login`)
- **Formulario de autenticación** con validación
- **Estados de carga** y feedback visual
- **Enlaces** a registro y recuperación de contraseña
- **Diseño responsivo** y accesible

### 3. Registro (`/registro`)
- **Formulario completo** para nuevos clientes
- **Campos obligatorios** y opcionales
- **Validación en tiempo real**
- **Confirmación de envío** exitoso

### 4. Dashboard (`/dashboard`)
- **Vista general** del proyecto
- **Pestañas organizadas**: Resumen, Fotos, Pagos, Documentos
- **Información financiera** y progreso
- **Gestión de archivos** simulada

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Personalización
- **Colores**: Modificar variables en `globals.css`
- **Contenido**: Actualizar textos en los componentes
- **Imágenes**: Reemplazar placeholders con imágenes reales

## 📱 Responsive Design

El sitio está optimizado para:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

## 🔮 Próximos Pasos

### Backend Integration
- [ ] **Prisma ORM** para base de datos
- [ ] **Autenticación** con Auth.js o JWT
- [ ] **API Routes** para operaciones CRUD
- [ ] **Upload de archivos** a S3

### AWS Deployment
- [ ] **S3** para archivos estáticos
- [ ] **CloudFront** como CDN
- [ ] **Lambda + API Gateway** para backend
- [ ] **RDS PostgreSQL** para base de datos

### Funcionalidades Adicionales
- [ ] **Chat en vivo** para clientes
- [ ] **Notificaciones** push
- [ ] **Reportes** automáticos
- [ ] **Integración** con correo corporativo

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

**Grupo SHVC**
- 📧 info@gruposhvc.com
- 📞 +52 (55) 1234-5678
- 🌐 [www.gruposhvc.com](https://www.gruposhvc.com)

---

Desarrollado con ❤️ para Grupo SHVC
