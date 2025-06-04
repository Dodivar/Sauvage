<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import scrollAnimation from '@/animation'
const router = useRouter()

function ToMerci() {
  router.push({ path: '/merci', query: { from: 'recherche' } })
}
onMounted(() => {
  scrollAnimation()
})
</script>

<template>
  <section class="py-16 gradient-bg">
    <div class="max-w-4xl mx-auto px-4">
      <div class="mb-12 text-center">
        <h1 class="text-3xl font-bold text-text-main">Recherche personnalisée de montre de luxe</h1>
        <h2 class="text-2xl font-bold text-text-main mb-4">Trouvez la montre de vos rêves</h2>
        <p class="text-lg text-gray-600">
          Notre équipe spécialisée vous aide à trouver des montres rares, discontinuées ou très
          demandées. Grâce à notre réseau de confiance, nous sécurisons pour vous l'achat d'une
          pièce d'exception, au meilleur prix et en toute sérénité.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form class="space-y-6" action="/merci.html" method="POST">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-text-main mb-2">Prénom Nom *</label>
              <input
                type="text"
                name="nom"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
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

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-text-main mb-2"
                >Budget approximatif (€)</label
              >
              <input
                type="number"
                name="budget"
                placeholder="Ex : 8000"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-main mb-2">État souhaité *</label>
              <select
                name="etat"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">Sélectionnez un état</option>
                <option value="Neuf">Neuf</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
                <option value="Peu importe">Peu importe</option>
              </select>
            </div>
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

          <button
            @click="ToMerci"
            class="w-full bg-primary text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Envoyer ma demande de recherche
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
