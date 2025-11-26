<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="handleCancel"
    >
      <div class="bg-white rounded-md shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="border-b border-gray-200">
          <div class="flex items-center justify-between p-6 pb-4">
            <h2 class="text-2xl font-bold text-gray-900">Sélectionner les articles à lier</h2>
            <button
              @click="handleCancel"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
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
          </div>
          <!-- Tabs -->
          <div class="flex border-b border-gray-200 px-6">
            <button
              @click="activeTab = 'all'"
              :class="[
                'px-4 py-3 font-medium text-sm transition-colors border-b-2',
                activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Tous les articles
              <span v-if="filteredAndSortedArticles.length > 0" class="ml-2 text-xs">
                ({{ filteredAndSortedArticles.length }})
              </span>
            </button>
            <button
              @click="activeTab = 'linked'"
              :class="[
                'px-4 py-3 font-medium text-sm transition-colors border-b-2',
                activeTab === 'linked'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Articles liés
              <span v-if="linkedArticles.length > 0" class="ml-2 text-xs">
                ({{ linkedArticles.length }})
              </span>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Search Bar -->
          <div v-if="!isLoading && !error" class="mb-6">
            <div class="relative">
              <input
                v-model.trim="searchQuery"
                type="text"
                placeholder="Rechercher un article par titre, contenu ou catégorie..."
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Effacer la recherche"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div v-if="articles.length > 0" class="mt-2 text-sm text-gray-500">
              <template v-if="activeTab === 'all'">
                {{ filteredAndSortedArticles.length }} article{{ filteredAndSortedArticles.length > 1 ? 's' : '' }} 
                {{ searchQuery ? 'trouvé' + (filteredAndSortedArticles.length > 1 ? 's' : '') : 'disponible' + (filteredAndSortedArticles.length > 1 ? 's' : '') }}
                {{ searchQuery ? `sur ${articles.length}` : '' }}
              </template>
              <template v-else>
                {{ linkedArticles.length }} article{{ linkedArticles.length > 1 ? 's' : '' }} 
                {{ searchQuery ? 'trouvé' + (linkedArticles.length > 1 ? 's' : '') : 'lié' + (linkedArticles.length > 1 ? 's' : '') }}
              </template>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p class="text-gray-600">Chargement des articles...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-16">
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
              @click="loadArticles"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Réessayer
            </button>
          </div>

          <!-- Tab Content: Tous les articles -->
          <div v-if="activeTab === 'all'">
            <div v-if="filteredAndSortedArticles.length > 0" class="space-y-3">
              <!-- Section: Articles suggérés (matching watch name) -->
              <div v-if="filteredAndSortedArticles.some(article => articleMatchesWatchName(article))" class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Articles suggérés
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="article in filteredAndSortedArticles.filter(a => articleMatchesWatchName(a))"
                    :key="article.id"
                    class="flex items-start space-x-3 p-4 border-2 border-primary/30 rounded-lg hover:bg-primary/5 transition-colors bg-primary/5"
                  >
                    <input
                      type="checkbox"
                      :id="`article-all-${article.id}`"
                      :checked="selectedArticleIds.includes(article.id)"
                      @change="toggleArticle(article.id)"
                      class="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <label
                      :for="`article-all-${article.id}`"
                      class="flex-1 cursor-pointer"
                    >
                      <h3 class="text-lg font-semibold text-gray-900 mb-1">
                        {{ article.title }}
                      </h3>
                      <p class="text-sm text-gray-600 mb-2 line-clamp-2">
                        {{ getExcerpt(article.text) }}
                      </p>
                      <div v-if="article.categories && article.categories.length > 0" class="flex flex-wrap gap-2 mb-2">
                        <span
                          v-for="cat in article.categories"
                          :key="cat"
                          class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary"
                        >
                          {{ cat }}
                        </span>
                      </div>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(article.created_at) }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Section: Tous les articles -->
              <div v-if="filteredAndSortedArticles.some(article => !articleMatchesWatchName(article))" :class="{ 'mt-6': filteredAndSortedArticles.some(article => articleMatchesWatchName(article)) }">
                <h3 v-if="filteredAndSortedArticles.some(article => articleMatchesWatchName(article))" class="text-lg font-semibold text-gray-900 mb-3">
                  Tous les articles
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="article in filteredAndSortedArticles.filter(a => !articleMatchesWatchName(a))"
                    :key="article.id"
                    class="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      :id="`article-all-${article.id}`"
                      :checked="selectedArticleIds.includes(article.id)"
                      @change="toggleArticle(article.id)"
                      class="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <label
                      :for="`article-all-${article.id}`"
                      class="flex-1 cursor-pointer"
                    >
                      <h3 class="text-lg font-semibold text-gray-900 mb-1">
                        {{ article.title }}
                      </h3>
                      <p class="text-sm text-gray-600 mb-2 line-clamp-2">
                        {{ getExcerpt(article.text) }}
                      </p>
                      <div v-if="article.categories && article.categories.length > 0" class="flex flex-wrap gap-2 mb-2">
                        <span
                          v-for="cat in article.categories"
                          :key="cat"
                          class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary"
                        >
                          {{ cat }}
                        </span>
                      </div>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(article.created_at) }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State: Tous les articles -->
            <div v-else class="text-center py-16">
              <p class="text-gray-600">
                {{ searchQuery ? 'Aucun article ne correspond à votre recherche' : 'Aucun article visible disponible' }}
              </p>
            </div>
          </div>

          <!-- Tab Content: Articles liés -->
          <div v-else-if="activeTab === 'linked'">
            <div v-if="linkedArticles.length > 0" class="space-y-3">
              <div
                v-for="article in linkedArticles"
                :key="article.id"
                class="flex items-start space-x-3 p-4 border-2 border-primary/50 rounded-lg hover:bg-primary/5 transition-colors bg-primary/10"
              >
                <input
                  type="checkbox"
                  :id="`article-linked-${article.id}`"
                  :checked="selectedArticleIds.includes(article.id)"
                  @change="toggleArticle(article.id)"
                  class="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  :for="`article-linked-${article.id}`"
                  class="flex-1 cursor-pointer"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ article.title }}
                    </h3>
                    <span class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-primary text-white">
                      Lié
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2 line-clamp-2">
                    {{ getExcerpt(article.text) }}
                  </p>
                  <div v-if="article.categories && article.categories.length > 0" class="flex flex-wrap gap-2 mb-2">
                    <span
                      v-for="cat in article.categories"
                      :key="cat"
                      class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary"
                    >
                      {{ cat }}
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">
                    {{ formatDate(article.created_at) }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Empty State: Articles liés -->
            <div v-else class="text-center py-16">
              <p class="text-gray-600">
                {{ searchQuery ? 'Aucun article lié ne correspond à votre recherche' : 'Aucun article n\'est actuellement lié à cette montre' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div class="text-sm text-gray-600">
            {{ selectedArticleIds.length }} article{{ selectedArticleIds.length > 1 ? 's' : '' }} sélectionné{{ selectedArticleIds.length > 1 ? 's' : '' }}
          </div>
          <div class="flex space-x-3">
            <button
              @click="handleCancel"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="handleSave"
              :disabled="isSaving"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSaving">Enregistrement...</span>
              <span v-else>Sauvegarder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { getAllVisibleArticles } from '@/services/watchArticleService'
import { getWatchArticlesForAdmin } from '@/services/watchArticleService'
import { updateWatchArticles } from '@/services/watchArticleService'
import { getWatchByIdForAdmin } from '@/services/admin/adminWatchService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  watchId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close', 'saved'])

// State
const articles = ref([])
const selectedArticleIds = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref(null)
const searchQuery = ref('')
const watchName = ref('')
const activeTab = ref('all') // 'all' or 'linked'

// Helper: Extract words from watch name
const extractWatchNameWords = (name) => {
  if (!name) return []
  // Split by spaces, hyphens, and other separators, then filter out empty strings and short words
  return name
    .toLowerCase()
    .split(/[\s\-_]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2) // Filter out words shorter than 3 characters
}

// Helper: Check if article title contains any watch name word
const articleMatchesWatchName = (article) => {
  if (!watchName.value || !article.title) return false
  const watchWords = extractWatchNameWords(watchName.value)
  if (watchWords.length === 0) return false
  
  const articleTitleLower = article.title.toLowerCase()
  return watchWords.some((word) => articleTitleLower.includes(word))
}

// Computed: Filter and sort articles
const filteredAndSortedArticles = computed(() => {
  // Ensure we have articles loaded
  if (!articles.value || articles.value.length === 0) {
    return []
  }

  let filtered = [...articles.value]

  // Filter by search query
  const query = searchQuery.value?.trim()
  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter((article) => {
      const titleMatch = article.title?.toLowerCase().includes(lowerQuery) || false
      const textMatch = article.text?.toLowerCase().includes(lowerQuery) || false
      const categoriesMatch = Array.isArray(article.categories)
        ? article.categories.some((cat) => cat?.toLowerCase().includes(lowerQuery))
        : false
      return titleMatch || textMatch || categoriesMatch
    })
  }

  // Separate articles that match watch name and those that don't
  const matchingArticles = []
  const nonMatchingArticles = []
  
  filtered.forEach((article) => {
    if (articleMatchesWatchName(article)) {
      matchingArticles.push(article)
    } else {
      nonMatchingArticles.push(article)
    }
  })

  // Sort each group by creation date (most recent first)
  const sortByDate = (a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA // Descending order (newest first)
  }
  
  matchingArticles.sort(sortByDate)
  nonMatchingArticles.sort(sortByDate)

  // Return matching articles first, then non-matching articles
  return [...matchingArticles, ...nonMatchingArticles]
})

