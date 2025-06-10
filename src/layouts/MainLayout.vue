<template>
  <q-layout view="lHh LpR lFf">
    <div>
      <q-header class="bg-white text-primary shadow-2">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
            class="q-mr-sm"
          />
          <q-toolbar-title class="text-h6">SYSFUN SYSTEM</q-toolbar-title>

          <q-btn flat round dense to="/notificaciones-oportunidades">
            <q-badge
              color="red"
              floating
              transparent
              :label="notificaciones.length"
            />
            <q-icon name="notifications" />
          </q-btn>
          <q-btn
            round
            flat
            icon="settings"
            aria-label="Settings"
            class="q-mr-sm"
          />
          <q-btn round flat>
            <q-avatar size="30px">
              <img v-if="imagenUsuario" :src="imagenUsuario" />
              <img v-else src="/public/profile.svg" />
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md">Settings</div>
                    <q-toggle v-model="mobileData" label="Use Mobile Data" />
                    <q-toggle v-model="bluetooth" label="Bluetooth" />
                  </div>

                  <q-separator vertical inset class="q-mx-lg" />

                  <div class="column items-center">
                    <q-avatar size="72px" class="q-mb-sm">
                      <img v-if="imagenUsuario" :src="imagenUsuario" />
                      <img v-else src="/public/profile.svg" />
                    </q-avatar>

                    <div
                      v-if="authStore.usuario"
                      class="text-subtitle1 q-mt-md q-mb-xs"
                    >
                      {{ authStore.usuario.nombres }}
                      {{ authStore.usuario.apellidos }}
                    </div>
                    <q-btn
                      round
                      flat
                      icon="logout"
                      aria-label="Cerrar Sesión"
                      @click="cerrarSesion"
                    />
                  </div>
                </div>
              </q-menu>
            </q-avatar>
          </q-btn>
        </q-toolbar>
      </q-header>
    </div>
    <div>
      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #ddd;
          "
        >
          <q-list padding>
            <q-item clickable v-ripple to="/index">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section> Dashboard </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/perfil">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section> Perfil </q-item-section>
            </q-item>

            <q-expansion-item
              v-if="authStore.isAdmin || authStore.isVentas"
              label="Soporte de Flujo de Trabajo"
              icon="work"
              expand-separator
            >
              <q-list>
                <q-item clickable v-ripple to="/gestionar-clientes">
                  <q-item-section avatar>
                    <q-icon name="people" />
                  </q-item-section>
                  <q-item-section> Clientes </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/gestionar-contratos">
                  <q-item-section avatar>
                    <q-icon name="assignment_turned_in" />
                  </q-item-section>
                  <q-item-section> Contratos </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item
              v-if="authStore.isAdmin || authStore.isVentas"
              label="Area Comercial"
              icon="business_center"
              expand-separator
            >
              <q-list>
                <q-item clickable v-ripple to="/gestionar-clientes">
                  <q-item-section avatar>
                    <q-icon name="wallet" />
                  </q-item-section>
                  <q-item-section> Cartera de Clientes </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/gestionar-prospectos">
                  <q-item-section avatar>
                    <q-icon name="person_search" />
                  </q-item-section>
                  <q-item-section> Registrar Prospecto / Lead </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/interacciones-clientes">
                  <q-item-section avatar>
                    <q-icon name="phone" />
                  </q-item-section>
                  <q-item-section> Interacciones </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/gestionar-reuniones">
                  <q-item-section avatar>
                    <q-icon name="event" />
                  </q-item-section>
                  <q-item-section> Gestionar Reuniones </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/gestionar-oportunidades">
                  <q-item-section avatar>
                    <q-icon name="insights" />
                  </q-item-section>
                  <q-item-section> Gestionar Oportunidades </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/asignar-oportunidades">
                  <q-item-section avatar>
                    <q-icon name="assignment_ind" />
                  </q-item-section>
                  <q-item-section> Asignar Oportunidad </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/gestionar-propuestas">
                  <q-item-section avatar>
                    <q-icon name="assignment" />
                  </q-item-section>
                  <q-item-section> Propuestas Tecnicas </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/gestionar-estimaciones">
                  <q-item-section avatar>
                    <q-icon name="assignment_ind" />
                  </q-item-section>
                  <q-item-section> Gestionar Estimaciones </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="manage_search" />
                  </q-item-section>
                  <q-item-section> Detallar Oportunidad </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/aprobar-propuesta">
                  <q-item-section avatar>
                    <q-icon name="sell" />
                  </q-item-section>
                  <q-item-section>
                    Aprobar Descuentos especiales
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/reporte-ventas">
                  <q-item-section avatar>
                    <q-icon name="sell" />
                  </q-item-section>
                  <q-item-section> Reporte de ventas </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/pipeline-ventas">
                  <q-item-section avatar>
                    <q-icon name="sell" />
                  </q-item-section>
                  <q-item-section> Pipeline de ventas </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/vizualizar-pipeline-ventas">
                  <q-item-section avatar>
                    <q-icon name="eye" />
                  </q-item-section>
                  <q-item-section>
                    Visualizar Pipeline de Ventas
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/enviar-cotizacion">
                  <q-item-section avatar>
                    <q-icon name="send" />
                  </q-item-section>
                  <q-item-section> Enviar Cotizacion </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <q-expansion-item
              v-if="authStore.isAdmin || authStore.isVentas"
              label="Area de Preventa"
              icon="handshake"
              expand-separator
            >
              <q-list>
                <q-expansion-item
                  v-if="authStore.isAdmin || authStore.isVentas"
                  label="Propuestas tecnicas"
                  icon="integration_instructions"
                  expand-separator
                >
                  <q-item clickable v-ripple to="/gestionar-propuestas">
                    <q-item-section avatar>
                      <q-icon name="attach_money" />
                    </q-item-section>
                    <q-item-section> Propuestas Tecnicas </q-item-section>
                  </q-item>

                  <q-item clickable v-ripple to="/aprobar-propuesta">
                    <q-item-section avatar>
                      <q-icon name="attach_money" />
                    </q-item-section>
                    <q-item-section> Aprobar Propuesta Tecnica</q-item-section>
                  </q-item>
                </q-expansion-item>

                <q-item clickable v-ripple to="/gestionar-base-conocimientos">
                  <q-item-section avatar>
                    <q-icon name="people" />
                  </q-item-section>
                  <q-item-section>
                    Gestiona base de conocimientos
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="attach_money" />
                  </q-item-section>
                  <q-item-section> Funcionalidad 2 </q-item-section>
                </q-item>
                <q-expansion-item
                  v-if="authStore.isAdmin || authStore.isVentas"
                  label="Repositorio de Ventas"
                  icon="monetization_on"
                  expand-separator
                >
                  <q-item
                    clickable
                    v-ripple
                    to="/gestionar-propuestas-tecnicas"
                  >
                    <q-item-section avatar>
                      <q-icon name="attach_money" />
                    </q-item-section>
                    <q-item-section> Propuestas Tecnicas </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-ripple
                    to="/gestionar-diagrama-arquitectura"
                  >
                    <q-item-section avatar>
                      <q-icon name="attach_money" />
                    </q-item-section>
                    <q-item-section> Diagrama de Arquitectura </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-ripple
                    to="/gestionar-documentos-relevantes"
                  >
                    <q-item-section avatar>
                      <q-icon name="attach_money" />
                    </q-item-section>
                    <q-item-section> Documentos Relevantes </q-item-section>
                  </q-item>
                </q-expansion-item>
                <q-item clickable v-ripple to="/gestionar-proyectos">
                  <q-item-section avatar>
                    <q-icon name="code" />
                  </q-item-section>
                  <q-item-section> Proyectos </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/gestionar-contratos">
                  <q-item-section avatar>
                    <q-icon name="assignment_turned_in" />
                  </q-item-section>
                  <q-item-section> Contratos </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item
              v-if="authStore.isAdmin"
              label="Administración"
              icon="admin_panel_settings"
              expand-separator
            >
              <q-list>
                <q-item clickable v-ripple to="/gestionar-usuarios">
                  <q-item-section avatar>
                    <q-icon name="manage_accounts" />
                  </q-item-section>
                  <q-item-section> Gestionar Usuarios </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/gestionar-areas">
                  <q-item-section avatar>
                    <q-icon name="business" />
                  </q-item-section>
                  <q-item-section> Gestión de Áreas </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/gestionar-roles">
                  <q-item-section avatar>
                    <q-icon name="supervisor_account" />
                  </q-item-section>
                  <q-item-section> Gestion de roles </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item
              v-if="authStore.isAdmin || authStore.isDesarrollo"
              label="Módulo de Desarrollo"
              icon="code"
              expand-separator
            >
              <q-list>
                <q-item clickable v-ripple to="/proyectos-desarrollo">
                  <q-item-section avatar>
                    <q-icon name="code" />
                  </q-item-section>
                  <q-item-section> Proyectos de Desarrollo </q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/desarrollo/tareas">
                  <q-item-section avatar>
                    <q-icon name="task" />
                  </q-item-section>
                  <q-item-section> Tareas </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/desarrollo/equipos">
                  <q-item-section avatar>
                    <q-icon name="group" />
                  </q-item-section>
                  <q-item-section> Equipos </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://img.freepik.com/fotos-premium/imagen-fondo-empresarial-cuadros-graficos-financieros_1021632-971.jpg?w=1380"
          style="height: 150px"
        >
          <div
            class="absolute-bottom bg-transparent"
            style="color: darkblue; font-size: medium"
          >
            <q-avatar size="56px" class="q-mb-sm">
              <img v-if="imagenUsuario" :src="imagenUsuario" />
              <img v-else src="/public/profile.svg" />
            </q-avatar>
            <div v-if="authStore.usuario" class="text-weight-bold">
              {{ authStore.usuario.nombres }} {{ authStore.usuario.apellidos }}
            </div>
            <div v-if="authStore.usuario">{{ authStore.usuario.correo }}</div>
          </div>
        </q-img>

        <!-- <div class="q-pa-md absolute-bottom-center" style="margin: auto">
          <q-btn
            round
            flat
            icon="logout"
            aria-label="Cerrar Sesión"
            @click="cerrarSesion"
          />
        </div> -->
      </q-drawer>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth"; // Asegúrate que la ruta sea correcta
