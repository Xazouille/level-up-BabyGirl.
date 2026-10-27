// Toutes les cartes du jeu : séries, familles (un personnage) et formes (transformations, générations).
import { CARDS } from './cards-data.js';

export const SERIES = {};
export const RARITY = {
  1: { name: 'Commune', color: '#b8b2a7' },
  2: { name: 'Peu commune', color: '#9cb48a' },
  3: { name: 'Rare', color: '#8aa6c1' },
  4: { name: 'Épique', color: '#b79fd1' },
  5: { name: 'Légendaire', color: '#d8b26e' },
};

// FORMS[id] = { id, name, series, img, next: [ids], line, depth, saga }
export const FORMS = {};
// LINES[id] = { id, series, rarity, base, forms: [ids], depth (nombre d'évolutions possibles) }
export const LINES = {};

// Ajoute les familles d'une série (Winx, Monster High, Hello Kitty)
export function addSeries(key, info, lines) {
  SERIES[key] = info;
  for (const l of lines) {
    const id = l.forms[0].id;
    l.forms.forEach((f, i) => {
      FORMS[f.id] = { id: f.id, name: f.name, series: key, img: f.img || '', small: !!f.small, next: f.next || (l.forms[i + 1] ? [l.forms[i + 1].id] : []), line: id, depth: f.depth ?? i, saga: f.saga || '' };
    });
    LINES[id] = { id, series: key, rarity: l.rarity, base: id, forms: l.forms.map(f => f.id), depth: Math.max(...l.forms.map((f, i) => f.depth ?? i)) };
  }
}

export const linesByRarity = r => Object.values(LINES).filter(l => l.rarity === r);
export const allForms = () => Object.values(FORMS);

for (const s of CARDS) addSeries(s.key, s.info, s.lines);
