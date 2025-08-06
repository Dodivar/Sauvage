import { createWebHashHistory, createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/HomePage.vue'
import Merci from './components/Merci.vue'
import Recherche from './components/Recherche.vue'
import DepotVente from './components/DepotVente.vue'
import WatchesCollection from './components/WatchesCollection.vue'
import WatchDetail from './components/WatchDetail.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/merci', component: Merci },
  { path: '/recherche', component: Recherche },
  // { path: '/depot-vente', component: DepotVente },
  { path: '/collection', component: WatchesCollection },
  { path: '/watch/:id', component: WatchDetail },
]

const router = createRouter({
  history: createWebHistory(), //createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: to.path === from.path ? 'smooth' : 'instant',
      }
    }
    // always scroll to top
    return {
      top: 0,
      behavior: 'instant',
    }
  },
})

export default router
