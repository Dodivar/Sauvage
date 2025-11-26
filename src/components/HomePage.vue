<script setup>
import { onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { scrollAnimation } from '@/animation'
import navitimerImg from '@/assets/hero section img/navitimer-b01-chronograph-43.png'
import parallaxImg1 from '@/assets/hero section img/montre-tag-heuer-monaco-calibre-11.png'
import parallaxImg2 from '@/assets/hero section img/Rolex.png'
import parallaxImg3 from '@/assets/hero section img/cartier-santos.png'
import parallaxImg4 from '@/assets/hero section img/image-Photoroom (2).png'
import ParallaxImage from './ParallaxImage.vue'
import FaqSection from './Faq.vue'
import CarouselVentes from './CarouselVentes.vue'
import CarouselNouvelles from './CarouselNouvelles.vue'
import SuivezNous from './SuivezNous.vue'

const route = useRoute()

// SEO Meta Tags
useHead({
  title: 'Sauvage - Rachat de Montres de Luxe | Collection Garantie',
  meta: [
    {
      name: 'description',
      content: 'Découvrez notre collection de montres de luxe garanties 1 an. Rolex, Breitling, Tag Heuer, Cartier et plus. Estimation gratuite, recherche personnalisée et accompagnement expert.',
    },
    {
      property: 'og:title',
      content: 'Sauvage - Rachat de Montres de Luxe | Collection Garantie',
    },
    {
      property: 'og:description',
      content: 'Découvrez notre collection de montres de luxe garanties 1 an. Estimation gratuite, recherche personnalisée et accompagnement expert.',
    },
    {
      property: 'og:url',
      content: 'https://sauvage-watches.fr',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: 'Sauvage - Rachat de Montres de Luxe',
    },
    {
      name: 'twitter:description',
      content: 'Découvrez notre collection de montres de luxe garanties 1 an. Estimation gratuite, recherche personnalisée.',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://sauvage-watches.fr',
    },
  ],
})

// Fonction pour scroller vers une ancre après le chargement complet
const scrollToHash = async () => {
  if (route.hash) {
    // Attendre plusieurs ticks pour que tous les composants soient montés
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    // Attendre que toutes les images soient chargées (avec plusieurs tentatives)
    // car les images des carrousels peuvent se charger progressivement
    for (let i = 0; i < 3; i++) {
      await waitForAllImages()
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    
    // Attendre encore un peu pour que le layout soit stabilisé
    await new Promise((resolve) => setTimeout(resolve, 200))
    
    const element = document.querySelector(route.hash)
    if (element) {
      // Utiliser scrollIntoView avec un offset pour éviter que l'élément soit caché par un header fixe si nécessaire
      const yOffset = -20 // Ajustez selon vos besoins
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'instant' })
    }
  }
}

// Fonction pour attendre que toutes les images soient chargées
const waitForAllImages = () => {
  return new Promise((resolve) => {
    const images = document.querySelectorAll('img')
    if (images.length === 0) {
      resolve()
      return
    }
    
    let loadedCount = 0
    const totalImages = images.length
    const timeout = setTimeout(() => {
      // Timeout après 2 secondes pour ne pas bloquer indéfiniment
      resolve()
    }, 2000)
    
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
        }, { once: true })
        img.addEventListener('error', () => {
          loadedCount++
          if (loadedCount === totalImages) {
            clearTimeout(timeout)
            resolve()
          }
        }, { once: true })
      }
    })
    
    // Si toutes les images sont déjà chargées
    if (loadedCount === totalImages) {
      clearTimeout(timeout)
      resolve()
    }
  })
}

onMounted(async () => {
  scrollAnimation()

  // Add JavaScript to handle parallax effect on scroll
  window.addEventListener('scroll', function () {
    const parallaxElements = document.querySelectorAll('.parallax-object')
    parallaxElements.forEach(function (element) {
      let scrollPosition = window.scrollY
      const speed = Number(element.dataset.scrollSpeed)
      element.style.transform = 'translateY(' + scrollPosition * 0.5 * speed + 'px)'
    })
  })
  
  // Scroller vers l'ancre après le chargement complet
  await scrollToHash()
})

