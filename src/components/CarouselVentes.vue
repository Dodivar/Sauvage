<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
          Dernières ventes réalisées
        </h2>
        <p class="text-xl text-gray-600">Voici quelques montres récemment vendues</p>
      </div>
      <div class="overflow-x-auto custom-scrollbar-carrousel scroll-smooth p-8 relative">
        <div class="flex space-x-6 min-w-full">
          <template v-for="(watch, i) in salesWatches" :key="`${i}-${watch.name}`">
            <div
              class="flex-shrink-0 w-60 bg-white rounded-xl shadow-md hover:shadow-lg p-4 text-center transition-all duration-300 hover:scale-105"
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
import imgRolexDatejust from '@/assets/sales/Rolex Datejust.jpg'
import imgBeritlingNavitimer1 from '@/assets/sales/Beritling Navitimer 1.jpg'
import imgBeritlingNavitimer2 from '@/assets/sales/Beritling Navitimer 2.jpg'
import imgRolexOyster from '@/assets/sales/Rolex Oyster.jpg'
import imgTudorBlackBay58 from '@/assets/sales/Tudor Black Bay 58.jpg'
import imgTagHeuerMonaco from '@/assets/sales/Tag Heuer Monaco Steeve McQueen.jpg'
import imgTudorBlackBay41 from '@/assets/sales/Tudor Black Bay 41.jpg'

const salesWatches = [
  {
    img: imgTudorBlackBay58,
    alt: 'Tudor Black Bay 58',
    name: 'Tudor Black Bay 58',
  },
  {
    img: imgRolexDatejust,
    alt: 'Rolex Datejust',
    name: 'Rolex Datejust',
  },
  {
    img: imgBeritlingNavitimer1,
    alt: 'Breitling Navitimer',
    name: 'Breitling Navitimer',
  },
  {
    img: imgRolexOyster,
    alt: 'Rolex Oyster',
    name: 'Rolex Oyster',
  },
  {
    img: imgBeritlingNavitimer2,
    alt: 'Breitling Navitimer',
    name: 'Breitling Navitimer',
  },
  {
    img: imgTagHeuerMonaco,
    alt: 'Tag Heuer Monaco',
    name: 'Tag Heuer Monaco',
  },
  {
    img: imgTudorBlackBay41,
    alt: 'Tudor Black Bay 41',
    name: 'Tudor Black Bay 41',
  },
  {
    img: imgTudorBlackBay58,
    alt: 'Tudor Black Bay 58',
    name: 'Tudor Black Bay 58',
  },
]
</script>
