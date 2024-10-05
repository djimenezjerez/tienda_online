/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import VueAxios from 'vue-axios'
import axios from './axios'
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(VueAxios, axios)

  app.provide('axios', app.config.globalProperties.axios)
}
