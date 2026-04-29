# Backend - Sauvage Watches

Serveur Express.js qui centralise les fonctionnalités backend de l'application Sauvage Watches. Il gère les communications avec les services externes (Mailjet, Stripe, n8n, Supabase) et sécurise les opérations sensibles.

## 📁 Structure du projet

```
backend/
├── routes/           # Routes API organisées par domaine fonctionnel
├── utils/            # Utilitaires réutilisables
├── uploads/          # Fichiers temporaires uploadés (ignoré par Git)
├── server.js         # Point d'entrée principal du serveur
├── package.json      # Dépendances et scripts npm
├── env.example       # Template de configuration des variables d'environnement
└── README.md         # Documentation (ce fichier)
```

## 📂 Détails des dossiers

### `/routes` - Routes API

Contient toutes les routes API organisées par domaine fonctionnel. Chaque fichier exporte un router Express qui est monté dans `server.js`.

#### `routes/mailjet.js`
**Utilité** : Gestion de l'envoi d'emails via Mailjet pour les formulaires de contact.

**Fonctionnalités** :
- Upload de photos via `multer` pour les demandes d'estimation
- Génération de templates HTML pour les emails
- Envoi d'emails formatés via l'API Mailjet
- Gestion des formulaires "estimation" et "recherche personnalisée"

**Routes** :
- `POST /api/send-estimation` - Envoie une demande d'estimation avec photos
- `POST /api/send-search` - Envoie une demande de recherche personnalisée

**Spécificités maintenance** :
- Les fichiers uploadés sont stockés temporairement dans `uploads/` et doivent être nettoyés régulièrement
- Les templates HTML sont générés dynamiquement - modifier la fonction `createEmailTemplate()` pour changer le format
- Les clés API Mailjet doivent être configurées dans `.env`

#### `routes/stripe.js`
**Utilité** : Gestion des paiements Stripe et sécurisation des pages de résultat de paiement.

**Fonctionnalités** :
- Création de sessions Stripe Checkout après **réservation atomique** en base (`reserve_watch_for_checkout`)
- Webhooks `checkout.session.completed` (vente) et `checkout.session.expired` (libération de réservation)
- **Idempotence** des webhooks via la table Supabase `stripe_processed_events`
- Jetons d’annulation **signés (HMAC)** pour `PaymentCancel` (`PAYMENT_CANCEL_SECRET`, sans état en mémoire)
- Vérification des sessions Stripe pour `PaymentSuccess`
- Limite de débit sur `create-checkout-session` (`express-rate-limit`, configurable avec `STRIPE_CHECKOUT_RATE_LIMIT_MAX`)

**Routes** :
- `POST /api/stripe/create-checkout-session` - Réserve la montre puis crée une session Stripe
- `POST /api/stripe/webhook` - Webhook Stripe (signature obligatoire ; codes HTTP conformes aux attentes Stripe)
- `GET /api/stripe/verify-session` - Vérifie une session payée ou un jeton d’annulation

**Spécificités maintenance** :
- **Migration SQL** : appliquer [`supabase/migrations/20260429120000_stripe_integration_hardening.sql`](../supabase/migrations/20260429120000_stripe_integration_hardening.sql) (colonnes `watches`, table `stripe_processed_events`, fonction `reserve_watch_for_checkout`)
- **Webhooks** : signature invalide → **400** ; configuration manquante → **503** ; erreur métier après réception → **500** (Stripe réessaie). Succès ou doublon déjà traité → **200**
- Activer l’événement **`checkout.session.expired`** dans le dashboard Stripe pour libérer les réservations abandonnées
- **`BASE_URL`** : définir en production si le domaine du frontend n’est pas celui par défaut de `getBaseUrl()`

#### `routes/n8n.js`
**Utilité** : Proxy pour les workflows n8n, évite les problèmes CORS.

**Fonctionnalités** :
- Appel de workflows n8n depuis le serveur backend
- Gestion automatique de l'environnement (production vs test)
- Génération d'articles de blog via workflow n8n

**Routes** :
- `POST /api/n8n/generate-article` - Génère un article de blog via workflow n8n

**Spécificités maintenance** :
- L'URL du workflow change automatiquement selon l'environnement :
  - Production : `/webhook/` (workflow activé)
  - Test/Debug : `/webhook-test/` (workflow de test)
- Peut être surchargée via la variable `N8N_WORKFLOW_URL` dans `.env`

### `/utils` - Utilitaires

Contient des fonctions utilitaires réutilisables dans plusieurs routes.

#### `utils/getBaseUrl.js`
**Utilité** : Détermine l'URL de base selon l'environnement (production, développement).

**Fonctionnalités** :
- Détection automatique de l'environnement (production vs développement)
- Retourne l'URL appropriée pour les redirections Stripe et autres URLs absolues

**Spécificités maintenance** :
- Utilisé principalement pour générer les URLs de redirection Stripe (`success_url`, `cancel_url`)
- **`BASE_URL` est recommandé en production** (sinon défaut `https://sauvage-watches.fr` ou localhost en dev)
- Détecte automatiquement l'environnement Render via `RENDER=true`

### `/uploads` - Fichiers temporaires

**Utilité** : Stockage temporaire des fichiers uploadés (photos de montres pour estimation).

**Spécificités maintenance** :
- ⚠️ **Ignoré par Git** - Ne pas commiter les fichiers uploadés
- ⚠️ **Nettoyage régulier requis** - Les fichiers ne sont pas supprimés automatiquement après envoi
- Script de nettoyage recommandé : Supprimer les fichiers de plus de 24h
- En production, considérer l'utilisation d'un stockage cloud (S3, Cloudinary) au lieu du système de fichiers local

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du dossier `backend/` (copier `env.example`) :

