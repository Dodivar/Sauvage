<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginAdmin, isAdminAuthenticated } from '@/services/adminAuthService'
import logoNoir from '@/assets/logo noir.png'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

// Vérifier si déjà authentifié
onMounted(async () => {
  const authenticated = await isAdminAuthenticated()
  if (authenticated) {
    router.push('/admin')
  }
})

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const result = await loginAdmin(email.value, password.value)
    if (result.success) {
      router.push('/admin')
    } else {
      error.value = result.error || 'Erreur lors de la connexion'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la connexion'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen gradient-bg flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <!-- Logo -->
        <div class="mb-8 text-center">
          <img
            :src="logoNoir"
            alt="Sauvage"
            class="mx-auto h-16 w-auto"
          />
        </div>

        <!-- Titre -->
        <h1 class="text-3xl md:text-4xl font-bold text-text-main mb-2 text-center">
          Administration
        </h1>
        <p class="text-lg text-gray-600 mb-8 text-center">
          Connectez-vous pour gérer le stock
        </p>

        <!-- Formulaire de connexion -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="votre-email@example.com"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none transition-colors text-text-main"
              :disabled="isLoading"
              required
              autocomplete="email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none transition-colors text-text-main"
              :disabled="isLoading"
              required
              autocomplete="current-password"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="!isLoading">Se connecter</span>
            <span v-else class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Connexion en cours...
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
</style>

