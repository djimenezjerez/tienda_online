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
    cityId: 0,
    cityCode: '',
    cityName: '',
    documentTypeId: 0,
    documentTypeCode: '',
    documentTypeName: '',
  })
  const loggedIn = ref(false)
  const token = ref('')
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
  function login(userData, clientId, tokenApi) {
    user.value = {
      id: userData.id,
      clientId: clientId,
      userName: userData.username,
      name: userData.name,
      document: userData.document,
      address: userData.address,
      email: userData.email,
      phone: userData.phone,
      cityId: userData.city_id,
      cityCode: userData.city_code,
      cityName: userData.city_name,
      documentTypeId: userData.document_type_id,
      documentTypeCode: userData.document_type_code,
      documentTypeName: userData.document_type_name,
    }
    token.value = tokenApi
    loggedIn.value = true
  }
  return { loading, user, loggedIn, token, logoUrl, login, store, categories }
}, {
  persist: {
    pick: ['user', 'loggedIn', 'token', 'store', 'categories'],
    storage: localStorage
  },
})
