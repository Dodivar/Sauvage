<template>
  <div class="min-h-screen">
    <section class="py-20 gradient-bg">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">
            Estimation gratuite de votre montre
          </h1>
          <p class="text-xl text-gray-600">
            Remplissez ce formulaire pour recevoir une estimation personnalisée
          </p>
        </div>
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <form class="space-y-6" id="form-estimation" @submit="submitEstimationForm">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="nickname"
                  >Prénom *</label
                >
                <input
                  name="nickname"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="name">NOM *</label>
                <input
                  name="name"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
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
            <div class="grid md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="brand"
                  >Marque *</label
                >
                <input
                  name="brand"
                  type="text"
                  placeholder="Ex: Rolex, Patek Philippe..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="model"
                  >Modèle</label
                >
                <input
                  name="model"
                  type="text"
                  placeholder="Ex: Submariner, Nautilus..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-main mb-2" for="year">Année</label>
                <input
                  name="year"
                  type="number"
                  min="1900"
                  max="2099"
                  step="1"
                  placeholder="2020"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <label
                  class="block text-sm font-medium text-text-main mb-2"
                  title="Le numéro de série sera examiné pour garantir l'authenticité de la montre"
                  for="serienumber"
                  >Numéro de série</label
                >
                <TooltipInfo
                  tooltip-text="Le numéro de série permet de garantir l'authenticité de la montre. Il se trouve généralement sur le boîtier ou les papiers d'origine."
                />
              </div>
              <input
                name="serienumber"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="possession"
                >État de possession *</label
              >
              <select
                name="possession"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="Full set (boîte + papiers)">Full set (boîte + papiers)</option>
                <option value="Papiers d'origine">Papiers d'origine</option>
                <option value="Boîte d'origine">Boîte d'origine</option>
                <option value="Montre seule">Montre seule</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="etat"
                >État général *</label
              >
              <select
                name="etat"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="Neuf/jamaus portée">Neuf/jamais portée</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
                <option value="Usage courant">Usage courant</option>
              </select>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <label class="block text-sm font-medium text-text-main mb-2"
                  >Photos de votre montre</label
                >
                <TooltipInfo
                  tooltip-text="Ajoutez des photos nettes de la montre (face, dos, bracelet, papiers, boîte, etc.). Cela aide à une estimation plus précise."
                />
              </div>
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors"
              >
                <input
                  name="attachments"
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  class="hidden"
                  id="attachments"
                />
                <label for="attachments" class="cursor-pointer">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400 mb-4"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-primary font-medium">Cliquez pour ajouter des photos</span>
                  <p class="text-gray-500 text-sm mt-1">PNG, JPG, PDF jusqu'à 10MB</p>
                </label>
              </div>
              <div
                class="w-full bg-green-50 border-l-4 border-primary text-primary font-semibold rounded-lg p-4 mt-4 text-center shadow-sm"
              >
                Merci d'ajouter <span class="underline">une photo de la preuve d'achat</span> de la
                montre (facture, reçu, etc.).
              </div>
              <div id="preview-attachments-container"></div>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2" for="message"
                >Message (optionnel)</label
              >
              <textarea
                name="message"
                rows="4"
                placeholder="Précisez si vous êtes le premier propriétaire de la montre, son histoire..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
              {{ isSubmitting ? `Envoi en cours${loadingDots}` : 'Faire estimer ma montre' }}
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
          Découvrez nos autres services spécialisés dans l'univers des montres
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        
        <!-- Lien vers la collection de montres -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="inline-block w-8 h-8 text-white align-middle" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="9.5" y="1.5" width="5" height="3" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="9.5" y="19.5" width="5" height="3" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M12 8v4l2.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </div>
            <h3 class="text-2xl font-bold text-text-main mb-4">Notre collection de montres</h3>
            <p class="text-gray-600 mb-6">
              Parcourez notre sélection de montres de prestige actuellement disponibles à la vente.
            </p>
            <RouterLink
              to="/collection"
              class="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
            >
              Découvrir la collection
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </div>
        
        <!-- Recherche personnalisée de montre -->
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-text-main mb-4">Recherche personnalisée de montre</h3>
            <p class="text-gray-600 mb-6">
              Trouvez la montre de vos rêves grâce à notre service de recherche personnalisée. Notre équipe spécialisée vous aidera à trouver votre montre de rêve.
            </p>
            <RouterLink
              to="/recherche"
              class="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
            >
              Lancer ma recherche
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
            Notre équipe est là pour vous accompagner dans tous vos projets de montres.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              :href="'https://wa.me/' + WHATSAPP_NUMBER"
              class="inline-flex items-center bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              WhatsApp
            </a>
            <a
              :href="'mailto:' + EMAIL_CONTACT"
              class="inline-flex items-center bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { handleFormSubmit, prepareEstimationFormData } from '@/services/emailService'
