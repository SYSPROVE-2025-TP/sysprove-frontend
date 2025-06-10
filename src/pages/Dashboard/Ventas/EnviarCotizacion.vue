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
              <q-btn flat round dense icon="edit" color="primary" @click="editarCotizacion(props.row)" />
              <q-btn flat round dense icon="delete" color="negative" @click="mostrarConfirmacionEliminar(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal Crear/Editar Cotizacion -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">{{ modoEdicion ? 'Editar Cotización' : 'Crear Cotización' }}</div>
        </q-card-section>

        <q-card-section>
          <q-select v-model="cotizacionForm.cliente" :options="clientesOptions" label="Cliente" filled emit-value map-options />
          <q-select v-model="cotizacionForm.propuesta" :options="propuestasOptions" label="Propuesta" filled emit-value map-options />
          <q-input v-model="cotizacionForm.estado" label="Estado" filled />
          <q-input v-model="cotizacionForm.fechaEnvio" label="Fecha de Envío" type="date" filled />
          <q-field label="Destinatarios">
            <div v-for="(dest, index) in cotizacionForm.destinatarios" :key="index" class="q-mb-sm">
              <q-input v-model="dest.email" label="Email" filled class="q-mb-xs" />
              <q-input v-model="dest.nombre" label="Nombre" filled />
            </div>
            <q-btn flat icon="add" label="Agregar Destinatario" @click="agregarDestinatario" />
          </q-field>
          <q-uploader v-model="documentos" label="Adjuntar PDF" filled :url="null" @added="procesarDocumentos" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="cerrarModal" />
          <q-btn flat label="Guardar" color="primary" @click="confirmarGuardar" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de Confirmación -->
    <q-dialog v-model="mostrarConfirmacion">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ mensajeConfirmacion }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="cerrarConfirmacion" />
          <q-btn flat label="Confirmar" color="primary" @click="confirmarAccion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../api';
import { useAuthStore } from '../../../stores/auth';
const authStore = useAuthStore();

const cotizaciones = ref([]);
const clientesOptions = ref([]);
const propuestasOptions = ref([]);
const documentos = ref([]);
const columnas = [
  { name: 'cliente', label: 'Cliente', field: 'cliente.nombre', align: 'left' },
  { name: 'propuesta', label: 'Propuesta', field: 'propuesta.titulo', align: 'left' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left' },
  { name: 'fechaEnvio', label: 'Fecha de Envío', field: 'fechaEnvio', align: 'left' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref('');
const cotizacionForm = ref({
  cliente: '',
  propuesta: '',
  estado: 'Borrador',
  fechaEnvio: '',
  destinatarios: []
});
const modoEdicion = ref(false);
const cotizacionSeleccionada = ref(null);

const cargarCotizaciones = async () => {
  const res = await api.get('/cotizaciones', { headers: { Authorization: `Bearer ${authStore.token}` } });
  cotizaciones.value = res.data;
};

const cargarClientes = async () => {
  const res = await api.get('/clientes', { headers: { Authorization: `Bearer ${authStore.token}` } });
  clientesOptions.value = res.data.map(c => ({ label: c.nombre, value: c._id }));
};

const cargarPropuestas = async () => {
  const res = await api.get('/propuestas', { headers: { Authorization: `Bearer ${authStore.token}` } });
  propuestasOptions.value = res.data.map(p => ({ label: p.titulo, value: p._id }));
};

const agregarDestinatario = () => {
  cotizacionForm.value.destinatarios.push({ email: '', nombre: '' });
};

const procesarDocumentos = (archivos) => {
  documentos.value.push(...archivos);
};

const abrirModalCrear = () => {
  cotizacionForm.value = { cliente: '', propuesta: '', estado: 'Borrador', fechaEnvio: '', destinatarios: [] };
  documentos.value = [];
  modoEdicion.value = false;
  mostrarModal.value = true;
};

const editarCotizacion = (cotizacion) => {
  cotizacionSeleccionada.value = cotizacion;
  cotizacionForm.value = { ...cotizacion };
  documentos.value = [];
  modoEdicion.value = true;
  mostrarModal.value = true;
};

const confirmarGuardar = () => guardarCotizacion();

const guardarCotizacion = async () => {
  const formData = new FormData();
  Object.entries(cotizacionForm.value).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  documentos.value.forEach(doc => formData.append('documentos', doc.file));

  const url = modoEdicion.value ? `/cotizaciones/${cotizacionSeleccionada.value._id}` : '/cotizaciones';
  const method = modoEdicion.value ? 'put' : 'post';

  await api[method](url, formData, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  alert('Cotización guardada correctamente.');
  cerrarModal();
  cargarCotizaciones();
};

const mostrarConfirmacionEliminar = (cotizacion) => {
  mensajeConfirmacion.value = '¿Está seguro que desea eliminar esta cotización?';
  cotizacionSeleccionada.value = cotizacion;
  eliminarCotizacion();
};

const eliminarCotizacion = async () => {
  await api.delete(`/cotizaciones/${cotizacionSeleccionada.value._id}`, {
    headers: { Authorization: `Bearer ${authStore.token}` }
  });
  alert('Cotización eliminada correctamente.');
  cargarCotizaciones();
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
</style>
