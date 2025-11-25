<script setup>
import { ref, computed, onMounted } from 'vue'
import { Chart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { getWatchStatsByDay } from '@/services/adminWatchService'
import { getArticleStatsByDay } from '@/services/adminArticleService'
import AdminHeader from './AdminHeader.vue'

// Enregistrer les composants Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

// State
const stats = ref([])
const articleStats = ref([])
const isLoading = ref(true)
const error = ref(null)

// Computed
const chartData = computed(() => {
  if (!stats.value || stats.value.length === 0) {
    return {
      labels: [],
      datasets: [],
    }
  }

  return {
    labels: stats.value.map((item) => {
      // Formater la date pour l'affichage (DD/MM/YYYY)
      const date = new Date(item.date)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }),
    datasets: [
      {
        type: 'line',
        label: 'Montres créées',
        data: stats.value.map((item) => item.created),
        borderColor: 'rgb(34, 197, 94)', // green-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Montres vendues',
        data: stats.value.map((item) => item.sold),
        borderColor: 'rgb(239, 68, 68)', // red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Valeur totale vendue (€)',
        data: stats.value.map((item) => item.totalValue || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500 with higher opacity
        borderColor: 'rgb(59, 130, 246)', // blue-500
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  }
})

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.dataset.type === 'bar') {
              // Formater la valeur en euros pour les barres
              label += new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y)
            } else {
              label += context.parsed.y
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        title: {
          display: true,
          text: 'Nombre de montres',
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)
          },
        },
        title: {
          display: true,
          text: 'Valeur (€)',
        },
      },
    },
  }
})

const totalWatches = computed(() => {
  return stats.value.reduce((sum, item) => sum + item.created, 0)
})

const totalSold = computed(() => {
  return stats.value.reduce((sum, item) => sum + item.sold, 0)
})

const totalValueSold = computed(() => {
  return stats.value.reduce((sum, item) => sum + (item.totalValue || 0), 0)
})

const averagePerDay = computed(() => {
  if (stats.value.length === 0) return 0
  return (totalWatches.value / stats.value.length).toFixed(2)
})

const averageSoldPerDay = computed(() => {
  if (stats.value.length === 0) return 0
  return (totalSold.value / stats.value.length).toFixed(2)
})

const maxDay = computed(() => {
  if (stats.value.length === 0) return null
  const maxItem = stats.value.reduce((max, item) => (item.created > max.created ? item : max), stats.value[0])
  return {
    date: new Date(maxItem.date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    count: maxItem.created,
  }
})

const maxSoldDay = computed(() => {
  if (stats.value.length === 0) return null
  const maxItem = stats.value.reduce((max, item) => (item.sold > max.sold ? item : max), stats.value[0])
  if (maxItem.sold === 0) return null
  return {
    date: new Date(maxItem.date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    count: maxItem.sold,
  }
})

const dateRange = computed(() => {
  if (stats.value.length === 0) return null
  const firstDate = new Date(stats.value[0].date)
  const lastDate = new Date(stats.value[stats.value.length - 1].date)
  return {
    start: firstDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    end: lastDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
  }
})

// Computed pour le graphique des articles
const articleChartData = computed(() => {
  if (!articleStats.value || articleStats.value.length === 0) {
    return {
      labels: [],
      datasets: [],
    }
  }

  return {
    labels: articleStats.value.map((item) => {
      // Formater la date pour l'affichage (DD/MM/YYYY)
      const date = new Date(item.date)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }),
    datasets: [
      {
        type: 'bar',
        label: 'Articles créés',
        data: articleStats.value.map((item) => item.created),
        backgroundColor: 'rgba(168, 85, 247, 0.6)', // purple-500
        borderColor: 'rgb(168, 85, 247)', // purple-500
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Articles vus',
        data: articleStats.value.map((item) => item.views || 0),
        borderColor: 'rgb(251, 146, 60)', // orange-500
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(251, 146, 60)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y',
      },
    ],
  }
})

const articleChartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            label += context.parsed.y
            return label
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        title: {
          display: true,
          text: 'Nombre',
        },
      },
    },
  }
})

