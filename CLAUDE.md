# Sanat Atlası — build brief for Claude Code

You are building a **personal, single-user art-history study app** for one Turkish university student (Emre). It runs on his **iPhone 13** as a **PWA** (Safari → "Ana Ekrana Ekle"), hosted on **GitHub Pages** from this repository. **All UI text is Turkish.** Work autonomously: when something is unspecified, make a sensible decision, note it in `KARARLAR.md`, and keep going. Do not stop to ask questions.

## 1. Purpose (read this first)

Emre is taking Kenney Mencher's Udemy course *Art History: Renaissance to 20th Century*, topic by topic ("konu 1, 2, 3 …"). The app grows **in parallel with his progress**:

- Every artist is attached to a course topic (`konu`). An artist is **unlocked** once that topic is marked as studied (`işlendi`).
- Some artists are **not in the course** (`kaynak: "ek"`). They complete each movement and act as **stylistically similar wrong answers**. They unlock with their topic too, and have a short Turkish explanation (`anlatim`).
- Goal: through repeated image quizzes, become familiar with each artist and their **movement (akım)**. Artists he gets wrong come back sooner (spaced repetition).

## 2. Data (already prepared; do not rewrite the content)

`data/sanatcilar.json` — list of ~169 artists:
```
{ id, ad, ad_arama, akim, konu, konu_baslik, kaynak: "kurs"|"ek",
  not_cikarilmadi: bool,          // course notes for this topic not written yet (just show a small "taslak" badge)
  dogum, olum,                    // integers, negative = BC, may be null
  kurs_notu?, kurs_notu_konu?,    // one-sentence Turkish note from his course notes (kurs artists)
  kurs_eserleri?: [ {baslik, tarih, yer, konu, commons_dosya, lisans} ],   // VERIFIED images: Wikimedia Commons file names
  anlatim?, taninma?, onemli_eserler?: [ {baslik, tr, yil} ], emin_degil?: [string]   // ek artists
}
```
`data/akimlar.json` — movements in chronological order: `{ad, sira, komsular: [movement names]}`. `komsular` = stylistically/chronologically neighbouring movements (used for wrong options).
`data/konular.json` — course topics: `{no, baslik, bolum, bolum_ad}`.
`data/baslangic_ilerleme.json` — initial studied topics (`islenen`), used only on first launch.

## 3. Artwork images

Two sources, in this priority:

1. **`kurs_eserleri`** (verified, prefer these). Image URL from a Commons file name:
   `https://commons.wikimedia.org/wiki/Special:FilePath/<encodeURIComponent(name)>?width=800` (use `width=400` for grids). Show "Wikimedia Commons · <lisans>" under the image.
2. **Wikidata** (to get *more* works per artist, the whole point of the app):
   - Resolve the artist's QID from `ad_arama` with `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=…&language=en&type=item&limit=7&format=json&origin=*`, then confirm candidates with `wbgetentities` (claims P31 = Q5 human — or a group item for "Limbourg brothers" — and birth year P569 within ±3 years of `dogum` when `dogum` is not null). If nothing passes the check, **do not guess**: the artist simply has no Wikidata works.
   - Works: SPARQL on `https://query.wikidata.org/sparql?format=json&query=…` — items with `wdt:P170` (creator) **or** `wdt:P84` (architect) = QID, having `wdt:P18` (image); get labels (prefer `tr`, then `en`), inception year (P571), and `wikibase:sitelinks`; `ORDER BY DESC(?sitelinks) LIMIT 40`. Image thumbnails via the same `Special:FilePath?width=` trick from the P18 file name.
   - Send header `Api-User-Agent: SanatAtlasi/1.0 (personal study app; emreyaman1024@gmail.com)` on Wikimedia API requests.
   - Cache resolved QIDs and work lists in IndexedDB (refresh after 30 days). Never re-query on every launch.
   - Merge with `kurs_eserleri`, de-duplicate (same Commons file or same normalised title), course works first.
   - If a build-time fetch is possible from your environment, also write `scripts/onbellek.mjs` that precomputes `data/eserler_onbellek.json` (QIDs + works) so the app works offline on first launch; the app must still work when that file is absent. If Wikidata is not reachable from your environment, make tests use a small fixture (`tests/fixtures/…`) instead.
   - **Accuracy rule:** never attribute a work to an artist unless it comes from `kurs_eserleri` or Wikidata P170/P84 for the verified QID.

## 4. Screens (Turkish UI)

