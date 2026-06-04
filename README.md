# @megs.e30

Personal link-in-bio website for [@megs.e30](https://instagram.com/megs_e30) — a BMW E30 build diary.

Inspired by the [@88.aw11](https://88aw11.com) aesthetic: grid-paper background, dark red hero, **Forza Horizon–style red slide hover** on every link, and a rotating orbit graphic on the stickers row.

---

## Links included

| # | Platform  | Destination |
|---|-----------|-------------|
| 01 | TikTok   | https://tiktok.com/@megs.e30 |
| 02 | Instagram | https://instagram.com/megs_e30 |
| 03 | Email     | connect@megse30.com |
| 04 | Stickers  | *(update href in index.html when live)* |

---

## Running locally

The site is **pure HTML/CSS** — no build step, no dependencies.

### Option A — just open it
```
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```
Double-clicking `index.html` in your file explorer also works.

---

### Option B — local dev server (recommended, loads Google Fonts correctly)

**Python 3**
```bash
python3 -m http.server 3000
# then visit http://localhost:3000
```

**Node / npx**
```bash
npx serve .
# then visit the URL it prints
```

**VS Code Live Server extension**
Right-click `index.html` → *Open with Live Server*.

---

## Customising

| What to change | Where |
|----------------|-------|
| Car year / make | `index.html` — `.car-meta` text + hero specs list |
| Bio text | `index.html` — `.about-body` paragraph |
| Social handles / links | `index.html` — `<a href="…">` on each `.link-row` |
| Stickers shop URL | `index.html` — `href="#"` on `.stickers-row` |
| Accent red colour | `style.css` — find/replace `#c41230` |
| Grid paper spacing | `style.css` — `background-size` on `body` |

---

## File structure

```
meganswebsite/
├── index.html   ← all markup
├── style.css    ← all styles (grid bg, hover FX, orbit anim)
└── README.md
```

No JavaScript required.
