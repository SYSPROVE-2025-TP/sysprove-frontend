<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md">
      <div class="row items-center justify-between">
        <div class="text-h5">Interacciones Cliente</div>
        <q-btn
          label="Añadir Interacción +"
          color="primary"
          @click="abrirDialogo"
        />
      </div>

      <q-table
        :rows="interacciones"
        :columns="columnas"
        row-key="id"
        flat
        bordered
        no-data-label="No hay interacciones registradas"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td align="center">
            <q-btn
              icon="edit"
              dense
              flat
              round
              color="primary"
              @click="editarInteraccion(props.row)"
            />
            <q-btn
              icon="delete"
              dense
              flat
              round
              color="negative"
              @click="eliminarInteraccion(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="dialogoActivo">
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">
              {{ modoEdicion ? "Editar Interacción" : "Nueva Interacción" }}
            </div>
          </q-card-section>

          <q-card-section class="q-gutter-sm">
            <q-input
              v-model="form.nombre"
              label="Nombre y Apellido"
              outlined
              dense
            />
            <q-input v-model="form.empresa" label="Empresa" outlined dense />
            <q-input v-model="form.email" label="Email" outlined dense />
            <q-select
              v-model="form.tipo"
              :options="['Llamada', 'Reunión', 'Email']"
              label="Tipo de Interacción"
              outlined
              dense
            />
            <q-input
              v-model="form.fecha"
              label="Fecha"
              type="date"
              outlined
              dense
            />
            <q-input
              v-model="form.resumen"
              label="Resumen"
              type="textarea"
              outlined
              dense
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn
              color="primary"
              label="Guardar"
              @click="guardarInteraccion"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const dialogoActivo = ref(false);
const modoEdicion = ref(false);
const interacciones = ref([]);

const form = ref({
  id: null,
  nombre: "",
  empresa: "",
  email: "",
  tipo: "",
  fecha: "",
  resumen: "",
});

const columnas = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
  { name: "empresa", label: "Empresa", field: "empresa", align: "left" },
  { name: "email", label: "Email", field: "email", align: "left" },
  { name: "tipo", label: "Tipo", field: "tipo", align: "left" },
  {
    name: "fecha",
    label: "Fecha",
    field: "fecha",
    align: "left",
    sortable: true,
  },
  { name: "resumen", label: "Resumen", field: "resumen", align: "left" },
  { name: "acciones", label: "Acciones", align: "center" },
];

const abrirDialogo = () => {
  modoEdicion.value = false;
  form.value = {
    id: null,
    nombre: "",
    empresa: "",
    email: "",
    tipo: "",
    fecha: "",
    resumen: "",
  };
  dialogoActivo.value = true;
};

const editarInteraccion = (interaccion) => {
  modoEdicion.value = true;
  form.value = { ...interaccion };
  dialogoActivo.value = true;
};

const guardarInteraccion = () => {
  if (modoEdicion.value) {
    const index = interacciones.value.findIndex((i) => i.id === form.value.id);
    if (index !== -1) interacciones.value[index] = { ...form.value };
  } else {
    form.value.id = Date.now();
    interacciones.value.push({ ...form.value });
  }
  dialogoActivo.value = false;
};

const eliminarInteraccion = (id) => {
  interacciones.value = interacciones.value.filter((i) => i.id !== id);
};
</script>
