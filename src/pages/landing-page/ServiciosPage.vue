<template>
  <q-page class="q-pa-xl bg-grey-2">
    <div class="text-center text-red-10 text-h4 q-mb-lg">
      Servicios Especializados
    </div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 text-red-10">
              Automatización de Procesos (RPA)
            </div>
            <p class="text-subtitle2 q-mt-sm">
              Reducimos tiempos operativos mediante bots inteligentes que
              automatizan tareas repetitivas.
            </p>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 text-red-10">Consultoría Cloud</div>
            <p class="text-subtitle2 q-mt-sm">
              Migramos y optimizamos tu infraestructura en plataformas como
              Azure, AWS, Huawei Cloud.
            </p>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 text-red-10">Desarrollo Ágil</div>
            <p class="text-subtitle2 q-mt-sm">
              Aplicaciones personalizadas con metodologías ágiles, integración
              continua y microservicios.
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="text-center">
      <q-btn
        label="Contáctanos"
        to="/landing-page/contacto"
        color="red-10"
        text-color="white"
        unelevated
      />
    </div>
  </q-page>
</template>

<script setup>
defineOptions({ name: "ServiciosPage" });
</script>

<style scoped>
.text-red-10 {
  color: #e30613 !important;
}
</style>
