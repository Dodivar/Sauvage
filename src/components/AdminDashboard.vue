<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllWatchesForAdmin, deleteWatch, toggleWatchAvailability, markWatchAsSold } from '@/services/adminWatchService'
import AdminHeader from './AdminHeader.vue'

const router = useRouter()

// State
const watches = ref([])
const isLoading = ref(true)
const error = ref(null)
const success = ref(null)
const searchQuery = ref('')
const selectedBrand = ref('')
const showDeleteConfirm = ref(false)
const watchToDelete = ref(null)
const showSoldConfirm = ref(false)
const watchToMarkAsSold = ref(null)
const activeTab = ref('available') // 'available', 'unavailable', 'sold', ou 'all'

// Computed
const availableBrands = computed(() => {
  const brands = [...new Set(watches.value.map((watch) => watch.brand))]
  return brands.sort()
})

const filteredWatches = computed(() => {
  let filtered = watches.value

  // Filter by tab selection
  if (activeTab.value === 'available') {
    filtered = filtered.filter((watch) => {
      const isAvailable = watch.is_available !== undefined ? watch.is_available : true
      return isAvailable
    })
  } else if (activeTab.value === 'unavailable') {
    filtered = filtered.filter((watch) => watch.is_available === false)
  } else if (activeTab.value === 'sold') {
    filtered = filtered.filter((watch) => watch.is_sold === true)
  }
  // 'all' shows all watches, no filter needed

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (watch) =>
        watch.name?.toLowerCase().includes(query) ||
        watch.brand?.toLowerCase().includes(query) ||
        watch.model?.toLowerCase().includes(query) ||
        watch.reference?.toLowerCase().includes(query) ||
        watch.ad_code?.toLowerCase().includes(query),
    )
  }

  // Filter by brand
  if (selectedBrand.value) {
    filtered = filtered.filter((watch) => watch.brand === selectedBrand.value)
  }

  return filtered
})

const totalWatches = computed(() => watches.value.length)

const soldWatchesCount = computed(() => {
  return watches.value.filter((watch) => watch.is_sold === true).length
})

const availableWatchesValue = computed(() => {
  return watches.value
    .filter((watch) => watch.is_available !== false)
    .reduce((sum, watch) => sum + (parseFloat(watch.price) || 0), 0)
})

const unavailableWatchesValue = computed(() => {
  return watches.value
    .filter((watch) => watch.is_available === false)
    .reduce((sum, watch) => sum + (parseFloat(watch.price) || 0), 0)
})

const soldWatchesValue = computed(() => {
  return watches.value
    .filter((watch) => watch.is_sold === true)
    .reduce((sum, watch) => sum + (parseFloat(watch.price) || 0), 0)
})

const soldWatchesValueLastMonth = computed(() => {
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  
  return watches.value
    .filter((watch) => {
      if (watch.is_sold !== true || !watch.sale_date) return false
      const saleDate = new Date(watch.sale_date)
      return saleDate >= oneMonthAgo && saleDate <= now
    })
    .reduce((sum, watch) => sum + (parseFloat(watch.price) || 0), 0)
})

// Methods
const loadWatches = async () => {
  try {
    isLoading.value = true
    error.value = null
    const data = await getAllWatchesForAdmin()
    watches.value = data
  } catch (err) {
    console.error('Erreur lors du chargement des montres:', err)
    error.value = err.message || 'Une erreur est survenue lors du chargement des montres'
  } finally {
    isLoading.value = false
  }
}

const handleEdit = (watchId) => {
  router.push(`/admin/watches/${watchId}/edit`)
}

