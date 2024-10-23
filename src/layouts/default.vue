<template>
  <v-app>
    <AppHeader />

    <v-main>
      <router-view />
      <v-overlay v-model="loading" persistent content-class="loading-overlay">
        <v-row align="center" justify="center" class="loading-overlay">
          <v-col cols="2" class="text-center" align-self="center">
            <v-progress-circular
              indeterminate
              color="white"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-overlay>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const { loading } = storeToRefs(useAppStore());
</script>

<style>
.loading-overlay {
  width: 100%;
  height: 100%;
}
</style>
