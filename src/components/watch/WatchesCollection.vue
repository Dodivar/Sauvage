<template>
  <section class="py-10 gradient-bg min-h-screen">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-text-main mb-3">Notre collection de montres</h1>
<!--         <p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
          Découvrez notre sélection exclusive de montres de prestige en dépôt-vente, authentifiées
          et garanties par nos experts horlogers
        </p> -->
      </div>

      <!-- Filters Bar -->
      <div class="bg-white rounded-md shadow-lg p-6 mb-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap gap-4">
            <select
              v-model="selectedBrand"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Toutes les marques</option>
              <option v-for="brand in availableBrands" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>

            <select
              v-model="priceRange"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Tous les prix</option>
              <option value="0-500">Moins de 500 €</option>
              <option value="500-2000">500 € - 2 000 €</option>
              <option value="2000-5000">2 000 € - 5 000 €</option>
              <option value="5000+">Plus de 5 000 €</option>
            </select>
          </div>

          <div class="text-sm text-gray-600 font-light">
            {{ filteredWatches.length }} montre{{
              filteredWatches.length > 1 ? 's' : ''
            }}
            disponible{{ filteredWatches.length > 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-3"></div>
        <p class="text-gray-600">Chargement des montres...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-10">
        <div class="text-red-500 mb-3">
          <svg class="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-xl text-gray-900 mb-2">Erreur de chargement</h3>
        <p class="text-gray-600 mb-3">{{ error }}</p>
        <button
          @click="loadWatches"
          class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Réessayer
        </button>
      </div>

      <!-- Watches Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8">
        <WatchCard
          v-for="watch in filteredWatches"
          :key="watch.id"
          :watch="watch"
          @viewDetails="handleViewDetails"
          class="animate-fade-in"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && !error && filteredWatches.length === 0" class="text-center py-10">
        <div class="text-gray-400 mb-3">
          <svg class="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-xl text-gray-600 mb-2">Aucune montre trouvée</h3>
        <p class="text-gray-500">Essayez de modifier vos critères de recherche</p>
      </div>

      <!-- Contact Section -->
      <div class="bg-white rounded-md shadow-lg p-8 text-center">
        <h2 class="text-2xl font-semibold text-text-main mb-4">Une montre vous intéresse ?</h2>
        <p class="text-lg text-gray-600 mb-6 font-light">
          Contactez-nous pour plus d'informations ou pour organiser une visite
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a
            :href="'https://wa.me/' + WHATSAPP_NUMBER"
            target="_blank"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
              />
            </svg>
            Contact WhatsApp
          </a>
          <a
            :href="'mailto:' + EMAIL_CONTACT"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact Email
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
const router = useRouter()

import WatchCard from './WatchCard.vue'
import { scrollAnimation } from '@/animation'
import { WHATSAPP_NUMBER, EMAIL_CONTACT, BASE_URL } from '@/config'
import { getAllWatches } from '@/services/watchService'

// SEO Meta Tags
useHead({
  title: 'Collection de Montres de Luxe | Sauvage',
  meta: [
    {
      name: 'description',
      content: 'Découvrez notre collection complète de montres de luxe. Rolex, Breitling, Tag Heuer, Cartier et plus. Toutes nos montres sont garanties 1 an et authentifiées.',
    },
    {
      property: 'og:title',
      content: 'Collection de Montres de Luxe | Sauvage',
    },
    {
      property: 'og:description',
      content: 'Découvrez notre collection complète de montres de luxe garanties 1 an et authentifiées.',
    },
    {
      property: 'og:url',
        content: `${BASE_URL}/collection`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:title',
      content: 'Collection de Montres de Luxe | Sauvage',
    },
    {
      name: 'twitter:description',
      content: 'Découvrez notre collection complète de montres de luxe garanties 1 an.',
    },
  ],
  link: [
    {
      rel: 'canonical',
        href: `${BASE_URL}/collection`,
    },
  ],
})

// Filters
const selectedBrand = ref('')
const priceRange = ref('')

// State
const watches = ref([])
const isLoading = ref(true)
const error = ref(null)

// Navigation method
const handleViewDetails = (watchId) => {
  router.push(`/watch/${watchId}`)
}

// Computed properties
const availableBrands = computed(() => {
  const brands = [...new Set(watches.value.map((watch) => watch.brand))]
  return brands.sort()
})

const filteredWatches = computed(() => {
  let filtered = watches.value

  // Filter by brand
  if (selectedBrand.value) {
    filtered = filtered.filter((watch) => watch.brand === selectedBrand.value)
  }

  // Filter by price range
  if (priceRange.value) {
    const [min, max] = priceRange.value.split('-').map((x) => x.replace('+', ''))
    filtered = filtered.filter((watch) => {
      if (max) {
        return watch.price >= parseInt(min) && watch.price <= parseInt(max)
      } else {
        return watch.price >= parseInt(min)
      }
    })
  }

  return filtered
})

// Load watches from Supabase
const loadWatches = async () => {
  try {
    isLoading.value = true
    error.value = null
    const data = await getAllWatches()
    watches.value = data
  } catch (err) {
    console.error('Erreur lors du chargement des montres:', err)
    error.value = err.message || 'Une erreur est survenue lors du chargement des montres'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadWatches()
  scrollAnimation()
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.gradient-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
</style>
