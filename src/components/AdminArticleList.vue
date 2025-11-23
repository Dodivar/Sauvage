<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllArticlesForAdmin, deleteArticle } from '@/services/adminArticleService'
import AdminHeader from './AdminHeader.vue'

const router = useRouter()

// State
const articles = ref([])
const isLoading = ref(true)
const error = ref(null)
const success = ref(null)
const searchQuery = ref('')
const showDeleteConfirm = ref(false)
const articleToDelete = ref(null)

// Computed
const filteredArticles = computed(() => {
  let filtered = articles.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (article) =>
        article.title?.toLowerCase().includes(query) ||
        article.text?.toLowerCase().includes(query) ||
        (article.categories &&
          article.categories.some((cat) => cat?.toLowerCase().includes(query))),
    )
  }

  return filtered
})

// Methods
const loadArticles = async () => {
  try {
    isLoading.value = true
    error.value = null
    const data = await getAllArticlesForAdmin()
    articles.value = data
  } catch (err) {
    console.error('Erreur lors du chargement des articles:', err)
    error.value = err.message || 'Une erreur est survenue lors du chargement des articles'
  } finally {
    isLoading.value = false
  }
}

const handleEdit = (articleId) => {
  router.push(`/admin/articles/${articleId}/edit`)
}

const handleView = (articleId) => {
  router.push(`/blog/${articleId}`)
}

const handleDelete = (article) => {
  articleToDelete.value = article
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!articleToDelete.value) return

  try {
    const result = await deleteArticle(articleToDelete.value.id)
    if (result.success) {
      await loadArticles()
      showDeleteConfirm.value = false
      articleToDelete.value = null
      success.value = 'Article supprimé avec succès'
      setTimeout(() => {
        success.value = null
      }, 3000)
    } else {
      error.value = result.error || 'Erreur lors de la suppression'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la suppression'
    console.error(err)
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  articleToDelete.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(async () => {
  await loadArticles()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Top Section -->
      <AdminHeader title="Gestion des articles" />

      <!-- Actions Bar -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher (titre, contenu, catégories)..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            @click="router.push('/admin/articles/new')"
            class="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            + Ajouter un article
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
        <button @click="error = null" class="ml-4 text-red-500 hover:text-red-700">×</button>
      </div>

      <!-- Success State -->
      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
        {{ success }}
        <button @click="success = null" class="ml-4 text-green-500 hover:text-green-700">×</button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-600">Chargement des articles...</p>
      </div>

      <!-- Articles Table -->
      <div v-else-if="filteredArticles.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégories
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-900 max-w-md">
                  <div class="truncate font-medium" :title="article.title">
                    {{ article.title }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="article.categories && article.categories.length > 0" class="flex flex-wrap gap-1">
                    <span
                      v-for="cat in article.categories"
                      :key="cat"
                      class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary"
                    >
                      {{ cat }}
                    </span>
                  </div>
                  <span v-else class="text-sm text-gray-400">Aucune catégorie</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(article.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="handleView(article.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Voir"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="handleEdit(article.id)"
                      class="text-green-600 hover:text-green-900"
                      title="Modifier"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="handleDelete(article)"
                      class="text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p class="text-sm text-gray-500 italic">
            {{ filteredArticles.length }} article{{ filteredArticles.length > 1 ? 's' : '' }} affiché{{ filteredArticles.length > 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow p-16 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-xl text-gray-600 mb-2">Aucun article trouvé</h3>
        <p class="text-gray-500 mb-6">
          {{ searchQuery ? 'Essayez de modifier vos critères de recherche' : 'Commencez par ajouter un article' }}
        </p>
        <button
          v-if="!searchQuery"
          @click="router.push('/admin/articles/new')"
          class="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          + Ajouter un article
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelDelete"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer l'article <strong>{{ articleToDelete?.title }}</strong> ? Cette action est irréversible.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelDelete"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

