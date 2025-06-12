<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
})

const imageRef = ref(null)
const isPressed = ref(false)
let animationFrame = null
let startTime = null

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
/*
const getDepthStyle = (depth) => {
  const blur = (depth - 1) * 2
  const scale = 1 - (depth - 1) * 0.1
  return {
    //filter: `blur(${blur}px)`,
    // transform: `scale(${scale})`,
  }
}*/

const animate = (timestamp) => {
  if (!startTime) startTime = timestamp
  const progress = (timestamp - startTime) / 1000 // Convert to seconds

  if (imageRef.value) {
    // Calculate floating animation
    const xOffset = Math.sin(progress * 0.5) * 15 // 15px max horizontal movement
    const yOffset = Math.sin(progress * 0.3) * 10 // 10px max vertical movement
    const rotation = Math.sin(progress * 0.2) * 30 // 3 degrees max rotation

    // Apply transform with current scroll position
    const scrollY = window.scrollY
    const translateY = scrollY * props.scrollSpeed

    imageRef.value.style.transform = `
      translate(${xOffset}px, ${yOffset + translateY}px)
      rotate(${rotation}deg)
      scale(${isPressed.value ? 0.95 : 1})
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
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <img
    ref="imageRef"
    :src="src"
    :alt="alt"
    :class="[
      'parallax-object absolute transition-transform duration-300 ease-out',
      getSizeClass(size),
    ]"
    :style="{
      left: initialX,
      top: initialY,
      //...getDepthStyle(depth),
    }"
    @mousedown="handlePress"
    @mouseup="handleRelease"
    @mouseleave="handleRelease"
    @touchstart="handlePress"
    @touchend="handleRelease"
  />
</template>

<style scoped>
.parallax-object {
  will-change: transform;
  transform-origin: center center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
