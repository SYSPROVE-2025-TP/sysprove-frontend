<template>
  <q-page class="q-pa-xl bg-grey-1">
    <div class="column items-center q-gutter-md">
      <div class="text-h5">Documentar requerimientos tecnicos del cliente</div>

      <q-card
        class="q-pa-lg shadow-2 bg-white"
        style="width: 100%; max-width: 100%; border-radius: 20px"
      >
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle1 text-weight-bold">Mensajes</div>
          <div class="row q-gutter-sm">
            <q-input dense outlined v-model="busqueda" placeholder="Search" />
            <q-select
              dense
              outlined
              v-model="filtro"
              :options="['Últimos 30 días', 'Últimos 7 días', 'Este mes']"
            />
          </div>
        </div>

        <q-markup-table
          flat
          class="full-width"
          style="font-size: 14px; table-layout: auto"
        >
          <thead>
            <tr class="text-grey-8">
              <th class="text-left">Cliente</th>
              <th class="text-left">Proyecto</th>
              <th class="text-left">Estado</th>
              <th class="text-left">Fecha de asignación</th>
              <th class="text-left">Responsable</th>
              <th class="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in oportunidadesFiltradas" :key="row._id">
              <td>
                <strong>{{ row.cliente }}</strong>
              </td>
              <td>{{ row.proyecto }}</td>
              <td>
                <q-badge
                  :color="estadoColor(row.estado)"
                  :label="row.estado"
                  class="text-white q-pa-sm"
                  style="font-weight: 600; font-size: 13px; border-radius: 8px"
                />
              </td>
              <td>{{ formatoFecha(row.fechaAsignacion) }}</td>
              <td>{{ row.responsable }}</td>
              <td class="q-gutter-sm">
                <q-btn
                  dense
                  flat
                  icon="edit"
                  color="primary"
                  @click="abrirFormulario(row)"
                />
                <q-btn
                  dense
                  flat
                  icon="delete"
                  color="negative"
                  @click="eliminarOportunidad(row._id)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <div class="row justify-end q-mt-md">
          <q-btn
            label="DOCUMENTAR REQUERIMIENTOS"
            color="negative"
            unelevated
            rounded
            style="min-width: 250px"
            @click="abrirFormulario()"
          />
        </div>
      </q-card>
    </div>

    <q-dialog v-model="mostrarFormulario" persistent>
      <q-card style="min-width: 600px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Documentar Requerimientos</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md">
          <q-form @submit.prevent="guardarRequerimiento">
            <q-input
              filled
              v-model="form.cliente"
              label="Nombre del Cliente"
              :rules="[(val) => !!val || 'Requerido']"
            />
            <q-input
              filled
              v-model="form.proyecto"
              label="Nombre del Proyecto"
              :rules="[(val) => !!val || 'Requerido']"
            />
            <q-select
              filled
              v-model="form.estado"
              label="Estado"
              :options="['Pendiente', 'Cotización enviada', 'Aprobado']"
              :rules="[(val) => !!val || 'Seleccione estado']"
            />
            <q-select
              filled
              v-model="form.responsable"
              label="Responsable"
              :options="['Diana Campos', 'José Mérida', 'César Vásquez']"
              :rules="[(val) => !!val || 'Seleccione un responsable']"
            />
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            v-close-popup
            @click="mostrarFormulario = false"
          />
          <q-btn
            flat
            label="Guardar"
            color="negative"
            @click="guardarRequerimiento"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const oportunidades = ref([]);
const busqueda = ref("");
const filtro = ref("");
const mostrarFormulario = ref(false);
const editandoId = ref(null);

const form = ref({
  cliente: "",
  proyecto: "",
  estado: "Pendiente",
  responsable: "",
});

const cargarOportunidades = async () => {
  try {
    const res = await axios.get("http://localhost:4000/oportunidades");
    oportunidades.value = res.data;
  } catch (err) {
    console.error("Error cargando oportunidades:", err);
  }
};

onMounted(() => {
  cargarOportunidades();
});

const eliminarOportunidad = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/oportunidades/${id}`);
    cargarOportunidades();
  } catch (err) {
    console.error("Error al eliminar:", err);
  }
};

const guardarRequerimiento = async () => {
  if (
    !form.value.cliente ||
    !form.value.proyecto ||
    !form.value.estado ||
    !form.value.responsable
  )
    return;

  try {
    if (editandoId.value) {
      await axios.put(
        `http://localhost:4000/oportunidades/${editandoId.value}`,
        {
          cliente: form.value.cliente,
          proyecto: form.value.proyecto,
          estado: form.value.estado,
          responsable: form.value.responsable,
        },
      );
    } else {
      await axios.post("http://localhost:4000/oportunidades", {
        cliente: form.value.cliente,
        proyecto: form.value.proyecto,
        estado: form.value.estado,
        responsable: form.value.responsable,
        fechaAsignacion: new Date().toISOString(),
      });
    }

    mostrarFormulario.value = false;
    cargarOportunidades();
    editandoId.value = null;
    form.value = {
      cliente: "",
      proyecto: "",
      estado: "Pendiente",
      responsable: "",
    };
  } catch (err) {
    console.error("Error al guardar:", err);
  }
};

const abrirFormulario = (row = null) => {
  if (row) {
    editandoId.value = row._id;
    form.value = {
      cliente: row.cliente,
      proyecto: row.proyecto,
      estado: row.estado,
      responsable: row.responsable,
    };
  } else {
    editandoId.value = null;
    form.value = {
      cliente: "",
      proyecto: "",
      estado: "Pendiente",
      responsable: "",
    };
  }
  mostrarFormulario.value = true;
};

const estadoColor = (estado) => {
  switch (estado) {
    case "Pendiente":
      return "red";
    case "Cotización enviada":
      return "orange";
    case "Aprobado":
      return "green";
    default:
      return "grey";
  }
};

const oportunidadesFiltradas = computed(() => {
  return oportunidades.value.filter(
    (o) =>
      o.cliente.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      o.proyecto.toLowerCase().includes(busqueda.value.toLowerCase()),
  );
});

const formatoFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-PE");
};
</script>
