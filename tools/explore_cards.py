#!/usr/bin/env python3
"""Outils pour choisir les cartes et leurs images (lancés par GitHub Actions, qui a accès aux wikis Fandom).

    python3 tools/explore_cards.py cats DOSSIER                 catégories des wikis (avec leur taille)
    python3 tools/explore_cards.py discover DOSSIER             personnages des catégories de tools/discover.json, avec leur image
    python3 tools/explore_cards.py candidates DOSSIER [ids…]    jusqu'à 8 images candidates par forme de tools/cards.json

Chaque commande écrit dans DOSSIER un rapport texte / JSON et des planches numérotées (pour choisir à l'œil).
Une fois l'image choisie, la mettre dans cards.json : "img": { "id-de-la-forme": "url" }.
"""
import json, os, sys, io, re, urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_cards import api, norm, expand, UA, ROOT, BAD

WIKIS = ['winx.fandom.com', 'monsterhigh.fandom.com', 'hellokitty.fandom.com']


def cats(out):
    for w in WIKIS:
        rows, cont = [], {}
        while True:
            j = api(w, action='query', list='allcategories', acprop='size', acmin=12, aclimit=500, **cont)
            rows += [(c.get('size', 0), c.get('pages', 0), c['category']) for c in (j.get('query') or {}).get('allcategories', [])]
            if 'continue' not in j:
                break
            cont = {'accontinue': j['continue']['accontinue']}
        rows.sort(reverse=True)
        with open(os.path.join(out, f'cats-{w.split(".")[0]}.txt'), 'w', encoding='utf-8') as fh:
            fh.write('\n'.join(f'{p:5} {c}' for s, p, c in rows) + '\n')


def thumbs(w, titles, width=300):
    """Vignettes (url) de fichiers, par lots de 50."""
    out = {}
    for i in range(0, len(titles), 50):
        j = api(w, action='query', titles='|'.join(titles[i:i + 50]), prop='imageinfo', iiprop='url|size', iiurlwidth=width)
        for p in (j.get('query') or {}).get('pages', []):
            ii = (p.get('imageinfo') or [{}])[0]
            if ii.get('thumburl') or ii.get('url'):
                out[p['title']] = (ii.get('thumburl') or ii['url'], ii.get('width', 0), ii.get('height', 0))
    return out


