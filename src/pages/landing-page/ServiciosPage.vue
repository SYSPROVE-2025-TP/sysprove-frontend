<template>
  <q-page class="servicios-page q-px-md q-pt-lg q-pb-xl">
    <!-- Título principal -->
    <div
      v-motion
      :initial="titleVariants.hidden"
      :enter="titleVariants.visible"
      class="text-center text-h4 text-red-10 font-bold q-mb-xl"
    >
      Nuestros Servicios Especializados
    </div>

    <!-- Categorías -->
    <div v-for="(categoria, index) in categorias" :key="index" class="q-mb-xl">
      <div class="text-h5 text-red-10 text-bold q-mb-lg text-center">
        {{ categoria.nombre }}
      </div>

      <div class="row q-col-gutter-md justify-center">
        <div
          v-for="(item, i) in categoria.servicios"
          :key="i"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card class="servicio-item-card q-hoverable">
            <q-img
              :src="item.imagen"
              class="q-card-img"
              style="height: 200px; object-fit: cover"
            />
            <q-card-section class="text-center">
              <div class="text-subtitle1 text-bold text-uppercase text-dark">
                {{ item.titulo }}
              </div>
              <q-icon name="arrow_forward" color="primary" size="20px" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Botón de contacto -->
    <div class="text-center q-mt-xl">
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

const titleVariants = useMotionVariants({
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
});

const categorias = ref([
  {
    nombre: "SOLUCIONES DEL SECTOR",
    servicios: [
      {
        titulo: "Agribusiness",
        imagen:
          "https://sysprove-hitss-2025.s3.us-east-2.amazonaws.com/landing-page/page-servicios/agribusiness.png",
      },
      {
        titulo: "Smart Cities & Communities",
        imagen:
          "https://sysprove-hitss-2025.s3.us-east-2.amazonaws.com/landing-page/page-servicios/smartcities.png",
      },
      {
        titulo: "Banking & Financial Services",
        imagen:
          "https://sysprove-hitss-2025.s3.us-east-2.amazonaws.com/landing-page/page-servicios/bankingfinanzas.png",
      },
      {
        titulo: "Hospitality & Travel",
        imagen:
          "https://sysprove-hitss-2025.s3.us-east-2.amazonaws.com/landing-page/page-servicios/hospitality.png",
      },
      {
        titulo: "Mining & Natural Resources",
        imagen:
          "https://sysprove-hitss-2025.s3.us-east-2.amazonaws.com/landing-page/page-servicios/miningnaturalresources.png",
      },
      {
        titulo: "Manufacturing",
        imagen:
          "https://sysprove-hitss-2025.s3.us-east-2.amazonaws.com/landing-page/page-servicios/manufacturing.png",
      },
      {
        titulo: "Retail",
        imagen:
          "https://sysprove-hitss-2025.s3.us-east-2.amazonaws.com/landing-page/page-servicios/retail.png",
      },
      {
        titulo: "Healthcare & Life Sciences",
        imagen:
          "https://sysprove-hitss-2025.s3.us-east-2.amazonaws.com/landing-page/page-servicios/healthcare.png",
      },
    ],
  },
  {
    nombre: "PRÁCTICAS TECNOLÓGICAS",
    servicios: [
      {
        titulo: "CRM",
        imagen: "https://source.unsplash.com/featured/?crm",
      },
      {
        titulo: "ERP",
        imagen: "https://source.unsplash.com/featured/?erp",
      },
      {
        titulo: "Hyper-Automation",
        imagen: "https://source.unsplash.com/featured/?automation",
      },
    ],
  },
  {
    nombre: "PRODUCTOS DIGITALES",
    servicios: [
      {
        titulo: "Cross Industry Solutions",
        imagen: "https://source.unsplash.com/featured/?industry",
      },
      {
        titulo: "Industry Specialized",
        imagen: "https://source.unsplash.com/featured/?technology",
      },
    ],
  },
  {
    nombre: "CONSULTORÍA",
    servicios: [
      {
        titulo: "Design Thinking & Ideation",
        imagen: "https://source.unsplash.com/featured/?design",
      },
      {
        titulo: "Digital Transformation",
        imagen: "https://source.unsplash.com/featured/?digital",
      },
      {
        titulo: "Customer Experience (CX)",
        imagen: "https://source.unsplash.com/featured/?customer",
      },
    ],
  },
]);
</script>

<style scoped>
.servicios-page {
  background: linear-gradient(to bottom, #f5f5f5, #eeeeee);
  min-height: 100vh;
}

.servicio-item-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}
.servicio-item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
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
