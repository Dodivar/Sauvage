<template>
  <section class="py-16 gradient-bg min-h-screen">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-600">Chargement de la montre...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div v-if="isUnavailable" class="max-w-2xl mx-auto">
          <div class="text-gray-400 mb-4">
            <svg class="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 mb-4">Montre non disponible</h3>
          <p class="text-lg text-gray-600 mb-8">
            Cette montre n'est plus en stock ou n'est plus disponible à la vente.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/collection"
              class="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voir notre collection
            </router-link>
            <router-link
              to="/"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors inline-flex items-center justify-center"
            >
              Retour à l'accueil
            </router-link>
          </div>
        </div>
        <div v-else>
          <div class="text-red-500 mb-4">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-xl text-gray-900 mb-2">Erreur de chargement</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="loadWatch"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>

      <!-- Watch Content -->
      <template v-else-if="watchItem">
      <!-- Breadcrumb -->
<!--       <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li><a href="#" class="hover:text-primary transition-colors">Accueil</a></li>
          <li><span class="mx-2">/</span></li>
          <li><a href="#" class="hover:text-primary transition-colors">Collection</a></li>
          <li><span class="mx-2">/</span></li>
          <li class="text-gray-900 font-medium">{{ watch.name }}</li>
        </ol>
      </nav> -->

      <div class="grid lg:grid-cols-2 gap-12 mb-12">
        <!-- Images Section -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div 
              ref="imageContainerRef"
              class="relative h-96 lg:h-[500px] image-zoom-container"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
              @mousemove="handleMouseMove"
            >
              <img
                v-if="watchItem && watchItem.images && watchItem.images.length > 0"
                :src="watchItem.images[currentImageIndex]"
                :alt="watchItem.name"
                class="w-full h-full object-cover object-center cursor-zoom-in"
                @click="openLightbox"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                Image non disponible
              </div>

              <!-- Zoom Preview Encart -->
              <div
                v-if="isHovering && watchItem && watchItem.images && watchItem.images.length > 0"
                class="zoom-preview hidden lg:block"
                :style="zoomPreviewStyle"
              >
                <div 
                  class="zoom-preview-inner"
                  :style="zoomImageStyle"
                >
                </div>
              </div>

              <!-- Zoom button -->
              <button
                @click="openLightbox"
                class="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200 z-10"
                title="Agrandir l'image"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </button>

              <!-- Navigation arrows -->
              <button
                v-if="watchItem && watchItem.images && watchItem.images.length > 1"
                @click="previousImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                v-if="watchItem && watchItem.images && watchItem.images.length > 1"
                @click="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Thumbnail Gallery -->
          <div v-if="watchItem && watchItem.images && watchItem.images.length > 1" class="grid grid-cols-4 gap-2">
            <button
              v-for="(image, index) in watchItem.images"
              :key="index"
              @click="currentImageIndex = index"
              :class="[
                'relative h-20 bg-white rounded-lg overflow-hidden border-2 transition-all duration-200',
                currentImageIndex === index
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
            >
              <img
                :src="image"
                :alt="`${watchItem.name} - Image ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- watchItem Info Section -->
        <div class="space-y-8">
          <!-- Header -->
          <div>
            <div class="flex items-start justify-between mb-2">
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900">
                {{ watchItem.name }}
              </h1>
              <div class="flex items-center space-x-2">
                <span
                  v-if="!watchItem.isAvailable"
                  class="ml-4 px-3 py-1 text-sm font-semibold rounded-full bg-orange-100 text-orange-800 whitespace-nowrap"
                >
                  Hors stock
                </span>
                <span
                  v-if="watchItem.isSold"
                  class="ml-4 px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 whitespace-nowrap"
                >
                  Vendue
                </span>
              </div>
            </div>
            <p class="text-lg text-gray-600 mb-4">Réf. {{ watchItem.reference }}</p>
            <div class="text-3xl font-normal text-primary mb-6">
              {{ formatPrice(watchItem.price) }}
            </div>
          </div>

          <!-- Key Features -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Caractéristiques principales</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="hasValue(watchItem.year)" class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-sm text-gray-600">{{ watchItem.year }}</span>
              </div>
              <div v-if="hasValue(watchItem.condition)" class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                                      stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-sm text-gray-600">{{ watchItem.condition }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.content)" class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <!-- Dessin du cube (style boîte simple) -->
                  <polygon points="3,7 12,3 21,7 21,17 12,21 3,17" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
                  <polyline points="3,7 12,12 21,7" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
                </svg>
                <span class="text-sm text-gray-600">{{ watchItem.details.content }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.guarantee)" class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
                  />
                </svg>
                <span class="text-sm text-gray-600">{{ watchItem.details.guarantee }}</span>
              </div>
            </div>
          </div>

          <!-- Contact Buttons -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Intéressé par cette montre ?</h3>
            <div class="flex flex-col sm:flex-row gap-4">
              <a
                :href="
                  watchItem
                    ? 'https://wa.me/' +
                      WHATSAPP_NUMBER +
                      '?text=' +
                      encodeURIComponent(
                        `Bonjour, je suis intéressé par la montre ${watchItem.name} (Réf. ${watchItem.reference}) au prix de ${formatPrice(watchItem.price)}`,
                      )
                    : '#'
                "
                target="_blank"
                class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
                  />
                </svg>
                WhatsApp
              </a>
              <a
                :href="
                  watchItem
                    ? 'mailto:' +
                      EMAIL_CONTACT +
                      '?subject=' +
                      encodeURIComponent(`Demande d'information - ${watchItem.name}`) +
                      '&body=' +
                      encodeURIComponent(
                        `Bonjour,\n\nJe souhaiterais avoir plus d'informations concernant la montre ${watchItem.name} (Réf. ${watchItem.reference}) proposée au prix de ${formatPrice(watchItem.price)}.\n\nCordialement`,
                      )
                    : '#'
                "
                class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
              >
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Specifications -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 mb-8">Caractéristiques détaillées</h2>

        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Basic Data -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Données de base
            </h3>
            <div class="space-y-3">
              <div v-if="hasValue(watchItem.adCode)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Code annonce</span>
                <span class="font-medium">{{ watchItem.adCode }}</span>
              </div>
              <div v-if="hasValue(watchItem.brand)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Marque</span>
                <span class="font-medium">{{ watchItem.brand }}</span>
              </div>
              <div v-if="hasValue(watchItem.model)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Modèle</span>
                <span class="font-medium">{{ watchItem.model }}</span>
              </div>
              <div v-if="hasValue(watchItem.reference)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Numéro de référence</span>
                <span class="font-medium">{{ watchItem.reference }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.movement)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Mouvement</span>
                <span class="font-medium">{{ watchItem.details.movement }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.caseMaterial)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Boîtier</span>
                <span class="font-medium">{{ watchItem.details.caseMaterial }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.braceletMaterial)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Matière du bracelet</span>
                <span class="font-medium">{{ watchItem.details.braceletMaterial }}</span>
              </div>
              <div v-if="hasValue(watchItem.year)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Année de fabrication</span>
                <span class="font-medium">{{ watchItem.year }}</span>
              </div>
            </div>
          </div>

          <!-- Technical Specifications -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Spécifications techniques
            </h3>
            <div class="space-y-3">
              <div v-if="hasValue(watchItem.details?.caseSize)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Diamètre du boîtier</span>
                <span class="font-medium">{{ watchItem.details.caseSize }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.thickness)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Épaisseur</span>
                <span class="font-medium">{{ watchItem.details.thickness }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.dialColor)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Couleur du cadran</span>
                <span class="font-medium">{{ watchItem.details.dialColor }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.crystal)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Matière de la glace</span>
                <span class="font-medium">{{ watchItem.details.crystal }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.waterResistance)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Étanchéité</span>
                <span class="font-medium">{{ watchItem.details.waterResistance }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.functions)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Fonctions</span>
                <span class="font-medium">{{ watchItem.details.functions }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.powerReserve)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Réserve de marche</span>
                <span class="font-medium">{{ watchItem.details.powerReserve }}</span>
              </div>
              <div v-if="hasValue(watchItem.details?.frequency)" class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Fréquence</span>
                <span class="font-medium">{{ watchItem.details.frequency }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Condition & Accessories -->
      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">État et condition</h3>
          <div class="space-y-3">
            <div v-if="hasValue(watchItem.condition)" class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">État général</span>
              <span class="font-medium">{{ watchItem.condition }}</span>
            </div>
            <div v-if="hasValue(watchItem.details?.caseCondition)" class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">Boîtier</span>
              <span class="font-medium">{{ watchItem.details.caseCondition }}</span>
            </div>
            <div v-if="hasValue(watchItem.details?.dialCondition)" class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">Cadran</span>
              <span class="font-medium">{{ watchItem.details.dialCondition }}</span>
            </div>
            <div v-if="hasValue(watchItem.details?.braceletCondition)" class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600">Bracelet</span>
              <span class="font-medium">{{ watchItem.details.braceletCondition }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Contenu de la livraison</h3>
          <div class="space-y-3">
            <div
              v-for="(item, index) in watchItem.details.accessories"
              :key="index"
              class="flex items-center space-x-3"
            >
              <svg
                :class="['w-5 h-5', item.included ? 'text-primary' : 'text-gray-400']"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="item.included ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'"
                />
              </svg>
              <span :class="item.included ? 'text-gray-900' : 'text-gray-500'">
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="hasValue(watchItem.description)" class="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Description</h2>
        <div class="prose max-w-none text-gray-700 leading-relaxed">
          <p>{{ watchItem.description }}</p>
        </div>
      </div>

      <!-- Contact Reminder Section -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-6">
          <h2 class="text-2xl lg:text-3xl font-bold mb-3 text-gray-900">Une question sur cette montre ?</h2>
          <p class="text-lg text-gray-600">
            Contactez-nous par WhatsApp ou email pour plus d'informations
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <a
            :href="
              watchItem
                ? 'https://wa.me/' +
                  WHATSAPP_NUMBER +
                  '?text=' +
                  encodeURIComponent(
                    `Bonjour, je suis intéressé par la montre ${watchItem.name} (Réf. ${watchItem.reference}) au prix de ${formatPrice(watchItem.price)}`,
                  )
                : '#'
            "
            target="_blank"
            class="flex-1 inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
          >
            <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
              />
            </svg>
            WhatsApp
          </a>
          <a
            :href="
              watchItem
                ? 'mailto:' +
                  EMAIL_CONTACT +
                  '?subject=' +
                  encodeURIComponent(`Demande d'information - ${watchItem.name}`) +
                  '&body=' +
                  encodeURIComponent(
                    `Bonjour,\n\nJe souhaiterais avoir plus d'informations concernant la montre ${watchItem.name} (Réf. ${watchItem.reference}) proposée au prix de ${formatPrice(watchItem.price)}.\n\nCordialement`,
                  )
                : '#'
            "
            class="flex-1 inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-green-700 transition-colors duration-200"
          >
            <svg class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email
          </a>
        </div>
      </div>
      </template>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="isLightboxOpen"
        class="lightbox-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 p-4"
        @click="closeLightbox"
        @keydown.esc="closeLightbox"
        tabindex="-1"
      >
        <!-- Close button -->
        <button
          @click.stop="closeLightbox"
          class="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-3 transition-all duration-200"
          title="Fermer"
          aria-label="Fermer la lightbox"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Main image in lightbox -->
        <img
          v-if="watchItem"
          :src="watchItem.images[currentImageIndex]"
          :alt="watchItem.name"
          class="max-w-[90vw] max-h-[90vh] object-contain"
          @click.stop
        />

        <!-- Navigation arrows in lightbox -->
        <button
          v-if="watchItem && watchItem.images && watchItem.images.length > 1"
          @click.stop="previousImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-4 transition-all duration-200 z-10"
          aria-label="Image précédente"
        >
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          v-if="watchItem && watchItem.images && watchItem.images.length > 1"
          @click.stop="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-4 transition-all duration-200 z-10"
          aria-label="Image suivante"
        >
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Image counter -->
        <div
          v-if="watchItem && watchItem.images.length > 1"
          class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm pointer-events-none"
        >
          {{ currentImageIndex + 1 }} / {{ watchItem.images.length }}
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { scrollAnimation } from '@/animation'
import { WHATSAPP_NUMBER, EMAIL_CONTACT } from '@/config'
import { getWatchById } from '@/services/watchService'
import { isAdminAuthenticated } from '@/services/adminAuthService'

const route = useRoute()

// Current image index for slider
const currentImageIndex = ref(0)

// Lightbox state
const isLightboxOpen = ref(false)

// Zoom on hover state
const isHovering = ref(false)
const mousePosition = ref({ x: 0, y: 0 })
const imageContainerRef = ref(null)
const imageNaturalSize = ref({ width: 0, height: 0 })
const zoomLevel = 1 // Niveau de zoom (3x pour garantir que l'image couvre toujours l'encart)

// State
const watchItem = ref(null)
const isLoading = ref(true)
const error = ref(null)
const isUnavailable = ref(false)
const isAdmin = ref(false)

// Load watch from Supabase
const loadWatch = async () => {
  try {
    isLoading.value = true
    error.value = null
    isUnavailable.value = false
    
    // Vérifier si l'utilisateur est admin
    isAdmin.value = await isAdminAuthenticated()
    
    const watchId = route.params.id
    if (!watchId) {
      throw new Error('ID de montre manquant')
    }
    
    // Si l'utilisateur est admin, permettre de voir les montres hors-stock
    const data = await getWatchById(watchId, isAdmin.value)
    watchItem.value = data
    // Reset image index when watch changes
    currentImageIndex.value = 0
    // Load image dimensions
    if (data && data.images && data.images.length > 0) {
      await loadImageDimensions(data.images[0])
    }
  } catch (err) {
    console.error('Erreur lors du chargement de la montre:', err)
    // Vérifier si c'est une erreur de disponibilité
    if (err.message === 'UNAVAILABLE') {
      isUnavailable.value = true
      error.value = 'Cette montre n\'est plus disponible'
    } else {
      error.value = err.message || 'Une erreur est survenue lors du chargement de la montre'
    }
  } finally {
    isLoading.value = false
  }
}

// Image navigation methods
const nextImage = () => {
  if (watchItem.value && watchItem.value.images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % watchItem.value.images.length
  }
}

const previousImage = () => {
  if (watchItem.value && watchItem.value.images.length > 1) {
    currentImageIndex.value =
      currentImageIndex.value === 0 ? watchItem.value.images.length - 1 : currentImageIndex.value - 1
  }
}

// Load image natural dimensions
const loadImageDimensions = (imageSrc) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      imageNaturalSize.value = {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
      resolve()
    }
    img.onerror = () => {
      // En cas d'erreur, utiliser les dimensions du conteneur comme fallback
      if (imageContainerRef.value) {
        const rect = imageContainerRef.value.getBoundingClientRect()
        imageNaturalSize.value = {
          width: rect.width,
          height: rect.height
        }
      }
      resolve()
    }
    img.src = imageSrc
  })
}

