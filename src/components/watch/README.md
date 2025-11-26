# Composants montres

Vue dédiée à la collection publique.

## Fichiers

- `WatchesCollection.vue` : page listant l’ensemble des montres disponibles,
  filtre et tri compris.
- `WatchCard.vue` : carte réutilisable (visuel, prix, CTA) utilisée partout où
  une montre est affichée.
- `WatchDetail.vue` : fiche détaillée (galerie, spécifications, articles liés).

## Sources de données

- S’appuient sur `watchService.js` et `watchArticleService.js` pour récupérer les
  données Supabase.
- Affichent les liaisons `watch_articles` afin de lier une montre à un article
  de blog pertinent.

## Conseils

- Vérifier que les composants restent SSR-safe (pas d’accès direct à `window`
  sans garde).
- Extraire les conversions de prix/états dans des helpers pour éviter la
  duplication.

