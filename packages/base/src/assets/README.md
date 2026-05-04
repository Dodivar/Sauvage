# Assets (template / partagé)

- `main.css` : styles globaux (Tailwind, reset, helpers partagés).

Les logos, visuels d’accueil et autres médias **propres à une marque** vivent sous
`sites/<siteId>/src/assets/` (alias Vite `@site/*`, résolu par `vite/vite.config.mjs` à la racine du repo selon `SITE_ID`).

## Règles

- Garder les fichiers originaux optimisés (WebP ou PNG compressé) avant import.
- Nommer les nouvelles images en anglais/kebab-case pour éviter les soucis
  d’encodage.
- Si un asset doit être chargé depuis le backend (upload utilisateur), placer un
  placeholder léger ici mais laisser la source réelle côté base de données.























