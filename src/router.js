import { createWebHistory, createRouter } from 'vue-router'
import { isAuthenticated } from './services/maintenanceService'
import { isAdminAuthenticated } from './services/admin/adminAuthService'

import HomeView from './components/HomePage.vue'
import Merci from './components/Merci.vue'
import Recherche from './components/Recherche.vue'
import WatchesCollection from './components/watch/WatchesCollection.vue'
import WatchDetail from './components/watch/WatchDetail.vue'
import Maintenance from './components/Maintenance.vue'
import EstimationPage from './components/EstimationPage.vue'
import AdminLogin from './components/admin/AdminLogin.vue'
import AdminDashboard from './components/admin/AdminDashboard.vue'
import AdminWatchForm from './components/admin/AdminWatchForm.vue'
import AdminWatchStats from './components/admin/AdminWatchStats.vue'
import AdminArticleList from './components/admin/AdminArticleList.vue'
import AdminArticleForm from './components/admin/AdminArticleForm.vue'
import AdminArticleGenerator from './components/admin/AdminArticleGenerator.vue'
import BlogList from './components/BlogList.vue'
import BlogDetail from './components/BlogDetail.vue'
import EstimationProcess from './components/EstimationProcess.vue'
import NotFound from './components/NotFound.vue'

const routes = [
  { path: '/maintenance', component: Maintenance },
  { path: '/', component: HomeView },
  { path: '/merci', component: Merci },
  { path: '/recherche', component: Recherche },
  { path: '/estimation', component: EstimationPage },
  { path: '/estimation/processus', component: EstimationProcess },
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
  { path: '/admin/watches/stats', component: AdminWatchStats },
  { path: '/admin/articles', component: AdminArticleList },
  { path: '/admin/articles/new', component: AdminArticleForm },
  { path: '/admin/articles/generate', component: AdminArticleGenerator },
  { path: '/admin/articles/:id/edit', component: AdminArticleForm },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(), //createWebHashHistory(),
  routes,
  async scrollBehavior(to, from, savedPosition) {
    // Si on a une ancre dans l'URL sur la page d'accueil, laisser HomePage gérer le scroll
    if (to.hash && to.path === '/') {
      // Ne pas scroller immédiatement, HomePage s'en chargera après le chargement
      return false
    }
    
    // Pour les autres pages avec ancre, attendre que le contenu soit chargé
    if (to.hash) {
      // Attendre que le DOM soit mis à jour
      await new Promise((resolve) => setTimeout(resolve, 100))
      
      // Attendre que toutes les images soient chargées
      await waitForImages()
      
      // Attendre encore un peu pour que le layout soit stabilisé
      await new Promise((resolve) => setTimeout(resolve, 200))
      
      const element = document.querySelector(to.hash)
      if (element) {
        return {
          el: to.hash,
          behavior: to.path === from.path ? 'smooth' : 'instant',
        }
      }
    }
    // always scroll to top
    return {
      top: 0,
      behavior: 'instant',
    }
  },
})

// Fonction pour attendre que toutes les images soient chargées
function waitForImages() {
  return new Promise((resolve) => {
    const images = document.querySelectorAll('img')
    if (images.length === 0) {
      resolve()
      return
    }
    
    let loadedCount = 0
    const totalImages = images.length
    const timeout = setTimeout(() => {
      // Timeout après 3 secondes pour ne pas bloquer indéfiniment
      resolve()
    }, 3000)
    
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++
        if (loadedCount === totalImages) {
          clearTimeout(timeout)
          resolve()
        }
      } else {
        img.addEventListener('load', () => {
          loadedCount++
          if (loadedCount === totalImages) {
            clearTimeout(timeout)
            resolve()
          }
        })
        img.addEventListener('error', () => {
          loadedCount++
          if (loadedCount === totalImages) {
            clearTimeout(timeout)
            resolve()
          }
        })
      }
    })
    
    // Si toutes les images sont déjà chargées
    if (loadedCount === totalImages) {
      clearTimeout(timeout)
      resolve()
    }
  })
}

// Guard de maintenance - bloque toutes les routes sauf /maintenance si non authentifié
router.beforeEach(async (to, from, next) => {
  // Stocker la route précédente pour EstimationProcess
  if (to.path === '/estimation/processus' && from.path) {
    sessionStorage.setItem('estimationProcessPreviousRoute', from.path)
  }

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
