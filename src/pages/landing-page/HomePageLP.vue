<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Hero principal -->
    <div class="q-pa-xl text-white text-center hero-banner">
      <div class="text-h3 text-weight-bold">Bienvenido a HITSS Perú</div>
      <div class="text-subtitle1 q-mt-sm">
        Impulsamos la innovación digital para empresas inteligentes
      </div>
      <q-btn
        label="Contáctanos"
        color="white"
        text-color="red-10"
        class="q-mt-lg"
        unelevated
        to="/landing-page/contacto"
      />
    </div>

    <!-- Servicios -->
    <div class="q-pa-xl">
      <div class="text-h5 text-center q-mb-lg text-red-10">
        Nuestros Servicios
      </div>
      <div class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-md-4">
          <q-card flat bordered class="bg-white text-dark">
            <q-card-section>
              <div class="text-h6 text-red-10">Transformación Digital</div>
              <div class="text-subtitle2 q-mt-sm">
                Digitalizamos procesos y optimizamos la eficiencia operativa con
                tecnología de punta.
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat bordered class="bg-white text-dark">
            <q-card-section>
              <div class="text-h6 text-red-10">Desarrollo de Software</div>
              <div class="text-subtitle2 q-mt-sm">
                Creamos soluciones a medida, plataformas web, móviles y APIs
                robustas.
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat bordered class="bg-white text-dark">
            <q-card-section>
              <div class="text-h6 text-red-10">Cloud & Infraestructura</div>
              <div class="text-subtitle2 q-mt-sm">
                Migración a la nube, servicios híbridos y administración de
                infraestructura.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Clientes -->
    <div class="q-pa-xl bg-grey-3">
      <div class="text-h5 text-center q-mb-md text-red-10">
        Confían en nosotros
      </div>
      <div class="row items-center justify-center q-gutter-md">
        <q-img
          src="https://via.placeholder.com/150x60?text=Cliente+1"
          style="max-width: 150px"
        />
        <q-img
          src="https://via.placeholder.com/150x60?text=Cliente+2"
          style="max-width: 150px"
        />
        <q-img
          src="https://via.placeholder.com/150x60?text=Cliente+3"
          style="max-width: 150px"
        />
      </div>
    </div>

    <!-- CTA final -->
    <div class="q-pa-xl text-center hero-banner text-white">
      <div class="text-h5">¿Listo para transformar tu negocio?</div>
      <div class="text-subtitle2 q-mt-sm">
        Agenda una reunión con uno de nuestros expertos.
      </div>
      <q-btn
        label="Solicita una demo"
        color="white"
        text-color="red-10"
        class="q-mt-lg"
        unelevated
        to="/landing-page/contacto"
      />
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "HomePageLP",
});
</script>

<style scoped>
.hero-banner {
  background-color: #e30613;
}
.text-red-10 {
  color: #e30613 !important;
}
</style>
