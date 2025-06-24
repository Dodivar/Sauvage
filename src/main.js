import '@fortawesome/fontawesome-free/css/all.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

// Ecoute des changements de route pour GA
router.afterEach((to) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_ID, { page_path: to.fullPath })
  }
})

// Écouter les changements de thème
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

// Fonction pour mettre à jour les favicons
function updateFavicon(e) {
  const isDark = e.matches
  const favicons = document.querySelectorAll('link[rel="icon"]')

  favicons.forEach((favicon) => {
    const href = favicon.getAttribute('href')
    if (isDark) {
      favicon.setAttribute('href', href.replace('-light-', '-dark-'))
    } else {
      favicon.setAttribute('href', href.replace('-dark-', '-light-'))
    }
  })
}

// Exécuter au chargement
updateFavicon(mediaQuery)

// Écouter les changements
mediaQuery.addEventListener('change', updateFavicon)
