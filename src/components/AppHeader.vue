<template>
  <v-app-bar flat density="compact" class="border-b-thin">
    <v-container>
      <div class="d-flex justify-space-between align-center">
        <v-img max-width="8rem" cover :src="logoUrl"></v-img>
        <v-item-group>
          <v-item>
            <span
              class="text-uppercase font-weight-light px-2 cursor-pointer"
              @click="searchProducts({})"
            >
              Inicio
            </span>
          </v-item>
          <v-item v-for="category in categories" :key="category.id">
            <span class="text-uppercase font-weight-light px-2 cursor-pointer">
              {{ category.name }}
              <v-menu
                :open-on-focus="false"
                activator="parent"
                open-on-hover
                offset="10"
                :close-on-content-click="false"
              >
                <v-list
                  class="py-0"
                  variant="text"
                  density="compact"
                  :elevation="1"
                >
                  <v-list-item
                    v-for="group in category.groups"
                    :key="group.id"
                    class="headerMenu pr-0"
                  >
                    <div class="d-flex justify-space-between py-0 my-0">
                      <div class="font-weight-medium text-uppercase">
                        {{ group.name }}
                      </div>
                      <div>
                        <v-icon
                          class="py-0 my-0"
                          icon="mdi-menu-right"
                        ></v-icon>
                      </div>
                    </div>
                    <v-menu
                      :open-on-focus="false"
                      activator="parent"
                      open-on-hover
                      submenu
                      offset="2"
                    >
                      <v-list
                        class="py-0"
                        variant="text"
                        density="compact"
                        :elevation="1"
                      >
                        <v-list-item
                          v-for="subCategory in group.categories"
                          :key="subCategory.id"
                          class="headerMenu"
                        >
                          <div
                            class="font-weight-medium text-uppercase"
                            @click="searchProducts(subCategory)"
                          >
                            {{ subCategory.category_name || subCategory.name }}
                          </div>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item>
                </v-list>
              </v-menu>
            </span>
          </v-item>
        </v-item-group>
        <span>
          <v-btn icon>
            <v-icon>{{
              loggedIn ? "mdi-account" : "mdi-account-outline"
            }}</v-icon>
          </v-btn>
          <v-btn icon @click="router.push({ path: '/cart' })">
            <v-badge
              offset-x="-3"
              offset-y="-1"
              color="blue-darken-2"
              :content="totalItems"
            >
              <v-icon> mdi-cart-outline</v-icon>
            </v-badge>
          </v-btn>
        </span>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { useShowcaseStore } from "@/stores/showcase";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import router from "@/router";

const { loggedIn, logoUrl, categories } = storeToRefs(useAppStore());
const { totalItems } = storeToRefs(useShowcaseStore());

function searchProducts(category) {
  if (category.hasOwnProperty("name")) {
    router.push({
      path: "/",
      query: {
        brand_id: category.brand_id,
      },
    });
  } else if (category.hasOwnProperty("category_name")) {
    router.push({
      path: "/",
      query: {
        brand_id: category.brand_id,
        category_id: category.category_id,
        gender_id: category.gender_id,
        size_type_id: category.size_type_id,
      },
    });
  } else {
    router.push({ path: "/" });
  }
}
</script>

<style>
.headerMenu:hover {
  background-color: #efefef;
  cursor: pointer;
}
</style>
