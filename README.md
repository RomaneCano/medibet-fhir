# MediBet 🎰🩺

Projet de TP « Maîtrise des technologies de l'interopérabilité », session 2026.

Le patient mise sur son diagnostic (cote, mise en CoinPot, monnaie 100% virtuelle),
ses proches peuvent rejoindre le pari, et c'est le médecin qui pose le vrai diagnostic
et tranche le pari. Chaque diagnostic posé rapporte au médecin un booster de cartes
« maladies » (rareté, effets sonores, collection, échanges entre collègues).

Le tout s'articule autour de la plateforme d'intermédiation **FHIR** fournie pour le TP,
avec de vrais appels réseau vérifiés en direct contre le serveur du TP.

## Liens

- Site public : https://medibet-fhir.netlify.app
- Suivi agile (cas d'usage, équipes, burndown) : https://medibet-fhir.netlify.app/sprint-medibet.html
- Product backlog détaillé : Trello (un board par équipe)

## Équipes

- **Projet Patient** : Neirouz Attia (PO), Rémi Delarue (Scrum Master), Romane Cano (Dev)
- **Projet Médecin** : Alexandre Desoutter (PO), Aimé Goetschel (Scrum Master), Eya Rejeb (Dev)

Sur demande du professeur, le jeu lui-même n'a qu'un seul Patient (Romane Cano) et un
seul Médecin (Alexandre Desoutter) : choisir un rôle sur l'écran d'accueil mène directement
à cette identité unique, sans liste où en choisir une autre dans la base.

## Lancer le projet en local

```bash
node serve.js
```

puis ouvrir http://localhost:8123

## FHIR

- Base réelle du TP : `https://fhir.alliance4u.io` (CORS ouvert, vérifié en direct)
- Endpoints utilisés : `GET/POST/PUT/DELETE /api/{resource}` (`patient`, `practitioner`,
  `observation`, `appointment`), `Content-Type: application/json`. Le serveur répond avec
  des tableaux JSON bruts sur les listes (pas de Bundle FHIR encapsulé).
- `medibet.html` embarque un module `fhirClient` qui respecte exactement les
  routes/méthodes documentées. `MOCK_MODE` (en tête de fichier) est calculé automatiquement :
  `true` seulement quand la page tourne dans le bac à sable d'un artifact Claude (réseau
  externe bloqué), `false` partout ailleurs (site public, local), pour de vrais appels réseau.
- 6 `Patient` et 3 `Practitioner` réels ont été créés sur le serveur du TP pour les dossiers
  et les membres de l'équipe Médecin ; leurs ids sont câblés dans `DOSSIERS` /
  `PRACTITIONER_IDS`.
- Le patient résout son pari en interrogeant lui-même le serveur FHIR (bouton « Vérifier le
  diagnostic auprès du serveur FHIR », `GET /api/observation?subject.reference=Patient/{id}`) :
  ça fonctionne même si l'app Patient et l'app Médecin tournent sur deux ordinateurs
  différents, sans aucun état partagé côté Claude.
- Chaque appel est visible dans la console FHIR intégrée (bouton en bas à droite de la page).

## État partagé (paris, boosters, collections, échanges)

La version publiée en Claude Artifact utilise une base de données temps réel partagée entre
tous les joueurs connectés au lien (mises, boosters, collections, échanges). En local
(`node serve.js`) ou sur le site public Netlify, cet état n'est pas branché : chaque
instance est indépendante pour cette partie « jeu ». Seuls les échanges FHIR
(Patient/Practitioner/Observation/Appointment) sont réellement partagés entre postes,
via le serveur du TP.
