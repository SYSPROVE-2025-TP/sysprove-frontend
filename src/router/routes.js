const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/index",
        component: () => import("pages/Dashboard/HomePage.vue"),
      },
      {
        path: "/perfil",
        component: () => import("pages/Dashboard/PerfilUsuario.vue"),
      },
      //Modulo de soporte
      {
        path: "/gestionar-usuarios",
        component: () =>
          import("pages/Dashboard/Administrador/GestionarUsuarios.vue"),
      },
      {
        path: "/gestionar-areas",
        component: () =>
          import("pages/Dashboard/Administrador/GestionarAreas.vue"),
      },
      {
        path: "/gestionar-roles",
        component: () =>
          import("pages/Dashboard/Administrador/GestionarRoles.vue"),
      },
      //Modulo de Ventas
      {
        path: "/gestionar-clientes",
        component: () => import("pages/Dashboard/Ventas/GestionarClientes.vue"),
      },
      {
        path: "/gestionar-prospectos",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarProspectos.vue"),
      },
      {
        path: "/interacciones-clientes",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarInteracciones.vue"),
      },
      {
        path: "/gestionar-reuniones",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarReuniones.vue"),
      },
      {
        path: "/gestionar-propuestas",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarPropuestas.vue"),
      },
      {
        path: "/gestionar-contratos",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarContratos.vue"),
      },
      {
        path: "/notificaciones-oportunidades",
        component: () =>
          import("pages/Dashboard/Ventas/NotificacionOportunidades.vue"),
      },
      {
        path: "/pipeline-ventas",
        component: () => import("pages/Dashboard/Ventas/PipeLineVentas.vue"),
      },
      {
        path: "/reporte-ventas",
        component: () => import("pages/Dashboard/Ventas/ReporteDeVentas.vue"),
      },
      {
        path: "/gestionar-propuestas-tecnicas",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarPropuestasTecnicas.vue"),
      },

      {
        path: "/gestionar-diagrama-arquitectura",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarDiagramaArquitectura.vue"),
      },

      {
        path: "/gestionar-documentos-relevantes",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarDocumentosRelevantes.vue"),
      },
      {
        path: "/gestionar-base-conocimientos",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarBasedeConocimiento.vue"),
      },
      {
        path: "/enviar-cotizacion",
        component: () =>
          import("src/pages/Dashboard/Ventas/EnviarCotizacion.vue"),
      },
      {
        path: "/gestionar-estimaciones",
        component: () =>
          import("src/pages/Dashboard/Ventas/GestionarEstimaciones.vue"),
      },
      {
        path: "/asignar-oportunidades",
        component: () =>
          import("src/pages/Dashboard/Ventas/AsignarOportunidades.vue"),
      },
      {
        path: "/gestionar-oportunidades",
        component: () =>
          import("src/pages/Dashboard/Ventas/GestionarOportunidades.vue"),
      },
      {
        path: "/feedback-ventas",
        component: () =>
          import("src/pages/Dashboard/Ventas/GestionarFeedbackDesarrollo.vue"),
      },
      //Modulo de Desarrollo
      {
        path: "/dashboard-desarrollo",
        component: () => import("pages/Dashboard/Desarrollo/DashboardDev.vue"),
      },
      {
        path: "/feedback-desarrollo",
        component: () =>
          import("src/pages/Dashboard/Desarrollo/EnviarFeedbackaVentas.vue"),
      },
      {
        path: "/gestionar-proyectos",
        component: () =>
          import("pages/Dashboard/Desarrollo/GestionarProyectos.vue"),
      },
      {
        path: "/proyectos-desarrollo",
        component: () =>
          import("pages/Dashboard/Desarrollo/ProyectosDesarrolloPage.vue"),
      },
      {
        path: "/aprobar-propuesta",
        component: () =>
          import("pages/Dashboard/Ventas/AprobacionPropuestas.vue"),
      },
      {
        path: "/vizualizar-pipeline-ventas",
        component: () => import("src/pages/Dashboard/PipeVentasPage.vue"),
      },
      {
        path: "/gestionar-casos-prueba",
        component: () =>
          import("src/pages/Dashboard/Desarrollo/CasosPrueba.vue"),
      },
      {
        path: "/gestionar-defectos",
        component: () =>
          import("src/pages/Dashboard/Desarrollo/GestionarDefectos.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/restablecer-contraseña",
    component: () => import("pages/RestablecerContraseña.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