// Computed: Filter linked articles
const linkedArticles = computed(() => {
  if (!articles.value || articles.value.length === 0) {
    return []
  }

  // Filter to only articles that are currently linked
  let linked = articles.value.filter((article) =>
    selectedArticleIds.value.includes(article.id)
  )

  // Apply search query if present
  const query = searchQuery.value?.trim()
  if (query) {
    const lowerQuery = query.toLowerCase()
    linked = linked.filter((article) => {
      const titleMatch = article.title?.toLowerCase().includes(lowerQuery) || false
      const textMatch = article.text?.toLowerCase().includes(lowerQuery) || false
      const categoriesMatch = Array.isArray(article.categories)
        ? article.categories.some((cat) => cat?.toLowerCase().includes(lowerQuery))
        : false
      return titleMatch || textMatch || categoriesMatch
    })
  }

  // Sort by creation date (most recent first)
  linked.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA // Descending order (newest first)
  })

  return linked
})

// Methods
const loadArticles = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Charger le nom de la montre
    try {
      const watch = await getWatchByIdForAdmin(props.watchId)
      watchName.value = watch.name || ''
    } catch (err) {
      console.warn('Erreur lors du chargement du nom de la montre:', err)
      watchName.value = ''
    }

    // Charger tous les articles visibles
    const result = await getAllVisibleArticles(1, 1000) // Charger beaucoup d'articles
    articles.value = result.articles || []

    // Charger les articles déjà liés à cette montre
    const linkedArticles = await getWatchArticlesForAdmin(props.watchId)
    selectedArticleIds.value = linkedArticles.map((article) => article.id)
  } catch (err) {
    console.error('Erreur lors du chargement des articles:', err)
    error.value = err.message || 'Une erreur est survenue lors du chargement des articles'
  } finally {
    isLoading.value = false
  }
}

const toggleArticle = (articleId) => {
  const index = selectedArticleIds.value.indexOf(articleId)
  if (index > -1) {
    selectedArticleIds.value.splice(index, 1)
  } else {
    selectedArticleIds.value.push(articleId)
  }
}

const handleSave = async () => {
  try {
    isSaving.value = true
    error.value = null

    const result = await updateWatchArticles(props.watchId, selectedArticleIds.value)

    if (result.success) {
      emit('saved')
      emit('close')
    } else {
      error.value = result.error || 'Erreur lors de la sauvegarde'
    }
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    error.value = err.message || 'Une erreur est survenue lors de la sauvegarde'
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  emit('close')
}

const getExcerpt = (text) => {
  if (!text) return ''
  const cleanText = text.replace(/[#*`]/g, '').replace(/\n+/g, ' ').trim()
  return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Watch for modal opening
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadArticles()
  } else {
    // Reset state when closing
    selectedArticleIds.value = []
    error.value = null
    searchQuery.value = ''
    watchName.value = ''
    activeTab.value = 'all'
  }
})

onMounted(() => {
  if (props.isOpen) {
    loadArticles()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

