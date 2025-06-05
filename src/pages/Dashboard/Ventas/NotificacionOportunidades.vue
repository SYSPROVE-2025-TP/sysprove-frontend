<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Bandeja de notificaciones</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="oportunidades"
          :columns="columnas"
          row-key="id"
          no-data-label="No hay oportunidades asignadas por el momento"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="info"
                @click="verDetalles(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- MODAL -->
    <q-dialog v-model="modalVisible" persistent>
      <q-card class="q-pa-md" style="min-width: 600px; max-width: 700px">
        <!-- Título y cerrar -->
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-primary">📝 Detalle de Oportunidad</div>
          <q-btn dense flat icon="close" v-close-popup />
        </div>

        <!-- Contenido -->
        <div class="q-gutter-md">
          <q-input
            readonly
            filled
            label="Cliente"
            :model-value="oportunidadSeleccionada.cliente"
          />
          <q-input
            readonly
            filled
            label="Asunto"
            :model-value="oportunidadSeleccionada.asunto"
          />
          <q-input
            readonly
            filled
            label="Fecha"
            :model-value="oportunidadSeleccionada.fecha"
          />
          <q-input
            readonly
            filled
            label="Estado"
            :model-value="oportunidadSeleccionada.estado"
          />
          <q-input
            readonly
            filled
            type="textarea"
            label="Descripción"
            :model-value="oportunidadSeleccionada.descripcion"
          />
          <q-input
            readonly
            filled
            label="Archivo adjunto"
            :model-value="oportunidadSeleccionada.archivo"
          />
        </div>

        <!-- Botones -->
        <q-card-actions align="right">
          <q-btn
            label="RECHAZAR"
            color="negative"
            @click="rechazarOportunidad"
          />
          <q-btn label="ACEPTAR" color="positive" @click="aceptarOportunidad" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

// Datos simulados para la tabla
const oportunidades = ref([
  {
    id: 1,
    cliente: "Empresa Alpha",
    asunto: "Nueva propuesta de sistema web",
    fecha: "2024-06-01",
    descripcion: "Desarrollar una plataforma web para e-commerce.",
    archivo: "propuesta_alpha.pdf",
    estado: "Pendiente",
  },
  {
    id: 2,
    cliente: "Grupo Beta",
    asunto: "Solicitud de cotización",
    fecha: "2024-06-02",
    descripcion: "Cotización de servicio de mantenimiento TI.",
    archivo: "cotizacion_beta.docx",
    estado: "Pendiente",
  },
  {
    id: 3,
    cliente: "Inversiones Gamma",
    asunto: "Migración de servidores",
    fecha: "2024-06-03",
    descripcion: "Migrar infraestructura de servidores a la nube.",
    archivo: "plan_migracion_gamma.xlsx",
    estado: "Pendiente",
  },
]);

// Columnas de la tabla
const columnas = [
  { name: "cliente", label: "Cliente", field: "cliente", align: "left" },
  { name: "asunto", label: "Asunto", field: "asunto", align: "left" },
  { name: "fecha", label: "Fecha", field: "fecha", align: "left" },
  { name: "estado", label: "Estado", field: "estado", align: "left" },
  { name: "acciones", label: "Acciones", field: "acciones", align: "center" },
];

// Modal
const modalVisible = ref(false);
const oportunidadSeleccionada = ref({
  cliente: "",
  asunto: "",
  fecha: "",
  estado: "",
  descripcion: "",
  archivo: "",
});

// Mostrar detalles al hacer click
function verDetalles(row) {
  oportunidadSeleccionada.value = { ...row };
  modalVisible.value = true;
}
function aceptarOportunidad() {
  if (oportunidadSeleccionada.value) {
    oportunidadSeleccionada.value.estado = "Aceptada";
    mostrarModal.value = false;
  }
}

function rechazarOportunidad() {
  if (oportunidadSeleccionada.value) {
    oportunidadSeleccionada.value.estado = "Rechazada";
    mostrarModal.value = false;
  }
}
</script>
