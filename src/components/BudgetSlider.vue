<script setup>
import { ref, watch } from 'vue'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 15000 },
  modelValue: { type: Array, default: () => [0, 15000] },
})
const emit = defineEmits(['update:modelValue'])

const range = ref([...props.modelValue])

watch(
  () => props.modelValue,
  (val) => {
    if (val[0] !== range.value[0] || val[1] !== range.value[1]) {
      range.value = [...val]
    }
  },
)

watch(range, (val) => {
  emit('update:modelValue', val)
})

const updateRangeFromInput = () => {
  // Ensure min <= max
  if (range.value[0] > range.value[1]) {
    range.value[0] = range.value[1]
  }
  // Clamp values
  range.value[0] = Math.max(props.min, Math.min(props.max, range.value[0]))
  range.value[1] = Math.max(props.min, Math.min(props.max, range.value[1]))
}
</script>

<template>
  <div class="w-full flex flex-col">
    <!-- Price Slider -->
    <div class="mb-4 mx-2">
      <div class="mb-4">
        <Slider
          v-model="range"
          :min="min"
          :max="max"
          :step="100"
          :tooltips="true"
          :format="{ suffix: ' €', decimals: 0, thousand: ' ' }"
          class="w-full"
        />
      </div>
      <div class="flex justify-between text-xs text-gray-500">
        <span>{{ min.toLocaleString() }} €</span>
        <span>{{ max.toLocaleString() }} €</span>
      </div>
    </div>

    <!-- Manual Input Fields -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-text-main mb-2">Budget minimum</label>
        <div class="relative">
          <input
            v-model.number="range[0]"
            type="number"
            :min="min"
            :max="max"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            @input="updateRangeFromInput"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-text-main mb-2">Budget maximum</label>
        <div class="relative">
          <input
            v-model.number="range[1]"
            type="number"
            :min="min"
            :max="max"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            @input="updateRangeFromInput"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Responsive: le slider prend toute la largeur sur mobile */
@media (max-width: 640px) {
  .w-full {
    min-width: 0;
    width: 100% !important;
  }
}

/* Custom slider styles */
:deep(.slider-connect) {
  background: #00c172;
}

:deep(.slider-handle) {
  background: #00c172;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.slider-handle:hover) {
  background: #00a85f;
}

:deep(.slider-tooltip) {
  background: #00c172;
  border: none;
  color: white;
}

:deep(.slider-tooltip::before) {
  border-top-color: #00c172;
}
</style>
