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
          <div
            v-for="(watch, i) in transformedWatches"
            :key="`${i}-${watch.id || watch.name}`"
            class="flex-shrink-0 w-40 sm:w-48 md:w-60"
          >
            <WatchCard
              :watch="watch"
              :show-reference="false"
              :show-sold-badge="false"
              :show-price="false"
              @viewDetails="handleViewDetails"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSoldWatches } from '@/services/watchService'
import WatchCard from '@/components/watch/WatchCard.vue'

const router = useRouter()
const salesWatches = ref([])

// Transformer les données pour correspondre au format attendu par WatchCard
const transformedWatches = computed(() => {
  return salesWatches.value.map((watch) => ({
    id: watch.id,
    name: watch.name,
    reference: watch.reference || '',
    price: watch.price || 0,
    isSold: true, // Toutes les montres dans ce carrousel sont vendues
    images: watch.imageUrl ? [watch.imageUrl] : [],
    contenu: watch.contenu || '',
    year: watch.year || null,
    details: {
      content: watch.details?.content || '',
    },
  }))
})

// Gérer la navigation vers la page de détail
const handleViewDetails = (watchId) => {
  router.push(`/watch/${watchId}`)
}

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
