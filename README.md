# MediBet 🎰🩺

Projet de TP « Maîtrise des technologies de l'interopérabilité », session 2026.

Le patient mise sur son diagnostic (cote, mise en CoinPot, monnaie 100% virtuelle),
ses proches peuvent rejoindre le pari, et c'est le médecin qui pose le vrai diagnostic
et tranche le pari. Chaque diagnostic posé rapporte au médecin un booster de cartes
« maladies » (rareté, effets sonores, collection, échanges entre collègues).

Le tout s'articule autour de la plateforme d'intermédiation **FHIR** fournie pour le TP,
avec de vrais appels réseau vérifiés en direct contre le serveur du TP.

## Deux applications indépendantes

- `medibet.html` : application **Patient / Proche** (dossiers, mise, suivi du pari).
- `medibet-medecin.html` : application **Médecin** (file d'attente diagnostic, pose du
  diagnostic officiel, collection de cartes, classement, recyclage).

Les deux apps ne communiquent jamais directement entre elles : tout passe par le serveur
FHIR du TP (dossiers et paris lus/écrits comme ressources `Basic`), exactement comme si
elles tournaient sur deux ordinateurs différents — ce qui est d'ailleurs le cas en vrai
pour les équipes Patient et Médecin.

## Liens

- Site public : https://romanecano.github.io/medibet-fhir/ (GitHub Pages, publié automatiquement à chaque push sur `master`)
- Suivi agile (cas d'usage, équipes, burndown) : https://romanecano.github.io/medibet-fhir/sprint-medibet.html
- Ancien hébergement Netlify (https://medibet-fhir.netlify.app), déployé à la main au CLI et
  suspendu faute de crédits — les liens ci-dessus le remplacent
- Product backlog détaillé : Trello (un board par équipe)

## Équipes

- **Projet Patient** : Neirouz Attia (PO), Rémi Delarue (Scrum Master), Romane Cano (Dev)
- **Projet Médecin** : Alexandre Desoutter (PO), Aimé Goetschel (Scrum Master), Eya Rejeb (Dev)

Sur demande du professeur, le jeu lui-même n'a qu'un seul Patient (Romane Cano) et un
seul Médecin (Alexandre Desoutter) : choisir un rôle sur l'écran d'accueil mène directement
à cette identité unique, sans liste où en choisir une autre dans la base.

## Déploiement

Le site est servi par **GitHub Pages** depuis la branche `master`, dossier racine : chaque push
sur `master` republie le site, sans build ni CLI. Comme Pages sert le dépôt sous le sous-chemin
`/medibet-fhir/` et non à la racine du domaine, tous les liens internes doivent rester
**relatifs** (voir `index.html`) ; un chemin en `/medibet.html` renverrait un 404. Le fichier
`.nojekyll` désactive le traitement Jekyll, inutile ici.

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
- Chacune des deux apps embarque son propre module `fhirClient` qui respecte exactement
  les routes/méthodes documentées. `MOCK_MODE` (en tête de fichier) est calculé
  automatiquement : `true` seulement quand la page tourne dans le bac à sable d'un
  artifact Claude (réseau externe bloqué), `false` partout ailleurs (site public, local),
  pour de vrais appels réseau.
- Des `Patient` et `Practitioner` réels ont été créés sur le serveur du TP pour les
  dossiers et les membres de l'équipe Médecin ; leurs ids sont câblés dans
  `PRACTITIONER_IDS` (et l'id Patient fixe de Romane Cano, côté `medibet.html`).
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

## Renflouement : fausses pubs + roulette CoinPot

Quand le portefeuille du patient tombe à **0 CoinPot**, il ne peut plus miser : la partie est
finie. Un filet de sécurité (parodie assumée des jeux mobiles free-to-play) se déclenche alors
dans `medibet.html` :

1. un écran « Plus un seul CoinPot » s'ouvre automatiquement au passage à zéro ;
2. le joueur regarde **3 fausses publicités** (marques inventées, mention « fausse publicité »
   affichée sur chacune), passables après 2 secondes ;
3. une **roulette** à 8 secteurs (60 · 100 · 150 · 200 · 260 · 350 · 500 · 1000 🪙) est
   débloquée : un tour, un gain aléatoire pondéré (les gros lots sont les plus rares) ;
4. le gain est crédité sur le portefeuille — via la db partagée en artifact, via la ressource
   FHIR `Basic` du joueur partout ailleurs — et le joueur peut reparier.

L'offre n'est accessible **que tant que le solde vaut exactement 0**. Dès le premier CoinPot
regagné, le bouton « 📺 Renflouer » du bandeau et la bannière de l'accueil disparaissent :
impossible de regarder des pubs pour s'enrichir quand on a encore de quoi jouer. Si le joueur
retombe à sec plus tard, l'offre se réarme.

## Améliorations prévues après le sprint

Les évolutions identifiées mais non tenables dans ce sprint sont regroupées dans
[`AMELIORATIONS.md`](AMELIORATIONS.md) : elles alimentent la liste **« Améliorations »** des
boards Trello et la partie « et après ? » de la soutenance.

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

## Recyclage des cartes en double

Une carte ne devient recyclable qu'à partir de son **2ᵉ exemplaire** (le tout premier
reste toujours acquis à la collection). Dans l'atelier de recyclage (`medibet-medecin.html`),
le médecin sélectionne **5 cartes en double** — d'une ou plusieurs cartes différentes,
peu importe — pour les sacrifier contre **une carte mystère** fraîchement tirée du pool
(`drawCard()`, mêmes probabilités qu'un booster ci-dessus). Elle peut retomber sur une
carte déjà possédée ou une toute nouvelle : de quoi progresser vers les raretés
supérieures sans dépendre d'un autre médecin dans la partie.
