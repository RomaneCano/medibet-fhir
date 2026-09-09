# MediBet — Trame orale de la soutenance

**Équipe Patient** · Neirouz Attia (Product Owner), Rémi Delarue (Scrum Master), Romane Cano (Développeuse)
Support : canvas « Soutenance MediBet », 18 planches — également livré en `.pptx`.
Durée cible : **16 min 50**, démonstration comprise.

---

## Mode d'emploi

- Chaque section correspond à **une planche du support**. Le minutage inscrit en bas à droite de chaque planche est le même que celui de cette trame : si vous êtes en avance ou en retard, vous le voyez sur l'écran.
- Le texte est écrit **pour être lu à voix haute**, à rythme normal (environ 150 mots par minute). Ne lisez pas plus vite : les chiffres et les termes FHIR ont besoin d'être posés.
- Les passages entre crochets `[ ]` sont des **indications de scène**, à ne pas lire.
- Répartition, calée sur les rôles réels :
  - **Rémi Delarue — Scrum Master** : planches 1, 2, 3, 4, 6, 8 et 17. Il ouvre, porte le cadre Scrum, le board, le burndown, et referme sur la rétrospective. ≈ 5 min 20.
  - **Neirouz Attia — Product Owner** : planches 5, 7, 9, 10, 11 et 12. Elle porte le backlog, la qualité produit et toute l'analyse métier. ≈ 5 min 25.
  - **Romane Cano — Développeuse** : planches 13, 14, 15 et 16. Elle porte l'architecture, FHIR et la démonstration, démonstration comprise. ≈ 5 min 50.
  - Planche 18 : les trois, debout.
- **Le sprint se termine après cette soutenance.** Nous sommes jeudi matin : le burndown n'est pas à zéro, et c'est normal. Assumez-le, c'est même le point intéressant à commenter.

---

## 1 · Titre — RÉMI · 20 s · 0:20

Bonjour à tous. Nous sommes l'équipe Patient du projet MediBet. Je m'appelle Rémi Delarue, je suis Scrum Master. Neirouz Attia est Product Owner, Romane Cano est développeuse. Nous allons vous présenter notre application, la façon dont nous l'avons construite, et surtout la manière dont elle échange des données avec l'application de l'équipe Médecin, à travers FHIR.

---

## 2 · Le TP et notre plan — RÉMI · 30 s · 0:50

Le sujet demandait quatre choses : constituer une équipe agile, choisir un rôle entre Patient et Médecin, développer une application autour de la plateforme FHIR, et la démontrer avec l'équipe binôme. Nous avons pris le rôle Patient, notre binôme a pris le rôle Médecin.

Nous suivrons exactement le plan de restitution demandé : d'abord l'organisation de l'équipe, puis la démarche projet, ensuite l'analyse métier, puis l'utilisation de FHIR, et nous terminerons par une démonstration en direct sur deux postes.

---

## 3 · Organisation de l'équipe — RÉMI · 50 s · 1:40

Nous sommes trois, avec un rôle Scrum chacun, tenu du début à la fin.

Neirouz est Product Owner : c'est elle qui porte la valeur produit. Elle a rédigé et priorisé le backlog, écrit les critères d'acceptation, et validé ce qui était livré.

Je suis Scrum Master : j'anime les cérémonies, je tiens le board à jour au fil de l'eau, je lève les blocages et je maintiens le burndown.

Romane est développeuse : elle a réalisé les deux applications, testé les appels FHIR, déployé le site et écrit la documentation technique.

Côté outils : deux boards Trello avec le Power-Up Corrello, le Drive, GitHub. Et un mot d'honnêteté : nous avons utilisé Claude comme copilote de développement. Les décisions produit sont restées les nôtres.

---

## 4 · Démarche projet — RÉMI · 45 s · 2:25

Nous avons travaillé en Scrum, sur un sprint unique de trois jours, du lundi après-midi au jeudi matin.

