<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h5">Reportes de Desarrollo</div>
        <q-btn
          label="Exportar a Excel"
          color="secondary"
          icon="file_download"
          @click="exportarExcel"
        />
      </q-card-section>

      <!-- Filtros -->
      <q-card-section class="row q-gutter-md items-center">
        <q-input
          filled
          v-model="filtroNombre"
          label="Buscar por nombre de proyecto"
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
            <q-select
              v-model="filtroEstado"
              :options="['Planificación', 'En ejecución', 'Finalizado']"
              label="Estado de Desarrollo"
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
          :rows="reportesFiltrados"
          :columns="columnas"
          row-key="_id"
          :rows-per-page-options="[5, 10, 20]"
          :pagination="paginacion"
          @update:pagination="(val) => (paginacion = val)"
          no-data-label="No hay reportes disponibles"
        >
          <template v-slot:body-cell-fechaInicioEstimada="props">
            <q-td :props="props">
              {{ formatFecha(props.row.fechaInicioEstimada) }}
            </q-td>
          </template>
          <template v-slot:body-cell-fechaFinEstimada="props">
            <q-td :props="props">
              {{ formatFecha(props.row.fechaFinEstimada) }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../../api";
import * as XLSX from "xlsx";

// Datos
const reportes = ref([]);
const reportesFiltrados = ref([]);
const filtroNombre = ref("");
const filtroEstado = ref("");
const mostrarFiltros = ref(false);
const paginacion = ref({ rowsPerPage: 5, page: 1 });

// Columnas de la tabla
const columnas = [
  { name: "nombre", label: "Proyecto", align: "left", field: "nombre" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  {
    name: "estadoDesarrollo",
    label: "Estado",
    align: "left",
    field: "estadoDesarrollo",
  },
  {
    name: "fechaInicioEstimada",
    label: "Fecha Inicio",
    align: "left",
    field: "fechaInicioEstimada",
  },
  {
    name: "fechaFinEstimada",
    label: "Fecha Fin",
    align: "left",
    field: "fechaFinEstimada",
  },
];

// Cargar desde el backend
const cargarReportes = async () => {
  try {
    const res = await api.get("/reportesdesarrollo"); // Ruta a configurar en backend
    reportes.value = res.data;
    aplicarFiltros();
  } catch (error) {
    console.error("Error al cargar reportes:", error);
  }
};

// Aplicar filtros
const aplicarFiltros = () => {
  reportesFiltrados.value = reportes.value.filter((r) => {
    const coincideNombre = r.nombre
      ?.toLowerCase()
      .includes(filtroNombre.value.toLowerCase());
    const coincideEstado = filtroEstado.value
      ? r.estadoDesarrollo === filtroEstado.value
      : true;
    return coincideNombre && coincideEstado;
  });
};

// Limpiar filtros
const limpiarFiltros = () => {
  filtroNombre.value = "";
  filtroEstado.value = "";
  aplicarFiltros();
};

// Exportar a Excel
const exportarExcel = () => {
  const datos = reportesFiltrados.value.map((r) => ({
    Proyecto: r.nombre,
    Descripción: r.descripcion,
    Estado: r.estadoDesarrollo,
    "Fecha Inicio": formatFecha(r.fechaInicioEstimada),
    "Fecha Fin": formatFecha(r.fechaFinEstimada),
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ReportesDesarrollo");
  XLSX.writeFile(wb, "reportes_desarrollo.xlsx");
};

// Formato de fecha
const formatFecha = (fecha) => {
  return fecha ? new Date(fecha).toLocaleDateString("es-ES") : "";
};

onMounted(() => {
  cargarReportes();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
