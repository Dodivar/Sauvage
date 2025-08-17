<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  initialX: {
    type: String,
    default: '0%',
  },
  initialY: {
    type: String,
    default: '0%',
  },
  mobileInitialX: {
    type: String,
    default: null, // Si null, utilise initialX
  },
  mobileInitialY: {
    type: String,
    default: null, // Si null, utilise initialY
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
  },
  depth: {
    type: Number,
    default: 1, // 1-3, where 1 is closest and 3 is furthest
  },
  scrollSpeed: {
    type: Number,
    default: 0.5,
  },
  floatSpeed: {
    type: Number,
    default: 0.5, // Vitesse de l'animation de flottement horizontal
  },
  floatAmplitude: {
    type: Number,
    default: 15, // Amplitude maximale du mouvement horizontal en pixels
  },
  verticalSpeed: {
    type: Number,
    default: 0.3, // Vitesse de l'animation verticale
  },
  verticalAmplitude: {
    type: Number,
    default: 10, // Amplitude maximale du mouvement vertical en pixels
  },
  rotationSpeed: {
    type: Number,
    default: 0.2, // Vitesse de rotation
  },
  rotationAmplitude: {
    type: Number,
    default: 3, // Amplitude maximale de rotation en degrés
  },
  initialRotation: {
    type: Number,
    default: 0, // Rotation de base de l'image en degrés
  },
  scaleValue: {
    type: Number,
    default: 0.8, // Valeur de scale lors du clic
  },
})

const imageRef = ref(null)
const isPressed = ref(false)
let animationFrame = null
let startTime = null
const windowWidth = ref(window.innerWidth)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

const position = computed(() => ({
  left: windowWidth.value < 768 ? props.mobileInitialX || props.initialX : props.initialX,
  top: windowWidth.value < 768 ? props.mobileInitialY || props.initialY : props.initialY,
}))

const getSizeClass = (size) => {
  switch (size) {
    case 'small':
      return 'w-24 md:w-32 lg:w-40 xl:w-48'
    case 'large':
      return 'w-40 md:w-56 lg:w-72 xl:w-96'
    default:
      return 'w-32 md:w-40 lg:w-56 xl:w-80'
  }
}

const animate = (timestamp) => {
  if (!startTime) startTime = timestamp
  const progress = (timestamp - startTime) / 1000 // Convert to seconds

  if (imageRef.value) {
    // Calculate floating animation with custom values
    const xOffset = Math.sin(progress * props.floatSpeed) * props.floatAmplitude
    const yOffset = Math.sin(progress * props.verticalSpeed) * props.verticalAmplitude
    const rotation = Math.sin(progress * props.rotationSpeed) * props.rotationAmplitude

    // Apply transform with current scroll position
    const scrollY = window.scrollY
    const translateY = scrollY * props.scrollSpeed

    imageRef.value.style.transform = `
      translate(${xOffset}px, ${yOffset + translateY}px)
      rotate(${rotation + props.initialRotation}deg)
      scale(${isPressed.value ? props.scaleValue : 1})
    `
  }

  animationFrame = requestAnimationFrame(animate)
}

const handlePress = () => {
  isPressed.value = true
}

const handleRelease = () => {
  isPressed.value = false
}

onMounted(() => {
  animationFrame = requestAnimationFrame(animate)
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<template>
  <img
    ref="imageRef"
    :src="src"
    :alt="alt"
    :class="['absolute transition-transform duration-300 ease-out', getSizeClass(size)]"
    :style="position"
    @mousedown="handlePress"
    @mouseup="handleRelease"
    @mouseleave="handleRelease"
    @touchstart="handlePress"
    @touchend="handleRelease"
  />
</template>

<style scoped></style>
