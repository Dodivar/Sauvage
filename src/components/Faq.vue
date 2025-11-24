<template>
  <section id="faq" class="py-20 gradient-bg">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-text-main mb-4">Questions fréquentes</h2>
        <p class="text-xl text-gray-600">Vos questions les plus fréquentes</p>
      </div>
      <div class="space-y-2">
        <div v-for="item in faqItems" :key="item.id" class="bg-white rounded-2xl shadow-sm">
          <button
            class="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset faq-button"
            @click="toggleFaq(item.id)"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">{{ item.question }}</h3>
              <svg
                class="h-5 w-5 transform transition-transform duration-300 ease-out"
                :class="{ 'rotate-180': activeFaqId === item.id }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          <div
            class="faq-content overflow-hidden"
            :style="{
              height: activeFaqId === item.id ? `${contentHeights[item.id]}px` : '0px',
            }"
          >
            <div
              :ref="(el) => setContentRef(el, item.id)"
              class="px-6 pb-6"
              v-html="item.answer"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const faqItems = [
  {
    id: 12,
    question: 'Comment fonctionne la recherche personnalisée ?',
    answer:
      'Notre service de recherche personnalisée vous aide à trouver la montre de vos rêves selon vos critères précis (marque, modèle, année, budget, état, etc.). Nous recherchons dans notre réseau et sur le marché pour vous proposer des options qui correspondent exactement à vos attentes. <strong>Vous ne payez que si nous trouvons la montre qui vous convient</strong>. C\'est un service sur-mesure qui vous fait gagner du temps et vous garantit l\'authenticité.',
  },
  {
    id: 13,
    question: 'Quels types de montres proposez-vous à la vente ?',
    answer:
      'Nous proposons une sélection de <strong>montres de collection et de prestige</strong> : Rolex, Omega, Cartier, Breitling, Audemars Piguet, Patek Philippe, Tag Heuer, Tudor, et bien d\'autres. Toutes nos montres sont authentifiées, vérifiées et accompagnées de leur historique. Nous mettons régulièrement à jour notre collection avec de nouveaux modèles.',
  },
  {
    id: 14,
    question: 'Puis-je voir les montres avant d\'acheter ?',
    answer:
      'Absolument ! Nous organisons des <strong>rendez-vous en main propre</strong> pour que vous puissiez examiner la montre, la porter et poser toutes vos questions. Nous croyons en la transparence et voulons que vous soyez entièrement satisfait de votre achat. Nous pouvons également vous envoyer des photos détaillées et des vidéos avant le rendez-vous.',
  },
  {
    id: 15,
    question: 'Les montres que vous vendez sont-elles authentiques et garanties ?',
    answer:
      'Oui, <strong>toutes nos montres sont authentifiées</strong> par nos experts avant d\'être mises en vente. Nous vérifions l\'authenticité, l\'état, et l\'historique de chaque pièce. Nous proposons également une garantie sur nos ventes et nous engageons sur la qualité et l\'authenticité de chaque montre que nous vendons.',
  },
  {
    id: 16,
    question: 'Combien coûte le service de recherche personnalisée ?',
    answer:
      'Le service de recherche personnalisée est <strong>gratuit jusqu\'à ce que nous trouvions la montre qui vous convient</strong>. Une fois que vous avez validé votre achat, des frais de service s\'appliquent. Nous vous fournissons un devis transparent avant de commencer la recherche, sans aucun engagement de votre part.',
  },
  {
    id: 1,
    question: "L'estimation est-elle vraiment gratuite ?",
    answer:
      "Oui, l'estimation est <strong>100 % gratuite et sans aucun engagement</strong>. Vous êtes libres d'accepter ou de refuser notre proposition, sans aucune pression.",
  },
  {
    id: 2,
    question: "Comment est calculée l'estimation de ma montre ?",
    answer:
      "Nous basons notre estimation sur l'état de votre montre, sa cote actuelle sur le marché (Chrono24, ventes aux enchères, etc.), sa rareté, et la présence de la boîte/papiers. Nous vous fournissons une estimation transparente et argumentée.",
  },
  {
    id: 3,
    question: 'Dois-je fournir la boîte et les papiers ?',
    answer:
      "Ce n'est pas obligatoire, mais cela peut <strong>augmenter la valeur</strong> de votre montre. Nous acceptons également les montres sans papiers, à condition qu'elles soient authentiques.",
  },
  {
    id: 4,
    question: 'Comment puis-je être sûr(e) que vous êtes un professionnel sérieux ?',
    answer:
      'Notre activité est déclarée (SIRET visible sur le site), et nous avons déjà accompagné de nombreux clients satisfaits. Nous vous invitons à consulter nos avis Google, à vérifier notre profil professionnel et à nous contacter pour toute question.',
  },
  {
    id: 5,
    question:
      'Je ne suis pas sûr(e) de vouloir vendre tout de suite. Puis-je quand même demander une estimation ?',
    answer:
      "Absolument. Vous pouvez obtenir une estimation et <strong>revenir vers nous plus tard</strong> si vous changez d'avis. Nous ne conservons vos données que pour vous recontacter si vous le souhaitez.",
  },
  {
    id: 6,
    question: 'Rachetez-vous toutes les marques de montres ?',
    answer:
      "Nous rachetons principalement les <strong>montres de marques</strong> comme Rolex, Omega, Cartier, Breitling, Audemars Piguet, Patek Philippe, etc. Si vous avez un doute, n'hésitez pas à nous envoyer les informations, nous vous répondrons rapidement.",
  },
  {
    id: 7,
    question: 'Comment se déroule le processus de vente ?',
    answer: `<ul class="list-decimal">
      <li>Vous remplissez notre formulaire en ligne (ou nous contactez directement).</li>
      <li>Nous vous envoyons une estimation sous 24h.</li>
      <li>Si vous acceptez, nous organisons la remise en main propre.</li>
      <li>Une fois la montre vérifiée, vous recevez le paiement immédiat.</li>
    </ul>`,
  },
  {
    id: 8,
    question: "Proposez vous d'autres services ?",
    answer:
      'Toute à fait ! Nous proposons également : La vente de montres de collection et de prestige Le dépôt-vente pour mettre en vente votre montre en toute sécurité La recherche personnalisée pour vous aider à trouver la montre de vos rêves selon vos critères spécifiques Notre expertise nous permet de vous offrir un service complet et sur-mesure, que vous souhaitiez vendre, acheter ou confier votre montre.',
  },
]

