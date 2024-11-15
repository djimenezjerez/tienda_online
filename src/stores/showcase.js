import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useShowcaseStore = defineStore('showcase', () => {
  const product = ref({})
  const purchaseOrder = ref({
    id: 0,
    total: 0,
    state: null,
    comment: null,
  })
  const cart = ref([])

  const totalItems = computed(() => {
    return cart.value.length
  })
  const totalCart = computed(() => {
    return cart.value.reduce((sum, item) => {
      return sum + (Math.round((item.order.quantity * item.product.sell_price) * 100) / 100)
    }, 0).toFixed(2)
  })

  function clearCart() {
    purchaseOrder.value = {
      id: 0,
      total: 0,
      state: null,
      comment: null,
    }
    cart.value = []
    product.value = {}
  }

  function setCart(shoppingCart) {
    purchaseOrder.value = {
      id: shoppingCart.id,
      total: shoppingCart.total,
      state: shoppingCart.state,
      comment: shoppingCart.comment,
    }
    cart.value = []
    shoppingCart.products.map(o => cart.push({
      image: o.product.image,
      stock: o.product.stock,
      order: {
        color_id: o.product.color.id,
        product_id: o.product.id,
        quantity: o.product.quantity,
        size_id: o.product.size.id,
      },
      color: {
        id: o.product.color.id,
        hex: o.product.color.hex,
        image: o.product.image,
        name: o.product.color.name,
      },
      size: {
        id: o.product.size.id,
        name: o.product.size.name,
        numeric: o.product.size.numeric,
      },
      product: {
        brand_id: o.product.brand.id,
        brand_name: o.product.brand.name,
        category_id: o.product.category.id,
        category_name: o.product.category.name,
        gender_id: o.product.gender.id,
        gender_name: o.product.gender.name,
        image: o.product.image,
        product_name: o.product.name.name,
        product_name_id: o.product.name.id,
        sell_price: o.product.name.sell_price,
        size_type_id: o.product.size_type.id,
        size_type_name: o.product.size_type.name,
        total_stock: o.product.stock,

      },
    }))
  }

  return { product, purchaseOrder, cart, clearCart, setCart, totalItems, totalCart }
}, {
  persist: {
    pick: ['product', 'cart'],
    storage: localStorage
  },
})
