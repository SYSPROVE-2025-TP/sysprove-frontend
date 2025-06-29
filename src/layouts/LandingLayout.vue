<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header del landing -->
    <q-header elevated class="bg-red-10 text-white" height-hint="80">
      <q-toolbar
        class="q-gutter-sm items-center justify-between"
        style="min-height: 80px"
      >
        <!-- Logo + Título -->
        <div class="row items-center no-wrap">
          <q-img
            src="https://media.licdn.com/dms/image/v2/D4E0BAQGri8qVkgCxqQ/company-logo_200_200/company-logo_200_200/0/1736349171028/hitss_peru_logo?e=1756339200&v=beta&t=EjxYwyYMjI-gMdFXjOi8Qy2_XcLrvok386x-ePcpST0"
            style="width: 45px; height: 45px; border-radius: 50%"
            class="q-mr-sm"
          />
          <q-toolbar-title class="text-weight-bold text-body1 text-wrap">
            HITSS Perú
          </q-toolbar-title>
        </div>

        <!-- Navegación para escritorio -->
        <div class="q-gutter-sm gt-sm">
          <q-btn flat label="Inicio" to="/landing-page/home" />
          <q-btn flat label="Servicios" to="/landing-page/servicios" />
          <q-btn flat label="Contacto" to="/landing-page/contacto" />
        </div>

        <!-- Menú hamburguesa en móviles -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md"
          @click="drawer = !drawer"
        />
      </q-toolbar>
    </q-header>

    <!-- Drawer lateral para móviles -->
    <q-drawer
      v-model="drawer"
      side="right"
      overlay
      behavior="mobile"
      class="bg-red-10 text-white"
    >
      <q-list>
        <q-item clickable v-ripple to="/landing-page/home" v-close-popup>
          <q-item-section>Inicio</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/landing-page/servicios" v-close-popup>
          <q-item-section>Servicios</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/landing-page/contacto" v-close-popup>
          <q-item-section>Contacto</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Contenedor para subrutas -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-grey-10 text-white text-center q-pa-md">
      <div class="text-caption">
        © 2025 HITSS Perú · Todos los derechos reservados
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
const drawer = ref(false);

defineOptions({
  name: "LandingLayout",
});
</script>

<style scoped>
.bg-red-10 {
  background-color: #e30613 !important;
}
</style>
