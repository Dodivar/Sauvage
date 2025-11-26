<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logoutAdmin, getCurrentAdmin } from '@/services/admin/adminAuthService'
import logoNoir from '@/assets/logo noir.png'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
  backButtonText: {
    type: String,
    default: 'Tableau de bord',
  },
  backButtonRoute: {
    type: String,
    default: '/admin',
  },
})

const currentAdmin = ref(null)

const handleLogout = async () => {
  await logoutAdmin()
  router.push('/admin/login')
}

onMounted(async () => {
  const admin = await getCurrentAdmin()
  currentAdmin.value = admin
})
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div class="flex items-center space-x-4">
      <img :src="logoNoir" alt="Sauvage" class="h-10 w-auto" />
      <h1 class="text-2xl font-bold text-text-main">{{ title }}</h1>
    </div>
    <div class="flex items-center space-x-4">
      <span v-if="currentAdmin" class="text-sm text-gray-600">
        {{ currentAdmin.email }}
      </span>
      <button
        v-if="showBackButton"
        @click="router.push(backButtonRoute)"
        class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {{ backButtonText }}
      </button>
      <button
        @click="handleLogout"
        class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Déconnexion
      </button>
    </div>
  </div>
</template>





