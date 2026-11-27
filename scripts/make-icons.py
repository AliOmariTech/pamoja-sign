# Generates PWA icons (two joined circles = "together"). Needs Pillow. Run from project root.
from PIL import Image, ImageDraw
def make(size, path, pad):
    S = size * 4; im = Image.new('RGB', (S, S), '#0f5c4d'); d = ImageDraw.Draw(im)
    u = S * (1 - 2 * pad); r = u * 0.30; cy = S / 2; cx = S / 2; off = u * 0.19
    d.ellipse([cx - off - r, cy - r, cx - off + r, cy + r], fill='#f2b134')
    d.ellipse([cx + off - r, cy - r, cx + off + r, cy + r], outline='#f6f3ec', width=int(S * 0.045))
    im.resize((size, size), Image.LANCZOS).save(path)
make(192, 'public/icons/icon-192.png', 0.10); make(512, 'public/icons/icon-512.png', 0.10)
make(512, 'public/icons/maskable-512.png', 0.22); make(180, 'public/icons/apple-touch-icon.png', 0.10)
open('public/favicon.svg', 'w').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0f5c4d"/><circle cx="24" cy="32" r="14" fill="#f2b134"/><circle cx="40" cy="32" r="14" fill="none" stroke="#f6f3ec" stroke-width="3"/></svg>')
