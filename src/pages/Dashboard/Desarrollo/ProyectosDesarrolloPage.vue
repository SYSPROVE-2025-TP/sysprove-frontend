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
            <q-tab-panel name="backlog">
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">Product Backlog</div>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Agregar Ítem"
                  @click="abrirModalBacklog"
                />
              </div>

              <div v-if="isLoadingBacklog" class="text-grey text-center">
                <q-spinner color="primary" />
                <div>Cargando ítems del backlog...</div>
              </div>

              <div
                v-else-if="backlogItems.length === 0"
                class="text-grey text-center"
              >
                No hay ítems del backlog aún.
              </div>

              <q-list v-else bordered separator>
                <q-item v-for="item in backlogItems" :key="item._id">
                  <q-item-section>
                    <q-item-label>{{ item.nombre }}</q-item-label>
                    <q-item-label caption>{{ item.descripcion }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip size="sm" color="primary" text-color="white">
                      {{ item.tipo }}
                    </q-chip>
                    <q-btn
                      dense
                      flat
                      icon="edit"
                      @click.stop="abrirModalEditarBacklog(item)"
                    />
                    <q-btn
                      dense
                      flat
                      icon="delete"
                      color="negative"
                      @click.stop="eliminarBacklogItem(item)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
            <q-tab-panel name="sprints">
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">Sprints</div>
                <q-btn
                  color="secondary"
                  icon="event"
                  label="Crear Sprint"
                  @click="abrirModalSprint"
                />
              </div>

              <div v-if="isLoadingSprints" class="text-grey text-center">
                <q-spinner color="primary" />
                <div>Cargando sprints...</div>
              </div>

              <div
                v-else-if="sprints.length === 0"
                class="text-grey text-center"
              >
                No hay sprints registrados aún.
              </div>

              <q-timeline v-else color="secondary" layout="comfortable">
                <q-timeline-entry v-for="sprint in sprints" :key="sprint._id">
                  <template #title>
                    <div class="row items-center justify-between">
                      <div class="text-subtitle1">{{ sprint.nombre }}</div>
                      <div>
                        <q-btn
                          flat
                          dense
                          icon="edit"
                          @click.stop="abrirModalEditarSprint(sprint)"
                        />
                        <q-btn
                          flat
                          dense
                          icon="delete"
                          color="negative"
                          @click.stop="eliminarSprint(sprint)"
                        />
                      </div>
                    </div>
                  </template>

                  <template #subtitle>
                    {{ formatDate(sprint.fechaInicio) }} -
                    {{ formatDate(sprint.fechaFin) }}
                  </template>

                  <div>
                    <strong>Objetivo:</strong>
                    {{ sprint.objetivo || "Sin definir" }}
                  </div>
                  <div><strong>Estado:</strong> {{ sprint.estado }}</div>
                </q-timeline-entry>
              </q-timeline>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card>
    </q-dialog>

    <!--Dialogo de crear item del backlog-->
    <q-dialog v-model="mostrarModalBacklog">
      <q-card style="width: 600px; max-width: 90vw">
        <q-form @submit.prevent="crearBacklogItem">
          <q-card-section>
            <div class="text-h6">Nuevo Ítem del Backlog</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-input
              v-model="nuevoBacklogItem.nombre"
              label="Título *"
              filled
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es obligatorio']"
            />
            <q-input
              v-model="nuevoBacklogItem.descripcion"
              label="Descripción"
              type="textarea"
              autogrow
              filled
            />
            <q-select
              v-model="nuevoBacklogItem.tipo"
              label="Tipo *"
              filled
              :options="[
                'Historia de Usuario',
                'Tarea Técnica',
                'Bug',
                'Mejora',
                'Investigación',
              ]"
              emit-value
              map-options
              lazy-rules
              :rules="[(val) => !!val || 'Selecciona un tipo']"
            />
            <q-select
              v-model="nuevoBacklogItem.prioridad"
              label="Prioridad"
              filled
              :options="['Muy Alta', 'Alta', 'Media', 'Baja', 'Muy Baja']"
              emit-value
              map-options
            />
            <q-input
              v-model.number="nuevoBacklogItem.estimacionPuntos"
              label="Estimación (Story Points)"
              type="number"
              filled
              min="0"
            />
            <q-input
              v-model="nuevoBacklogItem.criteriosAceptacion"
              label="Criterios de Aceptación"
              type="textarea"
              autogrow
              filled
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn
              type="submit"
              label="Crear Ítem"
              color="primary"
              :loading="isSubmittingBacklog"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!--Dialog de creacion de sprints-->
    <q-dialog v-model="mostrarModalSprint">
      <q-card style="width: 600px; max-width: 90vw">
        <q-form @submit.prevent="crearSprint">
          <q-card-section>
            <div class="text-h6">Crear Nuevo Sprint</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-input
              v-model="nuevoSprint.nombre"
              label="Nombre del Sprint *"
              filled
              lazy-rules
              :rules="[(val) => !!val || 'Nombre obligatorio']"
            />
            <q-input
              v-model="nuevoSprint.objetivo"
              label="Objetivo del Sprint"
              type="textarea"
              filled
              autogrow
            />

            <q-input
              v-model="nuevoSprint.fechaInicio"
              type="date"
              label="Fecha Inicio *"
              filled
              lazy-rules
              :rules="[(val) => !!val || 'Requerido']"
            />

            <div class="col-6">
              <q-input
                v-model="nuevoSprint.fechaFin"
                type="date"
                label="Fecha Fin *"
                filled
                lazy-rules
                :rules="[(val) => !!val || 'Requerido']"
              />
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn
              type="submit"
              label="Crear Sprint"
              color="primary"
              :loading="isSubmittingSprint"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="mostrarModalEditarBacklog">
      <q-card style="width: 600px; max-width: 90vw">
        <q-form @submit.prevent="actualizarBacklogItem">
          <q-card-section>
            <div class="text-h6">Editar Ítem del Backlog</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="backlogEdit.nombre"
              label="Título *"
              filled
              lazy-rules
              :rules="[(v) => !!v || 'Requerido']"
            />
            <q-input
              v-model="backlogEdit.descripcion"
              label="Descripción"
              type="textarea"
              filled
              autogrow
            />
            <q-select
              v-model="backlogEdit.tipo"
              label="Tipo *"
              filled
              :options="[
                'Historia de Usuario',
                'Tarea Técnica',
                'Bug',
                'Mejora',
                'Investigación',
              ]"
              emit-value
              map-options
              lazy-rules
              :rules="[(v) => !!v || 'Requerido']"
            />
            <q-select
              v-model="backlogEdit.prioridad"
              label="Prioridad"
              filled
              :options="['Muy Alta', 'Alta', 'Media', 'Baja', 'Muy Baja']"
              emit-value
              map-options
            />
            <q-input
              v-model.number="backlogEdit.estimacionPuntos"
              label="Estimación"
              type="number"
              filled
              min="0"
            />
            <q-input
              v-model="backlogEdit.criteriosAceptacion"
              label="Criterios de Aceptación"
              type="textarea"
              filled
              autogrow
            />
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn
              type="submit"
              label="Actualizar"
              color="primary"
              :loading="isSubmittingBacklogEdit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="mostrarModalEditarSprint">
      <q-card style="width: 600px; max-width: 90vw">
        <q-form @submit.prevent="actualizarSprint">
          <q-card-section>
            <div class="text-h6">Editar Sprint</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="sprintEdit.nombre"
              label="Nombre *"
              filled
              lazy-rules
              :rules="[(v) => !!v || 'Requerido']"
            />
            <q-input
              v-model="sprintEdit.objetivo"
              label="Objetivo"
              type="textarea"
              filled
              autogrow
            />

            <q-input
              v-model="sprintEdit.fechaInicio"
              type="date"
              label="Fecha Inicio *"
              filled
              lazy-rules
              :rules="[(v) => !!v || 'Requerido']"
            />

            <div class="col-6">
              <q-input
                v-model="sprintEdit.fechaFin"
                type="date"
                label="Fecha Fin *"
                filled
                lazy-rules
                :rules="[(v) => !!v || 'Requerido']"
              />
            </div>

            <q-select
              v-model="sprintEdit.estado"
              label="Estado *"
              filled
              :options="['Planificado', 'En Curso', 'Completado', 'Cancelado']"
              emit-value
              map-options
              lazy-rules
              :rules="[(v) => !!v || 'Requerido']"
            />
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn
              type="submit"
              label="Actualizar"
              color="primary"
              :loading="isSubmittingSprintEdit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth";
