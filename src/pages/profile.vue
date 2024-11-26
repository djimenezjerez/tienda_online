<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <div class="font-weight-bold text-uppercase text-h5">Perfil</div>
      </v-col>
      <v-col cols="12" md="6" order="2" order-md="1">
        <v-row>
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
              label="Contraseña"
              v-model="form.password"
              prepend-inner-icon="mdi-lock"
              :error-messages="errors.password"
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
            <v-btn @click="submit" variant="flat" color="surface-variant" block>
              Actualizar
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn @click="closeSession" variant="flat" color="error" block>
              Cerrar sesión
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6" order="1" order-md="2">
        <div class="font-weight-bold text-center">PEDIDOS</div>
        <div v-if="ordersTotal > 0">
          <v-table>
            <thead>
              <tr>
                <th class="text-center">Fecha</th>
                <th class="text-center">Estado</th>
                <th class="text-left">Observación</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="text-center">
                  {{ new Date(order.created_at).toLocaleDateString() }}
                </td>
                <td class="text-center">{{ orderState(order.state) }}</td>
                <td>{{ order.comment || "-" }}</td>
                <td class="text-right">Bs. {{ order.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
        <div>
          <v-pagination
            v-model="ordersPage"
            :length="ordersTotal"
            @update:model-value="fetchOrders"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
// import router from "@/router";

const axios = inject("axios");
const appStore = useAppStore();
const { user, loading } = storeToRefs(appStore);

const orders = ref([]);
const ordersPage = ref(1);
const ordersTotal = ref(0);
const cities = ref([]);
const documentTypes = ref([]);
const form = ref({ ...JSON.parse(JSON.stringify(user.value)), password: null });
const errors = ref({});

function orderState(state) {
  switch (state) {
    case "open":
      return "Abierto";
    case "closed":
      return "Cancelado";
    case "paid":
      return "Pagado";
    case "waiting":
      return "En revisión";
    case "rejected":
      return "Rechazado";
    case "finished":
      return "Finalizado";
  }
}

async function fetchCities() {
  try {
    loading.value = true;
    let res = await axios.get("api/city", {
      params: {
        combo: true,
      },
    });
    cities.value = res.payload.data;
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
  } catch (err) {
    console.log(err);
  } finally {
    fetchOrders();
  }
}

async function fetchOrders() {
  try {
    loading.value = true;
    let res = await axios.get(
      `api/client/${user.value.clientId}/shopping_cart`,
      {
        params: {
          page: ordersPage.value,
          per_page: 8,
        },
      }
    );
    ordersTotal.value = res.payload.meta.last_page;
    orders.value = res.payload.data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

async function submit() {
  try {
    await axios.patch(`api/client/${form.value.clientId}`, {
      name: form.value.name,
      active: true,
      document: form.value.document,
      document_type_id: form.value.documentTypeId,
      address: form.value.address,
      email: form.value.email,
      phone: form.value.phone,
      city_id: form.value.cityId,
    });
    user.value = { ...user.value, ...form.value };
  } catch (err) {
    if (err.response.data.hasOwnProperty("errors")) {
      errors.value = err.response.data.errors;
    }
  }
}

function closeSession() {
  appStore.logout();
  window.location.href = "/";
  // router.replace("/");
}

onMounted(() => {
  fetchCities();
});
</script>
