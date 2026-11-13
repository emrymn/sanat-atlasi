# Zayıf görsel envanteri: Sanat Atlası'nda İş 84'ten sonra hâlâ düşük çözünürlüklü kalan eser görselleri (2026-11-13)

Method note (applies to all sections). Every number marked **[computed]** was produced on 2026-11-13 by read-only scripts in the scratchpad (`/tmp/claude-0/-home-user-sanat-atlasi/a672f32b-4fd6-51ac-b01a-b2ccce8dbc01/scratchpad/`: `boyut.py`, `analiz.py`, `ozet.py`, `son.py`, `sp.py`). The scripts:
1. Rebuilt the app's list of shown works the way `js/eserler.js` does it: `data/eserler_onbellek.json` → drop images in `data/cikarilan_gorseller.json` → drop the hidden side of `data/kopya_eserler.json` pairs. The primary image is `gorseller[0]`, the image used for cards.
2. Read the **real pixel size** of each work's current largest copy from its JPEG header. They fetched only the first 16 KB with an HTTP Range request against the app's R2 bucket (`https://gorsel.noracloud.ai/d/<ad>[-sürüm].jpg` when the name is in `devasa`, otherwise `/b/<ad>[-b_sürüm].jpg`). This follows the URL logic in `js/gorsel.js`. All 7,028 local images and all 385 WikiArt primary images were measured.
3. Queried Wikidata SPARQL once, in batches of 300 QIDs, for P195 (collection) and the 19 museum-ID properties, for the 2,262 weak works that have a QID.

The full per-work list (2,918 rows) is at `/tmp/claude-0/-home-user-sanat-atlasi/a672f32b-4fd6-51ac-b01a-b2ccce8dbc01/scratchpad/zayif_eserler.csv`. "Weak" means a long side under 2,500 px unless stated otherwise. **[est.]** marks estimates and inferences.

## How does the app define/record image size and source per artwork? Which file(s) hold pixel dimensions?

### Takeaway
**No file in the repository stores pixel dimensions.** The repo holds only:
- the per-image source and priority (`p`) in `eserler_onbellek.json`,
- the local name map (`yerel_gorseller.json`),
- the list of names that have a ≤4096 px "devasa" copy plus the museum/version overrides (`gorsel_kaynagi.json`),
- aspect ratios (`gorsel_oranlari.json`),
- İş 84's found candidates with their sizes (`gorsel_iyilestirme.json`).

`kalite_tara.py` measured the sizes on Emre's Mac with `sips` and cached them in `gorseller_devasa/.bilgi/kalite_mevcut.json`, which is not in git. The sizes therefore had to be re-measured from R2.

### Cited Findings
- Image record format: `{ k: 'commons'|'met'|'aic'|'cma'|'nga'|'wikiart', d?: Commons file, u?: direct URL, i?: IIIF id, l?: licence, s?: source page, p?: quality score }` — [js/gorsel.js](js/gorsel.js) (header comment).
- Quality priority (p) used to order a work's images: museum scan (100) > Commons Google Art Project (80) > museum-sourced Commons (WGA, Met DP, Rijksmuseum, Yorck…; 70) > other Commons (50) > WikiArt (40) > "fotoğraf gibi" (10) > manually "kötü" / doubtful WikiArt (5) — [KARARLAR.md decisions 51 and 142](KARARLAR.md).
- Filenames containing *frame, framed, in situ, exhibition, taken at, panoramio, DSC/IMG*, or a non-institutional *gallery/galleria*, are automatically scored "fotoğraf gibi" (10) — [KARARLAR.md decision 51](KARARLAR.md).
- `data/yerel_gorseller.json` maps `"<source>:<id>"` to a 16-hex local name: 7,028 images (commons 4,954, met 1,046, aic 453, nga 336, cma 239) **[computed]** — [data/yerel_gorseller.json](data/yerel_gorseller.json).
- `data/gorsel_kaynagi.json` contains:
  - the R2 address `https://gorsel.noracloud.ai`;
  - `devasa`: 5,522 names that have a large ≤4096 px copy, about 18.2 GB in total (`devasa_bayt` 18,166,835,847);
  - `muze`: 168 names whose large copy comes from a museum instead of Commons (nga 81, rijks 36, met 34, yuag 7, cma 7, aic 3);
  - `surumler`: 216 versioned large copies (İş 84 plus museum swaps);
  - `b_surumler`: 3,232 regenerated 1280 px copies.

  **[computed]** — [data/gorsel_kaynagi.json](data/gorsel_kaynagi.json).
