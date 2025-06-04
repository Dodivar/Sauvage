<script setup></script>

<template>
  <section class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
    <div class="max-w-xl">
      <svg
        class="mx-auto mb-6 h-16 w-16 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h1 class="text-3xl font-bold text-text-main mb-4">Merci pour votre demande !</h1>
      <p class="text-lg text-gray-600 mb-6">
        Nous avons bien reçu votre recherche personnalisée. Un membre de notre équipe vous
        contactera sous 24 à 48h pour discuter de vos critères et commencer les recherches.
      </p>
      <a
        href="/"
        class="inline-block bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition transform hover:scale-105"
      >
        Retour à l'accueil
      </a>
    </div>
  </section>
</template>

<style scoped></style>