Nous avons tenu les cérémonies : un Sprint Planning lundi, six Daily Meetings de moins de quinze minutes, une session de Planning Poker, et ce matin la Sprint Review et la rétrospective.

Une précision sur le Planning Poker, parce que c'est souvent mal dit : l'estimation est un vote de l'équipe de développement. Le Product Owner clarifie le besoin et répond aux questions, mais il ne tranche pas les points.

Sur un sprint de trois jours, notre sprint backlog représente presque tout le projet — nous y revenons tout de suite.

---

## 5 · Le Product Backlog — NEIROUZ · 60 s · 3:25

[Neirouz prend la parole.]

Le backlog, c'est mon rôle. Et il faut distinguer deux choses qu'on confond souvent.

Le **Product Backlog**, c'est tout ce que MediBet pourrait devenir : je le rédige et je le priorise par la valeur pour le patient. Il contient aussi, volontairement, ce que nous avons décidé de ne pas faire cette semaine.

Le **Sprint Backlog**, c'est seulement ce que l'équipe s'engage à livrer : dix-huit cartes au Sprint Planning, dont deux retirées en cours de route parce qu'elles faisaient doublon. Il reste **seize cartes actives, cinquante-deux points**.

Nous avons typé chaque carte. Sur ces seize, **sept seulement sont de vraies user stories, pour vingt-six points** : c'est là qu'est la valeur livrée au patient. Le reste, c'est une story technique, deux spikes d'analyse et six tâches d'organisation — nécessaires, mais invisibles pour le patient.

Autrement dit : annoncer cinquante-deux points de valeur produit serait faux. Je repasse la parole à Rémi.

---

## 6 · Le Sprint Backlog, colonne par colonne — RÉMI · 50 s · 4:15

Voici les seize cartes engagées, colonne par colonne — le board est ouvert dans un onglet si vous voulez le voir en direct.

Ce matin : **zéro à faire, deux en cours, quatorze terminées**. La colonne « à faire » est vide parce que tout ce qui restait a été tiré.

Les deux cartes en cours sont **US-P4**, la lecture FHIR du diagnostic — checklist Definition of Done à dix sur dix, il ne lui manque que le test croisé que vous allez voir en démonstration — et **SPIKE-P16**, la validation du cycle Patient via Postman.

Un mot sur la méthode : ce board a été tenu au fil de l'eau, à chaque Daily. Il n'a pas été reconstitué la veille — et c'est ce qui rend le burndown suivant exploitable.

---

## 7 · Ce que veut dire « terminé » — NEIROUZ · 60 s · 5:15

[Neirouz.]

Deux notions que nous confondions au début du sprint, et que nous avons séparées.

Les **critères d'acceptation** décrivent ce qu'une story précise doit faire ; c'est moi qui les rédige. Ceux d'US-P4 : étant donné une Observation publiée par le médecin, quand MediBet interroge le serveur FHIR, alors le diagnostic s'affiche et le pari est résolu automatiquement.

La **Definition of Done**, elle, est la même pour toutes les cartes : elle fixe le niveau de qualité à partir duquel on a le droit de dire « terminé ». Sept critères, dont trois qui comptent vraiment ici : aucun appel FHIR en erreur, relecture de code faite, et test croisé Patient-Médecin dès que la story touche à l'interopérabilité.

Elle est dupliquée en checklist sur chaque carte — sur US-P4, avec ses trois critères d'acceptation en plus, la checklist affiche donc dix sur dix. C'est ce qui me permet, en tant que PO, de valider ou de refuser une carte sans discuter.

---

## 8 · Pilotage : le burndown du sprint — RÉMI · 70 s · 6:25

[Rémi.]

Voici notre burndown, en **points restants**, relevé à chaque Daily. Le pointillé doré est la trajectoire idéale, cinquante-deux vers zéro ; la ligne pleine, le réel.