- Names that are not in `devasa` have only the 1280 px `b/` copy. `r2_yukle.py` uploads a large copy only if it is at least 1,600 px (`EN_AZ_DEVASA = 1600`) — [scripts/r2_yukle.py](scripts/r2_yukle.py).
- `devasa_indir.py` caps downloads at a 4096 px long side (iPhone Safari memory limit). It takes Met `/original/`, the Cleveland print/full image, and NGA/AIC IIIF at the original size (falling back to 3000 → 1686 → 843) — [scripts/devasa_indir.py](scripts/devasa_indir.py) (docstring).
- `kalite_tara.py` gets the current size from local files via `sips` (`mevcut_boy`) and caches it in `gorseller_devasa/.bilgi/` (not committed) — [scripts/kalite_tara.py](scripts/kalite_tara.py).
- Docstring vs. code mismatch in `kalite_tara.py`: the docstring says "622 of 1731 below 2500 px", but the code constant is `ZAYIF = 3000`. The scan threshold appears to have been raised after the docstring was written — [scripts/kalite_tara.py](scripts/kalite_tara.py).
- `kalite_tara.py` only considers works whose **first image is a Commons file that has a local copy and a work QID** (`eser_haritasi`). Museum-API, WikiArt and QID-less works were never in İş 84's scope — [scripts/kalite_tara.py](scripts/kalite_tara.py).
- `data/gorsel_oranlari.json` stores only width/height ratios for 7,028 local images, with no pixel counts — [data/gorsel_oranlari.json](data/gorsel_oranlari.json).
- WikiArt images are not copied locally. Only URLs (HalfHD or the original) are stored in `data/wikiart.json` and `eserler_onbellek.json` — [KARARLAR.md decisions 134 and 140](KARARLAR.md).

### Inferences
- Re-measuring from R2 shows what the phone actually gets today. It does not show whether a bigger original exists on Commons.
- R2 measurement **[computed]**:

  | Copy type | Count | Long side |
  |---|---|---|
  | d/ (large) | 5,522 | 1,000 of these are under 2,500 px |
  | b/ only | 1,506 | all ≤1,280 px |

