<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md shadow-2">
      <q-card-section>
        <div class="text-h5 text-primary">Dashboard de Soporte</div>
        <div class="text-caption">
          Resumen de incidencias por nivel de soporte y escalamientos
        </div>
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section>
        <div class="row q-col-gutter-md">
          <q-card class="col-12 col-sm-6 col-md-3 bg-grey-1">
            <q-card-section>
              <div class="text-subtitle1">Nivel 1</div>
              <q-badge
                color="orange"
                class="q-mt-sm"
                label="{{ n1 }} incidencias"
              />
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 col-md-3 bg-grey-1">
            <q-card-section>
              <div class="text-subtitle1">Nivel 2</div>
              <q-badge
                color="blue"
                class="q-mt-sm"
                label="{{ n2 }} incidencias"
              />
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 col-md-3 bg-grey-1">
            <q-card-section>
              <div class="text-subtitle1">Nivel 3</div>
              <q-badge
                color="deep-purple"
                class="q-mt-sm"
                label="{{ n3 }} incidencias"
              />
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 col-md-3 bg-grey-1">
            <q-card-section>
              <div class="text-subtitle1">Escalamientos</div>
              <q-badge
                color="red"
                class="q-mt-sm"
                label="{{ escalamientos.length }} activos"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Últimas incidencias reportadas</div>
        <q-table
          :rows="ultimasIncidencias"
          :columns="columns"
          row-key="_id"
          flat
          dense
          bordered
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../../api";
import { useAuthStore } from "../../../stores/auth";

const authStore = useAuthStore();

const incidencias = ref([]);
const escalamientos = ref([]);
const ultimasIncidencias = ref([]);

const n1 = ref(0);
const n2 = ref(0);
const n3 = ref(0);

const columns = [
  {
    name: "cliente",
    label: "Cliente",
    field: (row) => row.cliente?.nombre || "",
    align: "left",
  },
  { name: "categoria", label: "Categoría", field: "categoria", align: "left" },
  { name: "estado", label: "Estado", field: "estado", align: "left" },
  {
    name: "fechaReporte",
    label: "Fecha Reporte",
    field: (row) => new Date(row.fechaReporte).toLocaleDateString(),
    align: "left",
  },
];

onMounted(async () => {
  try {
    const resInc = await api.get("api/incidencias", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const resEsc = await api.get("api/escalamientos", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    incidencias.value = resInc.data;
    escalamientos.value = resEsc.data;
    ultimasIncidencias.value = incidencias.value.slice(0, 5);

    n1.value = incidencias.value.filter((i) => i.estado === "Abierto").length;
    n2.value = incidencias.value.filter(
      (i) => i.estado === "En Proceso",
    ).length;
    n3.value = incidencias.value.filter((i) => i.estado === "Resuelto").length;
  } catch (error) {
    console.error("Error cargando datos:", error);
  }
});
</script>

<style scoped>
.bg-grey-1 {
  background-color: #f5f5f5;
  border-left: 4px solid #ccc;
}
</style>