1. **Ana sayfa** — counts: açık sanatçı, bugün tekrarı gelen, toplam doğru oranı; buttons: **Göz At**, **Pekiştir · Döneme göre**, **Pekiştir · Karışık**, **İlerleme**, **Ayarlar**.
2. **Göz At** — movements in chronological order (only those with ≥1 unlocked artist; locked ones greyed with "Konu N'de açılır"). Movement → artist list (name, years, small "kurs dışı" badge for `ek`). Artist page: name, years, movement, course topic, `kurs_notu` or `anlatim`, `taninma` ("Nasıl tanırım?"), then a grid of works (each: thumbnail, title, year). Tap a work → full-screen viewer with pinch-zoom and pan, swipe between works, caption with title/year/source.
3. **Pekiştir · Döneme göre** — pick a movement (or "Hepsi, dönem sırasıyla"). Cards come only from unlocked artists of that movement: due/weak ones first, then new. Each card: one artwork image → **"Bu eser kimin?"** with 4 options.
4. **Pekiştir · Karışık** — random across all unlocked artists (weighted towards due/weak), each card asks **two** questions in sequence: **"Bu eser kimin?"** then **"Hangi akım?"** (4 options each).
5. **İlerleme** — list of course topics with a toggle "işlendi" (this is how the app follows the course); per-movement accuracy bars; list of weakest artists.
6. **Ayarlar** — günlük kart sayısı (default 20), tema (Sepya / Açık / Koyu), "Görselleri çevrimdışı indir" (for unlocked artists, with size/progress), **Yedekle** (copy a JSON backup to clipboard + show it in a textarea) and **Yedeği geri yükle** (paste). No file downloads (iOS PWA makes those awkward).

After every answer: show right/wrong, the correct artist + movement, work title/year, the `taninma` hint, and a "Sanatçı sayfası" link. Keep the next button in thumb reach.

## 5. Wrong options must be hard (important to Emre)

Artist question — pick 3 distractors in this order until you have 3:
1. other artists of the **same movement** (prefer unlocked, then locked — names only, that is fine),
2. artists of the **neighbouring movements** (`komsular`) with overlapping lifetimes (±50 years),
3. any artist within ±100 years.
Never use the same artist twice; shuffle options.

Movement question — correct movement + up to 3 from its `komsular`, then chronologically closest others.

## 6. Spaced repetition

Track two scores per artist: `sanatci` (artist question) and `akim` (movement question).
Leitner boxes 0–5 with intervals [same session, 1, 3, 7, 14, 30] days. Wrong → box 0 and the artist re-appears in the same session after 3–5 other cards. Right → box + 1 and next due date by interval. A card is "due" when its date ≤ today. New (never seen) unlocked artists are introduced at most 8 per day. Pick a **different artwork** of the artist each time when possible.

Storage: IndexedDB (or localStorage for the small progress object). Home-screen web apps on iOS keep their storage, but backup/restore must exist anyway.

## 7. Offline & PWA

- `manifest.webmanifest` (name "Sanat Atlası", short_name "Atlas", display standalone, theme/background colours from the palette, icons 180/192/512 PNG — generate a simple original icon, no copyrighted artwork), `apple-touch-icon`, `apple-mobile-web-app-capable`.
- Service worker: cache-first for the app shell and `data/*.json`; stale-while-revalidate for Wikimedia images with a size cap (~300 MB, LRU eviction); network-first for Wikidata API with cached fallback. Version the cache so updates arrive.
- Everything must use **relative paths** (GitHub Pages project site lives under `/<repo>/`).

## 8. Design

Calm, readable, warm paper look — same family as his study pages:
- Sepya (default): background `#F1E8D6`, surface `#F8F2E6`, ink `#352B21`, secondary ink `#6B5D4D`, rule `#D9CBB2`, accent gold `#9A6B1F`, right `#2C6E49`, wrong `#A23B2A`.
- Koyu: background `#1D1A17`, surface `#26221E`, ink `#EFE7DA`, accent `#D8B36A`.
- Serif for headings/reading (e.g. Literata or Cormorant via Google Fonts with fallbacks), sans for UI. Body ≥ 17px. Touch targets ≥ 44px. Respect safe-area insets. Target viewport 390×844; no horizontal scrolling.

## 9. Tech constraints

- **No backend, no accounts, no analytics.** Static files only.
- Prefer **plain HTML/CSS/ES modules with no build step** so GitHub Pages serves the repo root directly. If you choose a build step, add a GitHub Actions workflow that deploys to Pages, and explain it in README.
- Keep dependencies minimal and pinned.

## 10. Testing (do this before you finish)

- Unit-test the distractor picker, the Leitner scheduler and the unlock logic.
- Playwright smoke test at 390×844 (iPhone 13): home → Göz At → an artist → a work full-screen; Pekiştir Karışık: answer 5 cards; toggle a topic in İlerleme and see a new artist unlock; backup → restore round-trip.
- Lighthouse-style PWA checks: manifest valid, service worker registers, works offline after first load (with fixture data if Wikidata is unreachable).

## 11. Deliverables

- The app at the repo root, `README.md` (Turkish: how to enable GitHub Pages and add to the iPhone home screen), `KARARLAR.md` (decisions you made), tests.
- At the end, print a short Turkish summary of what was built and anything left undone.

## 12. Review loop

Emre may run `tools/qwen_kod_incele.py` on his Mac (Qwen model as a second reviewer) and paste its report back to you. Treat that report as suggestions: verify each point against the code, fix real problems, and say which points you rejected and why. Do not modify anything in `tools/` or the content fields in `data/sanatcilar.json` (you may add new data files).
