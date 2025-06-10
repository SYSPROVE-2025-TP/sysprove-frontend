<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Seguimiento de Propuestas Técnicas</div>

        <!-- Calendario -->
        <div
          class="q-mt-md"
          style="height: 500px; display: flex; flex-direction: column"
        >
          <div class="text-subtitle1 q-mb-sm">
            Calendario de Propuestas (por fecha fin)
          </div>
          <FullCalendar
            :options="calendarOptions"
            style="flex-grow: 1; min-height: 0"
          />
        </div>

        <q-separator spaced />

        <!-- Tabla de propuestas -->
        <q-table
          :rows="propuestas"
          :columns="columnas"
          row-key="id"
          flat
          bordered
          class="q-mt-md"
        >
          <template v-slot:body-cell-estadoActual="props">
            <q-td :props="props">
              <div>{{ props.row.estadoActual }}</div>
              <q-badge
                class="q-mt-xs"
                :color="props.row.diasRestantes >= 0 ? 'green' : 'red'"
                outline
              >
                {{
                  props.row.diasRestantes >= 0
                    ? props.row.diasRestantes + " días restantes"
                    : Math.abs(props.row.diasRestantes) + " días de retraso"
                }}
              </q-badge>
            </q-td>
          </template>
        </q-table>

        <q-separator spaced />

        <!-- Gráficos -->
        <div class="row q-col-gutter-md">
          <!-- Gráfico por estado -->
          <div class="col-12 col-md-6" style="height: 300px">
            <div class="text-subtitle1 q-mb-sm">
              Propuestas por Estado Actual
            </div>
            <Bar :data="chartEstadoData" :options="chartOptions" />
          </div>

          <!-- Gráfico de progreso -->
          <div class="col-12 col-md-6" style="height: 300px">
            <div class="text-subtitle1 q-mb-sm">Progreso de Propuestas</div>
            <Bar :data="chartProgresoData" :options="chartOptions" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const columnas = [
  { name: "id", label: "ID", field: "id", align: "center" }, // nueva columna
  { name: "cliente", label: "Cliente", field: "cliente", align: "left" },
  {
    name: "descripcion",
    label: "Descripción",
    field: "descripcion",
    align: "left",
  },
  {
    name: "fechaInicio",
    label: "Fecha Inicio",
    field: "fechaInicio",
    align: "center",
  },
  { name: "fechaFin", label: "Fecha Fin", field: "fechaFin", align: "center" },
  {
    name: "ultimoCambio",
    label: "Último Cambio",
    field: "ultimoCambio",
    align: "center",
  },
  {
    name: "estadoActual",
    label: "Estado Actual",
    field: "estadoActual",
    align: "left",
  },
];

