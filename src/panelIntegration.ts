// panelIntegration.ts
//
// 👉 Objectif de ce fichier : montrer à un dev backend *où* brancher son API
//    pour piloter le composant Vue via window.MicroPanelUI.
//
// Le composant Vue NE fait pas d'appel HTTP lui-même.
// Il expose un "bridge" global : window.MicroPanelUI avec :
//
//   - setScenes(payload, meta?)         → Injecter les données (scènes / boutons)
//   - setSyncState(syncStatePayload)    → Indiquer les états de chargement / erreurs
//   - setPatchState(patchStatePayload)  → Indiquer les états d'envoi de commandes
//   - onRefreshRequest(handler)         → Callback quand l'utilisateur clique sur "Rafraîchir"
//   - onButtonTrigger(handler)          → Callback quand l'utilisateur clique sur un bouton
//
// Le rôle de ce fichier est :
//   1. Charger les scènes depuis le backend et les donner à setScenes()
//   2. Gérer les indicateurs de sync (chargement / erreur) via setSyncState()
//   3. Réagir aux clics utilisateur via onButtonTrigger() et appeler l'API backend
//   4. Réagir au bouton "Rafraîchir" via onRefreshRequest() pour recharger les scènes
//
// ---------------------------------------------------------------------------