```bash
# Configuration Mailjet
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_SECRET_KEY=your_mailjet_secret_key_here

# Configuration Email
EMAIL_FROM=contact@sauvage-watches.fr

# Configuration Serveur
PORT=3000
NODE_ENV=development

# URL frontend pour Stripe success/cancel (recommandé si domaine ≠ défaut)
BASE_URL=https://sauvage-watches.fr

# Configuration Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
PAYMENT_CANCEL_SECRET=generate_a_long_random_secret
# STRIPE_CHECKOUT_RATE_LIMIT_MAX=30

# Configuration Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Configuration n8n (optionnel)
N8N_WORKFLOW_URL=https://n8n.srv1166238.hstgr.cloud/webhook/...

```

### Installation et démarrage

```bash
# Installation des dépendances
cd backend
npm install

# Démarrage en mode développement (avec auto-reload)
npm run dev

# Démarrage en mode production
npm start
```

Le serveur démarre sur le port `3000` par défaut (ou celui défini dans `PORT`).

## 🔒 Sécurité

### Bonnes pratiques

1. **Variables d'environnement** :
   - ⚠️ Ne jamais commiter le fichier `.env` (déjà dans `.gitignore`)
   - Utiliser des clés différentes pour développement et production
   - Utiliser un compte Mailjet de test pour les environnements non prod

2. **Webhooks Stripe** :
   - Vérifier la signature avec `STRIPE_WEBHOOK_SECRET` ; en cas d’échec de traitement métier, **500** pour déclencher les réessais Stripe
   - Les événements sont enregistrés dans `stripe_processed_events` pour éviter les doubles traitements

3. **Jetons d’annulation** :
   - Signés avec `PAYMENT_CANCEL_SECRET` (voir `utils/paymentCancelToken.js`)

4. **CORS** :
   - Configuration stricte selon l'environnement
   - Seuls les domaines autorisés peuvent faire des requêtes
   - Logging des requêtes OPTIONS en production pour diagnostic

## 🐛 Maintenance et dépannage

### Logs et monitoring

Le serveur logge plusieurs types d'informations :

- ✅ **Succès** : Création de sessions, paiements réussis, emails envoyés
- ⚠️ **Avertissements** : Tentatives d'accès non autorisées, tokens expirés
- ❌ **Erreurs** : Échecs d'envoi d'email, erreurs Stripe, erreurs Supabase

### Problèmes courants

#### Emails non envoyés
1. Vérifier les clés Mailjet dans `.env`
2. Vérifier les logs du serveur pour les erreurs détaillées
3. Vérifier le dashboard Mailjet pour les erreurs d'envoi
4. Vérifier que le quota Mailjet n'est pas dépassé

#### Paiements Stripe non traités
1. Vérifier que le webhook est configuré dans le dashboard Stripe (y compris `checkout.session.expired`)
2. Vérifier que `STRIPE_WEBHOOK_SECRET` est correct et que la migration SQL a été appliquée
3. Vérifier les logs (codes **400** signature, **500** erreur Supabase — Stripe doit réessayer)
4. Vérifier que Supabase est correctement configuré pour la mise à jour du stock

#### Accès refusé aux pages de paiement
1. Vérifier que les paramètres `session_id`/`token` et `watch_id` sont présents dans l'URL
2. Vérifier les logs pour les raisons de refus (token expiré, session invalide, etc.)
3. Pour PaymentCancel, vérifier `PAYMENT_CANCEL_SECRET` et l’expiration du jeton

#### Problèmes CORS
1. Vérifier que le domaine frontend est dans la liste `corsOptions.origin`
2. Vérifier les logs de requêtes OPTIONS en production
3. Vérifier que `NODE_ENV` ou `RENDER` est correctement défini

### Nettoyage régulier

#### Fichiers uploadés
Les fichiers dans `uploads/` doivent être nettoyés régulièrement. Script recommandé :

```bash
# Supprimer les fichiers de plus de 24h
find uploads/ -type f -mtime +1 -delete
```

## 📦 Dépendances principales

- **express** : Framework web pour Node.js
- **cors** : Gestion des en-têtes CORS
- **multer** : Gestion de l'upload de fichiers
- **node-mailjet** : Client API Mailjet pour l'envoi d'emails
- **stripe** : SDK Stripe pour les paiements
- **express-rate-limit** : Limitation du débit sur la création de sessions Checkout
- **@supabase/supabase-js** : Client Supabase pour la base de données
- **dotenv** : Chargement des variables d'environnement
- **form-data** : Gestion des données FormData pour n8n

## 🚀 Déploiement

### Sur Render (recommandé)

1. Connecter le repository GitHub
2. Configurer les variables d'environnement dans le dashboard Render
3. Définir `NODE_ENV=production` et `RENDER=true`
4. Le serveur démarre automatiquement sur le port défini par Render

### Variables d'environnement requises en production

- `MAILJET_API_KEY` / `MAILJET_SECRET_KEY`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `PAYMENT_CANCEL_SECRET`
- `BASE_URL` (recommandé si le domaine frontend n’est pas celui par défaut)
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
- `NODE_ENV=production`
- `RENDER=true` (si déployé sur Render)

## 📝 Notes importantes

- Le dossier `uploads/` est ignoré par Git - ne pas commiter les fichiers uploadés
- Appliquer la migration Stripe dans Supabase avant de déployer le backend mis à jour
- Le webhook Stripe doit pointer vers : `https://votre-backend.com/api/stripe/webhook` et inclure au minimum `checkout.session.completed` et `checkout.session.expired`
