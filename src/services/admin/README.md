# Services Admin

Fonctions JavaScript manipulant les tables Supabase réservées à
l’administration.

## Modules

- `adminAuthService.js` : gestion de session (login/logout via Supabase Auth,
  vérification des rôles).
- `adminArticleService.js` : CRUD complet sur `articles` + association
  `watch_articles`.
- `adminWatchService.js` : création/mise à jour de montres, upload d’images,
  bascules `is_available` / `is_sold`.

## Consignes

- Toujours valider les entrées avant appel Supabase (ex. trimming des titres,
  contrôle des catégories).
- Logguer les erreurs avec suffisamment de contexte (id concerné, opération).
- Prévoir des retours structurés (`{ success, error }`) pour permettre à l’UI de
  différencier les erreurs métier des erreurs réseau.

