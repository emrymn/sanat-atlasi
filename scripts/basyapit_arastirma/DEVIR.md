# İş 189b · Yeni başyapıtlar: yakın okuma yazımı — devir

Bu belge, işi başka bir Claude oturumunda (başka hesap) sürdürmek içindir. Önceki sohbet görünmez; bilmen gereken her şey burada.

## Durum

- 110 yeni başyapıt seçildi (`secim.json`, 11 parti × 10). Her eserin araştırması bitti: `eserler/<QID>/ARASTIRMA.json`
  (kaynak metinden birebir alıntıya bağlı Türkçe iddialar; `dogrula.py` hepsini geçiriyor; Gemini ile anlam denetimi yapıldı).
- Yakın okumalar parti parti yazılıyor: `okumalar/parti_NN.json` → `birlestir.py` → `data/basyapitlar.json` +
  `data/eser_ayrintilari.json`. **Bitti: parti 1 (10 eser), parti 2 (9 eser), parti 3 (10 eser), parti 4 (10 eser), parti 5 (10 eser), parti 6 (10 eser), parti 7 (10 eser).** Kalan: parti 8–11 (40 eser). Son sürüm 1.83.8; toplam 224 başyapıt (ek: Dürer Q351300).
- **Q351300 Dürer · Âdem ile Havva yazıldı (1.83.4).** Görsel, Emre'nin verdiği iki Prado paneli yan yana birleştirilerek
  yapıldı (`gorsel_ek/`, ad `78e0e776ae7bbef8`); gravür bu kayıttan `eser_duzeltmeleri.json · gorsel_cikar` ile çıkarıldı.
  1280'lik ve büyük kopya R2'ye **Mac'te** yüklenmeli: `python3 scripts/basyapit_arastirma/r2_ek_yukle.py` (o zamana dek 400'lük görünür).
  Başka bir eserin görseli yanlışsa aynı yol: görseli `gorsel_ek/{b,d}/<ad>.jpg` + `gorseller/k/<ad>.jpg`, `yerel_gorseller.json`,
  `gorsel_oranlari.json`, gerekiyorsa `gorsel_cikar`.
- **Her partide görsel–eser uyumunu kontrol et:** ızgaralı görsele bakınca araştırmanın anlattığı eser mi (tarih, teknik,
  versiyon) diye sor. Uymuyorsa atla ve buraya yaz.
