#!/usr/bin/env python3
"""Cartes de Célia : lit tools/cards.json, cherche l'image de chaque forme sur les wikis Fandom
et écrit js/game/cards-data.js (+ un rapport, et des planches d'aperçu si --preview DOSSIER).

    python3 tools/gen_cards.py [--preview DOSSIER]

Lancé par GitHub Actions (.github/workflows/cartes.yml), car il faut un accès à fandom.com.
Une image mise à la main dans cards.json (« img ») est toujours gardée.
"""
import json, re, sys, time, os, io, unicodedata, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = 'GlowUpCelia/1.0 (appli perso; github.com/Xazouille)'
BAD = ['gif', 'comic', 'icon', 'logo', 'sticker', 'video', 'screenshot', 'episode', 'ep ', 'title card', 'sprite', 'chibi', 'doll', 'box', 'most like', 'quiz', 'attack', 'power', '~', ' and ', 'game', 'perfect', 'concept', 'actor', 'cast', 'vk', 'wallpaper', 'banner', 'series', '.com', 'logo']
cache = {}
# Transformations dont les fichiers « 2D » / « Stock » sont des bannières : on garde la recherche simple
PLAIN = {'Sirenix', 'Cosmix'}


def api(wiki, **params):
    params.update(format='json', formatversion='2')
    url = f'https://{wiki}/api.php?' + urllib.parse.urlencode(params)
    if url in cache:
        return cache[url]
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                cache[url] = json.load(r)
                time.sleep(0.15)
                return cache[url]
        except Exception as e:
            err = e
            time.sleep(2 * (attempt + 1))
    print('  ! échec', url, err)
    return {}


def page_image(wiki, title):
    j = api(wiki, action='query', titles=title, prop='pageimages', piprop='thumbnail|name', pithumbsize=600, redirects=1)
    for p in (j.get('query') or {}).get('pages', []):
        if p.get('thumbnail'):
            return p['thumbnail']['source'], 'page ' + p.get('title', title) + ' → ' + p.get('pageimage', '')
    # Pas de page à ce nom : premier résultat de la recherche
    j = api(wiki, action='query', list='search', srsearch=title, srlimit=1, srnamespace=0)
    hits = (j.get('query') or {}).get('search', [])
    if hits and hits[0]['title'] != title:
        return page_image(wiki, hits[0]['title'])
    return None, None


def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[_\-]', ' ', s)


def file_image(wiki, words):
    toks = [norm(w) for w in words.split()]
    j = api(wiki, action='query', list='search', srsearch=words, srlimit=40, srnamespace=6)
    best = None
    for h in (j.get('query') or {}).get('search', []):
        t = h['title']
        n = norm(t)
        if not all(tok in n for tok in toks):
            continue
        if not re.search(r'\.(png|jpe?g|webp)$', n):
            continue
        score = len(n) + 40 * sum(b in n for b in BAD) + (0 if n.endswith('.png') else 8)
        if not best or score < best[0]:
            best = (score, t)
    if not best:
        return None, None
    j = api(wiki, action='query', titles=best[1], prop='imageinfo', iiprop='url', iiurlwidth=600)
    for p in (j.get('query') or {}).get('pages', []):
        ii = (p.get('imageinfo') or [{}])[0]
        u = ii.get('thumburl') or ii.get('url')
        if u:
            return u, 'fichier ' + best[1]
    return None, None


def resolve(wikis, queries):
    for q in queries:
        kind, _, val = q.partition(':')
        for w in wikis:
            u, why = (page_image if kind == 'page' else file_image)(w, val)
            if u:
                return u, f'{w} · {why}'
    return '', 'AUCUNE IMAGE (' + ' | '.join(queries) + ')'