// Zoom on hover methods
const handleMouseEnter = () => {
  // Only enable on desktop (not touch devices)
  if (window.innerWidth >= 1024 && !('ontouchstart' in window)) {
    isHovering.value = true
  }
}

const handleMouseLeave = () => {
  isHovering.value = false
}

const handleMouseMove = (event) => {
  if (!imageContainerRef.value || !isHovering.value) return
  
  const rect = imageContainerRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  mousePosition.value = {
    x: Math.max(0, Math.min(x, rect.width)),
    y: Math.max(0, Math.min(y, rect.height))
  }
}

// Computed styles for zoom preview
const zoomPreviewStyle = computed(() => {
  if (!imageContainerRef.value) return {}
  
  const rect = imageContainerRef.value.getBoundingClientRect()
  const previewSize = 400 // Taille de l'encart de zoom
  const offset = 20 // Distance depuis l'image
  const isDesktop = window.innerWidth >= 1024
  
  let left, top
  
  // En desktop, utiliser l'offset normal
  // En responsive, utiliser un offset minimal pour coller l'encart à l'image
  const actualOffset = isDesktop ? offset : 5
  
  // Toujours essayer de positionner à droite de l'image d'abord
  left = rect.right + actualOffset
  
  // Si pas assez de place à droite, mettre à gauche
  if (left + previewSize > window.innerWidth) {
    left = rect.left - previewSize - actualOffset
    
    // En responsive, si même à gauche ça dépasse, coller directement au bord de l'image
    if (!isDesktop && left < 0) {
      // Coller à droite sans offset
      left = rect.right
      // Si ça dépasse encore, mettre à gauche sans offset
      if (left + previewSize > window.innerWidth) {
        left = rect.left - previewSize
        // Si même ça dépasse, ajuster pour rester visible mais le plus proche possible
        if (left < 0) {
          left = Math.max(10, window.innerWidth - previewSize - 10)
        }
      }
    }
  }
  
  // Ajuster verticalement pour rester dans la fenêtre
  top = rect.top
  if (top + previewSize > window.innerHeight) {
    top = window.innerHeight - previewSize - 20
  }
  if (top < 20) {
    top = 20
  }
  
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${previewSize}px`,
    height: `${previewSize}px`
  }
})

// Computed styles for zoomed image
const zoomImageStyle = computed(() => {
  if (!imageContainerRef.value || !watchItem.value || !isHovering.value) return {}
  if (imageNaturalSize.value.width === 0 || imageNaturalSize.value.height === 0) return {}
  
  const rect = imageContainerRef.value.getBoundingClientRect()
  const previewSize = 400 // Taille de l'encart de zoom
  
  // S'assurer que rect a des dimensions valides
  if (rect.width === 0 || rect.height === 0) return {}
  
  // Calculer comment l'image est affichée dans le conteneur (avec object-cover)
  // object-cover remplit le conteneur en préservant le ratio, donc l'image peut être rognée
  const containerAspect = rect.width / rect.height
  const imageAspect = imageNaturalSize.value.width / imageNaturalSize.value.height
  
  // Calculer quelle partie de l'image naturelle est visible dans le conteneur
  let visibleImageWidth, visibleImageHeight, cropOffsetX, cropOffsetY
  
  if (imageAspect > containerAspect) {
    // L'image est plus large que le conteneur, elle est rognée sur les côtés
    // L'image remplit la hauteur du conteneur
    visibleImageHeight = imageNaturalSize.value.height
    visibleImageWidth = visibleImageHeight * containerAspect
    // L'image est centrée horizontalement, donc on rogne les côtés
    cropOffsetX = (imageNaturalSize.value.width - visibleImageWidth) / 2
    cropOffsetY = 0
  } else {
    // L'image est plus haute que le conteneur, elle est rognée en haut/bas
    // L'image remplit la largeur du conteneur
    visibleImageWidth = imageNaturalSize.value.width
    visibleImageHeight = visibleImageWidth / containerAspect
    // L'image est centrée verticalement, donc on rogne en haut et en bas
    cropOffsetX = 0
    cropOffsetY = (imageNaturalSize.value.height - visibleImageHeight) / 2
  }
  
  // La position de la souris dans le conteneur (0 à rect.width/height)
  // On doit la mapper à la position dans l'image naturelle complète
  // Le conteneur montre la partie visible de l'image (visibleImageWidth x visibleImageHeight)
  // qui commence à (cropOffsetX, cropOffsetY) dans l'image naturelle
  
  // Convertir la position de la souris en ratio dans la partie visible (0-1)
  const visibleXRatio = mousePosition.value.x / rect.width
  const visibleYRatio = mousePosition.value.y / rect.height
  
  // Convertir ce ratio en position dans l'image naturelle complète
  const xRatio = (cropOffsetX + visibleXRatio * visibleImageWidth) / imageNaturalSize.value.width
  const yRatio = (cropOffsetY + visibleYRatio * visibleImageHeight) / imageNaturalSize.value.height
  
  // Clamp pour rester dans les limites (ne devrait pas être nécessaire mais sécurité)
  const finalXRatio = Math.max(0, Math.min(1, xRatio))
  const finalYRatio = Math.max(0, Math.min(1, yRatio))
  
  // Calculer les dimensions de l'image zoomée en préservant le ratio d'aspect
  const zoomedWidth = imageNaturalSize.value.width * zoomLevel
  const zoomedHeight = imageNaturalSize.value.height * zoomLevel
  
  // Calculer la position dans l'image zoomée où se trouve le point sous la souris
  const zoomedX = finalXRatio * zoomedWidth
  const zoomedY = finalYRatio * zoomedHeight
  
  // Pour centrer ce point dans l'encart, on doit calculer la position du background
  const backgroundX = (previewSize / 2) - zoomedX
  const backgroundY = (previewSize / 2) - zoomedY
  
  // Limiter la position pour éviter les zones blanches
  const minBackgroundX = Math.min(0, previewSize - zoomedWidth)
  const maxBackgroundX = 0
  const minBackgroundY = Math.min(0, previewSize - zoomedHeight)
  const maxBackgroundY = 0
  
  // Clamp les valeurs entre les limites
  const finalBackgroundX = Math.max(minBackgroundX, Math.min(maxBackgroundX, backgroundX))
  const finalBackgroundY = Math.max(minBackgroundY, Math.min(maxBackgroundY, backgroundY))
  
  return {
    backgroundImage: `url(${watchItem.value.images[currentImageIndex.value]})`,
    backgroundSize: `${zoomedWidth}px ${zoomedHeight}px`,
    backgroundPosition: `${finalBackgroundX}px ${finalBackgroundY}px`,
    backgroundRepeat: 'no-repeat'
  }
})

// Price formatting
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price)
}

// Helper function to check if a value exists and is not empty
const hasValue = (value) => {
  return value !== null && value !== undefined && value !== '' && String(value).trim() !== ''
}

// SEO Meta Tags and Structured Data
const pageTitle = computed(() => {
  if (!watchItem.value) return 'Montre - Sauvage'
  return `${watchItem.value.name} - ${formatPrice(watchItem.value.price)} | Sauvage`
})

const pageDescription = computed(() => {
  if (!watchItem.value) return 'Découvrez cette montre de luxe sur Sauvage'
  const desc = watchItem.value.description || ''
  const brand = watchItem.value.brand || ''
  const ref = watchItem.value.reference || ''
  return `${desc || `Montre ${brand} ${ref}`.trim()}. Garantie 1 an, authentification certifiée. Prix: ${formatPrice(watchItem.value.price)}`
})

const ogImage = computed(() => {
  if (!watchItem.value || !watchItem.value.images || watchItem.value.images.length === 0) {
    return 'https://sauvage-watches.fr/logo500x500.png'
  }
  return watchItem.value.images[0]
})

const canonicalUrl = computed(() => {
  return `https://sauvage-watches.fr/watch/${route.params.id}`
})

