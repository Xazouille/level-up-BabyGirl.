// Apparence : thèmes complets (couleurs, polices, arrondis, en clair et en sombre) et dispositions de l'écran.
// Les thèmes se débloquent dans le jeu et se choisissent dans Personnaliser (3 dès le départ : Lin, Sauge, Nuage) ;
// la disposition se choisit dans Réglages, et chaque thème garde la sienne.
import { S } from './store.js';


// fonts : familles Google Fonts à charger ; base : tokens communs aux deux modes
// Style « clean girl » / zen : tons naturels et pastel, titres à empattement fins, beaucoup d'air, ombres légères
const CORMORANT = '"Cormorant Garamond",Georgia,serif', PLAYFAIR = '"Playfair Display",Georgia,serif', FRAUNCES = '"Fraunces",Georgia,serif';
const DMSANS = '"DM Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', JOST = '"Jost",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
const F_CORM = 'Cormorant+Garamond:wght@500;600;700', F_PLAY = 'Playfair+Display:wght@500;600;700', F_FRAU = 'Fraunces:opsz,wght@9..144,500;9..144,600';
const F_DM = 'DM+Sans:wght@400;500;700;800', F_JOST = 'Jost:wght@400;500;600;700';
const SOFT_L = c => ({ line: `rgba(${c},.08)`, line2: `rgba(${c},.15)`, cell0: `rgba(${c},.06)`, shadow: `0 1px 2px rgba(${c},.04),0 10px 30px rgba(${c},.06)` });
const SOFT_D = { line: 'rgba(255,250,245,.07)', line2: 'rgba(255,250,245,.13)', cell0: 'rgba(255,250,245,.06)', shadow: '0 1px 0 rgba(255,255,255,.03) inset,0 10px 30px rgba(0,0,0,.25)' };
export const UIS = [
  { id: 'lin', name: 'Lin', desc: 'Crème et latte, tout en douceur', icon: [['#e9dccd', '#c9ab92', '#b08d74'], '#fffaf3'], fonts: [F_CORM, F_DM],
    base: { r: '22px', 'r-sm': '14px', head: CORMORANT, sans: DMSANS },
    light: { bg: '#f7f3ee', 'bg-a': '#efe4d8', 'bg-b': '#f4e9e4', card: '#fffdfa', card2: '#f6f0e9', text: '#3b3129', muted: '#8a7c6f', faint: '#bcb0a3', accent: '#a07d62', accent2: '#c08f86',
      grad: 'linear-gradient(135deg,#bfa38b 0%,#ad8f7a 50%,#ba958b 100%)', 'lv-bg': 'linear-gradient(135deg,#6f5b4b 0%,#8f7562 100%)', ...SOFT_L('90,65,40') },
    dark: { bg: '#1a1613', 'bg-a': '#2b231d', 'bg-b': '#291f1f', card: '#221c18', card2: '#2b241f', text: '#f3ece4', muted: '#b5a798', faint: '#7a6e62', accent: '#d4b497', accent2: '#e0b3a8',
      grad: 'linear-gradient(135deg,#8c7461 0%,#7d6555 50%,#8a6c66 100%)', 'lv-bg': 'linear-gradient(135deg,#3a2f27 0%,#4d3f34 100%)', ...SOFT_D } },
  { id: 'sauge', name: 'Sauge', desc: 'Vert sauge et lin, apaisant', icon: [['#dfe6d6', '#a9bc9a', '#7d9473'], '#fbfdf8'], fonts: [F_FRAU, F_JOST],
    base: { r: '22px', 'r-sm': '14px', head: FRAUNCES, sans: JOST },
    light: { bg: '#f3f5f0', 'bg-a': '#e2e9da', 'bg-b': '#eeefe4', card: '#fdfefb', card2: '#eff3eb', text: '#2f3a2e', muted: '#77826e', faint: '#adb6a4', accent: '#6f8866', accent2: '#a88f70',
      grad: 'linear-gradient(135deg,#97ab88 0%,#82987a 50%,#a8a083 100%)', 'lv-bg': 'linear-gradient(135deg,#46583f 0%,#62775a 100%)', ...SOFT_L('50,70,40') },
    dark: { bg: '#121611', 'bg-a': '#1f2a1c', 'bg-b': '#26261b', card: '#1a1f18', card2: '#222920', text: '#ecf1e6', muted: '#a3b199', faint: '#69765f', accent: '#a9c49c', accent2: '#cdb592',
      grad: 'linear-gradient(135deg,#5e7254 0%,#51664b 50%,#6a6550 100%)', 'lv-bg': 'linear-gradient(135deg,#27321f 0%,#36452e 100%)', ...SOFT_D } },
  { id: 'nuage', name: 'Nuage', desc: 'Blanc et gris perle, minimaliste', icon: [['#f4f4f6', '#d6d6de', '#a9a9b8'], '#5a5a66'], fonts: [F_PLAY, F_JOST],
    base: { r: '18px', 'r-sm': '12px', head: PLAYFAIR, sans: JOST },
    light: { bg: '#f6f6f7', 'bg-a': '#ececf0', 'bg-b': '#f2eef1', card: '#ffffff', card2: '#f4f4f6', text: '#2e2e34', muted: '#7b7b86', faint: '#b4b4bc', accent: '#6f6f82', accent2: '#a88b9a',
      grad: 'linear-gradient(135deg,#9a9aab 0%,#87879a 50%,#a08f9a 100%)', 'lv-bg': 'linear-gradient(135deg,#3f3f49 0%,#5b5b68 100%)', ...SOFT_L('40,40,60') },
    dark: { bg: '#131316', 'bg-a': '#1d1d23', 'bg-b': '#211c20', card: '#1b1b20', card2: '#23232a', text: '#f0f0f3', muted: '#a8a8b3', faint: '#6c6c77', accent: '#c4c4d4', accent2: '#d6b8c7',
      grad: 'linear-gradient(135deg,#5e5e6e 0%,#50505f 50%,#64575f 100%)', 'lv-bg': 'linear-gradient(135deg,#26262d 0%,#34343e 100%)', ...SOFT_D } },
  { id: 'rose', name: 'Rose poudré', desc: 'Rose poudré et terracotta tendre', icon: [['#f6dfe0', '#dca2a8', '#c48289'], '#fffafa'], fonts: [F_CORM, F_DM],
    base: { r: '24px', 'r-sm': '16px', head: CORMORANT, sans: DMSANS },
    light: { bg: '#fbf4f3', 'bg-a': '#f6dfe0', 'bg-b': '#f8ebe4', card: '#fffafa', card2: '#fbf0f0', text: '#43302f', muted: '#9a7775', faint: '#cdb0ae', accent: '#b9737a', accent2: '#c5926c',
      grad: 'linear-gradient(135deg,#d39aa0 0%,#c4848b 50%,#cf9a86 100%)', 'lv-bg': 'linear-gradient(135deg,#7a4f53 0%,#9c656b 100%)', ...SOFT_L('110,50,55') },
    dark: { bg: '#1b1314', 'bg-a': '#33201f', 'bg-b': '#2e2019', card: '#241819', card2: '#2e1f20', text: '#f8ecec', muted: '#c9a3a2', faint: '#82625f', accent: '#e9a9ae', accent2: '#e4b38f',
      grad: 'linear-gradient(135deg,#94656a 0%,#83575d 50%,#916a5b 100%)', 'lv-bg': 'linear-gradient(135deg,#43292b 0%,#5a3739 100%)', ...SOFT_D } },
  { id: 'lavande', name: 'Lavande', desc: 'Lavande et lilas, sereine', icon: [['#ebe4f5', '#b6a6d8', '#8f7fba'], '#fdfcff'], fonts: [F_PLAY, F_JOST],
    base: { r: '22px', 'r-sm': '14px', head: PLAYFAIR, sans: JOST },
    light: { bg: '#f6f4fa', 'bg-a': '#e7e1f3', 'bg-b': '#f0e7f2', card: '#fffeff', card2: '#f3f0f8', text: '#352f45', muted: '#857d99', faint: '#b9b2c9', accent: '#8070ad', accent2: '#b0809f',
      grad: 'linear-gradient(135deg,#a797cc 0%,#9584bf 50%,#b693b5 100%)', 'lv-bg': 'linear-gradient(135deg,#4f4570 0%,#6c5e92 100%)', ...SOFT_L('60,45,110') },
    dark: { bg: '#141219', 'bg-a': '#241f35', 'bg-b': '#2b1f2c', card: '#1c1924', card2: '#25212f', text: '#f1edf8', muted: '#ada4c4', faint: '#6f6884', accent: '#c4b6ec', accent2: '#e2b4d4',
      grad: 'linear-gradient(135deg,#6f6294 0%,#615587 50%,#7a6180 100%)', 'lv-bg': 'linear-gradient(135deg,#2c2640 0%,#3b3355 100%)', ...SOFT_D } },
  { id: 'peche', name: 'Pêche', desc: 'Pêche et abricot, lumineuse', icon: [['#fbe3d6', '#eeb08f', '#d98d6c'], '#fffbf8'], fonts: [F_CORM, F_DM],
    base: { r: '24px', 'r-sm': '16px', head: CORMORANT, sans: DMSANS },
    light: { bg: '#fdf5f0', 'bg-a': '#fbe1d3', 'bg-b': '#fbeee0', card: '#fffbf8', card2: '#fcf1ea', text: '#45332a', muted: '#9c7f6f', faint: '#d0b7a8', accent: '#c97f5c', accent2: '#c27c82',
      grad: 'linear-gradient(135deg,#e5a685 0%,#d99272 50%,#dc9e94 100%)', 'lv-bg': 'linear-gradient(135deg,#7f5440 0%,#a06c53 100%)', ...SOFT_L('120,70,40') },
    dark: { bg: '#1b1410', 'bg-a': '#33221a', 'bg-b': '#30241a', card: '#241a15', card2: '#2e221b', text: '#fbefe8', muted: '#cfae9c', faint: '#856a5c', accent: '#f2b693', accent2: '#e8a6ab',
      grad: 'linear-gradient(135deg,#9b6d55 0%,#8b5f49 50%,#936c66 100%)', 'lv-bg': 'linear-gradient(135deg,#452f24 0%,#5c3f30 100%)', ...SOFT_D } },
  { id: 'matcha', name: 'Matcha', desc: 'Vert matcha et crème d’avoine', icon: [['#e4ead0', '#a5b673', '#7e8f4f'], '#fbfcf4'], fonts: [F_FRAU, F_JOST],
    base: { r: '20px', 'r-sm': '13px', head: FRAUNCES, sans: JOST },
    light: { bg: '#f4f5ec', 'bg-a': '#e3e9cf', 'bg-b': '#f1ecdb', card: '#fefef9', card2: '#f1f3e7', text: '#2f3524', muted: '#7a8164', faint: '#b0b59a', accent: '#76874a', accent2: '#ac9060',
      grad: 'linear-gradient(135deg,#9fb06b 0%,#8a9c59 50%,#b2a479 100%)', 'lv-bg': 'linear-gradient(135deg,#4a5531 0%,#637143 100%)', ...SOFT_L('60,70,30') },
    dark: { bg: '#13150d', 'bg-a': '#232a16', 'bg-b': '#2a2617', card: '#1b1e13', card2: '#23271a', text: '#eff2e2', muted: '#aab38e', faint: '#6b7254', accent: '#bccd8a', accent2: '#d8bf8c',
      grad: 'linear-gradient(135deg,#66733f 0%,#5a6637 50%,#6f6649 100%)', 'lv-bg': 'linear-gradient(135deg,#2c3320 0%,#3b4429 100%)', ...SOFT_D } },
  { id: 'nacre', name: 'Nacre', desc: 'Reflets irisés comme une perle', icon: [['#f3e2ec', '#dfe6f5', '#d9efe9', '#f3e6d6'], '#8f7fa8'], fonts: [F_PLAY, F_JOST],
    base: { r: '24px', 'r-sm': '16px', head: PLAYFAIR, sans: JOST },
    light: { bg: '#f8f7f7', 'bg-a': '#e6eef3', 'bg-b': '#f4e6ee', card: '#ffffff', card2: '#f5f4f7', text: '#343038', muted: '#85808c', faint: '#b9b4bf', accent: '#8a7cb0', accent2: '#6c9fb0',
      grad: 'linear-gradient(135deg,#c09bb5 0%,#9fa6cc 35%,#8fbcb3 65%,#c7a98c 100%)', 'lv-bg': 'linear-gradient(135deg,#4d4560 0%,#4b5d6e 100%)', ...SOFT_L('60,50,80') },
    dark: { bg: '#141317', 'bg-a': '#1c2329', 'bg-b': '#271c24', card: '#1c1b20', card2: '#25232a', text: '#f3f1f6', muted: '#aeaab6', faint: '#6e6a76', accent: '#c5b9e6', accent2: '#a9d4df',
      grad: 'linear-gradient(135deg,#86657d 0%,#666e94 35%,#5a837b 65%,#8a7058 100%)', 'lv-bg': 'linear-gradient(135deg,#2b2736 0%,#29343e 100%)', ...SOFT_D } },
  { id: 'nuit', name: 'Nuit douce', desc: 'Taupe profond et bougie, pour le soir', icon: [['#2b2522', '#3d3430', '#5a4b42'], '#e8cfb5'], fonts: [F_CORM, F_DM],
    base: { r: '22px', 'r-sm': '14px', head: CORMORANT, sans: DMSANS },
    light: { bg: '#1a1614', 'bg-a': '#2a221e', 'bg-b': '#2a1f1c', card: '#231d1a', card2: '#2c2521', text: '#f2e8de', muted: '#b9a797', faint: '#7c6d61', accent: '#e2c09f', accent2: '#d9a99a',
      grad: 'linear-gradient(135deg,#8a6f5a 0%,#77604f 50%,#866a61 100%)', 'lv-bg': 'linear-gradient(135deg,#352b25 0%,#4a3c33 100%)', ...SOFT_D },
    dark: {} },
  { id: 'winx', name: 'Winx', desc: 'Pastel irisé, ailes de fée', icon: [['#f6c6ea', '#c9a6ef', '#9ad3f2'], '#ffffff'], fonts: ['Comfortaa:wght@500;600;700', F_JOST],
    base: { r: '26px', 'r-sm': '18px', head: '"Comfortaa","Jost",system-ui,sans-serif', sans: JOST },
    light: { bg: '#fbf6fd', 'bg-a': '#f5ddf4', 'bg-b': '#ddeffb', card: '#fffdff', card2: '#f8f1fb', text: '#3d2a48', muted: '#8d779b', faint: '#c3b2cc', accent: '#b25bae', accent2: '#4f97c7',
      grad: 'linear-gradient(135deg,#df86c9 0%,#ab85dd 50%,#72b6e0 100%)', 'lv-bg': 'linear-gradient(135deg,#5a2f73 0%,#6f4592 50%,#3f6c9e 100%)', ...SOFT_L('90,40,110') },
    dark: { bg: '#15101b', 'bg-a': '#2e1a37', 'bg-b': '#172739', card: '#1d1624', card2: '#261d2f', text: '#f8f0fc', muted: '#c0a9cf', faint: '#7b6889', accent: '#f0a2e0', accent2: '#9fd2f5',
      grad: 'linear-gradient(135deg,#a05a92 0%,#7a5aa6 50%,#4e7fa6 100%)', 'lv-bg': 'linear-gradient(135deg,#34193f 0%,#3f2a5a 50%,#22405e 100%)', ...SOFT_D } },
  { id: 'kitty', name: 'Hello Kitty', desc: 'Blanc, rouge nœud et rose bonbon', icon: [['#ffffff', '#ffe1e7', '#f4a7b9'], '#e0475e'], fonts: ['Fredoka:wght@500;600;700', 'Nunito:wght@400;600;700;800'],
    base: { r: '26px', 'r-sm': '18px', head: '"Fredoka","Nunito",system-ui,sans-serif', sans: '"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif' },
    light: { bg: '#fff7f8', 'bg-a': '#ffe0e6', 'bg-b': '#fff0ee', card: '#ffffff', card2: '#fff3f5', text: '#3a2226', muted: '#9a6c74', faint: '#d2adb4', accent: '#d93a54', accent2: '#e07b98',
      grad: 'linear-gradient(135deg,#ee7890 0%,#e2526b 50%,#ee93a9 100%)', 'lv-bg': 'linear-gradient(135deg,#8c2537 0%,#b8364f 100%)', ...SOFT_L('120,30,45') },
    dark: { bg: '#1a1012', 'bg-a': '#3a1820', 'bg-b': '#2d1a1c', card: '#24161a', card2: '#2e1c21', text: '#fff0f3', muted: '#d2a1aa', faint: '#86616a', accent: '#ff7088', accent2: '#ffadc2',
      grad: 'linear-gradient(135deg,#b44c62 0%,#a63a50 50%,#b86880 100%)', 'lv-bg': 'linear-gradient(135deg,#4f1520 0%,#6c2232 100%)', ...SOFT_D } },
  { id: 'mh', name: 'Monster High', desc: 'Rose fuchsia et noir, chic et effrayant', icon: [['#2d2a2e', '#b8327a', '#e8559f'], '#ffffff'], fonts: [F_PLAY, 'Nunito:wght@400;600;700;800'],
    base: { r: '18px', 'r-sm': '12px', head: PLAYFAIR, sans: '"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif' },
    light: { bg: '#fbf4f8', 'bg-a': '#f6d6e8', 'bg-b': '#ebe5ee', card: '#ffffff', card2: '#f8eff5', text: '#241a22', muted: '#7d6675', faint: '#b9a5b2', accent: '#c92c7f', accent2: '#3b3439',
      grad: 'linear-gradient(135deg,#e04f99 0%,#a92c6f 55%,#2d2a2e 100%)', 'lv-bg': 'linear-gradient(135deg,#1d1a1e 0%,#4a2140 100%)', ...SOFT_L('80,20,60') },
    dark: { bg: '#121013', 'bg-a': '#3a1230', 'bg-b': '#1d1b20', card: '#1c181c', card2: '#252026', text: '#f7eef4', muted: '#c3a6b8', faint: '#7a6473', accent: '#ff6fb5', accent2: '#d2cdd1',
      grad: 'linear-gradient(135deg,#c2407f 0%,#8c2860 55%,#2a252b 100%)', 'lv-bg': 'linear-gradient(135deg,#141215 0%,#3d1a35 100%)', ...SOFT_D } },
];
// Ordre d'affichage : les 3 thèmes de base, puis dans l'ordre où ils se débloquent
const ORDER = ['lin', 'sauge', 'nuage', 'rose', 'lavande', 'peche', 'matcha', 'nacre', 'nuit', 'winx', 'kitty', 'mh'];
UIS.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
export const BASE_UI = 'lin';

