# Aggregators and download tools for higher-resolution artwork images (beyond museum APIs)

Scope: Wikimedia Commons/Wikidata beyond P18/P373, Google Arts & Culture plus dezoomify, WikiArt originals, Web Gallery of Art, paid agencies, generic tools (dezoomify-rs, dezoomify, gallery-dl, IIIF), copyrighted 20th-century works, and 2025-2026 changes. Researched 2026-11-13.

Live tests from this sandbox used a generic User-Agent with no personal data and made fewer than 25 requests in total. Commons Action API calls were refused with "You are making too many requests to the API". This sandbox goes out through a shared proxy IP, which probably counts as an "unidentified" client (see the rate limits below). So the Commons query patterns below come from documentation and were **not** live-verified here. WikiArt, Wikidata SPARQL and robots.txt checks did work.

Project context: scripts/devasa_indir.py caps images at 4096 px long side (the iPhone Safari limit) and already requests the 3840 px Commons thumbnail. A target of "≥2500 px" therefore means "find a source whose original is ≥2500 px". Anything above 4096 px gets downscaled anyway.

## 1. Wikimedia Commons beyond P18/P373: how to find the largest file of a given artwork

### Takeaway
Commons can be queried by artwork QID through Structured Data on Commons (`haswbstatement:P6243=Q…`, "digital representation of"), combined with CirrusSearch pixel filters (`filew:>2500`) and `prop=imageinfo&iiprop=size|url` in one Action API call. This is the most systematic way to find the largest file of a known work. The main extra pool of large files is the Google Art Project / Google Arts & Culture uploads: about 9.6k "Google Art Project paintings" plus about 24k "Files from Google Arts & Culture". Those uploads are often reduced, not full gigapixel. Two 2026 changes affect scripts: new API rate limits, and thumbnail widths restricted to standard sizes. Both require a compliant User-Agent and standard thumbnail widths (3840).

