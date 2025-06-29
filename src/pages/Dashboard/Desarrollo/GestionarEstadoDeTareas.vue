<!-- GESTION DE ESTADO DE TAREAS-->
<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h5">Gestión de Estado de Tareas</div>
        <q-btn
          label="Crear Nueva Tarea"
          color="primary"
          icon="add"
          @click="abrirModalCrear"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="tareas"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay tareas registradas"
        >
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip
                :color="colorEstado(props.row.estado)"
                text-color="white"
                dense
                class="text-bold"
              >
                {{ props.row.estado }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editarTarea(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="mostrarConfirmacionEliminar(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="rule"
                color="accent"
                @click="cambiarEstadoTarea(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal Crear/Editar Tarea -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">
            {{
              modoEdicion ? "Editar Detalles de la Tarea" : "Crear Tarea Nueva"
            }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="tareaForm.titulo"
            label="Título de la tarea"
            placeholder="Ej. Ajustar interfaz de usuario del módulo X"
            filled
            dense
          />
          <q-input
            v-model="tareaForm.descripcion"
            label="¿Qué se debe hacer?"
            type="textarea"
            placeholder="Describe brevemente la actividad..."
            filled
            dense
          />
          <q-input
            v-model="tareaForm.fechaInicio"
            label="Inicio programado"
            type="date"
            filled
            dense
          />
          <q-input
            v-model="tareaForm.fechaFin"
            label="Plazo máximo"
            type="date"
            filled
            dense
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar Cambios"
            color="negative"
            @click="cerrarModal"
          />
          <q-btn
            flat
            label="Guardar Tarea"
            color="primary"
            @click="confirmarGuardar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirmación -->
    <q-dialog v-model="mostrarConfirmacion">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ mensajeConfirmacion }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="cerrarConfirmacion"
          />
          <q-btn
            flat
            label="Confirmar"
            color="primary"
            @click="confirmarAccion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Cambiar Estado -->
    <q-dialog v-model="mostrarCambioEstado">
      <q-card style="width: 400px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">Cambiar Estado de la Tarea</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="estadoSeleccionado"
            :options="['Pendiente', 'En Progreso', 'Completada', 'Cancelada']"
            label="Estado"
            filled
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="cerrarCambioEstado"
          />
          <q-btn flat label="Guardar" color="primary" @click="guardarEstado" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../../api";
import { useAuthStore } from "../../../stores/auth";

const authStore = useAuthStore();

const tareas = ref([]);
const columnas = [
  { name: "titulo", label: "Título", align: "left", field: "titulo" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  { name: "fechaInicio", label: "Inicio", align: "left", field: "fechaInicio" },
  { name: "fechaFin", label: "Fin", align: "left", field: "fechaFin" },
  { name: "estado", label: "Estado", align: "left", field: "estado" },
  { name: "acciones", label: "Acciones", align: "center" },
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const tareaForm = ref({
  titulo: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  estado: "Pendiente",
});
const modoEdicion = ref(false);
const tareaSeleccionada = ref(null);
const mostrarCambioEstado = ref(false);
const estadoSeleccionado = ref("");

// Cargar tareas
const cargarTareas = async () => {
  try {
    const res = await api.get("/tareas", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    tareas.value = res.data;
  } catch (error) {
    alert("Error al cargar tareas.");
    console.error(error);
  }
};

// Abrir modal
const abrirModalCrear = () => {
  tareaForm.value = {
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "Pendiente",
  };
  modoEdicion.value = false;
  mostrarModal.value = true;
};

// Editar
const editarTarea = (tarea) => {
  tareaSeleccionada.value = tarea;
  tareaForm.value = { ...tarea };
  modoEdicion.value = true;
  mostrarModal.value = true;
};

// Guardar
const confirmarGuardar = () => {
  mensajeConfirmacion.value = modoEdicion.value
    ? "¿Guardar cambios en esta tarea?"
    : "¿Crear nueva tarea?";
  guardarTarea();
};

const guardarTarea = async () => {
  try {
    const payload = {
      ...tareaForm.value,
      fechaInicio: new Date(tareaForm.value.fechaInicio),
      fechaFin: new Date(tareaForm.value.fechaFin),
    };

    if (modoEdicion.value) {
      await api.put(`/tareas/${tareaSeleccionada.value._id}`, payload, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    } else {
      await api.post("/tareas", payload, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    }

    alert("Tarea guardada.");
    cerrarModal();
    cargarTareas();
  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Error al guardar la tarea.");
  }
};

// Eliminar
const mostrarConfirmacionEliminar = (tarea) => {
  mensajeConfirmacion.value = "¿Eliminar esta tarea?";
  tareaSeleccionada.value = tarea;
  eliminarTarea();
};

const eliminarTarea = async () => {
  try {
    await api.delete(`/tareas/${tareaSeleccionada.value._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    alert("Tarea eliminada.");
    cargarTareas();
  } catch (error) {
    alert("Error al eliminar la tarea.");
    console.error(error);
  }
};

// Cambiar estado
const cambiarEstadoTarea = (tarea) => {
  tareaSeleccionada.value = tarea;
  estadoSeleccionado.value = tarea.estado;
  mostrarCambioEstado.value = true;
};

const guardarEstado = async () => {
  try {
    await api.put(
      `/tareas/${tareaSeleccionada.value._id}`,
      { estado: estadoSeleccionado.value },
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    alert("Estado actualizado.");
    cerrarCambioEstado();
    cargarTareas();
  } catch (error) {
    alert("Error al cambiar el estado.");
    console.error(error);
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const cerrarConfirmacion = () => {
  mostrarConfirmacion.value = false;
};

const cerrarCambioEstado = () => {
  mostrarCambioEstado.value = false;
};

// Asignar colores por estado
const colorEstado = (estado) => {
  switch (estado) {
    case "Pendiente":
      return "blue";
    case "En Progreso":
      return "orange";
    case "Completada":
      return "green";
    case "Cancelada":
      return "red";
    default:
      return "grey";
  }
};

onMounted(() => {
  cargarTareas();
});
</script>

<!-- <script setup>
import { ref, onMounted } from "vue";
import api from "../../../api";
import { useAuthStore } from "../../../stores/auth";

const authStore = useAuthStore();

const tareas = ref([]);
const columnas = [
  { name: "titulo", label: "Título", align: "left", field: "titulo" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  { name: "fechaInicio", label: "Inicio", align: "left", field: "fechaInicio" },
  { name: "fechaFin", label: "Fin", align: "left", field: "fechaFin" },
  { name: "estado", label: "Estado", align: "left", field: "estado" },
  { name: "acciones", label: "Acciones", align: "center" },
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const tareaForm = ref({
  titulo: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  estado: "Pendiente",
});
const modoEdicion = ref(false);
const tareaSeleccionada = ref(null);
const mostrarCambioEstado = ref(false);
const estadoSeleccionado = ref("");

// Cargar tareas
const cargarTareas = async () => {
  try {
    const res = await api.get("/tareas", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    tareas.value = res.data;
  } catch (error) {
    alert("Error al cargar tareas.");
  }
};

// Abrir modal
const abrirModalCrear = () => {
  tareaForm.value = {
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "Pendiente",
  };
  modoEdicion.value = false;
  mostrarModal.value = true;
};

// Editar
const editarTarea = (tarea) => {
  tareaSeleccionada.value = tarea;
  tareaForm.value = { ...tarea };
  modoEdicion.value = true;
  mostrarModal.value = true;
};

// Guardar
const confirmarGuardar = () => {
  mensajeConfirmacion.value = modoEdicion.value
    ? "¿Guardar cambios en esta tarea?"
    : "¿Crear nueva tarea?";
  guardarTarea();
};

const guardarTarea = async () => {
  try {
    const payload = {
      ...tareaForm.value,
      fechaInicio: new Date(tareaForm.value.fechaInicio),
      fechaFin: new Date(tareaForm.value.fechaFin),
    };

    if (modoEdicion.value) {
      await api.put(`/tareas/${tareaSeleccionada.value._id}`, payload, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    } else {
      await api.post("/tareas", payload, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    }

    alert("Tarea guardada.");
    cerrarModal();
    cargarTareas();
  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Error al guardar la tarea.");
  }
};

// Eliminar
const mostrarConfirmacionEliminar = (tarea) => {
  mensajeConfirmacion.value = "¿Eliminar esta tarea?";
  tareaSeleccionada.value = tarea;
  eliminarTarea();
};

const eliminarTarea = async () => {
  try {
    await api.delete(`/tareas/${tareaSeleccionada.value._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    alert("Tarea eliminada.");
    cargarTareas();
  } catch (error) {
    alert("Error al eliminar la tarea.");
  }
};

// Cambiar estado
const cambiarEstadoTarea = (tarea) => {
  tareaSeleccionada.value = tarea;
  estadoSeleccionado.value = tarea.estado;
  mostrarCambioEstado.value = true;
};

const guardarEstado = async () => {
  try {
    await api.put(
      `/tareas/${tareaSeleccionada.value._id}`,
      { estado: estadoSeleccionado.value },
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    alert("Estado actualizado.");
    cerrarCambioEstado();
    cargarTareas();
  } catch (error) {
    alert("Error al cambiar el estado.");
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const cerrarConfirmacion = () => {
  mostrarConfirmacion.value = false;
};

const cerrarCambioEstado = () => {
  mostrarCambioEstado.value = false;
};

// Asignar colores por estado
const colorEstado = (estado) => {
  switch (estado) {
    case "Pendiente":
      return "blue";
    case "En Progreso":
      return "orange";
    case "Completada":
      return "green";
    case "Cancelada":
      return "red";
    default:
      return "grey";
  }
};

onMounted(() => {
  cargarTareas();
});
</script> -->

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
