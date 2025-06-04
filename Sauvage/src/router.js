import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/Home.vue'
import Merci from './components/MErci.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/merci', component: Merci },
  { path: '/recherche', component: Recherche },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