const handleDelete = (watch) => {
  watchToDelete.value = watch
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!watchToDelete.value) return

  try {
    const result = await deleteWatch(watchToDelete.value.id)
    if (result.success) {
      await loadWatches()
      showDeleteConfirm.value = false
      watchToDelete.value = null
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
  watchToDelete.value = null
}

const handleToggleAvailability = async (watch) => {
  try {
    const result = await toggleWatchAvailability(watch.id)
    if (result.success) {
      // Mettre à jour le statut localement
      watch.is_available = result.data.is_available
    } else {
      error.value = result.error || 'Erreur lors du changement de statut'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors du changement de statut'
    console.error(err)
  }
}

const handleMarkAsSold = (watch) => {
  watchToMarkAsSold.value = watch
  showSoldConfirm.value = true
}

const confirmMarkAsSold = async () => {
  if (!watchToMarkAsSold.value) return

  try {
    const result = await markWatchAsSold(watchToMarkAsSold.value.id)
    if (result.success) {
      // Recharger les montres pour afficher la date de mise en vente
      await loadWatches()
      showSoldConfirm.value = false
      watchToMarkAsSold.value = null
    } else {
      error.value = result.error || 'Erreur lors du marquage comme vendue'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors du marquage comme vendue'
    console.error(err)
  }
}

const cancelMarkAsSold = () => {
  showSoldConfirm.value = false
  watchToMarkAsSold.value = null
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
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
  await loadWatches()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Top Section -->
      <AdminHeader title="Administration" />
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-600 mb-1">Valeur totale en stock</div>
          <div class="text-3xl font-bold text-text-main">{{ formatPrice(availableWatchesValue) }}</div>
          <div class="text-xs text-gray-500 mt-2">Hors stock : {{ formatPrice(unavailableWatchesValue) }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-600 mb-1">Valeur totale vendues</div>
          <div class="text-3xl font-bold text-text-main">{{ formatPrice(soldWatchesValue) }}</div>
          <div class="text-xs text-gray-500 mt-2">Dernier mois : {{ formatPrice(soldWatchesValueLastMonth) }}</div>
        </div>
         <div class="bg-white rounded-lg shadow p-6">
           <div class="text-sm text-gray-600 mb-1">Total montres</div>
           <div class="text-3xl font-bold text-text-main">{{ totalWatches }}</div>
           <div class="text-xs text-gray-500 mt-2">Vendues : {{ soldWatchesCount }}</div>
         </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="border-b border-gray-200 overflow-x-auto hide-scrollbar">
          <nav class="flex -mb-px min-w-max">
            <button
              @click="activeTab = 'available'"
              :class="[
                activeTab === 'available'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
              ]"
            >
              Montres en stock
              <span class="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {{ watches.filter((w) => w.is_available !== false).length }}
              </span>
            </button>
            <button
              @click="activeTab = 'unavailable'"
              :class="[
                activeTab === 'unavailable'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
              ]"
            >
              Montres hors stock
              <span class="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {{ watches.filter((w) => w.is_available === false).length }}
              </span>
            </button>
            <button
              @click="activeTab = 'sold'"
              :class="[
                activeTab === 'sold'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
              ]"
            >
              Montres vendues
              <span class="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {{ watches.filter((w) => w.is_sold === true).length }}
              </span>
            </button>
            <button
              @click="activeTab = 'all'"
              :class="[
                activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
              ]"
            >
              Toutes les montres
              <span class="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {{ watches.length }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher (nom, marque, modèle, référence, code)..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <select
              v-model="selectedBrand"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Toutes les marques</option>
              <option v-for="brand in availableBrands" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
          </div>
          <button
            @click="router.push('/admin/watches/new')"
            class="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            + Ajouter une montre
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
        <p class="text-gray-600">Chargement des montres...</p>
      </div>

      <!-- Watches Table -->
      <div v-else-if="filteredWatches.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marque
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modèle
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut vente
                </th> -->
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="watch in filteredWatches" :key="watch.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-16 w-16 bg-gray-200 rounded overflow-hidden">
                    <img
                      v-if="watch.images && watch.images.length > 0"
                      :src="watch.images[0]"
                      :alt="watch.name"
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                      Pas d'image
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-40">
                  <div class="truncate" :title="watch.name">
                    {{ watch.name }}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-40">
                  <div class="truncate" :title="watch.brand">
                    {{ watch.brand }}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-40">
                  <div class="truncate" :title="watch.model">
                    {{ watch.model }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ formatPrice(watch.price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div v-if="watch.sale_date" class="text-purple-600 font-medium">
                    Vendue: {{ formatDate(watch.sale_date) }}
                  </div>
                  <div v-else class="text-gray-500">
                    Créée: {{ formatDate(watch.created_at) }}
                  </div>
                </td>
               <!--  <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      watch.is_available !== false
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                      'px-2 py-1 text-xs font-semibold rounded-full',
                    ]"
                  >
                    {{ watch.is_available !== false ? 'En stock' : 'Hors stock' }}
                  </span>
                </td> -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      watch.is_sold === true
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800',
                      'px-2 py-1 text-xs font-semibold rounded-full',
                    ]"
                  >
                  {{ watch.is_sold === true ? 'Vendue' : 'En vente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="router.push(`/watch/${watch.id}`)"
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
                      @click="handleEdit(watch.id)"
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
                      @click="handleToggleAvailability(watch)"
                      :class="[
                        watch.is_available !== false
                          ? 'text-orange-600 hover:text-orange-900'
                          : 'text-green-600 hover:text-green-900',
                      ]"
                      :title="watch.is_available !== false ? 'Marquer comme hors stock' : 'Marquer comme en stock'"
                    >
                      <svg
                        v-if="watch.is_available !== false"
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      v-if="watch.is_sold !== true"
                      @click="handleMarkAsSold(watch)"
                      class="text-purple-600 hover:text-purple-900"
                      title="Marquer comme vendue"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <button
                      v-if="watch.is_available === false"
                      @click="handleDelete(watch)"
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
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-40">
                  <div class="truncate" :title="watch.ad_code">
                    {{ watch.ad_code }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p class="text-sm text-gray-500 italic">
            {{ filteredWatches.length }} montre{{ filteredWatches.length > 1 ? 's' : '' }} affichée{{ filteredWatches.length > 1 ? 's' : '' }}
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
        <h3 class="text-xl text-gray-600 mb-2">Aucune montre trouvée</h3>
        <p class="text-gray-500 mb-6">
          {{ searchQuery || selectedBrand ? 'Essayez de modifier vos critères de recherche' : 'Commencez par ajouter une montre' }}
        </p>
        <button
          v-if="!searchQuery && !selectedBrand"
          @click="router.push('/admin/watches/new')"
          class="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          + Ajouter une montre
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
          Êtes-vous sûr de vouloir supprimer la montre <strong>{{ watchToDelete?.name }}</strong> ? Cette action est irréversible.
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

    <!-- Mark as Sold Confirmation Modal -->
    <div
      v-if="showSoldConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelMarkAsSold"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirmer la vente</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir marquer la montre <strong>{{ watchToMarkAsSold?.name }}</strong> comme vendue ? Cette action est <strong class="text-red-600">irréversible</strong>.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelMarkAsSold"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="confirmMarkAsSold"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Confirmer la vente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

