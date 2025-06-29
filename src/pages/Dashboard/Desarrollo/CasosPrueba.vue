<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Gestión de Casos de Prueba</div>
        <div class="q-mt-sm">
          <q-select
            v-model="selectedProyecto"
            :options="proyectos"
            label="Seleccionar Proyecto"
            emit-value
            map-options
            option-label="nombre"
            option-value="_id"
            outlined
          />
        </div>
        <q-btn
          label="Nuevo Caso de Prueba"
          color="primary"
          icon="add"
          class="q-mt-md"
          @click="abrirDialogo"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          title="Casos de Prueba"
          :rows="casos"
          :columns="columnas"
          row-key="_id"
          flat
          bordered
        >
          <template v-slot:body-cell-acciones="props">
            <q-td>
              <q-btn
                icon="edit"
                flat
                color="blue"
                @click="editarCaso(props.row)"
              />
              <q-btn
                icon="delete"
                flat
                color="red"
                @click="eliminarCaso(props.row._id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialogo para Crear/Editar -->
    <q-dialog v-model="dialogoAbierto">
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">
          {{ editando ? "Editar" : "Nuevo" }} Caso de Prueba
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.titulo" label="Título" dense outlined />
          <q-input
            v-model="form.descripcion"
            label="Descripción"
            dense
            outlined
          />
          <q-input
            v-model="form.pasos"
            label="Pasos a seguir"
            type="textarea"
            dense
            outlined
          />
          <q-input
            v-model="form.resultadoEsperado"
            label="Resultado Esperado"
            type="textarea"
            dense
            outlined
          />
          <q-input
            v-model="form.resultadoObtenido"
            label="Resultado Obtenido"
            type="textarea"
            dense
            outlined
          />
          <q-input
            v-model="form.usuarioAsignado"
            label="Usuario Asignado"
            dense
            outlined
          />
          <q-select
            v-model="form.estado"
            :options="['Pendiente', 'En Proceso', 'Completado', 'Fallido']"
            label="Estado"
            dense
            outlined
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="guardarCaso" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "src/api";

const casos = ref([]);
const proyectos = ref([]);
const selectedProyecto = ref(null);
const dialogoAbierto = ref(false);
const form = ref({
  titulo: "",
  descripcion: "",
  pasos: "",
  resultadoEsperado: "",
  resultadoObtenido: "",
  usuarioAsignado: "",
  estado: "",
  proyectoId: "",
});
const editando = ref(false);
const casoEditandoId = ref(null);

const columnas = [
  { name: "descripcion", label: "Descripción", field: "descripcion" },
  { name: "estado", label: "Estado", field: "estado" },
  { name: "acciones", label: "Acciones", field: "acciones" },
];

const obtenerProyectos = async () => {
  try {
    const res = await api.get("/api/proyectos-desarrollo");
    proyectos.value = res.data;
  } catch (error) {
    console.error("Error obteniendo proyectos:", error);
  }
};

const obtenerCasos = async () => {
  if (!selectedProyecto.value) return;
  try {
    const res = await api.get(
      `/api/casos-prueba/proyecto/${selectedProyecto.value}`,
    );
    casos.value = res.data;
  } catch (error) {
    console.error("Error obteniendo casos:", error);
  }
};

const abrirDialogo = () => {
  form.value = {
    titulo: "",
    descripcion: "",
    pasos: "",
    resultadoEsperado: "",
    resultadoObtenido: "",
    usuarioAsignado: "",
    estado: "",
    proyectoId: selectedProyecto.value,
  };
  dialogoAbierto.value = true;
  editando.value = false;
};

const guardarCaso = async () => {
  try {
    if (editando.value) {
      await api.put(`/api/casos-prueba/${casoEditandoId.value}`, form.value);
    } else {
      await api.post("/api/casos-prueba", {
        ...form.value,
        proyectoId: selectedProyecto.value,
      });
    }
    dialogoAbierto.value = false;
    await obtenerCasos();
  } catch (error) {
    console.error("Error guardando caso:", error);
  }
};

const editarCaso = (caso) => {
  form.value = {
    titulo: caso.titulo,
    descripcion: caso.descripcion,
    pasos: caso.pasos,
    resultadoEsperado: caso.resultadoEsperado,
    resultadoObtenido: caso.resultadoObtenido,
    usuarioAsignado: caso.usuarioAsignado,
    estado: caso.estado,
    proyectoId: caso.proyectoId,
  };
  casoEditandoId.value = caso._id;
  editando.value = true;
  dialogoAbierto.value = true;
};

const eliminarCaso = async (id) => {
  try {
    await api.delete(`/api/casos-prueba/${id}`);
    await obtenerCasos();
  } catch (error) {
    console.error("Error eliminando caso:", error);
  }
};

watch(selectedProyecto, obtenerCasos);

onMounted(() => {
  obtenerProyectos();
});
</script>
