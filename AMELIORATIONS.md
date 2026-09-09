# Améliorations — hors périmètre du sprint

Liste des évolutions identifiées pendant le sprint mais **volontairement non réalisées**
faute de temps. Elle alimente la nouvelle catégorie (liste) **« Améliorations »** des boards
Trello des deux équipes, et sert de support à la partie « et après ? » de la soutenance.

Chaque entrée = une carte Trello : le titre est la première ligne, le reste va dans la
description. Trello crée une carte par ligne quand on colle une liste de titres d'un coup.

---

## Interopérabilité & conformité FHIR

**Coder les diagnostics avec une vraie terminologie (SNOMED CT / CIM-10)**
Aujourd'hui les diagnostics et symptômes utilisent des codes maison (`SYMPTOMS`, `CARD_POOL`).
Passer sur des `CodeableConcept` avec un system officiel rendrait les `Observation` publiées
réellement exploitables par un autre système que MediBet. C'est le principal écart de
conformité restant.

**Échanger des Bundles FHIR plutôt que des ressources isolées**
Le serveur du TP répond par des tableaux JSON bruts ; un vrai serveur FHIR renvoie un
`Bundle` de type `searchset`. Prévoir la lecture des deux formes rendrait l'app portable sur
n'importe quel serveur FHIR (HAPI, Firely…) sans toucher au reste du code.

**Sortir l'état de jeu des ressources `Basic`**
Dossiers, paris, portefeuilles et collections sont stockés dans des ressources `Basic` — c'est
astucieux et légal, mais ce n'est pas de la donnée clinique. Un petit backend dédié
(Supabase / Firebase) au jeu, et FHIR réservé au médical, clarifierait l'architecture.

**Authentification SMART on FHIR / OAuth2**
Aucune authentification aujourd'hui : le rôle est choisi sur l'écran d'accueil. Un vrai flux
SMART on FHIR (scopes `patient/*.read`, `user/Observation.write`) est le prérequis à toute
utilisation hors TP.

**Notifications temps réel au lieu du polling**
L'app Patient interroge le serveur toutes les 7 secondes (`startPolling`). FHIR Subscription
(ou un simple WebSocket côté backend de jeu) supprimerait ce délai et la charge réseau.

## Produit & gameplay

**Comptes multi-patients et multi-médecins**
Le professeur a demandé un seul Patient et un seul Médecin câblés en dur
(`SINGLE_PATIENT_NAME`, `PRACTITIONER_IDS`). Rouvrir le jeu à plusieurs joueurs réactive le
classement, les paris croisés et les échanges de cartes entre praticiens.

**Équilibrage économique du CoinPot**
Cotes, mise minimum, gains de la roulette de renflouement et récompenses de boosters n'ont
jamais été équilibrés sur des données : à simuler (Monte-Carlo) pour éviter l'inflation ou la
ruine systématique.

**Roulette de renflouement : cooldown et anti-abus**
La roulette (livrée dans ce sprint) est ouverte à chaque passage à 0 CoinPot. À ajouter :
un délai entre deux renflouements, un compteur quotidien, et un « pity system » qui garantit
un gros lot après plusieurs petits.

**Cotes calculées sur la prévalence réelle des maladies**
Les cotes viennent d'un score de correspondance symptômes/maladies. Les asseoir sur des
statistiques épidémiologiques publiques rendrait le pari crédible et le propos pédagogique
plus fort.

**Historique et statistiques du joueur**
Taux de bons pronostics, gain net dans le temps, maladie la plus jouée : la donnée existe
déjà (dossiers résolus), il ne manque que l'écran et les graphiques.

## Qualité & industrialisation

**Tests automatisés end-to-end + intégration continue**
Un scénario Playwright par cas d'usage (UC1 à UC7) rejoué à chaque push protégerait des
régressions ; aujourd'hui tout est validé à la main avant la démo.

**Accessibilité (RGAA / WCAG)**
Contrastes à vérifier sur le thème sombre, navigation clavier complète, `prefers-reduced-motion`
pour les animations de roulette et de boosters, libellés ARIA sur les overlays.

**Découper les fichiers HTML monolithes**
Chaque app tient dans un seul fichier de ~1500 lignes (pratique pour la démo, pas pour la
maintenance). Découpage en modules ES + build minimal, sans changer l'expérience.

**Installation en PWA et mode hors-ligne**
Manifest + service worker : l'app Patient s'installe sur le téléphone et garde ses dossiers
consultables sans réseau, avec resynchronisation FHIR au retour de connexion.

**Internationalisation FR / EN**
Tous les textes sont en dur en français. Externaliser les libellés ouvrirait la démo à un jury
ou à des utilisateurs non francophones.
