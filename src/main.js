import '@fortawesome/fontawesome-free/css/all.css'
import './assets/main.css'

import { createApp, onMounted } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