import api from "../../../api";
const mostrarModalBacklog = ref(false);
const isSubmittingBacklog = ref(false);
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const proyectos = ref([]);
const isLoading = ref(true);
// --- BACKLOG ---
const backlogItems = ref([]);
const isLoadingBacklog = ref(false);

const mostrarModalEditarBacklog = ref(false);
const isSubmittingBacklogEdit = ref(false);
const backlogEdit = ref({});

const mostrarModalSprint = ref(false);
const isSubmittingSprint = ref(false);
// --- SPRINTS ---
const sprints = ref([]);
const isLoadingSprints = ref(false);

const mostrarModalEditarSprint = ref(false);
const isSubmittingSprintEdit = ref(false);
const sprintEdit = ref({});

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
const cargarBacklogItems = async () => {
  if (!proyectoSeleccionado.value?._id) return;
  isLoadingBacklog.value = true;
  try {
    const response = await api.get(
      `/api/proyectos-desarrollo/${proyectoSeleccionado.value._id}/backlog-items`,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    backlogItems.value = response.data;
  } catch (error) {
    console.error("Error al cargar backlog:", error);
    $q.notify({ type: "negative", message: "Error al cargar el backlog." });
  } finally {
    isLoadingBacklog.value = false;
  }
};

const cargarSprints = async () => {
  if (!proyectoSeleccionado.value?._id) return;
  isLoadingSprints.value = true;
  try {
    const response = await api.get(
      `/api/proyectos-desarrollo/${proyectoSeleccionado.value._id}/sprints`,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    sprints.value = response.data;
  } catch (error) {
    console.error("Error al cargar sprints:", error);
    $q.notify({ type: "negative", message: "Error al cargar los sprints." });
  } finally {
    isLoadingSprints.value = false;
  }
};

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
const nuevoBacklogItem = ref({
  nombre: "",
  descripcion: "",
  tipo: "",
  prioridad: "Media",
  estimacionPuntos: 0,
  criteriosAceptacion: "",
});

const abrirModalBacklog = () => {
  // Limpia el formulario y muestra el diálogo
  nuevoBacklogItem.value = {
    nombre: "",
    descripcion: "",
    tipo: "",
    prioridad: "Media",
    estimacionPuntos: 0,
    criteriosAceptacion: "",
  };
  mostrarModalBacklog.value = true;
};

const crearBacklogItem = async () => {
  if (!proyectoSeleccionado.value?._id) return;

  isSubmittingBacklog.value = true;
  try {
    const response = await api.post(
      `/api/proyectos-desarrollo/${proyectoSeleccionado.value._id}/backlog-items`,
      nuevoBacklogItem.value,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    $q.notify({ type: "positive", message: "Ítem creado correctamente." });
    backlogItems.value.unshift(response.data.backlogItem); // lo añadimos en caliente
    mostrarModalBacklog.value = false;
  } catch (error) {
    console.error("Error al crear el ítem del backlog:", error);
    $q.notify({
      type: "negative",
      message:
        error.response?.data?.mensaje || "Error al crear el ítem del backlog.",
    });
  } finally {
    isSubmittingBacklog.value = false;
  }
};

const nuevoSprint = ref({
  nombre: "",
  objetivo: "",
  fechaInicio: "",
  fechaFin: "",
});

const abrirModalSprint = () => {
  nuevoSprint.value = {
    nombre: "",
    objetivo: "",
    fechaInicio: "",
    fechaFin: "",
  };
  mostrarModalSprint.value = true;
};

const crearSprint = async () => {
  if (!proyectoSeleccionado.value?._id) return;

  isSubmittingSprint.value = true;
  try {
    const response = await api.post(
      `/api/proyectos-desarrollo/${proyectoSeleccionado.value._id}/sprints`,
      nuevoSprint.value,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    $q.notify({ type: "positive", message: "Sprint creado exitosamente." });
    sprints.value.unshift(response.data.sprint);
    mostrarModalSprint.value = false;
  } catch (error) {
    console.error("Error al crear el sprint:", error);
    $q.notify({
      type: "negative",
      message:
        error.response?.data?.mensaje || "Ocurrió un error al crear el sprint.",
    });
  } finally {
    isSubmittingSprint.value = false;
  }
};
function abrirModalEditarBacklog(item) {
  backlogEdit.value = { ...item }; // clona el objeto
  mostrarModalEditarBacklog.value = true;
}

async function actualizarBacklogItem() {
  isSubmittingBacklogEdit.value = true;
  try {
    const { data } = await api.put(
      `/api/proyectos-desarrollo/items/${backlogEdit.value._id}`,
      backlogEdit.value,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    $q.notify({ type: "positive", message: "Ítem actualizado." });
    const idx = backlogItems.value.findIndex(
      (i) => i._id === data.backlogItem._id,
    );
    if (idx !== -1) backlogItems.value[idx] = data.backlogItem;
    mostrarModalEditarBacklog.value = false;
  } catch (err) {
    $q.notify({
      type: "negative",
      message: err.response?.data?.mensaje || "Error al actualizar.",
    });
  } finally {
    isSubmittingBacklogEdit.value = false;
  }
}

async function eliminarBacklogItem(item) {
  try {
    await api.delete(`/api/proyectos-desarrollo/items/${item._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    $q.notify({ type: "positive", message: "Ítem eliminado." });
    backlogItems.value = backlogItems.value.filter((i) => i._id !== item._id);
  } catch (err) {
    $q.notify({ type: "negative", message: "Error al eliminar ítem." });
  }
}
function abrirModalEditarSprint(sprint) {
  sprintEdit.value = {
    ...sprint,
    fechaInicio: formatFechaISO(sprint.fechaInicio),
    fechaFin: formatFechaISO(sprint.fechaFin),
  };
  mostrarModalEditarSprint.value = true;
}
function formatFechaISO(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
async function actualizarSprint() {
  isSubmittingSprintEdit.value = true;
  try {
    const { data } = await api.put(
      `/api/proyectos-desarrollo/sprints/${sprintEdit.value._id}`,
      sprintEdit.value,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    $q.notify({ type: "positive", message: "Sprint actualizado." });
    const idx = sprints.value.findIndex((s) => s._id === data.sprint._id);
    if (idx !== -1) sprints.value[idx] = data.sprint;
    mostrarModalEditarSprint.value = false;
  } catch (err) {
    $q.notify({
      type: "negative",
      message: err.response?.data?.mensaje || "Error al actualizar sprint.",
    });
  } finally {
    isSubmittingSprintEdit.value = false;
  }
}

async function eliminarSprint(sprint) {
  try {
    await api.delete(`/api/proyectos-desarrollo/sprints/${sprint._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    $q.notify({ type: "positive", message: "Sprint eliminado." });
    sprints.value = sprints.value.filter((s) => s._id !== sprint._id);
  } catch (err) {
    $q.notify({ type: "negative", message: "Error al eliminar sprint." });
  }
}
// --- CICLO DE VIDA (EXISTENTE) ---
onMounted(() => {
  obtenerProyectos();
});
watch(tabDetalle, (newTab) => {
  if (newTab === "backlog") cargarBacklogItems();
  else if (newTab === "sprints") cargarSprints();
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
