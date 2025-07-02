<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
          Dernières ventes réalisées
        </h2>
        <p class="text-xl text-gray-600">Voici quelques montres récemment vendues</p>
      </div>
      <div class="overflow-x-auto hide-scrollbar scroll-smooth p-8">
        <div class="flex space-x-6 min-w-full">
          <template v-for="(watch, i) in salesWatches" :key="`${i}-${watch.name}`">
            <div
              class="flex-shrink-0 w-80 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 -z-1"
            >
              <img
                :src="watch.img"
                :alt="watch.alt"
                class="rounded-lg mb-4 mx-auto h-64 w-full object-cover"
              />
              <h4 class="text-lg font-semibold text-text-main">{{ watch.name }}</h4>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import imgRolexSubmariner from '@/assets/sales/IMG_6983.jpg'
import imgRolexDatejust from '@/assets/sales/Rolex Datejust 16013 - 1980.jpg'
import imgWatch1 from '@/assets/sales/C9C8F604-6B20-46BC-8488-C94581F41B99.jpg'
import imgWatch2 from '@/assets/sales/92771C4F-12CC-4C8F-B236-2F2B25515FAB.jpg'
import imgWatch3 from '@/assets/sales/BF4FEA3A-4ACB-4EB6-92BA-CD335590273C.jpg'
import imgWatch4 from '@/assets/sales/D12C83C4-1C7B-4FDE-883A-23733E089260.jpg'
import imgTudorBlackBay58 from '@/assets/sales/Tudor Black Bay 58.jpg'
import imgTagHeuerMonaco from '@/assets/sales/Tag Heuer Monaco Steeve McQueen.jpg'
import imgTudorBlackBay41 from '@/assets/sales/Tudor Black Bay 41.jpg'

const salesWatches = [
  {
    img: imgRolexSubmariner,
    alt: 'Rolex Submariner',
    name: 'Rolex Submariner',
  },
  {
    img: imgRolexDatejust,
    alt: 'Omega Speedmaster',
    name: 'Omega Speedmaster',
  },
  {
    img: imgWatch1,
    alt: 'Patek Nautilus',
    name: 'Patek Philippe Nautilus',
  },
  {
    img: imgWatch2,
    alt: 'Cartier Santos',
    name: 'Cartier Santos',
  },
  {
    img: imgWatch4,
    alt: 'Audemars Royal Oak',
    name: 'Audemars Piguet Royal Oak',
  },
  {
    img: imgWatch3,
    alt: 'Breitling Navitimer',
    name: 'Breitling Navitimer',
  },
  {
    img: imgTagHeuerMonaco,
    alt: 'Jaeger-LeCoultre Reverso',
    name: 'Jaeger-LeCoultre Reverso',
  },
  {
    img: imgTudorBlackBay41,
    alt: 'Tudor Black Bay 41',
    name: 'Tudor Black Bay 41',
  },
  {
    img: imgTudorBlackBay58,
    alt: 'TAG Heuer Carrera',
    name: 'TAG Heuer Carrera',
  },
]
</script>