def expand(series):
    """Formes de chaque famille : transformations Winx, générations Monster High, ou formes données."""
    for L in series['lines']:
        page, forms = L['page'], []
        if L.get('transfo'):
            for i, (t, saga) in enumerate(zip(series['transfo'], series['transfoSaga'])):
                forms.append({'id': L['id'] + ('' if i == 0 else '-' + norm(t).replace(' ', '-')), 'name': L['name'] if i == 0 else f"{L['name']} {t}",
                              'saga': saga, 'q': [f'page:{page}'] if i == 0 else ([f'file:{page} {t}'] if t in PLAIN else [f'file:{page} {t} 2D', f'file:{page} {t} Stock', f'file:{page} {t}'])})
        elif L.get('gens'):
            q = {'G1': [f'page:{page} (G1)', f'page:{page}'], 'G2': [f'file:MH-G2 {page}', f'file:{page} G2'], 'G3': [f'file:MH-G3 {page} 2D', f'file:MH-G3 {page}', f'file:{page} G3']}
            for i, (g, saga) in enumerate(series['gens']):
                forms.append({'id': L['id'] + ('' if i == 0 else '-' + g.lower()), 'name': L['name'] if i == 0 else f"{L['name']} ({g})", 'saga': saga, 'q': q[g]})
        elif L.get('forms'):
            for i, (name, tok, saga) in enumerate(L['forms']):
                forms.append({'id': L['id'] + ('' if i == 0 else '-' + norm(tok).replace(' ', '-')), 'name': name, 'saga': saga,
                              'q': [f'page:{page}'] if i == 0 else [f'file:{page} {tok} Stock', f'file:{page} {tok} 2D', f'file:{page} {tok}']})
        else:
            forms.append({'id': L['id'], 'name': L['name'], 'saga': '', 'q': [f'page:{page}']})
        # Formes écartées à la main (pas de bonne image)
        forms = [f for f in forms if f['id'] not in L.get('skip', [])]
        for f in forms:
            f['img'] = (L.get('img') or {}).get(f['id'], '')
            if f['id'] in (L.get('q') or {}):
                f['q'] = L['q'][f['id']]
        yield L, forms


def main():
    preview = sys.argv[sys.argv.index('--preview') + 1] if '--preview' in sys.argv else None
    src = json.load(open(os.path.join(ROOT, 'tools', 'cards.json'), encoding='utf-8'))
    out, report, sheet = [], [], []
    for s in src['series']:
        lines = []
        for L, forms in expand(s):
            for f in forms:
                if not f['img']:
                    f['img'], why = resolve(s['wikis'], f.pop('q'))
                else:
                    f.pop('q'); why = 'image imposée'
                report.append(f"{f['id']:<34} {why}")
                print(report[-1])
                if f['img']:
                    sheet.append((f['id'], f['img']))
                if not f['saga']:
                    f.pop('saga')
            # Sans image : une forme suivante est retirée (la famille garde les autres), une famille entière aussi
            forms = [f for i, f in enumerate(forms) if f['img'] or (i == 0 and L.get('keep'))]
            if forms and forms[0]['id'] == L['id']:
                lines.append({'rarity': L['rarity'], 'forms': forms})
            else:
                report.append(f"{L['id']:<34} FAMILLE RETIRÉE (pas d'image de base)")
        out.append({'key': s['key'], 'info': s['info'], 'lines': lines})
    head = ('// Cartes Winx Club, Monster High et Hello Kitty : une famille = un personnage, ses formes = transformations ou générations.\n'
            '// Images : wikis Fandom (winx, monsterhigh, hellokitty). Généré par tools/gen_cards.py à partir de tools/cards.json.\n')
    with open(os.path.join(ROOT, 'js', 'game', 'cards-data.js'), 'w', encoding='utf-8') as fh:
        fh.write(head + 'export const CARDS = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
    with open(os.path.join(ROOT, 'tools', 'cards-report.txt'), 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(report) + '\n')
    missing = sum('AUCUNE' in r for r in report)
    print(f'{len(report)} formes, {missing} sans image')
    if preview:
        make_sheets(sheet, preview)


def make_sheets(items, folder):
    """Planches d'aperçu (pour vérifier les images choisies sans aller sur le wiki)."""
    from PIL import Image, ImageDraw
    os.makedirs(folder, exist_ok=True)
    W, H, COLS, PER = 170, 230, 8, 48
    for n in range(0, len(items), PER):
        part = items[n:n + PER]
        rows = (len(part) + COLS - 1) // COLS
        im = Image.new('RGB', (W * COLS, H * rows), 'white')
        d = ImageDraw.Draw(im)
        for i, (fid, url) in enumerate(part):
            x, y = (i % COLS) * W, (i // COLS) * H
            try:
                req = urllib.request.Request(url, headers={'User-Agent': UA})
                raw = urllib.request.urlopen(req, timeout=30).read()
                os.makedirs(os.path.join(folder, 'img'), exist_ok=True)
                with open(os.path.join(folder, 'img', fid), 'wb') as fh:   # copie locale pour les captures d'écran des tests
                    fh.write(raw)
                th = Image.open(io.BytesIO(raw)).convert('RGBA')
                th.thumbnail((W - 10, H - 30))
                bg = Image.new('RGBA', th.size, 'white'); bg.alpha_composite(th)
                im.paste(bg.convert('RGB'), (x + (W - th.width) // 2, y + 4))
            except Exception as e:
                d.text((x + 8, y + 90), 'ERREUR', fill='red')
            d.text((x + 4, y + H - 22), fid[:28], fill='black')
        im.save(os.path.join(folder, f'cartes-{n // PER + 1}.jpg'), quality=80)


if __name__ == '__main__':
    main()
