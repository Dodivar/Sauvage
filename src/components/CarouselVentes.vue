<template>
  <section v-if="salesWatches.length > 0" class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-3">
        <h2 class="text-3xl lg:text-4xl font-bold text-text-main">
          Dernières ventes réalisées
        </h2>
        <p class="text-xl text-gray-600">Voici quelques montres récemment vendues</p>
      </div>
      <div class="overflow-x-auto custom-scrollbar-carrousel scroll-smooth p-4 sm:p-8 relative">
        <div class="flex space-x-4 sm:space-x-6 min-w-full">
          <template v-for="(watch, i) in salesWatches" :key="`${i}-${watch.id || watch.name}`">
            <div
              class="flex-shrink-0 w-40 sm:w-48 md:w-60 bg-white rounded-md shadow-md hover:shadow-lg p-3 sm:p-4 text-center transition-all duration-300"
            >
              <img
                v-if="watch.imageUrl"
                :src="watch.imageUrl"
                :alt="watch.name"
                class="rounded-lg mb-3 sm:mb-4 mx-auto h-40 sm:h-48 md:h-64 w-full object-cover"
              />
              <div
                v-else
                class="rounded-lg mb-3 sm:mb-4 mx-auto h-40 sm:h-48 md:h-64 w-full bg-gray-200 flex items-center justify-center"
              >
                <span class="text-gray-400 text-xs sm:text-sm">Pas d'image</span>
              </div>
              <h4 class="text-sm sm:text-base md:text-lg font-semibold text-text-main">{{ watch.name }}</h4>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSoldWatches } from '@/services/watchService'

const salesWatches = ref([])

onMounted(async () => {
  try {
    const watches = await getSoldWatches()
    salesWatches.value = watches
  } catch (error) {
    console.error('Erreur lors du chargement des montres vendues:', error)
    salesWatches.value = []
  }
})
</script>
