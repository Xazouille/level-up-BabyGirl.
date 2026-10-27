# Notes du projet — Glow Up · Célia

Ce fichier explique **pourquoi** cette appli existe, **comment** elle est construite, **sur quoi** reposent ses choix (études scientifiques comprises) et **comment** continuer à la faire évoluer. Il sert de point de départ à toute nouvelle session de travail (humaine ou Claude).

---

## 1. Pourquoi cette appli

### Le but
Glow Up est le tableau de bord de **développement personnel** de Célia : une appli web perso (téléphone + ordinateur, installable, hors ligne) pour prendre soin d'elle au quotidien — école, sport, culture, lecture, yoga, méditation, sommeil, moins d'écran, activité créative, etc.

C'est une **copie adaptée** de « Level Up », l'appli d'Aaron (dépôt `Xazouille/Tableau-de-bord`), faite par Aaron pour sa copine en octobre 2026. Copie sans l'historique ni les données : les deux applis vivent ensuite chacune leur vie.

### L'idée de départ : une « addiction positive », en plus doux
Comme pour Aaron, l'appli est **motivante, presque addictive, mais au service de vraies actions** : chaque récompense (XP, surprises, cartes, duels…) ne s'obtient **qu'en faisant quelque chose de réel**. Pour Célia, le jeu est **plus doux** : pas de régression du compagnon, des « duels magiques » plutôt que des combats, un ton bienveillant, un style clean girl / zen.

### Le garde-fou
Une motivation uniquement « pour le jeu » finit par s'user (effet nouveauté, sur-justification). D'où une deuxième couche **ancrée dans des études** : identité (« Je suis… »), plans « si… alors… », mur des victoires, bienveillance après un échec, rappel du « pourquoi » et la question mensuelle « pour toi ou pour le jeu ? ». L'objectif : que l'habitude tienne **même si le jeu s'arrêtait**.

### Préférences (à respecter)
- Tout en **français**, au **féminin**, tutoiement, ton **doux** et encourageant. Le prénom affiché est « Célia ».
- Ce qu'elle aime : **Winx Club**, **Hello Kitty** (et les personnages Sanrio), **Monster High**. Style **clean girl / zen** : tons naturels et pastel, titres à empattement fins, beaucoup d'air, ombres légères.
- **Pas de sons**, jamais (vibrations OK).
- Méthode de travail (c'est Aaron qui fait évoluer l'appli) : **proposer d'abord** (liste numérotée / lettrée), Aaron valide par numéro, puis on code. **Demander avant de publier**.
- Les propositions s'appuient de préférence sur de **vraies études** (avec les sources).

---

## 2. Technique

