<template>
  <Showcase />
</template>

<script setup>
import { inject, onMounted } from "vue";
import { useAppStore } from "@/stores/app";

const axios = inject("axios");
const appStore = useAppStore();

const fetchStore = async function () {
  try {
    let res = await axios.get(`api/store`, {
      params: {
        warehouse: 0,
        combo: 1,
      },
    });
    let store = res.payload.data.find(
      (o) => o.name == import.meta.env.VITE_STORE_NAME
    );
    if (store) {
      appStore.store = store;
    }
  } catch (err) {
    console.log(err);
  } finally {
    fetchCategories();
  }
};

const fetchCategories = async function () {
  if (appStore.store.id > 0) {
    try {
      let res = await axios.get("api/showcase/category", {
        params: {
          store_id: appStore.store.id,
        },
      });
      appStore.categories = res.payload.data;
    } catch (err) {
      console.log(err);
    }
  }
};

onMounted(() => {
  let res;
  if (appStore.store.id <= 0) {
    fetchStore();
  } else {
    fetchCategories();
  }
});
</script>
