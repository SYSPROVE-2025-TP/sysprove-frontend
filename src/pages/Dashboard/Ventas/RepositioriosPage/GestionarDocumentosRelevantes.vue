<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h5">Gestión de Documentos Relevantes</div>
        <q-btn
          label="Subir nuevo documento"
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
          no-data-label="No hay documentos disponibles"
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

    <!-- Modal Subir Documento -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Subir nuevo documento</div>
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
            :options="['PDF', 'DOCX', 'XLSX', 'PNG', 'JPEG']"
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

    <!-- Confirmación de eliminación -->
    <q-dialog v-model="mostrarConfirmacionEliminar">
      <q-card style="width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">
            ¿Estás seguro de que deseas eliminar este documento?
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

const archivos = ref([
  {
    _id: 1,
    nombre: "Documento A",
    cliente: "Cliente 1",
    descripcion: "Descripción A",
    fechaInicio: "2023-01-01",
    fechaFin: "2023-01-15",
    tipo: "PDF",
    estado: "Activo",
  },
  {
    _id: 2,
    nombre: "Documento B",
    cliente: "Cliente 2",
    descripcion: "Descripción B",
    fechaInicio: "2023-02-01",
    fechaFin: "2023-02-15",
    tipo: "DOCX",
    estado: "Pendiente",
  },
  {
    _id: 3,
    nombre: "Documento C",
    cliente: "Cliente 3",
    descripcion: "Descripción C",
    fechaInicio: "2023-03-01",
    fechaFin: "2023-03-15",
    tipo: "XLSX",
    estado: "Inactivo",
  },
  {
    _id: 4,
    nombre: "Documento D",
    cliente: "Cliente 4",
    descripcion: "Descripción D",
    fechaInicio: "2023-04-01",
    fechaFin: "2023-04-15",
    tipo: "PNG",
    estado: "Activo",
  },
  {
    _id: 5,
    nombre: "Documento E",
    cliente: "Cliente 5",
    descripcion: "Descripción E",
    fechaInicio: "2023-05-01",
    fechaFin: "2023-05-15",
    tipo: "PDF",
    estado: "Activo",
  },
  {
    _id: 6,
    nombre: "Documento F",
    cliente: "Cliente 6",
    descripcion: "Descripción F",
    fechaInicio: "2023-06-01",
    fechaFin: "2023-06-15",
    tipo: "DOCX",
    estado: "Pendiente",
  },
  {
    _id: 7,
    nombre: "Documento G",
    cliente: "Cliente 7",
    descripcion: "Descripción G",
    fechaInicio: "2023-07-01",
    fechaFin: "2023-07-15",
    tipo: "XLSX",
    estado: "Inactivo",
  },
  {
    _id: 8,
    nombre: "Documento H",
    cliente: "Cliente 8",
    descripcion: "Descripción H",
    fechaInicio: "2023-08-01",
    fechaFin: "2023-08-15",
    tipo: "PNG",
    estado: "Activo",
  },
  {
    _id: 9,
    nombre: "Documento I",
    cliente: "Cliente 9",
    descripcion: "Descripción I",
    fechaInicio: "2023-09-01",
    fechaFin: "2023-09-15",
    tipo: "PDF",
    estado: "Pendiente",
  },
  {
    _id: 10,
    nombre: "Documento J",
    cliente: "Cliente 10",
    descripcion: "Descripción J",
    fechaInicio: "2023-10-01",
    fechaFin: "2023-10-15",
    tipo: "DOCX",
    estado: "Activo",
  },
  {
    _id: 11,
    nombre: "Documento K",
    cliente: "Cliente 11",
    descripcion: "Descripción K",
    fechaInicio: "2023-11-01",
    fechaFin: "2023-11-15",
    tipo: "XLSX",
    estado: "Inactivo",
  },
  {
    _id: 12,
    nombre: "Documento L",
    cliente: "Cliente 12",
    descripcion: "Descripción L",
    fechaInicio: "2023-12-01",
    fechaFin: "2023-12-15",
    tipo: "PNG",
    estado: "Pendiente",
  },
]);

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

// GUARDAR EN MEMORIA
const guardarArchivo = () => {
  const nuevoArchivo = {
    _id: archivos.value.length + 1, // Simulación de ID único
    ...archivoForm.value,
  };
  archivos.value.push(nuevoArchivo);
  aplicarFiltros();
  mostrarModal.value = false;
};

// ELIMINAR ARCHIVO
const eliminarArchivo = (archivo) => {
  archivoAEliminar.value = archivo;
  mostrarConfirmacionEliminar.value = true;
};

// CONFIRMAR ELIMINACIÓN
const eliminarArchivoConfirmado = () => {
  archivos.value = archivos.value.filter(
    (a) => a._id !== archivoAEliminar.value._id,
  );
  aplicarFiltros();
  mostrarConfirmacionEliminar.value = false;
};

// DESCARGAR ARCHIVO
const descargarArchivo = (archivo) => {
  alert(`Descargando ${archivo.nombre}`);
};

// FORMATEAR FECHAS
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-ES");
};

onMounted(() => {
  aplicarFiltros();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
