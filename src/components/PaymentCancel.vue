<template>
  <section class="min-h-screen gradient-bg flex items-center justify-center py-12 px-4">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
      <!-- Cancel Icon -->
      <div class="mb-6">
        <div class="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
          <svg
            class="w-12 h-12 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>

      <!-- Cancel Message -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Paiement annulé</h1>
      <p class="text-lg text-gray-600 mb-6">
        Votre paiement a été annulé. Aucun montant n'a été débité.
      </p>

      <!-- Information -->
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <p class="text-gray-700 mb-4">
          Si vous avez rencontré un problème lors du paiement ou si vous souhaitez finaliser votre
          achat, n'hésitez pas à nous contacter.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            :href="
              watchId
                ? 'https://wa.me/' +
                  WHATSAPP_NUMBER +
                  '?text=' +
                  encodeURIComponent(
                    `Bonjour, je souhaite finaliser l'achat de la montre (ID: ${watchId})`,
                  )
                : `https://wa.me/${WHATSAPP_NUMBER}`
            "
            target="_blank"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
              />
            </svg>
            Nous contacter sur WhatsApp
          </a>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          v-if="watchId"
          :to="`/watch/${watchId}`"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour à la montre
        </router-link>
        <router-link
          to="/collection"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
        >
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
import { WHATSAPP_NUMBER } from '@/config'

const route = useRoute()
const watchId = ref(null)

onMounted(() => {
  // Récupérer les paramètres de l'URL
  watchId.value = route.query.watch_id || null
})
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
</style>


