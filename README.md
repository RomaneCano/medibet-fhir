# MediBet 🎰🩺

Projet de TP « Maîtrise des technologies de l'interopérabilité » — Session 2026.

Le patient mise sur son diagnostic (cote, mise en CoinPot — monnaie 100% virtuelle),
ses proches peuvent rejoindre le pari, et c'est le médecin qui pose le vrai diagnostic
et tranche le pari. Chaque diagnostic posé rapporte au médecin un booster de cartes
« maladies » (rareté, effets sonores, collection, échanges entre collègues).

Le tout s'articule autour de la plateforme d'intermédiation **FHIR** fournie pour le TP.

## Équipes

- **Équipe Patient** : Romane Cano, Rémi Delarue, Neirouz Attia
- **Équipe Médecin** : Alexandre Desoutter, Aimé Goetschel, Eya Rejeb

## Lancer le projet en local

```bash
node serve.js
```

puis ouvrir http://localhost:8123

## FHIR

- Base réelle du TP : `https://fhir.alliance4u.io`
- Endpoints utilisés : `GET/POST/PUT/DELETE /api/{resource}` (`patient`, `practitioner`,
  `observation`, `appointment`), `Content-Type: application/json`.
- **Important** : `medibet.html` embarque un module `fhirClient` qui respecte exactement
  les routes/méthodes documentées, mais simule les réponses (`MOCK_MODE = true` en tête
  de fichier) — nécessaire pour que la démo tourne n'importe où sans dépendre du réseau
  du cours. Chaque appel simulé est visible dans la console FHIR intégrée (bouton en bas
  à droite de la page).
- Pour la vraie soutenance / démonstration avec vos identifiants FHIR de boarding list :
  passez `MOCK_MODE = false` et branchez `fetch(FHIR_BASE + path, ...)` à la place des
  fonctions mock dans le bloc `fhirClient`.

## État partagé (paris, collections, échanges)

La version publiée en ligne (Claude Artifact) utilise une base de données temps réel
partagée entre tous les joueurs connectés au lien. En local (`node serve.js`), cet état
partagé n'est pas branché — chaque instance est indépendante (à remplacer par votre
propre backend si besoin pour la démo en équipe).
