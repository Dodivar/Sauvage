# Backend

Petit serveur Express dédié aux formulaires « estimation » et « recherche
personnalisée ». Il centralise :

- l’upload de photos via `multer` vers le dossier local `uploads/`,
- la mise en forme HTML et l’envoi des demandes via Mailjet (`mailServer.js`),
- la configuration CORS pour autoriser le front en préprod/prod,
- la compatibilité legacy (`mailServer_old.js`) conservée à des fins d’archives.

## Démarrage local

```bash
cd backend
npm install
npm run dev # ou node mailServer.js
```

Créer un fichier `.env` (copier `env.example`) avec les clés suivantes :

- `MAILJET_API_KEY` / `MAILJET_SECRET_KEY`
- `NODE_ENV` (pour activer la whitelist prod)

## Maintenance

- **Uploads** : le dossier est ignoré par Git. Purger régulièrement les fichiers
  temporaires.
- **Sécurité** : ne jamais commiter les vraies clés Mailjet. Utiliser un compte
  de test pour les environnements non prod.
- **Logs** : en cas d’échec d’envoi, vérifier la console Mailjet et les traces
  du serveur (erreurs détaillées dans `mailServer.js`).

