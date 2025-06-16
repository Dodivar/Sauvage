<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  tooltipText: {
    type: String,
    required: true,
  },
})

const tooltipRef = ref(null)
const triggerRef = ref(null)

// Gérer le clic en dehors du tooltip
const handleClickOutside = (event) => {
  if (
    tooltipRef.value &&
    !tooltipRef.value.contains(event.target) &&
    triggerRef.value &&
    !triggerRef.value.contains(event.target)
  ) {
    const tooltip = tooltipRef.value
    tooltip.classList.remove('show')
    delete tooltip.dataset.clicked
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('touchstart', handleClickOutside)
  tooltipTriggers()
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('touchstart', handleClickOutside)
})

// Sélectionner tous les éléments avec la classe 'tooltip-trigger'
function tooltipTriggers() {
  const tooltipTriggers = document.querySelectorAll('.tooltip-trigger')

  tooltipTriggers.forEach((trigger) => {
    const tooltip = trigger.nextElementSibling
    const tooltipContent = tooltip.querySelector('.tooltip-content')

    // Fonction pour afficher le tooltip
    const showTooltip = () => {
      tooltip.classList.add('show')

      // Calculer la position optimale
      const triggerRect = trigger.getBoundingClientRect()
      const tooltipRect = tooltipContent.getBoundingClientRect()
      const viewportWidth = window.innerWidth

      // Réinitialiser les classes de position
      tooltip.classList.remove('tooltip-left', 'tooltip-right', 'tooltip-center')

      // Vérifier si le tooltip dépasse à droite
      if (triggerRect.left + tooltipRect.width > viewportWidth) {
        tooltip.classList.add('tooltip-right')
      }
      // Vérifier si le tooltip dépasse à gauche
      else if (triggerRect.left - tooltipRect.width < 0) {
        tooltip.classList.add('tooltip-left')
      }
      // Sinon centrer par rapport au trigger
      else {
        tooltip.classList.add('tooltip-center')
      }
    }

    // Fonction pour cacher le tooltip
    const hideTooltip = () => {
      tooltip.classList.remove('show')
      delete tooltip.dataset.clicked
    }

    // Gestionnaire d'événements pour le survol
    trigger.addEventListener('mouseenter', showTooltip)
    trigger.addEventListener('mouseleave', hideTooltip)

    // Gestionnaire d'événements pour le clic
    trigger.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (tooltip.classList.contains('show')) {
        hideTooltip()
      } else {
        showTooltip()
        tooltip.dataset.clicked = 'true'
      }
    })

    // Gestionnaire d'événements pour le toucher
    trigger.addEventListener('touchstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (tooltip.classList.contains('show')) {
        hideTooltip()
      } else {
        showTooltip()
        tooltip.dataset.clicked = 'true'
      }
    })

    // Gestionnaire pour le survol du tooltip lui-même
    tooltip.addEventListener('mouseenter', () => {
      if (tooltip.dataset.clicked) {
        tooltip.classList.add('show')
      }
    })

    tooltip.addEventListener('mouseleave', () => {
      if (tooltip.dataset.clicked) {
        hideTooltip()
      }
    })
  })
}
</script>

<template>
  <div class="relative ml-2">
    <i
      ref="triggerRef"
      class="fas fa-question-circle tooltip-trigger text-gray-400 hover:text-gray-600 cursor-help text-lg font-bold"
    ></i>
    <!-- Tooltip -->
    <div ref="tooltipRef" class="tooltip absolute bottom-full mb-2 z-10">
      <div
        class="tooltip-content bg-gray-800 text-white text-sm rounded-lg py-2 px-3 shadow-lg min-w-[350px] max-w-[450px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]"
      >
        {{ tooltipText }}
        <!-- Flèche du tooltip -->
        <div
          class="tooltip-arrow absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"
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

/* Positionnement du tooltip */
.tooltip-center {
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-center .tooltip-arrow {
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-right {
  right: 0;
}

.tooltip-right .tooltip-arrow {
  right: 1rem;
}

.tooltip-left {
  left: 0;
}

.tooltip-left .tooltip-arrow {
  left: 1rem;
}

/* Animation */
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

/* Responsive */
@media (max-width: 640px) {
  .tooltip-content {
    white-space: normal;
    word-wrap: break-word;
  }

  .tooltip-trigger {
    cursor: pointer;
  }

  .tooltip {
    position: fixed;
    bottom: auto;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 450px;
  }

  .tooltip.show {
    animation: slideUp 0.2s ease-out;
  }

  .tooltip-arrow {
    visibility: hidden;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
}
</style>
