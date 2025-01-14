<template>
  <v-container v-if="totalItems == 0">
    <v-row justify="center">
      <v-col cols="12">
        <div class="font-weight-bold text-uppercase text-h5 text-center">
          Tu carrito está vacío
        </div>
      </v-col>
      <v-col cols="12">
        <div class="text-subtitle-1 text-center">
          Cuando hayas añadido algo al carrito, aparecerá aquí. ¿Quieres
          empezar?
        </div>
      </v-col>
      <v-col cols="12" sm="4" lg="3" xl="2">
        <v-btn
          append-icon="mdi-arrow-right"
          variant="flat"
          color="surface-variant"
          block
          @click="router.replace({ path: '/' })"
        >
          Comenzar
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col cols="12" md="7" lg="8">
        <div class="font-weight-bold text-uppercase text-h5">Tu carrito</div>
        <div class="my-2">
          Los artículos de tu carrito no están reservados. Completa tu compra
          para asegurar tu pedido.
        </div>
        <div class="my-3 px-5 py-3 bg-grey-lighten-3">
          <div class="font-weight-bold mb-1">SE VENDEN RÁPIDO</div>
          <div>¡Aprovecha antes de que se acaben!</div>
        </div>
        <div
          v-for="(item, idx) in cart"
          :key="item.order.product_id"
          class="border mb-3"
        >
          <v-row no-gutters align="center">
            <v-col cols="4">
              <v-img
                min-height="180px"
                max-height="180px"
                align-self="center"
                :src="item.image"
              ></v-img>
            </v-col>
            <v-col cols="8" class="ps-3">
              <v-row justify="space-between">
                <v-col cols="10">
                  <span class="font-weight-light">Subtotal:</span>
                  <span class="ml-2 font-weight-bold mb-1">
                    {{
                      (item.product.sell_price * item.order.quantity).toFixed(2)
                    }}
                    Bs.
                  </span>
                </v-col>
                <v-col cols="2" class="text-end pe-4">
                  <v-icon
                    class="cursor-pointer"
                    color="grey-darken-2"
                    @click="removeItem(idx)"
                    >mdi-close</v-icon
                  >
                </v-col>
              </v-row>
              <div class="font-weight-medium">
                {{ item.product.product_name }}
              </div>
              <div class="mb-1">
                <span class="font-weight-light">Talla:</span>
                <span class="ml-2 font-weight-bold">
                  {{ item.size.name }}
                </span>
              </div>
              <div class="font-weight-light">
                Marca: {{ item.product.brand_name }}
              </div>
              <div class="font-weight-light">
                Tipo de talla: {{ item.product.size_type_name }}
              </div>
              <div class="font-weight-light">
                Género: {{ item.product.gender_name }}
              </div>
              <div class="mb-1">
                <v-number-input
                  v-model="item.order.quantity"
                  :reverse="false"
                  controlVariant="default"
                  :hideInput="false"
                  variant="solo-filled"
                  density="compact"
                  :step="1"
                  :min="1"
                  :max="item.stock"
                  hide-details
                ></v-number-input>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="12" md="5" lg="4">
        <v-row no-gutters>
          <v-col cols="12" order="3" order-md="1">
            <v-btn
              @click="
                router.replace({ path: loggedIn ? '/checkout' : '/login' })
              "
              append-icon="mdi-arrow-right"
              variant="flat"
              color="surface-variant"
              block
            >
              Continuar
            </v-btn>
          </v-col>
          <v-col cols="12" order="1" order-md="2">
            <div class="text-subtitle-1 font-weight-bold my-3">
              Resumen del pedido
            </div>
          </v-col>
          <v-col cols="12" order="2" order-md="3">
            <v-table density="compact">
              <tbody>
                <tr>
                  <td class="text-left">Productos</td>
                  <td class="text-right">{{ totalItems }}</td>
                </tr>
                <tr class="font-weight-bold">
                  <td class="text-left">Total</td>
                  <td class="text-right">Bs. {{ totalCart }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { appUrl } from "@/plugins/helpers";
import { useAppStore } from "@/stores/app";
import { useShowcaseStore } from "@/stores/showcase";
import { storeToRefs } from "pinia";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import router from "@/router";

const appStore = useAppStore();
const { loggedIn } = storeToRefs(appStore);
const { totalItems, totalCart, cart } = storeToRefs(useShowcaseStore());

function removeItem(idx) {
  cart.value.splice(idx, 1);
}
</script>
