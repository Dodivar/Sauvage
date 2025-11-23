<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createArticle, updateArticle, getArticleByIdForAdmin } from '@/services/adminArticleService'
import AdminHeader from './AdminHeader.vue'

const router = useRouter()
const route = useRoute()

const isEditMode = computed(() => !!route.params.id)
const articleId = computed(() => route.params.id)

// Form state
const formData = ref({
  title: '',
  text: '',
  categories: [],
})

const currentCategory = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref(null)
const success = ref(null)

// Methods
const loadArticle = async () => {
  if (!isEditMode.value) return

  try {
    isLoading.value = true
    error.value = null
    const article = await getArticleByIdForAdmin(articleId.value)

    formData.value = {
      title: article.title || '',
      text: article.text || '',
      categories: article.categories && Array.isArray(article.categories) ? [...article.categories] : [],
    }
  } catch (err) {
    console.error('Erreur lors du chargement de l\'article:', err)
    error.value = err.message || 'Erreur lors du chargement de l\'article'
  } finally {
    isLoading.value = false
  }
}

const addCategory = () => {
  const category = currentCategory.value.trim()
  if (!category) return

  // Vérifier si la catégorie n'existe pas déjà
  if (!formData.value.categories.includes(category)) {
    formData.value.categories.push(category)
  }

  currentCategory.value = ''
}

const removeCategory = (index) => {
  formData.value.categories.splice(index, 1)
}

const handleCategoryKeyPress = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addCategory()
  }
}

const handleSubmit = async () => {
  // Validation
  if (!formData.value.title.trim()) {
    error.value = 'Le titre est obligatoire'
    return
  }

  if (!formData.value.text.trim()) {
    error.value = 'Le contenu est obligatoire'
    return
  }

  try {
    isSaving.value = true
    error.value = null
    success.value = null

    const articleData = {
      title: formData.value.title,
      text: formData.value.text,
      categories: formData.value.categories,
    }

    let result
    if (isEditMode.value) {
      result = await updateArticle(articleId.value, articleData)
    } else {
      result = await createArticle(articleData)
    }

    if (result.success) {
      success.value = isEditMode.value ? 'Article mis à jour avec succès' : 'Article créé avec succès'
      setTimeout(() => {
        router.push('/admin/articles')
      }, 1500)
    } else {
      error.value = result.error || 'Une erreur est survenue'
    }
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    error.value = err.message || 'Une erreur est survenue lors de la sauvegarde'
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/articles')
}

onMounted(async () => {
  await loadArticle()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Top Section -->
      <AdminHeader
        :title="isEditMode ? 'Modifier l\'article' : 'Nouvel article'"
        :show-back-button="true"
        back-button-text="Tableau de bord"
        back-button-route="/admin"
      />

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
        <button @click="error = null" class="ml-4 text-red-500 hover:text-red-700">×</button>
      </div>

      <!-- Success State -->
      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
        {{ success }}
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-600">Chargement de l'article...</p>
      </div>

      <!-- Form -->
      <div v-else class="bg-white rounded-lg shadow p-6 md:p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Titre <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Titre de l'article"
            />
          </div>

          <!-- Content -->
          <div>
            <label for="text" class="block text-sm font-medium text-gray-700 mb-2">
              Contenu (Markdown) <span class="text-red-500">*</span>
            </label>
            <textarea
              id="text"
              v-model="formData.text"
              required
              rows="20"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              placeholder="Écrivez votre article en Markdown..."
            ></textarea>
            <p class="mt-2 text-sm text-gray-500">
              Le contenu doit être écrit en Markdown. Vous pouvez utiliser des titres (# ## ###), du texte en gras (**texte**), des listes, etc.
            </p>
          </div>

          <!-- Categories -->
          <div>
            <label for="categories" class="block text-sm font-medium text-gray-700 mb-2">
              Catégories
            </label>
            <div class="flex gap-2 mb-2">
              <input
                id="categories"
                v-model="currentCategory"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ajouter une catégorie"
                @keypress="handleCategoryKeyPress"
              />
              <button
                type="button"
                @click="addCategory"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ajouter
              </button>
            </div>
            <div v-if="formData.categories.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(category, index) in formData.categories"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
              >
                {{ category }}
                <button
                  type="button"
                  @click="removeCategory(index)"
                  class="ml-2 text-primary hover:text-green-700"
                >
                  ×
                </button>
              </span>
            </div>
            <p v-else class="text-sm text-gray-500">Aucune catégorie ajoutée</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleCancel"
              class="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer l\'article' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

