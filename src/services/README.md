# Services

Couche d’accès aux données et intégrations externes.

## Fichiers notables

- `supabase.js` : client unique configuré avec les variables Vite.
- `watchService.js`, `articleService.js`, `maintenanceService.js` : requêtes
  publiques (collection, blog, bannière maintenance).
- `emailService.js` et `n8nService.js` : webhooks sortants (Mailjet, automation).
- `imagePreviewService.js` : helpers pour générer des previews lors d’uploads.

## Structure

- `admin/` contient toutes les fonctions nécessitant des droits élevés
  (CRUD montres, articles, authentification).

## Règles

- Ne pas importer directement `@supabase/supabase-js` ailleurs ; toujours passer
  par `supabase.js` pour conserver une configuration unique.
- Retourner des objets `{ success, data, error }` quand c’est pertinent afin de
  simplifier la gestion d’erreur côté composants.

