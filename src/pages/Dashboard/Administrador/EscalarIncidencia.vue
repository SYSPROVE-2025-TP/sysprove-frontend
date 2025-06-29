<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Tarjeta del formulario -->
    <q-card class="q-pa-sm shadow-2 bg-white rounded-borders">
      <q-card-section class="bg-primary text-white rounded-borders-top q-pa-md">
        <div class="text-h6 flex items-center">
          <q-icon name="trending_up" class="q-mr-sm" />
          Escalar Incidencia
        </div>
      </q-card-section>

      <q-separator class="q-my-sm" />

      <q-card-section>
        <q-form @submit.prevent="onSubmitEscalamiento" class="q-gutter-md">
          <q-input
            dense
            filled
            v-model="form.titulo"
            label="🎯 Título"
            :rules="[(v) => !!v || 'El título es obligatorio']"
          />
          <q-input
            dense
            filled
            autogrow
            type="textarea"
            v-model="form.descripcion"
            label="📝 Descripción"
            :rules="[(v) => !!v || 'La descripción es obligatoria']"
          />
          <q-select
            dense
            filled
            v-model="form.responsable"
            :options="usuariosOptions"
            label="👤 Responsable"
            emit-value
            map-options
            :rules="[(v) => !!v || 'Seleccione un responsable']"
          />
          <q-select
            dense
            filled
            v-model="form.proyecto"
            :options="proyectosOptions"
            label="📁 Proyecto"
            emit-value
            map-options
            :rules="[(v) => !!v || 'Seleccione un proyecto']"
          />
          <q-input
            dense
            filled
            autogrow
            type="textarea"
            v-model="form.comentarioEscalamiento"
            label="💬 Comentario de escalamiento"
            :rules="[(v) => !!v || 'El comentario es obligatorio']"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Limpiar"
              color="negative"
              flat
              size="sm"
              @click="resetForm"
              icon="clear"
            />
            <q-btn
              label="Escalar"
              color="primary"
              glossy
              push
              size="sm"
              type="submit"
              :loading="loading"
              :disable="loading"
              icon="send"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Tabla de escalamientos -->
    <q-card flat bordered class="q-mt-lg shadow-1 bg-white">
      <q-card-section class="bg-primary text-white q-pa-sm">
        <div class="text-subtitle1 text-weight-bold">
          📋 Escalamientos recientes
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="escalamientos"
          :columns="tableColumns"
          row-key="_id"
          flat
          bordered
          dense
          color="primary"
          table-class="text-grey-9"
          table-header-class="bg-blue-2 text-primary text-weight-bold"
          no-data-label="No hay escalamientos registrados"
          separator="horizontal"
          wrap-cells
          striped
          hover
        >
          <template v-slot:body-cell-proyecto="props">
            <q-td :props="props">
              {{ props.row.proyecto?.nombre || "—" }}
            </q-td>
          </template>
          <template v-slot:body-cell-responsable="props">
            <q-td :props="props">
              {{ props.row.responsable?.nombres || "—" }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth";
import api from "../../../api";

const $q = useQuasar();
const authStore = useAuthStore();

const loading = ref(false);

const form = ref({
  titulo: "",
  descripcion: "",
  responsable: "",
  proyecto: "",
  comentarioEscalamiento: "",
});

const usuariosOptions = ref([]);
const proyectosOptions = ref([]);
const escalamientos = ref([]);

const tableColumns = [
  { name: "titulo", label: "Título", field: "titulo", align: "left" },
  {
    name: "descripcion",
    label: "Descripción",
    field: "descripcion",
    align: "left",
  },
  {
    name: "responsable",
    label: "Responsable",
    field: "responsable",
    align: "left",
  },
  { name: "proyecto", label: "Proyecto", field: "proyecto", align: "left" },
  {
    name: "comentarioEscalamiento",
    label: "Comentario",
    field: "comentarioEscalamiento",
    align: "left",
  },
];

const cargarUsuarios = async () => {
  try {
    const res = await api.get("/auth/usuarios", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    usuariosOptions.value = res.data.map((u) => ({
      label: `${u.nombres} ${u.apellidos}`,
      value: u._id,
    }));
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    $q.notify({ type: "negative", message: "Error al cargar usuarios" });
  }
};

const cargarProyectos = async () => {
  try {
    const res = await api.get("/api/proyectos-desarrollo", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    proyectosOptions.value = res.data.map((p) => ({
      label: p.nombre,
      value: p._id,
    }));
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    $q.notify({ type: "negative", message: "Error al cargar proyectos" });
  }
};

const cargarEscalamientos = async () => {
  try {
    const res = await api.get("/api/escalamientos", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    escalamientos.value = res.data;
  } catch (error) {
    console.error("Error al obtener escalamientos:", error);
    $q.notify({ type: "negative", message: "Error al obtener escalamientos" });
  }
};

const onSubmitEscalamiento = async () => {
  loading.value = true;
  try {
    await api.post("/api/escalamientos", form.value, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    $q.notify({ type: "positive", message: "Escalamiento creado con éxito" });
    resetForm();
    await cargarEscalamientos();
  } catch (error) {
    console.error("Error al crear escalamiento:", error);
    $q.notify({ type: "negative", message: "Error al crear escalamiento" });
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.keys(form.value).forEach((k) => (form.value[k] = ""));
};

onMounted(() => {
  cargarUsuarios();
  cargarProyectos();
  cargarEscalamientos();
});
</script>

<style scoped>
.q-pa-lg {
  padding: 24px;
}
.q-mt-lg {
  margin-top: 32px;
}
.rounded-borders {
  border-radius: 8px;
}
.rounded-borders-top {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
