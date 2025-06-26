<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <q-card class="card-bg text-white no-shadow" bordered>
          <q-card-section class="text-h6">
            <div class="text-h6">Editar Perfil</div>
            <div class="text-subtitle2">Completa tu información personal</div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section side>
                  <q-avatar size="100px">
                    <img
                      :src="
                        user_details.fotoPerfil ||
                        'https://cdn.quasar.dev/img/boy-avatar.png'
                      "
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-file
                    dense
                    filled
                    label="Subir nueva foto"
                    @update:model-value="handleImageUpload"
                    accept="image/*"
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

              <q-item class="col-6">
                <q-item-section>
                  <q-input
                    dark
                    color="white"
                    dense
                    v-model="user_details.nombreUsuario"
                    label="Usuario"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <q-input
                    dark
                    color="white"
                    dense
                    v-model="user_details.email"
                    label="Correo Electrónico"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <q-input
                    dark
                    color="white"
                    dense
                    v-model="user_details.nombres"
                    label="Nombres"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <q-input
                    dark
                    color="white"
                    dense
                    v-model="user_details.apellidos"
                    label="Apellidos"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <q-input
                    dark
                    color="white"
                    dense
                    v-model="user_details.direccion"
                    label="Dirección"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              class="text-capitalize bg-info text-white"
              @click="guardarPerfil"
            >
              Guardar Cambios
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
        <q-card class="card-bg text-white no-shadow" bordered>
          <q-card-section class="text-center bg-transparent">
            <q-avatar size="100px" class="shadow-10">
              <img :src="user_details.fotoPerfil || 'profile.svg'" />
            </q-avatar>
            <div class="text-subtitle2 q-mt-lg">Usuario</div>
            <div class="text-h6 q-mt-md">
              {{ user_details.nombres }} {{ user_details.apellidos }}
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-body2 text-justify">
              Bienvenido a tu panel de perfil. Aquí puedes visualizar y editar
              tus datos personales de usuario.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const user_details = ref({});
const idUsuario = ref(null);
const fotoFile = ref(null);

const cargarPerfil = async () => {
  try {
    const response = await axios.get("/api/usuarios/yo");
    user_details.value = response.data;
    idUsuario.value = response.data._id;
  } catch (error) {
    console.error("Error al cargar perfil:", error);
    $q.notify({ type: "negative", message: "Error al cargar el perfil" });
  }
};

const guardarPerfil = async () => {
  try {
    if (fotoFile.value) {
      const reader = new FileReader();
      reader.onload = async () => {
        user_details.value.fotoPerfil = reader.result;
        await actualizarUsuario();
      };
      reader.readAsDataURL(fotoFile.value);
    } else {
      await actualizarUsuario();
    }
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    $q.notify({ type: "negative", message: "No se pudo actualizar el perfil" });
  }
};

const actualizarUsuario = async () => {
  await axios.put(`/api/usuarios/${idUsuario.value}`, user_details.value);
  $q.notify({ type: "positive", message: "Perfil actualizado correctamente" });
};

const handleImageUpload = (fileList) => {
  fotoFile.value = fileList;
};

onMounted(() => {
  cargarPerfil();
});
</script>

<style scoped>
.card-bg {
  background-color: #61686d;
}
</style>
