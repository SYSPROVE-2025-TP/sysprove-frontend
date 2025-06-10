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
          @click="abrirModalCrear"
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

    <q-dialog v-model="mostrarModalCrear">
      <q-card style="width: 700px; max-width: 90vw">
        <q-form @submit.prevent="guardarNuevoProyecto"> </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="mostrarModalCrear">
      <q-card style="width: 700px; max-width: 90vw">
        <q-form @submit.prevent="guardarNuevoProyecto">
          <q-card-section>
            <div class="text-h6">Crear Nuevo Proyecto de Desarrollo</div>
          </q-card-section>

          <q-card-section class="q-pt-none q-gutter-md">
            <q-input
              filled
              v-model="nuevoProyectoForm.nombre"
              label="Nombre del Proyecto *"
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es obligatorio']"
            />
            <q-select
              filled
              v-model="nuevoProyectoForm.contratoId"
              :options="contratosOptions"
              label="Contrato Asociado *"
              emit-value
              map-options
              lazy-rules
              :rules="[(val) => !!val || 'Debe seleccionar un contrato']"
              :loading="loadingContratos"
              hint="Selecciona el contrato que da origen a este proyecto."
            />
            <q-input
              filled
              v-model="nuevoProyectoForm.descripcion"
              label="Descripción del Proyecto"
              type="textarea"
              autogrow
            />
            <q-select
              filled
              v-model="nuevoProyectoForm.liderTecnicoId"
              :options="usuariosOptions"
              label="Líder Técnico"
              emit-value
              map-options
              clearable
              :loading="loadingUsuarios"
            />
            <q-select
              filled
              v-model="nuevoProyectoForm.equipoDesarrolloIds"
              :options="usuariosOptions"
              label="Miembros del Equipo"
              multiple
              emit-value
              map-options
              use-chips
              stack-label
              clearable
              :loading="loadingUsuarios"
            />
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  filled
                  v-model="nuevoProyectoForm.fechaInicioEstimada"
                  type="date"
                  label="Fecha Inicio Estimada"
                  stack-label
                />
              </div>
              <div class="col-6">
                <q-input
                  filled
                  v-model="nuevoProyectoForm.fechaFinEstimada"
                  type="date"
                  label="Fecha Fin Estimada"
                  stack-label
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn
              type="submit"
              label="Guardar Proyecto"
              color="primary"
              :loading="isSubmitting"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="mostrarModalDetalles">
      <q-card style="width: 900px; max-width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 ellipsis">
            {{ proyectoSeleccionado?.nombre || "Cargando..." }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <div
          v-if="isLoadingDetalle"
          class="flex flex-center"
          style="height: 400px"
        >
          <q-spinner-dots color="primary" size="50px" />
        </div>

        <div v-else-if="proyectoSeleccionado">
          <q-tabs
            v-model="tabDetalle"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="general" label="Información General" icon="info" />
            <q-tab name="backlog" label="Product Backlog" icon="list_alt" />
            <q-tab name="sprints" label="Sprints" icon="loop" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tabDetalle" animated>
            <q-tab-panel name="general">
              <div class="text-h6 q-mb-md">Detalles del Proyecto</div>
              <q-list bordered separator>
                <q-item
                  ><q-item-section
                    ><q-item-label overline>Cliente</q-item-label
                    ><q-item-label>{{
                      proyectoSeleccionado.cliente?.nombre
                    }}</q-item-label></q-item-section
                  ></q-item
                >
                <q-item
                  ><q-item-section
                    ><q-item-label overline>Contrato</q-item-label
                    ><q-item-label caption>{{
                      proyectoSeleccionado.contrato?.descripcion
                    }}</q-item-label></q-item-section
                  ></q-item
                >
                <q-item
                  ><q-item-section
                    ><q-item-label overline>Líder Técnico</q-item-label
                    ><q-item-label
                      >{{ proyectoSeleccionado.liderTecnico?.nombres }}
                      {{
                        proyectoSeleccionado.liderTecnico?.apellidos
                      }}</q-item-label
                    ></q-item-section
                  ></q-item
                >
                <q-item
                  ><q-item-section
                    ><q-item-label overline>Equipo</q-item-label
                    ><q-item-label
                      ><q-chip
                        v-for="miembro in proyectoSeleccionado.equipoDesarrollo"
                        :key="miembro._id"
                        icon="person"
                        :label="`${miembro.nombres} ${miembro.apellidos}`"
                        color="secondary"
                        text-color="white"
                        class="q-mr-sm q-mb-sm" /></q-item-label></q-item-section
                ></q-item>
              </q-list>
            </q-tab-panel>
            <q-tab-panel name="backlog"
              ><div class="text-h6">Product Backlog</div>
              <p>Aquí se gestionarán los Backlog Items.</p></q-tab-panel
            >
            <q-tab-panel name="sprints"
              ><div class="text-h6">Sprints</div>
              <p>Aquí se gestionarán los Sprints.</p></q-tab-panel
            >
          </q-tab-panels>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth";
import api from "../../../api";

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const proyectos = ref([]);
const isLoading = ref(true);

// --- ESTADO PARA DIÁLOGO DE CREACIÓN (EXISTENTE) ---
const mostrarModalCrear = ref(false);
const isSubmitting = ref(false);
const nuevoProyectoForm = ref({
  nombre: "",
  descripcion: "",
  contratoId: null,
  liderTecnicoId: null,
  equipoDesarrolloIds: [],
  fechaInicioEstimada: "",
  fechaFinEstimada: "",
});
const contratosOptions = ref([]);
const usuariosOptions = ref([]);
const loadingContratos = ref(false);
const loadingUsuarios = ref(false);

// --- NUEVAS VARIABLES DE ESTADO PARA DIÁLOGO DE DETALLES ---
const mostrarModalDetalles = ref(false);
const isLoadingDetalle = ref(false);
const proyectoSeleccionado = ref(null);
const tabDetalle = ref("general");

// --- LÓGICA DE OBTENCIÓN DE DATOS (EXISTENTE) ---
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

// --- FUNCIONES PARA DIÁLOGO DE CREACIÓN (EXISTENTE) ---
// Carga los datos necesarios para los selectores del formulario
const cargarDatosParaFormulario = async () => {
  loadingContratos.value = true;
  loadingUsuarios.value = true;
  try {
    // Cargar contratos
    const resContratos = await api.get("/contratos", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    contratosOptions.value = resContratos.data.map((c) => ({
      label: `${c.descripcion} (Cliente: ${c.cliente?.nombre || "N/A"})`,
      value: c._id,
    }));

    // Cargar usuarios
    const resUsuarios = await api.get("/auth/usuarios", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    usuariosOptions.value = resUsuarios.data.map((u) => ({
      label: `${u.nombres} ${u.apellidos}`,
      value: u._id,
    }));
  } catch (error) {
    console.error("Error al cargar datos para el formulario:", error);
    $q.notify({
      type: "negative",
      message: "Error al cargar datos para los selectores.",
    });
  } finally {
    loadingContratos.value = false;
    loadingUsuarios.value = false;
  }
};

const abrirModalCrear = () => {
  // Resetea el formulario a su estado inicial
  nuevoProyectoForm.value = {
    nombre: "",
    descripcion: "",
    contratoId: null,
    liderTecnicoId: null,
    equipoDesarrolloIds: [],
    fechaInicioEstimada: "",
    fechaFinEstimada: "",
  };
  // Carga los datos para los selectores
  cargarDatosParaFormulario();
  // Muestra el diálogo
  mostrarModalCrear.value = true;
};
const guardarNuevoProyecto = async () => {
  isSubmitting.value = true;
  try {
    // Llama a la API para crear el proyecto. La respuesta contiene el nuevo proyecto.
    const response = await api.post(
      "/api/proyectos-desarrollo",
      nuevoProyectoForm.value,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    $q.notify({ type: "positive", message: "Proyecto creado con éxito." });

    // --- CAMBIOS CLAVE AQUÍ ---

    // 1. Añadimos el nuevo proyecto directamente a nuestra lista reactiva.
    //    Esto es mucho más rápido y eficiente que volver a pedir la lista completa a la API.
    //    Tu backend devuelve el nuevo proyecto en `response.data.proyectoDesarrollo`.
    proyectos.value.unshift(response.data.proyectoDesarrollo);

    // 2. Cerramos el diálogo.
    mostrarModalCrear.value = false;

    // Ya no es necesario llamar a obtenerProyectos() aquí, lo que evita una llamada extra a la API.
    // await obtenerProyectos(); // Comentamos o eliminamos esta línea.
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    const mensajeError =
      error.response?.data?.mensaje || "Ocurrió un error al crear el proyecto.";
    $q.notify({ type: "negative", message: mensajeError });
  } finally {
    isSubmitting.value = false;
  }
};

// --- FUNCIONES DE NAVEGACIÓN (MODIFICADA Y NUEVA) ---

// ANTERIORMENTE: esta función navegaba a otra página.
// AHORA: abre el diálogo de detalles.
const verDetalles = (proyectoId) => {
  tabDetalle.value = "general";
  mostrarModalDetalles.value = true;
  cargarDetallesProyecto(proyectoId);
};

const irAlTablero = (proyectoId) => {
  router.push(`/desarrollo/proyectos/${proyectoId}/tablero`);
};

// NUEVA FUNCIÓN PARA CARGAR LOS DETALLES DEL PROYECTO SELECCIONADO
const cargarDetallesProyecto = async (proyectoId) => {
  isLoadingDetalle.value = true;
  proyectoSeleccionado.value = null;
  try {
    const response = await api.get(`/api/proyectos-desarrollo/${proyectoId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    proyectoSeleccionado.value = response.data;
  } catch (error) {
    console.error("Error al cargar los detalles del proyecto:", error);
    $q.notify({
      type: "negative",
      message: "No se pudieron cargar los detalles del proyecto.",
    });
    mostrarModalDetalles.value = false;
  } finally {
    isLoadingDetalle.value = false;
  }
};

// --- FUNCIONES UTILITARIAS (EXISTENTES) ---
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

// --- CICLO DE VIDA (EXISTENTE) ---
onMounted(() => {
  obtenerProyectos();
});
</script>

<style scoped>
/* ... (tus estilos existentes) ... */
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
