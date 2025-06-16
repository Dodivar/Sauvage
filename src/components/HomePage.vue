<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { scrollAnimation } from '@/animation'
import navitimerImg from '@/assets/watches/navitimer-b01-chronograph-43.png'
import parallaxImg1 from '@/assets/hero section img/image-Photoroom (9).png'
import parallaxImg2 from '@/assets/hero section img/image-Photoroom (3).png'
import parallaxImg3 from '@/assets/hero section img/image-Photoroom (2).png'
import ParallaxImage from './ParallaxImage.vue'
import TooltipInfo from './TooltipInfo.vue'
import { handleFormSubmit, prepareEstimationFormData } from '@/services/emailService'

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')

async function submitEstimationForm(event) {
  event.preventDefault()
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await handleFormSubmit(
      event.target,
      prepareEstimationFormData,
      () => {
        ToMerci()
      },
      (error) => {
        errorMessage.value =
          error.message ||
          "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer."
        console.error('Erreur détaillée:', error)
      },
    )
  } catch (error) {
    errorMessage.value =
      error.message ||
      "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer."
    console.error('Erreur détaillée:', error)
  } finally {
    isSubmitting.value = false
  }
}

const whatsapp = ref('+33612843926')

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

  // Auto-scroll Script
  const carousel = document.getElementById('sales-carousel')
  if (carousel != null) {
    let autoScrollActive = true

    function startAutoScroll() {
      if (!autoScrollActive) return
      carousel.scrollBy({ left: 1, behavior: 'smooth' })
    }

    // Scroll every 30ms for slow smooth effect
    let scrollInterval = setInterval(startAutoScroll, 30)

    // Stop auto-scroll on user interaction
    ;['wheel', 'touchstart', 'mousedown'].forEach((event) => {
      carousel.addEventListener(
        event,
        () => {
          autoScrollActive = false
          clearInterval(scrollInterval)
        },
        { once: true },
      )
    })
  }

  // Preview photos files
  const fileInput = document.getElementById('photos')
  const previewContainer = document.getElementById('preview-photos-container')

  fileInput.addEventListener('change', function () {
    previewContainer.innerHTML = '' // Réinitialise les aperçus

    const files = Array.from(fileInput.files)

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = function (e) {
        const img = document.createElement('img')
        img.src = e.target.result
        img.style.maxWidth = '150px'
        img.style.margin = '10px'
        img.style.borderRadius = '10px'
        img.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)'
        previewContainer.appendChild(img)
      }
      reader.readAsDataURL(file)
    })
  })
})

function ToMerci() {
  router.push({ path: '/merci', query: { from: 'estimation' } })
}

// FAQ data
const faqItems = [
  {
    id: 1,
    question: "L'estimation est-elle vraiment gratuite ?",
    answer:
      "Oui, l'estimation est <strong>100 % gratuite et sans aucun engagement</strong>. Vous êtes libre d'accepter ou de refuser notre proposition, sans aucune pression.",
  },
  {
    id: 2,
    question: "Comment est calculée l'estimation de ma montre ?",
    answer:
      "Nous basons notre estimation sur l'état de votre montre, sa cote actuelle sur le marché (Chrono24, ventes aux enchères, etc.), sa rareté, et la présence de la boîte/papiers. Nous vous fournissons une estimation transparente et argumentée.",
  },
  {
    id: 3,
    question: 'Dois-je fournir la boîte et les papiers ?',
    answer:
      "Ce n'est pas obligatoire, mais cela peut <strong>augmenter la valeur</strong> de votre montre. Nous acceptons également les montres sans papiers, à condition qu'elles soient authentiques.",
  },
  {
    id: 4,
    question: 'Comment puis-je être sûr(e) que vous êtes un professionnel sérieux ?',
    answer:
      'Notre activité est déclarée (SIRET visible sur le site), et nous avons déjà accompagné de nombreux clients satisfaits. Nous vous invitons à consulter nos avis Google, à vérifier notre profil professionnel et à nous contacter pour toute question.',
  },
  {
    id: 5,
    question:
      'Je ne suis pas sûr(e) de vouloir vendre tout de suite. Puis-je quand même demander une estimation ?',
    answer:
      "Absolument. Vous pouvez obtenir une estimation et <strong>revenir vers nous plus tard</strong> si vous changez d'avis. Nous ne conservons vos données que pour vous recontacter si vous le souhaitez.",
  },
  {
    id: 6,
    question: 'Rachetez-vous toutes les marques de montres ?',
    answer:
      "Nous rachetons principalement les <strong>montres de marques</strong> comme Rolex, Omega, Cartier, Breitling, Audemars Piguet, Patek Philippe, etc. Si vous avez un doute, n'hésitez pas à nous envoyer les informations, nous vous répondrons rapidement.",
  },
  {
    id: 7,
    question: 'Comment se déroule le processus de vente ?',
    answer: `<ul class="list-decimal">
      <li>Vous remplissez notre formulaire en ligne (ou nous contactez directement).</li>
      <li>Nous vous envoyons une estimation sous 24h.</li>
      <li>Si vous acceptez, nous organisons la remise en main propre.</li>
      <li>Une fois la montre vérifiée, vous recevez le paiement immédiat.</li>
    </ul>`,
  },
  {
    id: 8,
    question: "Proposez vous d'autres services ?",
    answer:
      'Toute à fait ! Nous proposons également : La vente de montres de collection et de prestige Le dépôt-vente pour mettre en vente votre montre en toute sécurité La recherche personnalisée pour vous aider à trouver la montre de vos rêves selon vos critères spécifiques Notre expertise nous permet de vous offrir un service complet et sur-mesure, que vous souhaitiez vendre, acheter ou confier votre montre.',
  },
]

