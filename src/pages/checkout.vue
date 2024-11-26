<template>
  <v-container>
    <v-row v-if="purchaseComplete" justify="center">
      <v-col cols="12" class="text-center">
        <div class="font-weight-bold text-uppercase text-h5">
          Tu pedido fue registrado
        </div>
        <div>
          <span class="font-weight-light"
            >Comprueba tu correo para verificar la confirmación y datos de envío
            de tu pedido</span
          >
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2">
        <v-btn
          append-icon="mdi-arrow-right"
          variant="flat"
          color="surface-variant"
          block
          @click="goToStartPage"
        >
          Volver al inicio
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else justify="center">
      <v-col cols="12" class="text-center">
        <div class="font-weight-bold text-uppercase text-h5">
          Completar pedido
        </div>
        <div>
          <span class="font-weight-light">({{ totalItems }} productos)</span>
          <span class="ml-3 font-weight-medium">Bs. {{ totalCart }}</span>
        </div>
      </v-col>
      <v-col cols="12" md="6">
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
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <v-img
              class="mx-auto"
              max-width="300"
              align-self="center"
              :src="appUrl(store.qr)"
            ></v-img>
          </v-col>
          <v-col cols="12">
            <div class="text-center">
              <span> Para completar tu pedido debes realizar el pago de </span>
              <span class="font-weight-bold"> Bs. {{ totalCart }} </span>
              <span> mediante el QR y proceder a cargar tu comprobante </span>
            </div>
          </v-col>
          <v-col cols="12" class="mb-0 py-0">
            <v-file-input
              label="Comprobante de pago"
              accept="image/bmp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html,image/jpeg,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet,image/png,application/pdf,application/vnd.rar,image/svg+xml,application/x-tar,image/tiff,application/xhtml+xml,application/zip,application/x-7z-compressed"
              prepend-icon=""
              prepend-inner-icon="mdi-attachment"
              v-model="attachment"
              :error-messages="
                attachmentErrors.content.concat(attachmentErrors.type)
              "
            ></v-file-input>
          </v-col>
          <v-col cols="12" class="my-0 py-0">
            <v-btn
              @click="submit"
              append-icon="mdi-arrow-right"
              variant="flat"
              color="surface-variant"
              block
            >
              Finalizar pedido
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { appUrl } from "@/plugins/helpers";
import { useShowcaseStore } from "@/stores/showcase";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
// import router from "@/router";

const axios = inject("axios");
const showcaseStore = useShowcaseStore();
const { cart, purchaseOrder, totalItems, totalCart } =
  storeToRefs(showcaseStore);
const { user, store, loading } = storeToRefs(useAppStore());

const form = ref(JSON.parse(JSON.stringify(user.value)));
const attachmentErrors = ref({
  content: [],
  type: [],
});
const errors = ref({});
const attachment = ref(null);
const cities = ref([]);
const documentTypes = ref([]);
const purchaseComplete = ref(false);

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
    loading.value = false;
  }
}

async function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function submitClient() {
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
    submitCart();
  } catch (err) {
    if (err.response.data.hasOwnProperty("errors")) {
      errors.value = err.response.data.errors;
    }
  }
}

async function submitCart() {
  try {
    let products = [];
    cart.value.map((o) =>
      products.push({
        id: o.order.product_id,
        quantity: o.order.quantity,
      })
    );
    if (products.length > 0) {
      if (purchaseOrder.value.id == 0) {
        let res = await axios.post(
          `api/client/${form.value.clientId}/shopping_cart`,
          {
            products: products,
          }
        );
        purchaseOrder.value = {
          id: res.payload.shopping_cart.id,
          total: res.payload.shopping_cart.total,
          state: res.payload.shopping_cart.state,
          comment: res.payload.shopping_cart.comment,
        };
      }
      submitPayment();
    }
  } catch (err) {
    console.log(err);
  }
}

async function submitPayment() {
  try {
    let file = await getBase64(attachment.value);
    await axios.post(
      `api/client/${form.value.clientId}/shopping_cart/${purchaseOrder.value.id}`,
      {
        content: file,
        type: attachment.value.type,
      }
    );
    purchaseComplete.value = true;
    showcaseStore.clearCart();
  } catch (err) {
    if (err.response.data.hasOwnProperty("errors")) {
      attachmentErrors.value = err.response.data.errors;
    }
  }
}

async function submit() {
  if (!attachment.value) {
    attachmentErrors.value = {
      content: ["El comprobante de pago es requerido"],
    };
    return;
  }
  await submitClient();
}

function goToStartPage() {
  window.location.href = "/";
  // router.replace({ path: '/' })
}

onMounted(() => {
  fetchCities();
});
</script>
