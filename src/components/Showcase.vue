<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="product in products">
        <v-hover v-slot="{ isHovering, props }" open-delay="200">
          <v-card
            class="cursor-pointer"
            :elevation="isHovering ? 16 : 2"
            v-bind="props"
            @click="goToProductPage(product)"
          >
            <v-img height="230" :src="appUrl(product.image)"></v-img>
            <v-card-text>
              <div class="font-weight-bold mb-1">
                Bs. {{ product.sell_price.toFixed(2) }}
              </div>
              <div class="font-weight-medium">{{ product.product_name }}</div>
              <div class="font-weight-light">
                Marca: {{ product.brand_name }}
              </div>
              <div class="font-weight-light">
                Tipo de talla: {{ product.size_type_name }}
              </div>
              <div class="font-weight-light">
                Género: {{ product.gender_name }}
              </div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-pagination
          :length="pageLength"
          v-model="page"
          @update:modelValue="fetchProducts"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { inject, onMounted, ref, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { appUrl } from "@/plugins/helpers";
import { useRoute, useRouter } from "vue-router";
import { useShowcaseStore } from "@/stores/showcase";

const router = useRouter();
const axios = inject("axios");
const appStore = useAppStore();
const showcaseStore = useShowcaseStore();
const route = useRoute();

const products = ref([]);
const pageLength = ref(0);
const page = ref(1);

function goToProductPage(product) {
  showcaseStore.product = product;
  router.push("/product");
}

async function fetchProducts(params) {
  try {
    appStore.loading = true;
    let res = await axios.get("api/showcase/product", {
      params: {
        ...params,
        store_id: appStore.store.id,
        page: page.value,
        per_page: 12,
      },
    });
    products.value = res.payload.data;
    pageLength.value = res.payload.last_page;
  } catch (err) {
    console.log(err);
  } finally {
    appStore.loading = false;
  }
}

onMounted(() => {
  fetchProducts(route.query);
});

watch(
  () => route.query,
  () => {
    fetchProducts(route.query);
  }
);
</script>
