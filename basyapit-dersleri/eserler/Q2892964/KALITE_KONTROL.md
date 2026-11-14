# KALİTE KONTROL — Q2892964 · Tefeci ve Karısı (Le prêteur et sa femme) · Quentin Metsys

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M4) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 37 (C001–C037). A=16, B=15, C=2, D=3, E=1.
- **A düzeyi:** Louvre birincil kaydı (künye/envanter/boyut/teknik/salon/yazıt/provenance/edinim/arşiv atıfları) + görsel inceleme (C026–C029).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). D/E kanıt yok. Nüsha (C012), boyut (C024), salon (C030) D yalnız AU/ders tartışması; RKD/Schwartz (C033) E yalnız AU/ders belirsizlik.
- **E/D işareti:** C012/C024/C030 "(tartışma)"; C033 "(belirsiz)" ile cümle içinde işaretli; dogrula belirsizlik denetimi temiz.
- **Yorum ayrımı:** C025 (WGA otoportre) ve C031 (ahlaki okuma) C; derslerde "(yorum)" ile açık.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (Louvre ham HTML), K2/K3 (wikitext), K4 (WGA HTML), K5 (WD EntityData), K6 (Commons özgün+thumb) 14 Kasım 2026'da yeniden açıldı:
- Künye: "Le prêteur et sa femme" + 3 alternatif başlık; 1514; huile sur bois; 70,5×67 (aksesuar 96×93,3); INV 1444 ; MR 821; Salle 814 ✓ (K1).
- Yazıt: "inscription biblique sur le cadre lisible au XVIIe s." + 1806 Lévitique anısı ✓ (K1); tam metin YOK → uydurulmadı.
- Provenance: Stevens/Duarte "très probablement" ×2; Rubens/Van der Geest "peut-être bien distinct"; Dogaer 1971/Samuel 1976/Huygens 1676/Levy ✓ (K1).
- enwiki: Antwerp burgher + Engizisyon göçü + Reymerswaele + Van Haecht/Van der Geest ✓ (K2). itwiki: convex ayna + Belting ✓ (K3). WGA: tür resmi/natürmort/otoportre yorumu/71×68 ✓ (K4).
- **Üç ihtilaf D olarak açık:** nüsha (C012), boyut (C024), salon (C030).
- **Görsel:** K6 vision köprüsüyle İNCELENDİ (genel + ayna/kitap/sağ kırpma). WGA otoportre iddiası görselden doğrulanamadı → C025 C.

**Erişilemeyen/erişilmeyen:** RKD images/61578; Gary Schwartz PDF; monografi metinleri (Silver/Moxey/Muller/Belting/Foucart/Sulzberger/Revel/2024 Burlington) — kaynakçada anıldı (C032/C033).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı (bu eser).** CJK taraması: 0.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 500 | 400–500 | 3 dk (aralık içinde) |
| Orta | 1325 | 1300–1600 | 10 dk (aralık içinde) |
| İleri | 2656 | 2600–3200 | 20 dk (aralık içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons özgün 5786×6090 (Shonagon 2025-09-21) + 1920px thumb indirildi; **vision köprüsü transkripsiyonu + Pillow kırpma ile incelendi** (genel; ayna x270–570/y590–860; kitap x520–900/y630–970; sağ x820–1000/y150–620). İncelenen bölgeler KANIT §3'te. **Sınır:** transkripsiyon lossy/untrusted; Gotik yazı + sikke lejantı okunamadı; aynadaki figür kimliği doğrulanamadı (C025 C); çerçeve yazıtı görselde yok (C007). Görsel A iddiaları C026–C029 (inceleme + lisans). Görsel projeye kopyalanmadı; geçici .qwen/tmp/parti2/img/. **Parti 1'den fark: bu eserde görsel gerçekten incelendi; GZ soruları TASLAK değil.** İnsan editör görsel teyidi yine önerilir (transkripsiyon sınırı).

## 6. İnsan incelemesi gerektiren noktalar

1. **Nüsha ayrımı (C012, D):** Louvre paneli ↔ Rubens/Van der Geest nüshaları; RKD/Schwartz belgesi (C033 E) — uzman editör.
2. **Boyut (C024, D):** 70,5×67 ↔ 71×68.
3. **Salon (C030, D):** 814 ↔ WD 811 + Abu Dhabi; Louvre oda uyarısı.
4. **Aynadaki figür (C025, C):** WGA otoportre yorumu — görsel teyit + uzman.
5. **Çerçeve yazıtı (C007/C008):** varlığı belgeli, metni yok; uydurma Latince metin eklenmemeli.
6. Felsefi yorumlar (İleri §7: Kant/Benjamin ödünç çerçeve) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Bu eserde birincil Louvre kaydı AÇILDI ve görsel İNCELENDİ → kanıt konumu Parti 1'in erişilemeyen-katalog eserlerinden güçlüdür; yine de nüsha/boyut/salon ihtilafları ve transkripsiyon sınırı insan teyidi gerektirir.**