- `secim.json`'daki `muze` bazen eski (ör. Alba Meryemi: Hermitage yazıyor, eser Washington'da): müzeyi ARASTIRMA künyesinden al.
- İnce araştırmalı eserlerde (Wikidata'nın 'betimlenir' satırlarından ibaret; ör. Rubens · Üç Güzeller) hikâye ve anlam için `data/ikonografi.json` konu metni kullanılabilir (yalnız resimde görülenle uyuşanı). Seri eserlerde (ör. Uccello · San Romano) görselin hangi panel olduğuna bak; başka panele ait iddiaları yazma.
- Nokta sayısı en çok 6 (denetle 7'yi hata sayar).
- `denetle.py` cümleyi büyük harfle başlayan sonraki cümleye göre sayar: rakamla ya da ":" sonrası küçük harfle başlayan cümle sayılmaz.
- Dal: `claude/sharp-goodall-rxd1wk`. Uygulama kodu değişmez; yalnız veri, yama sürümü, KARARLAR notu.

## Bir parti nasıl yapılır (parti N)

1. **Araştırmayı oku.** Partinin her eseri için `eserler/<QID>/ARASTIRMA.json`: künye, iddialar (bölüm: hikaye, gorunen,
   kompozisyon, anlam, onem; `ihtiyat: true` olanlar "muhtemelen / -e göre / düşünülür" ile yazılmalı), `celiskiler`,
   `bulunamadi`. Hızlı döküm:
   ```bash
   python3 -c "import json,sys;d=json.load(open(sys.argv[1]));print({k:v.get('deger') for k,v in d['kunye'].items()});[print(c['id'],c['bolum'],'İ' if c['ihtiyat'] else '',c['iddia']) for c in d['iddialar']]" scripts/basyapit_arastirma/eserler/Q500951/ARASTIRMA.json
   ```
2. **Görselleri indir ve bak.** `python3 scripts/basyapit_arastirma/gorsel.py indir N` → her eserin ızgaralı 1280'liğine
   (`/tmp/by/g/<QID>.jpg`) Read ile bak, 4–6 ayrıntı noktası seç (kurallar: `scripts/ayrinti/TALIMAT.md` §3–4).
   Bir ayrıntının yerini bulamazsan: `gorsel.py yakin <QID> x0 y0 x1 y1`.
3. **Yaz.** `okumalar/parti_NN.json` (biçim için `okumalar/parti_01.json`'u örnek al). Her kayıt:
   `anahtar, sanatci, baslik, ozgun (özgün/İngilizce ad), tarih, muze, ozet (18–28 kelime, tek cümle),
   bolumler` (tam olarak dört: "Ne görüyoruz?", "Kompozisyon, ışık ve renk", "Anlam ve semboller", "Neden önemli?";
   her biri 45–65 kelime), `bak` (3 madde, 12–20 kelime), `noktalar` (4–6; `ad, x, y, w, h, metin`; metin 2–3 cümle, 60–420 karakter).
4. **Doğrula.** `python3 scripts/basyapit_arastirma/gorsel.py kirp scripts/basyapit_arastirma/okumalar/parti_NN.json`
   → her `/tmp/by/k/<QID>.jpg` kontak sayfasına bak: ayrıntı kutunun tamamen içinde mi, doğru şey mi? Düzelt, yeniden kırp.
5. **Kaynak denetimi (kendin, birleştirmeden önce):** yazdığın her olguyu iddialarda ara. Bellekten gelen ama iddialarda olmayan
   isim, tarih, sebep, amaç **çıkar** (parti 1'de yakalananlar: "şehrini kuşatan", "kesik başın konacağı bez", "IV. Carlos",
   bir sanatçının başka tablolarına yapılan gönderme; parti 3'te: "defne çelenkli", "sekiz yıldızlı", yanlış oyma sahnesi adı). Resimde gözle görülen şeyler (renk, duruş, okunabilen yazı) serbesttir.
   Metinde kaynak adı geçmesin ("Vikipedi'ye göre" yazma; "… olarak yorumlanır" de).
6. **Birleştir ve test et:**
   ```bash
   python3 scripts/basyapit_arastirma/birlestir.py scripts/basyapit_arastirma/okumalar/parti_NN.json
   python3 scripts/ayrinti/denetle.py          # 0 hata
   npm run test:unit                           # hepsi geçmeli
   ```
   Uçtan uca (isteğe bağlı): `node_modules/@playwright/test` yoksa köprü paket kur (koordinasyon/DEVIR.md §3), sonra
   `npx playwright test tests/e2e/basyapit_sayfa.spec.js tests/e2e/ayrinti.spec.js tests/e2e/galeri_sayfalari.spec.js --trace off`.
7. **Sürüm:** yama sürümünü bir artır (`js/surum.js`, `sw.js`, `tests/unit/paket8.test.mjs` iki yer, `tests/e2e/paket8.spec.js`
   iki `toBe`). Yenilikler'e ekleme.
8. **KARARLAR.md**'ye "İş 189b · parti N" kısa notu (eserler, nokta sayısı, düzeltilen kutular, emin olunmayanlar), commit, push.
   Commit mesajı sonuna oturumun ortak yazar satırlarını ekle.

## Kurallar (değişmez)

- Olgu yalnız o eserin `ARASTIRMA.json` iddialarından. İhtiyatlı iddia ihtiyatlı yazılır. Emin olmadığını yazma.
- `bulunamadi`'da "hikaye: kaynakta … yok" yazan eserlerde hikâyeyi konu sayfasından alabilirsin: `data/ikonografi.json` →
  `konular[id == secim.json'daki konu].hikaye` (o metin de denetlenmiştir), ama yalnız resimde görülenle uyuşanı.
- `tools/` ve `data/sanatcilar.json` içeriğine dokunma. Kredi azalırsa yarım parti bırakma: bitirdiğin eserlerle birleştir,
  bu belgenin "Durum"unu güncelle.

## Sonraki oturum için hazır istem

> Sanat Atlası deposunda (`emrymn/sanat-atlasi`, dal `claude/sharp-goodall-rxd1wk`) İş 189b'ye devam et:
> `scripts/basyapit_arastirma/DEVIR.md`'yi oku ve "Durum"daki sıradaki partiyi (parti 8) aynı yolla bitir. Sonra DEVIR.md'nin
> "Durum"unu güncelle, commit ve push et. Kredin yeterse sıradaki partiye geç.