def discover(out):
    cfg = json.load(open(os.path.join(ROOT, 'tools', 'discover.json'), encoding='utf-8'))
    known = set()
    for s in json.load(open(os.path.join(ROOT, 'tools', 'cards.json'), encoding='utf-8'))['series']:
        for L in s['lines']:
            known.add(norm(L['page']))
    res = {}
    for w, c in cfg.items():
        pages = {}
        for cat in c['cats']:
            cont = {}
            while True:
                j = api(w, action='query', list='categorymembers', cmtitle='Category:' + cat, cmnamespace=0, cmlimit=500, **cont)
                for m in (j.get('query') or {}).get('categorymembers', []):
                    pages[m['title']] = 1
                if 'continue' not in j:
                    break
                cont = {'cmcontinue': j['continue']['cmcontinue']}
        titles, info = sorted(pages), {}
        for i in range(0, len(titles), 50):
            j = api(w, action='query', titles='|'.join(titles[i:i + 50]), prop='info|pageimages', piprop='thumbnail', pithumbsize=300, redirects=1)
            for p in (j.get('query') or {}).get('pages', []):
                info[p['title']] = (p.get('length', 0), (p.get('thumbnail') or {}).get('source', ''))
        rows = sorted(((l, t, u) for t, (l, u) in info.items() if norm(t) not in known and '/' not in t), reverse=True)[:c.get('limit', 200)]
        res[w] = [{'title': t, 'length': l, 'img': u} for l, t, u in rows]
    json.dump(res, open(os.path.join(out, 'discover.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    items = [(f"{w.split('.')[0][:4]}{i + 1} {r['title']}", r['img']) for w, rs in res.items() for i, r in enumerate(rs)]
    grid(items, out, 'decouverte', cols=8)


def candidates(out, only):
    src = json.load(open(os.path.join(ROOT, 'tools', 'cards.json'), encoding='utf-8'))
    res, rows = {}, []
    for s in src['series']:
        w = s['wikis'][0]
        for L, forms in expand(s):
            if only and not any(f['id'] in only or L['id'] in only for f in forms):
                continue
            # Toutes les images de la page du personnage (et de sa galerie), puis une recherche par nom
            files = []
            for page in [L['page'], L['page'] + ' (G1)', L['page'] + '/Gallery', L['page'] + ' (G1)/Gallery', L['page'] + '/Outfits']:
                j = api(w, action='query', titles=page, prop='images', imlimit=500, redirects=1)
                for p in (j.get('query') or {}).get('pages', []):
                    files += [i['title'] for i in p.get('images', [])]
            for f in forms:
                toks = [norm(x) for x in f['name'].replace('(', ' ').replace(')', ' ').split() if len(x) > 2]
                first = norm(L['name'].split()[0])
                j = api(w, action='query', list='search', srsearch=f['name'].replace('(', '').replace(')', ''), srnamespace=6, srlimit=40)
                found = [h['title'] for h in (j.get('query') or {}).get('search', [])]
                pool = list(dict.fromkeys(found + files))
                pool = [t for t in pool if re.search(r'\.(png|jpe?g|webp)$', t, re.I) and first in norm(t)]

                def score(t):
                    n = norm(t)
                    return -sum(x in n for x in toks) * 10 + sum(b in n for b in BAD) * 6 - 8 * any(k in n for k in ['2d', 'stock', 'profile', 'render', 'artwork', 'official']) + len(n) / 40
                pool.sort(key=score)
                th = thumbs(w, pool[:14])
                cands = [(t, *th[t]) for t in pool[:14] if t in th][:8]
                res[f['id']] = [[t, u] for t, u, *_ in cands]
                rows.append((f['id'], [u for t, u, *_ in cands]))
    json.dump(res, open(os.path.join(out, 'candidates.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    rowsheets(rows, out)


def fetch(url):
    from PIL import Image
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    return Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=30).read())).convert('RGBA')


def grid(items, out, name, cols=8, W=170, H=230, per=48):
    from PIL import Image, ImageDraw
    for n in range(0, len(items), per):
        part = items[n:n + per]
        im = Image.new('RGB', (W * cols, H * ((len(part) + cols - 1) // cols)), 'white')
        d = ImageDraw.Draw(im)
        for i, (label, url) in enumerate(part):
            x, y = (i % cols) * W, (i // cols) * H
            if url:
                try:
                    th = fetch(url); th.thumbnail((W - 10, H - 34))
                    bg = Image.new('RGBA', th.size, 'white'); bg.alpha_composite(th)
                    im.paste(bg.convert('RGB'), (x + (W - th.width) // 2, y + 4))
                except Exception:
                    d.text((x + 8, y + 90), 'ERREUR', fill='red')
            d.text((x + 4, y + H - 28), label[:27], fill='black')
            d.text((x + 4, y + H - 15), label[27:54], fill='black')
        im.save(os.path.join(out, f'{name}-{n // per + 1:02}.jpg'), quality=80)


def rowsheets(rows, out, W=150, H=190, per=7):
    """Une ligne par forme : son id, puis ses candidates numérotées 1 à 8."""
    from PIL import Image, ImageDraw
    for n in range(0, len(rows), per):
        part = rows[n:n + per]
        im = Image.new('RGB', (W * 8, (H + 18) * len(part)), 'white')
        d = ImageDraw.Draw(im)
        for r, (fid, urls) in enumerate(part):
            y = r * (H + 18)
            d.rectangle([0, y, W * 8, y + 16], fill='#eee'); d.text((4, y + 2), fid, fill='black')
            for i, url in enumerate(urls):
                x = i * W
                try:
                    th = fetch(url); th.thumbnail((W - 8, H - 6))
                    bg = Image.new('RGBA', th.size, 'white'); bg.alpha_composite(th)
                    im.paste(bg.convert('RGB'), (x + (W - th.width) // 2, y + 18))
                except Exception:
                    d.text((x + 8, y + 90), 'ERREUR', fill='red')
                d.rectangle([x + 2, y + 18, x + 18, y + 32], fill='black'); d.text((x + 6, y + 19), str(i + 1), fill='white')
        im.save(os.path.join(out, f'candidates-{n // per + 1:03}.jpg'), quality=78)


if __name__ == '__main__':
    mode, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    if mode == 'cats':
        cats(out)
    elif mode == 'discover':
        discover(out)
    elif mode == 'candidates':
        candidates(out, set(sys.argv[3:]))
