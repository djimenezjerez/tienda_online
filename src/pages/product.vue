<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col cols="12" md="7" lg="7" xl="6" class="px-2">
        <v-row justify="center" align="start" v-if="form.color_id > 0">
          <v-col cols="12" v-if="mobile">
            <v-carousel show-arrows="hover" hide-delimiters cycle>
              <v-carousel-item v-for="item in images" :key="item.id">
                <div style="width: 100%; position: relative;" v-if="item.video">
                  <video autoplay loop style="top: 0; left: 0; width: 100%; object-fit: cover;" :src="item.url" />
                </div>
                <v-img :src="item.url" :alt="item.url" v-else>
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <template v-for="item in images" :key="item.id" v-else>
            <v-col cols="6">
              <div style="width: 100%; position: relative;" v-if="item.video">
                <video autoplay loop style="top: 0; left: 0; width: 100%; object-fit: cover;" :src="item.url" />
              </div>
              <v-img :src="item.url" v-else></v-img>
            </v-col>
          </template>
        </v-row>
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="3" class="px-2">
        <div class="font-weight-light text-subtitle-1">
          {{ product.brand_name }}
        </div>
        <div class="font-weight-bold text-h5">{{ product.product_name }}</div>
        <div class="font-weight-medium mb-1 text-h6">
          {{ product.sell_price.toFixed(2) }} Bs.
        </div>
        <div class="font-weight-bold mt-5">Colores</div>
        <v-item-group mandatory v-model="form.color_id">
          <v-row align="center">
            <v-col cols="3" v-for="color in colors" :key="color.id" class="text-center">
              <v-item v-slot="{ isSelected, toggle }" :value="color.id">
                <v-img v-if="color.image" class="cursor-pointer" :style="isSelected ? 'border: 1px solid blue' : ''"
                  :src="color.image" @click="changeColor(color)"></v-img>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
        <div class="font-weight-bold mt-5">Tallas</div>
        <div class="d-flex flex-wrap">
          <v-item-group mandatory v-model="form.size_id">
            <v-item v-slot="{ isSelected, toggle }" v-for="size in sizes" :key="size.id" :value="size.id">
              <v-avatar class="ma-1 cursor-pointer" :color="isSelected ? 'surface-variant' : 'grey-lighten-2'"
                rounded="0" @click="toggle && changeSize(size.id)">
                {{ size.name }}
              </v-avatar>
            </v-item>
          </v-item-group>
        </div>
        <div class="font-weight-bold mt-5">Cantidad</div>
        <div class="d-flex flex-wrap">
          <v-number-input v-model="form.quantity" :reverse="false" controlVariant="default" :hideInput="false"
            variant="outlined" :step="1" :min="0" :max="stock == null ? 0 : stock"
            :hint="`Stock diponible: ${stock == null ? 0 : stock} unidad(es)`" persistent-hint></v-number-input>
        </div>
        <v-btn append-icon="mdi-arrow-right" variant="flat" color="surface-variant" class="mt-3" block
          :disabled="form.quantity < 1" @click="addToCart">
          Añadir al carrito
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="notification.visible" close-on-content-click :timeout="3000"
    :color="notification.error ? 'error' : 'success'" class="cursor-pointer">
    <v-alert density="compact" :text="notification.message" :type="notification.error ? 'error' : 'success'"></v-alert>
  </v-snackbar>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useShowcaseStore } from "@/stores/showcase";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay()
const axios = inject("axios");
const appStore = useAppStore();

const showcaseStore = useShowcaseStore();
const { product, cart } = storeToRefs(showcaseStore);
const stock = ref(0);
const colors = ref([]);
const sizes = ref([]);
const notification = ref({
  error: true,
  visible: false,
  message: "",
});
const form = ref({
  product_id: null,
  size_id: null,
  color_id: null,
  quantity: 0,
});

let cartIndex = -1;

