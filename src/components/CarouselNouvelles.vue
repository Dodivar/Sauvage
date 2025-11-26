<template>
  <section v-if="latestWatches.length > 0" class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-3">
          Nouvelles arrivées
        </h2>
        <p class="text-xl text-gray-600">Découvrez nos dernières montres mises en stock</p>
      </div>
      <div 
        class="overflow-x-auto custom-scrollbar-carrousel scroll-smooth p-4 sm:p-8 relative"
      >
        <div class="flex items-stretch space-x-4 sm:space-x-6 min-w-full">
          <template v-for="(watch, i) in latestWatches" :key="`${i}-${watch.id || watch.name}`">
            <div class="flex-shrink-0 w-40 sm:w-64 md:w-80">
              <WatchCard 
                :watch="watch" 
                @viewDetails="handleViewDetails"
              />
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
import WatchCard from '@/components/watch/WatchCard.vue'

const router = useRouter()
const latestWatches = ref([])

onMounted(async () => {
  try {
    const watches = await getLatestAvailableWatches(7)
    latestWatches.value = watches
  } catch (error) {
    console.error('Erreur lors du chargement des nouvelles montres:', error)
    latestWatches.value = []
  }
})

const handleViewDetails = (watchId) => {
  router.push(`/watch/${watchId}`)
}
</script>

