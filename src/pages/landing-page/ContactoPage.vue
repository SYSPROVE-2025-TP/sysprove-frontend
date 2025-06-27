<template>
  <q-page class="contact-page q-pa-md q-pa-lg-xl">
    <!-- Título con animación -->
    <div
      v-motion
      :initial="titleVariants.hidden"
      :enter="titleVariants.visible"
      class="text-center text-h4 text-red-10 q-mb-xl font-bold"
    >
      Contáctanos
    </div>

    <div class="row justify-center">
      <q-card class="contact-card shadow-10">
        <q-card-section class="q-pa-none">
          <div class="row no-wrap">
            <!-- Formulario -->
            <div
              v-motion
              :initial="formVariants.hidden"
              :enter="formVariants.visible"
              class="col-12 col-md-6 q-pa-lg flex flex-center"
            >
              <q-form
                @submit.prevent="enviarFormulario"
                class="full-width q-gutter-md"
                style="max-width: 400px"
              >
                <q-input
                  v-model="nombre"
                  label="Nombre"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'El nombre es obligatorio']"
                  class="animated-input"
                />
                <q-input
                  v-model="correo"
                  label="Correo Electrónico"
                  type="email"
                  outlined
                  dense
                  :rules="[(val) => /.+@.+\..+/.test(val) || 'Correo inválido']"
                  class="animated-input"
                />
                <q-input
                  v-model="mensaje"
                  label="Mensaje"
                  type="textarea"
                  outlined
                  dense
                  autogrow
                  :rules="[(val) => !!val || 'Escribe un mensaje']"
                  class="animated-input"
                />
                <q-btn
                  label="ENVIAR"
                  type="submit"
                  color="red-10"
                  unelevated
                  class="animated-button enhanced-send-button"
                  icon-right="send"
                  :loading="loading"
                  :disable="loading"
                />
              </q-form>
            </div>

            <!-- Imagen decorativa -->
            <div
              class="col-6 bg-contact-image q-pa-lg lt-sm-hide flex flex-center"
            >
              <q-img
                v-motion
                :initial="{ scale: 0.5, opacity: 0 }"
                :enter="{
                  scale: 1,
                  opacity: 1,
                  transition: { type: 'spring', stiffness: 200 },
                }"
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
import { useQuasar } from "quasar";
import { useMotionVariants } from "@vueuse/motion";

const $q = useQuasar();

const nombre = ref("");
const correo = ref("");
const mensaje = ref("");
const loading = ref(false);

function enviarFormulario() {
  if (!nombre.value || !correo.value || !mensaje.value) return;

  // Evitar múltiples envíos
  if (loading.value) return;

  loading.value = true;

  // Simulación de envío (reemplaza con API real luego)
  setTimeout(() => {
    loading.value = false;

    $q.notify({
      type: "positive",
      message:
        "Tu mensaje ha sido enviado con éxito. ¡Gracias por contactarnos!",
      color: "green-4",
      textColor: "white",
      position: "top-right",
      icon: "check_circle",
      timeout: 2500,
    });

    nombre.value = "";
    correo.value = "";
    mensaje.value = "";
  }, 1500);
}

// Variantes de animación
const titleVariants = useMotionVariants({
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: -30 },
});

const formVariants = useMotionVariants({
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -50 },
});
</script>

<style scoped>
.text-red-10 {
  color: #e30613 !important;
}

.contact-page {
  background: linear-gradient(to bottom, #f5f5f5, #eeeeee);
  min-height: 100vh;
}

.contact-card {
  width: 100%;
  max-width: 960px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #ffffff;
}

.bg-contact-image {
  background-image: url("https://images.unsplash.com/photo-1603570419885-dc6b54c1dd54?auto=format&fit=crop&w=800&q=80");
  background-size: cover;
  background-position: center;
}

.animated-input:focus-within {
  transition: 0.3s;
  border-color: #e30613 !important;
  box-shadow: 0 0 5px #e30613;
}

.animated-button {
  transition: transform 0.2s ease-in-out;
}
.animated-button:hover {
  transform: scale(1.05);
}
.enhanced-send-button {
  background: linear-gradient(to right, #e30613, #ff4d4f);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 20px;
  box-shadow: 0 4px 10px rgba(227, 6, 19, 0.3);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.enhanced-send-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 14px rgba(227, 6, 19, 0.4);
}

.enhanced-send-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(227, 6, 19, 0.3);
}
</style>
