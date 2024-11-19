<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <div class="font-weight-bold text-uppercase text-h5">Hola de nuevo</div>
      </v-col>
      <v-col cols="12" sm="10" md="6" lg="4" xl="3">
        <v-form @submit.prevent="submit">
          <v-text-field
            label="Email"
            v-model="form.username"
            :error-messages="errors.username"
          ></v-text-field>
          <v-text-field
            type="password"
            label="Contraseña"
            v-model="form.password"
            :error-messages="errors.password"
          ></v-text-field>
          <v-btn type="submit" variant="flat" color="surface-variant" block>
            Ingresar
          </v-btn>
        </v-form>
        <v-btn
          type="button"
          variant="text"
          color="surface-variant"
          block
          class="mt-3"
          @click="router.push({ path: '/register' })"
        >
          No tengo cuenta, quiero registrarme
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useShowcaseStore } from "@/stores/showcase";
import { storeToRefs } from "pinia";
import { ref, getCurrentInstance } from "vue";
import router from "@/router";

const axios = inject("axios");
const appStore = useAppStore();
const { loading } = storeToRefs(appStore);
const { totalItems } = storeToRefs(useShowcaseStore());
const app = getCurrentInstance();

const form = ref({
  username: null,
  password: null,
});
const errors = ref({});

function updateToken(token) {
  new Promise((resolve) => {
    app.appContext.provides.axios.defaults.headers[
      "Authorization"
    ] = `Bearer ${token}`;
    app.appContext.provides.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
    return resolve();
  });
}

async function submit() {
  try {
    loading.value = true;
    let res = await axios.post("api/auth", form.value);
    appStore.login(
      res.payload.user,
      res.payload.client_id,
      res.payload.access_token
    );
    await updateToken(res.payload.access_token);
    router.push({ path: totalItems.value > 0 ? "/checkout" : "/cart" });
  } catch (err) {
    if (err.response.data.hasOwnProperty("errors")) {
      errors.value = err.response.data.errors;
    }
  } finally {
    loading.value = false;
  }
}
</script>
