<template>
  <q-page class="contact-page q-px-md q-pt-sm q-pb-xl">
    <!-- Título -->
    <div
      v-motion
      :initial="titleVariants.hidden"
      :enter="titleVariants.visible"
      class="text-center text-h4 text-red-10 q-mt-xs q-mb-md q-mb-sm font-bold"
    >
      Contáctanos
    </div>

    <div class="row justify-center">
      <q-card class="contact-card shadow-10">
        <q-card-section class="q-pa-none">
          <div class="row no-wrap">
            <!-- Formulario -->
            <div class="col-12 col-md-6 q-pa-md q-pa-lg-md flex flex-center">
              <q-form
                @submit.prevent="enviarFormulario"
                class="full-width q-gutter-md"
                style="max-width: 420px"
                ref="formRef"
              >
                <q-input
                  v-model="nombre"
                  label="Nombre Completo"
                  outlined
                  dense
                />
                <q-input
                  v-model="correo"
                  label="Correo Electrónico"
                  type="email"
                  outlined
                  dense
                />
                <q-input
                  v-model="telefono"
                  label="Número de Contacto"
                  type="tel"
                  outlined
                  dense
                />
                <q-input
                  v-model="empresa"
                  label="Empresa a la que representa"
                  outlined
                  dense
                />

                <!-- Servicio de interés -->
                <q-select
                  v-model="servicioSeleccionado"
                  :options="Object.keys(serviciosDisponibles)"
                  label="Servicio de Interés"
                  outlined
                  dense
                  emit-value
                  map-options
                  @update:model-value="subcategoriasSeleccionadas = []"
                />

                <!-- Subcategorías del servicio -->
                <q-select
                  v-if="servicioSeleccionado"
                  v-model="subcategoriasSeleccionadas"
                  :options="serviciosDisponibles[servicioSeleccionado]"
                  label="Subcategorías del Servicio"
                  multiple
                  outlined
                  dense
                  use-chips
                />

                <q-input
                  v-model="mensaje"
                  label="Mensaje Adicional"
                  type="textarea"
                  outlined
                  dense
                  autogrow
                />

                <!-- Botón mejorado -->
                <q-btn
                  label="ENVIAR MENSAJE"
                  type="submit"
                  color="red-10"
                  unelevated
                  icon="send"
                  class="animated-button q-mt-md full-width"
                />
              </q-form>
            </div>

            <!-- Imagen -->
            <div
              class="col-6 bg-contact-image q-pa-lg lt-sm-hide flex flex-center"
            >
              <q-img
                src="https://media.licdn.com/dms/image/v2/D4E0BAQGri8qVkgCxqQ/company-logo_200_200/company-logo_200_200/0/1736349171028/hitss_peru_logo?e=1756339200&v=beta&t=EjxYwyYMjI-gMdFXjOi8Qy2_XcLrvok386x-ePcpST0"
                style="width: 150px; height: 150px"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from "vue";
import { useMotionVariants } from "@vueuse/motion";
import { Notify } from "quasar";
import api from "../../api";

// Inputs
const nombre = ref("");
const correo = ref("");
const telefono = ref("");
const empresa = ref("");
const mensaje = ref("");
const servicioSeleccionado = ref(null);
const subcategoriasSeleccionadas = ref([]);

// Servicios y subcategorías
const serviciosDisponibles = {
  "PRÁCTICAS TECNOLÓGICAS": [
    "CRM",
    "ERP",
    "AMS & Observability",
    "Cybersecurity",
    "Field Services",
    "Hyper-Automation",
  ],
  "PRODUCTOS DIGITALES": ["Cross Industry Solutions", "Industry Specialized"],
  CONSULTORÍA: [
    "Adopción de IA",
    "Design Thinking & Ideation",
    "Digital Transformation",
    "Customer Experience (CX)",
    "Business Optimization (BPO)",
  ],
  "SECTORES INDUSTRIALES": [
    "Agribusiness",
    "Smart Cities & Communities",
    "Banking & Financial Services",
    "Mining & Natural Resources",
    "Hospitality",
    "Manufacturing",
    "Retail",
  ],
};

// Animaciones
const titleVariants = useMotionVariants({
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: -30 },
});

// Función para enviar el formulario
async function enviarFormulario() {
  const payload = {
    nombres: nombre.value,
    correo: correo.value,
    telefono: telefono.value,
    empresa: empresa.value,
    servicioInteres: servicioSeleccionado.value,
    subcategoria: subcategoriasSeleccionadas.value.join(", "),
    mensaje: mensaje.value,
  };

  try {
    await api.post("api/contacto", payload);

    Notify.create({
      type: "positive",
      message: "Mensaje enviado correctamente",
    });

    // Limpiar campos
    nombre.value = "";
    correo.value = "";
    telefono.value = "";
    empresa.value = "";
    mensaje.value = "";
    servicioSeleccionado.value = null;
    subcategoriasSeleccionadas.value = [];
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "No se pudo enviar el mensaje. Intenta nuevamente.",
    });
    console.error("Error al enviar:", error);
  }
}
</script>

<style scoped>
.contact-page {
  background: linear-gradient(to bottom, #f5f5f5, #eeeeee);
  min-height: 100vh;
}

.contact-card {
  width: 100%;
  max-width: 960px;
  border-radius: 16px;
  background-color: #ffffff;
}

.bg-contact-image {
  background-image: url("https://images.unsplash.com/photo-1603570419885-dc6b54c1dd54?auto=format&fit=crop&w=800&q=80");
  background-size: cover;
  background-position: center;
}

.animated-button {
  transition: 0.3s ease-in-out;
  font-weight: bold;
  font-size: 15px;
  padding: 12px;
  border-radius: 10px;
}
.animated-button:hover {
  transform: scale(1.04);
  background-color: #c20010 !important;
}
</style>
