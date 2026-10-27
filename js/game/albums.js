// Albums à compléter : chaque album complet rapporte un grand coffret et un titre.
import { LINES } from './roster.js';

const RAW = [
  ['wx-club', '🧚', 'Le club des Winx', 'Fée du club des Winx', ['wx-bloom', 'wx-stella', 'wx-flora', 'wx-musa', 'wx-tecna', 'wx-aisha']],
  ['wx-fees', '✨', 'Les fées d’Alféa', 'Fée d’Alféa', ['wx-bloom', 'wx-roxy', 'wx-daphne', 'wx-faragonda', 'wx-griselda', 'wx-mirta']],
  ['wx-pixies', '🪽', 'Les pixies', 'Amie des pixies', ['wx-lockette', 'wx-amore', 'wx-chatta', 'wx-tune', 'wx-digit', 'wx-piff', 'wx-kiko']],
  ['wx-specialistes', '🗡️', 'Les Spécialistes', 'Cœur de Spécialiste', ['wx-sky', 'wx-brandon', 'wx-helia', 'wx-riven', 'wx-timmy', 'wx-nabu']],
  ['wx-trix', '🌩️', 'Les Trix', 'Plus forte que les Trix', ['wx-icy', 'wx-darcy', 'wx-stormy']],
  ['wx-mechants', '🌑', 'Les grands méchants de Magix', 'Protectrice de Magix', ['wx-valtor', 'wx-darkar', 'wx-sorcieres', 'wx-tritannus', 'wx-kalshara', 'wx-selina', 'wx-politea', 'wx-ogron', 'wx-mandragora']],
  ['mh-ghouls', '🦇', 'Les ghouls de Monster High', 'Ghoul de Monster High', ['mh-frankie', 'mh-draculaura', 'mh-clawdeen', 'mh-cleo', 'mh-lagoona', 'mh-ghoulia']],
  ['mh-amies', '💀', 'La bande élargie', 'Monstrueusement populaire', ['mh-abbey', 'mh-spectra', 'mh-operetta', 'mh-venus', 'mh-robecca', 'mh-rochelle', 'mh-twyla', 'mh-catty', 'mh-skelita', 'mh-cupid', 'mh-elissabat']],
  ['mh-garcons', '🐍', 'Les garçons de Monster High', 'Reine du bal', ['mh-deuce', 'mh-clawd', 'mh-heath', 'mh-manny']],
  ['mh-rivales', '🐾', 'Les rivales', 'Imperturbable', ['mh-toralei', 'mh-purrsephone', 'mh-meowlody', 'mh-nefera']],
  ['mh-pets', '🕷️', 'Les animaux de compagnie', 'Amie des bêtes', ['mh-count-fabulous', 'mh-watzit', 'mh-crescent', 'mh-sweet-fang', 'mh-neptuna', 'mh-hissette', 'mh-perseus']],
  ['hk-kitty', '🎀', 'La famille de Kitty', 'Meilleure amie de Kitty', ['hk-hello-kitty', 'hk-mimmy', 'hk-dear-daniel', 'hk-charmmy-kitty']],
  ['hk-stars', '⭐', 'Les stars de Sanrio', 'Star de Sanrio', ['hk-hello-kitty', 'hk-my-melody', 'hk-kuromi', 'hk-cinnamoroll', 'hk-pompompurin', 'hk-pochacco', 'hk-keroppi']],
  ['hk-douceurs', '🍮', 'Les douceurs', 'Douceur incarnée', ['hk-my-melody', 'hk-my-sweet-piano', 'hk-marron-cream', 'hk-wish-me-mell', 'hk-usahana', 'hk-cogimyun', 'hk-little-twin-stars']],
  ['hk-caracteres', '🖤', 'Les caractères bien trempés', 'Caractère bien trempé', ['hk-kuromi', 'hk-badtz-maru', 'hk-aggretsuko', 'hk-gudetama', 'hk-hangyodon', 'hk-tuxedosam', 'hk-chococat']],
  ['hk-petits', '🐣', 'Les tout-petits', 'Collectionneuse de mignon', ['hk-pekkle', 'hk-kirimi-chan', 'hk-corocorokuririn', 'hk-pandapple', 'hk-bonbonribbon', 'hk-tabo']],
];
export const ALBUMS = RAW.map(([id, emoji, name, title, lines]) => ({ id, emoji, name, title, lines: lines.filter(l => LINES[l]) }))
  .filter(a => a.lines.length >= 3);

// Avancement de chaque album selon les familles obtenues
export const albumState = owned => ALBUMS.map(a => {
  const have = a.lines.filter(l => owned[l]).length;
  return { ...a, have, done: have === a.lines.length };
});
