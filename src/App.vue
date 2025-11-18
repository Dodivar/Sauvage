<script setup>
import { ref, useTemplateRef, computed } from 'vue'
import { useRoute } from 'vue-router'
import { WHATSAPP_NUMBER, EMAIL_CONTACT } from '@/config'

//const displayMobileMenu = ref(false)
const overlay = useTemplateRef('mobile-menu-overlay')
const route = useRoute()

// Vérifier si on est sur la page de maintenance
const isMaintenancePage = computed(() => route.path === '/maintenance')

function displayMobileMenu() {
  overlay.value.classList.remove('hidden')
  overlay.value.classList.add('flex', 'opacity-0')
  setTimeout(() => overlay.value.classList.add('opacity-100'), 10) // animation d'apparition
}

function closeMobileMenu() {
  overlay.value.classList.remove('opacity-100')
  overlay.value.classList.add('opacity-0')
  setTimeout(() => {
    overlay.value.classList.add('hidden')
    overlay.value.classList.remove('flex')
  }, 300) // correspond à duration-300
}
</script>

<template>
  <!-- Menu mobile-->
  <div
    v-if="!isMaintenancePage"
    ref="mobile-menu-overlay"
    class="fixed inset-0 bg-white/70 backdrop-blur-lg z-30 hidden transition-opacity duration-300"
  >
    <div class="absolute top-6 right-6">
      <button
        @click="closeMobileMenu"
        ref="close-mobile-menu"
        class="text-3xl text-text-main focus:outline-none"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
    <nav
      class="flex flex-col items-center justify-center h-screen space-y-8 text-xl font-semibold text-text-main w-screen"
    >
      <RouterLink to="/" @click="closeMobileMenu">
        <img width="100px" src="./assets/logo noir.png" />
      </RouterLink>
      <RouterLink to="/" @click="closeMobileMenu" class="hover:text-primary transition-colors"
        >Accueil</RouterLink
      >
      <RouterLink
        to="/collection"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Nos montres</RouterLink
      >
      <RouterLink
        to="/recherche"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Recherche personnalisée</RouterLink
      >
      <RouterLink
        to="/estimation"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Estimation</RouterLink
      >
      <!-- <RouterLink
        to="/depot-vente"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Dépôt-vente</RouterLink
      > -->
      <RouterLink to="/#faq" @click="closeMobileMenu" class="hover:text-primary transition-colors"
        >FAQ</RouterLink
      >
      <RouterLink
        to="/#contact"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Contact</RouterLink
      >
    </nav>
  </div>

  <!-- Menu desktop -->
  <header v-if="!isMaintenancePage" id="header" class="shadow-sm backdrop-blur-sm sticky top-0 z-20">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <RouterLink to="/">
            <img width="50px" height="50px" src="./assets/logo noir.png" />
          </RouterLink>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-8">
            <RouterLink
              to="/collection"
              class="text-text-main hover:text-primary transition-colors"
              >Nos montres</RouterLink
            >
            <div class="relative group">
              <p class="text-text-main hover:text-primary transition-colors flex items-center">
                Nos services
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </p>
              <div
                class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                  <RouterLink
                    to="/recherche"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >Recherche personnalisée</RouterLink
                  >
                <div class="py-1">
                  <RouterLink
                    to="/estimation"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >Estimation</RouterLink
                  >
                  <!-- <RouterLink
                    to="/depot-vente"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >Dépôt-vente</RouterLink
                  > -->
                </div>
              </div>
            </div>
            <RouterLink to="/#faq" class="text-text-main hover:text-primary transition-colors"
              >FAQ</RouterLink
            >
            <RouterLink to="#contact" class="text-text-main hover:text-primary transition-colors"
              >Contact</RouterLink
            >
          </div>
        </div>
        <button class="md:hidden" ref="mobile-menu-toggle" @click="displayMobileMenu">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <!-- Footer -->
  <footer v-if="!isMaintenancePage" id="contact" class="bg-text-main text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8">
        <div class="sm:col-span-2">
          <div class="text-3xl font-bold text-primary mb-4">Sauvage</div>
          <p class="text-gray-300 mb-6 leading-relaxed">
            Experts en rachat de montres, nous garantissons un service transparent, rapide et
            sécurisé.
          </p>
          <div class="flex space-x-4">
            <a
              href="https://www.tiktok.com/@sauvagewatches"
              class="text-gray-300 hover:text-primary transition-colors"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                />
              </svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-primary transition-colors">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.254-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </a>
            <a
              :href="'https://wa.me/' + WHATSAPP_NUMBER"
              class="text-gray-300 hover:text-primary transition-colors"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
                />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Navigation</h3>
          <ul class="space-y-2">
            <li>
              <a href="#accueil" class="text-gray-300 hover:text-primary transition-colors"
                >Accueil</a
              >
            </li>
            <li>
              <RouterLink
                to="/collection"
                class="text-gray-300 hover:text-primary transition-colors"
                >Nos montres</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/recherche" class="text-gray-300 hover:text-primary transition-colors"
                >Recherche personnalisée</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/estimation"
                class="text-gray-300 hover:text-primary transition-colors"
                >Estimation</RouterLink
              >
            </li>
            <!-- <li>
              <RouterLink
                to="/depot-vente"
                class="text-gray-300 hover:text-primary transition-colors"
                >Dépôt-vente</RouterLink
              >
            </li> -->
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact</h3>
          <div class="space-y-2 text-gray-300">
            <a class="flex items-center"
              :href="'https://wa.me/' + WHATSAPP_NUMBER">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              {{ WHATSAPP_NUMBER }}
            </a>
            <a :href="'mailto:' + EMAIL_CONTACT"
             class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {{ EMAIL_CONTACT }}
            </a>
            <p class="flex items-start">
              <svg class="h-5 w-5 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              123 Avenue des Montres<br />67000 Strasbourg, France
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-12 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-300 text-sm">© 2025 Sauvage. Tous droits réservés.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-300 hover:text-primary text-sm transition-colors"
              >Mentions légales</a
            >
            <a href="#" class="text-gray-300 hover:text-primary text-sm transition-colors"
              >Politique de confidentialité</a
            >
            <a href="#" class="text-gray-300 hover:text-primary text-sm transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
