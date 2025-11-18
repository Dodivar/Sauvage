<script setup>
import { onMounted, ref, watch } from 'vue'
import { scrollAnimation } from '@/animation'
import navitimerImg from '@/assets/hero section img/navitimer-b01-chronograph-43.png'
import parallaxImg1 from '@/assets/hero section img/montre-tag-heuer-monaco-calibre-11.png'
import parallaxImg2 from '@/assets/hero section img/Rolex.png'
import parallaxImg3 from '@/assets/hero section img/cartier-santos.png'
import parallaxImg4 from '@/assets/hero section img/image-Photoroom (2).png'
import ParallaxImage from './ParallaxImage.vue'
import { createPreviewElement } from '@/services/imagePreviewService'
import FaqSection from './Faq.vue'
import CarouselVentes from './CarouselVentes.vue'
import EstimationForm from './EstimationForm.vue'
import SuivezNous from './SuivezNous.vue'

const isSubmitting = ref(false)
const loadingDots = ref('')
let loadingInterval = null

watch(isSubmitting, (val) => {
  if (val) {
    let count = 0
    loadingInterval = setInterval(() => {
      count = (count + 1) % 4
      loadingDots.value = '.'.repeat(count)
    }, 400)
  } else {
    loadingDots.value = ''
    if (loadingInterval) clearInterval(loadingInterval)
  }
})