// Methods
const loadStats = async () => {
  try {
    isLoading.value = true
    error.value = null
    const [watchData, articleData] = await Promise.all([
      getWatchStatsByDay(),
      getArticleStatsByDay(),
    ])
    stats.value = watchData
    articleStats.value = articleData
  } catch (err) {
    console.error('Erreur lors du chargement des statistiques:', err)
    error.value = err.message || 'Une erreur est survenue lors du chargement des statistiques'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadStats()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Top Section -->
      <AdminHeader title="Statistiques des montres" :show-back-button="true" />

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
        <button @click="error = null" class="ml-4 text-red-500 hover:text-red-700">×</button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-600">Chargement des statistiques...</p>
      </div>

      <!-- Stats Content -->
      <div v-else>
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-1">Total montres créées</div>
            <div class="text-3xl font-bold text-text-main">{{ totalWatches }}</div>
            <div class="text-xs text-gray-500 mt-2">Toutes périodes confondues</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-1">Total montres vendues</div>
            <div class="text-3xl font-bold text-red-600">{{ totalSold }}</div>
            <div class="text-xs text-gray-500 mt-2">Toutes périodes confondues</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-1">Moyenne créées/jour</div>
            <div class="text-3xl font-bold text-text-main">{{ averagePerDay }}</div>
            <div class="text-xs text-gray-500 mt-2">Sur {{ stats.length }} jour{{ stats.length > 1 ? 's' : '' }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-1">Moyenne vendues/jour</div>
            <div class="text-3xl font-bold text-red-600">{{ averageSoldPerDay }}</div>
            <div class="text-xs text-gray-500 mt-2">Sur {{ stats.length }} jour{{ stats.length > 1 ? 's' : '' }}</div>
          </div>
        </div>

        <!-- Additional Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-1">Meilleur jour (créations)</div>
            <div class="text-3xl font-bold text-text-main" v-if="maxDay">{{ maxDay.count }}</div>
            <div class="text-xs text-gray-500 mt-2" v-if="maxDay">Le {{ maxDay.date }}</div>
            <div v-else class="text-gray-400">Aucune donnée</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-1">Meilleur jour (ventes)</div>
            <div class="text-3xl font-bold text-red-600" v-if="maxSoldDay">{{ maxSoldDay.count }}</div>
            <div class="text-xs text-gray-500 mt-2" v-if="maxSoldDay">Le {{ maxSoldDay.date }}</div>
            <div v-else class="text-gray-400">Aucune vente</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-1">Valeur totale vendue</div>
            <div class="text-3xl font-bold text-blue-600">
              {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalValueSold) }}
            </div>
            <div class="text-xs text-gray-500 mt-2">Toutes périodes confondues</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-600 mb-1">Période</div>
            <div class="text-lg font-semibold text-text-main" v-if="dateRange">
              {{ dateRange.start }}
            </div>
            <div class="text-xs text-gray-500 mt-1" v-if="dateRange">au {{ dateRange.end }}</div>
            <div v-else class="text-gray-400">Aucune donnée</div>
          </div>
        </div>

        <!-- Chart -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Évolution des montres créées et vendues</h2>
          <div v-if="stats.length === 0" class="text-center py-16">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-xl text-gray-600 mb-2">Aucune donnée disponible</h3>
            <p class="text-gray-500">Aucune montre n'a encore été créée.</p>
          </div>
          <div v-else class="h-96">
            <Chart :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Article Chart -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Évolution des articles créés et vus</h2>
          <div v-if="articleStats.length === 0" class="text-center py-16">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="text-xl text-gray-600 mb-2">Aucune donnée disponible</h3>
            <p class="text-gray-500">Aucun article n'a encore été créé.</p>
          </div>
          <div v-else class="h-96">
            <Chart :data="articleChartData" :options="articleChartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

