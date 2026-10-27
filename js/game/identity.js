// Identités « Je suis… » : chaque domaine a 11 paliers qui se débloquent avec le nombre de jours pratiqués.
// Une identité se construit et ne se perd jamais (dire « je suis une lectrice » motive plus que « je lis »).
import { isDone } from '../store.js';

// 11 paliers : de 3 jours à 1 500 jours (environ 4 ans), pour qu'il reste toujours quelqu'un à devenir
export const IDENT_AT = [3, 10, 25, 50, 100, 200, 365, 500, 730, 1000, 1500];
export const IDENT_XP = [15, 30, 60, 100, 175, 300, 500, 650, 800, 1000, 1500];
const NAMES = {
  ecole: ['Élève', 'Élève régulière', 'Étudiante sérieuse', 'Bosseuse', 'Travailleuse acharnée', 'Esprit affûté', 'Experte en devenir', 'Experte', 'Reine du savoir', 'Sommité', 'Légende du savoir'],
  sport: ['Active', 'Sportive', 'Sportive régulière', 'Athlète', 'Athlète disciplinée', 'Corps tonique', 'Énergie pure', 'Athlète accomplie', 'Force de la nature', 'Wonder Woman', 'Légende du sport'],
  culture: ['Curieuse', 'Spectatrice', 'Spectatrice avertie', 'Amatrice d’art', 'Esprit cultivé', 'Cinéphile', 'Puits de culture', 'Muse des arts', 'Encyclopédie vivante', 'Âme d’artiste', 'Légende de la culture'],
  lecture: ['Curieuse', 'Lectrice', 'Lectrice assidue', 'Grande lectrice', 'Dévoreuse de livres', 'Érudite', 'Rat de bibliothèque', 'Bibliothèque vivante', 'Femme de lettres', 'Sage érudite', 'Légende de la lecture'],
  alim: ['Attentive à son assiette', 'Gourmande équilibrée', 'Adepte du bien-manger', 'Corps bien nourri', 'Pro de la nutrition', 'Reine de son assiette', 'Cuisine healthy', 'Vitalité rayonnante', 'Équilibre parfait', 'Modèle de santé', 'Légende de la nutrition'],
  medit: ['Esprit curieux', 'Méditante', 'Méditante régulière', 'Esprit calme', 'Esprit zen', 'Sage', 'Maîtresse zen', 'Esprit lumineux', 'Paix intérieure', 'Éveillée', 'Légende zen'],
  sommeil: ['Dormeuse', 'Bonne dormeuse', 'Dormeuse régulière', 'Gardienne de ses nuits', 'Pro de la récup', 'Horloge parfaite', 'Reine du sommeil', 'Belle au bois dormant', 'Rythme parfait', 'Énergie infinie', 'Légende du sommeil'],
  ecran: ['Moins connectée', 'Détox en cours', 'Libre de son écran', 'Esprit déconnecté', 'Maîtresse de son attention', 'Imperméable aux écrans', 'Zen numérique', 'Maîtresse de son temps', 'Attention de soie', 'Libre et sereine', 'Légende de la détox'],
  scroll: ['Anti-scroll', 'Résistante', 'Esprit libre', 'Attention protégée', 'Incorruptible', 'Imperméable au scroll', 'Esprit souverain', 'Concentration absolue', 'Volonté de fer', 'Inébranlable', 'Légende anti-scroll'],
  pas: ['Marcheuse', 'Bonne marcheuse', 'Grande marcheuse', 'Randonneuse', 'Infatigable', 'Arpenteuse', 'Globe-trotteuse', 'Exploratrice', 'Marathonienne du quotidien', 'Tour du monde', 'Légende de la marche'],
  journal: ['Plume', 'Plume régulière', 'Diariste', 'Introspective', 'Chroniqueuse de sa vie', 'Mémorialiste', 'Écrivaine de sa vie', 'Mémoire vivante', 'Biographe', 'Autrice de sa vie', 'Légende de la plume'],
  competence: ['Apprenante', 'Curieuse de tout', 'Autodidacte', 'Touche-à-tout', 'Apprenante acharnée', 'Polymathe en devenir', 'Polymathe', 'Esprit universel', 'Génie touche-à-tout', 'Maîtresse des savoirs', 'Légende de l’apprentissage'],
  rangement: ['Rangée', 'Organisée', 'Intérieur net', 'Pro du rangement', 'Maison impeccable', 'Reine de l’ordre', 'Zen et ordonnée', 'Minimaliste', 'Ordre parfait', 'Maîtresse du foyer', 'Légende du rangement'],
  hygiene: ['Soignée', 'Bien dans sa peau', 'Rituel au point', 'Toujours fraîche', 'Glow naturel', 'Soin parfait', 'Élégance naturelle', 'Peau de pêche', 'Rituel sacré', 'Icône clean girl', 'Légende du soin'],
  yoga: ['Curieuse du yoga', 'Yogi', 'Yogi régulière', 'Souple et sereine', 'Corps aligné', 'Yogi accomplie', 'Équilibre parfait', 'Maîtresse du souffle', 'Fleur de lotus', 'Âme de yogi', 'Légende du yoga'],
  creatif: ['Créative', 'Créatrice', 'Créatrice régulière', 'Âme d’artiste', 'Artiste', 'Inventive', 'Esprit créatif', 'Artiste accomplie', 'Muse', 'Virtuose', 'Légende de la création'],
};
const GENERIC = ['Premiers pas', 'Habituée', 'Régulière', 'Passionnée', 'Pilier', 'Experte', 'Virtuose', 'Maîtresse', 'Grande maîtresse', 'Légende', 'Mythe'];
export const identNames = d => NAMES[d.id] || GENERIC.map(n => `${n} · ${d.name}`);

// Pour chaque domaine : palier atteint (0 = aucun), jours pratiqués, jour où chaque palier a été atteint
export function identityState(doms, dayKeys) {
  const out = {};
  for (const d of doms) {
    const at = [];
    let n = 0;
    for (const k of dayKeys) if (isDone(k, d.id)) { n++; const i = IDENT_AT.indexOf(n); if (i >= 0) at[i] = k; }
    const stage = IDENT_AT.filter(x => n >= x).length, names = identNames(d);
    out[d.id] = {
      id: d.id, n, stage, at, names, name: stage ? names[stage - 1] : '',
      next: stage < IDENT_AT.length ? names[stage] : '', nextAt: IDENT_AT[stage] || 0, prevAt: stage ? IDENT_AT[stage - 1] : 0,
      xp: IDENT_XP.slice(0, stage).reduce((a, b) => a + b, 0),
    };
  }
  return out;
}
