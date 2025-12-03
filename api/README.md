# API

Fonctions serverless déployées avec Vercel. Chaque fichier exporte un `handler`
compatible avec l’environnement Edge/Serverless pour alimenter le front.

## Contenu principal

- `sitemap.js` génère dynamiquement le plan de site XML à partir de Supabase
  (tables `watches` et `articles`) et expose la route GET `/api/sitemap`.

## Variables d’environnement

| Nom | Description |
| --- | --- |
| `SUPABASE_URL` / `VITE_SUPABASE_URL` | Instance Supabase source des données |
| `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY` | Clé utilisée par le client service |
| `VERCEL_ENV`, `VERCEL_URL`, `BASE_URL` | Permettent d’inférer l’URL absolue des pages |

## Bonnes pratiques

- Limiter les dépendances : chaque fonction est packagée avec son propre
  `package.json`.
- Toujours gérer CORS/OPTIONS si la route est consommée directement par un
  navigateur.
- Éviter les appels coûteux côté DB en filtrant dès la requête Supabase.








