# Composants de Paiement

Ce dossier contient les composants Vue.js liés au processus de paiement Stripe pour l'achat de montres.

## 📁 Structure

```
payment/
├── PaymentSuccess.vue    # Page de confirmation après un paiement réussi
├── PaymentCancel.vue     # Page affichée lorsque l'utilisateur annule le paiement
└── README.md             # Ce fichier
```

## 🎯 Composants

### PaymentSuccess.vue

**Route :** `/paiement-succes`

**Description :**  
Composant affiché après un paiement Stripe réussi. Il confirme à l'utilisateur que sa commande a été validée et lui fournit les informations nécessaires.

**Paramètres de requête requis :**

- `session_id` : ID de la session Stripe (vérifié par le backend)
- `watch_id` : ID de la montre achetée

**Fonctionnalités :**

- Affichage d'un message de confirmation
- Affichage des détails de la commande (session_id et watch_id)
- Informations sur les prochaines étapes (email de confirmation, contact de l'équipe)
- Liens de navigation vers la collection ou l'accueil

**Sécurité :**

- L'accès à cette page est protégé par un guard de route dans `src/router.js`
- Le `session_id` et le `watch_id` sont vérifiés via `verifyPaymentSession()` du service Stripe
- Les tentatives d'accès non autorisées sont redirigées vers `/collection`

### PaymentCancel.vue

**Route :** `/paiement-annule`

**Description :**  
Composant affiché lorsque l'utilisateur annule le processus de paiement sur Stripe Checkout. Aucun montant n'est débité.

**Paramètres de requête requis :**

- `watch_id` : ID de la montre concernée
- `token` : Jeton signé par le backend (HMAC, sans état serveur ; validité limitée dans le temps)

**Fonctionnalités :**

- Affichage d'un message d'annulation
- Information que aucun montant n'a été débité
- Lien WhatsApp pour contacter l'équipe (avec pré-remplissage du message incluant le watch_id)
- Liens de navigation :
  - Retour à la page de la montre (si `watch_id` disponible)
  - Voir la collection
  - Retour à l'accueil

**Sécurité :**

- L'accès à cette page est protégé par un guard de route dans `src/router.js`
- Le `token` est vérifié via `verifyPaymentSession()` (signature et expiration côté backend)
- Pas de stockage serveur du token : plusieurs chargements de la page sont possibles tant que le jeton n’a pas expiré
- Les tentatives d'accès non autorisées sont redirigées vers `/collection`

## 🔄 Flux de Paiement

1. **Initiation** : L'utilisateur clique sur "Acheter" depuis `WatchDetail.vue`
2. **Session Stripe** : `createCheckoutSession()` crée une session Stripe et redirige vers Stripe Checkout
3. **Résultat** :
  - **Succès** → Redirection vers `/paiement-succes?session_id=xxx&watch_id=xxx`
  - **Annulation** → Redirection vers `/paiement-annule?watch_id=xxx&token=xxx`

## 🔗 Intégrations

### Services utilisés

- `**@/services/stripeService`** :
  - `verifyPaymentSession()` : Vérifie la validité d'une session ou d'un token
  - `createCheckoutSession()` : Crée une session Stripe (utilisé dans `WatchDetail.vue`)
- `**@/config**` :
  - `WHATSAPP_NUMBER` : Numéro WhatsApp pour le contact client

### Router

Les composants sont enregistrés dans `src/router.js` :

```javascript
import PaymentSuccess from './components/payment/PaymentSuccess.vue'
import PaymentCancel from './components/payment/PaymentCancel.vue'

// Routes
{ path: '/paiement-succes', component: PaymentSuccess }
{ path: '/paiement-annule', component: PaymentCancel }
```

### Backend

Les routes backend correspondantes se trouvent dans `backend/routes/stripe.js` :

- `/api/stripe/create-checkout-session` : Réserve la montre (RPC Supabase), crée une session Stripe
- `/api/stripe/webhook` : `checkout.session.completed` / `checkout.session.expired` (idempotence via table `stripe_processed_events`)
- `/api/stripe/verify-session` : Vérifie une session payée ou un jeton d’annulation

Migration SQL : `[supabase/migrations/20260429120000_stripe_integration_hardening.sql](../../../supabase/migrations/20260429120000_stripe_integration_hardening.sql)`

## 🛠️ Maintenance

### Ajouter un nouveau composant de paiement

1. Créer le composant dans ce dossier
2. L'importer dans `src/router.js`
3. Ajouter la route correspondante
4. Si nécessaire, ajouter un guard de sécurité dans `router.beforeEach()`
5. Mettre à jour ce README

### Modifier le design

Les deux composants utilisent :

- **Tailwind CSS** pour le styling
- **Classes utilitaires** pour la mise en page responsive
- **SVG inline** pour les icônes
- **Gradient background** personnalisé via CSS scoped

### Modifier le comportement

- **Paramètres d'URL** : Modifier la logique dans `onMounted()` pour extraire les nouveaux paramètres
- **Navigation** : Modifier les `router-link` pour changer les destinations
- **Sécurité** : Modifier les guards dans `src/router.js` si les règles de validation changent

## 🔒 Sécurité

### Points importants

1. **Validation côté backend** : Les sessions et tokens sont toujours vérifiés côté serveur
2. **Guards de route** : Les routes sont protégées dans le router Vue
3. **Jetons d’annulation signés** : Le backend vérifie signature et expiration (`PAYMENT_CANCEL_SECRET`)
4. **Redirection automatique** : Les accès non autorisés sont automatiquement redirigés

### Vérifications effectuées

- **PaymentSuccess** : Vérifie que `session_id` et `watch_id` existent et sont valides
- **PaymentCancel** : Vérifie que `watch_id` et `token` existent et que le jeton est valide (signature + expiration)

## 📝 Notes de développement

- Les composants utilisent la Composition API de Vue 3 (`<script setup>`)
- Les paramètres de requête sont extraits via `useRoute()` de Vue Router
- Les styles sont scoped pour éviter les conflits CSS
- Les composants sont responsive (mobile-first avec breakpoints `sm:`)

## 🐛 Dépannage

### Problème : Redirection vers `/collection` au lieu de la page de paiement

**Cause :** Les paramètres de requête manquent ou sont invalides.

**Solution :** Vérifier que :

- Les paramètres sont présents dans l'URL
- Le backend valide correctement les sessions/tokens
- Les guards de route dans `src/router.js` fonctionnent correctement

### Problème : Token invalide pour PaymentCancel

**Cause :** Jeton expiré, secret `PAYMENT_CANCEL_SECRET` différent entre création et vérification, ou URL tronquée.

**Solution :** Relancer un paiement depuis la fiche montre pour obtenir une nouvelle session et un nouveau jeton d’annulation ; vérifier la variable d’environnement et les logs backend.

### Problème : Session invalide pour PaymentSuccess

**Cause :** La session Stripe n'existe pas ou a expiré.

**Solution :** Vérifier que la session a bien été créée et que le délai entre la création et l'accès à la page n'est pas trop long.