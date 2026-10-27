// Génère les icônes de chaque thème (icons/t/) et leur fichier d'appli (m/<thème>.webmanifest), ainsi que les icônes de base (icons/).
// Usage : servir le dépôt sur http://localhost:8765 puis `node tools/gen_theme_icons.js`
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  await p.goto('http://localhost:8765/');
  const out = await p.evaluate(async () => {
    const L = await import('/js/looks.js');
    const png = (svg, size) => new Promise(res => {
      const img = new Image();
      img.onload = () => { const c = document.createElement('canvas'); c.width = c.height = size; c.getContext('2d').drawImage(img, 0, 0, size, size); res(c.toDataURL('image/png').split(',')[1]); };
      img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
    });
    const r = {};
    r._base = { svg: L.iconSVG(L.UIS[0]), 180: await png(L.iconSVG(L.UIS[0], true), 180), 192: await png(L.iconSVG(L.UIS[0]), 192), 512: await png(L.iconSVG(L.UIS[0]), 512), mask: await png(L.iconSVG(L.UIS[0], 'mask'), 512) };
    for (const u of L.UIS) r[u.id] = { bg: L.tokensOf(u, true).bg, 180: await png(L.iconSVG(u, true), 180), 192: await png(L.iconSVG(u), 192), 512: await png(L.iconSVG(u), 512), mask: await png(L.iconSVG(u, 'mask'), 512) };
    return r;
  });
  const base = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
  // Icônes de base (thème de départ) : onglet, installation, fichier d'appli principal
  const bx = out._base; delete out._base;
  fs.writeFileSync(path.join(root, 'icons/icon.svg'), bx.svg);
  fs.writeFileSync(path.join(root, 'icons/apple-touch-icon.png'), Buffer.from(bx[180], 'base64'));
  fs.writeFileSync(path.join(root, 'icons/icon-192.png'), Buffer.from(bx[192], 'base64'));
  fs.writeFileSync(path.join(root, 'icons/icon-512.png'), Buffer.from(bx[512], 'base64'));
  fs.writeFileSync(path.join(root, 'icons/icon-maskable.png'), Buffer.from(bx.mask, 'base64'));
  for (const [id, x] of Object.entries(out)) {
    for (const k of ['180', '192', '512']) fs.writeFileSync(path.join(root, 'icons/t', `${id}-${k}.png`), Buffer.from(x[k], 'base64'));
    fs.writeFileSync(path.join(root, 'icons/t', `${id}-maskable.png`), Buffer.from(x.mask, 'base64'));
    const m = { ...base, id: '../', start_url: '../', scope: '../', background_color: x.bg, theme_color: x.bg,
      icons: [{ src: `../icons/t/${id}-192.png`, sizes: '192x192', type: 'image/png' }, { src: `../icons/t/${id}-512.png`, sizes: '512x512', type: 'image/png' },
        { src: `../icons/t/${id}-maskable.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }] };
    fs.writeFileSync(path.join(root, 'm', `${id}.webmanifest`), JSON.stringify(m, null, 2) + '\n');
  }
  console.log(Object.keys(out).join(', '));
  await b.close();
})();