Deux choses à y lire. Nous avons pris **huit points de retard dès le premier après-midi**, consacré au cadrage plutôt qu'au code. Et nous ne les avons jamais rattrapés — mais nous n'en avons pas pris davantage : la courbe réelle est **parallèle** à l'idéale. Le rythme était bon ; c'est l'engagement initial qui était un peu trop ambitieux.

Ce matin, il reste donc **huit points** : exactement les deux cartes en cours. Le sprint se termine après cette soutenance, elles n'y seront pas finies — elles repartent au Product Backlog et seront réengagées au sprint suivant.

Notre vélocité est de **quarante-quatre points sur cinquante-deux**, soit quatre-vingt-cinq pour cent de prédictabilité. Une vigilance pour finir : **Corrello compte des cartes, pas des points** — sa vélocité affiche donc quatorze. Les deux chiffres sont justes, ils ne mesurent pas la même chose.

Je passe la parole à Neirouz.

---

## 9 · Le principe du produit — NEIROUZ · 50 s · 7:15

Merci Rémi. MediBet, c'est un jeu où le patient parie sur son propre diagnostic — et où le diagnostic réel arrive par FHIR.

Le patient décrit ses symptômes. L'application les croise avec une base de soixante-trois pathologies et propose les cinq diagnostics les plus probables, chacun avec une cote. Il engage des CoinPot, notre monnaie virtuelle, sur celui auquel il croit. Le médecin, sur une application totalement séparée, pose le vrai diagnostic dans une ressource FHIR. MediBet le relit sur le serveur et résout le pari tout seul.

La valeur pour le patient : comprendre ses symptômes en s'amusant, et y associer ses proches. Deux garde-fous que nous assumons : l'application ne pose jamais de diagnostic, elle propose des probabilités ; et les CoinPot n'ont aucune valeur réelle.

---

## 10 · Diagramme de cas d'usage — NEIROUZ · 40 s · 7:55

Voici notre diagramme de cas d'usage, côté Patient.

Trois acteurs. Le **Patient** déclenche trois des quatre cas d'usage. Le **Proche** n'entre que par UC2, et il est volontairement sans identité FHIR : c'est un invité, pas un dossier médical. Et le **Médecin** est dessiné à l'extérieur de la frontière, en pointillés : il n'agit pas dans notre application, il agit depuis la sienne.

Cette frontière, c'est tout le sujet. UC3 est le seul cas d'usage qui la traverse : il est écrit par le Médecin et lu par nous, et c'est pour ça qu'il est d'une autre couleur sur le diagramme.

---

## 11 · Nos quatre cas d'usage — NEIROUZ · 60 s · 8:55

Nous avons formalisé quatre cas d'usage, numérotés pour notre seul projet : l'équipe Médecin a les siens.

**UC1** : le patient consulte son dossier et mise. Il coche ses symptômes, l'application crée une vraie ressource Patient sur le serveur FHIR, affiche les cotes, et il place sa mise. La mise est débitée immédiatement.

**UC2** : un proche rejoint le pari à distance avec un code dossier, depuis son propre appareil, et mise sur le même pronostic. C'est le seul cas d'usage sans ressource FHIR : un pari social greffé sur le dossier, pas une donnée clinique.

**UC3**, et c'est notre cas d'usage vitrine : le pari se résout par une vraie lecture FHIR. C'est le seul qui exige deux applications, sur deux postes, sans aucun canal direct entre elles.

**UC4** : après le verdict, le patient demande son rendez-vous de suivi, qui crée une ressource Appointment sur le serveur.

---

## 12 · Le processus métier — NEIROUZ · 55 s · 9:50

Voici le même parcours vu comme un processus, et surtout la frontière de notre périmètre.

À gauche, ce qui nous appartient : décrire les symptômes, placer la mise, éventuellement inviter un proche.

