<template>
  <div
    class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <!-- Image Slider -->
    <div class="relative h-48 md:h-64 lg:h-80 bg-gray-100">
      <div
        class="absolute inset-0 flex items-center justify-center"
        v-if="!watch.images || watch.images.length === 0"
      >
        <div class="text-gray-400 text-lg">Image non disponible</div>
      </div>

      <div 
        v-else 
        class="relative h-full"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <img
          :src="watch.images[currentImageIndex]"
          :alt="watch.name"
          class="w-full h-full object-cover object-center"
        />

        <!-- Navigation arrows -->
        <button
          v-if="watch.images && watch.images.length > 1"
          @click.stop="previousImage"
          class="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 md:p-2 transition-all duration-200"
        >
          <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          @click.stop="nextImage"
          class="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 md:p-2 transition-all duration-200"
        >
          <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            @click="currentImageIndex = index"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-200',
              currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50',
            ]"
          ></button>
        </div>
      </div>
    </div>

    <!-- Watch Info -->
    <div class="p-3 md:p-4 lg:p-6 cursor-pointer" @click="$emit('viewDetails', watch.id)">
      <div class="flex items-start justify-between mb-1 md:mb-2">
        <h3 class="text-sm md:text-base lg:text-xl font-semibold text-gray-900 leading-tight flex-1 pr-1">
          {{ watch.name }}
        </h3>
        <span
          v-if="watch.isSold"
          class="ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 md:py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 whitespace-nowrap flex-shrink-0"
        >
          Vendue
        </span>
      </div>

      <p class="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 font-light">Réf. {{ watch.reference }}</p>

      <div class="flex items-center justify-between gap-2">
        <div class="text-base md:text-xl lg:text-2xl font-normal text-primary">
          {{ formatPrice(watch.price) }}
        </div>

        <button
          @click.stop="$emit('viewDetails', watch.id)"
          class="bg-primary hover:bg-green-700 text-white px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 rounded-lg text-xs md:text-sm lg:text-base font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0"
        >
          Voir le détail
        </button>
      </div>

      <!-- Optional: Watch content or year -->
      <div class="mt-2 md:mt-4 flex items-center justify-between text-xs md:text-sm text-gray-500">
        <span v-if="watch.year">{{ watch.year }}</span>
        <span v-if="watch.contenu || watch.details?.content" class="bg-gray-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs">
          {{ watch.contenu || watch.details?.content }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  watch: {
    type: Object,
    required: true,
  },
})

// Define emits for parent component communication
const emit = defineEmits(['viewDetails'])

const currentImageIndex = ref(0)

const nextImage = () => {
  if (props.watch.images && props.watch.images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.watch.images.length
  }
}

const previousImage = () => {
  if (props.watch.images && props.watch.images.length > 1) {
    currentImageIndex.value =
      currentImageIndex.value === 0 ? props.watch.images.length - 1 : currentImageIndex.value - 1
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price)
}

// Touch/swipe support
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextImage()
    } else {
      previousImage()
    }
  }
}
</script>
