<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Consultar Proceso de Proyecto</div>
        <div class="text-subtitle2">
          Visualiza y consulta el progreso del proyecto.
        </div>
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
        <q-card class="project-card cursor-pointer">
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

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              flat
              dense
              color="info"
              icon="timeline"
              label="Ver Progreso"
              @click="verProgreso(proyecto)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Modal de Progreso -->
    <q-dialog v-model="mostrarModalProgreso" persistent>
      <q-card style="width: 800px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">
            Progreso del Proyecto: {{ proyectoActual.nombre }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md">
            <q-select
              v-model="estadoSeleccionado"
              :options="estadosProyecto"
              label="Seleccionar estado del proyecto"
              outlined
              dense
              emit-value
              map-options
            />
            <q-btn
              label="Guardar"
              color="primary"
              class="q-mt-md"
              @click="guardarEstado"
            />
          </div>

          <q-separator class="q-my-md" />

          <q-timeline color="secondary">
            <q-timeline-entry
              v-for="(etapa, index) in etapasProyecto"
              :key="index"
              :title="etapa.nombre"
              :subtitle="formatearFecha(etapa.fecha)"
              :icon="obtenerIcono(etapa.estado)"
              :color="etapa.completado ? 'positive' : 'grey'"
            >
              <div>
                <q-chip
                  v-if="etapa.completado"
                  color="positive"
                  text-color="white"
                  icon="check"
                >
                  Completado
                </q-chip>
                <q-chip
                  v-else
                  color="grey"
                  text-color="white"
                  icon="hourglass_empty"
                >
                  Pendiente
                </q-chip>
                <div class="text-caption q-mt-sm">
                  {{ etapa.descripcion }}
                </div>
              </div>
            </q-timeline-entry>
          </q-timeline>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar, date } from "quasar";
import { useAuthStore } from "../../../stores/auth";
import api from "../../../api";

const proyectos = ref([]);
const isLoading = ref(true);

const authStore = useAuthStore();
const $q = useQuasar();

const mostrarModalProgreso = ref(false);
const proyectoActual = ref({});
const estadoSeleccionado = ref("");

const estadosProyecto = [
  "Iniciado",
  "Análisis",
  "Diseño",
  "Desarrollo",
  "QA",
  "Implementación",
  "Completado",
  "Cancelado",
];

const verProgreso = (proyecto) => {
  proyectoActual.value = proyecto;
  estadoSeleccionado.value = proyecto.estadoDesarrollo || "Iniciado";
  mostrarModalProgreso.value = true;
};

const guardarEstado = async () => {
  try {
    proyectoActual.value.estadoDesarrollo = estadoSeleccionado.value;

    // Aquí podrías llamar a tu API si deseas guardar en backend
    await api.put(`/api/proyectos-desarrollo/${proyectoActual.value._id}`, {
      estadoDesarrollo: estadoSeleccionado.value,
    });

    $q.notify({
      type: "positive",
      message: "Estado actualizado correctamente",
    });
    mostrarModalProgreso.value = false;
  } catch (err) {
    $q.notify({
      type: "negative",
      message: "Error al guardar el estado",
    });
  }
};

const etapasProyecto = computed(() => {
  if (!proyectoActual.value) return [];

  const estadoActual = proyectoActual.value.estadoDesarrollo || "Iniciado";
  const indiceActual = estadosProyecto.indexOf(estadoActual);

  return estadosProyecto.map((estado, index) => ({
    nombre: estado,
    descripcion: obtenerDescripcionEtapa(estado),
    fecha: obtenerFechaEtapa(estado),
    estado,
    completado: index <= indiceActual,
  }));
});

const obtenerDescripcionEtapa = (etapa) => {
  const descripciones = {
    Iniciado: "Proyecto creado y planificado",
    Análisis: "Análisis de requerimientos y planificación detallada",
    Diseño: "Diseño de arquitectura e interfaces",
    Desarrollo: "Implementación de funcionalidades",
    QA: "Pruebas de calidad",
    Implementación: "Despliegue final",
    Completado: "Proyecto entregado con éxito",
    Cancelado: "Proyecto cancelado",
  };
  return descripciones[etapa] || "";
};

const obtenerFechaEtapa = (etapa) => {
  const diasPorEtapa = 3;
  const index = estadosProyecto.indexOf(etapa);
  const fechaBase = new Date(
    proyectoActual.value.fechaInicioEstimada || new Date(),
  );
  fechaBase.setDate(fechaBase.getDate() + index * diasPorEtapa);
  return date.formatDate(fechaBase, "DD/MM/YYYY");
};

const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha";
  return date.formatDate(fecha, "DD/MM/YYYY");
};

const obtenerIcono = (estado) => {
  const iconos = {
    Iniciado: "play_arrow",
    Análisis: "search",
    Diseño: "design_services",
    Desarrollo: "code",
    QA: "bug_report",
    Implementación: "cloud_upload",
    Completado: "check_circle",
    Cancelado: "cancel",
  };
  return iconos[estado] || "help_outline";
};

const obtenerProyectos = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/api/proyectos-desarrollo", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    proyectos.value = response.data;
  } catch (error) {
    console.error("Error al obtener los proyectos de desarrollo:", error);
    $q.notify({
      type: "negative",
      message: "No se pudieron cargar los proyectos.",
    });
  } finally {
    isLoading.value = false;
  }
};

const getStatusColor = (status) => {
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

onMounted(() => {
  obtenerProyectos();
});
</script>

<style scoped>
.project-card {
  transition:
    box-shadow 0.3s,
    transform 0.3s;
  border: 1px solid #ddd;
}
.project-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  transform: translateY(-2px);
}
</style>
