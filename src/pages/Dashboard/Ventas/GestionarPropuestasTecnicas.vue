<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h5">Gestión de Propuestas Técnicas</div>
        <q-btn
          label="Subir nuevo archivo"
          color="primary"
          @click="abrirModalCrear"
        />
      </q-card-section>

      <!-- Buscador y Filtros -->
      <q-card-section class="row q-gutter-md items-center">
        <q-input
          filled
          v-model="filtroNombre"
          label="Buscar por nombre de archivo"
          class="col"
          debounce="300"
          @update:model-value="aplicarFiltros"
        />
        <q-btn
          flat
          icon="filter_list"
          label="Filtros"
          @click="mostrarFiltros = !mostrarFiltros"
        />
        <q-slide-transition>
          <div v-show="mostrarFiltros" class="col-12 row q-gutter-md">
            <q-input
              v-model="filtroFechaInicio"
              label="Fecha Inicio"
              filled
              type="date"
              class="col"
            />
            <q-input
              v-model="filtroFechaFin"
              label="Fecha Fin"
              filled
              type="date"
              class="col"
            />
            <q-select
              v-model="filtroEstado"
              :options="['Activo', 'Inactivo', 'Pendiente']"
              label="Estado"
              filled
              class="col"
            />
            <q-btn
              label="Aplicar Filtro"
              color="primary"
              @click="aplicarFiltros"
              class="q-ml-sm"
            />
            <q-btn
              label="Limpiar"
              flat
              @click="limpiarFiltros"
              class="q-ml-sm"
            />
          </div>
        </q-slide-transition>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="archivosFiltrados"
          :columns="columnas"
          row-key="_id"
          :rows-per-page-options="[5, 10, 20]"
          :pagination="paginacion"
          @update:pagination="(val) => (paginacion = val)"
          no-data-label="No hay archivos disponibles"
        >
          <template v-slot:body-cell-fechaInicio="props">
            <q-td :props="props">
              {{ formatFecha(props.row.fechaInicio) }}
            </q-td>
          </template>
          <template v-slot:body-cell-fechaFin="props">
            <q-td :props="props">
              {{ formatFecha(props.row.fechaFin) }}
            </q-td>
          </template>
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="download"
                @click="descargarArchivo(props.row)"
                color="primary"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                @click="eliminarArchivo(props.row)"
                color="negative"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal Subir Archivo -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Subir nuevo archivo</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="archivoForm.nombre" label="Nombre" filled />
          <q-input v-model="archivoForm.cliente" label="Cliente" filled />
          <q-input
            v-model="archivoForm.descripcion"
            label="Descripción"
            type="textarea"
            filled
          />
          <q-input
            v-model="archivoForm.fechaInicio"
            label="Fecha de Inicio"
            type="date"
            filled
          />
          <q-input
            v-model="archivoForm.fechaFin"
            label="Fecha de Fin"
            type="date"
            filled
          />
          <q-select
            v-model="archivoForm.tipo"
            :options="['PDF', 'DOCX', 'XLSX']"
            label="Tipo"
            filled
          />
          <q-select
            v-model="archivoForm.estado"
            :options="['Activo', 'Inactivo', 'Pendiente']"
            label="Estado"
            filled
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="guardarArchivo" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirmación de eliminación (mejorada) -->
    <q-dialog v-model="mostrarConfirmacionEliminar">
      <q-card style="width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">
            ¿Estás seguro de que deseas eliminar este archivo?
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            flat
            label="Eliminar"
            color="primary"
            @click="eliminarArchivoConfirmado"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../../api"; // conexión axios

const archivos = ref([]);
const archivosFiltrados = ref([]);
const filtroNombre = ref("");
const filtroFechaInicio = ref("");
const filtroFechaFin = ref("");
const filtroEstado = ref("");
const mostrarFiltros = ref(false);
const mostrarModal = ref(false);
const mostrarConfirmacionEliminar = ref(false); // Para confirmar eliminación
const archivoAEliminar = ref(null); // Archivo a eliminar
const paginacion = ref({ rowsPerPage: 5, page: 1 });

const archivoForm = ref({
  nombre: "",
  cliente: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  tipo: "",
  estado: "Pendiente",
});

const columnas = [
  { name: "nombre", label: "Nombre", align: "left", field: "nombre" },
  { name: "cliente", label: "Cliente", align: "left", field: "cliente" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  {
    name: "fechaInicio",
    label: "Fecha Inicio",
    align: "left",
    field: "fechaInicio",
  },
  { name: "fechaFin", label: "Fecha Fin", align: "left", field: "fechaFin" },
  { name: "tipo", label: "Tipo", align: "left", field: "tipo" },
  { name: "estado", label: "Estado", align: "left", field: "estado" },
  { name: "acciones", label: "Acciones", align: "center" },
];

// CARGAR DESDE BACKEND
const cargarArchivos = async () => {
  try {
    const res = await api.get("/repopropuestas");
    archivos.value = res.data;
    aplicarFiltros();
  } catch (error) {
    console.error("Error al cargar propuestas:", error);
  }
};

// FILTROS
const aplicarFiltros = () => {
  archivosFiltrados.value = archivos.value.filter((archivo) => {
    const coincideNombre = archivo.nombre
      .toLowerCase()
      .includes(filtroNombre.value.toLowerCase());
    const coincideEstado = filtroEstado.value
      ? archivo.estado === filtroEstado.value
      : true;
    const coincideFechaInicio = filtroFechaInicio.value
      ? archivo.fechaInicio >= filtroFechaInicio.value
      : true;
    const coincideFechaFin = filtroFechaFin.value
      ? archivo.fechaFin <= filtroFechaFin.value
      : true;
    return (
      coincideNombre &&
      coincideEstado &&
      coincideFechaInicio &&
      coincideFechaFin
    );
  });
};

const limpiarFiltros = () => {
  filtroNombre.value = "";
  filtroFechaInicio.value = "";
  filtroFechaFin.value = "";
  filtroEstado.value = "";
  aplicarFiltros();
};

// MODAL
const abrirModalCrear = () => {
  archivoForm.value = {
    nombre: "",
    cliente: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    tipo: "",
    estado: "Pendiente",
  };
  mostrarModal.value = true;
};

// GUARDAR EN BACKEND
const guardarArchivo = async () => {
  try {
    const res = await api.post("/repopropuestas", archivoForm.value);
    archivos.value.push(res.data);
    aplicarFiltros();
    mostrarModal.value = false;
  } catch (error) {
    console.error("Error al guardar propuesta:", error);
  }
};

// ELIMINAR EN BACKEND
const eliminarArchivo = (archivo) => {
  archivoAEliminar.value = archivo;
  mostrarConfirmacionEliminar.value = true;
};

// CONFIRMAR ELIMINACIÓN
const eliminarArchivoConfirmado = async () => {
  try {
    await api.delete(`/repopropuestas/${archivoAEliminar.value._id}`);
    archivos.value = archivos.value.filter(
      (a) => a._id !== archivoAEliminar.value._id,
    );
    aplicarFiltros();
    mostrarConfirmacionEliminar.value = false;
  } catch (error) {
    console.error("Error al eliminar propuesta:", error);
  }
};

// DESCARGAR
const descargarArchivo = (archivo) => {
  alert(`Descargando ${archivo.nombre}`);
};

// FORMATEAR FECHAS
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-ES");
};

onMounted(() => {
  cargarArchivos();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