### Gaps
- Original Commons file sizes could not be fetched. The Commons API answered "You are making too many requests to the API" to every request from this environment, even a single one with a proper User-Agent. So for b-only Commons images I cannot say whether Commons holds a bigger original that the pipeline missed. The check would need to be run from another IP (e.g. Emre's Mac, where `kalite_tara.py` already caches `kalite_dosya`).

## After applying gorsel_iyilestirme.json, how many images remain under 2500 / 1500 / 1000 px? Breakdown by source, movement and artist

### Takeaway
Of **7,356 shown works**, 7,268 have a measurable primary image.

| Long side | Weak works **[computed]** |
|---|---|
| < 3,000 px | 3,218 |
| < 2,500 px | **2,830** (+88 with no R2/local copy, so size unknown; 2,918 including them) |
| < 1,500 px | **1,850** |
| < 1,000 px | **813** |

İş 84 replaced only 72 images, so the weak set is still about 39% of works. Weakness is concentrated in four places:
- "other Commons" files (p50): 1,779;
- WikiArt, i.e. the copyrighted 20th-century artists: 385, all under 1,500 px;
- WGA-type museum-sourced Commons files capped near 1,280 px: 271;
- AIC API images at 843–1,280 px: 169.

### Cited Findings
- Shown works: `eserler_onbellek.json` has 7,451 works. Removing 65 `cikarilan_gorseller` keys and the hidden side of 96 `kopya_eserler` pairs leaves 7,356 shown works with 8,320 shown images (6,899 with a local copy) **[computed]** — [data/eserler_onbellek.json](data/eserler_onbellek.json), [data/cikarilan_gorseller.json](data/cikarilan_gorseller.json), [data/kopya_eserler.json](data/kopya_eserler.json).
- `gorsel_iyilestirme.json` records İş 84's results **[computed]** — [data/gorsel_iyilestirme.json](data/gorsel_iyilestirme.json):
  - 72 images got a bigger Commons file, and all 72 are in `surumler`, so they are live;
  - 87 images have one rejected candidate each (`reddedilen`);
  - of the 71 that are still shown, 8 remain under 2,500 px (e.g. Kandinsky *Composition X* 2000×1303; Rossetti *The Beloved* 1797×2051).
- The İş 84 scope today (primary image is Commons, has a local copy and a QID) holds 4,849 works: 2,173 under 2,500 px and 2,526 under 3,000 px **[computed]**. The original scan reported 1,731 images; the difference suggests the cache has grown since that run (e.g. İş 113/119 museum swaps and WikiArt merges). **[est.]**
- 745 weak works are outside İş 84's scope (museum API, WikiArt, or no QID) **[computed]**.

**By source type of the current largest copy (primary image only) [computed]**

| Source | Shown | <2500 | <1500 | <1000 | size unknown |
|---|---|---|---|---|---|
| Commons · other (p50) | 3,590 | 1,779 | 1,043 | 423 | 8 |
| WikiArt (p40) | 385 | 385 | 385 | 307 | 0 |
| Commons · museum-sourced, WGA/Met DP/Yorck… (p70) | 356 | 271 | 249 | 37 | 1 |
| Museum API · AIC (p100) | 458 | 169 | 116 | 19 | 17 |
| Manually "kötü" (p5) | 180 | 74 | 35 | 20 | 59 |
| Museum API · Met (p100) | 1,024 | 87 | 7 | 3 | 2 |
| Commons · "fotoğraf gibi" (p10) | 101 | 37 | 15 | 4 | 0 |
| Commons · Google Art Project (p80) | 478 | 17 | 0 | 0 | 0 |
| Commons, enlarged by İş 84 | 68 | 8 | 0 | 0 | 0 |
| Museum API · Cleveland | 226 | 3 | 0 | 0 | 1 |
| Museum API · NGA | 326 | 0 | 0 | 0 | 0 |
| Museum swap (İş 113/119: nga 80, rijks 36, met 33, yuag 7, cma 6, aic 2) | 164 | 0 | 0 | 0 | 0 |

Details behind the table **[computed]**:
- Weak large copies (d/) cluster at 1,600–2,499 px (980 images). The most common 100 px bins are 2,000–2,099 (211), 1,900–1,999 (138) and 1,600–1,699 (136).
- b-only weak copies number 1,465. Of these, 320 are exactly 1,280 px (249 other-Commons, 43 WGA-type, 15 AIC). This means the source was at least 1,280 px, but either under the 1,600 px large-copy threshold or never downloaded at full size.
- WikiArt long sides: 237 are 800–999 px, 54 are 1,000–1,199, 42 are 600–799 and 28 are 400–599. HalfHD is the cap.
- Met weak images are mostly d/ copies of 1,750–1,999 px (61). The Met `/original/` for these (often Hiroshige/Hokusai prints and Gauguin works on paper) is itself small. **[est.]**
- AIC weak images are b-only at 843–1,280 px (110), consistent with AIC IIIF returning 843 px for many works. **[est., from the devasa_indir fallback 3000→1686→843]**
- Museum swaps reached 100% ≥2,500 px. NGA and Cleveland API images are essentially never weak.

**By movement (akım) [computed]**: movements with the most works under 2,500 px.

| Movement | Shown | <2500 | <1500 | <1000 |
|---|---|---|---|---|
| İtalyan Barok ve Caravaggizm | 556 | 226 | 163 | 45 |
| Geç İtalyan Barok | 381 | 199 | 139 | 57 |
| Rokoko | 514 | 176 | 103 | 37 |
| Maniyerizm | 374 | 161 | 103 | 34 |
| Sürrealizm | 166 | 158 | 158 | 113 |
| Romantizm | 463 | 141 | 82 | 26 |
| Gotik | 232 | 135 | 86 | 23 |
| Empresyonizm | 525 | 135 | 82 | 49 |
| Dada | 133 | 124 | 122 | 116 |
| Kuzey Rönesansı | 498 | 124 | 63 | 23 |
| Ekspresyonizm | 240 | 112 | 72 | 38 |
| Erken Rönesans | 299 | 111 | 53 | 15 |
| Yüksek Rönesans | 256 | 98 | 67 | 29 |
| Barbizon ve Realizm | 300 | 97 | 58 | 18 |
| Post-Empresyonizm | 357 | 92 | 51 | 24 |
| Prerafaelitler | 155 | 87 | 60 | 22 |
| Neoklasisizm | 216 | 85 | 52 | 13 |
| Sembolizm | 243 | 80 | 47 | 15 |
| Akademizm ve Oryantalizm | 213 | 76 | 37 | 14 |
| Fransız Klasisizmi | 206 | 72 | 50 | 14 |
| Venedik Rönesansı | 240 | 68 | 42 | 12 |
| Hollanda Altın Çağı | 249 | 67 | 39 | 10 |
| Uluslararası Gotik | 62 | 41 | 10 | 3 |
| Kübizm | 53 | 38 | 38 | 30 |
| Savaş sonrası figürasyon | 37 | 37 | 37 | 22 |
| Flaman Barok | 120 | 30 | 15 | 3 |
| Ukiyo-e | 118 | 27 | 6 | 4 |
| İspanyol Barok | 90 | 23 | 12 | 2 |
| Art Nouveau ve Viyana Secession | 60 | 10 | 3 | 2 |

**By artist (top 30 by weak count) [computed]**, written as artist (weak / shown):
- Copyrighted 20th-century artists: Dalí 40/44, Duchamp 40/44, Max Ernst 40/40, Miró 39/43, Magritte 39/39, Picasso 38/53, Arp 38/38, Francis Bacon 37/37, Man Ray 34/34.
- Old masters: Rossetti 31/52, Pietro Lorenzetti 31/41, Angelica Kauffman 31/56, John Everett Millais 30/57, Michelangelo 30/47, Giotto 29/48, Théodore Rousseau 29/60, Alexandre Cabanel 28/45, Greuze 27/59, Holman Hunt 26/46, Piazzetta 26/49, Annibale Carracci 26/60, Fuseli 26/58, Moreau 25/47, Salvator Rosa 25/59, Piero della Francesca 25/36, Benjamin West 25/56, Giulio Romano 24/50, Duccio 24/41, Correggio 24/47, Artemisia Gentileschi 24/41.
- Course works (kurs): 47 of 157 are weak, 31 under 1,500 px and 11 under 1,000 px.

### Inferences
- The biggest lever on volume is "Commons · other" (1,779 weak). These are mostly Wikidata P18 files: WGA-quality scans and amateur uploads. A museum open-access or IIIF source for the same object should beat them.
- The second lever is the copyrighted 20th-century block (≈382 weak), which no open-access source will fix. See the copyright section.
- Met, NGA, Cleveland and the museum swaps show that a museum source almost always yields ≥2,500 px. AIC is the exception (843 px IIIF cap).

### Gaps
- Sizes of the 88 works with no local/R2 copy are unknown. 59 of them are p5 "kötü" images and 17 are AIC; these are served directly from Commons or museums.
- The 400 px local thumbnails were not measured; they do not matter for quality.

## Which weak images were rejected or found no candidate in kalite_tara?

### Takeaway
`gorsel_iyilestirme.json` records only successes (72) and manual rejections (87 images, 1 file each); it does not record "no candidate found" explicitly. Of today's 2,918 weak works:
- **80** have a rejected İş 84 candidate;
- about 2,090 in-scope weak works (2,173 in scope minus the 80 rejected and 8 still-weak successes) had no qualifying candidate **[computed/est.]**;
- 745 weak works were never scanned **[computed]**.

### Cited Findings
- A candidate was accepted only if all of these held **[documented]** — [scripts/kalite_tara.py](scripts/kalite_tara.py) (docstring and `uygun_adaylar`):
  - it came from the work's own Wikidata P18 or P373 Commons category;
  - its aspect ratio was within 5%;
  - its long side was ≥2,000 px and ≥1.25× the current size;
  - its 64-bit dHash differed by ≤12 bits;
  - it was not desaturated (black-and-white) when ours is colour.
- Manual rejections are stored as `reddedilen: {name: [file]}`: 87 names with 87 files, none overlapping the accepted set **[computed]** — [data/gorsel_iyilestirme.json](data/gorsel_iyilestirme.json).
- Examples of weak works with a rejected candidate **[computed]**:
  - Duccio *Annunciation* (rejected `Duccio_di_Buoninsegna_068.jpg`);
  - Simone Martini *Annunciation* (rejected `Anunciación_Martini_02.JPG`);
  - Gainsborough *The Blue Boy*, Cézanne *The Card Players*, Bruegel *Triumph of Death*, Vermeer *The Lacemaker*, Raphael *La velata*, Artemisia *Judith* (Capodimonte), Friedrich *Sea of Ice*, Gauguin *Nafea Faa Ipoipo*.

### Inferences
- **[est.]** The "no candidate" group is large because Commons rarely holds a bigger copy outside Google Art Project. Most of these works need an external museum source.

### Gaps
- The per-image "no candidate / filtered by which rule" log is only in `gorseller_devasa/.bilgi/` on Emre's Mac, not in the repo.

## For the weak works, which holding institution is known? Ranked table of museums

### Takeaway
An institution is known for 2,393 of 2,918 weak works, from the work's `muze` field (Wikidata P195 label written at cache build) or a P195 lookup today. 525 are unknown, of which 381 are WikiArt.

The top holders of weak works are:
- **Art Institute of Chicago** (187): already a source, but limited by its IIIF size;
- **Louvre** (141);
- **National Gallery London** (135);
- **Met** (100): mostly small originals;
- **Hermitage** (93);
- **Musée d'Orsay** (81);
- **Uffizi** (69).

Among the museum-ID properties, Louvre P9394 (149 weak works), Orsay P4659 (79), National Gallery London P13466/P13325 (59/58), KHM P8960 (36), Prado P8905 (31) and Nationalmuseum P2539 (30) matter most.

### Cited Findings
- Weak works by holding institution **[computed]**: local `muze` field first, then Wikidata P195 English label, with name variants merged (e.g. "Department of Paintings of the Louvre" → Louvre). Sources: [data/eserler_onbellek.json](data/eserler_onbellek.json); [Wikidata SPARQL](https://query.wikidata.org/sparql).

| # | Institution | Weak (<2500) | of which <1500 |
|---|---|---|---|
| – | (unknown: 381 WikiArt, 121 Commons-other, 17 p5, …) | 525 | 474 |
| 1 | Art Institute of Chicago | 187 | 133 |
| 2 | Louvre | 141 | 108 |
| 3 | National Gallery, London | 135 | 104 |
| 4 | Metropolitan Museum of Art | 100 | 13 |
| 5 | Hermitage | 93 | 49 |
| 6 | Musée d'Orsay | 81 | 58 |
| 7 | Uffizi | 69 | 45 |
| 8 | Museum of Fine Arts, Boston | 44 | 18 |
| 9 | Gemäldegalerie Berlin | 42 | 10 |
| 10 | Kunsthistorisches Museum Wien | 36 | 22 |
| 11 | Museo di Capodimonte | 34 | 24 |
| 12 | Royal Collection | 34 | 17 |
| 13 | Nationalmuseum Stockholm | 33 | 32 |
| 14 | Museo del Prado | 31 | 5 |
| 15 | Musée Fabre | 28 | 8 |
| 16 | Vatican Museums | 27 | 23 |
| 17 | Staatliche Kunstsammlungen Dresden | 25 | 16 |
| 18 | Tate | 24 | 20 |
| 19 | Basilica of San Francesco, Assisi (upper) | 23 | 13 |
| 20 | Pinacoteca di Brera | 19 | 8 |
| 21 | Musée Condé, Chantilly | 19 | 2 |
| 22 | Bayerische Staatsgemäldesammlungen | 19 | 13 |
| 23 | Palazzo Pitti (Galleria Palatina) | 18 | 10 |
| 24 | Walters Art Museum | 17 | 0 |
| 25 | Pushkin Museum | 17 | 11 |
| 26 | MBA Lyon | 16 | 13 |
| 27 | V&A | 15 | 13 |
| 28 | Detroit Institute of Arts | 15 | 2 |
| 29 | Lenbachhaus | 15 | 5 |
| 30 | National Museum Warsaw | 14 | 7 |

  Further down, with 11–13 each: Thyssen-Bornemisza, Galleria Nazionale d'Arte Antica, Wallace Collection, Lower Basilica Assisi, "Führermuseum" (a Wikidata provenance collection, not a current holder), Scrovegni Chapel, Galleria Nazionale di Parma, MBA Strasbourg, Ashmolean. The weak works span 511 distinct institution strings in all.
- Museum artwork-ID properties on weak works. Base: 2,262 weak works with a QID; 459 carry at least one of the 19 properties **[computed]** — [Wikidata SPARQL](https://query.wikidata.org/sparql).

| Property | Museum | Weak works | of which <1500 |
|---|---|---|---|
| P9394 | Louvre collections ID | 149 | 115 |
| P4659 | Musée d'Orsay ID | 79 | 57 |
| P13466 | National Gallery London (2nd ID) | 59 | 50 |
| P13325 | National Gallery London ID | 58 | 50 |
| P8960 | KHM Wien ID | 36 | 22 |
| P8905 | Prado ID | 31 | 5 |
| P2539 | Nationalmuseum Sweden ID | 30 | 29 |
| P8335 | Uffizi ID | 22 | 9 |
| P8948 | Pinakothek ID | 22 | 16 |
| P3634 | Met ID | 10 | 2 |
| P2108 | (SMK via Kunstindeks Danmark) | 9 | 9 |
| P4610 | AIC ID | 5 | 4 |
| P2582 | Getty ID | 3 | 0 |
| P13234 | Rijksmuseum ID | 2 | 1 |
| P5823 | Belvedere ID | 2 | 1 |
| P6246 | Paris Musées ID | 1 | 0 |
| P11110 | Cleveland | 0 | 0 |
| P4683 | NGA | 0 | 0 |
| P4738 | YCBA | 0 | 0 |

- The AIC (186) and Met (89) weak works mostly come **from those museums' own APIs** (`k: aic/met`, often with no work QID). This is why P4610/P3634 counts are low even though AIC and Met rank #1 and #4 by holding **[computed]**.

### Inferences
- **[est.]** Priority order for new museum sources, by weak works that could be fixed:
  1. Louvre (collections.louvre.fr; 149 IDs on Wikidata already);
  2. National Gallery London (≈59 IDs);
  3. Orsay (79);
  4. Hermitage (93, no ID property in the requested list);
  5. Uffizi (69; 22 IDs);
  6. KHM (36);
  7. Nationalmuseum (30–33; nearly all <1500 and openly licensed);
  8. Prado (31);
  9. Pinakothek (22).
- **[est.]** AIC's 187 should be re-examined: the cap may come from the 843 px public IIIF fallback in `devasa_indir.py`, not from AIC's actual maximum.
- NGA, Cleveland and Rijksmuseum IDs barely appear in the weak set because those museums are already integrated and deliver large files. That integration path works.

### Gaps
- No property for the Hermitage, MFA Boston or Capodimonte was in the requested list, so their ID coverage is not counted.
- 2 of the 2,262 QIDs returned no SPARQL row (probably redirects).
- The local `muze` field sometimes holds a free-text Turkish location for course works (e.g. "Scrovegni Şapeli, Padua") or a dubious value (Ghent Altarpiece → "Bode Museum"). This is likely a secondary P195 entry. Rankings are therefore approximate within ±5%. **[est.]**

## How many weak works are by artists still under copyright (died after ~1955) vs public domain?

### Takeaway
**398 of 2,918 weak works** (382 measured + 16 of unknown size) are by artists who died in 1956 or later. Nearly all of them are WikiArt images under 1,500 px. 2,520 weak works are by public-domain artists, under the rule of the artist's death plus 70 years. The public-domain set is the one museum open-access sources can fix.

### Cited Findings
- Copyright split **[computed]** (artist `olum` from `data/sanatcilar.json`):
  - died ≥1956: 414 shown works; 382 <2500, 380 <1500, 302 <1000, 16 unknown size;
  - died ≤1955: 6,942 shown works; 2,448 <2500, 1,470 <1500, 511 <1000, 72 unknown size.
- The copyrighted weak works are: Dalí (d. 1989) 44, Duchamp (1968) 43, Miró (1983) 43, Picasso (1973) 40, Max Ernst (1976) 40, Magritte (1967) 39, Arp (1966) 38, Francis Bacon (1992) 37, Man Ray (1976) 34, Emil Nolde (1956) 25, Hannah Höch (1978) 15. They come from WikiArt 378, p5 "kötü" 16, other Commons 3, "fotoğraf gibi" 1 **[computed]**.
- KARARLAR documents why: open sources have no flat scans of these works, only exhibition and wall photos, and WikiArt images of copyrighted works are mostly about 350×470 px — [KARARLAR.md decisions 54 and 138](KARARLAR.md).
- A further 342 shown works are by artists who died 1926–1955 (e.g. Monet d. 1926, Kandinsky d. 1944): 114 are weak. These are public domain in life+70 countries, but may still be protected in the US for works published after 1930. **[computed counts; legal note est.]**

### Inferences
- **[est.]** About 14% of the weak set is structurally hard: no CC0 source exists, and only rights-holder or museum press images would help. The research effort should focus on the 2,520 public-domain weak works.

### Gaps
- Per-work copyright status was not checked (publication date, country). The ~1955 cut-off is a simplification.

## Are there other quality problems recorded besides pixel size?

### Takeaway
Yes, beyond pixel size:
- the app's primary images include **180 manual "kötü" (p5)** and **101 "fotoğraf gibi" (p10)** images (frames, gallery shots, oblique views);
- `gorsel_kararlari.json` holds **262 "kotu" and 65 "cikar"** decisions;
- 65 removed images and 96 duplicate pairs exist;
- 230 works are flagged `pekistirme: false`.

Of the 2,918 weak works, 133 have a "kotu" decision, 142 are excluded from quizzes, and 2,739 are still eligible for quizzes (p > 10 and pekistirme ≠ false).

### Cited Findings
- `gorsel_kararlari.json`: 327 decisions = 262 "kotu" (not used in quizzes, moved to the end of the gallery) + 65 "cikar" (never shown), keyed by lowercase Commons filename **[computed]** — [data/gorsel_kararlari.json](data/gorsel_kararlari.json).
- The original visual audit (decision 53) checked 1,795 Commons images. It marked 87 "kötü" and 15 "çıkar", and 7 images could not be downloaded for checking. The current file is larger, so later audits added more — [KARARLAR.md decision 53](KARARLAR.md).
- `cikarilan_gorseller.json` lists 65 keys — [data/cikarilan_gorseller.json](data/cikarilan_gorseller.json). `kopya_eserler.json` lists 96 duplicate pairs — [data/kopya_eserler.json](data/kopya_eserler.json).
- Primary-image priority counts across the 7,356 shown works **[computed]**:
  - p5: 230 in total (commons 180, aic 25, met 17, cma 5, nga 3);
  - p10 ("fotoğraf gibi"): 104;
  - `pekistirme: false`: 230 works.
- KARARLAR lists many works with "fotoğraf gibi… · başka görseli yok" (photo-like, no other image). These are prime targets: Arena Chapel walls, Sistine ceiling, Masaccio *Expulsion*, Perugino *Consegna delle chiavi*, Bellini San Zaccaria/San Giobbe, Artemisia *Judith*, Picasso *Guernica* — [KARARLAR.md lines ~286–368](KARARLAR.md).
- The device-local "Görsel kötü" button stores choices in `kotuGorseller` in the progress object. This lives only on Emre's iPhone or in his backup, not in the repo — [KARARLAR.md decision 55](KARARLAR.md).

### Inferences
- **[est.]** The 101 p10 and 180 p5 primaries are quality problems even when they have many pixels: 37 of the p10 images are under 2,500 px, but the other 64 are large photos of frames or rooms. A museum flat scan would fix both problems at once.

### Gaps
- Emre's on-device `kotuGorseller` list is not available here.

## 15–20 concrete example weak works (test cases)

### Takeaway
The examples below are public-domain, mostly well known (Wikidata sitelinks 22–71), and cover every source type and the main museums. Sizes are the measured long side of the current largest copy **[computed]**. "R2 copy" gives the copy type and 16-hex name; the URL is `https://gorsel.noracloud.ai/<d|b>/<name>[-version].jpg`.

### Cited Findings
| # | Artist · Work (QID) | Current file / URL | R2 copy | Size | Holding (ID) | Note |
|---|---|---|---|---|---|---|
| 1 | Jan van Eyck · *Ghent Altarpiece* (Q734834) | `Ghent_Altarpiece_by_Jan_van_Eyck_ALL.jpg` | b · bb6a3413d570e441 | 800×443 | St Bavo, Ghent (data says "Bode Museum": dubious) | closer to vanEyck.kikirpa.be |
| 2 | Caravaggio · *The Calling of Saint Matthew* (Q969377) | `Caravaggio,_…_The_Calling_of_Saint_Matthew_-_1599-1600_(hi_res).jpg` | b · 3716dff9fa186467 | 1280×1197 | San Luigi dei Francesi, Rome | filename says hi_res; likely pipeline gap |
| 3 | Caravaggio · *The Taking of Christ* (Q102852946) | `Caravaggio_-_The_Taking_of_Christ_restored.jpg` | b · 6dd45920897981a1 | 1280×1000 | National Gallery of Ireland (data: "National Gallery") | |
| 4 | Thomas Gainsborough · *The Blue Boy* (Q604761) | `Thomas_Gainsborough_-_The_Blue_Boy_(c._1770).jpg` | d · f23c4ebce16c226d | 1375×2000 | Huntington | İş 84 candidate rejected |
| 5 | Paul Cézanne · *The Card Players* (Q17277950) | `Paul_Cézanne,_Les_joueurs_de_carte_(1892-95).jpg` | d · 0cc75df9a7033aab | 1683×1385 | Courtauld | İş 84 candidate rejected |
| 6 | Pieter Bruegel · *Triumph of Death* (Q644856) | `The_Triumph_of_Death_by_Pieter_Bruegel_the_Elder.jpg` | d · ef15f4458bf7138e | 2126×1517 | Prado (P8905 d3d82b0b-…) | İş 84 candidate rejected |
| 7 | Vermeer · *The Lacemaker* (Q1216387) | `Johannes_Vermeer_-_The_lacemaker_(c.1669-1671).jpg` | d · 1a6e8647c842dfe5 | 1596×1830 | Louvre (P9394 010064918) | İş 84 candidate rejected |
| 8 | Raphael · *La velata* (Q948034) | `La_velada,_por_Rafael.jpg` | d · dc2b9ab79864df8e | 1279×1648 | Palazzo Pitti (P8335 woman-with-a-veil) | rejected candidate |
| 9 | Parmigianino · *Madonna with the Long Neck* (Q867403) | `Parmigianino_-_Madonna_and_Child_with_Angels,_…Long_Neck.jpg` | d · ebd73e500d20ad0b | 1490×2336 | Uffizi (P8335 parmigianino-madonna-long-neck) | |
| 10 | Titian · *Assumption of the Virgin* (Q1899740) | `Tizian_041.jpg` | d · cd95aebe2caed07b | 1050×1932 | Frari, Venice | church, no museum API |
| 11 | Raphael · *Marriage of the Virgin* (Q2030685) | `Raffaello_-_Spozalizio_-_Web_Gallery_of_Art.jpg` | d · a05a8e706e9452bd | 1417×2032 | Brera | WGA-sourced |
| 12 | Artemisia Gentileschi · *Judith Slaying Holofernes* (Q2247406) | `Artemisia_Gentileschi_-_Judith_Beheading_Holofernes_-_WGA8563.jpg` | b · e51941337d93e76a | 1005×1280 | Capodimonte | WGA p70; rejected candidate |
| 13 | Jan van Eyck · *Madonna in the Church* (Q1747569) | `Jan_van_Eyck_-_Madonna_in_the_Church_-_WGA7590.jpg` | b · b07c75b33c0e26f4 | 571×1280 | Gemäldegalerie Berlin | WGA p70 |
| 14 | Claude Monet · *Women in the Garden* (Q2734892) | `Claude_Monet_024.jpg` | d · bef2323700253b57 | 2024×2490 | Musée d'Orsay (P4659 807) | |
| 15 | Van Gogh · *Portrait of Père Tanguy* (Q13528770) | `Van_Gogh_-_Portrait_of_Pere_Tanguy_1887-8.JPG` | b · 91338f0c569152c1 | 800×1008 | Musée Rodin | |
| 16 | Giotto · *St Francis Giving his Mantle* (Q3947102, course work) | `Giotto_-_Legend_of_St_Francis_-_-02-_-_St_Francis_Giving_his_Mantle_to_a_Poor_Man.jpg` | b · 4b174291b538e698 | 591×600 | Upper Basilica, Assisi | fresco |
| 17 | Cimabue · *Madonna with St Francis* (Q3843027, course work) | `San_Francesco_Cimabue.jpg` | b · c3108d25e480cd7c | 737×496 | Lower Basilica, Assisi | fresco |
| 18 | Duccio · *Annunciation* (Q26706454, course work) | `Duccio_di_Buoninsegna_-_Annunciation_-_WGA06752.jpg` | b · a8c077ea4ba8a522 | 822×800 | National Gallery London | NG has its own images |
| 19 | Henry Fuseli · *Milton Dictating to His Daughter* (Q20270916) | AIC IIIF `6006b9e7-567a-4fb8-34e2-a120886690fe` | b · 8ce37e0f22e02bff | 843×875 | Art Institute of Chicago | AIC 843 px cap case |
| 20 | Utagawa Hiroshige · *Akasaka* (Q75090395) | `images.metmuseum.org/CRDImages/as/web-large/DP122857.jpg` | d · 72f9c5713632c2ef | 1876×1384 | The Met | Met original small |

Copyrighted control cases: Picasso *Guernica* (Q175036) is 1366×618 from WikiArt HalfHD; Duchamp *Chocolate Grinder (No. 1)* (Q20816340) is 662×800 from WikiArt.

All rows come from **[computed]** joins of [data/eserler_onbellek.json](data/eserler_onbellek.json), [data/yerel_gorseller.json](data/yerel_gorseller.json), [data/gorsel_kaynagi.json](data/gorsel_kaynagi.json), [data/gorsel_iyilestirme.json](data/gorsel_iyilestirme.json), R2 JPEG headers, and [Wikidata SPARQL](https://query.wikidata.org/sparql).

### Inferences
- **[est.]** Cases 2, 3, 13, 15 and 18 (b-only, exactly or nearly 1,280 px) may be pipeline gaps rather than source limits. Check them first against Commons originals once the API is reachable.

### Gaps
- The holding institution in rows 1 and 3 comes from the cache and looks wrong or ambiguous. Verify on Wikidata before use.
