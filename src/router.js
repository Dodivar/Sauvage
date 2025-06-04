import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/Home.vue'
import Merci from './components/Merci.vue'
import Recherche from './components/Recherche.vue'
import DepotVente from './components/DepotVente.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/merci', component: Merci },
  { path: '/recherche', component: Recherche },
  { path: '/depot-vente', component: DepotVente },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: to === from ? 'smooth' : 'instant',
      }
    }
    // always scroll to top
    return { top: 0 }
  },
})

export default router
