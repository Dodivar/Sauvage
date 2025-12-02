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
            <button
              @click="openBrandModal"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors flex items-center gap-2"
            >
              <span>Marque</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <span v-if="selectedBrands.length > 0" class="text-primary font-semibold">
                ({{ selectedBrands.length === 1 ? selectedBrands[0] : selectedBrands.length + ' marques' }})
              </span>
            </button>

            <button
              @click="openPriceModal"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors flex items-center gap-2"
            >
              <span>Prix</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <span v-if="priceMin !== null || priceMax !== null" class="text-primary font-semibold">
                ({{ priceMin !== null ? priceMin.toLocaleString() + ' €' : '0 €' }} - {{ priceMax !== null ? priceMax.toLocaleString() + ' €' : '∞' }})
              </span>
            </button>

            <!-- Sort Dropdown -->
            <div class="relative">
              <select
                v-model="sortOrder"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors appearance-none bg-white pr-8 cursor-pointer"
              >
                <option value="recent">Ajout récent</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
              <svg
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div class="text-sm text-gray-600 font-light">
            {{ filteredWatches.length }} montre{{
              filteredWatches.length > 1 ? 's' : ''
            }}
            disponible{{ filteredWatches.length > 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <!-- Loading State with Skeletons -->
      <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8">
        <WatchCardSkeleton
          v-for="n in 8"
          :key="`skeleton-${n}`"
          :show-reference="true"
          :show-sold-badge="true"
          :show-price="true"
        />
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

    <!-- Price Filter Modal -->
    <Teleport to="body">
      <div
        v-if="isPriceModalOpen"
        class="modal-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click="closePriceModal"
        @keydown.esc="closePriceModal"
        tabindex="-1"
      >
        <div
          @click.stop
          class="modal-container bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 class="text-2xl font-bold text-text-main">Prix</h2>
            <button
              @click="closePriceModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Quick Price Buttons -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Prix les plus recherchés</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="quickPrice in quickPriceRanges"
                  :key="quickPrice.id"
                  @click="applyQuickPrice(quickPrice)"
                  :class="[
                    'px-4 py-2 rounded-lg border transition-colors',
                    isQuickPriceSelected(quickPrice)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                  ]"
                >
                  {{ quickPrice.label }}
                </button>
              </div>
            </div>

            <!-- Price Slider -->
            <div class="mt-12 mb-2 mx-4">
              <div class="mb-4">
                <Slider
                  v-model="tempPriceRange"
                  :min="priceMinLimit"
                  :max="priceMaxLimit"
                  :step="10"
                  :tooltips="true"
                  :format="{ suffix: ' €', decimals: 0, thousand: ' ' }"
                  class="w-full"
                />
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>{{ priceMinLimit.toLocaleString() }} €</span>
                <span>{{ priceMaxLimit.toLocaleString() }} €</span>
              </div>
            </div>

            <!-- Manual Input Fields -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Prix minimum</label>
                <div class="relative">
                  <input
                    v-model.number="tempPriceMinInput"
                    type="number"
                    :min="priceMinLimit"
                    :max="priceMaxLimit"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    @blur="updatePriceFromInput"
                  />
                  <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Prix maximum</label>
                <div class="relative">
                  <input
                    v-model.number="tempPriceMaxInput"
                    type="number"
                    :min="priceMinLimit"
                    :max="priceMaxLimit"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    @blur="updatePriceFromInput"
                  />
                  <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div class="text-sm text-gray-600">
              {{ getFilteredCountWithPrice() }} résultat{{ getFilteredCountWithPrice() > 1 ? 's' : '' }}
            </div>
            <button
              @click="applyPriceFilter"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Brand Filter Modal -->
    <Teleport to="body">
      <div
        v-if="isBrandModalOpen"
        class="modal-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click="closeBrandModal"
        @keydown.esc="closeBrandModal"
        tabindex="-1"
      >
        <div
          @click.stop
          class="modal-container bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 class="text-2xl font-bold text-text-main">Marque</h2>
            <button
              @click="closeBrandModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- All Brands -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Toutes les marques</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="brand in availableBrands"
                  :key="brand"
                  @click="toggleBrand(brand)"
                  :class="[
                    'px-4 py-2 rounded-lg border transition-colors',
                    tempSelectedBrands.includes(brand)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                  ]"
                >
                  {{ brand }}
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div class="text-sm text-gray-600">
              {{ getFilteredCountWithBrand() }} résultat{{ getFilteredCountWithBrand() > 1 ? 's' : '' }}
            </div>
            <button
              @click="applyBrandFilter"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'
