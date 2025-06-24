<script setup>
import { ref, watch } from 'vue'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

const props = defineProps({
  min: { type: Number, default: 1500 },
  max: { type: Number, default: 15000 },
  modelValue: { type: Array, default: () => [1500, 15000] },
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
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div class="flex justify-between w-full text-sm mb-2">
      <!--
      <span>{{ range[0] == min ? '- ' : '' }}{{ range[0].toLocaleString() }} €</span>
      <span>{{ range[1] == max ? '+ ' : '' }}{{ range[1].toLocaleString() }} €</span>
      -->
    </div>
    <Slider
      v-model="range"
      :min="min"
      :max="max"
      :step="100"
      :tooltips="true"
      :merge="200"
      :format="{ suffix: ' €', decimals: 0, thousand: ' ' }"
      class="w-full"
    />
    <div class="flex justify-between w-full text-xs mt-1 text-gray-400">
      <span>- {{ min.toLocaleString() }} €</span>
      <span>+ {{ max.toLocaleString() }} €</span>
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
</style>
