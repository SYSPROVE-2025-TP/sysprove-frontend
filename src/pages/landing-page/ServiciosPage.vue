<template>
  <q-page class="servicios-page q-px-md q-pt-lg q-pb-xl">
    <!-- Título con animación -->
    <div
      v-motion
      :initial="titleVariants.hidden"
      :enter="titleVariants.visible"
      class="text-center text-h4 text-red-10 font-bold q-mb-xl"
    >
      Nuestros Servicios Especializados
    </div>

    <!-- Tarjetas de servicios -->
    <div class="row q-col-gutter-lg q-mb-xl justify-center">
      <div
        v-for="(servicio, index) in servicios"
        :key="index"
        class="col-12 col-md-4"
      >
        <q-card class="servicio-card">
          <q-card-section class="text-center">
            <q-icon :name="servicio.icono" size="42px" color="red-10" />
            <div class="text-h6 text-red-10 q-mt-sm">{{ servicio.titulo }}</div>
            <div class="text-subtitle2 q-mt-sm text-grey-7">
              {{ servicio.descripcion }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Botón de contacto -->
    <div class="text-center">
      <q-btn
        label="Contáctanos"
        to="/landing-page/contacto"
        color="red-10"
        text-color="white"
        unelevated
        icon="mail"
        class="boton-contacto"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useMotionVariants } from "@vueuse/motion";

defineOptions({ name: "ServiciosPage" });

const servicios = ref([
  {
    titulo: "Automatización de Procesos (RPA)",
    descripcion:
      "Reducimos tiempos operativos mediante bots inteligentes que automatizan tareas repetitivas.",
    icono: "precision_manufacturing",
  },
  {
    titulo: "Consultoría Cloud",
    descripcion:
      "Migramos y optimizamos tu infraestructura en plataformas como Azure, AWS y Huawei Cloud.",
    icono: "cloud_queue",
  },
  {
    titulo: "Desarrollo Ágil",
    descripcion:
      "Aplicaciones personalizadas con metodologías ágiles, integración continua y microservicios.",
    icono: "code",
  },
]);

// Animación de entrada para el título
const titleVariants = useMotionVariants({
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
});
</script>

<style scoped>
.servicios-page {
  background: linear-gradient(to bottom, #f5f5f5, #eeeeee);
  min-height: 100vh;
}

.servicio-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}
.servicio-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.boton-contacto {
  font-weight: bold;
  padding: 12px 28px;
  border-radius: 8px;
  transition: 0.2s ease-in-out;
}
.boton-contacto:hover {
  transform: scale(1.05);
  background-color: #c20010 !important;
}
</style>
