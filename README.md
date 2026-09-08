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

## Probabilités des boosters de cartes

Chaque diagnostic posé par le médecin ouvre un booster de **3 cartes tirées indépendamment**
(`drawCard()` dans `medibet.html`). Pour chaque carte : on tire un nombre aléatoire pondéré
par les poids de rareté (`RARITY_META`) pour déterminer la rareté, puis une carte est choisie
au hasard parmi toutes celles de cette rareté dans `CARD_POOL`.

| Rareté | Poids | Probabilité par carte tirée |
|---|---|---|
| Commun | 52 | ~52,9 % |
| Rare | 26 | ~26,5 % |
| Épique | 14 | ~14,3 % |
| Légendaire | 5.5 | ~5,6 % |
| Mythique | 1.5 | ~1,53 % |
| Collector | 0.05 | ~0,051 % (≈ 1 chance sur 1960) |

Points à retenir :
- La probabilité par carte **individuelle** dépend aussi du nombre de cartes dans son
  tiers de rareté (le poids ci-dessus est réparti également entre toutes les cartes de
  la rareté tirée) : plus un tiers contient de cartes différentes, plus chacune d'elles
  est individuellement rare à obtenir précisément.
- Pas de garantie de type « pity system » : les 3 cartes d'un même booster sont des tirages
  indépendants, donc un booster 100% Commun reste statistiquement possible.
- Collector est un drop volontairement quasi symbolique (2 cartes seulement dans tout le
  jeu) : c'est le jackpot ultime.

Ces chiffres servent de base à la relecture d'équilibrage rareté prévue avant la soutenance.