// Surveiller les changements de hash dans l'URL
watch(() => route.hash, async () => {
  await scrollToHash()
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section id="accueil" class="gradient-bg py-20 lg:py-32 h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center relative z-10">
          <h1 class="text-4xl lg:text-6xl font-bold text-text-main mb-6 leading-tight">
            Découvrez nos <span class="text-primary">montres disponibles</span> dès maintenant
            <svg class="inline-block w-10 h-10 text-primary align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="9.5" y="1.5" width="5" height="3" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="9.5" y="19.5" width="5" height="3" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M12 8v4l2.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            Consultez notre sélection de montres en stock garanties 1 an.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RouterLink
              to="/collection"
              class="inline-flex items-center bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all shadow-lg"
            >
              Voir les montres en stock
            </RouterLink>
            <RouterLink
              to="/recherche"
              class="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary text-primary hover:bg-green-50 transition-all shadow"
            >
              Recherche personnalisée
            </RouterLink>
          </div>
        </div>
      </div>
      <!-- PARALLAX OBJECTS -->
      <div class="fixed top-0 h-full w-full overflow-hidden">
        <ParallaxImage
          :src="navitimerImg"
          alt="Breitling Navitimer"
          initial-x="0%"
          initial-y="45%"
          mobile-initial-x="-10%"
          mobile-initial-y="58%"
          size="large"
          :scroll-speed="0.4"
          :float-speed="0.4"
          :float-amplitude="12"
          :vertical-speed="0.7"
          :vertical-amplitude="15"
          :rotation-speed="1"
          :rotation-amplitude="2"
          :scale-value="0.85"
        />
        <ParallaxImage
          :src="parallaxImg4"
          alt="Montre de luxe"
          initial-x="20%"
          initial-y="40%"
          mobile-initial-x="15%"
          mobile-initial-y="60%"
          :scroll-speed="0.3"
          :float-speed="0.55"
          :float-amplitude="20"
          :vertical-speed="0.4"
          :vertical-amplitude="15"
          :rotation-speed="0.3"
          :rotation-amplitude="5"
          :scale-value="0.7"
        />
        <ParallaxImage
          :src="parallaxImg1"
          alt="Montre de luxe"
          initial-x="40%"
          initial-y="50%"
          mobile-initial-x="30%"
          mobile-initial-y="65%"
          size="large"
          :scroll-speed="0.2"
          :float-speed="0.6"
          :float-amplitude="18"
          :vertical-speed="0.35"
          :vertical-amplitude="12"
          :rotation-speed="0.25"
          :rotation-amplitude="4"
          :scale-value="0.75"
        />
        <ParallaxImage
          :src="parallaxImg2"
          alt="Montre de luxe"
          initial-x="60%"
          initial-y="50%"
          mobile-initial-x="50%"
          mobile-initial-y="62%"
          size="large"
          :scroll-speed="0.3"
          :float-speed="0.45"
          :float-amplitude="15"
          :vertical-speed="0.3"
          :vertical-amplitude="10"
          :rotation-speed="0.2"
          :rotation-amplitude="3"
          :scale-value="0.8"
        />
        <ParallaxImage
          :src="parallaxImg3"
          alt="Montre de luxe"
          initial-x="80%"
          initial-y="40%"
          mobile-initial-x="70%"
          mobile-initial-y="60%"
          size="large"
          :initial-rotation="300"
          :scroll-speed="0.50"
          :float-speed="0.45"
          :float-amplitude="20"
          :vertical-speed="0.4"
          :vertical-amplitude="15"
          :rotation-speed="0.3"
          :rotation-amplitude="5"
          :scale-value="0.7"
        />
      </div>
    </section>

    <!-- Nouvelles arrivées -->
    <CarouselNouvelles />

    <!-- Sécurité et avantages pour ACHETER ou rechercher une montre -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
            Achetez ou recherchez votre montre en toute confiance
          </h2>
          <p class="text-xl text-gray-600">
            Profitez d'un accompagnement personnalisé, d'une sécurité totale et de tous les avantages de mon réseau d'expert pour un achat serein ou la quête du modèle qui vous fait rêver.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Service personnalisé -->
          <div class="text-center p-6 rounded-2xl bg-white shadow-lg transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <!-- user/collaborateur -->
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 14c2.21 0 4 1.79 4 4v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1c0-2.21 1.79-4 4-4h8zm0 0V9a4 4 0 10-8 0v5" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Accompagnement personnalisé</h3>
            <p class="text-gray-600">
              Conseils, sourcing sur-mesure et suivi tout au long de votre projet d'achat ou de recherche de montre.
            </p>
          </div>
          <!-- Authenticité et sécurité des transactions -->
          <div class="text-center p-6 rounded-2xl bg-white shadow-lg transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <!-- shield sécurité -->
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4l7 4v6a9 9 0 01-7 8 9 9 0 01-7-8V8l7-4z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Authenticité & sécurité</h3>
            <p class="text-gray-600">
              Chaque montre est minutieusement vérifiée : authenticité certifiée, paiement sécurisé, transaction protégée.
            </p>
          </div>
          <!-- Accès à un large réseau et sourcing -->
          <div class="text-center p-6 rounded-2xl bg-white shadow-lg transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <!-- globe icône FontAwesome style (remplacement) -->
              <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Sourcing & réseau international</h3>
            <p class="text-gray-600">
              Profitez de mon réseau français et européen pour accéder à des modèles rares, exclusifs ou au meilleur rapport qualité/prix.
            </p>
          </div>
          <!-- Transparence et sérénité -->
          <div class="text-center p-6 rounded-2xl bg-white shadow-lg transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <!-- file-check (document validé/sérénité) -->
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke-width="2"/>
                <!-- Checkmark recentrée dans le carré -->
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 13.5l2.2 2.2 4.8-4.8"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Transparence & satisfaction</h3>
            <p class="text-gray-600">
              Processus limpide, aucune commission cachée, votre tranquillité est notre priorité.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Dernières ventes -->
    <CarouselVentes />
    
    <SuivezNous />
    
    <!-- Services -->
    <section id="services" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">Nos services exclusifs</h2>
          <p class="text-xl text-gray-600">
            Une expertise complète pour répondre à tous vos besoins horlogers
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">

          <!-- Recherche personnalisée -->
          <div class="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-primary text-4xl mb-4 flex justify-center">
              <!-- SVG search icon -->
              <svg class="h-10 w-10 text-primary mx-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Recherche personnalisée</h3>
            <p class="text-gray-600 mb-4">
              Dites-nous ce que vous cherchez, nous le trouvons pour vous. Rareté, budget, état : on
              s'occupe de tout.
            </p>

            <RouterLink to="/recherche" class="text-primary font-semibold hover:underline">
              Demander une recherche</RouterLink
            >
          </div>
         
          <!-- Vente de montre -->
          <div class="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-primary text-4xl mb-4 flex justify-center">
              <!-- SVG montre (watch) icon -->
              <svg class="h-10 w-10 text-primary mx-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
                <rect x="9.5" y="1.5" width="5" height="3" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
                <rect x="9.5" y="19.5" width="5" height="3" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 8v4l2.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Vente de montre</h3>
            <p class="text-gray-600 mb-4">
              Découvrez notre offre de montre à saisir dès maitenant.
            </p>
            <a href="/collection" class="text-primary font-semibold hover:underline">
              Voir nos montres en stock
            </a>
          </div>

          <!-- Estimation gratuite -->
          <div class="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-primary text-4xl mb-4 flex justify-center">
              <!-- SVG calculator icon -->
              <svg class="h-10 w-10 text-primary mx-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                <rect x="8" y="7" width="8" height="2" rx="1" fill="currentColor" class="opacity-30"/>
                <circle cx="8" cy="13" r="1" fill="currentColor"/>
                <circle cx="12" cy="13" r="1" fill="currentColor"/>
                <circle cx="16" cy="13" r="1" fill="currentColor"/>
                <circle cx="8" cy="17" r="1" fill="currentColor"/>
                <circle cx="12" cy="17" r="1" fill="currentColor"/>
                <circle cx="16" cy="17" r="1" fill="currentColor"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Estimation gratuite</h3>
            <p class="text-gray-600 mb-4">
              Obtenez une évaluation fiable de votre montre en moins de 24h, sans engagement.
            </p>
            <RouterLink to="/estimation" class="text-primary font-semibold hover:underline">
              Faire estimer ma montre
            </RouterLink>
          </div>
          <!-- Dépôt-vente -->
          <!-- <div class="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-primary text-4xl mb-4">
              <i class="fas fa-store"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Dépôt-vente</h3>
            <p class="text-gray-600 mb-4">
              Confiez-nous votre montre : nous activons notre réseau pour trouver un acheteur
              sérieux.
            </p>
            <RouterLink to="/depot-vente" class="text-primary font-semibold hover:underline">
              En savoir plus
            </RouterLink>
          </div> -->
        </div>
      </div>
    </section>

    <FaqSection />

  </div>
</template>

<style scoped>
@keyframes heic-spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