Au centre, en rouge, ce qui ne nous appartient pas : le diagnostic officiel. C'est l'acte du médecin, sur son application. Nous ne le déclenchons pas, nous ne le contrôlons pas, et surtout : **nous ne savons pas quand il arrive**.

À droite, le retour chez nous : nous interrogeons le serveur FHIR pour découvrir si une Observation existe. Si oui, le pari se résout et le rendez-vous devient possible ; sinon, le dossier reste en attente.

Cette frontière est le cœur du sujet : c'est parce que nous ignorons ce qui se passe chez le médecin que nous avons besoin d'un standard d'échange. Romane va vous montrer comment.

---

## 13 · Deux applications, un serveur — ROMANE · 55 s · 10:45

Merci Neirouz. Trois faits d'abord : deux dépôts GitHub différents, deux déploiements différents, deux postes différents. Aucun canal direct entre les deux applications. Si le serveur FHIR tombe, plus rien ne circule entre nous.

C'est notre principale correction du sprint. Au départ, les deux rôles vivaient dans le même fichier : l'application marchait, mais elle ne démontrait rien, puisque les deux moitiés partageaient la même mémoire. Nous avons séparé les codebases en cours de sprint — ça nous a coûté du temps, ça se voit sur le burndown, et c'est la meilleure décision que nous ayons prise.

Le test de bout en bout est passé : un dossier créé chez nous est apparu dans la file du médecin, sur un autre déploiement, et le diagnostic posé chez lui a résolu notre pari.

---

## 14 · Les trois étapes du TP — ROMANE · 65 s · 11:50

L'énoncé demandait trois échanges. Voici comment chacun se traduit chez nous.

**Étape 1, récupérer de la donnée.** Nous créons une ressource **Patient** avec un POST, puis nous la relisons avec un GET à chaque mise — c'est une vérification volontaire que le patient existe bien côté serveur avant d'engager des CoinPot. L'application Médecin, elle, lit la ressource **Practitioner** du praticien.

**Étape 2, envoyer de la donnée.** Le médecin publie une ressource **Observation** : c'est le diagnostic officiel. Et de notre côté, nous la relisons avec un GET filtré par patient. C'est cette lecture qui résout le pari.

**Étape 3, récupérer la donnée.** Après le verdict, nous créons une ressource **Appointment** : la demande de rendez-vous de suivi.

Aucune autre ressource clinique n'est appelée. Une précision utile : l'état du jeu — dossiers, paris, CoinPot — n'est pas de la donnée médicale. Nous le stockons dans la ressource générique **Basic**, que le standard prévoit pour ce qui n'a pas de type dédié.

---

## 15 · L'Observation, attribut par attribut — ROMANE · 80 s · 13:10

Voici la ressource centrale du projet, telle que nous l'envoyons réellement.

`status` vaut **final** : le constat est définitif, ce n'est ni une ébauche, ni une saisie erronée. C'est ce qui nous autorise à trancher un pari dessus.

`subject.reference` pointe vers `Patient/` suivi de l'identifiant. C'est **l'attribut pivot** : c'est par lui que nous retrouvons le diagnostic, avec une recherche filtrée `subject.reference égale Patient` slash l'identifiant. Sans lui, l'Observation existerait sans être rattachable à quiconque.

`code` porte le diagnostic codé, en trois parties : le `system`, qui dit **dans quelle nomenclature** lire le code, le `code` lui-même, et le `display`, le libellé lisible. Nous assumons un point : notre `system` est une nomenclature maison. Un déploiement réel utiliserait SNOMED CT ou la CIM-10 — c'est notre principal écart de conformité, et nous préférons déclarer une URI honnête plutôt qu'usurper une URI officielle.

`effectiveDateTime` date le constat : s'il y a plusieurs Observations, nous gardons la plus récente. Et `performer` référence le **Practitioner** qui a posé le diagnostic : c'est la traçabilité de l'acte.

Chaque ressource et chaque attribut sont documentés dans un dossier technique en ligne, dont le lien est sur la dernière planche.

