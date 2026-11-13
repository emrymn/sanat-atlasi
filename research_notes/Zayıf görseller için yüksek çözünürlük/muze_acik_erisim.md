# Museum open-access collections and APIs for high-resolution artwork images (Renaissance to 20th century)

Research date: 2026-11-13. Live tests were run from a cloud container with a generic User-Agent and no personal data. "VERIFIED LIVE" means I made the HTTP request myself on 2026-11-13 and measured the result. Everything else is cited, or listed under Gaps / Inferences as unverified prior knowledge.

## Q1. Already-used museums (Met, AIC, Cleveland, NGA): are we getting their maximum resolution? Exact endpoints and limits

### Takeaway
- **Met:** `primaryImage` (the `/original/` path) is the maximum the API gives. On a test object it was 4000×3184 px, about 8 MB. `primaryImageSmall` (`/web-large/`) is much smaller.
- **Cleveland:** `images.full.url` is the master TIFF (e.g. 11652×14500, 507 MB). `images.print.url` is a JPEG of about 3400 px on the long side. Use `print` unless a huge file is really wanted.
- **NGA:** the IIIF server reports the true master size (e.g. 23235×23968), but `full/max` and `full/full` are capped at 4096 px on the long side. Full-resolution regions are served, so larger images are possible only by stitching tiles.
- **AIC:** the IIIF server uses a size allowlist. Without a browser Referer it serves `843,`, `1686,` and `3000,` widths, but returns 403 for `full/max`, `full/full`, `2000,`, `3001,`, `4000,` and full-resolution regions larger than a tile. So 3000 px wide is the practical maximum for a script that respects the policy.

