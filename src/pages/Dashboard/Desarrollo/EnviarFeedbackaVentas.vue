<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Enviar Feedback a ventas</div>
        <div class="text-subtitle2">
          Se puede enviar feedback sobre cambios en proyectos de desarrollo.
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

    <!-- Spinner de carga -->
    <div v-if="isLoading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="40px" />
      <div class="q-ml-md text-grey-8">Cargando proyectos...</div>
    </div>

    <!-- Sin proyectos -->
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

    <!-- Lista de proyectos -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="p in proyectos" :key="p._id" class="col-12 col-md-6 col-lg-4">
        <q-card class="project-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 ellipsis">{{ p.nombre }}</div>
                <div class="text-subtitle2 text-grey-8 ellipsis">
                  Cliente: {{ p.cliente?.nombre || "No asignado" }}
                </div>
              </div>
              <div class="col-auto">
                <q-chip
                  :color="getStatusColor(p.estadoDesarrollo)"
                  text-color="white"
                  :label="p.estadoDesarrollo"
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
                    icon="engineering"
                    color="grey-7"
                    text-color="white"
                    size="sm"
                  />
                </q-item-section>
                <q-item-section>
                  Líder Técnico: {{ p.liderTecnico?.nombres || "No asignado" }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption text-grey">Fechas Clave</div>
            <div class="row text-body2">
              <div class="col-6">
                <strong>Inicio:</strong> {{ formatDate(p.fechaInicioEstimada) }}
              </div>
              <div class="col-6">
                <strong>Fin:</strong> {{ formatDate(p.fechaFinEstimada) }}
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="warning" @click.stop="abrirModalFeedback(p)"
              >Enviar Feedback</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Modal Crear Proyecto -->
    <q-dialog v-model="mostrarModalCrear">
      <q-card style="width: 700px; max-width: 90vw">
        <q-form @submit.prevent="guardarNuevoProyecto">
          <q-card-section
            ><div class="text-h6">Crear Nuevo Proyecto</div></q-card-section
          >
          <q-card-section class="q-pt-none q-gutter-md">
            <q-input
              filled
              v-model="nuevoProyectoForm.nombre"
              label="Nombre del Proyecto *"
              lazy-rules
              :rules="[(val) => !!val || 'Requerido']"
            />
            <q-select
              filled
              v-model="nuevoProyectoForm.contratoId"
              :options="contratosOptions"
              label="Contrato Asociado *"
              emit-value
              map-options
              lazy-rules
              :rules="[(val) => !!val || 'Requerido']"
              :loading="loadingContratos"
            />
            <q-input
              filled
              v-model="nuevoProyectoForm.descripcion"
              label="Descripción"
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
              clearable
              :loading="loadingUsuarios"
            />
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  filled
                  v-model="nuevoProyectoForm.fechaInicioEstimada"
                  type="date"
                  label="Fecha Inicio"
                  stack-label
                />
              </div>
              <div class="col-6">
                <q-input
                  filled
                  v-model="nuevoProyectoForm.fechaFinEstimada"
                  type="date"
                  label="Fecha Fin"
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
              label="Guardar"
              color="primary"
              :loading="isSubmitting"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Modal Detalles Proyecto -->
    <q-dialog v-model="mostrarModalDetalles">
      <q-card style="width: 900px; max-width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
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
        <div v-else>
          <q-tabs
            v-model="tabDetalle"
            dense
            align="justify"
            active-color="primary"
            indicator-color="primary"
          >
            <q-tab name="general" label="Información" icon="info" />
            <q-tab name="backlog" label="Backlog" icon="list_alt" />
            <q-tab name="sprints" label="Sprints" icon="loop" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tabDetalle" animated>
            <q-tab-panel name="general">
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Cliente</q-item-label>
                    <q-item-label>{{
                      proyectoSeleccionado.cliente?.nombre
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <!-- ...otros detalles... -->
              </q-list>
            </q-tab-panel>
            <q-tab-panel name="backlog">
              <div class="text-h6">Product Backlog</div>
            </q-tab-panel>
            <q-tab-panel name="sprints">
              <div class="text-h6">Sprints</div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card>
    </q-dialog>

    <!-- Modal Enviar Feedback -->
    <q-dialog v-model="modalFeedback">
      <q-card style="min-width: 500px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Enviar Feedback a Ventas</div>
          <div class="text-subtitle2 q-mt-xs">
            Proyecto: <strong>{{ proyectoFeedback?.nombre }}</strong>
          </div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-select
            filled
            v-model="tipoCambio"
            :options="optionsTipo"
            label="Tipo de Cambio"
          />
          <q-input
            filled
            v-model="descripcion"
            type="textarea"
            label="Descripción del Cambio"
          />
          <q-input
            filled
            v-model="justificacion"
            type="textarea"
            label="Justificación Técnica"
          />
          <q-input
            filled
            v-model="impacto"
            type="textarea"
            label="Impacto Estimado"
          />
          <q-input
            filled
            v-model="fechaImpacto"
            type="date"
            label="Fecha Estimada"
            :min="minDate"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="modalFeedback = false"
          />
          <q-btn
            :disable="isSending"
            :label="isSending ? 'Enviando...' : 'Enviar'"
            color="primary"
            @click="enviarFeedback"
          />
        </q-card-actions>
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

// Proyectos
const proyectos = ref([]);
const isLoading = ref(true);

// Crear Proyecto
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

async function cargarDatosParaFormulario() {
  loadingContratos.value = true;
  loadingUsuarios.value = true;
  try {
    const [rc, ru] = await Promise.all([
      api.get("/contratos", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      }),
      api.get("/auth/usuarios", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      }),
    ]);
    contratosOptions.value = rc.data.map((c) => ({
      label: c.descripcion,
      value: c._id,
    }));
    usuariosOptions.value = ru.data.map((u) => ({
      label: `${u.nombres} ${u.apellidos}`,
      value: u._id,
    }));
  } catch {
    $q.notify({ type: "negative", message: "Error cargando formularios." });
  } finally {
    loadingContratos.value = false;
    loadingUsuarios.value = false;
  }
}

function abrirModalCrear() {
  mostrarModalCrear.value = true;
  nuevoProyectoForm.value = {
    nombre: "",
    descripcion: "",
    contratoId: null,
    liderTecnicoId: null,
    equipoDesarrolloIds: [],
    fechaInicioEstimada: "",
    fechaFinEstimada: "",
  };
  cargarDatosParaFormulario();
}

async function guardarNuevoProyecto() {
  isSubmitting.value = true;
  try {
    const { data } = await api.post(
      "/api/proyectos-desarrollo",
      nuevoProyectoForm.value,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    proyectos.value.unshift(data.proyectoDesarrollo || data);
    $q.notify({ type: "positive", message: "Proyecto creado." });
    mostrarModalCrear.value = false;
  } catch (err) {
    $q.notify({
      type: "negative",
      message: err.response?.data?.mensaje || "Error al crear.",
    });
  } finally {
    isSubmitting.value = false;
  }
}

// Detalles Proyecto
const mostrarModalDetalles = ref(false);
const isLoadingDetalle = ref(false);
const proyectoSeleccionado = ref(null);
const tabDetalle = ref("general");

function abrirModalDetalles(id) {
  mostrarModalDetalles.value = true;
  loadDetalles(id);
}

async function loadDetalles(id) {
  isLoadingDetalle.value = true;
  try {
    const { data } = await api.get(`/api/proyectos-desarrollo/${id}`);
    proyectoSeleccionado.value = data;
  } catch {
    $q.notify({ type: "negative", message: "Error al cargar detalles." });
    mostrarModalDetalles.value = false;
  } finally {
    isLoadingDetalle.value = false;
  }
}

function irAlTablero(id) {
  router.push(`/desarrollo/proyectos/${id}/tablero`);
}

// Feedback
const modalFeedback = ref(false);
const proyectoFeedback = ref(null);
const optionsTipo = ["Cambio de Alcance", "Ajuste de Cronograma", "Ambos"];
const tipoCambio = ref("");
const descripcion = ref("");
const justificacion = ref("");
const impacto = ref("");
const fechaImpacto = ref("");
const minDate = "2025-01-01";
const isSending = ref(false);

function abrirModalFeedback(p) {
  proyectoFeedback.value = p;
  modalFeedback.value = true;
}

async function enviarFeedback() {
  if (
    ![tipoCambio, descripcion, justificacion, impacto, fechaImpacto].every(
      (r) => r.value,
    )
  ) {
    $q.notify({ type: "warning", message: "Completa todos los campos." });
    return;
  }
  isSending.value = true;
  try {
    await api.post("/api/repositorio-ventas/feedback-desarrollo", {
      proyectoId: proyectoFeedback.value._id,
      tipoCambio: tipoCambio.value,
      descripcion: descripcion.value,
      justificacion: justificacion.value,
      impacto: impacto.value,
      fechaEstimacion: fechaImpacto.value,
    });
    $q.notify({ type: "positive", message: "Feedback enviado." });
    modalFeedback.value = false;
  } catch {
    $q.notify({ type: "negative", message: "Error al enviar feedback." });
  } finally {
    isSending.value = false;
  }
}

// Carga inicial
async function obtenerProyectos() {
  isLoading.value = true;
  try {
    const { data } = await api.get("/api/proyectos-desarrollo");
    proyectos.value = data;
  } catch {
    $q.notify({ type: "negative", message: "Error al cargar proyectos." });
  } finally {
    isLoading.value = false;
  }
}

onMounted(obtenerProyectos);

// Utilitarios
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";
const getStatusColor = (s) =>
  ({
    Planificación: "grey-6",
    "En Curso": "primary",
    "En Pruebas (QA)": "orange",
    Completado: "positive",
    Pausado: "warning",
    Cancelado: "negative",
  })[s] || "dark";
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
