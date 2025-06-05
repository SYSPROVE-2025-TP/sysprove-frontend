<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Resumen de Descuentos aprobados</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="propuestas.filter((p) => p.estado === 'Aprobada')"
          :columns="columnas"
          row-key="_id"
          no-data-label="Actualmente no hay propuestas validados"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <!-- Botón para eliminar propuesta aprobada -->
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="mostrarConfirmacionEliminar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Diálogo de Confirmación -->
    <q-dialog v-model="mostrarConfirmacion">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ mensajeConfirmacion }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="cerrarConfirmacion"
          />
          <q-btn
            flat
            label="Eliminar"
            color="primary"
            @click="confirmarAccion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../../stores/auth";
import api from "../../../api";

const authStore = useAuthStore();

const propuestas = ref([]);
const clientesOptions = ref([]);

const columnas = [
  {
    name: "cliente",
    label: "Entidad Asociada",
    align: "left",
    field: (row) => row.cliente?.nombre || "Sin registro",
  },
  {
    name: "descripcion",
    label: "Detalle de la propuesta",
    align: "left",
    field: "descripcion",
  },
  { name: "monto", label: "Valor Estimado", align: "left", field: "monto" },
  {
    name: "fechaInicio",
    label: "Fecha de Inicio",
    align: "left",
    field: "fechaInicio",
  },
  {
    name: "fechaFin",
    label: "Fecha de Cierre",
    align: "left",
    field: "fechaFin",
  },
  { name: "estado", label: "Estatus", align: "left", field: "estado" },
  { name: "acciones", label: "Opciones", align: "center" },
];

const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const propuestaSeleccionada = ref(null);

const cargarPropuestas = async () => {
  try {
    const respuesta = await api.get("/propuestas", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    propuestas.value = respuesta.data;
  } catch (error) {
    console.error("Error al obtener la información:", error);
    alert("Ocurrió un problema al cargar los datos.");
  }
};

const mostrarConfirmacionEliminar = (propuesta) => {
  mensajeConfirmacion.value =
    "¿Desea eliminar esta propuesta aprobada del listado?";
  propuestaSeleccionada.value = propuesta;
  mostrarConfirmacion.value = true;
};

const confirmarAccion = () => {
  eliminarPropuesta();
};

const eliminarPropuesta = async () => {
  try {
    await api.delete(`/propuestas/${propuestaSeleccionada.value._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    alert("El registro ha sido eliminado exitosamente.");
    cargarPropuestas();
    mostrarConfirmacion.value = false;
  } catch (error) {
    console.error("Error al intentar eliminar:", error);
    alert("No fue posible eliminar la propuesta.");
  }
};

const cerrarConfirmacion = () => {
  mostrarConfirmacion.value = false;
};

onMounted(() => {
  cargarPropuestas();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
