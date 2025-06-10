<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestión de Cotizaciones</div>
        <q-btn
          label="Crear Cotización"
          color="primary"
          @click="abrirModalCrear"
          class="q-ml-md row justify-end"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="cotizaciones"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay cotizaciones disponibles"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editarCotizacion(props.row)"
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

    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicion ? "Editar Cotización" : "Crear Cotización" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="cotizacionForm.cliente"
            :options="clientesOptions"
            label="Cliente"
            filled
            emit-value
            map-options
            class="q-mb-md"
          />
          <q-select
            v-model="cotizacionForm.propuesta"
            :options="propuestasOptions"
            label="Propuesta"
            filled
            emit-value
            map-options
            class="q-mb-md"
          />
          <q-input
            v-model="cotizacionForm.estado"
            label="Estado"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="cotizacionForm.fechaEnvio"
            label="Fecha de Envío"
            type="date"
            filled
            class="q-mb-md"
            stack-label
          />
          <q-field label="Destinatarios" stack-label borderless>
            <template v-slot:control>
              <div class="self-stretch">
                <div
                  v-for="(dest, index) in cotizacionForm.destinatarios"
                  :key="index"
                  class="q-mb-sm row items-center"
                >
                  <q-input
                    v-model="dest.email"
                    label="Email"
                    filled
                    dense
                    class="q-mb-xs col"
                  />
                  <q-input
                    v-model="dest.nombre"
                    label="Nombre"
                    filled
                    dense
                    class="q-mb-xs col q-ml-sm"
                  />
                  <q-btn
                    flat
                    round
                    icon="delete"
                    @click="eliminarDestinatario(index)"
                    dense
                    color="negative"
                    class="q-ml-sm"
                  />
                </div>
                <q-btn
                  flat
                  icon="add"
                  label="Agregar Destinatario"
                  @click="agregarDestinatario"
                  class="q-mt-sm"
                />
              </div>
            </template>
          </q-field>
          <q-uploader
            v-model="documentos"
            label="Adjuntar PDF"
            filled
            multiple
            :url="null"
            @added="procesarDocumentos"
            class="q-mt-md"
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
            @click="eliminarCotizacionConfirmado"
          />
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

const cotizaciones = ref([]);
const clientesOptions = ref([]);
const propuestasOptions = ref([]);
const documentos = ref([]);

const columnas = [
  {
    name: "cliente",
    label: "Cliente",
    field: (row) => row.cliente?.nombre,
    align: "left",
    sortable: true,
  },
  {
    name: "propuesta",
    label: "Propuesta",
    field: (row) => row.propuesta?.descripcion, // Cambiado 'titulo' por 'descripcion'
    align: "left",
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    align: "left",
    sortable: true,
  },
  {
    name: "fechaEnvio",
    label: "Fecha de Envío",
    field: "fechaEnvio",
    align: "left",
    sortable: true,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  { name: "acciones", label: "Acciones", align: "center" },
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const cotizacionForm = ref({
  cliente: null,
  propuesta: null,
  estado: "Borrador",
  fechaEnvio: "",
  destinatarios: [],
});
const modoEdicion = ref(false);
const cotizacionSeleccionada = ref(null);

// --- FUNCIONES ASÍNCRONAS CON MANEJO DE ERRORES ---

const cargarCotizaciones = async () => {
  try {
    const res = await api.get("/cotizaciones", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    cotizaciones.value = res.data;
  } catch (error) {
    console.error("Error al cargar cotizaciones:", error);
    alert("No se pudieron cargar las cotizaciones.");
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
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    alert("No se pudieron cargar los clientes.");
  }
};

const cargarPropuestas = async () => {
  try {
    const res = await api.get("/propuestas/aprobadas", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    propuestasOptions.value = res.data.map((p) => ({
      // Crear una etiqueta más descriptiva
      label: `Para: ${p.cliente.nombre} - "${p.descripcion.substring(0, 50)}..."`,
      value: p._id,
    }));
  } catch (error) {
    console.error("Error al cargar propuestas:", error);
    alert("No se pudieron cargar las propuestas.");
  }
};

const guardarCotizacion = async () => {
  try {
    console.log("Enviando estos datos al backend:", cotizacionForm.value);
    const formData = new FormData();
    // Asegurarse de que el _id no se envíe al crear uno nuevo
    const dataToSend = { ...cotizacionForm.value };
    if (!modoEdicion.value) {
      delete dataToSend._id;
    }

    Object.entries(dataToSend).forEach(([key, value]) => {
      if (value === null) return;
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    // En Quasar v2, el v-model de QUploader es un array de objetos File
    // No necesitas .file
    documentos.value.forEach((doc) => formData.append("documentos", doc));

    const url = modoEdicion.value
      ? `/cotizaciones/${cotizacionSeleccionada.value._id}`
      : "/cotizaciones";
    const method = modoEdicion.value ? "put" : "post";

    await api[method](url, formData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Cotización guardada correctamente.");
    cerrarModal();
    cargarCotizaciones();
  } catch (error) {
    console.error("Error al guardar la cotización:", error);
    alert("Hubo un error al guardar la cotización.");
  }
};

const eliminarCotizacionConfirmado = async () => {
  try {
    await api.delete(`/cotizaciones/${cotizacionSeleccionada.value._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    alert("Cotización eliminada correctamente.");
    cerrarConfirmacion();
    cargarCotizaciones();
  } catch (error) {
    console.error("Error al eliminar la cotización:", error);
    alert("Hubo un error al eliminar la cotización.");
  }
};

// --- FUNCIONES DEL MODAL Y FORMULARIO ---

const agregarDestinatario = () => {
  cotizacionForm.value.destinatarios.push({ email: "", nombre: "" });
};

const eliminarDestinatario = (index) => {
  cotizacionForm.value.destinatarios.splice(index, 1);
};

const procesarDocumentos = (files) => {
  // QUploader @added devuelve los archivos, no es necesario hacer push.
  // El v-model ya los gestiona.
};

const abrirModalCrear = () => {
  modoEdicion.value = false;
  cotizacionForm.value = {
    cliente: null,
    propuesta: null,
    estado: "Borrador",
    fechaEnvio: new Date().toISOString().split("T")[0], // Fecha actual por defecto
    destinatarios: [],
  };
  documentos.value = [];
  mostrarModal.value = true;
};

const editarCotizacion = (cotizacion) => {
  modoEdicion.value = true;
  cotizacionSeleccionada.value = cotizacion;
  // Asegúrate de que los valores para q-select sean solo los `_id`
  cotizacionForm.value = {
    ...cotizacion,
    cliente: cotizacion.cliente?._id || null,
    propuesta: cotizacion.propuesta?._id || null,
  };
  documentos.value = []; // O cargar los documentos existentes si la API lo permite
  mostrarModal.value = true;
};

const confirmarGuardar = () => {
  guardarCotizacion();
};

const mostrarConfirmacionEliminar = (cotizacion) => {
  mensajeConfirmacion.value = `¿Está seguro que desea eliminar la cotización para el cliente ${cotizacion.cliente?.nombre}?`;
  cotizacionSeleccionada.value = cotizacion;
  mostrarConfirmacion.value = true;
};

const cerrarModal = () => (mostrarModal.value = false);
const cerrarConfirmacion = () => (mostrarConfirmacion.value = false);

onMounted(() => {
  cargarCotizaciones();
  cargarClientes();
  cargarPropuestas();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
.q-mb-md {
  margin-bottom: 16px;
}
</style>
