# Dossier `src`

Code client Vue 3 / Vite.

## Entrées principales

- `main.js` : bootstrap Vue, import CSS global (`assets/main.css`) et montage sur
  `#app`.
- `App.vue` : layout racine (header/footer, transitions).
- `router.js` : routes publiques (collection, blog, estimation…).
- `config.js` : valeurs partagées (SEO, coordonnées, textes génériques).

## Sous-dossiers clés

| Dossier | Rôle |
| --- | --- |
| `assets/` | Images, logos et CSS global |
| `components/` | Composants Vue (pages, modules réutilisables) |
| `services/` | Accès aux API Supabase/Mailjet et helpers métier |

## Conseils de contribution

- Favoriser la composition API (`<script setup>`) déjà utilisée dans la plupart
  des composants.
- Centraliser les appels réseau dans `services/` pour garder les vues déclaratives.
- Documenter les props/événements importants directement dans les composants
  (commentaires ou `defineProps`).

