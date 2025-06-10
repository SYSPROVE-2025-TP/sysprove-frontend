<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-image">
        <q-card class="q-pa-xl bg-white login-card">
          <div class="row items-center justify-between q-col-gutter-md">
            <!-- Formulario -->
            <div class="col-12 col-md-7">
              <div class="text-h5 text-bold q-mb-sm">Bienvenido a SYSPROVE</div>
              <div class="text-subtitle2 text-grey-7 q-mb-lg">
                Inicie sesión con su cuenta sysprove para continuar
              </div>

              <q-form @submit.prevent="iniciarSesion" class="q-gutter-md">
                <q-input
                  v-model="correo"
                  label="Correo"
                  outlined
                  :rules="[
                    (val) => (val && val.length > 0) || 'Ingrese su correo',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <q-input
                  :type="verPassword ? 'text' : 'password'"
                  outlined
                  v-model="contrasena"
                  label="Contraseña"
                  lazy-rules="[(val) => !!val || 'Ingrese su contraseña']"
                >
                  <template v-slot:prepend>
                    <q-icon name="password" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="verPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="verPassword = !verPassword"
                    />
                  </template>
                </q-input>

                <div class="text-right">
                  <q-btn
                    label="¿Olvidaste la contraseña?"
                    flat
                    dense
                    color="orange-9"
                    to="/restablecer-contraseña"
                    class="q-mb-sm"
                  />
                </div>

                <q-btn
                  label="INICIAR SESION"
                  type="submit"
                  color="green-7"
                  class="full-width q-mb-lg"
                />

                <div class="q-mt-md text-center text-caption text-grey-8">
                  O también puedes ingresar con
                </div>

                <div class="row justify-around q-gutter-sm q-mt-sm q-mb-md">
                  <q-btn
                    round
                    flat
                    icon="fab fa-google"
                    color="red"
                    class="social-btn"
                    @click="loginSocial('google')"
                  />
                  <q-btn
                    round
                    flat
                    icon="fab fa-apple"
                    color="black"
                    class="social-btn"
                    @click="loginSocial('apple')"
                  />
                  <q-btn
                    round
                    flat
                    icon="fab fa-facebook-f"
                    color="blue-8"
                    class="social-btn"
                    @click="loginSocial('facebook')"
                  />
                  <q-btn
                    round
                    flat
                    icon="fab fa-x-twitter"
                    color="black"
                    class="social-btn"
                    @click="loginSocial('twitter')"
                  />
                </div>
              </q-form>
            </div>

            <!-- Imagen -->
            <div class="col-12 col-md-5 flex flex-center">
              <q-img
                src="https://media.licdn.com/dms/image/v2/D4E0BAQGri8qVkgCxqQ/company-logo_200_200/company-logo_200_200/0/1736349171028/hitss_peru_logo?e=1755129600&v=beta&t=R5pT9FjI8icKNF7vsLS4cSlO93J6eK7B1X1-yHB1s4M"
                contain
                style="max-width: 200px"
              />
            </div>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../api";

const router = useRouter();
const authStore = useAuthStore();
const correo = ref(null);
const contrasena = ref(null);
const verPassword = ref(false);

const loginSocial = (provider) => {
  console.log(`Intentando login con ${provider}...`);
  // Aquí puedes integrar OAuth real después
  alert(`Login con ${provider} no está implementado aún 🚧`);
};
const iniciarSesion = async () => {
  try {
    const response = await api.post("/auth/login", {
      correo: correo.value,
      contrasena: contrasena.value,
    });

    authStore.setToken(response.data.token);

    const usuarioResponse = await api.get("/auth/me", {
      headers: {
        Authorization: response.data.token,
      },
    });

    authStore.setUsuario(usuarioResponse.data);
    router.push("/index");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    let mensajeError =
      "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
    if (error.response && error.response.data && error.response.data.mensaje) {
      mensajeError = error.response.data.mensaje;
    }
    alert(mensajeError);
  }
};
</script>

<style scoped>
.bg-image {
  background-image: url("../assets/fondolaptop.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.login-card {
  width: 90%;
  max-width: 900px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

@media (max-width: 600px) {
  .login-card {
    flex-direction: column;
    padding: 2rem 1.5rem;
  }
}
.social-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: scale(1.1);
  transition: all 0.2s ease;
}
</style>