---

## 16 · Démonstration — ROMANE (avec l'équipe Médecin) · 2 min 30 · 15:40

[Deux postes projetés côte à côte. Ouvrir la console FHIR sur les deux, en bas à droite.]

Passons à la démonstration. À gauche, notre application Patient. À droite, l'application Médecin, de notre équipe binôme. Les deux consoles en bas à droite affichent, en direct, chaque appel réseau réellement envoyé au serveur.

[1 — Décrire les symptômes, valider.] Je décris mes symptômes. L'application crée une vraie ressource Patient : vous voyez la ligne apparaître dans la console. Elle me propose les diagnostics les plus probables, avec leur cote.

[2 — Miser.] Je mise sur celui-ci. La mise est débitée tout de suite.

[3 — Basculer sur le poste Médecin.] Regardez l'écran de droite : le dossier vient d'apparaître dans la file d'attente du médecin. Rien n'a transité entre nos deux applications — il est arrivé par le serveur FHIR.

[4 — Le médecin pose le diagnostic.] Le médecin ouvre le dossier et pose le diagnostic officiel. Dans sa console : un POST sur `/api/observation`.

[5 — Retour sur le poste Patient.] Je reviens sur mon poste et je demande la vérification. GET sur `/api/observation`, filtré sur mon identifiant de patient. L'Observation est trouvée, le pari se résout : j'avais parié juste, mes CoinPot sont crédités.

[6 — Rendez-vous.] Et je récupère mon rendez-vous de suivi : POST sur `/api/appointment`.

La boucle est bouclée, uniquement à travers le standard.

---

## 17 · Rétrospective et suites — RÉMI · 55 s · 16:35

Ce qui a bien marché : les appels FHIR ont fonctionné dès les premiers essais, et le copilote nous a fait gagner du temps.

Ce qui a été difficile : plusieurs bugs ne sont apparus qu'en test croisé avec l'équipe Médecin, c'est-à-dire tard. Et séparer les deux applications en cours de sprint nous a coûté une demi-journée.

Ce que nous ferions autrement : séparer les deux applications dès le premier jour, et écrire les critères d'acceptation au Sprint Planning plutôt qu'après coup.

Et si nous avions un sprint de plus, trois améliorations, dans cet ordre : coder les diagnostics en SNOMED CT ou en CIM-10, pour être compris par un autre système que le nôtre ; authentifier les échanges avec SMART on FHIR ; et remplacer notre interrogation du serveur toutes les sept secondes par une souscription FHIR.

---

## 18 · Merci — LES TROIS · 15 s · 16:50

Merci de votre attention. Le code, l'application et le dossier technique FHIR sont accessibles aux adresses affichées. Nous sommes à votre disposition pour vos questions.

---

# Annexe A — Questions probables sur FHIR, et réponses courtes

À lire la veille. Répondez court, puis proposez de montrer dans la console ou dans le dossier technique.

**« Quelles ressources avez-vous utilisées, et pourquoi celles-là ? »**
Quatre ressources standard, imposées par le parcours métier : `Patient` pour l'identité du joueur, `Practitioner` pour le médecin, `Observation` pour le diagnostic — c'est le type FHIR d'un constat clinique — et `Appointment` pour le rendez-vous de suivi. Plus une ressource générique `Basic` pour l'état du jeu, qui n'est pas une donnée médicale.

**« Pourquoi `Observation` et pas `Condition` pour un diagnostic ? »**
Bonne question, et c'est un choix discutable. `Condition` décrit un problème de santé installé et suivi dans le temps ; `Observation` décrit un constat posé à un instant donné. Notre diagnostic est un verdict ponctuel qui tranche un pari, donc nous avons pris `Observation`. Dans un vrai dossier patient, `Condition` serait probablement plus juste.