const router = useRouter()

import WatchCard from './WatchCard.vue'
import WatchCardSkeleton from './WatchCardSkeleton.vue'
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
const selectedBrands = ref([])
const priceMin = ref(null)
const priceMax = ref(null)
const sortOrder = ref('recent') // Par défaut: ajout récent

// Modal states
const isPriceModalOpen = ref(false)
const isBrandModalOpen = ref(false)

// Temporary filter values (before applying)
const tempPriceRange = ref([0, 150000])
const tempSelectedBrands = ref([])
// Temporary values for manual price input fields (to allow typing without updating slider immediately)
const tempPriceMinInput = ref(0)
const tempPriceMaxInput = ref(150000)

// State
const watches = ref([])
const isLoading = ref(true)
const error = ref(null)

// Price limits computed from watches
const priceMinLimit = computed(() => {
  if (watches.value.length === 0) return 0
  return Math.min(...watches.value.map(w => w.price))
})

const priceMaxLimit = computed(() => {
  if (watches.value.length === 0) return 150000
  return Math.max(...watches.value.map(w => w.price))
})

// Helper function to round to nearest ten (dizaine supérieure)
const roundToTen = (value) => {
  return Math.ceil(value / 10) * 10
}

// Quick price ranges computed dynamically based on actual watch prices
const quickPriceRanges = computed(() => {
  if (watches.value.length === 0) {
    return []
  }

  const min = priceMinLimit.value
  const max = priceMaxLimit.value

  // Calculate the ranges
  const oneThirdMax = roundToTen(max / 3)
  const halfMax = roundToTen(max / 2)
  const quarterMax = roundToTen(max / 4)
  const threeQuarterMax = roundToTen((max * 3) / 4)

  return [
    {
      id: 'min-to-third',
      label: `jusqu'à ${oneThirdMax.toLocaleString()} €`,
      min: min,
      max: oneThirdMax,
    },
    {
      id: 'min-to-half',
      label: `jusqu'à ${halfMax.toLocaleString()} €`,
      min: min,
      max: halfMax,
    },
    {
      id: 'quarter-to-three-quarter',
      label: `${quarterMax.toLocaleString()} € - ${threeQuarterMax.toLocaleString()} €`,
      min: quarterMax,
      max: threeQuarterMax,
    },
    {
      id: 'half-to-max',
      label: `à partir de ${halfMax.toLocaleString()} €`,
      min: halfMax,
      max: max,
    },
  ]
})


