<template>
  <section class="lg:py-10 pb-10 gradient-bg min-h-screen">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Main Section: Grid 2 columns -->
      <div class="grid lg:grid-cols-2 gap-8 mb-8">
        <!-- Images Section (Left Column) -->
        <div class="space-y-4 lg:space-y-4 -mx-4 lg:mx-0">
          <!-- Main Image Skeleton -->
          <div class="bg-white lg:rounded-md lg:shadow-lg overflow-hidden">
            <div class="relative h-96 lg:h-[500px] bg-gray-300 shimmer-bg"></div>
          </div>

          <!-- Thumbnail Gallery Skeleton (Desktop only) -->
          <div class="hidden lg:grid grid-cols-4 gap-2">
            <div
              v-for="n in 4"
              :key="n"
              class="h-20 bg-gray-300 rounded-lg shimmer-bg"
            ></div>
          </div>
        </div>

        <!-- Watch Info Section (Right Column) -->
        <div class="space-y-6 px-4 lg:px-0">
          <!-- Header Skeleton -->
          <div>
            <div class="flex items-start justify-between mb-2">
              <!-- Title Skeleton -->
              <div class="h-9 lg:h-10 bg-gray-300 rounded flex-1 pr-4 shimmer-bg" style="max-width: 75%;"></div>
              <!-- Badge Skeleton (optional) -->
              <div class="h-6 w-20 bg-gray-200 rounded-full flex-shrink-0 shimmer-bg"></div>
            </div>
            <!-- Reference Skeleton -->
            <div class="h-5 bg-gray-200 rounded mb-3 w-1/2 shimmer-bg"></div>
            <!-- Price Skeleton -->
            <div class="h-9 bg-gray-300 rounded mb-4 w-32 shimmer-bg"></div>
          </div>

          <!-- Key Features Skeleton -->
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Caractéristiques principales</h3>
            <div class="space-y-3">
              <div v-for="n in 4" :key="n" class="flex gap-4 py-2 border-b border-gray-100">
                <span class="h-5 bg-gray-200 rounded w-[140px] flex-shrink-0 shimmer-bg"></span>
                <span class="h-5 bg-gray-300 rounded flex-1 shimmer-bg"></span>
              </div>
            </div>
          </div>

          <!-- Contact Buttons Skeleton -->
          <div class="bg-white rounded-md shadow-lg p-6">
            <div class="h-6 bg-gray-300 rounded mb-3 w-2/3 shimmer-bg"></div>
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 h-12 bg-gray-300 rounded-lg shimmer-bg"></div>
              <div class="flex-1 h-12 bg-gray-300 rounded-lg shimmer-bg"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Specifications Skeleton -->
      <div class="bg-white rounded-md shadow-lg p-8 mb-8">
        <div class="h-8 bg-gray-300 rounded mb-6 w-64 shimmer-bg"></div>

        <div class="grid lg:grid-cols-2 gap-6">
          <!-- Basic Data Skeleton -->
          <div>
            <div class="h-6 bg-gray-300 rounded mb-3 w-40 border-b border-gray-200 pb-2 shimmer-bg"></div>
            <div class="space-y-3">
              <div v-for="n in 8" :key="n" class="flex gap-4 py-2 border-b border-gray-100">
                <span class="h-4 bg-gray-200 rounded min-w-[140px] flex-shrink-0 shimmer-bg"></span>
                <span class="h-4 bg-gray-300 rounded flex-1 shimmer-bg"></span>
              </div>
            </div>
          </div>

          <!-- Technical Specifications Skeleton -->
          <div>
            <div class="h-6 bg-gray-300 rounded mb-3 w-48 border-b border-gray-200 pb-2 shimmer-bg"></div>
            <div class="space-y-3">
              <div v-for="n in 8" :key="n" class="flex gap-4 py-2 border-b border-gray-100">
                <span class="h-4 bg-gray-200 rounded min-w-[140px] flex-shrink-0 shimmer-bg"></span>
                <span class="h-4 bg-gray-300 rounded flex-1 shimmer-bg"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Condition & Accessories Skeleton -->
      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <div class="bg-white rounded-md shadow-lg p-6">
          <div class="h-6 bg-gray-300 rounded mb-4 w-48 shimmer-bg"></div>
          <div class="space-y-3">
            <div v-for="n in 4" :key="n" class="flex gap-4 py-2 border-b border-gray-100">
              <span class="h-4 bg-gray-200 rounded min-w-[140px] flex-shrink-0 shimmer-bg"></span>
              <span class="h-4 bg-gray-300 rounded flex-1 shimmer-bg"></span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-md shadow-lg p-6">
          <div class="h-6 bg-gray-300 rounded mb-4 w-56 shimmer-bg"></div>
          <div class="space-y-3">
            <div v-for="n in 5" :key="n" class="flex items-center space-x-3">
              <div class="w-5 h-5 bg-gray-200 rounded shimmer-bg"></div>
              <div class="h-4 bg-gray-300 rounded flex-1 shimmer-bg"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Description Skeleton -->
      <div class="bg-white rounded-md shadow-lg p-8 mb-12">
        <div class="h-8 bg-gray-300 rounded mb-6 w-48 shimmer-bg"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-300 rounded shimmer-bg"></div>
          <div class="h-4 bg-gray-300 rounded shimmer-bg"></div>
          <div class="h-4 bg-gray-300 rounded w-5/6 shimmer-bg"></div>
        </div>
      </div>

      <!-- Related Articles Skeleton -->
      <div class="bg-white rounded-md shadow-lg p-8 mb-12">
        <div class="h-8 bg-gray-300 rounded mb-6 w-48 shimmer-bg"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="n in 3"
            :key="n"
            class="bg-gray-50 rounded-lg p-6"
          >
            <div class="h-6 bg-gray-300 rounded mb-3 shimmer-bg"></div>
            <div class="h-4 bg-gray-200 rounded mb-2 shimmer-bg"></div>
            <div class="h-4 bg-gray-200 rounded mb-4 w-4/5 shimmer-bg"></div>
            <div class="flex gap-2 mb-4">
              <div class="h-5 w-16 bg-gray-200 rounded-full shimmer-bg"></div>
              <div class="h-5 w-20 bg-gray-200 rounded-full shimmer-bg"></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="h-4 w-24 bg-gray-200 rounded shimmer-bg"></div>
              <div class="h-4 w-32 bg-gray-300 rounded shimmer-bg"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Reminder Skeleton -->
      <div class="bg-white rounded-md shadow-lg p-8">
        <div class="text-center mb-6">
          <div class="h-8 lg:h-9 bg-gray-300 rounded mb-3 mx-auto w-3/4 shimmer-bg"></div>
          <div class="h-5 bg-gray-200 rounded mx-auto w-2/3 shimmer-bg"></div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div class="flex-1 h-14 bg-gray-300 rounded-lg shimmer-bg"></div>
          <div class="flex-1 h-14 bg-gray-300 rounded-lg shimmer-bg"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No props needed for this skeleton component
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer-bg {
  background: linear-gradient(
    90deg,
    #e5e7eb 0%,
    #f3f4f6 20%,
    #e5e7eb 40%,
    #e5e7eb 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
</style>