### Cited Findings
- **CirrusSearch file filters** (exact syntax):
  - `filew:>800 fileh:>600` matches files at least 800×600. Ranges work (`fileheight:100,500`). `filesize:>N` is in KB. `filemime:"image/png"`, `-filemime:pdf` and `filetype:bitmap` are also supported. — [Help:CirrusSearch](https://www.mediawiki.org/wiki/Help:CirrusSearch)
  - `deepcat:"X"` searches a category and its subcategories (default depth 5, at most 256 categories). `incategory:` no longer descends into subcategories. — [Help:CirrusSearch](https://www.mediawiki.org/wiki/Help:CirrusSearch)
- **Wikidata P4765** ("Commons compatible image available at URL") holds an "image with Commons compatible copyright status… available at the following URL".
  - It is limited to (2D) works of art. Required qualifiers are file format (P2701), URL (P2699), title (P1476) and author name string (P2093).
  - Allowed qualifiers include licence (P275), data size (P3575), operator (P137) and DPI (P10300).
  - Related properties: P18, P973, P6500 (non-free image URL) and P953. — [Wikidata Property:P4765](https://www.wikidata.org/wiki/Property:P4765)
- Live SPARQL count on 2026-11-13: `SELECT (COUNT(*) AS ?n) WHERE { ?i wdt:P4765 ?u }` returned **74,962** statements. — live query against https://query.wikidata.org/sparql (this research)
- **Google Art Project on Commons:**
  - Commons states that all Google Art Project works are on Commons "except for photos of three-dimensional works or works still under copyright".
  - Subcategories:
    - "Google Art Project paintings": 9,653 files
    - "Files from Google Arts & Culture": 24,203 files
    - "Google Art Project works by artist": 4,889 subcategories
    - "Google Art Project works by collection": 408 subcategories
    - "Gigapixel images from the Google Art Project": 63 files
    - "Misattributions on Google Art Project": 4 files
  - File names follow the pattern "… - Google Art Project.jpg" (sometimes with an ID in parentheses). — [Category:Google Art Project](https://commons.wikimedia.org/wiki/Category:Google_Art_Project)
- The gigapixel category says its images are "usually reduced in resolution due to technical limitations". It adds: "The full size images are 2 to 8 times larger in each dimension". Full resolution exists only as tile sets (41 entries). Examples include Renoir *Moulin de la Galette* at 40,869 × 30,379 and Rembrandt *Abduction of Europa* at 42,582 × 33,430. — [Category:Gigapixel images from the Google Art Project](https://commons.wikimedia.org/wiki/Category:Gigapixel_images_from_the_Google_Art_Project)
- **2026 Wikimedia API rate limits** (per minute):
  - unidentified (IP only): 10
  - unauthenticated bot with compliant UA: 200
  - established logged-in editors: 2,000
  - bot-flagged accounts: exempt
  - The UA must include contact info (email or URL), e.g. `CoolBot/0.0 (https://example.org/coolbot/; coolbot@example.org) generic-library/0.0`.
  - Limit concurrency to ≤3 parallel requests. Honour Retry-After on 429; without one, wait ≥5 s or back off exponentially.
  - The page calls these limits "new in 2026". — [Wikimedia APIs/Rate limits](https://www.mediawiki.org/wiki/Wikimedia_APIs/Rate_limits)
- **Standard thumbnail widths** in Wikimedia production: 20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840 px. — [Common thumbnail sizes](https://www.mediawiki.org/wiki/Common_thumbnail_sizes)
- Status of non-standard widths:
  - Phabricator work "Standardize thumbnail sizes" ([T408062](https://phabricator.wikimedia.org/T408062)) led to rate-limiting of non-standard sizes. Config was deployed January 2026, and limiting was relaxed then re-enabled around February 2026 (per search-result summaries of Phabricator logs; the individual entries were not opened).
  - An OpenStreetMap issue (April 2026) says WMF "has been curtailing access to thumbnails that aren't one of the standard sizes". — [OSM rails-dev, 2026-04](https://lists.openstreetmap.org/pipermail/rails-dev/2026-April/049560.html), [Tech News 2025/16](https://meta.wikimedia.org/wiki/Tech/News/2025/16)

### Inferences
- **Recommended Commons recipe** for one artwork QID (Action API). Documented syntax, not live-tested here because of the sandbox IP block:
  ```
  https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2
    &generator=search&gsrnamespace=6&gsrlimit=50
    &gsrsearch=haswbstatement:P6243=Q12418 filew:>2500 -filemime:pdf
    &prop=imageinfo&iiprop=size|url|mime|sha1|extmetadata&iiurlwidth=3840
  ```
  - Sort the results by `width*height` client-side.
  - `iiurlwidth=3840` returns `thumburl`, a standard-width JPEG thumbnail, and `url`, the original.
  - Use the original only when it is ≤4096 px or is not JPEG/TIFF. Otherwise take the 3840 thumbnail, which is what devasa_indir.py already does.
  - Add `haswbstatement:P180=Q…` (depicts) only as a weaker fallback: it also matches details, copies and prints, so the existing aspect-ratio plus dHash checks in kalite_tara.py must stay.
- **Fallback when P6243 is missing.** Many older uploads, including most Google Art Project files, have no P6243. Search by text plus pixel filter inside the artist's GAP category, for example:
  `gsrsearch=deepcat:"Google Art Project works by Rembrandt" filew:>2500 intitle:"Night Watch"`
  Or use `incategory:` on the work's P373 category plus `filew:`. The existing kalite_tara.py already covers P18/P373. The new value is (a) P6243 reverse lookup, which finds files not placed in the work category, and (b) the GAP-by-artist category, matched by title plus dHash.
- **Wikidata P4765** is a small, separate pool: about 75k statements, mostly museum open-access URLs. It is a cheap SPARQL check (`?work wdt:P4765 ?url`) for the ~600 weak works. It probably overlaps heavily with the other researcher's museum APIs. The URL qualifier sometimes points to a full-size TIFF/JPEG.
- **Rate limits for ~600 works.** One search call per work, plus at most one imageinfo call, is far under 200/min. The existing 4 s pacing in devasa_indir.py is already compliant. The UA string in kalite_tara.py already contains contact info, as the policy requires.
- **GAP uploads may not be the maximum.** A GAP file on Commons is often only 1/2 to 1/8 of the Google tile resolution. Only for those works would dezoomifying Google Arts & Culture give more pixels (section 2). Above 4096 px that gain is irrelevant to this app.

### Gaps
- I could not run a live Commons API query from this sandbox: the shared-IP rate limit returned errors even with a policy-style UA. I did not verify how many of the ~600 weak works have any P6243-tagged file.
- I did not confirm the exact numeric rate limit for upload.wikimedia.org thumbnail/original downloads. The rate-limit page does not cover media.
- I did not confirm whether `filew:` applies to the original file width (assumed yes, from the file-properties index).

## 2. Google Arts & Culture: gigapixel tiles, dezoomify tools, legality, mirroring on Commons

### Takeaway
Google Arts & Culture (GA&C) serves many paintings as deep-zoom tiles, often far above 10,000 px. The Commons "Google Art Project" copies of public-domain paintings are usually reduced (2 to 8× smaller per side). The standard tool, **dezoomify-rs, was archived in November 2026**: its README says "not maintained anymore" and points to the new Dezoomify, which has a web app, desktop app and `dezoomify-cli`. Google's Terms forbid automated access "in violation of machine-readable instructions". GA&C's robots.txt disallows only `/api/*` and `/incognito/*`. Content belongs to the museums. For public-domain 2D paintings, the Commons PD-Art position applies. For copyrighted works, dezoomifying is legally weak even for personal use. Practicality for ~600 images: moderate. Each work needs a GA&C asset URL found by hand or by search, and Google has blocked IPs with 429 errors in the past.

### Cited Findings
- **dezoomify-rs status and formats:**
  - Repo status: archived. README: "not maintained anymore", with users pointed to the successor at dezoomify.ophir.dev. — [dezoomify-rs README](https://github.com/lovasoa/dezoomify-rs); GitHub search shows `lovasoa/dezoomify-rs` "archived": true, last push 2026-11-02 (gh API, this research).
  - Supported dezoomers: Google Arts & Culture, Zoomify, DeepZoom (DZI), IIIF, Krpano, IIPImage, XLimage, TopViewer, FSI, LizardTech, VLS, Hungaricana, WMTS, ArcGIS, pnav, Generic URL template, Custom YAML. — [dezoomify-rs README](https://github.com/lovasoa/dezoomify-rs)
- **dezoomify-rs flags** (documented): `-l/--largest`, `-w/--max-width`, `-h/--max-height`, `--zoom-level N`, `-H/--header` (e.g. `-H "Referer: URL"`), `-n/--parallelism` (default 16), `-r/--retries` (default 1), `-c/--tile-cache DIR` (resume), `--bulk urls.txt` (implies `--largest` unless a size flag is given). Examples:
  ```
  dezoomify-rs --bulk urls.txt
  dezoomify-rs --bulk urls.txt --max-width 2000
  dezoomify-rs --image-index 1 https://example.com/iiif/manifest.json
  ```
  — [dezoomify-rs README](https://github.com/lovasoa/dezoomify-rs)
- **New Dezoomify:**
  - Ships as a website, browser extension, desktop app and **command-line tool** ("the same saving capabilities as the desktop app, for scripts"). It supports `--bulk`, image/zoom-level choice and resolution limits.
  - Supported formats: "IIIF, Deep Zoom, Zoomify, Google Arts & Culture, krpano…".
  - A Linux x86_64 `dezoomify-cli` binary is on the releases page. The README build path is `cargo xtask build cli`, and usage is `dezoomify-cli "https://museum.example/collection/painting" painting.png`.
  - The legacy site remains at dezoomify.ophir.dev/legacy/. The browser version is limited by browser canvas size; the desktop app is limited only by memory.
  - Repo active: last push 2026-11-12. — [lovasoa/dezoomify README](https://github.com/lovasoa/dezoomify); gh search (this research)
- Known GA&C failures in the issue trackers:
  - "Unable to find the token in the page" (Google page changes)
  - 429/IP blacklisting when many users share the hosted server; the advice is to run locally
  - "Can't Download at High Resolution (Google Arts and Culture)" (#296, closed)
  - an open 429 report (#337)

  I found no 2026-dated report of a current outage. — [dezoomify-rs issue #192](https://www.github.com/lovasoa/dezoomify-rs/issues/192), [dezoomify issue #337](https://www.github.com/lovasoa/dezoomify/issues/337), [dezoomify issue #296](https://www.github.com/lovasoa/dezoomify/issues/296)
- Google Terms of Service forbid "using automated means to access content from any of our services in violation of the machine-readable instructions", for example "robots.txt files that disallow crawling…". On others' content: "You may not use this content without that person or organization's permission, or as otherwise allowed by law." — [Google Terms of Service](https://policies.google.com/terms)
- GA&C robots.txt (fetched 2026-11-13): `User-Agent: * / Allow: / / Disallow: /api/* / Disallow: /incognito/*`. Asset pages are not disallowed. — live fetch of https://artsandculture.google.com/robots.txt (this research)
- Commons mirrors GAP public-domain 2D works, mostly at reduced size, with full size 2 to 8× larger per dimension available only as tile sets for a handful (41 tile-set entries, 63 gigapixel files). — [Category:Gigapixel images from the Google Art Project](https://commons.wikimedia.org/wiki/Category:Gigapixel_images_from_the_Google_Art_Project), [Category:Google Art Project](https://commons.wikimedia.org/wiki/Category:Google_Art_Project)

### Inferences
- **Order of use.** First take the Commons GAP file. It is already PD-tagged, and the existing kalite_tara.py plus a deepcat search can find it. Fall back to GA&C dezoomify only for weak works where (a) the painting is public domain and (b) no ≥2500 px Commons or museum file exists.
- **Max-width command.** With the 4096 px phone cap, use `--max-width 4096` (or the dezoomify-cli equivalent). This avoids downloading gigapixel mosaics of hundreds of MB. Example (documented syntax, not run):
  ```
  dezoomify-rs --max-width 4096 --tile-cache ./tiles -n 4 -r 3 "https://artsandculture.google.com/asset/<slug>/<id>" out.jpg
  ```
  Keep parallelism low (e.g. 4). Run sequentially with pauses to avoid Google 429 blocks.
- **Finding the GA&C asset reliably.**
  - The most reliable path is through Commons: GAP file description pages usually link the source GA&C asset URL (template `{{Google Art Project}}`).
  - Otherwise search GA&C by title plus artist and confirm by museum plus dHash/aspect ratio against the current image, the same rule kalite_tara.py uses.
  - Wikidata has a Google Arts & Culture asset ID property; its P-number is not verified here, so check it before using it in SPARQL.
- **Tool choice.** dezoomify-rs is archived, but its last release binaries still work as long as Google's page format holds. For new scripting, prefer the maintained `dezoomify-cli`, and pin a version.
- **Legal (personal, non-commercial).** For public-domain 2D paintings, a faithful reproduction is generally treated on Commons as public domain (PD-Art). The download step is still a ToS-grey automated access to Google, though robots.txt allows asset pages. For copyrighted 20th-century works, dezoomifying a museum-licensed high-resolution image and redistributing it via R2 is copying beyond what GA&C grants. Avoid that.

### Gaps
- I did not verify the current maximum zoom level GA&C serves today, or whether its tiles are still obfuscated or encrypted (they historically were, and dezoomify-rs decrypts them).
- No live dezoomify test was run, by instruction (no bulk download).
- I did not verify the Wikidata property number for "Google Arts & Culture asset ID".

## 3. WikiArt: original upload size, typical sizes, API terms and status

### Takeaway
Live-verified: WikiArt serves the **original upload when the `!Large`/`!HalfHD` suffix is removed**. Originals vary widely, from about 800 px to over 5,000 px, including for copyrighted works. A Picasso of 1903 (still in copyright) came back at 3648 × 5472, which contradicts WikiArt's own "low resolution copies" fair-use claim. API v2 is still live (November 2026), but its `width`/`height` fields report the `!Large` derivative, not the original. Probe the original by downloading it or reading the JPEG header. WikiArt's terms contain no API or scraping clause. robots.txt allows everything.

### Cited Findings
- Live test on 2026-11-13. Image servers `uploadsN.wikiart.org` are on Cloudflare, with `access-control-allow-origin: *` and `cache-control: max-age=7776000`. Results (long side varies; no suffix = original):

  | Work | Original | !HalfHD | !Large | !PinterestLarge |
  |---|---|---|---|---|
  | Picasso *Child with dove* (1901) | 1419×1970 | 576×800 | 432×600 | 280×389 |
  | Picasso *The old blind guitarist* (1903, `00198/images/pablo-picasso/old-guitarist-chicago.jpg`) | **3648×5472** (7.3 MB) | 533×800 | 400×600 | not recorded |
  | Bramante *Man with a Mace* | 1615×3889 | not recorded | not recorded | not recorded |
  | Nolde *Last Supper* (1909) | 1492×1014 | 1177×800 | 750×510 | not recorded |

  — live curl against https://uploads3.wikiart.org/00198/images/pablo-picasso/old-guitarist-chicago.jpg and siblings (this research)
- **API v2 is live:** `https://www.wikiart.org/en/api/2/PaintingSearch?term=old%20guitarist` returned 200 with `"width":400,"height":600,"image":"…old-guitarist-chicago.jpg!Large.jpg"`. `api/2/Painting?id=57727426edc2cb3880caf12e` also returned width 400 / height 600 plus physical size (`sizeX` 82.5, `sizeY` 121.3 cm), not the original pixel size. — live API calls (this research)
- The older site JSON (`/en/<artist>/<work>?json=2`) returned painting lists with unsuffixed `image` URLs and `width`/`height` values (e.g. Matisse *Woman at the Piano* 1751×1221) that look like original dimensions. These were not cross-checked against the downloaded file. — live call (this research)
- **WikiArt terms of use:**
  - "WikiArt presents both public domain and copyright protected artworks. The latter are showcased in accordance with fair use principle", citing "informational and educational purposes" and "as low resolution copies unsuitable for commercial use".
  - "We respond to notices of alleged copyright infringement and remove copyright protected artworks."
  - The terms contain no clause on personal use, downloading, scraping or the API. — [WikiArt Terms of Use](https://www.wikiart.org/en/terms-of-use)
- WikiArt robots.txt: `User-agent: * / Allow: /` plus sitemap. — live fetch https://www.wikiart.org/robots.txt (this research)
- gallery-dl supports "WikiArt.org | Artists, Artist Listings, Artworks, individual Images". — [gallery-dl supported sites](https://github.com/mikf/gallery-dl/blob/master/docs/supportedsites.md)

### Inferences
- **Easy fix for the project.** `data/wikiart.json` stores `…!HalfHD.jpg` URLs (KARARLAR 134). For the ~600 weak images, strip everything from `!` onward and download the original. Read its dimensions (sips or the JPEG SOF header). Keep it only if it beats the current file and passes the existing aspect-ratio and dHash checks: WikiArt originals are sometimes cropped or framed photos. One GET per work, roughly 0.1–7 MB, is practical for 600 works at a polite 1–2 s pace.
- **Original size is unpredictable.** It depends on what the uploader supplied. Copyrighted works are not uniformly small (the Picasso examples), although KARARLAR 138 observed about 350×470 for many. Treat any copyrighted original above about 1000 px as legally sensitive.
- **Licensing risk for copyrighted works.** Even for personal, non-commercial study, mirroring a high-resolution copy of an in-copyright work to Cloudflare R2 is reproduction and storage. That differs from the current link-only stance in KARARLAR 143. A defensible compromise is to cache copyrighted WikiArt images at moderate size (e.g. ≤1600 px) on a private R2 bucket, not publicly listed. Public-domain WikiArt originals are fine to use at full size.

### Gaps
- No official WikiArt API v2 documentation page was fetched in this session. Rate limits and API key terms (historically a key or session for some endpoints) are unverified for 2026.
- The share of WikiArt originals ≥2500 px is unmeasured. A real sample over the 13 WikiArt artists would be needed.

## 4. Web Gallery of Art (wga.hu) and paid agencies (Bridgeman, Art Resource, Scala)

### Takeaway
WGA permits only "educational and personal purposes" and prohibits distribution. Its images are historically modest in size, about 1,000–1,500 px long side by common knowledge; that figure is not verified here. So WGA is not a source of ≥2500 px images. Bridgeman, Art Resource and Scala are paid licensing agencies and do not fit a free personal app.

### Cited Findings
- WGA legal page: "The Web Gallery of Art is copyrighted as a database. Images and documents downloaded from this database can only be used for educational and personal purposes. Distribution of the images in any form is prohibited without the authorization of their legal owner." — [WGA Legal Questions](https://www.wga.hu/legal.html) (fetched live)
- A direct image request (`https://www.wga.hu/art/l/leonardo/04/0monali.jpg`) returned only 3.7 KB (HTTP 200), not a full image. The site sits behind Cloudflare with a JS challenge script on its HTML pages, so scripted image access may be challenged. — live curl (this research)

### Inferences
- Skip WGA for resolution upgrades. At most it can serve as a title or attribution cross-check.
- I did not research the paid agencies in depth. They license per image for publication and are inappropriate here.

### Gaps
- WGA's typical image dimensions were not verified: the image request was blocked or truncated.

## 5. Generic tools: dezoomify-rs, Dezoomify (new), gallery-dl, IIIF downloaders

### Takeaway
For tiled viewers (IIIF, Zoomify, DeepZoom, GA&C) use the new **Dezoomify CLI** (maintained) or the archived **dezoomify-rs** (last binary). For WikiArt and Commons pages, **gallery-dl** handles listing and downloading, but direct HTTP plus the URL rules above is simpler and more controllable for about 600 known works. For IIIF museums, the Image API URL pattern `…/full/max/0/default.jpg` (or `…/full/!4096,4096/0/default.jpg`) beats any tool; the other researcher covers that.

### Cited Findings
- dezoomify-rs: format list and flags as in section 2. Archived, not maintained. — [dezoomify-rs](https://github.com/lovasoa/dezoomify-rs)
- New Dezoomify CLI (`dezoomify-cli`, Linux x86_64 binary on releases, `--bulk`, zoom-level and resolution limits). — [lovasoa/dezoomify](https://github.com/lovasoa/dezoomify)
- gallery-dl supports WikiArt (artists, artist listings, artworks, individual images), Wikimedia Commons (articles, categories, files, wikis) and Wikimedia. Google Arts & Culture, WGA and generic IIIF are **not** listed. — [gallery-dl supportedsites.md](https://github.com/mikf/gallery-dl/blob/master/docs/supportedsites.md)
- Other dezoomify-related repos as of November 2026: dezoomify-extension (browser extension, pushed 2026-09), a docker wrapper for dezoomify-rs, and `multi-dl-dezoomify-rs` (downloads all images from an IIIF manifest). — GitHub search (this research)

### Inferences
- Example commands (documented syntax, untested here):
  - `gallery-dl --range 1 "https://www.wikiart.org/en/pablo-picasso/the-old-blind-guitarist-1903"`: whether it fetches the unsuffixed original is unverified, so the direct URL rule is preferable.
  - `gallery-dl "https://commons.wikimedia.org/wiki/Category:Google_Art_Project_works_by_Rembrandt"`: this downloads originals, which can be huge. Better to use the API recipe with `iiurlwidth=3840`.
  - `dezoomify-rs --max-width 4096 "<IIIF info.json | GA&C asset URL | Zoomify ImageProperties.xml>" out.jpg`
- `iiif-dl`: I found no current information. Since museums' IIIF servers allow `full/max` or size-bounded requests directly, a dedicated IIIF downloader adds little.

### Gaps
- No up-to-date info found on `iiif-dl` (status, maintainer).
- I did not verify whether gallery-dl's WikiArt extractor downloads the original or a `!Large` variant.

## 6. Copyrighted 20th-century works (artists died after ~1955) and 2025-2026 changes

### Takeaway
For in-copyright works, realistic higher-resolution options are: WikiArt originals (sometimes large, see section 3); museum sites that show large images under fair-use or educational terms (MoMA, Tate, Centre Pompidou; terms not verified here); and GA&C zoom views. All of these are "view, don't redistribute" sources. Downloading for private study is the most defensible use. Mirroring to a public CDN is not. 2025-2026 changes: new Wikimedia API rate limits and thumbnail-size standardisation (2026), dezoomify-rs archived (November 2026). WikiArt API v2 still works (verified 2026-11-13).

### Cited Findings
- Commons excludes GAP works "still under copyright", so Commons cannot help for these artists. — [Category:Google Art Project](https://commons.wikimedia.org/wiki/Category:Google_Art_Project)
- WikiArt claims fair use for copyrighted works "as low resolution copies unsuitable for commercial use" and removes works on notice. The live test found a copyrighted Picasso at 3648×5472. — [WikiArt Terms](https://www.wikiart.org/en/terms-of-use); live test (this research)
- Google ToS: others' content may not be used "without that person or organization's permission, or as otherwise allowed by law". — [Google Terms](https://policies.google.com/terms)
- 2026 changes:
  - Wikimedia API rate limits ("new in 2026") — [Rate limits](https://www.mediawiki.org/wiki/Wikimedia_APIs/Rate_limits)
  - standard thumbnail sizes and the curtailing of non-standard widths — [Common thumbnail sizes](https://www.mediawiki.org/wiki/Common_thumbnail_sizes), [OSM 2026-04](https://lists.openstreetmap.org/pipermail/rails-dev/2026-April/049560.html)
  - dezoomify-rs archived — [dezoomify-rs](https://github.com/lovasoa/dezoomify-rs)

### Inferences
- For the app, keep copyrighted works at "good enough to recognise style" quality (about 1200–2000 px) and store them in a private R2 bucket. Do not chase gigapixel copies of in-copyright works. Note the decision in KARARLAR next to items 143 and 239.
- Any existing script that requests non-standard Commons widths (e.g. `Special:FilePath?width=800`, as in CLAUDE.md, or `?width=400`) may now be served the next larger standard size or be rate-limited. Prefer 500/960/1280/1920/3840. This affects the phone side too, if it still hits Commons directly.

### Gaps
- I did not fetch the image terms of MoMA, Tate or Centre Pompidou (the museum researcher may cover them). I found no source quantifying image sizes on their sites.
- No legal source specific to Turkish or EU private-copy exceptions was consulted. The legal statements above are general caveats, not legal advice.
- I did not check whether WikiArt changed its anti-bot posture (Cloudflare challenges) in 2026. The tests here were not challenged.