// Structured Data (JSON-LD)
const structuredData = computed(() => {
  if (!watchItem.value) return null
  
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: watchItem.value.name,
    description: watchItem.value.description || `${watchItem.value.brand} ${watchItem.value.reference}`,
    image: watchItem.value.images || [],
    brand: {
      '@type': 'Brand',
      name: watchItem.value.brand || 'Marque inconnue',
    },
    sku: watchItem.value.reference || watchItem.value.id,
    offers: {
      '@type': 'Offer',
      price: watchItem.value.price,
      priceCurrency: 'EUR',
      availability: watchItem.value.is_available && !watchItem.value.is_sold
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: canonicalUrl.value,
      seller: {
        '@type': 'Organization',
        name: 'Sauvage',
        url: 'https://sauvage-watches.fr',
      },
    },
  }

  // Add condition if available
  if (watchItem.value.condition) {
    baseData.itemCondition = `https://schema.org/${watchItem.value.condition === 'Neuf' ? 'NewCondition' : 'UsedCondition'}`
  }

  return baseData
})

// Update head when watch data changes
watch([watchItem, pageTitle, pageDescription, ogImage, canonicalUrl], () => {
  if (!watchItem.value) return

  useHead({
    title: pageTitle.value,
    meta: [
      {
        name: 'description',
        content: pageDescription.value,
      },
      {
        property: 'og:title',
        content: pageTitle.value,
      },
      {
        property: 'og:description',
        content: pageDescription.value,
      },
      {
        property: 'og:image',
        content: ogImage.value,
      },
      {
        property: 'og:url',
        content: canonicalUrl.value,
      },
      {
        property: 'og:type',
        content: 'product',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: pageTitle.value,
      },
      {
        name: 'twitter:description',
        content: pageDescription.value,
      },
      {
        name: 'twitter:image',
        content: ogImage.value,
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl.value,
      },
    ],
    script: structuredData.value
      ? [
          {
            type: 'application/ld+json',
            children: JSON.stringify(structuredData.value),
          },
        ]
      : [],
  })
}, { immediate: true })