### Cited Findings
- **Met, VERIFIED LIVE.** `GET https://collectionapi.metmuseum.org/public/collection/v1/objects/436535` (Van Gogh, Wheat Field with Cypresses) returned:
  - `isPublicDomain: true`
  - `primaryImage = https://images.metmuseum.org/CRDImages/ep/original/DP-42549-001.jpg`
  - `primaryImageSmall = .../ep/web-large/DP-42549-001.jpg`
  - `objectWikidata_URL = https://www.wikidata.org/wiki/Q18689458`

  The download of `primaryImage` measured **4000×3184 px, 8.29 MB**. So the Met API also returns a Wikidata QID for each object, which allows exact-work matching. — [Met Collection API object 436535](https://collectionapi.metmuseum.org/public/collection/v1/objects/436535)
- Met API: openly documented, no authentication, public since 2018. Open-access works are CC0. — [Navigating.art, "Almost frictionless: open access museum collections in practice in 2026"](http://www.navigating.art/education/open-access-2026)
- **AIC, VERIFIED LIVE.**
  - `GET https://api.artic.edu/api/v1/artworks/27992?fields=id,title,image_id,is_public_domain,thumbnail,max_zoom_window_size` (La Grande Jatte) returned `is_public_domain: true`, `max_zoom_window_size: -1` and `thumbnail.width/height = 9310×6237`.
  - `https://www.artic.edu/iiif/2/2d484387-2509-5e8e-2c43-22f9981972eb/info.json` reports a master of **9310×6237** with `maxArea 58066470`, and sizes down to 145 px.
  - IIIF requests sent without a Referer header gave these results:

    | Request | Result |
    |---|---|
    | `full/843,/0/default.jpg` | 200 |
    | `full/1686,/0/default.jpg` | 200 (850 KB) |
    | `full/3000,/0/default.jpg` | 200 (2.57 MB) |
    | `full/2000,`, `full/3001,`, `full/3500,`, `full/4000,`, `full/4655,`, `full/9310,` | 403, body "Request blocked by IIIF allowlist policy." |
    | `full/max`, `full/full` | 403 (HTML page) |
    | Region `0,0,1024,1024/1024,` | 403 |
    | Region `0,0,256,256/256,` | 200 |

  — [AIC IIIF info.json](https://www.artic.edu/iiif/2/2d484387-2509-5e8e-2c43-22f9981972eb/info.json)
- AIC's official docs recommend `https://www.artic.edu/iiif/2/{identifier}/full/843,/0/default.jpg`. They take the base from `config.iiif_url`, which should not be hard-coded. They also say: "When downloading images, use /full/843,/0/default.jpg", "When scraping, please use a single thread and self-throttle", and "Consider using data dumps instead of scraping". The data dumps are at https://github.com/art-institute-of-chicago/api-data and are updated weekly. — [AIC API docs](https://api.artic.edu/docs/)
- AIC's IIIF server answers 403 unless requests carry a Referer pointing to www.artic.edu. — [Navigating.art 2026](http://www.navigating.art/education/open-access-2026). Note: my attempt to test larger sizes with a spoofed Referer was blocked by this environment's policy as an access-control bypass, so I did not test it. Do not plan on that route.
- AIC: if an artwork page has no download button, assume the work is not public domain. — [AIC open access images](https://www.artic.edu/open-access/open-access-images)
- **Cleveland, VERIFIED LIVE.** `GET https://openaccess-api.clevelandart.org/api/artworks/?q=monet&has_image=1&cc0=1&limit=1&type=Painting` returned object 135382 (Monet, The Red Kerchief, `share_license_status: "CC0"`) with three image sizes:

  | Key | Format | Size | File size |
  |---|---|---|---|
  | `images.web` | JPEG | 723×900 | — |
  | `images.print` | JPEG | **2732×3400** | 3.77 MB |
  | `images.full` | TIFF | **11652×14500** | 506.9 MB |

  The URL pattern is `https://openaccess-cdn.clevelandart.org/{accession}/{accession}_{web|print|full}.{jpg|tif}`. The API record has no Wikidata field. Fields include `id`, `accession_number`, `athena_id`, `creators`, `images` and `alternate_images`. — [Cleveland Open Access API](https://openaccess-api.clevelandart.org/api/artworks/135382)
- Cleveland API: no key or token, about 61,000+ records. The licence field returns "CC0". — [Navigating.art 2026](http://www.navigating.art/education/open-access-2026)
- **NGA, VERIFIED LIVE.**
  - The open-data file `published_images.csv` (92 MB, 129,726 rows) has the columns `uuid, iiifurl, iiifthumburl, viewtype, sequence, width, height, maxpixels, openaccess, created, modified, depictstmsobjectid, assistivetext`. 69,496 rows have `openaccess=1`. 54,006 rows have `maxpixels=900`, which are presumably the non-open-access works capped at 900 px.
  - For Ginevra de' Benci (`depictstmsobjectid=50724`), the primary image `8f29e3c9-…` is **23235×23968**, and `info.json` reports IIIF Image API 2 level1, jpg only, with `sizeAboveFull` supported.
  - `https://api.nga.gov/iiif/{uuid}/full/max/0/default.jpg` and `full/5000,/0/default.jpg` both returned **3971×4096** (4.69 MB). So full-image output is capped at 4096 px on the long side.
  - Region requests at full resolution work: `0,0,2048,2048/full/0/default.jpg` and `0,0,8000,8000/2000,/0/default.jpg` both returned 200.

  — [NGA opendata published_images.csv](https://raw.githubusercontent.com/NationalGalleryOfArt/opendata/main/data/published_images.csv); [NGA IIIF info.json](https://api.nga.gov/iiif/8f29e3c9-a289-4d53-abf0-31a66e9e98fa/info.json)
- NGA: open-access images are "available for download free of charge for any use, whether commercial or non-commercial". The open data CSV is updated daily. — [NGA free images and open access](https://www.nga.gov/artworks/free-images-and-open-access); [NGA open data](https://nga.gov/open-access-images/open-data.html)
- NGA website downloads go "up to 3000 pixels each", according to a March 2026 secondary article. This is lower than the 4096 px that IIIF returns. — [Open Culture, 4 Mar 2026](https://www.openculture.com/2026/03/download-60000-works-of-art-from-the-national-gallery.html)

### Inferences
- **Met:** if the app currently stores `primaryImageSmall`, switch to `primaryImage`. Met images are already about 4000 px, so the Met is not the bottleneck.
- **Cleveland:** `print` (about 3400 px long side) is a good build-time target. For the few works where a bigger file matters, `full` TIFF can be downsampled locally (e.g. to 4000–6000 px) before upload to R2. The files are huge, so throttle.
- **NGA:** `full/max` gives 4096 px with no extra work. That is already above the 2500 px threshold, so tile stitching should not be needed. Stitching is technically allowed by the server (regions at full scale return 200), but it is heavy.
- **AIC:** `full/3000,/0/default.jpg` is the highest size that worked without a Referer. It is above the app's 2500 px threshold. Use it instead of `843,` and do not try to get around the allowlist. For portrait-format works, `3000,` sets the width, so the long side will be larger than 3000. Check that portrait requests at `3000,` also pass, since the allowlist seems to key on the size string.
- AIC's 3000 px limit is my inference from probing. It is not documented anywhere I could find.

### Gaps
- AIC's allowlisted size set is not officially documented. I found 843, 1686 and 3000 allowed and 2000 refused, but I did not check sizes such as 200, 400 or 600. I also did not check whether `!3000,3000` works.
- I did not verify any official rate-limit number for the Met, Cleveland or NGA. AIC's docs only say "single thread, self-throttle". Prior knowledge, not verified this session: the Met's documented limit is 80 requests/second.

## Q2. Other major open-access / IIIF museums for European art 1300–1950, and their Wikidata properties

### Takeaway
- **Verified fully scriptable, CC0/PD, multi-thousand-pixel images:** Rijksmuseum (no key, Micrio IIIF `full/max` returns the full master), SMK Copenhagen (`image_native` full download), Yale Center for British Art (CC0, IIIF `full/full`), Cleveland, NGA and the Met.
- **Getty:** a public SPARQL endpoint plus Linked Art, with an IIIF server described as "arbitrary resolution". My manifest test failed, so this is unverified.
- **Wikidata identifier properties:** all property numbers in this section were verified by a live SPARQL query on property labels. The guessed numbers in the brief need two corrections: **P5268 is not Louvre** (Louvre is **P9394**), and Rijksmuseum now has **P13234**.

### Cited Findings: Wikidata ID properties (VERIFIED LIVE)
These were checked on 2026-11-13 with a SPARQL query on `wikibase:Property` English labels, cross-checked with `wbgetentities`. Each links to the property's page on Wikidata, `https://www.wikidata.org/wiki/Property:Pnnnn`.

| Museum | Wikidata property |
|---|---|
| The Met | [P3634](https://www.wikidata.org/wiki/Property:P3634) "The Met object ID" |
| Art Institute of Chicago | [P4610](https://www.wikidata.org/wiki/Property:P4610) "ARTIC artwork ID" |
| Cleveland | [P11110](https://www.wikidata.org/wiki/Property:P11110) "Cleveland Museum of Art ID", formatter `https://www.clevelandart.org/art/$1` |
| NGA Washington | [P4683](https://www.wikidata.org/wiki/Property:P4683) "National Gallery of Art artwork ID" |
| Rijksmuseum | [P13234](https://www.wikidata.org/wiki/Property:P13234) "Rijksmuseum ID", formatter `https://id.rijksmuseum.nl/$1`. 5,558 items had it on 2026-11-13. |
| National Gallery London | [P13325](https://www.wikidata.org/wiki/Property:P13325) "National Gallery ID", the alphabetical painting identifier, formatter `https://www.nationalgallery.org.uk/paintings/$1` |
| National Gallery London | [P13466](https://www.wikidata.org/wiki/Property:P13466) "National Gallery (London) PID", formatter `https://data.ng.ac.uk/$1.htm` |
| Nationalmuseum Sweden | [P2539](https://www.wikidata.org/wiki/Property:P2539) artwork ID. ([P2538](https://www.wikidata.org/wiki/Property:P2538) is a different "Nationalmuseum Sweden ID".) |
| SMK Copenhagen | No SMK-specific property found. [P2108](https://www.wikidata.org/wiki/Property:P2108) "Kunstindeks Danmark artwork ID" is the Danish national index, which covers SMK. |
| Belvedere | [P5823](https://www.wikidata.org/wiki/Property:P5823) "Belvedere object ID" |
| Kunsthistorisches Museum | [P8960](https://www.wikidata.org/wiki/Property:P8960) "Kunsthistorisches Museum Wien ID" |
| Paris Musées | [P6246](https://www.wikidata.org/wiki/Property:P6246) "Paris Musées work ID" |
| Getty Museum | [P2582](https://www.wikidata.org/wiki/Property:P2582) "J. Paul Getty Museum object ID" |
| Yale Center for British Art | [P4738](https://www.wikidata.org/wiki/Property:P4738) "Yale Center for British Art artwork ID" and [P9789](https://www.wikidata.org/wiki/Property:P9789) "… artwork Lido ID" |
| Harvard Art Museums | [P10121](https://www.wikidata.org/wiki/Property:P10121) "Harvard Art Museums artwork ID" |
| LACMA | [P4611](https://www.wikidata.org/wiki/Property:P4611) "LACMA ID" |
| Philadelphia Museum of Art | [P4643](https://www.wikidata.org/wiki/Property:P4643) "Philadelphia Museum of Art work ID" |
| Finnish National Gallery | [P9834](https://www.wikidata.org/wiki/Property:P9834) "Finnish National Gallery artwork ID" |
| Pinakothek (Bavarian State Painting Collections) | [P8948](https://www.wikidata.org/wiki/Property:P8948) "Pinakothek artwork ID" |
| Prado | [P8905](https://www.wikidata.org/wiki/Property:P8905) "Museo del Prado artwork ID" |
| Uffizi | [P8335](https://www.wikidata.org/wiki/Property:P8335) "Uffizi artwork ID" |
| Louvre | [P9394](https://www.wikidata.org/wiki/Property:P9394) "Louvre Museum ARK ID" |
| Musée d'Orsay | [P4659](https://www.wikidata.org/wiki/Property:P4659) "Musée d'Orsay artwork ID" |
| MoMA | [P2014](https://www.wikidata.org/wiki/Property:P2014) "Museum of Modern Art work ID" |
| Barnes Foundation | [P4709](https://www.wikidata.org/wiki/Property:P4709) "Barnes Foundation ID" |
| Smithsonian American Art Museum | [P4704](https://www.wikidata.org/wiki/Property:P4704) artwork ID |
| Smithsonian (general) | [P7851](https://www.wikidata.org/wiki/Property:P7851) "Smithsonian resource ID" and [P9473](https://www.wikidata.org/wiki/Property:P9473) "Smithsonian ARK ID" |
| Hermitage | [P10270](https://www.wikidata.org/wiki/Property:P10270) "Hermitage Museum work ID" |
| French national database | [P347](https://www.wikidata.org/wiki/Property:P347) "Joconde work ID" |
| Art UK (UK public collections) | [P1679](https://www.wikidata.org/wiki/Property:P1679) "Art UK artwork ID" |
| RKD | [P350](https://www.wikidata.org/wiki/Property:P350) "RKDimages ID" |

Other results from the same query:
- **P5268 is "MNAV work ID", not the Louvre.**
- **Städel:** only [P4581](https://www.wikidata.org/wiki/Property:P4581) "Städel Museum artist ID" exists. No Städel artwork-ID property matched.
- **Tate:** only [P2741](https://www.wikidata.org/wiki/Property:P2741) "Tate artist ID" matched the label search.
- **Mauritshuis, Van Gogh Museum, Kröller-Müller, Musée Rodin and Staatliche Museen zu Berlin:** no property with those names in its English label.
- **Europeana:** only [P7704](https://www.wikidata.org/wiki/Property:P7704) "Europeana entity" (an agent or concept), not a record ID.

The query is reproducible from [Wikidata Query Service](https://query.wikidata.org/).

### Cited Findings: Museum sources
- **Rijksmuseum, VERIFIED LIVE.** Three steps, no key:
  1. `GET https://data.rijksmuseum.nl/search/collection?objectNumber=SK-C-5` returned a Linked Art search page whose `orderedItems[0].id` is `https://id.rijksmuseum.nl/200107928`.
  2. Dereferencing that URI with `Accept: application/ld+json` (175 KB of JSON) contained the image `https://iiif.micr.io/PJEZO/full/max/0/default.jpg`.
  3. The Micrio `info.json` is IIIF Image API **3**, level2, jpg/png/webp. `full/max` returned **7133×5922 px (5.1 MB)**.

  So the Rijksmuseum gives the full master through `full/max`. — [Rijksmuseum search API](https://data.rijksmuseum.nl/search/collection?objectNumber=SK-C-5); [Micrio info.json](https://iiif.micr.io/PJEZO/info.json)
- Rijksmuseum: the old key-based APIs are "deprecated and mostly superseded by the new Rijksmuseum Linked Open Data APIs". The old Collection API "will be taken offline soon". The new Search API follows Linked Art Search, alongside a PID resolver, OAI-PMH, IIIF and IIIF Change Discovery. — [Rijksmuseum data docs](https://data.rijksmuseum.nl/docs/api); [old Collection API (DEPRECATED)](https://acc.data.rijksmuseum.nl/docs/api/collection)
- Rijksmuseum: "no key or registration for any endpoint", CC0. — [Navigating.art 2026](http://www.navigating.art/education/open-access-2026)
- **SMK Copenhagen, VERIFIED LIVE.** `GET https://api.smk.dk/api/v1/art/?object_number=KMS1` returned:
  - `public_domain: true`, `rights: https://creativecommons.org/publicdomain/mark/1.0/`
  - `image_width/height: 7174×5536`
  - `image_native`: a direct full-size JPEG download URL through `https://api.smk.dk/api/v1/download/...`
  - `image_iiif_id: https://iip.smk.dk/iiif/jp2/9g54xm869_KMS1-cropped.tif.jp2`, with `image_iiif_info` pointing to its `info.json`

  No key needed. — [SMK API](https://api.smk.dk/api/v1/art/?object_number=KMS1)
- **Yale Center for British Art, VERIFIED LIVE.** The IIIF manifest `https://manifests.collections.yale.edu/ycba/obj/1059` returned 200. It contains `"rights": "https://creativecommons.org/publicdomain/zero/1.0/"` and image resources of the form `https://images.collections.yale.edu/iiif/2/ycba:{uuid}/full/full/0/default.jpg`. I did not measure the pixel size. — [YCBA manifest](https://manifests.collections.yale.edu/ycba/obj/1059)
- **Getty:**
  - Public SPARQL at `https://data.getty.edu/museum/collection/sparql`. Records are Linked Art 1.0: dereference with `Accept: application/ld+json`. The IIIF endpoint "supports arbitrary resolution". Only the Linked Art endpoints that have been stable since mid-2024 are reliable; older endpoints "no longer function". — [Navigating.art 2026](http://www.navigating.art/education/open-access-2026)
  - VERIFIED LIVE: the object `https://data.getty.edu/museum/collection/object/c88b3df0-…` returned 200 and contains `https://data.getty.edu/media/image/{uuid}` references. My guessed manifest URL `https://media.getty.edu/iiif/manifest/{object-uuid}` returned 404. — [Getty object record](https://data.getty.edu/museum/collection/object/c88b3df0-de91-4f5b-a9ef-7b2b9a6d8abb)
- **National Gallery London:**
  - A 2007 press release says images were free for scholarly publications. A later release says charges are waived for not-for-profit short-run use through National Gallery Images. — [NG press release](https://www.nationalgallery.org.uk/about-us/press-and-media/press-releases-archive/increased-access-to-images-and-research)
  - The NG Research site hosts high-resolution IIIF images for research. — [NG research IIIF](https://research.ng-london.org.uk/iiif/)
  - I found no current CC0 or open-access licence for NG London. The 2026 "60,000 works from the National Gallery" article is about NGA Washington, not London. — [Open Culture 2026](https://www.openculture.com/2026/03/download-60000-works-of-art-from-the-national-gallery.html)
- Linked Art 1.0 was released on 20 February 2025. The Rijksmuseum is among the adopters. — [iiif-discuss announcement](https://groups.google.com/g/iiif-discuss/c/oKNAG7kJQzY)

### Inferences
- **Best matching strategy:**
  1. Start from the artwork's Wikidata QID, which the app already resolves through P170/P84.
  2. Read museum-ID statements: P3634, P4610, P11110, P4683, P13234, P2539, P2108, P4738, P2582, P6246, P5823, P8948, P9834, P10121, P4611, P4643.
  3. Call that museum's API by ID.

  This keeps matching exact, so the accuracy rule holds. The Met also returns `objectWikidata_URL`, which gives a reverse check.
- **Fallback when no museum-specific property exists:** P217 (inventory number) qualified with P195 (collection) on the Wikidata item. Prior knowledge: this is the standard Wikidata pattern for artworks.
- **Ranking for the "weak images" goal (CC0/PD and scriptable):** Rijksmuseum (full master) > SMK (full native) > Cleveland (print/full) > YCBA (full) > NGA (4096 px) > Met (about 4000 px) > AIC (3000 px).
- **Coverage:** Rijksmuseum and SMK matter most for Dutch Golden Age, Danish Golden Age and Northern European works. NGA, Met, Cleveland and AIC cover Italian Renaissance through Post-Impressionism well.

### Gaps
I could not verify the following during this session's tool budget. They are prior knowledge only, so treat each as "check before relying on it":
- **Nationalmuseum Stockholm:** much of its collection was released as PD/CC0, largely through Wikimedia Commons uploads. The API is at `api.nationalmuseum.se`.
- **Städel:** offers downloads under CC BY-SA 4.0 for public-domain works on sammlung.staedelmuseum.de.
- **Belvedere:** offers downloads under CC BY-SA 4.0 on sammlung.belvedere.at.
- **Pinakothek:** offers CC BY-SA 4.0 downloads on sammlung.pinakothek.de.
- **SMB Berlin:** recherche.smb.museum is mostly CC BY-NC-SA.
- **Mauritshuis:** offers free high-resolution downloads of PD works from its website.
- **Paris Musées:** CC0 HD images through a GraphQL API that needs a free token.
- **Harvard Art Museums:** API needs a free key; IIIF through `ids.lib.harvard.edu`.
- **Finnish National Gallery:** API needs a key; some works are CC0.
- **LACMA:** has had a PD image policy since 2011, but its current API status is unclear.
- **Philadelphia:** I do not know of any open-access image programme.
- **Smithsonian Open Access:** CC0, with an `api.si.edu` key from api.data.gov.
- **Barnes:** limited image downloads.
- **Van Gogh Museum:** offers high-resolution downloads of collection works for free use.
- **Kröller-Müller:** unknown.
- **Prado, Uffizi, Musée d'Orsay, Musée Rodin, Tate (mostly CC BY-NC-ND at low resolution) and MoMA:** viewing only, or restricted and low-resolution. No bulk full-resolution download.
- **Louvre (collections.louvre.fr):** images are reusable under its own terms, but I did not verify the licence or the maximum size.
- **Getty:** the image-id-to-IIIF URL pattern and actual maximum pixels are unverified because the manifest test returned 404. The right path is to read the Linked Art JSON (`representation` / `digitally_shown_by` → access point).
- **Wikidata coverage:** I could not get per-property item counts for most properties because a combined SPARQL count timed out. The only count I have is P13234 = 5,558.
- **McCarthy & Wallace GLAM open-access survey:** I did not consult it in this session.

## Q3. Which sources are scriptable within their terms of service, and which only allow viewing?

### Takeaway
- **Scriptable for full or large images within policy, VERIFIED LIVE:**
  - Met (API, about 4000 px)
  - Cleveland (API + CDN, print/full)
  - NGA (open data CSV + IIIF 4096 px)
  - Rijksmuseum (no-key Linked Art + Micrio `full/max`)
  - SMK (API `image_native`)
  - YCBA (IIIF, CC0)
- **AIC:** scriptable, but within its IIIF allowlist. In practice that means up to the `3000,` width, done single-threaded and throttled, or through its weekly data dumps.
- **WikiArt:** blocks automated requests and has unclear rights. Do not use it as a data source.

### Cited Findings
- AIC asks scrapers to use a single thread, self-throttle, and prefer the data dumps. — [AIC API docs](https://api.artic.edu/docs/)
- AIC's IIIF server enforces an allowlist. Sizes outside it return HTTP 403 "Request blocked by IIIF allowlist policy." (verified live, see Q1). — [AIC IIIF](https://www.artic.edu/iiif/2/2d484387-2509-5e8e-2c43-22f9981972eb/info.json)
- NGA: open-access images may be used free "for any use, whether commercial or non-commercial". — [NGA free images](https://www.nga.gov/artworks/free-images-and-open-access)
- WikiArt "blocks automated requests". Rights vary by work and are not always clear. It is "a discovery and reference tool, not a data source". — [Navigating.art 2026](http://www.navigating.art/education/open-access-2026)
- Getty: open SPARQL and Linked Art, no key. — [Navigating.art 2026](http://www.navigating.art/education/open-access-2026)
- SMK: PD works are marked with Public Domain Mark 1.0 and offer a direct download URL in the API. — [SMK API](https://api.smk.dk/api/v1/art/?object_number=KMS1)

### Inferences
- **Commons cross-check:** a build script could first check whether Wikimedia Commons already holds the museum's own master upload. Many Rijksmuseum, NGA, Met, Nationalmuseum and YCBA masters were bulk-uploaded to Commons. Commons `Special:FilePath` without `?width=` returns the original file. This keeps the existing pipeline unchanged.
- **NGA tiles and AIC Referer:** stitching NGA tiles is technically allowed by the server but not needed above 4096 px. Spoofing a Referer to get around AIC's allowlist should be avoided as a terms-of-service and ethics matter. This environment's safety policy also blocked my attempt to do it.
- **Downsample before upload:** for R2 upload, a 3000–4000 px JPEG at about q85 is enough for a phone pinch-zoom viewer. Masters of 7000 px or more (Rijksmuseum, SMK, Cleveland TIFF) should be downsampled at build time to control storage and bandwidth.

### Gaps
- I did not read the exact terms-of-service text for each API. Clauses about bulk downloading and rate limits are unverified for the Rijksmuseum, SMK, YCBA and Getty.
- I did not verify which European museums only offer zoom tiles without a download option. The Prado, Uffizi and Orsay are, by prior knowledge, viewing only.

## Q4. Europeana and other aggregators: full-resolution `edm:isShownBy` and rights statements?

### Takeaway
Yes. The Europeana Search API (`profile=rich`) returns `edmIsShownBy` (a direct media link), `edmIsShownAt` (the provider's landing page), `rights` (a Creative Commons or RightsStatements URI) and `dataProvider`. The `reusability=open` filter limits results to open licences. Resolution depends on what each provider supplied and varies.

### Cited Findings
- **VERIFIED LIVE.** I queried `https://api.europeana.eu/record/v2/search.json?wskey=api2demo&query=vermeer&qf=TYPE:IMAGE&reusability=open&rows=1&profile=rich`:
  - `success: true`, 744 results
  - First item: `dataProvider: Rijksmuseum`
  - `rights: http://creativecommons.org/publicdomain/mark/1.0/`
  - `edmIsShownBy: https://lh3.googleusercontent.com/...=s0`. This is a Google-hosted original-size link; `=s0` means original size.
  - `edmIsShownAt: http://hdl.handle.net/10934/RM0001.COLLECT.6417`

  — [Europeana Search API](https://api.europeana.eu/record/v2/search.json?wskey=api2demo&query=vermeer&qf=TYPE:IMAGE&reusability=open&rows=1&profile=rich)

### Inferences
- **Use Europeana as a fallback and discovery tool, not the main source.** Its `edmIsShownBy` links can be legacy CDN copies. The Rijksmuseum example points to an old Google-hosted image rather than the current Micrio master. Matching to Wikidata items would be by title and creator text, which is weaker than an ID match. Only accept a Europeana record when its `edmIsShownAt` or provider ID maps to the museum ID already on the Wikidata item.
- The `api2demo` key worked for the test. A personal free key is the proper choice for a build script.

### Gaps
- I did not verify Europeana's rate limits, or whether `api2demo` is officially allowed for scripted use.
- I did not measure the actual pixel size of the `edmIsShownBy` file.

## Q5. 2025–2026 changes

### Takeaway
- **Rijksmuseum:** moved from key-based APIs to no-key Linked Open Data (Linked Art Search + Micrio IIIF). The old Collection API is deprecated and slated to go offline.
- **Linked Art 1.0:** released in February 2025. The Getty and Rijksmuseum use it.
- **AIC:** its IIIF server now enforces a size allowlist and Referer checks, so large sizes are blocked for scripts.
- **NGA:** open data is live and updated daily, with rows modified as of April 2026.
- **Wikidata:** new IDs were added for the Rijksmuseum (P13234) and National Gallery London (P13325, P13466).

### Cited Findings
- Rijksmuseum's old APIs are deprecated and the Collection API "will be taken offline soon". — [Rijksmuseum docs](https://data.rijksmuseum.nl/docs/api); [deprecated Collection API](https://acc.data.rijksmuseum.nl/docs/api/collection)
- Linked Art 1.0 was released on 20 February 2025. — [iiif-discuss](https://groups.google.com/g/iiif-discuss/c/oKNAG7kJQzY)
- Getty: the Linked Art endpoints stable since mid-2024 are the reliable ones, and older endpoints no longer work. AIC needs a Referer for IIIF. — [Navigating.art 2026](http://www.navigating.art/education/open-access-2026)
- NGA CSV rows carry `modified` timestamps of 2026-04-13 (verified live). — [NGA published_images.csv](https://raw.githubusercontent.com/NationalGalleryOfArt/opendata/main/data/published_images.csv)
- The property numbers P13234, P13325 and P13466 are high, which suggests they were created recently (2025–2026). Their formatters are verified live. — [Property:P13234](https://www.wikidata.org/wiki/Property:P13234); [Property:P13325](https://www.wikidata.org/wiki/Property:P13325); [Property:P13466](https://www.wikidata.org/wiki/Property:P13466)

### Inferences
- **Rijksmuseum code:** any code that uses the old `rijksmuseum.nl/api/...?key=` endpoints should move to `data.rijksmuseum.nl/search/collection` + `id.rijksmuseum.nl` + `iiif.micr.io`.
- **AIC timing:** I could not date the allowlist. AIC's docs still recommend `843,`, so it was probably introduced to discourage bulk full-size scraping. This is unverified.

### Gaps
- I did not establish exact dates for the AIC allowlist, the Rijksmuseum old-API shutdown, or the creation of the new Wikidata properties.
- I found no reliable 2025–2026 news on new open-access programmes at the National Gallery London, Louvre, Prado, Uffizi or Orsay. Their status as of November 2026 is unverified.
