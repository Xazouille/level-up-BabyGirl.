// Images des cartes servies depuis un dossier local (planches d'aperçu de la branche « apercu-cartes », dossier img/),
// pour des captures d'écran complètes sans accès aux wikis.
const fs = require('fs'), path = require('path');
module.exports = async (ctx, dir) => {
  if (!dir || !fs.existsSync(dir)) return;
  const src = fs.readFileSync(path.join(__dirname, '../../js/game/cards-data.js'), 'utf8');
  const cards = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']') + 1)), byUrl = {};
  for (const s of cards) for (const l of s.lines) for (const f of l.forms) if (f.img) byUrl[f.img] = f.id;
  await ctx.route('https://static.wikia.nocookie.net/**', r => {
    const id = byUrl[r.request().url()], f = id && path.join(dir, id);
    f && fs.existsSync(f) ? r.fulfill({ path: f, contentType: 'image/png' }) : r.abort();
  });
};
