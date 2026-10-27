// Albums à compléter : chaque album complet rapporte un grand coffret et un titre.
import { LINES } from './roster.js';

const RAW = [
  ['wx-club', '🧚', 'Le club des Winx', 'Fée du club des Winx', ['wx-bloom', 'wx-stella', 'wx-flora', 'wx-musa', 'wx-tecna', 'wx-aisha']],
  ['wx-fees', '✨', 'Les fées d’Alféa', 'Fée d’Alféa', ['wx-bloom', 'wx-roxy', 'wx-daphne', 'wx-faragonda', 'wx-griselda', 'wx-mirta']],
  ['wx-pixies', '🪽', 'Les pixies', 'Amie des pixies', ['wx-lockette', 'wx-amore', 'wx-chatta', 'wx-tune', 'wx-digit', 'wx-piff', 'wx-kiko']],
  ['wx-pixies2', '🧁', 'Le village des pixies', 'Protectrice des pixies', ['wx-ninfea', 'wx-livy', 'wx-zing', 'wx-cherie', 'wx-caramel', 'wx-jolly', 'wx-concorda', 'wx-tressa']],
  ['wx-royaux', '👑', 'Les familles royales', 'Princesse de Magix', ['wx-reine-marion', 'wx-roi-oritel', 'wx-roi-radius', 'wx-reine-luna', 'wx-roi-erendor', 'wx-daphne', 'wx-krystal', 'wx-galatea', 'wx-diaspro', 'wx-nebula', 'wx-morgana']],
  ['wx-profs', '🎓', 'Les professeurs de Magix', 'Élève modèle de Magix', ['wx-faragonda', 'wx-griselda', 'wx-palladium', 'wx-wizgiz', 'wx-saladin', 'wx-codatorta', 'wx-griffin', 'wx-ediltrude', 'wx-avalon']],
  ['wx-terre', '🌍', 'Les amis de la Terre', 'Fée de Gardenia', ['wx-andy', 'wx-mitzi', 'wx-vanessa', 'wx-mike', 'wx-roxy', 'wx-klaus', 'wx-knut', 'wx-lucy', 'wx-ortensia']],
  ['wx-cercle', '⚫', 'Le Cercle Noir', 'Plus forte que le Cercle Noir', ['wx-ogron', 'wx-duman', 'wx-gantlos', 'wx-anagan']],
  ['wx-specialistes', '🗡️', 'Les Spécialistes', 'Cœur de Spécialiste', ['wx-sky', 'wx-brandon', 'wx-helia', 'wx-riven', 'wx-timmy', 'wx-nabu']],
  ['wx-trix', '🌩️', 'Les Trix', 'Plus forte que les Trix', ['wx-icy', 'wx-darcy', 'wx-stormy']],
  ['wx-mechants', '🌑', 'Les grands méchants de Magix', 'Protectrice de Magix', ['wx-valtor', 'wx-darkar', 'wx-sorcieres', 'wx-tritannus', 'wx-kalshara', 'wx-selina', 'wx-politea', 'wx-ogron', 'wx-mandragora']],
  ['mh-ghouls', '🦇', 'Les ghouls de Monster High', 'Ghoul de Monster High', ['mh-frankie', 'mh-draculaura', 'mh-clawdeen', 'mh-cleo', 'mh-lagoona', 'mh-ghoulia']],
  ['mh-amies', '💀', 'La bande élargie', 'Monstrueusement populaire', ['mh-abbey', 'mh-spectra', 'mh-operetta', 'mh-venus', 'mh-robecca', 'mh-rochelle', 'mh-twyla', 'mh-catty', 'mh-skelita', 'mh-cupid', 'mh-elissabat']],
  ['mh-garcons', '🐍', 'Les garçons de Monster High', 'Reine du bal', ['mh-deuce', 'mh-clawd', 'mh-heath', 'mh-manny']],
  ['mh-rivales', '🐾', 'Les rivales', 'Imperturbable', ['mh-toralei', 'mh-purrsephone', 'mh-meowlody', 'mh-nefera']],
  ['mh-pets', '🕷️', 'Les animaux de compagnie', 'Amie des bêtes', ['mh-count-fabulous', 'mh-watzit', 'mh-crescent', 'mh-sweet-fang', 'mh-neptuna', 'mh-perseus', 'mh-captain-penny', 'mh-sir-hoots-a-lot', 'mh-memphis-longlegs', 'mh-shiver', 'mh-rhuen', 'mh-qing', 'mh-thornton', 'mh-nightmare', 'mh-tundra']],
  ['mh-nouvelles', '🕸️', 'Les nouvelles élèves', 'Nouvelle reine du lycée', ['mh-wydowna-spider', 'mh-amanita-nightshade', 'mh-jane-boolittle', 'mh-marisol-coxi', 'mh-scarah-screams', 'mh-gooliope-jellington', 'mh-casta-fierce', 'mh-catrine-demew', 'mh-elle-eedee', 'mh-batsy-claro', 'mh-viperine-gorgon', 'mh-iris-clops', 'mh-bonita-femur']],
  ['mh-monde', '🌏', 'Monstres du monde entier', 'Ghoul internationale', ['mh-abbey', 'mh-jinafire', 'mh-skelita', 'mh-kiyomi', 'mh-lorna-mcnessie', 'mh-isi-dawndancer', 'mh-marisol-coxi', 'mh-catrine-demew', 'mh-rochelle', 'mh-gilda-goldstag']],
  ['mh-garcons2', '🎸', 'La bande des garçons', 'Cœur de Monster High', ['mh-jackson-jekyll', 'mh-holt-hyde', 'mh-kieran-valentine', 'mh-gil-webber', 'mh-andy-beast', 'mh-invisi-billy', 'mh-finnegan-wake', 'mh-romulus', 'mh-bram-de-fanglas', 'mh-slo-mo-deadan', 'mh-porter-geiss', 'mh-garrott-duroque', 'mh-neighthan-rot']],
  ['hk-kitty', '🎀', 'La famille de Kitty', 'Meilleure amie de Kitty', ['hk-hello-kitty', 'hk-mimmy', 'hk-dear-daniel', 'hk-charmmy-kitty', 'hk-george-white', 'hk-mary-white', 'hk-anthony-white', 'hk-margaret-white']],
  ['hk-amis-kitty', '🏡', 'Les amis de Kitty', 'Voisine de Kitty', ['hk-fifi', 'hk-tracy', 'hk-joey', 'hk-jodie', 'hk-tippy', 'hk-rory', 'hk-cathy', 'hk-tiny-chum']],
  ['hk-cinna', '☁️', 'Les amis de Cinnamoroll', 'Nuage tout doux', ['hk-cinnamoroll', 'hk-mocha', 'hk-chiffon', 'hk-cappuccino', 'hk-milk', 'hk-espresso']],
  ['hk-jewelpet', '💎', 'Jewelpet', 'Bijou précieux', ['hk-ruby', 'hk-garnet', 'hk-sapphie']],
  ['hk-bureau', '🎤', 'Aggretsuko et ses collègues', 'Collègue en or', ['hk-aggretsuko', 'hk-fenneko', 'hk-haida']],
  ['hk-stars', '⭐', 'Les stars de Sanrio', 'Star de Sanrio', ['hk-hello-kitty', 'hk-my-melody', 'hk-kuromi', 'hk-cinnamoroll', 'hk-pompompurin', 'hk-pochacco', 'hk-keroppi']],
  ['hk-douceurs', '🍮', 'Les douceurs', 'Douceur incarnée', ['hk-my-melody', 'hk-my-sweet-piano', 'hk-marron-cream', 'hk-wish-me-mell', 'hk-usahana', 'hk-cogimyun', 'hk-little-twin-stars']],
  ['hk-caracteres', '🖤', 'Les caractères bien trempés', 'Caractère bien trempé', ['hk-kuromi', 'hk-badtz-maru', 'hk-aggretsuko', 'hk-gudetama', 'hk-hangyodon', 'hk-tuxedosam', 'hk-chococat']],
  ['hk-petits', '🐣', 'Les tout-petits', 'Collectionneuse de mignon', ['hk-pekkle', 'hk-kirimi-chan', 'hk-corocorokuririn', 'hk-pandapple', 'hk-bonbonribbon', 'hk-tabo', 'hk-muffin', 'hk-scone', 'hk-bagel', 'hk-hana-maru', 'hk-keroleen']],
];
export const ALBUMS = RAW.map(([id, emoji, name, title, lines]) => ({ id, emoji, name, title, lines: lines.filter(l => LINES[l]) }))
  .filter(a => a.lines.length >= 3);

// Avancement de chaque album selon les familles obtenues
export const albumState = owned => ALBUMS.map(a => {
  const have = a.lines.filter(l => owned[l]).length;
  return { ...a, have, done: have === a.lines.length };
});