const activeFaqId = ref(null)
const contentHeights = ref({})
const contentRefs = ref({})

const setContentRef = (el, id) => {
  if (el) {
    contentRefs.value[id] = el
    // Calculer la hauteur réelle du contenu
    nextTick(() => {
      if (el) {
        contentHeights.value[id] = el.scrollHeight
      }
    })
  }
}

const toggleFaq = async (id) => {
  // Si on ouvre une FAQ, calculer la hauteur si nécessaire
  if (activeFaqId.value !== id) {
    await nextTick()
    const contentEl = contentRefs.value[id]
    if (contentEl && !contentHeights.value[id]) {
      contentHeights.value[id] = contentEl.scrollHeight
    }
  }
  activeFaqId.value = activeFaqId.value === id ? null : id
}

// Calculer les hauteurs au montage du composant
onMounted(async () => {
  await nextTick()
  faqItems.forEach((item) => {
    const contentEl = contentRefs.value[item.id]
    if (contentEl) {
      contentHeights.value[item.id] = contentEl.scrollHeight
    }
  })
})
</script>

<script>
export default {
  name: 'FaqSection',
}
</script>

<style scoped>
.faq-content {
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height;
}

.faq-button {
  transition: background-color 0.2s ease-in-out;
}

.faq-button:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>

<!--
  Ce composant doit être importé et utilisé comme <FaqSection /> dans les autres fichiers.
-->