const propuestas = ref([
  {
    id: 1,
    cliente: "Banco de la Nación",
    descripcion: "Actualización plataforma de pagos",
    fechaInicio: "2025-05-20",
    fechaFin: "2025-06-10",
    ultimoCambio: "2025-06-01",
    estadoActual: "En Elaboración de Propuesta",
  },
  {
    id: 2,
    cliente: "SUNAT",
    descripcion: "Implementación de facturación electrónica",
    fechaInicio: "2025-05-15",
    fechaFin: "2025-05-30",
    ultimoCambio: "2025-06-02",
    estadoActual: "En Revisión GPV",
  },
  {
    id: 3,
    cliente: "EsSalud",
    descripcion: "Sistema de gestión de citas",
    fechaInicio: "2025-05-01",
    fechaFin: "2025-05-25",
    ultimoCambio: "2025-05-28",
    estadoActual: "Aprobada Técnicamente",
  },
  {
    id: 4,
    cliente: "ONPE",
    descripcion: "Sistema de conteo rápido",
    fechaInicio: "2025-05-10",
    fechaFin: "2025-06-15",
    ultimoCambio: "2025-06-01",
    estadoActual: "Asignada a Arquitecto",
  },
  {
    id: 5,
    cliente: "RENIEC",
    descripcion: "Plataforma de emisión de DNI digital",
    fechaInicio: "2025-04-25",
    fechaFin: "2025-05-28",
    ultimoCambio: "2025-05-29",
    estadoActual: "Esperando Estimación de Desarrollo",
  },
  {
    id: 6,
    cliente: "MTC",
    descripcion: "Control de tráfico inteligente",
    fechaInicio: "2025-05-12",
    fechaFin: "2025-06-20",
    ultimoCambio: "2025-06-03",
    estadoActual: "En Elaboración de Propuesta",
  },
  {
    id: 7,
    cliente: "MINSA",
    descripcion: "Digitalización de historias clínicas",
    fechaInicio: "2025-05-08",
    fechaFin: "2025-06-03",
    ultimoCambio: "2025-06-02",
    estadoActual: "En Revisión GPV",
  },
  {
    id: 8,
    cliente: "SIS",
    descripcion: "Mejora en sistema de subsidios",
    fechaInicio: "2025-05-05",
    fechaFin: "2025-06-07",
    ultimoCambio: "2025-06-03",
    estadoActual: "Esperando Estimación de Desarrollo",
  },
  {
    id: 9,
    cliente: "Gobierno Regional de Lima",
    descripcion: "Portal de transparencia ciudadana",
    fechaInicio: "2025-05-10",
    fechaFin: "2025-05-29",
    ultimoCambio: "2025-06-01",
    estadoActual: "Aprobada Técnicamente",
  },
  {
    id: 10,
    cliente: "SUNARP",
    descripcion: "Automatización de registros públicos",
    fechaInicio: "2025-05-14",
    fechaFin: "2025-06-12",
    ultimoCambio: "2025-06-02",
    estadoActual: "Asignada a Arquitecto",
  },
  {
    id: 11,
    cliente: "Ministerio de Educación",
    descripcion: "Plataforma de evaluación docente",
    fechaInicio: "2025-05-06",
    fechaFin: "2025-06-05",
    ultimoCambio: "2025-06-01",
    estadoActual: "En Elaboración de Propuesta",
  },
  {
    id: 12,
    cliente: "Ministerio del Interior",
    descripcion: "Sistema de denuncias en línea",
    fechaInicio: "2025-05-16",
    fechaFin: "2025-06-30",
    ultimoCambio: "2025-06-03",
    estadoActual: "Esperando Estimación de Desarrollo",
  },
  {
    id: 13,
    cliente: "Indecopi",
    descripcion: "Gestión de reclamos y quejas",
    fechaInicio: "2025-05-09",
    fechaFin: "2025-06-02",
    ultimoCambio: "2025-06-02",
    estadoActual: "En Revisión GPV",
  },
  {
    id: 14,
    cliente: "SUTRAN",
    descripcion: "Seguimiento de transporte de carga",
    fechaInicio: "2025-05-03",
    fechaFin: "2025-06-14",
    ultimoCambio: "2025-06-01",
    estadoActual: "En Elaboración de Propuesta",
  },
  {
    id: 15,
    cliente: "SERFOR",
    descripcion: "Sistema de control forestal",
    fechaInicio: "2025-04-30",
    fechaFin: "2025-05-20",
    ultimoCambio: "2025-05-21",
    estadoActual: "Aprobada Técnicamente",
  },
  {
    id: 16,
    cliente: "INEI",
    descripcion: "Censo digital 2025",
    fechaInicio: "2025-05-11",
    fechaFin: "2025-06-25",
    ultimoCambio: "2025-06-03",
    estadoActual: "Asignada a Arquitecto",
  },
  {
    id: 17,
    cliente: "Ministerio de Cultura",
    descripcion: "Plataforma de archivos históricos",
    fechaInicio: "2025-05-07",
    fechaFin: "2025-05-27",
    ultimoCambio: "2025-06-02",
    estadoActual: "Esperando Estimación de Desarrollo",
  },
  {
    id: 18,
    cliente: "Defensoría del Pueblo",
    descripcion: "Sistema de atención ciudadana",
    fechaInicio: "2025-05-18",
    fechaFin: "2025-06-08",
    ultimoCambio: "2025-06-03",
    estadoActual: "En Revisión GPV",
  },
  {
    id: 19,
    cliente: "Ministerio de Justicia",
    descripcion: "Reforma del sistema de procuraduría",
    fechaInicio: "2025-05-02",
    fechaFin: "2025-06-18",
    ultimoCambio: "2025-06-03",
    estadoActual: "En Elaboración de Propuesta",
  },
  {
    id: 20,
    cliente: "OSIPTEL",
    descripcion: "Plataforma de fiscalización de operadoras",
    fechaInicio: "2025-05-19",
    fechaFin: "2025-06-06",
    ultimoCambio: "2025-06-03",
    estadoActual: "Asignada a Arquitecto",
  },
]);

// Calcular días restantes o retraso
propuestas.value = propuestas.value.map((p) => {
  const diasRestantes = dayjs(p.fechaFin).diff(dayjs(), "day");
  return { ...p, diasRestantes };
});

// Gráfico por estado actual
// Gráfico por estado actual con colores personalizados por estado
const chartEstadoData = computed(() => {
  const estados = [
    "Asignada a Arquitecto",
    "En Elaboración de Propuesta",
    "Esperando Estimación de Desarrollo",
    "En Revisión GPV",
    "Aprobada Técnicamente",
  ];

  const colores = [
    "#1E88E5", // azul
    "#43A047", // verde
    "#FB8C00", // naranja
    "#E53935", // rojo
    "#8E24AA", // morado
  ];

  const conteo = estados.map(
    (estado) =>
      propuestas.value.filter((p) => p.estadoActual === estado).length,
  );

  return {
    labels: estados,
    datasets: [
      {
        label: "Propuestas por Estado",
        data: conteo,
        backgroundColor: colores,
      },
    ],
  };
});

// Gráfico de progreso
const chartProgresoData = computed(() => {
  return {
    labels: propuestas.value.map((p) => p.cliente),
    datasets: [
      {
        label: "Días Restantes",
        data: propuestas.value.map((p) => p.diasRestantes),
        backgroundColor: propuestas.value.map((p) =>
          p.diasRestantes >= 0 ? "#4caf50" : "#f44336",
        ),
      },
    ],
  };
});

// Opciones generales para los gráficos
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

// Eventos para el calendario basados en propuestas
const calendarEvents = computed(() =>
  propuestas.value.map((p) => ({
    title: p.cliente,
    date: p.fechaFin,
    color: p.diasRestantes >= 0 ? "#43A047" : "#E53935", // verde si está en plazo, rojo si está retrasado
  })),
);

// Configuración del calendario
const calendarOptions = {
  plugins: [dayGridPlugin],
  initialView: "dayGridMonth",
  events: calendarEvents.value,
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,dayGridWeek,dayGridDay",
  },
};
</script>

<style scoped>
.q-table {
  font-size: 14px;
}
</style>
