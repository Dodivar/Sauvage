<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

//const displayMobileMenu = ref(false)
const mobileMenuToggle = useTemplateRef('mobile-menu-toggle')
const closeBtn = useTemplateRef('close-mobile-menu')
const overlay = useTemplateRef('mobile-menu-overlay')

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
    ref="mobile-menu-overlay"
    class="fixed inset-0 bg-white/70 backdrop-blur-lg z-30 hidden transition-opacity duration-300"
  >
    <div class="absolute top-6 right-6 w-screen">
      <button
        @click="closeMobileMenu"
        ref="close-mobile-menu"
        class="text-3xl text-text-main focus:outline-none"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
    <nav
      class="flex flex-col items-center justify-center h-screen space-y-8 text-xl font-semibold text-text-main"
    >
      <RouterLink to="/" @click="closeMobileMenu">
        <img width="100px" src="./assets/logo noir.png" />
      </RouterLink>
      <RouterLink to="/" @click="closeMobileMenu" class="hover:text-primary transition-colors"
        >Accueil</RouterLink
      >
      <RouterLink
        to="/#estimation"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Estimation</RouterLink
      >
      <RouterLink
        to="/recherche"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Recherche personnalisée</RouterLink
      >
      <RouterLink
        to="/collection"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Nos montres</RouterLink
      >
      <RouterLink
        to="/depot-vente"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Dépôt-vente</RouterLink
      >
      <RouterLink
        to="/#temoignages"
        @click="closeMobileMenu"
        class="hover:text-primary transition-colors"
        >Témoignages</RouterLink
      >
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
  <header id="header" class="shadow-sm backdrop-blur-sm sticky top-0 z-20">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <RouterLink to="/">
            <img width="50px" height="50px" src="./assets/logo noir.png" />
          </RouterLink>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-8">
            <div class="relative group">
              <RouterLink
                to="/#services"
                class="text-text-main hover:text-primary transition-colors flex items-center"
              >
                Nos services
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </RouterLink>
              <div
                class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                <div class="py-1">
                  <RouterLink
                    to="/#estimation"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >Estimation</RouterLink
                  >
                  <RouterLink
                    to="/recherche"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >Recherche personnalisée</RouterLink
                  >
                  <RouterLink
                    to="/collection"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >Nos montres</RouterLink
                  >
                  <RouterLink
                    to="/depot-vente"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >Dépôt-vente</RouterLink
                  >
                </div>
              </div>
            </div>
            <RouterLink
              to="/#temoignages"
              class="text-text-main hover:text-primary transition-colors"
              >Témoignages</RouterLink
            >
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
  <footer id="contact" class="bg-text-main text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8">
        <div class="sm:col-span-2">
          <div class="text-3xl font-bold text-primary mb-4">Sauvage</div>
          <p class="text-gray-300 mb-6 leading-relaxed">
            Experts en rachat de montres, nous garantissons un service transparent, rapide et
            sécurisé.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-300 hover:text-primary transition-colors">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
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
            <a href="#" class="text-gray-300 hover:text-primary transition-colors">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
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
                to="/#estimation"
                class="text-gray-300 hover:text-primary transition-colors"
                >Estimation</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/recherche" class="text-gray-300 hover:text-primary transition-colors"
                >Recherche personnalisée</RouterLink
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
              <RouterLink
                to="/depot-vente"
                class="text-gray-300 hover:text-primary transition-colors"
                >Dépôt-vente</RouterLink
              >
            </li>
            <li>
              <a href="#temoignages" class="text-gray-300 hover:text-primary transition-colors"
                >Témoignages</a
              >
            </li>
            <li>
              <RouterLink to="/#faq" class="text-gray-300 hover:text-primary transition-colors"
                >FAQ</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/#contact" class="text-gray-300 hover:text-primary transition-colors"
                >Contact</RouterLink
              >
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact</h3>
          <div class="space-y-2 text-gray-300">
            <p class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              01 23 45 67 89
            </p>
            <p class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              contact@sauvage.fr
            </p>
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
