// src/pages/ListaContactosPage.vue
<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Solicitudes de Contacto</div>

    <q-table
      title="Lista de Solicitudes"
      :rows="contactos"
      :columns="columnas"
      row-key="_id"
      flat
      bordered
    >
      <template v-slot:body-cell-acciones="props">
        <q-td align="center">
          <q-btn
            dense
            flat
            icon="edit"
            color="primary"
            @click="editarSolicitud(props.row)"
          />
          <q-btn
            dense
            flat
            icon="delete"
            color="red"
            @click="eliminarSolicitud(props.row._id)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo para editar -->
    <q-dialog v-model="mostrarDialogo">
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Editar Solicitud</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.nombre" label="Nombre" />
          <q-input v-model="form.correo" label="Correo" />
          <q-input v-model="form.telefono" label="Teléfono" />
          <q-input v-model="form.empresa" label="Empresa" />
          <q-input v-model="form.servicioInteres" label="Servicio de Interés" />
          <q-input v-model="form.subcategoria" label="Subcategoría" />
          <q-input v-model="form.mensaje" label="Mensaje" type="textarea" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn label="Guardar" color="primary" @click="guardarEdicion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../../api";
import { useQuasar } from "quasar";

const $q = useQuasar();

const contactos = ref([]);
const mostrarDialogo = ref(false);
const form = ref({});
const columnas = [
  { name: "nombres", label: "Nombre", field: "nombres", sortable: true },
  { name: "correo", label: "Correo", field: "correo", sortable: true },
  { name: "telefono", label: "Teléfono", field: "telefono" },
  { name: "empresa", label: "Empresa", field: "empresa" },
  {
    name: "servicioInteres",
    label: "Servicio de Interés",
    field: "servicioInteres",
  },
  { name: "subcategoria", label: "Subcategoría", field: "subcategoria" },
  { name: "mensaje", label: "Mensaje", field: "mensaje" },
  { name: "acciones", label: "Acciones", field: "acciones", sortable: false },
];

const obtenerSolicitudes = async () => {
  try {
    const { data } = await api.get("api/contacto");
    contactos.value = data;
  } catch (error) {
    $q.notify({ type: "negative", message: "Error al obtener solicitudes" });
  }
};

const eliminarSolicitud = async (id) => {
  try {
    await api.delete(`api/contacto/${id}`);
    contactos.value = contactos.value.filter((c) => c._id !== id);
    $q.notify({ type: "positive", message: "Eliminado correctamente" });
  } catch (error) {
    $q.notify({ type: "negative", message: "Error al eliminar" });
  }
};

const editarSolicitud = (solicitud) => {
  form.value = { ...solicitud };
  mostrarDialogo.value = true;
};

const guardarEdicion = async () => {
  try {
    const id = form.value._id;
    await api.put(`api/contacto/${id}`, form.value);
    $q.notify({ type: "positive", message: "Actualizado correctamente" });
    mostrarDialogo.value = false;
    obtenerSolicitudes();
  } catch (error) {
    $q.notify({ type: "negative", message: "Error al guardar cambios" });
  }
};

onMounted(() => {
  obtenerSolicitudes();
});
</script>

<style scoped></style>