// Modal functions
const openPriceModal = () => {
  const minValue = roundToTen(priceMin.value !== null ? priceMin.value : priceMinLimit.value)
  const maxValue = roundToTen(priceMax.value !== null ? priceMax.value : priceMaxLimit.value)
  tempPriceRange.value = [minValue, maxValue]
  tempPriceMinInput.value = minValue
  tempPriceMaxInput.value = maxValue
  isPriceModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closePriceModal = () => {
  isPriceModalOpen.value = false
  document.body.style.overflow = ''
}

const openBrandModal = () => {
  tempSelectedBrands.value = [...selectedBrands.value]
  isBrandModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeBrandModal = () => {
  isBrandModalOpen.value = false
  document.body.style.overflow = ''
}

// Price filter functions
const applyQuickPrice = (quickPrice) => {
  const maxValue = quickPrice.max !== null 
    ? Math.min(quickPrice.max, priceMaxLimit.value)
    : priceMaxLimit.value
  // Values are already rounded in quickPriceRanges, but ensure they're still rounded
  tempPriceRange.value = [
    roundToTen(Math.max(quickPrice.min, priceMinLimit.value)),
    roundToTen(maxValue)
  ]
}

const isQuickPriceSelected = (quickPrice) => {
  const expectedMax = quickPrice.max !== null 
    ? Math.min(quickPrice.max, priceMaxLimit.value)
    : priceMaxLimit.value
  const expectedMin = Math.max(quickPrice.min, priceMinLimit.value)
  return Math.abs(tempPriceRange.value[0] - expectedMin) < 10 &&
    Math.abs(tempPriceRange.value[1] - expectedMax) < 10
}

const updatePriceFromInput = () => {
  // Round to nearest ten (dizaine supérieure)
  let newMin = roundToTen(tempPriceMinInput.value)
  let newMax = roundToTen(tempPriceMaxInput.value)
  
  // Ensure min <= max
  if (newMin > newMax) {
    newMin = newMax
    tempPriceMinInput.value = newMin
  }
  // Clamp values
  newMin = Math.max(priceMinLimit.value, Math.min(priceMaxLimit.value, newMin))
  newMax = Math.max(priceMinLimit.value, Math.min(priceMaxLimit.value, newMax))
  
  // Update temp price range (which will trigger the watcher)
  tempPriceRange.value = [newMin, newMax]
  // Sync input values in case they were clamped
  tempPriceMinInput.value = newMin
  tempPriceMaxInput.value = newMax
}

const applyPriceFilter = () => {
  // Only set filters if they differ from the full range
  if (tempPriceRange.value[0] <= priceMinLimit.value && tempPriceRange.value[1] >= priceMaxLimit.value) {
    // Full range selected, clear filters
    priceMin.value = null
    priceMax.value = null
  } else {
    priceMin.value = tempPriceRange.value[0] === priceMinLimit.value ? null : tempPriceRange.value[0]
    priceMax.value = tempPriceRange.value[1] === priceMaxLimit.value ? null : tempPriceRange.value[1]
  }
  closePriceModal()
}

const getFilteredCountWithPrice = () => {
  let filtered = watches.value
  if (tempPriceRange.value[0] !== priceMinLimit.value || tempPriceRange.value[1] !== priceMaxLimit.value) {
    filtered = filtered.filter(watch => {
      return watch.price >= tempPriceRange.value[0] && watch.price <= tempPriceRange.value[1]
    })
  }
  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter(watch => selectedBrands.value.includes(watch.brand))
  }
  return filtered.length
}

// Brand filter functions
const toggleBrand = (brand) => {
  const index = tempSelectedBrands.value.indexOf(brand)
  if (index > -1) {
    // Remove brand if already selected
    tempSelectedBrands.value.splice(index, 1)
  } else {
    // Add brand if not selected
    tempSelectedBrands.value.push(brand)
  }
}

const applyBrandFilter = () => {
  selectedBrands.value = [...tempSelectedBrands.value]
  closeBrandModal()
}

const getFilteredCountWithBrand = () => {
  let filtered = watches.value
  if (tempSelectedBrands.value.length > 0) {
    filtered = filtered.filter(watch => tempSelectedBrands.value.includes(watch.brand))
  }
  if (priceMin.value !== null || priceMax.value !== null) {
    filtered = filtered.filter(watch => {
      const matchesMin = priceMin.value === null || watch.price >= priceMin.value
      const matchesMax = priceMax.value === null || watch.price <= priceMax.value
      return matchesMin && matchesMax
    })
  }
  return filtered.length
}

// Round slider values to nearest ten (dizaine supérieure) when they change
watch(tempPriceRange, (newValue, oldValue) => {
  // Skip if this is the initial value or if values haven't actually changed
  if (!oldValue || (newValue[0] === oldValue[0] && newValue[1] === oldValue[1])) {
    return
  }
  
  const roundedMin = roundToTen(newValue[0])
  const roundedMax = roundToTen(newValue[1])
  
  // Sync input values when slider changes
  tempPriceMinInput.value = roundedMin
  tempPriceMaxInput.value = roundedMax
  
  // Only update if values need rounding to avoid infinite loop
  if (roundedMin !== newValue[0] || roundedMax !== newValue[1]) {
    // Use nextTick to avoid triggering watcher during update
    const clampedMin = Math.max(priceMinLimit.value, Math.min(priceMaxLimit.value, roundedMin))
    const clampedMax = Math.max(priceMinLimit.value, Math.min(priceMaxLimit.value, roundedMax))
    
    // Only update if the rounded values are different from current
    if (clampedMin !== newValue[0] || clampedMax !== newValue[1]) {
      tempPriceRange.value = [clampedMin, clampedMax]
    }
  }
}, { deep: true })

// Update temp price range when limits change
watch([priceMinLimit, priceMaxLimit], () => {
  if (tempPriceRange.value[0] < priceMinLimit.value) {
    tempPriceRange.value[0] = roundToTen(priceMinLimit.value)
    tempPriceMinInput.value = tempPriceRange.value[0]
  }
  if (tempPriceRange.value[1] > priceMaxLimit.value) {
    tempPriceRange.value[1] = roundToTen(priceMaxLimit.value)
    tempPriceMaxInput.value = tempPriceRange.value[1]
  }
})

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

  // Filter by brand (multiple selection)
  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter((watch) => selectedBrands.value.includes(watch.brand))
  }

  // Filter by price range
  if (priceMin.value !== null || priceMax.value !== null) {
    filtered = filtered.filter((watch) => {
      const matchesMin = priceMin.value === null || watch.price >= priceMin.value
      const matchesMax = priceMax.value === null || watch.price <= priceMax.value
      return matchesMin && matchesMax
    })
  }

  // Apply sorting
  const sorted = [...filtered]
  switch (sortOrder.value) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'recent':
      // Tri par date de création décroissante (plus récentes en premier)
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        // Si pas de date, utiliser displayOrder comme fallback
        if (dateA === 0 && dateB === 0) {
          return (b.displayOrder || 0) - (a.displayOrder || 0)
        }
        return dateB - dateA
      })
      break
    default:
      // Par défaut, tri par ajout récent
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        if (dateA === 0 && dateB === 0) {
          return (b.displayOrder || 0) - (a.displayOrder || 0)
        }
        return dateB - dateA
      })
  }

  return sorted
})

// Load watches from Supabase
const loadWatches = async () => {
  try {
    isLoading.value = true
    error.value = null
    const data = await getAllWatches()
    watches.value = data
    // Initialize temp price range with actual limits after loading (rounded to ten)
    if (data.length > 0) {
      const minPrice = Math.min(...data.map(w => w.price))
      const maxPrice = Math.max(...data.map(w => w.price))
      const roundedMin = roundToTen(minPrice)
      const roundedMax = roundToTen(maxPrice)
      tempPriceRange.value = [roundedMin, roundedMax]
      tempPriceMinInput.value = roundedMin
      tempPriceMaxInput.value = roundedMax
    }
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

@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.gradient-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modal-overlay {
  animation: modal-fade-in 0.2s ease-out;
}

.modal-container {
  animation: modal-slide-up 0.3s ease-out;
}

/* Custom slider styles */
:deep(.slider-connect) {
  background: #00c172;
}

:deep(.slider-handle) {
  background: #00c172;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.slider-handle:hover) {
  background: #00a85f;
}

:deep(.slider-tooltip) {
  background: #00c172;
  border: none;
  color: white;
}

:deep(.slider-tooltip::before) {
  border-top-color: #00c172;
}
</style>
