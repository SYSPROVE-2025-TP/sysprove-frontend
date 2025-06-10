<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="row justify-between items-center">
        <div class="text-h5">Gestión de Base de Conocimiento</div>
        <div>
          <q-btn
            label="Consultar Propuestas"
            color="primary"
            @click="
              mostrarConsulta = true;
              mostrarAgregar = false;
            "
            class="q-mr-md"
          />
          <q-btn
            label="Agregar Propuesta"
            color="secondary"
            @click="
              mostrarAgregar = true;
              mostrarConsulta = false;
            "
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="mostrarConsulta">
        <q-input
          v-model="busqueda"
          label="Buscar por palabra clave"
          filled
          class="q-mb-md"
        />
        <q-select
          v-model="filtroCategoria"
          :options="categorias"
          label="Filtrar por categoría"
          filled
          class="q-mb-md"
        />

        <q-table
          :rows="resultadosFiltrados"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay propuestas disponibles"
        >
          <template v-slot:body-cell-etiquetas="props">
            <q-td :props="props">
              <q-chip
                v-for="(etiqueta, index) in props.row.etiquetas"
                :key="index"
                color="primary"
                text-color="white"
                class="q-mr-xs"
              >
                {{ etiqueta }}
              </q-chip>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section v-if="mostrarAgregar">
        <q-input
          v-model="propuestaForm.titulo"
          label="Título de la propuesta"
          filled
          class="q-mb-md"
        />
        <q-input
          v-model="propuestaForm.descripcion"
          label="Descripción"
          filled
          type="textarea"
          class="q-mb-md"
        />
        <q-select
          v-model="propuestaForm.etiquetas"
          :options="categorias"
          label="Etiquetas"
          filled
          multiple
          class="q-mb-md"
        />
        <q-toggle
          v-model="propuestaForm.anonimo"
          label="Anonimizar propuesta"
        />

        <q-btn
          label="Guardar Propuesta"
          color="primary"
          @click="guardarPropuesta"
          class="q-mt-md"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";

const mostrarConsulta = ref(true);
const mostrarAgregar = ref(false);

const busqueda = ref("");
const filtroCategoria = ref(null);
const categorias = ["CRM", "Microservicios", "Seguridad", "Integración"];

const propuestas = ref([
  // Datos de prueba, reemplaza con datos de la API
  {
    _id: 1,
    titulo: "Integración CRM",
    descripcion: "Ejemplo de integración CRM",
    etiquetas: ["CRM", "API"],
  },
  {
    _id: 2,
    titulo: "Arquitectura Microservicios",
    descripcion: "Diagrama de arquitectura",
    etiquetas: ["Microservicios"],
  },
]);

const columnas = [
  { name: "titulo", label: "Título", align: "left", field: "titulo" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  { name: "etiquetas", label: "Etiquetas", align: "left" },
];

const propuestaForm = ref({
  titulo: "",
  descripcion: "",
  etiquetas: [],
  anonimo: false,
});

const resultadosFiltrados = computed(() => {
  let filtrados = propuestas.value;
  if (busqueda.value) {
    filtrados = filtrados.filter(
      (p) =>
        p.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()),
    );
  }
  if (filtroCategoria.value) {
    filtrados = filtrados.filter((p) =>
      p.etiquetas.includes(filtroCategoria.value),
    );
  }
  return filtrados;
});

const guardarPropuesta = () => {
  if (!propuestaForm.value.titulo || !propuestaForm.value.descripcion) {
    alert("Completa todos los campos");
    return;
  }
  const nueva = { ...propuestaForm.value, _id: Date.now() };
  propuestas.value.push(nueva);
  alert("Propuesta guardada correctamente");
  propuestaForm.value = {
    titulo: "",
    descripcion: "",
    etiquetas: [],
    anonimo: false,
  };
  mostrarConsulta.value = true;
  mostrarAgregar.value = false;
};
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
