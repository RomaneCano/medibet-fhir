# MediBet — les deux boards Trello, en entier

Ce fichier est la **référence unique** des deux boards de l'équipe Patient. Les chiffres qu'il
contient sont exactement ceux du support de soutenance (planches 5, 6 et 8), de la trame orale
(annexe C) et de la page de suivi `sprint-medibet.html`. Si vous modifiez une carte dans Trello,
modifiez-la ici aussi — sinon la soutenance se contredit.

Le proxy réseau de cet environnement bloque `trello.com` : je ne peux pas écrire dans vos boards
à votre place. Ce document est fait pour être appliqué à la main en quelques minutes (Trello crée
une carte par ligne quand on colle plusieurs titres d'un coup dans le champ « Ajouter une carte »).

---

## Chiffres de référence

| | |
|---|---|
| Cartes au Sprint Planning | 18 |
| Cartes retirées en cours de sprint | 2 (doublons) |
| Cartes actives | 16 |
| À faire / En cours / Terminé | 0 / 2 / 14 |
| Points actifs | 52 |
| Points terminés | 44 (~85 %) |
| Points restants jeudi matin | 8 = US-P4 (5) + SPIKE-P16 (3) |
| Vélocité Corrello | 14 **cartes** |
| Vélocité en points | 44 |
| Sprint | lundi PM → jeudi AM, 6 demi-journées |

---

## Board 1 — « MediBet · Product Backlog »

Vue tableau. C'est le board de **Neirouz (PO)** : il contient tout ce que MediBet pourrait devenir,
priorisé par la valeur pour le patient. Il ne se vide pas à la fin du sprint.

### Étiquettes (les mêmes sur les deux boards)

| Couleur | Étiquette | Sens |
|---|---|---|
| Vert | `User Story` | valeur directement perçue par le patient |
| Bleu | `Story technique` | valeur indirecte, socle technique |
| Orange | `Spike` | temps d'analyse, produit une réponse pas une fonctionnalité |
| Jaune | `Tâche` | organisation, documentation, cérémonies |
| Rouge | `Bloquant` | posé pendant le Daily, retiré à la levée |
| Violet | `FHIR` | la carte touche à l'interopérabilité → test croisé obligatoire (DoD) |

### Champs personnalisés

- **Points** (liste : 1, 2, 3, 5, 8, 13) — posés au Planning Poker, jamais par le PO seul.
- **Priorité** (liste : Must / Should / Could / Won't) — posée par le PO.
- **Sprint** (texte : `S1`, `S2`, `—`) — permet de savoir ce qui a été engagé et quand.

### Listes du board

**1. Vision produit** *(3 cartes, non estimées — c'est du contexte, pas du travail)*

| Carte | Contenu de la description |
|---|---|
| Le problème que MediBet résout | Un patient qui attend un diagnostic ne comprend pas ses symptômes et s'inquiète. MediBet transforme cette attente en jeu, sans jamais prétendre diagnostiquer. |
| Les deux garde-fous non négociables | 1. L'application ne pose jamais de diagnostic : elle affiche des probabilités. 2. Les CoinPot n'ont aucune valeur monétaire réelle. |
| Les personas | Le Patient (joue et mise), le Proche (rejoint un pari, aucune identité FHIR), le Médecin (extérieur : il agit depuis SON application). |

**2. Prêt pour un sprint** *(le backlog affiné, priorisé — 7 cartes)*

Ce sont les 7 user stories qui ont été tirées dans le Sprint 1. Elles restent visibles ici, avec
le champ Sprint = `S1`.

| Carte | Pts | Priorité |
|---|---|---|
| US-P1 · Consulter les dossiers médicaux | 5 | Must |
| US-P2 · Placer un pari sur un pronostic | 5 | Must |
| US-P3 · Inviter des proches à parier | 3 | Should |
| US-P4 · Résoudre le pari par lecture FHIR du diagnostic | 5 | Must |
| US-P5 · Demander un rendez-vous de suivi | 3 | Should |
| US-P6 · S'authentifier par profil | 2 | Must |
| US-P8 · Habillage casino (feutre, jetons, sons) | 3 | Could |

**3. À affiner** *(ce qui existe mais n'est pas prêt à être engagé — 3 cartes)*

| Carte | Pourquoi ce n'est pas prêt |
|---|---|
| Historique des paris et statistiques du joueur | Pas de maquette, pas de critères d'acceptation écrits. |
| Classement entre proches d'un même dossier | Dépend de l'historique ci-dessus. |
| Mode « médecin de garde » (plusieurs praticiens sur un dossier) | Le modèle FHIR à utiliser n'est pas tranché (`CareTeam` ? plusieurs `performer` ?). |

**4. Retiré du sprint** *(2 cartes — la trace des deux cartes sorties)*

| Carte | Motif du retrait |
|---|---|
| TACHE-P13 · Rédiger le README du dépôt | Doublon de TACHE-P10 (support de soutenance), qui couvrait déjà la documentation livrable. |
| SPIKE-P15 · Comparer Netlify et GitHub Pages | Doublon de TACHE-P12 : la décision a été prise dans la carte de déploiement, sans temps d'analyse dédié. |

> À dire à l'oral si on vous pose la question : elles n'ont pas été « supprimées », elles ont été
> **sorties du sprint** parce qu'elles faisaient doublon. Leurs points ne comptent donc ni dans les
> 52 engagés, ni dans les 44 terminés.

**5. Améliorations** *(hors périmètre — voir `AMELIORATIONS.md` pour le détail des 15 cartes)*

C'est la liste qu'on montre en fin de soutenance, sur la planche « Rétrospective et suites ». Les
trois cartes à mettre en haut, dans cet ordre, sont celles que Rémi cite :

1. Coder les diagnostics en SNOMED CT / CIM-10
2. Authentifier avec SMART on FHIR
3. Remplacer le sondage 7 s par une `Subscription` FHIR

---

## Board 2 — « MediBet · Sprint Backlog Patient »

C'est le board de **Rémi (SM)**, celui sur lequel Corrello est branché. Trois colonnes, tenues à
jour à chaque Daily.

### Liste « À faire » — 0 carte

Vide : tout ce qui restait a été tiré. **Ne remettez rien dedans avant la soutenance**, sinon le
0 / 2 / 14 annoncé sur la planche 6 devient faux.

### Liste « En cours » — 2 cartes, 8 points

| Carte | Pts | Étiquettes | État |
|---|---|---|---|
| **US-P4 · Résoudre le pari par lecture FHIR du diagnostic** | 5 | User Story, FHIR | Checklist DoD **10/10**. Il ne manque que le test croisé Patient/Médecin, qui sera fait pendant la démonstration. |
| **SPIKE-P16 · Valider le cycle Patient complet via Postman** | 3 | Spike, FHIR | POST Patient / GET Patient / GET Observation / POST Appointment rejoués à la main. Reste la rédaction de la note de synthèse. |

Critères d'acceptation à mettre dans la description d'US-P4 (c'est le texte que Neirouz lit sur
la planche 7) :

```
GIVEN une Observation publiée par le médecin sur le serveur FHIR
WHEN MediBet interroge le serveur pour ce patient
THEN le diagnostic s'affiche et le pari est résolu automatiquement
```

### Liste « Terminé » — 14 cartes, 44 points

| Carte | Pts | Type |
|---|---|---|
| US-P1 · Consulter les dossiers médicaux | 5 | User Story |
| US-P2 · Placer un pari sur un pronostic | 5 | User Story |
| US-P3 · Inviter des proches à parier | 3 | User Story |
| US-P5 · Demander un rendez-vous de suivi | 3 | User Story |
| US-P6 · S'authentifier par profil | 2 | User Story |
| US-P8 · Habillage casino | 3 | User Story |
| ST-P7 · Console de traçabilité FHIR en direct | 5 | Story technique |
| SPIKE-P11 · Relecture INVEST du backlog | 2 | Spike |
| TACHE-P9 · Tests d'interopérabilité avec l'équipe Médecin | 3 | Tâche |
| TACHE-P10 · Support de soutenance | 5 | Tâche |
| TACHE-P12 · Responsive mobile + déploiement | 3 | Tâche |
| TACHE-P14 · Session de Planning Poker | 2 | Tâche |
| TACHE-P17 · Tenir le Kanban à jour à chaque Daily | 1 | Tâche |
| TACHE-P18 · Animer les cérémonies Scrum | 2 | Tâche |

**Vérification arithmétique** — c'est ce qui doit tomber juste si le jury compte :

- User stories terminées : 5+5+3+3+2+3 = **21**, plus US-P4 en cours (5) = 26 pts de valeur produit.
- Story technique : 5. Spikes : 2 (P11) + 3 (P16 en cours) = 5. Tâches : 3+5+3+2+1+2 = 16.
- Total actif : 26 + 5 + 5 + 16 = **52**. Terminé : 52 − 5 (US-P4) − 3 (SPIKE-P16) = **44**.

### Definition of Done — à mettre en carte épinglée en haut de « Terminé »

Les 7 critères, à dupliquer en checklist sur **chaque** carte :

1. Critères d'acceptation validés
2. Test manuel réussi
3. Aucun appel FHIR en erreur pendant le scénario
4. Pas de régression connue
5. Relecture de code faite
6. Test croisé Patient / Médecin si la story porte l'étiquette FHIR
7. Documentation à jour

*(La checklist d'US-P4 en compte 10 parce que ses 3 critères d'acceptation y sont ajoutés en plus
des 7 de la DoD — d'où le « 10/10 » annoncé sur les planches 6 et 7.)*

---

## Réglage Corrello à corriger avant la soutenance

Sur `app.getcorrello.com`, le sprint est configuré comme démarrant **mardi 8**. Le nôtre a commencé
**lundi après-midi**. Réglez la date de début du sprint au lundi : le burndown couvrira alors les
six demi-journées que la planche 8 et la trame orale annoncent.

Rappelez-vous que **Corrello compte des cartes, pas des points**. Sa courbe descend de 18 à 2 et sa
vélocité affiche 14 ; la nôtre, en points, descend de 52 à 8 et affiche 44. Les deux sont justes.
