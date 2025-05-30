// src/stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => {
    let usuario = null;
    const usuarioStored = localStorage.getItem("usuario");
    if (usuarioStored) {
      try {
        usuario = JSON.parse(usuarioStored);
      } catch (error) {
        console.error("Error al analizar el usuario de localStorage:", error);
      }
    }

    return {
      token: localStorage.getItem("token") || null,
      usuario: usuario, // usuario.rol debería tener el objeto rol populado desde el backend
    };
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    clearToken() {
      this.token = null;
      this.usuario = null;
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    },
    setUsuario(usuario) {
      this.usuario = usuario;
      localStorage.setItem("usuario", JSON.stringify(usuario));
    },
  },
  // Getters para facilitar la verificación de roles
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.usuario,
    userRole: (state) => {
      // Asumiendo que el backend popula el objeto rol completo en usuario.rol
      return state.usuario && state.usuario.rol
        ? state.usuario.rol.nombre
        : null;
    },
    isAdmin: (state) => {
      const roleName =
        state.usuario && state.usuario.rol ? state.usuario.rol.nombre : null;
      return (
        roleName === "Administrador" ||
        roleName === "Soporte Nivel 1" ||
        roleName === "Soporte Nivel 2" ||
        roleName === "Soporte Nivel 3" ||
        roleName === "Gerente de Soporte"
      );
    },
    isVentas: (state) => {
      const roleName =
        state.usuario && state.usuario.rol ? state.usuario.rol.nombre : null;
      return (
        roleName === "Gerente Comercial" ||
        roleName === "Ejecutivo de Ventas" ||
        roleName === "Ventas" ||
        roleName === "Gerente de Preventa" ||
        roleName === "Analista de Preventa" ||
        roleName === "Consultor de Preventa"
      );
    },
    isDesarrollo: (state) => {
      const roleName =
        state.usuario && state.usuario.rol ? state.usuario.rol.nombre : null;
      return (
        roleName === "Desarrollador Senior" ||
        roleName === "Líder de Proyecto" ||
        roleName === "Desarrollador Junior" ||
        roleName === "Desarrollador Full Stack" ||
        roleName === "Desarrollador Backend" ||
        roleName === "Desarrollador Frontend" ||
        roleName === "Arquitecto de Software" ||
        roleName === "Ingeniero de Software" ||
        roleName === "Ingeniero de Datos" ||
        roleName === "Ingeniero de Machine Learning" ||
        roleName === "Ingeniero de DevOps" ||
        roleName === "Líder de QA" ||
        roleName === "Tester Manual" ||
        roleName === "Tester Automático" ||
        roleName === "Diseñador UX" ||
        roleName === "Diseñador UI" ||
        roleName === "Investigador de Usuario"
      ); // Ajusta los nombres
    },
    // Puedes añadir más getters para combinaciones o permisos específicos si los tuvieras
    // Por ejemplo: canManageUsers: (state) => state.usuario?.rol?.permisos?.includes('gestionar_usuarios')
  },
});
