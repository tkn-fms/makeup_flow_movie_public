import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vue3GoogleLogin from 'vue3-google-login'

createApp(App).use(store).use(router).use(vue3GoogleLogin, {
  clientId: prosess.env.GOOGLE_CLIENT_ID, // クライアントID
  scope: 'profile email',
}).mount('#app')
