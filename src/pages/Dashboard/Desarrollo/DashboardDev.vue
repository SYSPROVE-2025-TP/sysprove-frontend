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
          row-key="_id"
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
import axios from "axios";
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
  {
    name: "estadoGeneral",
    label: "Estado",
    field: "estadoGeneral",
    align: "left",
  },
  {
    name: "proyecto",
    label: "Proyecto",
    field: (row) => row.proyectoDesarrollo?.nombre || "",
    align: "left",
  },
];

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [resProyectos, resBacklogs, resSprints] = await Promise.all([
      axios.get("http://localhost:4000/api/proyectos-desarrollo", config),
      axios.get("http://localhost:4000/api/backlog-items", config),
      axios.get("http://localhost:4000/api/sprints", config),
    ]);

    totalProyectos.value = resProyectos.data.length;
    totalBacklogs.value = resBacklogs.data.length;
    totalBacklogsCompletados.value = resBacklogs.data.filter(
      (item) => item.estadoGeneral === "Completado",
    ).length;
    totalSprints.value = resSprints.data.length;

    backlogsPendientes.value = resBacklogs.data.filter(
      (item) => item.estadoGeneral !== "Completado",
    );

    avanceProyectos.value = resProyectos.data.map((proyecto) => {
      const backlogs = resBacklogs.data.filter(
        (b) => b.proyectoDesarrollo === proyecto._id,
      );
      const total = backlogs.length;
      const completados = backlogs.filter(
        (b) => b.estadoGeneral === "Completado",
      ).length;
      return {
        nombre: proyecto.nombre,
        porcentaje: total ? completados / total : 0,
      };
    });

    graficarDistribucion();
  } catch (error) {
    console.error("Error cargando dashboard de desarrollo:", error);
  }
});

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
</script>

<style scoped>
.text-h6,
.text-subtitle1 {
  font-weight: bold;
}
</style>