export const LAYOUTS = [
  { id: 'classique', name: 'Classique', desc: 'Grandes cases sur 2 colonnes' },
  { id: 'liste', name: 'Liste', desc: 'Une ligne par case, plus compact' },
  { id: 'mosaique', name: 'Mosaïque', desc: 'Petites cases sur 3 colonnes : tout d’un coup d’œil' },
  { id: 'epuree', name: 'Épurée', desc: 'Liste sans boss ni rappels, sans ombres : juste l’essentiel' },
];

export const uiOf = id => UIS.find(u => u.id === id) || UIS[0];
export const curLayout = id => ((S.settings.layouts || {})[id] && LAYOUTS.some(l => l.id === S.settings.layouts[id])) ? S.settings.layouts[id] : 'classique';
// Mode affiché : réglage Clair / Sombre, sinon celui du téléphone
export const isDark = () => S.settings.theme === 'dark' || (S.settings.theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
// Tokens complets d'un thème dans un mode (le sombre reprend ce que le clair définit et qu'il ne redéfinit pas)
export const tokensOf = (u, dark = isDark()) => ({ ...u.base, ...u.light, ...(dark ? u.dark : {}) });

const vars = t => Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(';');
function css() {
  return UIS.filter(u => u.id !== BASE_UI).map(u => {
    const id = `[data-ui="${u.id}"]`, d = vars({ ...u.light, ...u.dark });
    return `:root${id}{${vars({ ...u.base, ...u.light })};color-scheme:light}
@media (prefers-color-scheme: dark){:root${id}:not([data-theme="light"]){${d};color-scheme:dark}}
:root${id}[data-theme="dark"]{${d};color-scheme:dark}`;
  }).join('\n');
}
const fontsDone = new Set();
export function loadFonts(list) {
  const todo = list.flatMap(u => u.fonts).filter(f => !fontsDone.has(f));
  if (!todo.length) return;
  todo.forEach(f => fontsDone.add(f));
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?${todo.map(f => 'family=' + f).join('&')}&display=swap`;
  document.head.appendChild(l);
}
let injected = false;
// Applique le thème porté (choisi dans Personnaliser) et sa disposition
export function applyUI(themeId) {
  if (!injected) { const st = document.createElement('style'); st.id = 'ui-themes'; st.textContent = css(); document.head.appendChild(st); injected = true; }
  const de = document.documentElement, id = uiOf(themeId).id, lay = curLayout(id);
  if (de.dataset.ui !== id) { de.dataset.ui = id; loadFonts([uiOf(id)]); setIcons(uiOf(id)); }
  if (de.dataset.layout !== lay) de.dataset.layout = lay;
}

// Aperçu miniature : un écran d'accueil dessiné avec les couleurs du thème et la disposition donnée
const TILE_C = ['#8aa6c1', '#e3a0a6', '#9cb48a', '#d9a77c', '#9fc1bd', '#a7a3cf', '#e0b18f', '#d7a1bd', '#b7c7a3'];
export function preview(u, layout, dark = isDark()) {
  const t = tokensOf(u, dark), n = layout === 'mosaique' ? 9 : layout === 'classique' ? 6 : 4;
  const st = ['bg', 'bg-a', 'bg-b', 'card', 'card2', 'text', 'muted', 'line', 'grad', 'lv-bg', 'r', 'head', 'shadow'].map(k => `--p-${k}:${String(t[k] || 'transparent').replace(/"/g, "'")}`).join(';');
  const tiles = Array.from({ length: n }, (_, i) => `<i class="${i % 3 === 0 ? 'on' : ''}" style="--tc:${TILE_C[i]}"><b></b><s></s></i>`).join('');
  return `<span class="pv pv-${layout} ${dark ? 'pv-dark' : ''}" style="${st}" aria-hidden="true">
    <span class="pv-lv"><i></i><em>Niv. 9</em><s></s></span>
    <span class="pv-hero"><i></i><span><s></s><s></s></span></span>
    ${layout === 'epuree' ? '' : '<span class="pv-boss"></span>'}
    <span class="pv-tiles">${tiles}</span>
    <span class="pv-nav"><i></i><i></i><i></i><i></i></span></span>`;
}

// Icône de l'appli aux couleurs du thème : dégradé doux + étincelle (Glow Up)
export function iconSVG(u, full = false) {
  const [stops, star] = u.icon || UIS[0].icon, n = stops.length - 1, rx = full ? 0 : 112;
  const sp = (cx, cy, r) => `M${cx} ${cy - r}C${cx + r * .12} ${cy - r * .2} ${cx + r * .2} ${cy - r * .12} ${cx + r} ${cy}C${cx + r * .2} ${cy + r * .12} ${cx + r * .12} ${cy + r * .2} ${cx} ${cy + r}C${cx - r * .12} ${cy + r * .2} ${cx - r * .2} ${cy + r * .12} ${cx - r} ${cy}C${cx - r * .2} ${cy - r * .12} ${cx - r * .12} ${cy - r * .2} ${cx} ${cy - r}Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${stops.map((c, i) => `<stop offset="${i / n}" stop-color="${c}"/>`).join('')}</linearGradient><clipPath id="c"><rect width="512" height="512" rx="${rx}"/></clipPath></defs>`
    + `<rect width="512" height="512" rx="${rx}" fill="url(#g)"/><circle cx="410" cy="90" r="130" fill="#fff" opacity=".16" clip-path="url(#c)"/>`
    + `<g fill="${star}"${full === 'mask' ? ' transform="translate(51 51) scale(.8)"' : ''}><path d="${sp(244, 270, 150)}"/><path d="${sp(368, 150, 48)}" opacity=".85"/><path d="${sp(372, 380, 30)}" opacity=".7"/></g></svg>`;
}
// Icône de l'onglet, icône d'installation (iPhone) et fichier d'appli (Android) du thème porté.
// L'écran d'accueil garde l'icône qu'il avait à l'installation : pour la changer, il faut réinstaller l'appli.
function setIcons(u) {
  const link = (rel, attrs) => { let l = document.querySelector(`link[rel="${rel}"]`); if (!l) { l = document.createElement('link'); l.rel = rel; document.head.appendChild(l); } Object.assign(l, attrs); return l; };
  link('icon', { href: 'data:image/svg+xml,' + encodeURIComponent(iconSVG(u)), type: 'image/svg+xml' });
  link('apple-touch-icon', { href: u.id === BASE_UI ? 'icons/apple-touch-icon.png' : `icons/t/${u.id}-180.png` });
  link('manifest', { href: u.id === BASE_UI ? 'manifest.webmanifest' : `m/${u.id}.webmanifest` });
}
