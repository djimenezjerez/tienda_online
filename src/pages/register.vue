<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <div class="font-weight-bold text-uppercase text-h5">Registro</div>
      </v-col>
      <v-col cols="12" md="6" order="2" order-md="1">
        <v-form @submit.prevent="submit">
          <v-row>
            <v-col cols="12">
              <div class="font-weight-bold">CUENTA</div>
            </v-col>
            <v-col cols="12" md="6" class="my-0 py-0">
              <v-text-field
                label="Email"
                v-model="form.email"
                prepend-inner-icon="mdi-email"
                :error-messages="errors.email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="my-0 py-0">
              <v-text-field
                type="password"
                label="Contraseña"
                v-model="form.password"
                prepend-inner-icon="mdi-lock"
                :error-messages="errors.password"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <div class="font-weight-bold">CONTACTO</div>
            </v-col>
            <v-col cols="12" md="6" class="my-0 py-0">
              <v-text-field
                label="Nombre"
                v-model="form.name"
                prepend-inner-icon="mdi-account"
                :error-messages="errors.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="my-0 py-0">
              <v-text-field
                label="Teléfono"
                v-model="form.phone"
                prepend-inner-icon="mdi-phone"
                :error-messages="errors.phone"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="my-0 py-0">
              <v-select
                label="Tipo de documento"
                v-model="form.documentTypeId"
                prepend-inner-icon="mdi-card-account-details"
                :items="documentTypes"
                item-title="code"
                item-value="id"
                :error-messages="errors.documentTypeId"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" class="my-0 py-0">
              <v-text-field
                label="Número de documento"
                v-model="form.document"
                prepend-inner-icon="mdi-card-bulleted-outline"
                :error-messages="errors.document"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="font-weight-bold">DIRECCIÓN</div>
            </v-col>
            <v-col cols="12" md="6" class="my-0 py-0">
              <v-select
                label="Ciudad"
                v-model="form.cityId"
                prepend-inner-icon="mdi-map"
                :items="cities"
                item-title="name"
                item-value="id"
                :error-messages="errors.cityId"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" class="my-0 py-0">
              <v-text-field
                label="Dirección"
                v-model="form.address"
                prepend-inner-icon="mdi-map-marker"
                :error-messages="errors.address"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-btn type="submit" variant="flat" color="surface-variant" block>
                Registrarme
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import router from "@/router";

const axios = inject("axios");
const appStore = useAppStore();
const { loading } = storeToRefs(appStore);
const app = getCurrentInstance();

const cities = ref([]);
const documentTypes = ref([]);
const form = ref({
  userName: null,
  document: null,
  address: null,
  email: null,
  phone: null,
  cityId: 0,
  documentTypeId: 0,
  password: null,
});
const errors = ref({});

async function fetchCities() {
  try {
    loading.value = true;
    let res = await axios.get("api/city", {
      params: {
        combo: true,
      },
    });
    cities.value = res.payload.data;
    if (res.payload.data.length > 0) {
      form.value.cityId = res.payload.data[0].id;
    }
  } catch (err) {
    console.log(err);
  } finally {
    fetchDocumentTypes();
  }
}

async function fetchDocumentTypes() {
  try {
    let res = await axios.get("api/document_type");
    documentTypes.value = res.payload.data;
    if (res.payload.data.length > 0) {
      form.value.documentTypeId = res.payload.data[0].id;
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

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

async function login() {
  try {
    loading.value = true;
    let res = await axios.post("api/auth", {
      username: form.value.email,
      password: form.value.password,
    });
    appStore.login(
      res.payload.user,
      res.payload.client_id,
      res.payload.access_token
    );
    await updateToken(res.payload.access_token);
    router.push({ path: "/cart" });
  } catch (err) {
    console.log(err);

    if (err.response.data.hasOwnProperty("errors")) {
      errors.value = err.response.data.errors;
    }
  } finally {
    loading.value = false;
  }
}

async function submit() {
  try {
    loading.value = true;
    await axios.post(`api/client`, {
      password: form.value.password,
      name: form.value.name,
      document: form.value.document,
      document_type_id: form.value.documentTypeId,
      address: form.value.address,
      email: form.value.email,
      phone: form.value.phone,
      city_id: form.value.cityId,
    });
    login();
  } catch (err) {
    if (err.response.data.hasOwnProperty("errors")) {
      errors.value = err.response.data.errors;
    }
    loading.value = false;
  }
}

onMounted(() => {
  fetchCities();
});
</script>
