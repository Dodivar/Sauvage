<script setup>
import { onMounted } from 'vue'

defineProps({
  tooltipText: {
    type: String,
    required: true,
  },
})

onMounted(() => {
  tooltipTriggers()
})

// Sélectionner tous les éléments avec la classe 'tooltip-trigger'
function tooltipTriggers() {
  const tooltipTriggers = document.querySelectorAll('.tooltip-trigger')

  tooltipTriggers.forEach((trigger) => {
    const tooltip = trigger.nextElementSibling

    // Afficher le tooltip au survol
    trigger.addEventListener('mouseenter', function () {
      tooltip.classList.add('show')
    })

    // Masquer le tooltip quand on quitte
    trigger.addEventListener('mouseleave', function () {
      tooltip.classList.remove('show')
    })
  })
}
</script>

<template>
  <div class="relative ml-2">
    <i
      class="fas fa-question-circle tooltip-trigger text-gray-400 hover:text-gray-600 cursor-help text-lg font-bold"
    ></i>
    <!-- Tooltip -->
    <div class="tooltip absolute bottom-full right-0 mb-2 z-10">
      <div class="bg-gray-800 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
        {{ tooltipText }}
        <!-- Flèche du tooltip -->
        <div
          class="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tooltip {
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s,
    visibility 0.2s;
}

.tooltip.show {
  opacity: 1;
  visibility: visible;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