import { useRouter } from "vue-router";
import api from "../api"; // Asegúrate que la ruta sea correcta

defineOptions({
  name: "MainLayout",
});
// Notificaciones simuladas
const notificaciones = ref([
  { id: 1, mensaje: "Nueva oportunidad: Empresa Alpha" },
  { id: 2, mensaje: "Nueva oportunidad: Grupo Beta" },
  { id: 3, mensaje: "Nueva oportunidad: Inversiones Gamma" },
]);

const authStore = useAuthStore();
const router = useRouter();
const leftDrawerOpen = ref(false);
const mobileData = ref(true); // Estos parecen ser de ejemplo, puedes mantenerlos o quitarlos
const bluetooth = ref(false); // Estos parecen ser de ejemplo, puedes mantenerlos o quitarlos
const imagenUsuario = ref(null);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const cerrarSesion = () => {
  authStore.clearToken();
  router.push("/login");
};

onMounted(async () => {
  // Es buena práctica verificar si el usuario y su _id existen antes de hacer la llamada
  if (authStore.usuario && authStore.usuario._id) {
    try {
      // Asumiendo que tu instancia 'api' está configurada para enviar el token
      // o que el interceptor de 'api.js' que te sugerí está implementado.
      // Si no, necesitas añadir el header de Authorization aquí también.
      const response = await api.get(`/auth/imagen/${authStore.usuario._id}`, {
        headers: {
          // Si tu 'api' no añade el token automáticamente, descomenta esto:
          Authorization: `Bearer ${authStore.token}`, // Es importante el `Bearer ` si tu backend lo espera
        },
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      imagenUsuario.value = imageUrl;
    } catch (error) {
      console.error("Error al obtener la imagen del usuario:", error);
      // Considera establecer una imagen de perfil por defecto en caso de error
      // imagenUsuario.value = '/public/profile_error.svg';
    }
  }
});
</script>

<style scoped>
.absolute-bottom-center {
  position: absolute;
  bottom: 0;
  left: 50%; /* Centrar horizontalmente */
  transform: translateX(-50%);
  width: 100%;
  padding: 16px;
}

/* Estilos para el toolbar */
.q-header {
  margin: 5px 20px 5px 0px; /* Centramos horizontalmente */
  border-radius: 10px; /* Esquinas redondeadas */
  position: fixed;
  margin-left: 20px;
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Fondo blanco con transparencia */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Sombra suave para dar profundidad */
  z-index: 10; /* Aseguramos que esté por encima de otros elementos */
  padding: 10px 16px 10px 16px; /* Espaciado interno */

  max-width: 100%; /* Ancho completo para dispositivos */

  /* Estas propiedades están duplicadas, las puedes quitar */
  /* z-index: 10; */
  /* background-color: rgba(255, 255, 255, 0.9); */
  /* box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); */
}
.q-header .q-btn {
  margin-right: 8px; /* Reducimos el espacio entre los botones */
}

.q-header .q-avatar {
  width: 32px;
  height: 32px; /* Tamaño más pequeño para el avatar */
}

/* Espaciado en el toolbar */
.q-toolbar {
  justify-content: space-between; /* Distribuye el contenido en la barra de herramientas */
}
</style>
