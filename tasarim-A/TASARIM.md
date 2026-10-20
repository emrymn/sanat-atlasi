# Tasarım A · "Gece galerisi" — implementation spec

Emre picked direction **A · Gece galerisi** from a design canvas. The three files next to this one are the approved mockups (390×844, iPhone 13):

| File | Screen |
|---|---|
| `A-Bugun.dc.html` | Bugün (home) with Günün sanatçısı |
| `A-Sanatci.dc.html` | Artist page |
| `A-Pekistir.dc.html` | Quiz (Pekiştir · Karışık), two questions per card |

## How to read the mockup files

They come from a design tool, not from this app:

- **Inline `style="…"` attributes are the spec.** Copy sizes, colours, spacing, radii and shadows from them.
- `{{name}}` is a dynamic value, and `<sc-for>` / `<sc-if>` are a loop and a condition. The `<script type="text/x-dc">` block at the bottom shows the quiz state logic (`adim`, `s1`, `s2`). Re-implement all of this in the app's own vanilla JS. Do **not** ship `support.js`, `<x-dc>`, `sc-*` tags or `.dc.html` files.
- `/_blob/…` image URLs exist only in the design tool. In the app, use the normal artwork images. The mockups show these works:

| Blob id (start) | Painting |
|---|---|
| `92e549…` | Vermeer, *Girl with a Pearl Earring* |
| `51ba5f…` | Vermeer, *Girl Reading a Letter at an Open Window* |
| `d5f2a4…` | Vermeer, *The Geographer* |
| `d85b58…` | Vermeer, *The Lacemaker* |
| `3000ce…` | Caravaggio, *The Calling of Saint Matthew* |
| `dfb533…` | Rembrandt, *The Return of the Prodigal Son* |
| `f82e25…` | Velázquez, *Las Meninas* |
| `75448e…` | Turner, *The Slave Ship* |

- **Example numbers are placeholders.** "12 tekrar bekliyor", "4 / 20" and similar values must come from real app state.

## Theme

"Gece" becomes the **default theme**. Keep Sepya and Açık in Ayarlar as alternatives with the same layout: there the spotlight becomes a soft paper shadow and the colours come from the existing palette. Define all colours as CSS custom properties.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#15120F` | wall / page ground |
| `--raised` | `#1E1A16` | answer sheet, raised surfaces |
| `--ink` | `#EDE4D3` | main text |
| `--ink-2` | `#A89A85` | secondary text |
| `--ink-3` | `#8F826F` | inactive tabs, muted labels |
| `--gold` | `#C9A45C` | accent, eyebrow labels, primary button |
| `--gold-hi` | `#E2C487` | hover / pressed |
| `--frame` | `#2A2119` | picture frame |
| `--hair` | `rgba(201,164,92,.22)` | hairlines; `.35` and `.45` for outlines |
| `--right` | `#5FA777` (icon `#7CC293`) | correct |
| `--wrong` | `#D0715C` (icon `#E08A76`) | wrong |

**Fonts:**

- **Cormorant Garamond** (600, plus italic 500) for artist names, dates/headings and questions.
- **Figtree** (400/500/600) for the UI.
- Load both from Google Fonts with fallbacks (Georgia / system-ui).
- Reading text such as "Notlarımdan" uses Cormorant italic at 19px.

## Components (reuse everywhere)

- **Spotlight stage:** a fixed-height area with a warm radial glow behind the painting and an elliptical floor shadow under it. See `A-Bugun.dc.html`.
- **Framed artwork:**
  - 6px `--frame` padding.
  - A 1px gold ring at `.45`.
  - A deep drop shadow plus a faint gold glow.
  - Thumbnails use 4px padding.
- **Wide-image fit (important):**
  - The frame's width is `min(available width, stageHeight × ratio)`. Compute the height from the ratio, so wide paintings get shorter and tall ones narrower.
  - **Never crop a painting in the quiz or the viewer:** use contain or the real ratio. The mockups crop only because they use fixed sample sizes.
  - Thumbnails may crop.
- **Wall label:** a centred block in this order:
  1. an eyebrow label (10.5–11px, uppercase, letter-spacing .18–.22em, gold);
  2. the name (Cormorant 38–44px);
  3. a meta line (`ink-2`);
  4. the work title in italic.
- **Buttons:**
  - Primary: gold fill with dark text.
  - Secondary: gold `.45` outline.
  - Radius 12px, height ≥ 44px.
- **Pill:** 1px gold `.35` outline, radius 999px.
- **Tab bar (kept from v0):**
  - Four tabs: Bugün / Göz At / Pekiştir / İlerleme.
  - Height 58px plus the safe-area bottom inset.
  - Background `--bg` at .92 with a hairline on top.
  - Stroke icons; the active tab is gold with stroke 1.6.
  - Labels 10.5px.
- **Artist hero (kept from v0):**
  - A full-bleed painting about 350px tall.
  - A gradient into `--bg`.
  - The name overlaps the bottom of the hero by about 46px.
- **Movement timeline (kept from v0):** previous ← current → next movement, using real neighbours in chronological order from `akimlar.json`. The current segment is a thick gold bar and the neighbours are hairlines.

## Screens

1. **Bugün:**
   - Header: date and a "N tekrar bekliyor" pill.
   - A spotlight with Günün sanatçısı's work.
   - A wall label for the artist: "Günün sanatçısı", name, years · akım · Konu N, and the work title.
   - Two buttons: Pekiştir · Karışık (primary) and Döneme göre (secondary).
   - "Son çalıştıkların" thumbnails at equal height.
   - The tab bar.
2. **Sanatçı:**
   - The hero, the name, and the meta line (dates · akım · Konu N in gold).
   - "Notlarımdan": the `kurs_notu`, or `anlatim` for `ek` artists. Show `taninma` as "Nasıl tanırım?" when present.
   - "Dönemi" with the timeline.
   - "Eserleri" as framed thumbnails, plus "Hepsini gör" opening the existing gallery and viewer.
3. **Pekiştir:**
   - No tab bar. A close button and a "mode · i / n" progress line with a thin gold bar.
   - The painting in a spotlight.
   - An eyebrow "Soru 1 / 2" and the question in Cormorant 32px.
   - Four outlined options with a letter (A–D).
   - **After answering:**
     - Mark the correct option green with a check. Mark the chosen wrong option red with an ×. Dim the rest.
     - A bottom sheet (`--raised`, safe-area padding) shows the result line, a short fact and a hint, plus the buttons "Sanatçı sayfası" and the next step.
   - **Spoiler rule:** after question 1 (artist), show only the artist and work title, not the movement. After question 2 (akım), show the movement and its `komsular`.
   - For a wrong answer, the result line says "3–5 kart sonra yine gelecek".
   - Döneme göre mode has only one question per card.

Screens not drawn (Göz At, İlerleme, Ayarlar, the full-screen viewer, the akım list) get the same tokens and components: framed thumbnails, eyebrow labels, hairline dividers and gold accents. No new visual ideas.

## Rules

- Keep all existing features, data, storage and tests working. Don't touch `tools/` or the content fields in `data/`.
- Safe-area insets everywhere. No fake status bar. Touch targets ≥ 44px. No horizontal scroll at 390px.
- Bump `SURUM` in `sw.js` (for example to `1.5.0`) so the phone picks up the update.
- Add a Playwright screenshot of each of the three screens at 390×844 to `tests/` output, and compare them yourself against the mockups' inline styles.
- Note any decision you had to make in `KARARLAR.md`.
