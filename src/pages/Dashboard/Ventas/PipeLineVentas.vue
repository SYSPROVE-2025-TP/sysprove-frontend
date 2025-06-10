<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="q-gutter-md q-mx-auto" style="max-width: 800px">
      <q-card flat bordered class="q-pa-lg shadow-2">
        <div class="text-h5 text-primary q-mb-md">
          Pipeline global de ventas
        </div>

        <q-table
          flat
          :rows="etapas"
          :columns="columns"
          row-key="nombre"
          hide-bottom
        >
          <template v-slot:body-cell-montoTotal="props">
            <q-td :props="props" class="text-right relative-position">
              {{ formatCurrency(props.row.montoTotal) }}
              <div
                class="absolute-full"
                style="opacity: 0.15"
                :style="{
                  width: getPorcentaje(props.row.montoTotal) + '%',
                  backgroundColor: props.row.color,
                  borderRadius: '8px 0 0 8px',
                }"
              ></div>
            </q-td>
          </template>
        </q-table>

        <q-separator class="q-my-md" />

        <div
          class="row items-center justify-between q-mt-md text-primary text-weight-bold"
        >
          <div>Totales generales</div>
          <div>{{ totalCantidad }} oportunidades</div>
          <div class="relative-position">
            {{ formatCurrency(totalMonto) }}
            <div
              class="absolute-full"
              style="
                opacity: 0.15;
                background-color: #1e88e5;
                border-radius: 8px 0 0 8px;
              "
            ></div>
          </div>
        </div>

        <q-btn
          icon="arrow_back"
          label="Retroceder"
          color="grey"
          class="q-mt-lg"
          @click="goBack"
          unelevated
        />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const etapas = ref([
  {
    nombre: "Contacto inicial",
    cantidad: 5,
    montoTotal: 10000,
    color: "#90a4ae",
  },
  { nombre: "Calificación", cantidad: 4, montoTotal: 15000, color: "#42a5f5" },
  {
    nombre: "Propuesta Enviada",
    cantidad: 3,
    montoTotal: 20000,
    color: "#29b6f6",
  },
  { nombre: "Negociación", cantidad: 2, montoTotal: 30000, color: "#43a047" },
  { nombre: "Cierre Ganado", cantidad: 1, montoTotal: 25000, color: "#fbc02d" },
]);

const totalMonto = computed(() =>
  etapas.value.reduce((sum, e) => sum + e.montoTotal, 0),
);
const totalCantidad = computed(() =>
  etapas.value.reduce((sum, e) => sum + e.cantidad, 0),
);

const getPorcentaje = (monto) => {
  if (totalMonto.value === 0) return 0;
  return (monto * 100) / totalMonto.value;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const goBack = () => router.back();

const columns = [
  { name: "nombre", label: "Etapa de venta", align: "left", field: "nombre" },
  {
    name: "cantidad",
    label: "Cantidad de oportunidades",
    align: "center",
    field: "cantidad",
  },
  {
    name: "montoTotal",
    label: "Monto total estimado",
    align: "right",
    field: "montoTotal",
  },
];
</script>

<style scoped>
.relative-position {
  position: relative;
}
.absolute-full {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 0;
}
</style>
