<template>
  <section v-if="isLoading || latestWatches.length > 0" class="py-12 bg-white">
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
          <!-- Loading State with Skeletons -->
          <template v-if="isLoading">
            <div
              v-for="n in 5"
              :key="`skeleton-${n}`"
              class="flex-shrink-0 w-40 sm:w-64 md:w-80"
            >
              <WatchCardSkeleton />
            </div>
          </template>
          <!-- Loaded Watches -->
          <template v-else v-for="(watch, i) in latestWatches" :key="`${i}-${watch.id || watch.name}`">
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
import WatchCardSkeleton from '@/components/watch/WatchCardSkeleton.vue'

const router = useRouter()
const latestWatches = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    isLoading.value = true
    const watches = await getLatestAvailableWatches(7)
    latestWatches.value = watches
  } catch (error) {
    console.error('Erreur lors du chargement des nouvelles montres:', error)
    latestWatches.value = []
  } finally {
    isLoading.value = false
  }
})

const handleViewDetails = (watchId) => {
  router.push(`/watch/${watchId}`)
}
</script>

