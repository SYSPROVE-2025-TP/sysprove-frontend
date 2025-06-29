<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Feedback de Desarrollo de proyectos</div>
      </div>
    </div>

    <!-- Spinner de carga -->
    <div v-if="isLoading" class="flex flex-center q-my-xl">
      <q-spinner-dots size="40px" color="primary" />
      <span class="q-ml-md">Cargando feedbacks...</span>
    </div>

    <!-- Tabla de feedbacks -->
    <div v-else>
      <q-table
        :rows="feedbacks"
        :columns="columns"
        row-key="id"
        flat
        bordered
        dense
        :loading="isLoading"
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="center">
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:no-data>
          <q-banner class="bg-grey-2 text-grey-8">
            No hay feedbacks registrados.
          </q-banner>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import api from "../../../api";

const $q = useQuasar();
const feedbacks = ref([]);
const isLoading = ref(true);

// Definición de columnas
const columns = [
  {
    name: "proyectoNombre",
    label: "Proyecto",
    field: "proyectoNombre",
    align: "left",
  },
  {
    name: "tipoCambio",
    label: "Tipo de Cambio",
    field: "tipoCambio",
    align: "left",
  },
  {
    name: "descripcion",
    label: "Descripción",
    field: "descripcion",
    align: "left",
  },
  { name: "impacto", label: "Impacto", field: "impacto", align: "left" },
  { name: "fecha", label: "Fecha", field: "fecha", align: "left" },
  { name: "actions", label: "Acciones", field: "actions", align: "center" },
];

// Carga inicial de datos
onMounted(loadFeedbacks);
async function loadFeedbacks() {
  isLoading.value = true;
  try {
    const { data } = await api.get("/api/repositorio-ventas/feedbacks");
    feedbacks.value = data.map((f) => ({
      ...f,
      fecha: new Date(f.fecha).toLocaleString("es-PE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  } catch (err) {
    console.error("Error al cargar feedbacks:", err);
    $q.notify({ type: "negative", message: "Error al cargar los feedbacks." });
  } finally {
    isLoading.value = false;
  }
}

// Confirmación con window.confirm
function confirmDelete(row) {
  console.log("🗑️ confirmDelete fired for:", row);
  if (window.confirm(`¿Eliminar feedback de "${row.proyectoNombre}"?`)) {
    deleteFeedback(row.id);
  }
}

// Llamada DELETE al backend
async function deleteFeedback(id) {
  console.log("🗑️ deleteFeedback called with id=", id);
  try {
    await api.delete(`/api/repositorio-ventas/feedback-desarrollo/${id}`);
    feedbacks.value = feedbacks.value.filter((f) => f.id !== id);
    $q.notify({ type: "positive", message: "Feedback eliminado." });
  } catch (err) {
    console.error("Error al eliminar feedback:", err);
    $q.notify({ type: "negative", message: "Error al eliminar el feedback." });
  }
}
</script>

<style scoped>
/* estilos opcionales */
</style>
