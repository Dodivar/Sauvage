<template>
  <section class="min-h-screen gradient-bg flex items-center justify-center py-12 px-4">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
      <!-- Success Icon -->
      <div class="mb-6">
        <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            class="w-12 h-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <!-- Admin Badge -->
      <div v-if="isAdmin" class="mb-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Mode Admin
        </span>
      </div>

      <!-- Success Message -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Paiement réussi !</h1>
      <p class="text-lg text-gray-600 mb-6">
        Merci pour votre achat. Votre commande a été confirmée avec succès.
      </p>

      <!-- Watch Image - Loading State -->
      <div v-if="isLoadingWatch" class="mb-6">
        <div class="bg-gray-50 rounded-lg p-6 animate-pulse">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="w-full sm:w-64 h-64 bg-gray-200 rounded-lg"></div>
            <div class="flex-1 w-full space-y-3">
              <div class="h-6 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Watch Image - Display -->
      <div v-else-if="watch && watch.images && watch.images.length > 0" class="mb-6">
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-green-100 shadow-lg">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 text-center">Votre montre</h2>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <!-- Image Container -->
            <div class="w-full sm:w-64 h-64 bg-white rounded-xl overflow-hidden shadow-xl flex-shrink-0 ring-2 ring-green-200">
              <img
                :src="watch.images[0]"
                :alt="watch.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            <!-- Watch Details -->
            <div class="flex-1 text-left w-full">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ watch.name }}</h3>
              <p v-if="watch.reference" class="text-lg font-semibold text-primary mb-3">
                Réf. {{ watch.reference }}
              </p>
              <div class="space-y-2">
                <p v-if="watch.brand" class="text-gray-700">
                  <span class="font-semibold text-gray-900">Marque :</span> {{ watch.brand }}
                </p>
                <p v-if="watch.model" class="text-gray-700">
                  <span class="font-semibold text-gray-900">Modèle :</span> {{ watch.model }}
                </p>
                <p v-if="watch.price" class="text-lg font-bold text-primary mt-3">
                  {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(watch.price) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Watch Image - Error State -->
      <div v-else-if="watchError" class="mb-6">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-sm text-yellow-800">
            <strong>Note :</strong> Impossible de charger les détails de la montre. Les informations de commande restent valides.
          </p>
        </div>
      </div>

      <!-- Order Details -->
      <div v-if="sessionId || watchId || watch" class="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Détails de la commande</h2>
        <div class="space-y-3 text-left">
          <div v-if="watch && watch.name" class="pb-3 border-b border-gray-200">
            <span class="text-gray-600 block mb-1">Nom de la montre :</span>
            <span class="font-semibold text-lg text-gray-900">{{ watch.name }}</span>
          </div>
          <div v-if="watch && watch.reference" class="pb-3 border-b border-gray-200">
            <span class="text-gray-600 block mb-1">Référence :</span>
            <span class="font-medium text-gray-900">{{ watch.reference }}</span>
          </div>
          <div v-if="sessionId" class="flex justify-between">
            <span class="text-gray-600">Numéro de commande :</span>
            <span class="font-medium text-gray-900">{{ sessionId.substring(0, 20) }}...</span>
          </div>
          <div v-if="watchId" class="flex justify-between">
            <span class="text-gray-600">ID de la montre :</span>
            <span class="font-medium text-gray-900">{{ watchId }}</span>
          </div>
        </div>
      </div>

      <!-- Information -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p class="text-sm text-blue-800">
          <strong>Prochaines étapes :</strong> Vous recevrez un email de confirmation avec tous les
          détails de votre commande. Notre équipe finalisera sous peu la livraison.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/collection"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Voir notre collection
        </router-link>
        <router-link
          to="/"
          class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getWatchById } from '@/services/watchService'
import { isAdminAuthenticated } from '@/services/admin/adminAuthService'

const route = useRoute()
const sessionId = ref(null)
const watchId = ref(null)
const watch = ref(null)
const isLoadingWatch = ref(false)
const watchError = ref(null)
const isAdmin = ref(false)

onMounted(async () => {
  // Vérifier si l'utilisateur est admin
  isAdmin.value = await isAdminAuthenticated()

  // Récupérer les paramètres de l'URL
  sessionId.value = route.query.session_id || null
  watchId.value = route.query.watch_id || null

  // Récupérer les données de la montre si watchId est présent
  if (watchId.value) {
    await loadWatch()
  }
})

async function loadWatch() {
  if (!watchId.value) return

  isLoadingWatch.value = true
  watchError.value = null

  try {
    // Utiliser allowUnavailable = true car la montre vient d'être achetée
    const watchData = await getWatchById(watchId.value, true)
    watch.value = watchData
  } catch (error) {
    console.error('Erreur lors du chargement de la montre:', error)
    watchError.value = error.message || 'Erreur lors du chargement de la montre'
  } finally {
    isLoadingWatch.value = false
  }
}

function handleImageError(event) {
  console.error('Erreur lors du chargement de l\'image:', event)
  // Optionnel : masquer l'image en cas d'erreur
  if (event.target) {
    event.target.style.display = 'none'
  }
}
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
</style>


