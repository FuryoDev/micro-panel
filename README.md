# Micro Panel

Ce projet est construit avec [Vite](https://vitejs.dev/) + [Vue 3](https://vuejs.org/).

## Configuration API & proxy

Le panneau communique avec l'API des scènes via l'URL définie dans la variable `VITE_API_BASE_URL`.
Par défaut cette valeur est `/api`, ce qui permet de garder une URL relative et d'éviter les problèmes de CORS
lorsque l'application est servie par un reverse proxy.

Pour le développement local (et pour `vite preview`), la configuration du proxy dans `vite.config.ts`
dirige toutes les requêtes `*/api/*` vers la cible définie dans `VITE_PROXY_TARGET` (ou `VITE_API_BASE_URL` à défaut).
Cela permet de travailler avec une API distante sans devoir modifier le code.

1. Copiez le fichier `.env.example` vers `.env.local` (ou `.env.production`).
2. Définissez `VITE_API_BASE_URL` sur `/api` si vous avez un reverse proxy en prod, ou directement sur `http://10.41.40.130:1234` si vous servez le front depuis la même machine.
3. Facultatif : définissez `VITE_PROXY_TARGET` si l'API est accessible sur un autre hôte en local pour bénéficier du proxy Vite.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