**« À quoi sert `status: final` ? »**
C'est un attribut obligatoire d'`Observation`. `final` signifie que le résultat est vérifié et définitif, par opposition à `preliminary`, `registered` ou `entered-in-error`. Nous ne résolvons un pari que sur un constat final.

**« Comment retrouvez-vous l'Observation du bon patient ? »**
Par le paramètre de recherche standard `subject.reference`, en `GET /api/observation?subject.reference=Patient/{id}`. C'est l'attribut pivot : il est écrit par le médecin, et lu par nous.

**« Que faites-vous s'il y a plusieurs Observations ? »**
Nous les trions par `effectiveDateTime` décroissant et nous gardons la plus récente, avec un repli sur `effectivePeriod.start` si la date simple est absente.

**« Votre `system` de codage n'est pas standard. »**
Exact, et c'est assumé : `http://medibet.local/diagnostics` est une nomenclature maison. Nous avons préféré déclarer une URI honnête plutôt que d'usurper celle de SNOMED CT avec des codes qui n'en viennent pas. C'est le premier point de nos améliorations.

**« Le serveur vous répond-il un Bundle ? »**
Non. Le serveur du TP renvoie un tableau JSON brut de ressources, là où un serveur FHIR canonique renverrait un `Bundle` de type `searchset` avec les résultats dans `entry[].resource`. Notre lecture accepte les deux formes, donc l'application est portable sur un vrai serveur sans modification.

**« Comment savez-vous que ce n'est pas simulé ? »**
La console FHIR affiche chaque appel avec sa méthode, son chemin et la réponse du serveur. Et les ressources créées sont vérifiables hors de l'application : on peut interroger le serveur directement, par exemple avec Postman.

**« Et la sécurité ? »**
Il n'y en a pas, et c'est le deuxième écart que nous assumons : le serveur du TP est ouvert, sans authentification. Un déploiement réel passerait par SMART on FHIR avec des scopes OAuth2.

**« Pourquoi détourner `Basic` ? »**
Parce qu'un pari, une cote ou un portefeuille ne sont pas des données cliniques et qu'aucune ressource FHIR ne les décrit. `Basic` est prévue par le standard exactement pour ça : le type réel est porté par `code.text`, et chaque champ par une extension. Dans un vrai produit, cet état vivrait dans un backend applicatif, et FHIR resterait réservé au médical.

**« Comment l'application Patient est-elle prévenue du diagnostic ? »**
Elle ne l'est pas : elle interroge le serveur toutes les sept secondes, et le patient peut aussi forcer la vérification. Il n'y a pas de notification. La bonne solution serait une `Subscription` FHIR.

**« Que se passe-t-il si le serveur ne répond pas ? »**
L'appel est journalisé dans la console avec une réponse nulle, et l'écran affiche une erreur explicite plutôt qu'un faux « en attente ». Nous avons préféré un échec visible à un silence.

---

# Annexe B — Check-list, quinze minutes avant

1. Les deux postes allumés, sur la même connexion, applications ouvertes : la nôtre et celle du binôme.
2. Console FHIR ouverte sur les deux, en bas à droite.
3. Un dossier de test **déjà joué** ce matin, pour vérifier que le serveur du TP répond.
4. Solde CoinPot suffisant sur le compte de démonstration.
5. Board Trello et dashboard Corrello ouverts dans deux onglets — deux planches y renvoient, le jury peut demander à les voir en vrai.
6. Captures d'écran du scénario complet dans un dossier local, en secours si le réseau lâche.
7. Le dossier technique FHIR ouvert dans un onglet : c'est votre filet pour les questions d'attributs.
8. Chronomètre lancé au premier mot.

---

# Annexe C — Les chiffres à ne pas contredire

Relevés sur le board Trello et sur Corrello le 9 septembre. Un seul jeu de chiffres, le même sur le support, dans cette trame et sur le board.

