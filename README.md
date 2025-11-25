# Micro Panel

Ce projet est construit avec [Vite](https://vitejs.dev/) + [Vue 3](https://vuejs.org/).

## Configuration API

Le panneau communique directement avec l'API des scènes via l'URL définie dans la variable `VITE_API_BASE_URL`.
Pour travailler avec un backend Spring Boot (port 8080 par défaut), mettez `VITE_API_BASE_URL` sur
`http://localhost:8080/api` ou sur l'URL complète de votre API si elle est hébergée ailleurs.

1. Copiez le fichier `.env.example` vers `.env.local` (ou `.env.production`).
2. Définissez `VITE_API_BASE_URL` sur `http://localhost:8080/api` en local ou sur l'URL publique de votre API en production.
3. Le backend Spring Boot proxy les appels `/api/scenes` vers l'URL définie par `panel.upstream.base-url` (fichier `MicroPanelScenes/src/main/resources/application.yml` ou variable d'environnement `PANEL_UPSTREAM_BASE_URL`). La valeur par défaut pointe sur `http://10.41.40.130:1234/api` ; ajustez-la si l'API tourne sur un autre hôte ou port.

## Scripts

- `npm install`
- `npm run dev` (démarre Vite **et** le backend Spring Boot via un orchestrateur Node.js compatible Windows/macOS/Linux)
- `npm run build`
- `npm run preview`

## Backend Spring Boot

Un backend Spring Boot est livré dans le dossier `MicroPanelScenes/` pour faire l'appel aux scènes et éviter le CORS côté navigateur.

- `npm run dev` démarre le backend (`mvn spring-boot:run`) en parallèle de Vite et arrêtera l'API quand vous quittez le dev server.
  Le script Node ne dépend plus de `sh`, il fonctionne donc aussi sur Windows. Il nécessite Java + Maven disponibles dans le `PATH`
  ou la variable d'environnement `BACKEND_CMD` pointant vers votre exécutable Maven (par ex. `C:\\apache-maven\\bin\\mvn.cmd`).
- Vous pouvez lancer uniquement l'API avec `npm run dev:backend` ou `cd MicroPanelScenes && mvn spring-boot:run`.
- Le backend proxy les appels `/api/scenes` vers une API en amont définie par la propriété `panel.upstream.base-url` (fichier `MicroPanelScenes/src/main/resources/application.yml` ou variable d'environnement `PANEL_UPSTREAM_BASE_URL`).
