<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { scrollAnimation } from '@/animation'
import { handleFormSubmit, prepareSearchFormData } from '@/services/emailService'
import BudgetSlider from './BudgetSlider.vue'

defineOptions({ name: 'RechercheMontre' })

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')
const budgetRange = ref([1500, 15000])
const loadingDots = ref('')
let loadingInterval = null

watch(isSubmitting, (val) => {
  if (val) {
    let count = 0
    loadingInterval = setInterval(() => {
      count = (count + 1) % 4
      loadingDots.value = '.'.repeat(count)
    }, 400)
  } else {
    loadingDots.value = ''
    if (loadingInterval) clearInterval(loadingInterval)
  }
})

async function submitSearchForm(event) {
  event.preventDefault()
  isSubmitting.value = true
  errorMessage.value = ''

  await handleFormSubmit(
    event.target,
    prepareSearchFormData,
    () => {
      ToMerci()
    },
    (error) => {
      errorMessage.value =
        "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer."
      console.error('Erreur:', error)
    },
  ).finally(() => {
    isSubmitting.value = false
  })
}

function ToMerci() {
  router.push({ path: '/merci', query: { from: 'recherche' } })
}

onMounted(() => {
  scrollAnimation()
})
</script>

<template>
  <section class="py-16 gradient-bg" name="RechercheMontre">
    <div class="max-w-4xl mx-auto px-4">
      <div class="mb-12 text-center">
        <h1 class="text-3xl font-bold text-text-main">Recherche personnalisée de montre</h1>
        <h2 class="text-2xl font-bold text-text-main mb-4">Trouvez la montre de vos rêves</h2>
        <p class="text-lg text-gray-600">
          Notre équipe spécialisée vous aide à trouver des montres rares, discontinuées ou très
          demandées. Grâce à notre réseau de confiance, nous sécurisons pour vous l'achat d'une
          pièce d'exception, au meilleur prix et en toute sérénité.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form class="space-y-6" @submit="submitSearchForm">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="nickname"
                >Prénom *</label
              >
              <input
                type="text"
                name="nickname"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="name">Nom *</label>
              <input
                type="text"
                name="name"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="email"
                >Email *</label
              >
              <input
                name="email"
                type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="tel"
                >Téléphone</label
              >
              <input
                name="tel"
                type="tel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
          <!-- Choix du mode de recontact -->
          <div class="w-full">
            <label class="block text-sm font-medium text-text-main mb-2"
              >Comment souhaitez-vous être recontacté ?</label
            >
            <div class="flex flex-col md:flex-row gap-4 w-full">
              <label class="inline-flex items-center w-full">
                <input
                  type="checkbox"
                  class="form-checkbox accent-primary"
                  name="contact_mode[]"
                  value="pas de préférence"
                />
                <span class="ml-2">Pas de préférence</span>
              </label>
              <label class="inline-flex items-center w-full">
                <input
                  type="checkbox"
                  class="form-checkbox accent-primary"
                  name="contact_mode[]"
                  value="email"
                />
                <span class="ml-2">Email</span>
              </label>
              <label class="inline-flex items-center w-full">
                <input
                  type="checkbox"
                  class="form-checkbox accent-primary"
                  name="contact_mode[]"
                  value="whatsapp"
                />
                <span class="ml-2">WhatsApp</span>
              </label>
              <label class="inline-flex items-center w-full">
                <input
                  type="checkbox"
                  class="form-checkbox accent-primary"
                  name="contact_mode[]"
                  value="sms"
                />
                <span class="ml-2">SMS</span>
              </label>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="brand"
                >Marque souhaitée *</label
              >
              <input
                type="text"
                name="brand"
                required
                placeholder="Ex : Rolex, Patek Philippe..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="model"
                >Modèle spécifique (si connu)</label
              >
              <input
                type="text"
                name="model"
                placeholder="Ex : Daytona, Nautilus..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-text-main mb-10"
              >Budget approximatif (€)</label
            >
            <BudgetSlider v-model="budgetRange" />

            <input type="hidden" name="budget_min" :value="budgetRange[0]" />
            <input type="hidden" name="budget_max" :value="budgetRange[1]" />
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="condition"
                >État souhaité *</label
              >
              <select
                name="condition"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="Neuf">Neuf</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
                <option value="Peu importe">Peu importe</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2"
                >Délai souhaité pour l'acquisition</label
              >
              <input
                type="text"
                name="delai"
                placeholder="Ex : 1 mois, dès que possible..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-text-main mb-2" for="message"
              >Commentaires ou précisions supplémentaires</label
            >
            <textarea
              name="message"
              rows="4"
              placeholder="Boîte et papiers souhaités ? Préférence pour un vendeur local ?..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <p class="text-sm text-gray-600 mb-4 italic">
            * Les champs marqués d'un astérisque sont obligatoires
          </p>

          <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-primary text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? `Envoi en cours${loadingDots}` : 'Envoyer ma demande de recherche' }}
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Section liens vers nos services -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-text-main mb-4">Nos autres services</h2>
        <p class="text-lg text-gray-600">
          Découvrez nos autres services spécialisés dans l'univers des montres de luxe
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Estimation de montre -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-text-main mb-4">Estimation de montre</h3>
            <p class="text-gray-600 mb-6">
              Obtenez une estimation précise et gratuite de votre montre. Notre expertise vous garantit une évaluation juste de la valeur de votre pièce.
            </p>
            <RouterLink
              to="/#estimation"
              class="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
            >
              Estimer ma montre
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </div>

        <!-- Nos services -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-text-main mb-4">Nos services</h3>
            <p class="text-gray-600 mb-6">
              Découvrez notre gamme complète de services : rachat, vente, expertise et conseil personnalisé pour vos montres de luxe.
            </p>
            <RouterLink
              to="/#services"
              class="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
            >
              Découvrir nos services
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Call-to-action supplémentaire -->
      <div class="mt-12 text-center">
        <div class="bg-primary rounded-2xl p-8 text-white">
          <h3 class="text-2xl font-bold mb-4">Besoin d'aide ?</h3>
          <p class="text-lg mb-6">
            Notre équipe d'experts est là pour vous accompagner dans tous vos projets de montres de luxe.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/+33612843926"
              class="inline-flex items-center bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="tel:0123456789"
              class="inline-flex items-center bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Appeler
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