### Pile
- **HTML / CSS / JavaScript vanilla en modules ES**, aucune étape de build, aucune dépendance à installer. Seule bibliothèque : `js/vendor/morphdom.js`.
- **PWA** : `manifest.webmanifest` + `sw.js` (réseau d'abord puis cache). ⚠️ À chaque publication qui change des fichiers JS/CSS, **incrémenter `CACHE`** dans `sw.js` (actuellement `celia-v1`) et **ajouter tout nouveau fichier JS à `ASSETS`**.
- **Hébergement** : GitHub Pages, branche `main`, racine du dépôt (`.nojekyll` présent). Adresse : https://xazouille.github.io/level-up-BabyGirl./
- Lancer en local : `python3 -m http.server 8765` puis http://localhost:8765.

### ⚠️ Même site que l'appli d'Aaron
Les deux applis sont publiées sous `xazouille.github.io` : pour le navigateur, **c'est le même site**, donc le même `localStorage` et les mêmes caches. Pour qu'elles ne se marchent jamais dessus (si on ouvre les deux sur le même téléphone) :
- toutes les clés de Glow Up sont préfixées **`celia-`** (`celia-data`, `celia-sync`, `celia-demo`, préférences `celia-…`) ; le fichier de synchro s'appelle `glow-up-celia.json` ;
- les caches du service worker s'appellent `celia-v…` / `celia-img-v…`, et le service worker ne supprime **que** les anciens caches `celia-` ;
- ne jamais réutiliser une clé `tdb2-…` ni `tdb-sync` (ce sont celles d'Aaron).

### Arborescence
| Fichier | Rôle |
|---|---|
| `js/app.js` | Point d'entrée : rendu, navigation, délégation des clics/saisies, annonces (badges, niveaux, surprises, records, maîtrise, albums, duels, habitudes, compétences, identités, complicité), grands écrans |
| `js/store.js` | Données (`S`), valeurs par défaut (les 16 cases), migration (`normalize`), enregistrement localStorage, **fusion entre appareils** (`merge`), synchro GitHub |
| `js/stats.js` | Séries, scores jour/semaine/mois, journées parfaites (`domainsOn(k)` : une case ajoutée ne compte qu'à partir de son jour d'ajout) |
| `js/measures.js` | Détail d'une case (temps, pages, liste, compétence) et XP correspondante |
| `js/ui.js`, `js/fx.js`, `js/timer.js`, `js/nudges.js`, `js/insights.js`, `js/demo.js` | Interface, effets, minuteur, rappels « presque ! », découvertes, compte démo |
| `js/game/rules.js` | **Cœur du jeu** : `G()` recalcule tout (XP, niveaux, surprises, défis, jokers, **complicité de la PP**, badges) à partir de l'historique |
| `js/game/cards-data.js` | Cartes **générées** par `tools/gen_cards.py` (ne pas modifier à la main) |
| `js/game/*.js` | `tiers` (3 surprises), `gacha`, `opening` (animations, bilans, mot du dimanche), `roster`, `boss` (duels magiques), `mastery`, `albums`, `weekly`, `cosmetics` (titres, cadres, thèmes), `growth`, `identity`, `wins` |
| `js/looks.js` | Les 12 thèmes (tokens CSS), dispositions, icônes |
| `js/views/*.js` | Un écran par fichier |
| `css/app.css` | Tout le style ; en bas, la couche « Glow Up » (surprises pastel, PP ronde, halos, duels mauves) |
| `tools/` | Cartes (`cards.json`, `gen_cards.py`), icônes des thèmes, tests navigateur |

### Les cartes et leurs images
- La liste des cartes est dans **`tools/cards.json`** : séries, familles, rareté, page du wiki. Une seule forme par personnage depuis fin octobre 2026 (Aaron : « pas d'évolution, garder la v1 ») ; le générateur sait encore gérer des formes (`transfo`, `gens`, `forms`) si on y revient un jour.
- Les images viennent des **wikis Fandom** (winx, monsterhigh, hellokitty, nana), affichées directement depuis `static.wikia.nocookie.net` (comme les cartes Dragon Ball de l'appli d'Aaron). Une forme sans image est retirée ; une famille sans image de base aussi.
- Pour (re)chercher les images : **Actions → « Images des cartes » → Run workflow** (`.github/workflows/cartes.yml`). GitHub lance `tools/gen_cards.py`, enregistre `js/game/cards-data.js` et `tools/cards-report.txt` (quelle image pour quelle forme), et pousse des **planches d'aperçu** (et les images en petit, dossier `img/`) sur la branche `apercu-cartes`. Les sessions Claude dans le cloud n'ont pas accès à Fandom : c'est pour ça que la recherche passe par GitHub.
- **Images choisies à la main** (octobre 2026) : pour chaque carte, l'action en mode `candidates` (`tools/explore_cards.py`) a sorti jusqu'à 8 images candidates numérotées, et la meilleure a été choisie à l'œil puis enregistrée dans `cards.json` (`"img": { "id-de-la-forme": "url" }`). Critères validés par Aaron : **A** vraie illustration officielle en pied sur fond uni (pas de capture d'épisode, quiz, bannière, filigrane) ; **B** style cohérent par série, look **classique** (saisons 1 à 3) pour la forme de base des Winx ; **C** visage bien cadré en haut pour la PP. Les personnages sans bonne image ont été retirés ; une forme sans bonne image va dans `"skip": [ids]` (ex. les Trix : Trix → Dark Sirenix).
- Autres modes de l'action : `cats` (catégories des wikis), `discover` (personnages des catégories de `tools/discover.json`, pour en ajouter), `candidates` avec des ids, une clé de série (`winx`, `mh`, `kitty`) ou `new`. Résultats sur la branche `apercu-cartes`, dossier `explore/`.
- Image mal choisie : mettre la bonne à la main dans `cards.json` (`"img"`) ou une recherche dédiée (`"q": { "id-de-la-forme": ["file:mots du fichier"] }`), puis relancer en mode `build`.
- Ne pas renommer l'`id` d'une carte déjà obtenue (sinon elle disparaît de la collection).

### Principes importants (repris de Level Up)
1. **Tout est dérivé de l'historique.** On n'enregistre que les faits (cases cochées, détails, surprises ouvertes, fusions, PP choisies…). XP, surprises gagnées, niveaux, duels, maîtrise, identités, complicité sont **recalculés** par `G()`. Changer une règle peut changer le passé : vérifier que l'ancien historique donne le même résultat.
2. **Cache des calculs** : `G()` est mémorisé tant que `rev()` et le jour ne changent pas. Toute modification de données passe par `save()`.
3. **Fusion multi-appareils** : chaque élément porte `u` (heure de modif) → le plus récent gagne ; les jours sont fusionnés case par case ; les suppressions passent par `S.dead`. Tout nouveau type de données doit être ajouté à `defaults()`, `normalize()` et `merge()`/`mergeGame()`.
4. **Nouvelles cases** ajoutées par une mise à jour : listées dans `NEW_DOMAINS`, ajoutées une seule fois avec `from: today`.
5. **Interface** : délégation via `data-act`, `data-form`, `data-input` ; grands écrans : `data-ov` ; fenêtres du bas dans `SHEETS` (`app.js`).
6. **Préférences locales** (pas synchronisées) via `pref/setPref` (préfixe `celia-`) : onglet, ce qui a déjà été annoncé (`seenLevel`, `seenBoxes`, `compLv`…), minuteur en cours.

### Données (`S`)
`profile`, `settings` (thème, seuil de série, `perfect` = 0,75, `look`, `bedtime`, `layouts`), `domains.list`, `days[YYYY-MM-DD]` (`c`, `x`, `note`, `mood`, `t`), `goals`, `media`, `vision.blocks`, `skills`, `habits`, `reviews[YYYY-MM]`, `wins`, `game` (`pulls`, `trades`, `fusions`, `recycles`, `visits`, `badges`, `jokerDays`, `chal`, `comp` = PP choisies, `rewards`, `since`, `dupFrom`), `dead`.

---

## 3. Les règles du jeu (résumé)

- **Cases du jour** (16) : École, Sport, Culture, Lecture, Alimentation, Méditation, Sommeil, Écran < 2h, Pas de scroll, Pas, Journal, Compétence, Rangement, Hygiène, Yoga, Activité créative. Chaque case a une XP de base, multipliée selon le détail (temps, pages, liste cochée…). Listes : Alimentation = légumes, un fruit, pas de boisson sucrée, fait maison ; Hygiène = skincare du matin, skincare du soir, fil dentaire, boire 1,5 L d'eau (modifiables dans Réglages).
- **Journée parfaite** : **12 cases sur 16** (75 %, réglable, enregistré en proportion). Elle donne un coffret, +50 XP et le coup critique dans le duel.
- **Série 🔥** : un jour compte si ≥ 50 % des cases. **Jokers** : 1 au départ, +1 par semaine entièrement réussie (3 max).
- **Surprises** : petite pochette (1 carte, à 5 cases), coffret (3 cartes, journée parfaite), grand coffret (5 cartes, chaque niveau). Garanties 4★ toutes les 15 cartes, 5★ toutes les 80. Doublons → fusion (éveillée / ultime) ou fragments → boutique.
- **Cartes** : ~117 personnages, une carte chacun (pas d'évolution). Winx Club (fées en look classique, Spécialistes, pixies, Trix, grands méchants), Monster High (génération 1 : ghouls, la bande, garçons, rivales, animaux), Hello Kitty & ses amis (Sanrio), **Nana** (Nana Osaki, Hachi, les Black Stones, Trapnest, les amis de Hachi). 20 albums.
- **Sa PP (compagnon)** : le personnage choisi devient la photo de profil (médaillon de l'accueil). La **complicité** 💗 grandit avec l'XP des jours où il est sa PP et **ne redescend jamais** (pas de « jour sans », pas de régression). Points par palier selon la rareté (`EVO_XP` : 1★ 500 … 5★ 1 750), dont **2 cœurs sur 10 offerts** à chaque palier (`HEART_GIFT` = 20 %, effet « carte de fidélité avec tampons offerts »). Chaque palier débloque des **halos** (Perle niv. 1, Nacre 3, Holographique 6, Arc-en-ciel pastel 10, Poussière d'étoiles 15, Aurore 25). Une ancienne PP garde sa complicité. Chaque dimanche, la PP écrit un **petit mot** dans le bilan de la semaine.
- **Duels magiques** (les boss d'Aaron, adoucis) : une méchante à la fois (Trix, Valtor, Lord Darkar, Sorcières Ancestrales, Kuromi, Toralei…), 7 jours max, énergie = XP (point faible ×2, journée parfaite ×1,5), une sur 4 légendaire.
- **Maîtrise** : 100 niveaux par case, rang tous les 10 niveaux (Novice → Mythe, au féminin).
- **Identités « Je suis… »** : 11 paliers par case (3 → 1 500 jours), au féminin (ex. lecture : Curieuse → Lectrice → Lectrice assidue → … → Légende de la lecture ; yoga : … → Fleur de lotus).
- **Compétences**, **habitudes à arrêter**, **bilan du dimanche** (S → D), **bilan du mois**, **records**, **mur des victoires**, **plans « si… alors… »**, **sommeil régulier**, **bienveillance** après une série cassée : comme dans Level Up.
- **Thèmes** (Jeu → Personnaliser) : Lin, Sauge, Nuage dès le départ ; Rose poudré niv. 5, Lavande niv. 10, Pêche niv. 15, Matcha rang Confirmée, Nacre 5 brillantes, Nuit douce série de 30 jours, Winx album « Le club des Winx », Hello Kitty album « La famille de Kitty », Monster High album « Les ghouls de Monster High ». Icônes : `node tools/gen_theme_icons.js` (étincelle aux couleurs du thème).
- **Cadres du médaillon** : Simple, Perles, Tulipes, Rosée, Or rose, Ruban, Pétales, Arc-en-ciel pastel, Éveil, Étoiles.

---

## 4. Sur quoi on se base (études)

Recherche faite en octobre 2026 pour l'appli d'Aaron, valable ici aussi.

### Est-ce que la gamification marche, et est-ce que ça dure ?
- Méta-analyse d'essais randomisés sur l'activité physique : effet réel, **plus faible mais persistant** à long terme (g ≈ 0,15). — https://pmc.ncbi.nlm.nih.gov/articles/PMC8767479/
- **Effet nouveauté** : l'intérêt baisse vers 4 semaines (puis remonte). — https://eric.ed.gov/?id=EJ1325797
- **Sur-justification** (Deci, Koestner & Ryan) → question mensuelle « pour toi ou pour le jeu ? ». — https://journals.sagepub.com/doi/10.3102/00346543071001001
- **Loot boxes** : lien modéré avec le jeu d'argent → les surprises restent gagnées uniquement par de vraies actions, jamais achetées.
- **Suivre ses progrès** aide à atteindre ses objectifs (Harkin 2016, d = 0,40). — https://eprints.whiterose.ac.uk/id/eprint/91437/
- **Habitude** : 66 jours en moyenne, **rater un jour ne change presque rien** (Lally 2010). — https://doi.org/10.1002/ejsp.674

### Mécaniques retenues (et leur base)
| Mécanique | Étude |
|---|---|
| Jokers | Sharif & Shu 2019 — https://anderson-review.ucla.edu/wp-content/uploads/2021/03/Sharif-Shu_EmergencyReserveFailure_OBHDP2019.pdf |
| Message bienveillant après un échec ; **complicité qui ne redescend jamais** | Breines & Chen 2012 — https://pubmed.ncbi.nlm.nih.gov/22645164/ ; Silverman & Barasch 2023 (une progression affichée « cassée » fait décrocher) — https://www.colorado.edu/business/faculty-research/2023/04/19/or-track-how-broken-streaks-affect-consumer-decisions |
| **2 cœurs offerts à chaque palier** | Nunes & Drèze 2006 : carte de fidélité avec tampons offerts finie bien plus souvent (34 % contre 19 %) — https://doi.org/10.1086/500480 |
| Plans « si… alors… » | Gollwitzer & Sheeran 2006 (d = 0,65) — https://doi.org/10.1016/S0065-2601(06)38002-1 |
| Défis au choix (3 options) | Patall 2008 — https://pubmed.ncbi.nlm.nih.gov/18298272/ |
| Identités « Je suis… » | Bryan et al. 2011 — https://pacscenter.stanford.edu/publications/simple-change-phrasing-can-increase-voter-turnout |
| Mur des victoires | Amabile & Kramer — https://hbswk.hbs.edu/item/6685.html |
| Sommeil régulier | Windred 2023 — https://www.ukbiobank.ac.uk/publications/sleep-regularity-is-a-stronger-predictor-of-mortality-risk-than-sleep-duration-a-prospective-cohort-study/ |
| Case Pas | Paluch 2022 — https://doaj.org/article/c3639c468b4348958202e52793ab979d |

### Idées pas (encore) retenues
À reproposer si besoin : **M1 Série réparable**, **M4 Nouveau départ** lundi / 1er du mois (Dai, Milkman & Riis 2014), **M6 Case dorée mystère**, **M8 Pari avec moi-même**, **M9 Plaisir réservé** (Milkman 2014), **M10 WOOP**, **M12 Saisons de 6 semaines** (contre l'effet nouveauté : par ex. une saison Winx, une saison Monster High…). Nouvelles cases possibles : **3 bonnes choses** (Seligman 2005), **nature 120 min/semaine** (White 2019), **lien social** (Holt-Lunstad 2010), **bonne action** (Curry 2018). Duels : Aaron a dit « on changera peut-être par la suite » (option B : défi sans combat ; C : sans duels).

---

## 5. Historique
3. Fin octobre 2026 : retour aux personnages d'avant l'agrandissement, plus d'évolution (une seule carte par personnage, forme de base), ajout des personnages principaux de Nana (manga d'Ai Yazawa) et de 4 albums.
2. Octobre 2026 : collection agrandie à 243 personnages (objectif 250, les personnages sans bonne image ont été retirés) (elle se finissait en 4 à 7 mois avec ~100), images choisies une à une selon les critères A, B, C, 12 albums et 5 duels de plus.
1. Octobre 2026 : copie de Level Up (sans historique ni données) puis adaptation pour Célia — nom « Glow Up », textes au féminin et ton doux, ses 16 cases, journée parfaite à 12/16, cartes Winx / Monster High / Hello Kitty (images Fandom via GitHub Actions), 16 albums, surprises (pochette, coffret, grand coffret) redessinées, PP avec complicité qui ne redescend jamais (halos, 2 cœurs offerts, mot du dimanche), duels magiques, 12 thèmes clean girl / zen, clés et caches `celia-`.

---

## 6. Tester et publier

### Tests
Tests navigateur avec Playwright (Chromium) dans `tools/tests/` (voir le README de ce dossier). Pour des captures avec les vraies images des cartes : récupérer la branche `apercu-cartes` et passer son dossier `img/` en 2e argument. Toujours vérifier :
- aucune erreur console / page ;
- pas de défilement horizontal à 390 px de large ;
- le mode démo ne touche pas aux vraies données.

### Publier
1. Travailler sur une branche, faire des commits clairs (en français).
2. Incrémenter `CACHE` dans `sw.js` et compléter `ASSETS` si de nouveaux fichiers.
3. Ouvrir une pull request vers `main` puis la fusionner (seulement avec l'accord d'Aaron).
4. GitHub Pages republie en ~1 minute (Settings → Pages : branche `main`, dossier racine). Sur le téléphone, fermer/rouvrir l'appli une ou deux fois pour recevoir la mise à jour.