| Ce qu'on annonce | Valeur |
|---|---|
| Cartes au Sprint Planning | 18 |
| Cartes retirées en cours de sprint | 2 |
| Cartes actives | 16 |
| Statut : à faire / en cours / terminé | 0 / 2 / 14 |
| Points actifs | 52 |
| Points terminés | 44, soit ~85 % |
| Dont vraies user stories | 7 cartes, 26 points |
| Story technique | 1 carte, 5 points (ST-P7, console FHIR) |
| Spikes d'analyse | 2 cartes, 5 points (SPIKE-P11, SPIKE-P16) |
| Tâches d'organisation | 6 cartes, 16 points |
| Vélocité Corrello | 14 **cartes** (pas des points) |
| Cartes encore en cours | US-P4 (5 pts, checklist 10/10) et SPIKE-P16 (3 pts) |
| Cas d'usage côté Patient | UC1 à UC4 |
| Ressources FHIR cliniques utilisées | 4 : Patient, Practitioner, Observation, Appointment |
| Symptômes proposés | 37 |
| Pathologies dans la base | 63 |
| Durée du sprint | 3 jours, 6 demi-journées (lundi PM → jeudi AM) |
| Points restants ce matin | 8 = US-P4 (5) + SPIKE-P16 (3) |
| Vélocité du sprint | 44 points |
| Prédictabilité | 44 / 52 ≈ 85 % |

**Le burndown, demi-journée par demi-journée** (points restants, ce que trace la planche 8)

| Relevé | Points restants | Idéal |
|---|---|---|
| Départ (lundi PM) | 52 | 52 |
| Lundi PM (Daily) | 52 | 43 |
| Mardi AM | 42 | 35 |
| Mardi PM | 34 | 26 |
| Mercredi AM | 26 | 17 |
| Mercredi PM | 16 | 9 |
| **Jeudi AM — maintenant** | **8** | 0 |

Lecture : 8 points de retard pris dès le premier après-midi (cadrage, aucune carte terminée), jamais rattrapés mais jamais aggravés — la courbe réelle est parallèle à l'idéale. 44 points brûlés sur 52.

**Trois pièges à éviter à l'oral**

1. Ne jamais additionner la vélocité Corrello (14 cartes) et les points (44) : deux unités différentes. Si le jury demande « quelle est votre vélocité ? », répondez : « 14 cartes terminées selon Corrello, ce qui correspond à 44 points sur les 52 engagés ».
2. Ne pas annoncer les 52 points comme de la valeur produit : seuls 26 le sont.
3. Ne pas s'excuser d'un burndown qui ne touche pas zéro. **Le sprint se termine après la soutenance** : il est normal qu'il reste 8 points. Ce qui se commente, c'est que la courbe soit parallèle à l'idéale — le rythme était bon, l'engagement initial était un peu trop haut.

**À vérifier le matin même** : que le board n'a pas bougé (0 / 2 / 14) et que les deux cartes en cours sont bien celles annoncées. Les chiffres se modifient directement dans le canvas, sur les planches « Board Trello » et « Pilotage Corrello » (et dans `build_slides.py` / `make_pptx.js` si vous régénérez le `.pptx`).

**Un réglage Corrello à corriger** si vous voulez être irréprochables : le sprint y démarre le mardi 8, alors que le nôtre a commencé le lundi après-midi. Dans Corrello, réglez la date de début du sprint au lundi : le burndown couvrira alors les six demi-journées que vous annoncez.

---

# Annexe D — Liens

- Application Patient : https://romanecano.github.io/medibet-fhir/
- Dossier technique FHIR : https://romanecano.github.io/medibet-fhir/fhir-medibet.html
- Suivi agile : https://romanecano.github.io/medibet-fhir/sprint-medibet.html
- Code Patient : https://github.com/RomaneCano/medibet-fhir
- Code Médecin : https://github.com/RomaneCano/medibet-medecin-fhir
- Support de soutenance (canvas) : https://claude.ai/code/artifact/d806fb9f-273c-4ece-bec9-56ce86d91c41
