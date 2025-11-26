<template>
  <section v-if="latestWatches.length > 0" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
          Nouvelles arrivées
        </h2>
        <p class="text-xl text-gray-600">Découvrez nos dernières montres mises en stock</p>
      </div>
      <div 
        class="overflow-x-auto custom-scrollbar-carrousel scroll-smooth p-8 relative"
      >
        <div class="flex space-x-4 sm:space-x-5 md:space-x-6 min-w-full">
          <template v-for="(watch, i) in latestWatches" :key="`${i}-${watch.id || watch.name}`">
            <div
              class="flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <!-- Image Slider -->
              <div class="relative h-48 sm:h-56 md:h-60 lg:h-64 bg-gray-100">
                <div
                  class="absolute inset-0 flex items-center justify-center"
                  v-if="!watch.images || watch.images.length === 0"
                >
                  <div class="text-gray-400 text-lg">Image non disponible</div>
                </div>

                <div 
                  v-else 
                  class="relative h-full"
                  @touchstart="(e) => handleTouchStart(e, i)"
                  @touchend="(e) => handleTouchEnd(e, i)"
                >
                  <img
                    :src="watch.images[currentImageIndices[i]]"
                    :alt="watch.name"
                    class="w-full h-full object-cover object-center"
                  />

                  <!-- Navigation arrows -->
                  <button
                    v-if="watch.images && watch.images.length > 1"
                    @click="previousImage(i)"
                    class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 z-10"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    v-if="watch.images && watch.images.length > 1"
                    @click="nextImage(i)"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 z-10"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <!-- Image indicators -->
                  <div
                    v-if="watch.images && watch.images.length > 1"
                    class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1"
                  >
                    <button
                      v-for="(_, index) in watch.images"
                      :key="index"
                      @click="currentImageIndices[i] = index"
                      :class="[
                        'w-2 h-2 rounded-full transition-all duration-200',
                        currentImageIndices[i] === index ? 'bg-white' : 'bg-white bg-opacity-50',
                      ]"
                    ></button>
                  </div>
                </div>
              </div>

              <!-- Watch Info -->
              <div class="p-4 sm:p-5 md:p-6 cursor-pointer" @click="handleViewDetails(watch.id)">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="text-base sm:text-lg md:text-xl font-semibold text-gray-900 leading-tight flex-1">
                    {{ watch.name }}
                  </h3>
                  <span
                    v-if="watch.isSold"
                    class="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 whitespace-nowrap"
                  >
                    Vendue
                  </span>
                </div>

                <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 font-light">Réf. {{ watch.reference }}</p>

                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <div class="text-xl sm:text-2xl font-normal text-primary">
                    {{ formatPrice(watch.price) }}
                  </div>
                  <button
                    class="bg-primary hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200"
                  >
                    Voir le détail
                  </button>
                </div>

                <!-- Optional: Watch content or year -->
                <div class="mb-2 sm:mb-4 flex items-center justify-between text-xs sm:text-sm text-gray-500">
                  <span v-if="watch.year">{{ watch.year }}</span>
                  <span v-if="watch.contenu || watch.details?.content" class="bg-gray-100 px-2 py-1 rounded text-xs">
                    {{ watch.contenu || watch.details?.content }}
                  </span>
                </div>

              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLatestAvailableWatches } from '@/services/watchService'

const router = useRouter()
const latestWatches = ref([])
const currentImageIndices = ref({})

onMounted(async () => {
  try {
    const watches = await getLatestAvailableWatches(7)
    latestWatches.value = watches
    // Initialize image indices for each watch
    watches.forEach((watch, index) => {
      currentImageIndices.value[index] = 0
    })
  } catch (error) {
    console.error('Erreur lors du chargement des nouvelles montres:', error)
    latestWatches.value = []
  }
})

const nextImage = (watchIndex) => {
  const watch = latestWatches.value[watchIndex]
  if (watch && watch.images && watch.images.length > 1) {
    currentImageIndices.value[watchIndex] =
      (currentImageIndices.value[watchIndex] + 1) % watch.images.length
  }
}

const previousImage = (watchIndex) => {
  const watch = latestWatches.value[watchIndex]
  if (watch && watch.images && watch.images.length > 1) {
    currentImageIndices.value[watchIndex] =
      currentImageIndices.value[watchIndex] === 0
        ? watch.images.length - 1
        : currentImageIndices.value[watchIndex] - 1
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price)
}

const handleViewDetails = (watchId) => {
  router.push(`/watch/${watchId}`)
}

// Touch/swipe support for image navigation
const touchStartPositions = ref({})

const handleTouchStart = (e, watchIndex) => {
  touchStartPositions.value[watchIndex] = e.changedTouches[0].screenX
}

const handleTouchEnd = (e, watchIndex) => {
  if (!touchStartPositions.value[watchIndex]) return
  
  const touchEndX = e.changedTouches[0].screenX
  const touchStartX = touchStartPositions.value[watchIndex]
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextImage(watchIndex)
    } else {
      previousImage(watchIndex)
    }
  }
  
  delete touchStartPositions.value[watchIndex]
}
</script>