onMounted(() => {
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

  // Preview photos files
  const fileInput = document.getElementById('attachments')
  const previewContainer = document.getElementById('preview-attachments-container')
  let selectedFiles = []

  function updatePreview() {
    previewContainer.innerHTML = ''
    // Trie : PDF d'abord, puis images
    const pdfFiles = selectedFiles.filter((f) => f.type === 'application/pdf')
    const imgFiles = selectedFiles.filter(
      (f) =>
        f.type.startsWith('image/') ||
        f.name.toLowerCase().endsWith('.heic') ||
        f.type === 'image/heic',
    )
    const allFiles = [...pdfFiles, ...imgFiles]
    allFiles.forEach(async (file) => {
      const previewEl = await createPreviewElement(file)
      // Ajout du bouton de suppression
      const removeBtn = document.createElement('button')
      removeBtn.type = 'button'
      removeBtn.innerHTML = '&times;'
      removeBtn.title = 'Supprimer'
      removeBtn.style.position = 'absolute'
      removeBtn.style.top = '4px'
      removeBtn.style.right = '4px'
      removeBtn.style.background = '#fff'
      removeBtn.style.color = '#22c55e'
      removeBtn.style.border = 'none'
      removeBtn.style.borderRadius = '50%'
      removeBtn.style.width = '24px'
      removeBtn.style.height = '24px'
      removeBtn.style.fontSize = '18px'
      removeBtn.style.cursor = 'pointer'
      removeBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'
      removeBtn.addEventListener('click', () => {
        // Trouver l'index réel dans selectedFiles
        const realIdx = selectedFiles.findIndex((f) => f.name === file.name && f.size === file.size)
        if (realIdx !== -1) {
          selectedFiles.splice(realIdx, 1)
          updatePreview()
          updateInputFiles()
        }
      })
      previewEl.appendChild(removeBtn)
      previewContainer.appendChild(previewEl)
    })
  }

  function updateInputFiles() {
    // Crée un nouvel objet DataTransfer pour mettre à jour l'input file
    const dataTransfer = new DataTransfer()
    selectedFiles.forEach((f) => dataTransfer.items.add(f))
    fileInput.files = dataTransfer.files
  }

  fileInput.addEventListener('change', function () {
    const newFiles = Array.from(fileInput.files)
    // Ajoute les nouveaux fichiers sans doublons (par nom + taille)
    newFiles.forEach((f) => {
      if (!selectedFiles.some((sf) => sf.name === f.name && sf.size === f.size)) {
        selectedFiles.push(f)
      }
    })
    updatePreview()
    updateInputFiles()
  })

  // Initial preview si déjà des fichiers (rare mais possible)
  if (fileInput.files.length > 0) {
    selectedFiles = Array.from(fileInput.files)
    updatePreview()
  }
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section id="accueil" class="gradient-bg py-20 lg:py-32 h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center relative z-10">
          <h1 class="text-4xl lg:text-6xl font-bold text-text-main mb-6 leading-tight">
            Vendez votre montre
            <span class="text-primary">rapidement</span> et au
            <span class="text-primary">meilleur prix</span>
            <i class="fas fa-circle-check text-primary ml-2"></i>
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            Estimation gratuite, offre sous 24h, remise en main propre sécurisée.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RouterLink
              to="/collection"
              class="inline-flex items-center bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Voir les montres en stock
              <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </RouterLink>
            <RouterLink
              to="/recherche"
              class="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary text-primary bg-white hover:bg-green-50 transition-all hover:scale-105 shadow"
            >
              Recherche personnalisée
              <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
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
          mobile-initial-y="50%"
          size="large"
          :scroll-speed="0.5"
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
          mobile-initial-x="20%"
          mobile-initial-y="50%"
          :scroll-speed="0.7"
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
          mobile-initial-y="55%"
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
          mobile-initial-y="55%"
          size="large"
          :scroll-speed="0.4"
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
          mobile-initial-y="45%"
          size="large"
          :initial-rotation="300"
          :scroll-speed="0.7"
          :float-speed="0.55"
          :float-amplitude="20"
          :vertical-speed="0.4"
          :vertical-amplitude="15"
          :rotation-speed="0.3"
          :rotation-amplitude="5"
          :scale-value="0.7"
        />
      </div>
    </section>

    <!-- Comment ça marche -->
    <!-- <section class="py-20 bg-white relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">Comment ça marche ?</h2>
          <p class="text-xl text-gray-600">Un processus simple et sécurisé en 3 étapes</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center group">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
            >
              <span class="text-2xl font-bold text-white">1</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Remplir le formulaire</h3>
            <p class="text-gray-600">
              Décrivez votre montre et ajoutez quelques photos. Notre équipe d'experts analyse votre
              demande.
            </p>
          </div>
          <div class="text-center group">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
            >
              <span class="text-2xl font-bold text-white">2</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Recevoir une offre sous 24h</h3>
            <p class="text-gray-600">
              Nous vous proposons le meilleur prix du marché basé sur l'état et la rareté de votre
              pièce.
            </p>
          </div>
          <div class="text-center group">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
            >
              <span class="text-2xl font-bold text-white">3</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Paiement rapide et sécurisé</h3>
            <p class="text-gray-600">
              Dès accord, nous organisons la récupération sécurisée et vous payons immédiatement.
            </p>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Formulaire d'estimation -->
    <EstimationForm />

    <!-- Sécurité et avantages pour ACHETER ou rechercher une montre -->
    <section class="py-20 bg-white">
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
          <div class="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 13c-4.418 0-8-3.582-8-8a8 8 0 1116 0c0 4.418-3.582 8-8 8z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Accompagnement personnalisé</h3>
            <p class="text-gray-600">
              Conseils, sourcing sur-mesure et suivi tout au long de votre projet d'achat ou de recherche de montre.
            </p>
          </div>
          <!-- Authenticité et sécurité des transactions -->
          <div class="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c.943 0 1.708-.765 1.708-1.708s-.765-1.708-1.708-1.708-1.708.765-1.708 1.708S11.057 11 12 11zm0 8c-4.418 0-8-3.582-8-8a8 8 0 1116 0c0 4.418-3.582 8-8 8zm3-6l-3-3-3 3" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Authenticité & sécurité</h3>
            <p class="text-gray-600">
              Chaque montre est minutieusement vérifiée : authenticité certifiée, paiement sécurisé, transaction protégée.
            </p>
          </div>
          <!-- Accès à un large réseau et sourcing -->
          <div class="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H7v-2a4 4 0 014-4h1m0-6V4a4 4 0 011-7V4a4 4 0 01-1 7zm0 0v2a2 2 0 002 2h2" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Sourcing & réseau international</h3>
            <p class="text-gray-600">
              Profitez de mon réseau français et européen pour accéder à des modèles rares, exclusifs ou au meilleur rapport qualité/prix.
            </p>
          </div>
          <!-- Transparence et sérénité -->
          <div class="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m-7 9a9 9 0 1118 0 9 9 0 01-18 0z" />
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
    
    <!-- Nos services -->
    <section id="services" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">Nos services exclusifs</h2>
          <p class="text-xl text-gray-600">
            Une expertise complète pour répondre à tous vos besoins horlogers
          </p>
        </div>

        <!-- md:grid-cols-2 lg:grid-cols-4 -->
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Estimation gratuite -->
          <div class="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-primary text-4xl mb-4">
              <i class="fas fa-calculator"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Estimation gratuite</h3>
            <p class="text-gray-600 mb-4">
              Obtenez une évaluation fiable de votre montre en moins de 24h, sans engagement.
            </p>
            <a href="#estimation" class="text-primary font-semibold hover:underline">
              Faire estimer ma montre
            </a>
          </div>

          <!-- Vente de montre -->
          <div class="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-primary text-4xl mb-4">
              <i class="fas fa-hand-holding-usd"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Vente de montre</h3>
            <p class="text-gray-600 mb-4">
              Découvrez notre offre de montre à saisir dès maitenant.
            </p>
            <a href="/collection" class="text-primary font-semibold hover:underline">
              Voir nos offres
            </a>
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

          <!-- Recherche personnalisée -->
          <div class="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-primary text-4xl mb-4">
              <i class="fas fa-search"></i>
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
        </div>
      </div>
    </section>

    <!-- Dernières ventes -->
    <CarouselVentes />

    <!-- FAQ -->
    <FaqSection />

    <!-- Suivez-nous Section -->
    <SuivezNous />
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
