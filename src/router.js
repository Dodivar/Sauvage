import { createWebHashHistory, createWebHistory, createRouter } from 'vue-router'
import { isAuthenticated } from './services/maintenanceService'

import HomeView from './components/HomePage.vue'
import Merci from './components/Merci.vue'
import Recherche from './components/Recherche.vue'
import DepotVente from './components/DepotVente.vue'
import WatchesCollection from './components/WatchesCollection.vue'
import WatchDetail from './components/WatchDetail.vue'
import Maintenance from './components/Maintenance.vue'
import EstimationPage from './components/EstimationPage.vue'

const routes = [
  { path: '/maintenance', component: Maintenance },
  { path: '/', component: HomeView },
  { path: '/merci', component: Merci },
  { path: '/recherche', component: Recherche },
  { path: '/estimation', component: EstimationPage },
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

// Guard de maintenance - bloque toutes les routes sauf /maintenance si non authentifié
router.beforeEach((to, from, next) => {
  // Si on va vers la page de maintenance, autoriser l'accès
  if (to.path === '/maintenance') {
    next()
    return
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de maintenance
  if (!isAuthenticated()) {
    next('/maintenance')
    return
  }

  // Sinon, autoriser l'accès
  next()
})

export default router
