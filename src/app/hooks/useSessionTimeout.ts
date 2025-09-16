"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export const useSessionTimeout = (timeoutMinutes: number = 60) => {
  const router = useRouter();
  const timeoutRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimeout = () => {
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Configurar timeout para 1 hora (60 minutos)
    timeoutRef.current = window.setTimeout(async () => {
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      
      // Mostrar notificación de sesión expirada con SweetAlert
      if (typeof window !== 'undefined') {
        await Swal.fire({
          title: 'Sesión Expirada',
          text: 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.',
          icon: 'warning',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#2C71B8',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: true,
          timer: 0
        });
      }
      
      // Redirigir al login
      router.push('/login');
    }, timeoutMinutes * 60 * 1000);
  };

  const clearSessionTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    // Solo activar si hay un token válido
    const token = localStorage.getItem('token');
    if (!token) return;

    // Configurar eventos de actividad del usuario
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimeout();
    };

    // Agregar listeners de eventos
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Inicializar el timeout
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearSessionTimeout();
    };
  }, [timeoutMinutes, router, resetTimeout]);

  return { resetTimeout, clearSessionTimeout };
};
