<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { scrollAnimation } from '@/animation'
import { handleFormSubmit, prepareSearchFormData } from '@/services/emailService'
import BudgetSlider from './BudgetSlider.vue'

defineOptions({ name: 'RechercheMontre' })

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')
const budgetRange = ref([1500, 15000])

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

          <div class="grid md:grid gap-6">
            <div>
              <label class="block text-sm font-medium text-text-main mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <label class="block text-sm font-medium text-text-main mb-2"
                >Marque souhaitée *</label
              >
              <input
                type="text"
                name="marque"
                required
                placeholder="Ex : Rolex, Patek Philippe..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2"
                >Modèle spécifique (si connu)</label
              >
              <input
                type="text"
                name="modele"
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
              <label class="block text-sm font-medium text-text-main mb-2">État souhaité *</label>
              <select
                name="etat"
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
            <label class="block text-sm font-medium text-text-main mb-2"
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
            {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande de recherche' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
