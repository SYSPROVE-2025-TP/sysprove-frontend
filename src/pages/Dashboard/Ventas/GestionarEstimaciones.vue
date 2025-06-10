[media pointer="file-service://file-T1v52FBi5uPvRJiGViH2Le"] este es mi vue
agregale lo de la foto mi vue esta asi actualmente

<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Listado de Componentes</div>
        <q-btn
          color="primary"
          label="Agregar Componente"
          @click="abrirModalAgregar"
        />
      </q-card-section>

      <q-card-section>
        <q-input filled v-model="filtro" label="Buscar..." class="q-mb-md" />

        <q-table
          :rows="filtrarComponentes"
          :columns="columnas"
          row-key="_id"
          :rows-per-page-options="[25, 50, 100]"
        >
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge
                color="blue-2"
                text-color="blue-9"
                v-if="props.row.estado === 'Solicitado'"
                >Solicitado</q-badge
              >
              <q-badge color="grey-3" text-color="grey-8" v-else
                >No solicitado</q-badge
              >
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                @click="editarComponente(props.row)"
              />
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="confirmarEliminar(props.row)"
              />
              <q-toggle
                :model-value="props.row.estado === 'Solicitado'"
                disable
                color="blue"
                class="q-ml-sm"
              />
              <q-btn
                v-if="props.row.estado === 'Solicitado'"
                flat
                dense
                color="deep-orange"
                icon="cancel"
                label="Cancelar Estimación"
                @click="confirmarCancelar(props.row)"
              />
              <q-btn
                v-else
                flat
                dense
                color="primary"
                label="Solicitar Estimación"
                @click="solicitarEstimacion(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Diálogo de agregar/editar componente -->
    <q-dialog v-model="mostrarModal">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicion ? "Editar Componente" : "Agregar Componente" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="formulario.nombre"
            label="Nombre del componente"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="guardarComponente"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <q-dialog v-model="mostrarConfirmacion">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            ¿Estás seguro que deseas eliminar este componente?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            flat
            label="Eliminar"
            color="negative"
            @click="eliminarComponente"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import {
  QBtn,
  QCardSection,
  QSeparator,
  QBtnToggle,
  QTd,
  QTable,
  QCard,
  QInput,
  QCardActions,
  QDialog,
  QPage,
  ClosePopup,
  QBadge,
  QToggle,
} from "quasar";
import { ref, computed, onMounted } from "vue";
import api from "../../../api"; // ✅ RUTA CORREGIDA
import { useAuthStore } from "../../../stores/auth"; // ✅ RUTA CORREGIDA

const authStore = useAuthStore();

const componentes = ref([]);
const filtro = ref("");
const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const componenteSeleccionado = ref(null);
const modoEdicion = ref(false);

const formulario = ref({
  nombre: "",
});

const columnas = [
  // { name: "id", label: "ID", align: "left", field: "_id" },
  { name: "nombre", label: "Nombre", align: "left", field: "nombre" },
  { name: "estado", label: "Estado", align: "left" },
  { name: "acciones", label: "Acción", align: "center" },
];

const cargarComponentes = async () => {
  try {
    const res = await api.get("/componentes", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    componentes.value = res.data;
  } catch (error) {
    console.error("Error al cargar componentes:", error);
  }
};

const filtrarComponentes = computed(() => {
  if (!filtro.value) return componentes.value;
  return componentes.value.filter((comp) =>
    comp.nombre.toLowerCase().includes(filtro.value.toLowerCase()),
  );
});

const abrirModalAgregar = () => {
  formulario.value = { nombre: "" };
  modoEdicion.value = false;
  mostrarModal.value = true;
};

const editarComponente = (comp) => {
  formulario.value = { ...comp };
  componenteSeleccionado.value = comp;
  modoEdicion.value = true;
  mostrarModal.value = true;
};

const guardarComponente = async () => {
  try {
    if (modoEdicion.value) {
      await api.put(
        `/componentes/${componenteSeleccionado.value._id}`,
        formulario.value,
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        },
      );
    } else {
      await api.post("/componentes", formulario.value, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    }
    mostrarModal.value = false;
    await cargarComponentes();
  } catch (error) {
    console.error("Error al guardar componente:", error);
  }
};

const confirmarEliminar = (comp) => {
  componenteSeleccionado.value = comp;
  mostrarConfirmacion.value = true;
};

const eliminarComponente = async () => {
  try {
    await api.delete(`/componentes/${componenteSeleccionado.value._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    mostrarConfirmacion.value = false;
    await cargarComponentes();
  } catch (error) {
    console.error("Error al eliminar componente:", error);
  }
};

const solicitarEstimacion = async (comp) => {
  try {
    await api.put(
      `/componentes/solicitar-estimacion/${comp._id}`,
      {},
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    await cargarComponentes();
  } catch (error) {
    console.error("Error al solicitar estimación:", error);
  }
};

const confirmarCancelar = async (comp) => {
  if (confirm("¿Seguro que deseas cancelar la estimación?")) {
    try {
      await api.put(
        `/componentes/cancelar-estimacion/${comp._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        },
      );
      await cargarComponentes();
    } catch (error) {
      console.error("Error al cancelar estimación:", error);
    }
  }
};

onMounted(() => {
  cargarComponentes();
});
</script>

<style scoped>
.q-table .q-btn {
  margin-right: 4px;
}
</style>
