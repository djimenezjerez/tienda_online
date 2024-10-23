import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useShowcaseStore = defineStore('showcase', () => {
  const product = ref({})
  const cart = ref([])
  const totalItems = computed(() => {
    return cart.value.length
  })
  const totalCart = computed(() => {
    return cart.value.reduce((sum, item) => {
      return sum + (Math.round((item.order.quantity * item.product.sell_price) * 100) / 100)
    }, 0).toFixed(2)
  })
  return { product, cart, totalItems, totalCart }
}, {
  persist: {
    pick: ['product', 'cart'],
    storage: localStorage
  },
})