import { createPreviewElement } from '@/services/imagePreviewService'
import TooltipInfo from './TooltipInfo.vue'
import { WHATSAPP_NUMBER, EMAIL_CONTACT } from '@/config'
const router = useRouter()

const isSubmitting = ref(false)
const errorMessage = ref('')
const loadingDots = ref('')
let loadingInterval = null

async function submitEstimationForm(event) {
  event.preventDefault()
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await handleFormSubmit(
      event.target,
      prepareEstimationFormData,
      () => {
        ToMerci()
      },
      (error) => {
        errorMessage.value =
          error.message ||
          "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer."
        console.error('Erreur détaillée:', error)
      },
    )
  } catch (error) {
    errorMessage.value =
      error.message ||
      "Une erreur s'est produite lors de l'envoi du formulaire. Veuillez réessayer."
    console.error('Erreur détaillée:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Gestion des points de chargement
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

  // Preview photos files
  const fileInput = document.getElementById('attachments')
  const previewContainer = document.getElementById('preview-attachments-container')
  let selectedFiles = []

  function updatePreview() {
    previewContainer.innerHTML = ''
    // Trie : PDF d'abord, puis images
    const pdfFiles = selectedFiles.filter((f) => f.type === 'application/pdf')
    const imgFiles = selectedFiles.filter(
      (f) =>
        f.type.startsWith('image/') ||
        f.name.toLowerCase().endsWith('.heic') ||
        f.type === 'image/heic',
    )
    const allFiles = [...pdfFiles, ...imgFiles]
    allFiles.forEach(async (file) => {
      const previewEl = await createPreviewElement(file)
      // Ajout du bouton de suppression
      const removeBtn = document.createElement('button')
      removeBtn.type = 'button'
      removeBtn.innerHTML = '&times;'
      removeBtn.title = 'Supprimer'
      removeBtn.style.position = 'absolute'
      removeBtn.style.top = '4px'
      removeBtn.style.right = '4px'
      removeBtn.style.background = '#fff'
      removeBtn.style.color = '#22c55e'
      removeBtn.style.border = 'none'
      removeBtn.style.borderRadius = '50%'
      removeBtn.style.width = '24px'
      removeBtn.style.height = '24px'
      removeBtn.style.fontSize = '18px'
      removeBtn.style.cursor = 'pointer'
      removeBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'
      removeBtn.addEventListener('click', () => {
        // Trouver l'index réel dans selectedFiles
        const realIdx = selectedFiles.findIndex((f) => f.name === file.name && f.size === file.size)
        if (realIdx !== -1) {
          selectedFiles.splice(realIdx, 1)
          updatePreview()
          updateInputFiles()
        }
      })
      previewEl.appendChild(removeBtn)
      previewContainer.appendChild(previewEl)
    })
  }

  function updateInputFiles() {
    // Crée un nouvel objet DataTransfer pour mettre à jour l'input file
    const dataTransfer = new DataTransfer()
    selectedFiles.forEach((f) => dataTransfer.items.add(f))
    fileInput.files = dataTransfer.files
  }

  fileInput.addEventListener('change', function () {
    const newFiles = Array.from(fileInput.files)
    // Ajoute les nouveaux fichiers sans doublons (par nom + taille)
    newFiles.forEach((f) => {
      if (!selectedFiles.some((sf) => sf.name === f.name && sf.size === f.size)) {
        selectedFiles.push(f)
      }
    })
    updatePreview()
    updateInputFiles()
  })

  // Initial preview si déjà des fichiers (rare mais possible)
  if (fileInput.files.length > 0) {
    selectedFiles = Array.from(fileInput.files)
    updatePreview()
  }
})

function ToMerci() {
  router.push({ path: '/merci', query: { from: 'estimation' } })
}
</script>

