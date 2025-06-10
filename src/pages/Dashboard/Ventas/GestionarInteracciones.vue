<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h5">Registro de Interacciones con Clientes</div>
      <q-btn label="Crear Interacción" color="primary" @click="abrirDialogo" />
    </div>

    <div class="row justify-center q-gutter-lg">
      <q-card
        v-for="interaccion in interacciones"
        :key="interaccion._id"
        class="col-12 col-sm-6 col-md-4 col-lg-3 q-mb-lg"
        bordered
        flat
        style="min-height: 200px"
      >
        <q-card-section>
          <div class="text-subtitle1">{{ interaccion.nombre }}</div>
          <div class="text-caption text-grey">
            {{ interaccion.empresa }} • {{ interaccion.email }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-badge color="primary" class="q-mr-sm">{{
            interaccion.tipo
          }}</q-badge>
          <q-badge color="secondary">
            {{ formatearFecha(interaccion.fecha) }}
          </q-badge>
          <div class="q-mt-sm">{{ interaccion.resumen }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            icon="edit"
            @click="editar(interaccion)"
          />
          <q-btn
            flat
            color="negative"
            icon="delete"
            @click="eliminar(interaccion._id)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Diálogo con formulario -->
    <q-dialog v-model="dialogoVisible" persistent>
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ form._id ? "Editar Interacción" : "Nueva Interacción" }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarInteraccion">
            <q-input
              filled
              v-model="form.nombre"
              label="Nombre"
              class="q-mb-sm"
            />
            <q-input
              filled
              v-model="form.empresa"
              label="Empresa"
              class="q-mb-sm"
            />
            <q-input
              filled
              v-model="form.email"
              label="Correo Electrónico"
              type="email"
              class="q-mb-sm"
            />
            <q-select
              filled
              v-model="form.tipo"
              :options="tipos"
              label="Tipo de Interacción"
              class="q-mb-sm"
            />
            <q-input
              filled
              v-model="form.fecha"
              label="Fecha"
              type="date"
              class="q-mb-sm"
            />
            <q-input
              filled
              v-model="form.resumen"
              label="Resumen"
              type="textarea"
              class="q-mb-sm"
            />
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn label="Guardar" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const interacciones = ref([]);
const dialogoVisible = ref(false);

const tipos = ["Llamada", "Reunión", "Correo", "Otro"];

const form = ref({
  _id: null,
  nombre: "",
  empresa: "",
  email: "",
  tipo: "",
  fecha: "",
  resumen: "",
});

const columnas = [
  /* ya no se usan en esta versión basada en cards, puedes eliminarlas si no usas q-table */
];

const abrirDialogo = () => {
  limpiarFormulario();
  dialogoVisible.value = true;
};

const cargarInteracciones = async () => {
  const res = await axios.get("http://localhost:4000/interacciones");
  interacciones.value = res.data;
};

const guardarInteraccion = async () => {
  if (form.value._id) {
    await axios.put(
      `http://localhost:4000/interacciones/${form.value._id}`,
      form.value,
    );
    $q.notify({ type: "positive", message: "Interacción actualizada" });
  } else {
    await axios.post("http://localhost:4000/interacciones", form.value);
    $q.notify({ type: "positive", message: "Interacción guardada" });
  }
  limpiarFormulario();
  dialogoVisible.value = false;
  cargarInteracciones();
};

const editar = (row) => {
  form.value = { ...row };
  form.value.fecha = form.value.fecha.substring(0, 10); // formato yyyy-MM-dd
  dialogoVisible.value = true;
};

const eliminar = async (id) => {
  await axios.delete(`http://localhost:4000/interacciones/${id}`);
  $q.notify({ type: "negative", message: "Interacción eliminada" });
  cargarInteracciones();
};

const limpiarFormulario = () => {
  form.value = {
    _id: null,
    nombre: "",
    empresa: "",
    email: "",
    tipo: "",
    fecha: "",
    resumen: "",
  };
};

const formatearFecha = (fechaStr) => {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString();
};

onMounted(() => {
  cargarInteracciones();
});
</script>

<style scoped>
.q-card {
  transition: box-shadow 0.2s ease-in-out;
}
.q-card:hover {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
}
.q-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
