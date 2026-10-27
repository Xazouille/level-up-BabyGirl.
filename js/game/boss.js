// Méchantes (boss) : une à la fois, à battre en 7 jours maximum avec les cases cochées.
// Battu plus tôt ? Le suivant arrive dès le lendemain. Raté ? Il s'enfuit et reviendra plus tard.
// Tout est recalculé à partir de l'historique, depuis le jour où les boss ont commencé (S.game.since).
import { S, activeDomains } from '../store.js';
import { key, parseKey, addDays, dayDiff, seeded } from '../util.js';
import { isPerfect } from '../stats.js';
import { LINES, FORMS } from './roster.js';

// [famille de la carte, domaine faible, petite phrase]
const NORMAL = [
  ['wx-icy', 'yoga', 'Icy a gelé ta motivation : réchauffe-la avec un peu de yoga.'],
  ['wx-darcy', 'medit', 'Darcy brouille les esprits : quelques minutes de méditation dissipent ses illusions.'],
  ['wx-stormy', 'sommeil', 'Stormy fait gronder l’orage la nuit : une vraie nuit de sommeil la calme.'],
  ['wx-selina', 'lecture', 'Selina vole les histoires : chaque page lue lui en reprend une.'],
  ['wx-politea', 'scroll', 'Politea se glisse partout comme un fil sans fin : pose ton téléphone.'],
  ['wx-ogron', 'creatif', 'Ogron absorbe la magie : ta créativité est plus forte que lui.'],
  ['wx-duman', 'journal', 'Duman change de visage sans arrêt : écris qui tu es vraiment.'],
  ['wx-gantlos', 'sport', 'Gantlos ne mise que sur la force brute : ton endurance le dépasse.'],
  ['wx-anagan', 'pas', 'Anagan court plus vite que tout le monde… sauf toi, pas après pas.'],
  ['mh-moanica-d-kay', 'hygiene', 'Moanica veut transformer tout le monde en zombie : prends soin de toi.'],
  ['wx-mandragora', 'alim', 'Mandragora empoisonne tout : une assiette saine la fait reculer.'],
  ['wx-kalshara', 'pas', 'Kalshara court après les animaux magiques : marche plus qu’elle.'],
  ['mh-toralei', 'sport', 'Toralei se croit la plus agile de Monster High : montre-lui ta forme.'],
  ['mh-purrsephone', 'rangement', 'Purrsephone sème le désordre : range un coin et elle file.'],
  ['mh-meowlody', 'journal', 'Meowlody chuchote des rumeurs : écris ta propre histoire dans ton journal.'],
  ['mh-manny', 'competence', 'Manny fonce sans réfléchir : apprends quelque chose de nouveau.'],
  ['mh-heath', 'hygiene', 'Heath s’enflamme pour un rien : prends soin de toi, en douceur.'],
  ['hk-badtz-maru', 'culture', 'Badtz-Maru boude tout : un film ou une expo le fera sourire.'],
  ['hk-aggretsuko', 'medit', 'Retsuko a besoin de crier : montre-lui que le calme marche mieux.'],
  ['hk-gudetama', 'sport', 'Gudetama ne veut pas bouger… toi si !'],
  ['hk-hangyodon', 'pas', 'Hangyodon traîne les nageoires : entraîne-le en marchant.'],
  ['hk-tuxedosam', 'alim', 'Tuxedosam mange un peu trop de glaces : montre-lui l’exemple.'],
];
const LEGEND = [
  ['wx-valtor', 'medit', 'Valtor, né de la Flamme du Dragon noir : seule une sérénité totale le fait plier.'],
  ['wx-darkar', 'sommeil', 'Lord Darkar plonge le monde dans l’ombre : de belles nuits ramènent la lumière.'],
  ['wx-sorcieres', 'yoga', 'Les Sorcières Ancestrales : il faudra un corps et un esprit alignés.'],
  ['hk-kuromi', 'scroll', 'Kuromi et sa bande veulent te garder sur ton téléphone. Résiste !'],
  ['mh-nefera', 'lecture', 'Nefera de Nile défie ta culture : une bibliothèque entière ne lui fait pas peur.'],
  ['wx-acheron', 'lecture', 'Acheron, le sorcier du Livre Légendaire : chaque page lue affaiblit sa magie.'],
  ['wx-tritannus', 'ecran', 'Tritannus, empereur des océans pollués, se nourrit de la lumière des écrans.'],
];
const mk = ([line, weak, why]) => ({ line, weak, why });
const valid = list => list.map(mk).filter(b => LINES[b.line] && FORMS[LINES[b.line].base]);
export const BOSSES = valid(NORMAL), LEGENDS = valid(LEGEND);
export const bossName = b => FORMS[LINES[b.line].base].name;
export const bossImg = b => FORMS[LINES[b.line].base].img;

