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
import { WHATSAPP_NUMBER } from '@/config'
import CarouselVentes from './CarouselVentes.vue'
import EstimationForm from './EstimationForm.vue'

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
            <i class="fas fa-check-circle text-primary ml-2"></i>
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            Estimation gratuite, offre sous 24h, remise en main propre dans un lieu sécurisé.
          </p>
          <RouterLink
            to="/#estimation"
            class="inline-flex items-center bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Faire estimer ma montre
            <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </RouterLink>
        </div>
      </div>
      <!-- PARALLAX OBJECTS -->
      <div class="fixed top-0 h-full w-full overflow-hidden">
        <ParallaxImage
          :src="navitimerImg"
          alt="Breitling Navitimer"
          initial-x="0%"
          initial-y="45%"
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
          :src="parallaxImg1"
          alt="Montre de luxe"
          initial-x="40%"
          initial-y="50%"
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
          mobile-initial-y="45%"
          size="large"
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
          :src="parallaxImg4"
          alt="Montre de luxe"
          initial-x="20%"
          initial-y="40%"
          mobile-initial-y="45%"
          size="large"
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
    <section class="py-20 bg-white relative z-10">
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
    </section>

    <!-- Formulaire d'estimation -->
    <EstimationForm />

    <!-- Sécurité du service -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
            Pourquoi nous faire confiance ?
          </h2>
          <p class="text-xl text-gray-600">Votre sécurité et satisfaction sont nos priorités</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Estimation gratuite</h3>
            <p class="text-gray-600">Aucun frais, aucun engagement jusqu'à votre accord final</p>
          </div>
          <div class="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10l-8 4"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Prix du marché</h3>
            <p class="text-gray-600">
              Nous fournissons une estimation claire selon différents critères que nous vous
              argumenterons
            </p>
          </div>
          <div class="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Paiement rapide</h3>
            <p class="text-gray-600">Virement bancaire immédiat dès validation de votre montre</p>
          </div>
          <div class="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
            <div
              class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Aucune commission</h3>
            <p class="text-gray-600">
              Le prix proposé est le prix que vous recevez, sans frais cachés
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Avis et Témoignages -->
    <section id="temoignages" class="py-20 gradient-bg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
            Ils nous font confiance
          </h2>
          <p class="text-xl text-gray-600">Découvrez les témoignages de nos clients satisfaits</p>
          <div class="flex justify-center items-center mt-6 space-x-2">
            <div class="flex space-x-1">
              <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <span class="text-lg font-semibold text-text-main ml-3">4.9/5</span>
            <span class="text-gray-600 ml-2">(247 avis)</span>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Témoignage 1 -->
          <div
            class="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center mb-3">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold"
              >
                P.M
              </div>
              <div class="ml-4">
                <p class="font-semibold text-text-main">Pierre Martin</p>
                <p class="text-sm text-gray-600">Rolex Submariner • Janvier 2025</p>
              </div>
            </div>
            <div class="flex items-center mb-3">
              <div class="flex space-x-1">
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-gray-700 leading-relaxed italic">
              "Service exceptionnel ! J'ai vendu ma Rolex Submariner et l'estimation était très
              juste. Le processus était simple et le paiement rapide comme promis. Je recommande
              vivement."
            </p>
          </div>

          <!-- Témoignage 2 -->
          <div
            class="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center mb-3">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold"
              >
                S.L
              </div>
              <div class="ml-4">
                <p class="font-semibold text-text-main">Sophie Lefebvre</p>
                <p class="text-sm text-gray-600">Patek Philippe Calatrava • Décembre 2024</p>
              </div>
            </div>
            <div class="flex items-center mb-3">
              <div class="flex space-x-1">
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-gray-700 leading-relaxed italic">
              "Excellente expérience avec LuxTime. Ma Patek Philippe a été expertisée avec soin et
              professionnalisme. L'offre reçue était au-dessus de mes attentes. Transparence totale
              !"
            </p>
          </div>

          <!-- Témoignage 3 -->
          <div
            class="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center mb-3">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold"
              >
                A.D
              </div>
              <div class="ml-4">
                <p class="font-semibold text-text-main">Antoine Dubois</p>
                <p class="text-sm text-gray-600">Omega Speedmaster • Novembre 2024</p>
              </div>
            </div>
            <div class="flex items-center mb-3">
              <div class="flex space-x-1">
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg class="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-gray-700 leading-relaxed italic">
              "Processus très professionnel du début à la fin. J'avais des doutes au départ mais
              l'équipe m'a rassuré à chaque étape. Ma montre Omega a été parfaitement évaluée."
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
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
            Suivez-nous sur les réseaux !
          </h2>
          <p class="text-xl text-gray-600">Découvrez l'univers fascinant des montres</p>
        </div>
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 class="text-2xl font-semibold mb-6">Plongez dans l'histoire horlogère</h3>
            <p class="text-gray-600 mb-6 leading-relaxed">
              Sur nos réseaux sociaux, nous partageons notre passion pour l'horlogerie de luxe.
              Découvrez l'histoire fascinante des plus grandes manufactures, les secrets de
              fabrication des montres d'exception, et les anecdotes sur les modèles les plus
              emblématiques.
            </p>
            <p class="text-gray-600 mb-8 leading-relaxed">
              De la Submariner de Rolex à la Royal Oak d'Audemars Piguet, chaque montre a son
              histoire. Rejoignez notre communauté de passionnés et enrichissez vos connaissances
              horlogères.
            </p>
            <div class="flex space-x-4">
              <a
                href="https://www.tiktok.com/@sauvagewatches"
                target="_blank"
                class="bg-primary text-white p-3 rounded-full hover:bg-green-700 transition-colors"
              >
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="bg-primary text-white p-3 rounded-full hover:bg-green-700 transition-colors"
              >
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.254-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
              </a>
              <a
                :href="'https://wa.me/' + WHATSAPP_NUMBER"
                target="_blank"
                class="bg-primary text-white p-3 rounded-full hover:bg-green-700 transition-colors"
              >
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Rolex"
              class="rounded-2xl shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1548171915-e79a380a2a4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Patek Philippe"
              class="rounded-2xl shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1609587312208-cea54be969e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Omega"
              class="rounded-2xl shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Cartier"
              class="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
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
