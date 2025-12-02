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

      <!-- Success Message -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Paiement réussi !</h1>
      <p class="text-lg text-gray-600 mb-6">
        Merci pour votre achat. Votre commande a été confirmée avec succès.
      </p>

      <!-- Order Details -->
      <div v-if="sessionId || watchId" class="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Détails de la commande</h2>
        <div class="space-y-2 text-left">
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
          détails de votre commande. Notre équipe vous contactera sous peu pour finaliser la
          livraison.
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

const route = useRoute()
const sessionId = ref(null)
const watchId = ref(null)

onMounted(() => {
  // Récupérer les paramètres de l'URL
  sessionId.value = route.query.session_id || null
  watchId.value = route.query.watch_id || null
})
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
</style>


