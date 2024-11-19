<template></template>

<script setup>
import { inject, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import router from "@/router";

const axios = inject("axios");
const appStore = useAppStore();

async function fetchStore() {
  try {
    appStore.loading = true;
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
    appStore.loading = false;
  }
}

async function fetchCategories() {
  if (appStore.store.id > 0) {
    try {
      appStore.loading = true;
      let res = await axios.get("api/showcase/category", {
        params: {
          store_id: appStore.store.id,
        },
      });
      appStore.categories = res.payload.data;
    } catch (err) {
      console.log(err);
    } finally {
      router.push({ path: "/showcase" });
    }
  } else {
    router.push({ path: "/showcase" });
  }
}

onMounted(() => {
  if (appStore.store.id <= 0) {
    fetchStore();
  } else {
    fetchCategories();
  }
});
</script>
