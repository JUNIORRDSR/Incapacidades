import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para agregar el token JWT
api.interceptors.request.use(
  (config) => {
    // Obtener token desde localStorage
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
        } catch (error) {
          console.error('Error parsing auth storage:', error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const { status } = error.response;

      if (status === 401) {
        // Token inválido o expirado - limpiar auth y redirigir
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        console.error('No tienes permisos para realizar esta acción');
      }

      if (status === 404) {
        console.error('Recurso no encontrado');
      }

      if (status >= 500) {
        console.error('Error del servidor. Intenta nuevamente más tarde.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
