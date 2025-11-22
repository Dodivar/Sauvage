import { createWebHashHistory, createWebHistory, createRouter } from 'vue-router'
import { isAuthenticated } from './services/maintenanceService'
import { isAdminAuthenticated } from './services/adminAuthService'

import HomeView from './components/HomePage.vue'
import Merci from './components/Merci.vue'
import Recherche from './components/Recherche.vue'
import DepotVente from './components/DepotVente.vue'
import WatchesCollection from './components/WatchesCollection.vue'
import WatchDetail from './components/WatchDetail.vue'
import Maintenance from './components/Maintenance.vue'
import EstimationPage from './components/EstimationPage.vue'
import AdminLogin from './components/AdminLogin.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import AdminWatchForm from './components/AdminWatchForm.vue'
import BlogList from './components/BlogList.vue'
import BlogDetail from './components/BlogDetail.vue'

const routes = [
  { path: '/maintenance', component: Maintenance },
  { path: '/', component: HomeView },
  { path: '/merci', component: Merci },
  { path: '/recherche', component: Recherche },
  { path: '/estimation', component: EstimationPage },
  // { path: '/depot-vente', component: DepotVente },
   { path: '/collection', component: WatchesCollection },
   { path: '/watch/:id', component: WatchDetail },
   { path: '/blog', component: BlogList },
   { path: '/blog/:id', component: BlogDetail },
  // Admin routes
  { path: '/admin/login', component: AdminLogin },
  { path: '/admin', component: AdminDashboard },
  { path: '/admin/watches/new', component: AdminWatchForm },
  { path: '/admin/watches/:id/edit', component: AdminWatchForm },
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
router.beforeEach(async (to, from, next) => {
  // Routes admin - vérifier l'authentification admin
  if (to.path.startsWith('/admin')) {
    // Si on va vers la page de login admin, autoriser l'accès
    if (to.path === '/admin/login') {
      // Si déjà authentifié, rediriger vers /admin
      const authenticated = await isAdminAuthenticated()
      if (authenticated) {
        next('/admin')
        return
      }
      next()
      return
    }

    // Pour toutes les autres routes admin, vérifier l'authentification
    const authenticated = await isAdminAuthenticated()
    if (!authenticated) {
      next('/admin/login')
      return
    }

    next()
    return
  }

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
