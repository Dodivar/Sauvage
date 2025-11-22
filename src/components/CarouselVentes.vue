<template>
  <section v-if="salesWatches.length > 0" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
          Dernières ventes réalisées
        </h2>
        <p class="text-xl text-gray-600">Voici quelques montres récemment vendues</p>
      </div>
      <div class="overflow-x-auto custom-scrollbar-carrousel scroll-smooth p-8 relative">
        <div class="flex space-x-6 min-w-full">
          <template v-for="(watch, i) in salesWatches" :key="`${i}-${watch.id || watch.name}`">
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 hover:scale-105"
            >
              <img
                v-if="watch.imageUrl"
                :src="watch.imageUrl"
                :alt="watch.name"
                class="rounded-lg mb-4 mx-auto h-64 w-full object-cover"
              />
              <div
                v-else
                class="rounded-lg mb-4 mx-auto h-64 w-full bg-gray-200 flex items-center justify-center"
              >
                <span class="text-gray-400 text-sm">Pas d'image</span>
              </div>
              <h4 class="text-lg font-semibold text-text-main">{{ watch.name }}</h4>
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
