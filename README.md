# Micro Panel

Ce projet est construit avec [Vite](https://vitejs.dev/) + [Vue 3](https://vuejs.org/).

## Configuration API & proxy

Le panneau communique avec l'API des scènes via l'URL définie dans la variable `VITE_API_BASE_URL`.
Pour travailler avec un backend Spring Boot (port 8080 par défaut), mettez `VITE_API_BASE_URL` sur
`http://localhost:8080/api` ou laissez `/api` si le front est servi par le même hôte et que vous avez
un reverse proxy en face de Spring.

Pour le développement local (et pour `vite preview`), la configuration du proxy dans `vite.config.ts`
dirige toutes les requêtes `*/api/*` vers la cible définie dans `VITE_PROXY_TARGET` (ou `VITE_API_BASE_URL` à défaut).
Cela permet de travailler avec une API distante sans devoir modifier le code.

1. Copiez le fichier `.env.example` vers `.env.local` (ou `.env.production`).
2. Définissez `VITE_API_BASE_URL` sur `/api` si vous avez un reverse proxy en prod, ou directement sur `http://10.41.40.130:1234` si vous servez le front depuis la même machine.
3. Facultatif : définissez `VITE_PROXY_TARGET` si l'API est accessible sur un autre hôte en local pour bénéficier du proxy Vite.
   Pour un backend Spring Boot local, utilisez `http://localhost:8080` afin que les appels `/api/scenes` du panel soient redirigés vers `http://localhost:8080/api/scenes` sans avoir à gérer le CORS côté navigateur.

## Scripts

- `npm install`
- `npm run dev` (démarre Vite **et** le backend Spring Boot via un orchestrateur Node.js compatible Windows/macOS/Linux)
- `npm run build`
- `npm run preview`

## Backend Spring Boot

Un backend Spring Boot est livré dans le dossier `backend/` pour faire l'appel aux scènes et éviter le CORS côté navigateur.

- `npm run dev` démarre le backend (`mvn spring-boot:run`) en parallèle de Vite et arrêtera l'API quand vous quittez le dev server.
  Le script Node ne dépend plus de `sh`, il fonctionne donc aussi sur Windows. Il nécessite Java + Maven disponibles dans le `PATH`
  ou la variable d'environnement `BACKEND_CMD` pointant vers votre exécutable Maven (par ex. `C:\\apache-maven\\bin\\mvn.cmd`).
- Vous pouvez lancer uniquement l'API avec `npm run dev:backend` ou `cd backend && mvn spring-boot:run`.
- Le backend proxy les appels `/api/scenes` vers une API en amont définie par la propriété `panel.upstream.base-url` (fichier `backend/src/main/resources/application.yml` ou variable d'environnement `PANEL_UPSTREAM_BASE_URL`).
