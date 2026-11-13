# Measuring image quality, verifying it is the same artwork, and sizing files for an iPhone 13 PWA

Context checked in the repo before researching:
- `scripts/kalite_tara.py` calls an image weak if its long side is < 2500 px. It accepts a candidate only if: aspect ratio is within 5%, the long side is ≥ 1.25× ours and ≥ 2000 px, a 9×8 dHash differs by ≤ 12 of 64 bits, and the candidate is colour rather than greyscale or faded. Thumbnails are made with `sips`.
- `KARARLAR.md` (lines ~1358–1381) records the current storage scheme:
  - three tiers: a 400 px grid copy (in the repo), a 1280 px copy, and a "devasa" (largest) copy on R2, long side ≤ 4096 at `sips` quality 92;
  - the devasa copy downloads only for the work open in the viewer and is stored in IndexedDB;
  - the service-worker image cache was raised from 300 MB to 700 MB;
  - an earlier bug: `sips -Z` *upscaled* 893 small originals to 4096 px, so every file looked 4096 and the comparison broke;
  - re-encoding at quality 80 cut 703 MB to 393 MB with "no visible difference", but Emre rejected it ("en yüksek kalitede olsun").
- I measured in the scratchpad: the 7,028 grid thumbnails in `gorseller/k` are 400 px JPEGs averaging ≈ 42 KB, ≈ 290 MB in total.

Scratchpad experiments, with scripts in `/tmp/claude-0/-home-user-sanat-atlasi/a672f32b-4fd6-51ac-b01a-b2ccce8dbc01/scratchpad/`:
- `deney.py`: hash robustness and false-match rate.
- `etkin.py`: detecting upscaled images.
- Both use only Pillow 12.3 and numpy, on 400 px thumbnails from `gorseller/k`. These are my own measurements, not literature.

## Q1. Beyond pixel size: which measurable defects make a reproduction "low quality", and which metrics catch each?

### Takeaway
Pixel count is a weak proxy. For this pipeline the defects that matter most are:
1. **Fake resolution.** The image was upscaled, by `sips -Z` here or by an uploader on Commons.
2. **Heavy JPEG compression.**
3. **Blur or softness.**
4. **Colour cast or fading.**
5. **Frame, wall or perspective included.**

Cheap, transparent measures are the most reliable for these defects:
- the quantization table read from the JPEG header;
- a self-normalising "down-then-up" effective-resolution test;
- *relative* sharpness compared with our own copy at the same scale;
- colour statistics against our current copy.

General no-reference IQA models (BRISQUE, NIQE, MUSIQ, CLIP-IQA in pyiqa) are trained on natural-photo distortions. They are not calibrated for paintings, so use them only as a tie-breaker between candidates *of the same work*, never as an absolute gate.

