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
                class="h-5 w-5 transform transition-transform duration-300"
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
            class="faq-content overflow-hidden transition-all duration-300 ease-in-out"
            :class="{
              'max-h-0': activeFaqId !== item.id,
              'max-h-[500px]': activeFaqId === item.id,
            }"
          >
            <div class="px-6 pb-6" v-html="item.answer"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const faqItems = [
  {
    id: 1,
    question: "L'estimation est-elle vraiment gratuite ?",
    answer:
      "Oui, l'estimation est <strong>100 % gratuite et sans aucun engagement</strong>. Vous êtes libre d'accepter ou de refuser notre proposition, sans aucune pression.",
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

const toggleFaq = (id) => {
  activeFaqId.value = activeFaqId.value === id ? null : id
}
</script>

<script>
export default {
  name: 'FaqSection',
}
</script>

<style scoped>
.faq-content {
  transition: max-height 0.3s ease-in-out;
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
