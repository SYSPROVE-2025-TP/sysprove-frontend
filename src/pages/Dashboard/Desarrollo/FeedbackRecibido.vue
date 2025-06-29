<template>
  <q-page class="q-pa-md">
    <q-card>
      <!-- Título y acciones -->
      <q-card-section class="row items-center justify-between">
        <div class="text-h5">Feedback Recibido</div>
        <div class="row q-gutter-sm">
          <q-btn
            flat
            icon="refresh"
            label="Actualizar"
            @click="cargarFeedback"
          />
          <q-btn
            color="primary"
            icon="add"
            label="Registrar"
            @click="registrarFeedback"
          />
        </div>
      </q-card-section>

      <!-- Filtros -->
      <q-card-section class="row q-gutter-md items-center">
        <q-select
          v-model="filtroTipo"
          :options="['Positivo', 'Mejora', 'Negativo']"
          label="Tipo de Feedback"
          filled
          clearable
          class="col"
        />
        <q-input
          v-model="filtroCategoria"
          label="Categoría"
          filled
          class="col"
          debounce="300"
        />
        <q-btn label="Aplicar" color="primary" @click="aplicarFiltros" />
        <q-btn label="Limpiar" flat @click="limpiarFiltros" />
      </q-card-section>

      <q-separator />

      <!-- Tabla de feedback -->
      <q-card-section>
        <q-table
          :rows="feedbackFiltrado"
          :columns="columnas"
          row-key="_id"
          :rows-per-page-options="[5, 10, 20]"
          :pagination="paginacion"
          no-data-label="No hay feedback recibido"
        >
          <template v-slot:body-cell-fecha="props">
            <q-td :props="props">
              {{ formatFecha(props.row.fecha) }}
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                dense
                flat
                icon="visibility"
                color="primary"
                @click="mostrarFeedback(props.row)"
              />
              <q-btn
                dense
                flat
                icon="edit"
                color="warning"
                @click="editarFeedback(props.row)"
              />
              <q-btn
                dense
                flat
                icon="delete"
                color="negative"
                @click="eliminarFeedback(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Diálogo de registrar/editar -->
    <q-dialog v-model="dialogVisible">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editando ? "Editar Feedback" : "Registrar Feedback" }}
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-select
            v-model="form.tipo"
            :options="['Positivo', 'Mejora', 'Negativo']"
            label="Tipo"
            filled
          />
          <q-input v-model="form.categoria" label="Categoría" filled />
          <q-input
            v-model="form.comentario"
            type="textarea"
            label="Comentario"
            filled
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="secondary"
            @click="cerrarDialogo"
          />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="guardarFeedback"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../../api";

// Datos
const feedbacks = ref([]);
const feedbackFiltrado = ref([]);
const filtroTipo = ref("");
const filtroCategoria = ref("");
const paginacion = ref({ rowsPerPage: 5, page: 1 });

// Columnas de tabla
const columnas = [
  { name: "fecha", label: "Fecha", align: "left", field: "fecha" },
  { name: "tipo", label: "Tipo", align: "left", field: "tipo" },
  { name: "categoria", label: "Categoría", align: "left", field: "categoria" },
  {
    name: "comentario",
    label: "Comentario",
    align: "left",
    field: "comentario",
  },
  {
    name: "acciones",
    label: "Acciones",
    align: "center",
    field: "acciones",
    sortable: false,
  },
];

// ID de usuario simulado
const userId = "dev123";

// Estado del diálogo
const dialogVisible = ref(false);
const editando = ref(false);
const form = ref({
  _id: null,
  tipo: "",
  categoria: "",
  comentario: "",
});

// Cargar feedbacks
const cargarFeedback = async () => {
  try {
    const res = await api.get(`/feedback/receptor/${userId}`);
    feedbacks.value = res.data;
    aplicarFiltros();
  } catch (err) {
    console.error("Error al cargar feedback:", err);
  }
};

// Aplicar filtros
const aplicarFiltros = () => {
  feedbackFiltrado.value = feedbacks.value.filter((f) => {
    const coincideTipo = filtroTipo.value ? f.tipo === filtroTipo.value : true;
    const coincideCategoria = filtroCategoria.value
      ? f.categoria.toLowerCase().includes(filtroCategoria.value.toLowerCase())
      : true;
    return coincideTipo && coincideCategoria;
  });
};

// Limpiar filtros
const limpiarFiltros = () => {
  filtroTipo.value = "";
  filtroCategoria.value = "";
  aplicarFiltros();
};

// Formato de fecha
const formatFecha = (fecha) => {
  return fecha ? new Date(fecha).toLocaleDateString("es-ES") : "";
};

// Registrar feedback (abrir diálogo)
const registrarFeedback = () => {
  editando.value = false;
  form.value = {
    _id: null,
    tipo: "",
    categoria: "",
    comentario: "",
  };
  dialogVisible.value = true;
};

// Editar feedback (abrir diálogo con datos)
const editarFeedback = (item) => {
  editando.value = true;
  form.value = { ...item };
  dialogVisible.value = true;
};

// Cerrar diálogo
const cerrarDialogo = () => {
  dialogVisible.value = false;
};

// Guardar feedback (crear o actualizar)
const guardarFeedback = async () => {
  try {
    const payload = {
      tipo: form.value.tipo,
      categoria: form.value.categoria,
      comentario: form.value.comentario,
      fecha: new Date(),
      receptor_id: userId,
      emisor_id: "emisor1", // simulado
    };

    if (editando.value && form.value._id) {
      await api.put(`/feedback/${form.value._id}`, payload);
    } else {
      await api.post("/feedback", payload);
    }

    dialogVisible.value = false;
    cargarFeedback();
  } catch (err) {
    console.error("Error al guardar feedback:", err);
  }
};

// Eliminar feedback
const eliminarFeedback = async (item) => {
  const confirmacion = confirm("¿Estás seguro de eliminar este feedback?");
  if (confirmacion) {
    try {
      await api.delete(`/feedback/${item._id}`);
      cargarFeedback();
    } catch (err) {
      console.error("Error al eliminar feedback:", err);
    }
  }
};

// Mostrar feedback (opcional, aquí solo console.log)
const mostrarFeedback = (item) => {
  console.log("Mostrar feedback:", item);
};

onMounted(() => {
  cargarFeedback();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
