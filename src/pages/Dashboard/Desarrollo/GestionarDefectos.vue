<template>
  <q-page padding>
    <q-toolbar class="bg-primary text-white q-mb-md">
      <q-toolbar-title>Gestión de Defectos</q-toolbar-title>
      <q-btn
        label="Nuevo Defecto"
        color="white"
        text-color="primary"
        @click="abrirFormularioNuevo"
      />
    </q-toolbar>

    <q-table
      title="Defectos Reportados"
      :rows="defectos"
      :columns="columnas"
      row-key="_id"
      flat
      bordered
    >
      <template v-slot:body-cell-acciones="props">
        <q-td>
          <q-btn
            icon="edit"
            size="sm"
            color="primary"
            flat
            @click="editar(props.row)"
          />
          <q-btn
            icon="delete"
            size="sm"
            color="negative"
            flat
            @click="eliminar(props.row._id)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Modal para crear o editar defecto -->
    <q-dialog v-model="abrirModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ modo === "crear" ? "Nuevo Defecto" : "Editar Defecto" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="form.descripcion"
            label="Descripción"
            filled
            class="q-mb-sm"
          />
          <q-select
            v-model="form.estado"
            :options="['Abierto', 'En Progreso', 'Resuelto']"
            label="Estado"
            filled
            class="q-mb-sm"
          />
          <q-input
            v-model="form.reportadoPor"
            label="Reportado por"
            filled
            class="q-mb-sm"
          />
          <q-input
            v-model="form.funcionalidad"
            label="Funcionalidad Relacionada"
            filled
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="cerrarModal" />
          <q-btn flat label="Guardar" color="primary" @click="guardarDefecto" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const defectos = ref([]);
const columnas = [
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  { name: "estado", label: "Estado", align: "left", field: "estado" },
  {
    name: "reportadoPor",
    label: "Reportado por",
    align: "left",
    field: "reportadoPor",
  },
  {
    name: "funcionalidad",
    label: "Funcionalidad",
    align: "left",
    field: "funcionalidad",
  },
  { name: "acciones", label: "Acciones", align: "center" },
];

// Modal y formulario
const abrirModal = ref(false);
const modo = ref("crear");
const form = ref({
  descripcion: "",
  estado: "Abierto",
  reportadoPor: "",
  funcionalidad: "",
});

const abrirFormularioNuevo = () => {
  modo.value = "crear";
  form.value = {
    descripcion: "",
    estado: "Abierto",
    reportadoPor: "",
    funcionalidad: "",
  };
  abrirModal.value = true;
};

const cerrarModal = () => {
  abrirModal.value = false;
  form.value = {
    descripcion: "",
    estado: "Abierto",
    reportadoPor: "",
    funcionalidad: "",
  };
};

const cargarDefectos = async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/errores");
    defectos.value = res.data;
  } catch (err) {
    console.error("Error al cargar defectos:", err);
  }
};

const guardarDefecto = async () => {
  try {
    await axios.post("http://localhost:4000/api/errores", form.value, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    cerrarModal();
    cargarDefectos();
  } catch (error) {
    console.error(
      "Error al guardar el defecto:",
      error.response?.data || error.message,
    );
  }
};

onMounted(() => {
  cargarDefectos();
});
</script>
