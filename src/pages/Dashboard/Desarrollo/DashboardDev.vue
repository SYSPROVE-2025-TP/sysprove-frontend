<template>
  <q-page class="q-pa-md">
    <!-- Tarjetas de KPI -->
    <div class="row q-col-gutter-sm q-mb-md">
      <q-card class="col-xs-6 col-sm-3 bg-primary text-white q-pa-sm shadow-2">
        <div class="text-subtitle2">Proyectos</div>
        <div class="text-h6">{{ totalProyectos }}</div>
      </q-card>
      <q-card
        class="col-xs-6 col-sm-3 bg-deep-purple text-white q-pa-sm shadow-2"
      >
        <div class="text-subtitle2">Sprints</div>
        <div class="text-h6">{{ totalSprints }}</div>
      </q-card>
      <q-card class="col-xs-6 col-sm-3 bg-green text-white q-pa-sm shadow-2">
        <div class="text-subtitle2">Backlogs</div>
        <div class="text-h6">{{ totalBacklogs }}</div>
      </q-card>
      <q-card class="col-xs-6 col-sm-3 bg-orange text-white q-pa-sm shadow-2">
        <div class="text-subtitle2">Backlogs Completados</div>
        <div class="text-h6">{{ totalBacklogsCompletados }}</div>
      </q-card>
    </div>

    <!-- Distribución de Backlogs y Lista Pendiente -->
    <div class="row q-col-gutter-sm q-mb-md">
      <q-card class="col-12 col-md-4 q-pa-md shadow-2">
        <div class="text-subtitle1 q-mb-sm">Distribución de Backlogs</div>
        <canvas ref="chartCanvas" height="150"></canvas>
      </q-card>

      <q-card class="col-12 col-md-8 q-pa-md shadow-2">
        <div class="text-subtitle1 q-mb-sm">Backlogs Pendientes</div>
        <q-table
          :rows="backlogsPendientes"
          :columns="columns"
          row-key="nombre"
          dense
          flat
          bordered
          hide-pagination
          :rows-per-page-options="[5, 10]"
        />
      </q-card>
    </div>

    <!-- Avance por Proyecto -->
    <q-card class="q-pa-md shadow-2">
      <div class="text-subtitle1 q-mb-sm">Avance por Proyecto</div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="avance in avanceProyectos"
          :key="avance.nombre"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card class="q-pa-sm">
            <div class="text-caption">{{ avance.nombre }}</div>
            <q-linear-progress
              :value="avance.porcentaje"
              color="primary"
              class="q-mt-xs"
            />
            <div class="text-caption text-right">
              {{ Math.round(avance.porcentaje * 100) }}%
            </div>
          </q-card>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

const totalProyectos = ref(0);
const totalSprints = ref(0);
const totalBacklogs = ref(0);
const totalBacklogsCompletados = ref(0);
const backlogsPendientes = ref([]);
const avanceProyectos = ref([]);
const chartCanvas = ref(null);

const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
  { name: "tipo", label: "Tipo", field: "tipo", align: "left" },
  { name: "estado", label: "Estado", field: "estado", align: "left" },
  {
    name: "proyecto",
    label: "Proyecto",
    field: (row) => row.proyecto?.nombre || "",
    align: "left",
  },
];

const cargarDatosFalsos = () => {
  const proyectos = Array.from({ length: 15 }, (_, i) => ({
    nombre: `Proyecto ${i + 1}`,
    sprints: Array.from({ length: Math.floor(Math.random() * 4) + 1 }),
    backlogs: Array.from(
      { length: Math.floor(Math.random() * 6) + 2 },
      (_, j) => ({
        nombre: `Backlog ${j + 1}`,
        tipo: j % 2 === 0 ? "Funcionalidad" : "Técnico",
        estado: Math.random() > 0.4 ? "Completado" : "Pendiente",
      }),
    ),
  }));

  totalProyectos.value = proyectos.length;
  totalSprints.value = proyectos.reduce((acc, p) => acc + p.sprints.length, 0);
  totalBacklogs.value = proyectos.reduce(
    (acc, p) => acc + p.backlogs.length,
    0,
  );
  totalBacklogsCompletados.value = proyectos.reduce(
    (acc, p) =>
      acc + p.backlogs.filter((b) => b.estado === "Completado").length,
    0,
  );

  avanceProyectos.value = proyectos.map((p) => {
    const total = p.backlogs.length;
    const completados = p.backlogs.filter(
      (b) => b.estado === "Completado",
    ).length;
    return {
      nombre: p.nombre,
      porcentaje: total ? completados / total : 0,
    };
  });

  backlogsPendientes.value = proyectos.flatMap((p) =>
    p.backlogs
      .filter((b) => b.estado === "Pendiente")
      .map((b) => ({ ...b, proyecto: { nombre: p.nombre } })),
  );

  graficarDistribucion();
};

const graficarDistribucion = () => {
  const completados = totalBacklogsCompletados.value;
  const pendientes = totalBacklogs.value - completados;
  const ctx = chartCanvas.value?.getContext("2d");
  if (!ctx) return;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completados", "Pendientes"],
      datasets: [
        {
          data: [completados, pendientes],
          backgroundColor: ["#4caf50", "#ff9800"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
};

onMounted(cargarDatosFalsos);
</script>

<style scoped>
.text-h6,
.text-subtitle1 {
  font-weight: bold;
}
</style>
