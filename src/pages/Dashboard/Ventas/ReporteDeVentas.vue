<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-center q-mb-md text-weight-bold text-primary">
      PANEL : RENDIMIENTO POR VENDEDOR
    </div>

    <q-card flat bordered class="q-pa-md">
      <div class="row justify-between items-center q-mb-md">
        <div class="text-subtitle1 text-bold">DETALLES POR VENDEDOR</div>
        <div class="row items-center">
          <q-input
            dense
            outlined
            placeholder="Search"
            v-model="search"
            class="q-mr-sm"
          />
          <q-select
            dense
            outlined
            v-model="filtroDias"
            :options="['Últimos 7 días', 'Últimos 30 días', 'Este año']"
            class="q-mr-sm"
          />
        </div>
      </div>

      <q-table
        :rows="filtrados"
        :columns="columnas"
        row-key="nombre"
        flat
        hide-bottom
        class="tabla-rendimiento"
      >
        <template v-slot:body-cell-vendedor="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-avatar>
                <img :src="props.row.avatar" />
              </q-avatar>
              <div class="q-ml-sm">{{ props.row.nombre }}</div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-valorGanado="props">
          <q-td :props="props">
            $ {{ Number(props.row.valorGanado).toFixed(2) }}
          </q-td>
        </template>

        <template v-slot:body-cell-tasaCierre="props">
          <q-td :props="props"> {{ props.row.tasaCierre }}% </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";

const filtroDias = ref("Últimos 30 días");
const search = ref("");

const vendedores = ref([
  {
    nombre: "Juan Pérez",
    creadas: 120,
    ganadas: 70,
    perdidas: 50,
    valorGanado: 8500,
    tasaCierre: 65,
    avatar: "https://i.pravatar.cc/150?img=3",
  },

  {
    nombre: "Luis Torres",
    creadas: 80,
    ganadas: 50,
    perdidas: 30,
    valorGanado: 7500,
    tasaCierre: 30,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    nombre: "Ana Gómez",
    creadas: 60,
    ganadas: 30,
    perdidas: 30,
    valorGanado: 8500,
    tasaCierre: 15,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    nombre: "Rodrigo Nuñez",
    creadas: 90,
    ganadas: 45,
    perdidas: 45,
    valorGanado: 2500,
    tasaCierre: 50,
    avatar: "https://i.pravatar.cc/150?img=6",
  },
]);

const columnas = [
  {
    name: "vendedor",
    label: "Vendedor",
    field: "nombre",
    align: "left",
  },
  { name: "creadas", label: "Creadas", field: "creadas", align: "center" },
  { name: "ganadas", label: "Ganadas", field: "ganadas", align: "center" },
  { name: "perdidas", label: "Pérdidas", field: "perdidas", align: "center" },
  {
    name: "valorGanado",
    label: "Valor Ganado",
    field: "valorGanado",
    align: "center",
  },
  {
    name: "tasaCierre",
    label: "Tasa de Cierre",
    field: "tasaCierre",
    align: "center",
  },
];

const filtrados = computed(() => {
  return vendedores.value.filter((v) =>
    v.nombre.toLowerCase().includes(search.value.toLowerCase()),
  );
});
</script>

<style scoped>
.tabla-rendimiento .q-td {
  font-size: 14px;
}
</style>