### Cited Findings
- pyiqa (IQA-PyTorch) bundles many no-reference metrics, including NIQE, NRQM, MUSIQ, TOPIQ (`topiq_nr`), NIMA, DBCNN, BRISQUE, PI, CNNIQA, HyperIQA, CLIPIQA, QualiCLIP and others. Install with `pip install pyiqa`. Use `pyiqa.create_metric(name, device=...)`, and check score direction with `metric.lower_better`. The README names only `cuda` and `cpu` devices and says nothing about Apple MPS. The latest changelog entry is dated Nov 2026. — [IQA-PyTorch GitHub](https://github.com/chaofengc/IQA-PyTorch); [pyiqa model cards](https://iqa-pytorch.readthedocs.io/en/latest/ModelCard.html)
- pyiqa variants: MUSIQ comes as `musiq` (KonIQ-trained by default), `musiq-spaq`, `musiq-ava` and others. CLIP-IQA comes as `clipiqa`, `clipiqa+` and others. BRISQUE and NIQE have `_matlab`-compatible versions and are "no backward". — [pyiqa model cards (stable)](https://iqa-pytorch.readthedocs.io/en/stable/ModelCard.html)
- CLIP-IQA scores "look and feel" (quality and abstract perception) through CLIP prompt pairs. — [Wang et al., Exploring CLIP for Assessing the Look and Feel of Images](https://arxiv.org/pdf/2207.12396)
- An NTIA evaluation of eight NR metrics, including BRISQUE and NIQE, found them inaccurate for consumer applications. It notes they were trained on synthetic distortions of natural scenes (the LIVE database). — [NTIA TM-20-547](https://its.ntia.gov/publications/download/TM-20-547.pdf)
- MathWorks documentation says:
  - BRISQUE only measures distortion types it was trained on;
  - NIQE correlates less reliably with human judgement than BRISQUE;
  - in its own example, BRISQUE scored JPEG q50–70 "unrealistically" better than uncompressed images.
  — [MathWorks: Compare No-Reference Image Quality Metrics](https://de.mathworks.com/help/images/compare-no-reference-image-quality-metrics.html)
- NSS-based metrics (BRISQUE, NIQE) assume natural-scene statistics. Synthetic (non-photographic) images need separate treatment. — [Kundu & Evans, Asilomar 2015](https://users.ece.utexas.edu/~bevans/papers/2015/imagequalitynoref/syntheticImageQualNoRefAsilomar2015PaperDraft.pdf)
- JPEG quality can be read *exactly* from the quantization tables when they are IJG-standard tables scaled by a quality factor. Common tools only approximate it; for example, JPEGsnoop reports 74.75 for q75 and 97.68 for q95. — [Cogranne, arXiv 1802.00992](https://arxiv.org/abs/1802.00992)
- When header tables are missing, or for re-saved images, the quantization table can be estimated from decoded pixels alone. — [IPOL: A Reliable JPEG Quantization Table Estimator](https://ipol.im/pub/art/2022/399)
- Detecting double JPEG compression is "a challenging task". It relies on estimating the first-pass table, and works best when the first- and second-pass steps differ. — [Springer EURASIP J. Info Security 2021](https://link.springer.com/article/10.1186/s13635-021-00120-7)
- FADGI 3rd edition (May 2023) grades "Paintings and Other Two-Dimensional Art" on 1–4 stars, using the ColorChecker SG target by default in OpenDICE. Its 2023 configuration lists, for 4★ / 3★ / 2★ / 1★:
  - mean ΔE: 2 / 3.5 / 5 / 6.5;
  - 90th-percentile ΔE: 4 / 7 / 10 / 13;
  - sharpening: 1.02 / 1.05 / 1.1 / 1.15;
  - noise: 1 / 2 / 3 / 4;
  - white balance: 2 / 4 / 6 / 8.

  "Prints and Photographs" has identical values. The units of the frequency (SFR) rows are not given in that file.
  — [FADGI OpenDICE Config_materials2023](https://www.digitizationguidelines.gov/guidelines/OpenDICE/Config_materials2023.txt); [OpenDICE v3.0 manual](https://www.digitizationguidelines.gov/guidelines/OpenDICE/OpenDICE_manual_v3.0.docx); [LoC blog on FADGI 3rd ed.](https://blogs.loc.gov/thesignal/2023/05/fadgi-third-edition-still-image/)
- My experiment (`etkin.py`, 40 thumbnails): Laplacian variance and the high-frequency energy ratio both fall sharply when an image is upscaled. Laplacian variance has a median of 774 native, 67 at 2× bicubic and 6.9 at 4×. But the native values range from 103 to 5,598 depending on content, so an *absolute* threshold cannot separate a calm sfumato painting from an upscaled one. The HF ratio ranges also overlap: native min 0.037 vs 2× max 0.047. (Own measurement; no URL.)

### Inferences
Defect → practical detector, all runnable on a Mac with Pillow and numpy, optionally OpenCV and pyiqa.

| Defect | Detector | Notes |
|---|---|---|
| Upscaled ("fake hi-res") | Effective-resolution test (Q2) | Most important here, given the `sips -Z` history and Commons upscales. |
| JPEG compression | `PIL.Image.open(f).quantization` → IJG quality estimate (Cogranne method); flag q < ~75 | Also flag files whose effective resolution is far below nominal *and* whose q is low: likely re-saved web grabs. |
| Blur / softness / focus | Laplacian variance or Tenengrad, **relative**: downscale the candidate to *our* copy's size, then require sharpness ≥ ours | Absolute thresholds fail (range 103–5,598 on native thumbnails). |
| Colour cast / yellowing / fading | Compare mean a\*/b\* (Lab) and chroma of candidate vs our copy, which `kalite_tara.py` partly does with R−G/B−G; FADGI 4★ is mean ΔE ≤ 2 vs the target | Without a reference you cannot know the true colours. Prefer known museum/IIIF sources over unknown uploads. |
| Frame / wall included | Border-uniformity scan (rows/cols of low variance or a different hue at the edges), or the homography from Q3, which gives the exact painting quad | Frames also break the dHash (Q3). |
| Perspective / glare | Homography from Q3: strongly non-similarity H means a photographed-at-angle copy; large saturated clipped areas suggest glare | Count of clipped pixels (L ≥ 250 in clusters). |
| Moiré / halftone from book scans | FFT peaks off-axis at a regular frequency (halftone screen) | No library found; FFT peak picking is simple to write. |
| Watermarks | Not reliably detectable with cheap metrics | Rely on source choice (WikiArt/GA&C crops rarely carry them; stock sites do). |
| "Overall look" ranking | pyiqa `topiq_nr` / `musiq` / `clipiqa` **only to rank several verified candidates of the same work** | Run on CPU, or test MPS yourself. |

### Gaps
- I found no published NR-IQA benchmark on painting reproductions. All the NR metrics above are validated on natural photos.
- pyiqa MPS (Apple GPU) support is undocumented. Assume CPU.
- I did not verify the Metamorfoze guideline numbers; only FADGI was checked.
- No source found for automatic watermark detection suitable for this pipeline.

## Q2. How to detect "fake" high resolution (upscaled images)

### Takeaway
Use a self-normalising **down-then-up round-trip test**:
1. Downscale the image by factor f, then upscale back to the original size.
2. If PSNR against the original stays high (≥ ~38 dB), the image held no detail at that scale.
3. The largest f that passes gives `effective long side = nominal / f`.

In my test this cleanly separated native images from 2× and 4× bicubic upscales. Gate replacements on **effective** size, not nominal size. FFT and zero-coefficient methods exist, but their own authors call them suggestive, not conclusive.

### Cited Findings
- Interpolation (upsampling) leaves zero-valued or very weak frequency coefficients at frequencies matching the upsampling factor. Counting zero crossings in rows of frequency coefficients can estimate whether an image was upsampled. — [US Patent 10,382,516 "Detecting upscaled source video"](https://patents.google.com/patent/US10382516)
- Peak detection in horizontal and vertical frequency regions can estimate the original resolution before scaling. — [Resolution estimating device patent 10,037,594](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10037594)
- `fresdet` is an open-source FFT and statistics tool for estimating the original resolution of upscaled images. Its author cautions that the FFT "will not definitively tell you" whether an image was upscaled. — [Sagnac/fresdet](https://github.com/Sagnac/fresdet)
- The VQEG `video-fft` tool uses an azimuthally averaged 1D power spectrum to identify upscaled content. — [VQEG video-fft](https://vqeg.github.io/software-tools/quality%20analysis/video-fft)
- The original resolution of compressed images can also be inferred from DCT spectra. — [CIPO patent 3183052](https://brevets-patents.ic.gc.ca/opic-cipo/cpd/eng/patent/3183052/summary.html)
- My experiment (`etkin.py`): round-trip with Lanczos down and bicubic up, factors 1.25–6, PSNR threshold 38 dB, on 40 thumbnails. Ratio = estimated effective / nominal long side.

  | Image | Median ratio | Range |
  |---|---|---|
  | Native | 1.00 | 0.50–1.00 |
  | 2× upscaled | 0.40 | 0.20–0.67 |
  | 4× upscaled | 0.20 | 0.17–0.33 |

  The method slightly *over*-calls upscaling (it reads 2× as ~2.5×). That is a safe direction for a "reject fake" gate. (Own measurement; no URL.)

### Inferences
- Concrete rule for `kalite_tara.py`:
  - compute `etkin = uzun_kenar / f_max`;
  - treat an image as weak when `etkin < 2500` rather than when `uzun_kenar < 2500`;
  - accept a candidate only if `etkin_aday ≥ 1.25 × etkin_bizim`.

  This would have caught the 893 `sips`-upscaled 4096 px files automatically, and it catches Commons uploads that are themselves upscales.
- Compute it on the luminance of a central crop (e.g. the middle 1024×1024 at full resolution) to keep it fast. Use 2–3 crops to avoid a flat sky or background dominating.
- Expect false "fake" calls on genuinely smooth works (sfumato, colour-field, washes) and on heavily denoised scans. Use it as a ranking or flag together with a *relative* sharpness check against our own copy, not as an isolated hard reject for our current copies.
- Since sips cannot do this, it needs Pillow and numpy. The scratchpad script is ~25 lines and uses no OpenCV.

### Gaps
- I found no peer-reviewed, ready-to-use "effective resolution" estimator validated on paintings. The cited methods are patents and hobby tools.
- The PSNR threshold (38 dB) is my own choice, tuned only on 400 px thumbnails. It should be calibrated on a few dozen of the app's real 4096 px files: known-native Commons masters vs the known 893 `sips` upscales.

## Q3. Verifying that a candidate is the exact same artwork

### Takeaway
The current 9×8 dHash ≤ 12 gate has a very low false-match rate between *different* works:

| Hash | Different-work pairs within ≤ 12 bits | Rate |
|---|---|---|
| dHash | 0.028% of 1.12 M pairs | ≈ 1 in 3,600 |
| pHash | 0.0018% | ≈ 1 in 55,000 |

But it has three blind spots:
1. It **rejects good candidates that include a frame or are cropped by ~8%**: only 15–35% pass.
2. It **cannot see quality at all**: blur, JPEG q30 and greyscale all pass ~100%.
3. It **cannot tell two autograph versions of the same composition apart**.

Recommended layered check:
1. Trim borders.
2. Gate on dHash + pHash.
3. Run a geometric verification for borderline cases and for every accepted candidate: SIFT/ORB + ratio test + RANSAC homography. It also gives the crop.
4. Optionally use a copy-detection embedding (SSCD) as a third signal.
5. Handle multiple versions by metadata (same Wikidata/museum record), not by pixels alone.

### Cited Findings
- Practitioner guides suggest 0–5 of 64 bits means "same image" and ~10 is a starting threshold to tune. They say pHash is not robust to crops or rotation, that thresholds must be calibrated on your own labelled near-duplicate and impostor pairs, and that hashes from different libraries are not comparable. These are blog/vendor sources, not peer-reviewed. — [mojoauth pHash vs dHash](https://mojoauth.com/security-guides/phash-vs-dhash); [mixpeek guide](https://mixpeek.com/guides/perceptual-image-hashing-near-duplicate-detection); [ssojet pHash in Rust](https://ssojet.com/hashing/phash-in-rust)
- SSCD is a descriptor trained specifically for copy detection, with entropy regularisation so a *threshold* is meaningful. On DISC2021 a ResNet-50 SSCD (512-d) reaches 98.3 µAP vs 92.3 for a DINO (v1) ViT-B/16 baseline. Code: facebookresearch/sscd-copy-detection. — [Pizzi et al., CVPR 2022](https://openaccess.thecvf.com/content/CVPR2022/html/Pizzi_A_Self-Supervised_Descriptor_for_Image_Copy_Detection_CVPR_2022_paper.html); [supplement](https://openaccess.thecvf.com/content/CVPR2022/supplemental/Pizzi_A_Self-Supervised_Descriptor_CVPR_2022_supplemental.pdf)
- DINOv2 generally beats CLIP for image-to-image similarity (median rank 1 vs 6 in one ablation), since CLIP is trained for text alignment. Published DINOv2 cosine thresholds are task-specific: ~0.9 for video-frame deduplication, 0.7 for a CAD filter. A painting-plagiarism study uses DINOv2 cosine similarity plus a threshold, with fine-tuning. — [arXiv 2505.24838](https://arxiv.org/pdf/2505.24838); [arXiv 2412.07584](https://arxiv.org/pdf/2412.07584); [arXiv 2506.23132](https://web3.arxiv.org/pdf/2506.23132)
- OpenCV's feature matching + homography tutorials:
  - use Lowe's ratio test at 0.7 (Python/FLANN) or 0.75 (C++);
  - use `findHomography` with RANSAC, where the reprojection threshold is in pixels (5.0 is a common choice, not a default);
  - require a minimum number of good matches (`MIN_MATCH_COUNT = 10` in the widely copied example) before estimating H;
  - `findHomography` can return None for degenerate point sets.

  — [OpenCV Python feature homography tutorial](https://docs.opencv.org/4.x/d1/de0/tutorial_py_feature_homography.html); [OpenCV FLANN matcher tutorial](https://docs.opencv.org/4.x/d5/d6f/tutorial_feature_flann_matcher.html); [OpenCV 5 docs](https://docs.opencv.org/5.0/tutorials/features/feature_homography/feature_homography.html)
- My experiment (`deney.py`, Pillow and numpy, 9×8 dHash like `kalite_tara.py` and a 32×32-DCT pHash), on 1,500 random thumbnails:

  | Hash | Pairs ≤ 8 bits | ≤ 10 | ≤ 12 | ≤ 14 | Min distance |
  |---|---|---|---|---|---|
  | dHash | 0.0007% | 0.0069% | 0.028% | 0.10% | 7 |
  | pHash | 0.0004% | 0.0008% | 0.0018% | 0.0079% | 6 |

  A few low-distance pairs may be genuine duplicates in the pool. (Own measurement; no URL.)
- Same experiment, on 300 images with the same image transformed. Values are median / p90 bits and the share passing ≤ 12:

  | Transformation | dHash | pHash |
  |---|---|---|
  | 3% brown frame | 8 / 14, 86% pass | 8 / 14, 84% |
  | 8% frame | 17 / 23, **15%** | 18 / 24, **12%** |
  | 3% crop | 6 / 10, 98% | 6 / 10, 96% |
  | 8% crop | 14 / 19, **35%** | 16 / 22, **20%** |
  | 4% perspective | 3 / 7, 100% | 4 / 6, 100% |
  | Mirror (reversed print) | 26 / 38, 6% | 32 / 34, **0%** |

  Yellow/fade cast, JPEG q30, Gaussian blur r=2 and greyscale all gave median 0–1 bits and **100% pass** for both hashes. (Own measurement; no URL.)

### Inferences
Recommended verification pipeline:
1. **Normalise.** Trim uniform or low-variance borders (frame, wall, scanner bed) from both images. Then check aspect within 5% *after* trimming. Today a framed photo can be rejected because the frame alters the aspect ratio or the hash.
2. **Hash gate (cheap).** Compute dHash *and* pHash. Accept-path if both are ≤ 10. Reject if either is ≥ 24 or the image is mirrored. Treat 11–23 as "uncertain → geometric check".
3. **Geometric check.** Use OpenCV SIFT, which is in main OpenCV since 4.4 (the version claim is from memory, not checked this session), or ORB on ~1500 px versions:
   - ratio 0.75, RANSAC 5 px;
   - require ≥ ~50 inliers *and* inliers covering most of a 4×4 grid of the painting;
   - the homography must be close to a similarity transform (near-uniform scale, small shear).

   This proves the same object, gives the exact crop quad to remove a frame, and tolerates colour casts. Run it on *every* accepted replacement, because it is the only step here that looks at mid-scale detail.
4. **Versions and copies by the same artist.** Many paintings exist in several autograph versions (Munch's *Scream*, Van Gogh's *Sunflowers*, Leonardo's *Virgin of the Rocks*, Chardin repetitions). These share composition, so 9×8 hashes and even global embeddings will match. Mitigations:
   - prefer candidates whose source record identifies the same object: the same Wikidata QID's P18 or P6108 IIIF manifest, the same museum accession number, or a Commons file categorised under that Wikidata item;
   - in the geometric check, a lower inlier ratio with a consistent global H can flag a "same composition, different painting" case for manual review in the existing `kalite_tara.py` HTML review page;
   - never auto-accept from WikiArt or Google Arts & Culture on pixels alone.
5. **Embedding (optional).** SSCD is purpose-built for copy detection, with a meaningful threshold. DINOv2 is a fallback. Both need PyTorch, and thresholds must be calibrated on the app's own data: existing Commons ↔ museum pairs as positives, other works by the same artist as hard negatives.
6. **The current dHash gate is not a quality check.** Blur, q30 JPEG and fading all pass, so every Q1 and Q2 quality test must run *in addition*.

### Gaps
- No peer-reviewed thresholds were found for perceptual hashes on artworks, or for DINOv2/SSCD on painting reproductions. The numbers above are from my own small experiment on 400 px thumbnails and should be recalibrated at working resolution.
- I could not fetch the OpenCV tutorial page directly (HTTP 403). Its parameter values come from search snippets of the official docs.
- No source was found quantifying how often autograph versions fool hash or embedding matching.

## Q4. Colour fidelity: museum scans with colour targets vs amateur photos

### Takeaway
Colour accuracy cannot be measured without a reference. The practical strategy is **source preference**: museum IIIF or open-access masters and Google Art Project captures over anonymous uploads. Then **relative checks**: flag candidates whose mean colour or white balance departs strongly from the consensus of several independent copies. FADGI gives the target precision of professional work: 4★ means mean ΔE2000 ≤ 2 and 90th percentile ≤ 4.

### Cited Findings
- FADGI 4★ for paintings: mean ΔE 2, 90th-percentile ΔE 4, white balance 2. For 3★: 3.5 / 7 / 4. OpenDICE uses a ColorChecker SG target by default. — [FADGI Config_materials2023](https://www.digitizationguidelines.gov/guidelines/OpenDICE/Config_materials2023.txt); [OpenDICE manual](https://www.digitizationguidelines.gov/guidelines/OpenDICE/OpenDICE_manual_v3.0.docx)
- Museums in the pipeline (Met, Cleveland, NGA, AIC, Rijksmuseum) are already used through open-access APIs and IIIF without keys, according to the project's own decision log. — `KARARLAR.md` line ~1369 (repo file)

### Inferences
- **Colour-checker detection.** OpenCV-contrib has an `mcc` module (ColorChecker detector). This is from memory and was not verified this session. A visible target in the frame usually means a raw capture shot (sometimes published uncropped by museums). Published, cropped masters normally have the target removed, so detecting a checker is of little use in ranking finished images. Prefer source metadata over pixel detection.
- **Consensus colour.** When ≥ 3 independent copies of a work exist (Commons, museum, GA&C), compute each copy's mean Lab and chroma after trimming. A candidate that is an outlier, for example ΔE of the mean > ~8 from the median, is likely cast, yellowed or a flash photo. That would extend the existing "renkleri kaymış" check.
- **Glare/flash heuristic.** Clusters of clipped highlights (L\* ≥ 97) not present in the reference copy indicate a gallery photo. Geometric verification (Q3) also exposes off-axis shots.

### Gaps
- No source was found comparing measured ΔE of museum releases vs Commons amateur photos at scale.
- The OpenCV `mcc` API was not verified in this session.

## Q5. Target resolution and format for iPhone 13 with pinch zoom, ~300 MB cache, 1,700–7,000 images

### Takeaway
Keep three tiers rather than storing everything big. Long side ~**4096 px** is a sensible ceiling for the on-demand "zoom" copy, as now:
- it fills a landscape iPhone 13 screen (2532 px) with ~1.6× zoom headroom before upsampling;
- it decodes to ~50–67 MB RGBA, safe for one or two at a time.

The persistent offline budget cannot hold big copies for thousands of works:
- 300 MB / 7,000 ≈ 43 KB per image, which is roughly what today's 400 px grid copies already cost (≈ 290 MB for 7,028);
- even 300 MB / 1,700 ≈ 176 KB is only about one 1280 px JPEG each.

So: precache the small tiers, and fetch the large tier lazily with LRU. AVIF (iOS 16+) and JPEG XL (iOS 17+) are supported, so they are viable for the 1280 tier. JPEG stays the safe universal choice and the one `sips` and Pillow produce trivially. Avoid serving originals above ~8k, and avoid `img.decode()` on huge files.

### Cited Findings
- AVIF support: iOS Safari 16.0+ full; desktop Safari 16.4+ full (16.1–16.3 partial). — [caniuse AVIF](https://caniuse.com/avif); [AppleInsider: Safari 16 for iOS 16 gains AVIF](https://forums.appleinsider.com/discussion/228875)
- JPEG XL arrived in Safari 17, on iOS, iPadOS and macOS. HEIC was added in Safari 17 too. Early betas had display bugs. — [WWDC23 "What's new in Safari"](https://developer.apple.com/videos/play/wwdc2023/10122); [The Register](https://www.theregister.com/2023/06/07/apple_safari_jpeg_xl/); [caniuse JXL](https://caniuse.com/jpeg-xl); [WebKit bug 259361](https://35989-bug-84245-attachments.webkit.org/show_bug.cgi?id=259361)
- iOS Safari canvas limits:
  - **per-canvas pixel cap**: 4096×4096 (16.7 MP) for about a decade, raised to 8192×8192 (67 MP) in iOS 18;
  - **total canvas memory cap**: reported variously as 224, 256, 384 or 448 MB depending on version and device.

  This is relevant to `keskin.js` and to palette extraction from large images. — [pqina: Canvas area exceeds the maximum limit](https://pqina.nl/blog/canvas-area-exceeds-the-maximum-limit/); [pqina: Total canvas memory](https://www.pqina.nl/blog/total-canvas-memory-use-exceeds-the-maximum-limit/); [lionpuro: canvas is finally usable on Safari](https://lionpuro-com.pages.dev/posts/canvas-is-finally-usable-on-safari); [WebKit bug 271002 (raise to 8192²)](https://lists.webkit.org/pipermail/webkit-unassigned/2024-March/1154963.html); [Apple forums 112218](https://developer.apple.com/forums/thread/112218)
- WebKit normally subsamples during decode when an image is displayed smaller than its natural size. A regression (293871@main) dropped `kCGImageSourceSubsampleFactor`. A 30000×23756 Starry Night JPEG then took ~3 GB (expected 200–400 MB) and could be jetsammed. Fixed in 301729@main on 2025-10-17. — [WebKit bug 300903](https://bugs.webkit.org/show_bug.cgi?id=300903)
- `HTMLImageElement.decode()` decodes at full size whether the image is visible or not. Over the memory limit, the WebContent process is killed: a page reload, not a JS error. — [WebKit bug 302801](https://bugs.webkit.org/show_bug.cgi?id=302801); [WebKit bug 268816](https://www2.webkit.org/show_bug.cgi?id=268816)
- Project evidence:
  - re-encoding the 1280 px set at q80 gave 703 → 393 MB (−44%) with no visible difference to the developer, but Emre chose maximum quality;
  - the 4096 tier uses `sips` q92, and copies under 1600 px are not uploaded as "devasa".

  — `KARARLAR.md` lines ~1358–1380 (repo file)

### Inferences
- **Arithmetic for the iPhone 13** (screen 1170×2532 physical px at 3×; the screen size is from the brief). Pixels needed to show the work without upsampling:

  | Viewing case | Long side needed |
  |---|---|
  | Portrait painting, full-screen in portrait | ~2532 px (height-bound) |
  | Landscape painting in portrait orientation | ~1170 px wide |
  | Landscape painting, phone rotated | ~2532 px |
  | Each 2× pinch | doubles the above: 5064 px for portrait paintings at 2× |

  - 4096 gives ~1.6× of real detail for full-height portrait works and ~3.5× for landscape works viewed upright.
  - 3000 gives ~1.2× and ~2.6×.
  - Beyond ~4096 the gain is only visible at deep zoom, and decoded memory grows quadratically (4096×4096×4 B ≈ 67 MB; 8192² ≈ 268 MB).
  - A 4096 ceiling is a good balance, provided the 4096 file has *real* 4096 detail (Q2).
- **Cache budget.** The ~300 MB cap in CLAUDE.md (the app now uses 700 MB plus IndexedDB for the devasa copies) cannot hold big copies offline for every work:

  | Images | Budget per image at 300 MB | Fits |
  |---|---|---|
  | 1,700 | ≈ 176 KB | ≈ one 1280 px q85–90 JPEG, roughly |
  | 7,000 | ≈ 43 KB | ≈ a 400 px thumbnail (measured average 42 KB) |

  Strategy:
  - precache 400 px for all works;
  - precache 1280 px only for the study pool or the unlocked artists;
  - devasa on demand with LRU, which is the current design.
- **Format.**
  - JPEG q85–92 (progressive or baseline) remains the compatibility-safe choice for every tier. Pillow can write progressive with `progressive=True`; mozjpeg compresses better.
  - AVIF or JXL for the 1280 tier would cut bytes noticeably while keeping quality. All iPhone 13-capable iOS versions in use today (16+) decode AVIF, and 17+ decode JXL.
  - Keep a JPEG fallback via `<picture>`/`type` or service-worker negotiation if older iOS matters.
  - `sips` reportedly writes HEIC but not AVIF; this is unverified. AVIF encoding would need `avifenc` or pillow-avif.
- **Memory hygiene.**
  - Never `decode()` the 4096 copy for neighbours.
  - Release the previous full-size image when swiping. Keep at most 1–2 decoded 4096 images.
  - Keep canvas operations (palette, sharpness) on downscaled bitmaps ≤ 4096², or ≤ 2048² to stay safe on iOS < 18.

### Gaps
- I found no authoritative Apple figure for the WebContent memory limit on an iPhone 13 (4 GB RAM) under iOS 18 or 26.
- I found no measured byte savings of AVIF/JXL vs JPEG on painting images from an authoritative source. A local test on 20–30 of the app's 1280 px files is needed.
- I did not verify which iOS versions the iPhone 13 receives (it shipped with iOS 15). Confirm that Emre's phone is on iOS ≥ 17 before relying on JXL.

## Q6. Is AI super-resolution (Real-ESRGAN etc.) acceptable as a fallback?

### Takeaway
Not as a silent replacement in a study app whose goal is learning to recognise an artist's hand. GAN and diffusion SR invents texture: fake brushwork, craquelure and over-sharpened flat areas, which are most visible exactly when zooming. It is acceptable only as an explicitly labelled, display-time "smoothing" option. It must never be stored as the "large copy" or used as evidence of quality, because it would also defeat the effective-resolution test.

### Cited Findings
- The Real-ESRGAN authors claim better artefact removal and texture restoration on real-world images. This is a self-reported benchmark. — [Wang et al., Real-ESRGAN, arXiv 2107.10833](https://arxiv.org/pdf/2107.10833)
- DeSRA (ICML 2023): GAN-SR models produce artefacts that can be visually worse than non-GAN SR. These are hard to fix by training on existing data, and real-world inputs have no ground truth. — [Xie et al., DeSRA, PMLR v202](https://proceedings.mlr.press/v202/xie23c/xie23c.pdf)
- A 2025 study: Real-ESRGAN "looks promising at first glance", but unintended artefacts become noticeable when zoomed in. — [arXiv 2510.13649](https://arxiv.org/pdf/2510.13649)
- Real-ESRGAN introduces artefacts while blur-prone baselines blur. This is a trade-off between failure modes. — [F2IDiff, arXiv 2512.24473](https://arxiv.org/pdf/2512.24473)
- Practitioner sources say Real-ESRGAN can over-sharpen flat areas into unnatural texture, that hallucination is most visible on stylised content, and that 2× models hallucinate less than 4×. These are weaker, non-peer-reviewed sources. — [theneuralbase tutorial](https://theneuralbase.com/stable-diffusion/learn/intermediate/real-esrgan-for-photos/); [budgetpixel](https://budgetpixel.com/models/real-esrgan)

### Inferences
- **Accuracy rule.** CLAUDE.md requires that works shown be truthful. Invented brushwork misrepresents the artist's hand, which is what Emre is training to recognise, so SR output should not replace real pixels.
- **If used at all:**
  - only 2× with a conservative (non-GAN or low-strength) model;
  - only where no real copy ≥ 1280 exists;
  - marked in the caption, e.g. "yapay büyütme";
  - excluded from `kalite_tara.py` comparisons and from the "devasa" tier.
- **Simpler alternative.** Bicubic or Lanczos display-time upsampling, which the browser already does on pinch-zoom, is honest: blurry but not false.

### Gaps
- I found no study specifically measuring SR hallucination on painting reproductions or its effect on attribution learning.