function addToCart() {
  try {
    if (cartIndex < 0) {
      cart.value.push(
        JSON.parse(
          JSON.stringify({
            stock: stock.value,
            color: colors.value.find((o) => o.id == form.value.color_id),
            size: sizes.value.find((o) => o.id == form.value.size_id),
            product: product.value,
            order: Object.assign(form.value),
          })
        )
      );
      notification.value.error = false;
      notification.value.visible = true;
      notification.value.message = "Pedido agregado al carrito";
    } else {
      cart.value[cartIndex].order.quantity = JSON.parse(
        JSON.stringify(form.value.quantity)
      );
      notification.value.error = false;
      notification.value.visible = true;
      notification.value.message = "Pedido actualizado";
    }
  } finally {
    appStore.loading = false;
  }
}

function changeColor(color) {
  const updateForm = new Promise((resolve) => {
    form.value.color_id = color.id;
    resolve();
  });
  updateForm.then(() => {
    fetchStock();
  });
}

function changeSize(sizeId) {
  const updateForm = new Promise((resolve) => {
    form.value.size_id = sizeId;
    resolve();
  });
  updateForm.then(() => {
    fetchStock();
  });
}

function searchOrder() {
  try {
    if (cartIndex < 0) {
      if (form.value.quantity > stock.value) {
        form.value.quantity = stock.value;
      } else if (form.value.quantity == 0 && stock.value > 0) {
        form.value.quantity = 1;
      } else if (stock.value == 0) {
        form.value.quantity = 0;
      }
    } else {
      if (cart.value[cartIndex].order.quantity > stock.value) {
        form.value.quantity = stock.value;
      } else {
        form.value.quantity = cart.value[cartIndex].order.quantity;
      }
    }
  } finally {
    appStore.loading = false;
  }
}

async function fetchStock() {
  if (form.value.color_id != null && form.value.size_id != null) {
    try {
      appStore.loading = true;
      let res = await axios.get(
        `api/showcase/product/${product.value.product_name_id}/stock`,
        {
          params: {
            store_id: appStore.store.id,
            brand_id: product.value.brand_id,
            gender_id: product.value.gender_id,
            size_id: form.value.size_id,
            color_id: form.value.color_id,
          },
        }
      );
      form.value.product_id = res.payload.product_id;
      stock.value = res.payload.stock;
      cartIndex = cart.value.findIndex(
        (o) => o.order.product_id == res.payload.product_id
      );
    } catch (err) {
      console.log(err);
      form.value.quantity = 0;
    } finally {
      searchOrder();
    }
  }
}

async function fetchColors() {
  try {
    appStore.loading = true;
    cartIndex = -1;
    let res = await axios.get(
      `api/showcase/product/${product.value.product_name_id}/color`,
      {
        params: {
          store_id: appStore.store.id,
          size_type_id: product.value.size_type_id,
          brand_id: product.value.brand_id,
          gender_id: product.value.gender_id,
        },
      }
    );
    colors.value = res.payload.data;
    if (!form.value.color_id && res.payload.data.length > 0) {
      form.value.color_id = res.payload.data[0].id;
    }
  } catch (err) {
    console.log(err);
  } finally {
    fetchSizes();
  }
}

async function fetchSizes() {
  try {
    appStore.loading = true;
    let res = await axios.get(
      `api/showcase/product/${product.value.product_name_id}/size`,
      {
        params: {
          store_id: appStore.store.id,
          size_type_id: product.value.size_type_id,
          brand_id: product.value.brand_id,
          color_id: form.value.color_id,
          gender_id: product.value.gender_id,
        },
      }
    );
    sizes.value = res.payload.data;
    if (!form.value.size_id && res.payload.data.length > 0) {
      form.value.size_id = res.payload.data[0].id;
    }
  } catch (err) {
    console.log(err);
  } finally {
    fetchStock();
  }
}

const images = computed(() => {
  if (form.value.color_id > 0) {
    let color = colors.value.find(o => o.id == form.value.color_id)
    if (color) {
      return color.images
    } else {
      return []
    }
  } else {
    return []
  }
})

onMounted(() => {
  fetchColors();
});
</script>

<style>
.v-snackbar__content {
  padding: 0px !important;
}
</style>
