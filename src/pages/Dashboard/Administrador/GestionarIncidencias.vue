<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h5">Gestión de Incidencias</div>
        <q-btn
          label="Registrar Incidencia"
          color="primary"
          @click="abrirModalCrear"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="incidencias"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay incidencias registradas"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editarIncidencia(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="mostrarConfirmacionEliminar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal Crear/Editar -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicion ? "Editar Incidencia" : "Registrar Incidencia" }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="incidenciaForm.cliente"
            :options="clientesOptions"
            label="Cliente"
            filled
            emit-value
            map-options
          />
          <q-select
            v-model="incidenciaForm.categoria"
            :options="categoriasOptions"
            label="Categoría"
            filled
          />
          <q-input
            v-model="incidenciaForm.descripcion"
            label="Descripción"
            filled
            type="textarea"
          />
          <q-select
            v-model="incidenciaForm.estado"
            :options="['Abierto', 'En Proceso', 'Resuelto']"
            label="Estado"
            filled
          />
          <q-input
            v-model="incidenciaForm.fechaReporte"
            label="Fecha de Reporte"
            type="date"
            filled
          />
          <q-uploader
            v-model="documentos"
            label="Adjuntar Evidencia"
            filled
            :url="null"
            @added="procesarDocumentos"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="cerrarModal" />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="confirmarGuardar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirmación eliminar -->
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
            @click="eliminarIncidencia"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../../stores/auth";
import api from "../../../api";

const authStore = useAuthStore();
const incidencias = ref([]);
const clientesOptions = ref([]);
const categoriasOptions = ref([
  "Hardware",
  "Software",
  "Red",
  "Servicio",
  "Otro",
]);
const documentos = ref([]);

function formatearFecha(fechaISO) {
  if (!fechaISO) return "-";
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

const columnas = [
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: (row) => row.cliente?.nombre || "-",
  },
  { name: "categoria", label: "Categoría", align: "left", field: "categoria" },
  { name: "estado", label: "Estado", align: "left", field: "estado" },
  {
    name: "fechaReporte",
    label: "Fecha",
    align: "left",
    field: (row) => formatearFecha(row.fechaReporte),
  },
  { name: "acciones", label: "Acciones", align: "center" },
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const modoEdicion = ref(false);
const incidenciaSeleccionada = ref(null);
const incidenciaForm = ref({
  cliente: "",
  categoria: "",
  descripcion: "",
  estado: "Abierto",
  fechaReporte: "",
});

const cargarIncidencias = async () => {
  try {
    const res = await api.get("/api/incidencias", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    incidencias.value = res.data;
  } catch (err) {
    console.error(
      "❌ Error al cargar incidencias:",
      err.response?.data || err.message || err,
    );
    alert("Error al cargar incidencias");
  }
};

const cargarClientes = async () => {
  try {
    const res = await api.get("/clientes", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    clientesOptions.value = res.data.map((c) => ({
      label: c.nombre,
      value: c._id,
    }));
  } catch (err) {
    alert("Error al cargar clientes");
  }
};

const abrirModalCrear = () => {
  incidenciaForm.value = {
    cliente: "",
    categoria: "",
    descripcion: "",
    estado: "Abierto",
    fechaReporte: "",
  };
  documentos.value = [];
  modoEdicion.value = false;
  mostrarModal.value = true;
};

const editarIncidencia = (incidencia) => {
  incidenciaSeleccionada.value = incidencia;
  incidenciaForm.value = {
    cliente: incidencia.cliente._id || incidencia.cliente,
    categoria: incidencia.categoria,
    descripcion: incidencia.descripcion,
    estado: incidencia.estado,
    fechaReporte: incidencia.fechaReporte?.substring(0, 10) || "",
  };
  documentos.value = [];
  modoEdicion.value = true;
  mostrarModal.value = true;
};

const confirmarGuardar = () => guardarIncidencia();

const guardarIncidencia = async () => {
  try {
    const formData = new FormData();
    Object.entries(incidenciaForm.value).forEach(([k, v]) => {
      formData.append(k, v);
    });
    documentos.value.forEach((doc) => {
      formData.append("documentos", doc.file);
    });

    const url = modoEdicion.value
      ? `/api/incidencias/${incidenciaSeleccionada.value._id}`
      : "/api/incidencias";
    const method = modoEdicion.value ? "put" : "post";

    await api[method](url, formData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Incidencia guardada correctamente.");
    cerrarModal();
    cargarIncidencias();
  } catch (error) {
    console.error(
      "❌ Error al guardar incidencia:",
      error.response?.data || error.message || error,
    );
    alert("Error al guardar la incidencia.");
  }
};

const mostrarConfirmacionEliminar = (incidencia) => {
  mensajeConfirmacion.value = "¿Desea eliminar esta incidencia?";
  incidenciaSeleccionada.value = incidencia;
  mostrarConfirmacion.value = true;
};

const eliminarIncidencia = async () => {
  try {
    await api.delete(`/api/incidencias/${incidenciaSeleccionada.value._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    alert("Incidencia eliminada.");
    cargarIncidencias();
  } catch (err) {
    alert("Error al eliminar la incidencia.");
  } finally {
    cerrarConfirmacion();
  }
};

const cerrarModal = () => (mostrarModal.value = false);
const cerrarConfirmacion = () => (mostrarConfirmacion.value = false);

onMounted(() => {
  cargarIncidencias();
  cargarClientes();
});
</script>