const DAY = 864e5;
const nextKey = k => key(addDays(parseKey(k), 1));
function shuffle(list, rnd) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Dégâts d'un jour : l'XP des cases cochées, ×2 sur le point faible, ×1,5 pour une journée parfaite (coup critique)
export function dayDamage(k, weak, per) {
  let x = 0;
  for (const [id, v] of Object.entries(per || {})) x += id === weak ? v * 2 : v;
  return Math.round(isPerfect(k) ? x * 1.5 : x);
}

// Points de vie calés sur tes 4 dernières semaines : une semaine normale suffit à peine, une bonne semaine le bat
function hpFor(start, legendary, caseXPs, first, doms) {
  let sum = 0, n = 0;
  for (let i = 1; i <= 28; i++) {
    const k = key(addDays(parseKey(start), -i));
    if (!first || k < first) break;
    n++;
    for (const v of Object.values(caseXPs[k] || {})) sum += v;
  }
  const fallback = doms.reduce((a, d) => a + (Number(d.xp) || 0), 0) * 0.55;
  const avg = n >= 7 ? sum / n : fallback;
  return Math.max(100, Math.round(avg * 7 * 0.95 * (legendary ? 1.35 : 1) / 10) * 10);
}

function weakOf(b, doms, start) {
  const d = doms.find(x => x.id === b.weak);
  return d ? d.id : doms[Math.floor(seeded(b.line + start)() * doms.length)].id;
}

// Rejoue tous les combats depuis le début : boss battus ou enfuis, et le combat en cours
export function runBosses(caseXPs, tk) {
  const doms = activeDomains(), since = S.game.since;
  if (!since || !doms.length || !BOSSES.length) return { history: [], current: null, nextStart: since };
  const first = Object.keys(S.days).sort()[0];
  const qN = shuffle(BOSSES, seeded('boss-n' + since)), qL = shuffle(LEGENDS, seeded('boss-l' + since));
  const history = [];
  let d = since, i = 0, current = null;
  while (d <= tk && i < 1000) {
    const legendary = LEGENDS.length > 0 && (i + 1) % 4 === 0;
    const q = legendary ? qL : qN;
    if (!q.length) q.push(...shuffle(legendary ? LEGENDS : BOSSES, seeded('boss-r' + i)));
    const b = q.shift();
    const weak = weakOf(b, doms, d), hp = hpFor(d, legendary, caseXPs, first, doms);
    const end = key(addDays(parseKey(d), 6));
    let dmg = 0, won = null;
    const days = [];
    for (let k = d; k <= end && k <= tk; k = nextKey(k)) {
      const x = dayDamage(k, weak, caseXPs[k]);
      dmg += x; days.push([k, x]);
      if (dmg >= hp) { won = k; break; }
    }
    const f = { n: i, ...b, name: bossName(b), img: bossImg(b), legendary, hp, weak, start: d, end, days, dmg: Math.min(dmg, hp) };
    if (won) { history.push({ ...f, won: true, endDay: won, t: parseKey(won).getTime() + DAY / 2 }); d = nextKey(won); }
    else if (end < tk) { history.push({ ...f, won: false, endDay: end }); q.splice(Math.min(3, q.length), 0, b); d = nextKey(end); }
    else { current = { ...f, dayNo: dayDiff(d, tk) + 1, left: dayDiff(tk, end) }; break; }
    i++;
  }
  return { history, current, nextStart: current ? null : d };
}
