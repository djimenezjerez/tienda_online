import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { appUrl } from '@/plugins/helpers'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const categories = ref([])
  const user = ref({
    id: 0,
    clientId: 0,
    userName: '',
    name: '',
    document: '',
    address: '',
    email: '',
    phone: '',
    cityCode: '',
    cityName: '',
    documentTypeCode: '',
    documentTypeName: '',
  })
  const loggedIn = ref(false)
  const token = ref(null)
  const store = ref({
    id: 0,
    name: import.meta.env.VITE_STORE_NAME,
    logo: '',
    warehouse: 0
  })
  const logoUrl = computed(() => {
    if (store.value.id > 0) {
      return appUrl(store.value.logo)
    } else {
      return ''
    }
  })
  function login(user, clientId, token) {
    user.value = {
      id: user.id,
      clientId: clientId,
      userName: user.username,
      name: user.name,
      document: user.document,
      address: user.address,
      email: user.email,
      phone: user.phone,
      cityCode: user.city_code,
      cityName: user.city_name,
      documentTypeCode: user.document_type_code,
      documentTypeName: user.document_type_name,
    }
    token.value = token
    loggedIn.value = true
  }
  return { loading, user, loggedIn, token, logoUrl, login, store, categories }
}, {
  persist: {
    pick: ['user', 'loggedIn', 'token', 'store', 'categories'],
    storage: localStorage
  },
})
