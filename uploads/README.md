# Uploads

Dossier tampon pour les fichiers envoyés via le serveur Express (`backend/`).
Il est ignoré par Git afin d’éviter de versionner des pièces jointes clients.

## Utilisation

- `multer` y stocke temporairement les photos ajoutées aux formulaires
  d’estimation/recherche.
- Les fichiers doivent être supprimés manuellement après leur transmission par
  email ou leur transfert vers un stockage durable (S3, Supabase Storage, etc.).

## Bonnes pratiques

- Vérifier qu’il existe bien lors du déploiement (`mkdir -p uploads`).
- Ajouter un job cron / script pour purger les fichiers anciens si nécessaire.

