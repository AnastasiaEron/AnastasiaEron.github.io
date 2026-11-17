#!/usr/bin/env python3
"""Build static pages and set canonical URLs for the chosen domain."""
import argparse
from pathlib import Path
import shutil
import re
from urllib.parse import urlparse
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'projects/polymer-supply/index.html', 'projects/transport-forecast/index.html', 'research/index.html', '404.html']

def build(base_url, output):
    base_url = base_url.rstrip('/')
    parsed = urlparse(base_url)
    if parsed.scheme != 'https' or not parsed.netloc or parsed.netloc == 'github.io':
        raise SystemExit('Укажите полный адрес сайта, например https://anastasiaeron.github.io')
    destination = (ROOT / output).resolve()
    if destination == ROOT or ROOT not in destination.parents:
        raise SystemExit('Папка сборки должна находиться внутри проекта и не совпадать с его корнем')
    destination.mkdir(parents=True, exist_ok=True)
    shutil.copytree(ROOT / 'assets', destination / 'assets', dirs_exist_ok=True)
    urls = []
    for name in PAGES:
        route = name[:-len('index.html')] if name.endswith('index.html') else name
        canonical = base_url + '/' + route
        text = (ROOT / name).read_text(encoding='utf-8')
        text = re.sub(r'(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*(")', lambda m: m[1] + canonical + m[2], text)
        text = re.sub(r'(<meta\b[^>]*property="og:url"[^>]*content=")[^"]*(")', lambda m: m[1] + canonical + m[2], text)
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding='utf-8')
        if name != '404.html':
            urls.append(canonical)
    (destination / '.nojekyll').write_text('')
    (destination / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: ' + base_url + '/sitemap.xml\n', encoding='utf-8')
    (destination / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join('  <url><loc>' + escape(url) + '</loc></url>\n' for url in urls) + '</urlset>\n', encoding='utf-8')
    print('Готово:', destination)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='https://anastasiaeron.github.io')
    parser.add_argument('--output', default='_site')
    args = parser.parse_args()
    build(args.base_url, args.output)