const activeFaqId = ref(null)

const toggleFaq = (id) => {
  activeFaqId.value = activeFaqId.value === id ? null : id
}
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
          initial-x="30%"
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
          initial-x="50%"
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
          initial-x="75%"
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
    <section id="estimation" class="py-20 gradient-bg">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
            Estimation gratuite de votre montre
          </h2>
          <p class="text-xl text-gray-600">
            Remplissez ce formulaire pour recevoir une estimation personnalisée
          </p>
        </div>
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <form class="space-y-6" id="form-estimation" @submit="submitEstimationForm">
            <div class="grid md:grid gap-6">
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="name"
                  >Prénom NOM *</label
                >
                <input
                  name="name"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="email"
                  >Email *</label
                >
                <input
                  name="email"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="tel"
                  >Téléphone</label
                >
                <input
                  name="tel"
                  type="tel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div class="grid md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="brand"
                  >Marque *</label
                >
                <input
                  name="brand"
                  type="text"
                  placeholder="Ex: Rolex, Patek Philippe..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="model"
                  >Modèle</label
                >
                <input
                  name="model"
                  type="text"
                  placeholder="Ex: Submariner, Nautilus..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="year"
                  >Année</label
                >
                <input
                  name="year"
                  type="number"
                  min="1900"
                  max="2099"
                  step="1"
                  placeholder="2020"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
            <!-- Numéro de série -->
            <div>
              <div class="flex align-center">
                <label
                  class="block text-sm font-medium text-text-main mb-2"
                  title="Le numéro de série sera examiné pour garantir l'authenticité de la montre"
                  for="serie"
                  >Numéro de série</label
                >
                <TooltipInfo
                  tooltip-text="Renseigner le numéro de série nous permettra de garantir l'authenticité de la montre"
                />
              </div>
              <input
                name="serie"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <!-- État de possession -->
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="possession"
                >État de possession *</label
              >
              <select
                name="possession"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="Full set (boîte + papiers)">Full set (boîte + papiers)</option>
                <option value="Papiers d'origine">Papiers d'origine</option>
                <option value="Boîte d'origine">Boîte d'origine</option>
                <option value="Montre seule">Montre seule</option>
              </select>
            </div>
            <!-- Etat général  -->
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="etat"
                >État général *</label
              >
              <select
                name="etat"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="Neuf/jamaus portée">Neuf/jamais portée</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
                <option value="Usage courant">Usage courant</option>
              </select>
            </div>
            <!-- Photos -->
            <div>
              <div class="flex align-center">
                <label class="block text-sm font-medium text-text-main mb-2"
                  >Photos de votre montre</label
                >
                <TooltipInfo
                  tooltip-text="Un maximum de photos nous permettra d'estimer au mieux votre montre"
                />
              </div>
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors"
              >
                <input
                  name="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  id="photos"
                />
                <label for="photos" class="cursor-pointer">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400 mb-4"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-primary font-medium">Cliquez pour ajouter des photos</span>
                  <p class="text-gray-500 text-sm mt-1">PNG, JPG jusqu'à 10MB</p>
                </label>
              </div>
              <div id="preview-photos-container"></div>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2"
                >Message (optionnel)</label
              >
              <textarea
                rows="4"
                placeholder="Précisez si vous êtes le premier propriétaire de la montre, son histoire..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              ></textarea>
            </div>
            <p class="text-sm text-gray-600 mb-4 italic">
              * Les champs marqués d'un astérisque sont obligatoires
            </p>
            <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
              {{ errorMessage }}
            </div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-primary text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Envoi en cours...' : 'Faire estimer ma montre' }}
            </button>
          </form>
        </div>
      </div>
    </section>

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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
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
    <section id="temoignages" class="py-20 bg-white">
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

    <!-- Dernières ventes -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
            Dernières ventes réalisées
          </h2>
          <p class="text-xl text-gray-600">Voici quelques montres récemment vendues</p>
        </div>
        <div class="overflow-x-auto hide-scrollbar scroll-smooth p-8" id="sales-carousel">
          <div class="flex space-x-6 min-w-full">
            <!-- Slide 1 -->
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 -z-1"
            >
              <img
                src="../assets/sales/IMG_6983.jpg"
                alt="Rolex Submariner"
                class="rounded-lg mb-4 mx-auto h-48 w-96 object-contain"
              />
              <h4 class="text-lg font-semibold text-text-main">Rolex Submariner</h4>
            </div>
            <!-- Slide 2 -->
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 -z-1"
            >
              <img
                src="https://placehold.co/200x200"
                alt="Omega Speedmaster"
                class="rounded-lg mb-4 mx-auto h-48 w-96 object-contain"
              />
              <h4 class="text-lg font-semibold text-text-main">Omega Speedmaster</h4>
            </div>
            <!-- Slide 3 -->
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 -z-1"
            >
              <img
                src="https://placehold.co/200x200"
                alt="Patek Nautilus"
                class="rounded-lg mb-4 mx-auto"
              />
              <h4 class="text-lg font-semibold text-text-main">Patek Philippe Nautilus</h4>
            </div>
            <!-- Slide 4 -->
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 -z-1"
            >
              <img
                src="https://placehold.co/200x200"
                alt="Cartier Santos"
                class="rounded-lg mb-4 mx-auto"
              />
              <h4 class="text-lg font-semibold text-text-main">Cartier Santos</h4>
            </div>
            <!-- Slide 5 -->
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 -z-1"
            >
              <img
                src="https://placehold.co/200x200"
                alt="Breitling Navitimer"
                class="rounded-lg mb-4 mx-auto"
              />
              <h4 class="text-lg font-semibold text-text-main">Breitling Navitimer</h4>
            </div>
            <!-- Slide 6 -->
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 -z-1"
            >
              <img
                src="https://placehold.co/200x200"
                alt="Audemars Royal Oak"
                class="rounded-lg mb-4 mx-auto"
              />
              <h4 class="text-lg font-semibold text-text-main">Audemars Piguet Royal Oak</h4>
            </div>
            <!-- Slide 7 -->
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 -z-1"
            >
              <img
                src="https://placehold.co/200x200"
                alt="TAG Heuer Carrera"
                class="rounded-lg mb-4 mx-auto"
              />
              <h4 class="text-lg font-semibold text-text-main">TAG Heuer Carrera</h4>
            </div>
            <!-- Slide 8 -->
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 -z-1"
            >
              <img
                src="https://placehold.co/200x200"
                alt="Jaeger-LeCoultre Reverso"
                class="rounded-lg mb-4 mx-auto"
              />
              <h4 class="text-lg font-semibold text-text-main">Jaeger-LeCoultre Reverso</h4>
            </div>
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

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <a href="#estimation" class="text-primary font-semibold hover:underline">
              Voir nos offres
            </a>
          </div>

          <!-- Dépôt-vente -->
          <div class="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
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
          </div>

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

    <!-- FAQ -->
    <section id="faq" class="py-20 gradient-bg">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">Questions fréquentes</h2>
          <p class="text-xl text-gray-600">Vos questions les plus fréquentes</p>
        </div>
        <div class="space-y-2">
          <div v-for="item in faqItems" :key="item.id" class="bg-white rounded-2xl shadow-sm">
            <button
              class="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset faq-button"
              @click="toggleFaq(item.id)"
            >
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">{{ item.question }}</h3>
                <svg
                  class="h-5 w-5 transform transition-transform duration-300"
                  :class="{ 'rotate-180': activeFaqId === item.id }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            <div
              class="faq-content overflow-hidden transition-all duration-300 ease-in-out"
              :class="{
                'max-h-0': activeFaqId !== item.id,
                'max-h-[500px]': activeFaqId === item.id,
              }"
            >
              <div class="px-6 pb-6" v-html="item.answer"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

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
                :href="'https://wa.me/' + whatsapp"
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
.faq-content {
  transition: max-height 0.3s ease-in-out;
}

.faq-button {
  transition: background-color 0.2s ease-in-out;
}

.faq-button:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