// Lightbox methods
const openLightbox = () => {
  isLightboxOpen.value = true
  // Prevent body and html scroll when lightbox is open
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
  // Prevent scroll on touch devices
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.top = `-${window.scrollY}px`
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  // Restore body and html scroll
  const scrollY = document.body.style.top
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.top = ''
  if (scrollY) {
    const scrollPosition = parseInt(scrollY.replace('px', '') || '0', 10)
    window.scrollTo(0, Math.abs(scrollPosition))
  }
}

// Handle ESC key press
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && isLightboxOpen.value) {
    closeLightbox()
  }
}

// Watch for lightbox state changes to handle focus and keyboard events
watch(isLightboxOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown)
    // Focus the lightbox overlay for keyboard navigation
    const overlay = document.querySelector('.lightbox-overlay')
    if (overlay) {
      overlay.focus()
    }
  } else {
    // Remove keyboard event listener
    document.removeEventListener('keydown', handleKeyDown)
  }
})

onMounted(async () => {
  await loadWatch()
  scrollAnimation()
})

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await loadWatch()
  }
})

// Reset zoom and load image dimensions when image changes
watch(currentImageIndex, async () => {
  isHovering.value = false
  if (watchItem.value && watchItem.value.images && watchItem.value.images.length > 0) {
    await loadImageDimensions(watchItem.value.images[currentImageIndex.value])
  }
})

// Load image dimensions when watch item changes
watch(() => watchItem.value, async (newWatchItem) => {
  if (newWatchItem && newWatchItem.images && newWatchItem.images.length > 0) {
    await loadImageDimensions(newWatchItem.images[currentImageIndex.value])
  }
})

onUnmounted(() => {
  // Cleanup: restore body scroll and remove event listeners
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.top = ''
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.prose {
  font-size: 1rem;
  line-height: 1.75;
}

/* Lightbox styles */
.lightbox-overlay {
  animation: fadeIn 0.3s ease-in-out;
  /* Ensure it's above everything */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Zoom on hover styles - Desktop only */
.image-zoom-container {
  position: relative;
}

.zoom-preview {
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 2px solid rgba(0, 0, 0, 0.1);
  pointer-events: none;
  animation: zoomFadeIn 0.2s ease-out;
}

.zoom-preview-inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: white;
  transition: background-position 0.05s ease-out;
  will-change: background-position;
}

@keyframes zoomFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Disable zoom on mobile/touch devices */
@media (max-width: 1023px) {
  .image-zoom-container {
    pointer-events: auto;
  }
  
  .zoom-preview {
    display: none !important;
  }
}
</style>
