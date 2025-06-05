<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Gestión de Proyectos de Desarrollo</div>
        <div class="text-subtitle2">
          Visualiza y gestiona todos los proyectos en desarrollo.
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Crear Proyecto"
          @click="irACrearProyecto"
        />
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="40px" />
      <div class="q-ml-md text-grey-8">Cargando proyectos...</div>
    </div>

    <div
      v-else-if="!isLoading && proyectos.length === 0"
      class="text-center q-my-xl"
    >
      <q-icon name="upcoming" size="50px" color="grey-5" />
      <div class="text-h6 text-grey-7">No hay proyectos de desarrollo aún.</div>
      <div class="text-subtitle2 text-grey-6">
        ¡Crea el primero para empezar a gestionar!
      </div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div
        v-for="proyecto in proyectos"
        :key="proyecto._id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card
          class="project-card cursor-pointer"
          @click="verDetalles(proyecto._id)"
        >
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 ellipsis">{{ proyecto.nombre }}</div>
                <div class="text-subtitle2 text-grey-8 ellipsis">
                  Cliente: {{ proyecto.cliente?.nombre || "No asignado" }}
                </div>
              </div>
              <div class="col-auto">
                <q-chip
                  :color="getStatusColor(proyecto.estadoDesarrollo)"
                  text-color="white"
                  :label="proyecto.estadoDesarrollo"
                  square
                  class="text-weight-bold"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-caption text-grey">Equipo Principal</div>
            <q-list dense>
              <q-item>
                <q-item-section avatar>
                  <q-avatar
                    size="sm"
                    color="grey-7"
                    text-color="white"
                    icon="engineering"
                  />
                </q-item-section>
                <q-item-section>
                  Líder Técnico:
                  {{ proyecto.liderTecnico?.nombres || "No asignado" }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-caption text-grey">Fechas Clave</div>
            <div class="row text-body2">
              <div class="col-6">
                <strong>Inicio:</strong>
                {{ formatDate(proyecto.fechaInicioEstimada) }}
              </div>
              <div class="col-6">
                <strong>Fin:</strong>
                {{ formatDate(proyecto.fechaFinEstimada) }}
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat color="primary" @click.stop="irAlTablero(proyecto._id)"
              >Ir al Tablero</q-btn
            >
            <q-btn
              flat
              color="secondary"
              @click.stop="verDetalles(proyecto._id)"
              >Ver Detalles</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// Es crucial importar el store de autenticación para poder acceder al token
import { useAuthStore } from "../../../stores/auth"; // Asegúrate que esta ruta es correcta
import api from "../../../api";

const router = useRouter();
const authStore = useAuthStore(); // Crea una instancia del store
const proyectos = ref([]);
const isLoading = ref(true);

// --- LÓGICA DE OBTENCIÓN DE DATOS ---
const obtenerProyectos = async () => {
  isLoading.value = true;
  try {
    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    // Añadimos el objeto de configuración con los 'headers' manualmente,
    // igual que en tu componente GestionarProyectos.vue
    const response = await api.get("/api/proyectos-desarrollo", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    proyectos.value = response.data;
  } catch (error) {
    console.error("Error al obtener los proyectos de desarrollo:", error);
    // Considera añadir una notificación de error para el usuario aquí
  } finally {
    isLoading.value = false;
  }
};

// --- FUNCIONES DE NAVEGACIÓN ---
const irACrearProyecto = () => {
  router.push("/desarrollo/proyectos/crear");
};

const verDetalles = (proyectoId) => {
  router.push(`/desarrollo/proyectos/${proyectoId}`);
};

const irAlTablero = (proyectoId) => {
  router.push(`/desarrollo/proyectos/${proyectoId}/tablero`);
};

// --- FUNCIONES UTILITARIAS ---
const getStatusColor = (status) => {
  // ... (tu lógica de colores)
  switch (status) {
    case "Planificación":
      return "grey-6";
    case "En Curso":
      return "primary";
    case "En Pruebas (QA)":
      return "orange";
    case "Completado":
      return "positive";
    case "Pausado":
      return "warning";
    case "Cancelado":
      return "negative";
    default:
      return "dark";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("es-PE", options);
};

// --- CICLO DE VIDA ---
onMounted(() => {
  obtenerProyectos();
});
</script>
