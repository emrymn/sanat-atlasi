# KALİTE KONTROL — Q979440 · Müjde (Triptik) · Simone Martini ve Lippo Memmi

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M1) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 33 (C001–C033). A=20 (birincil Uffizi föyü + doğrudan görsel), B=10, D=2, E=1.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU. D/E kanıt yok.
- **Kaynak zinciri:** K1 Uffizi resmî kaydı (birincil, ham HTML föy doğrulandı) + K2 enwiki (B) + K3 WD (yardımcı) + K4 Commons (görsel A).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (uffizi.it ham HTML), K2 (enwiki REST HTML), K3 (WD), K4 (Commons 1400px + 2 kırpım) 14 Kasım 2026'da yeniden açıldı:
- İmza yazıtı SYMON MARTINI ET LIPPUS MEMMIS ... MCCCXXXIII ✓ (K1 transkripsiyon).
- 184×168 cm; tempera/altın; Inv. 1890 nos. 451–453; salon A5 ✓ (K1 gömülü JSON).
- Siena Katedrali transepti St. Ansanus sunağı ✓; 1799 Leopold/Giordano takası ✓ (K2).
- Dört sunaklık döngü (Ambrogio 1342, Pietro 1342, Bulgarini 1351) + Maestà taç ✓ (K2).
- AVE GRATIA PLENA DOMINUS TECUM kabartma yazıt ✓ (K1 + kırpımda görsel okuma).
- Zeytin dalı ✓ (K2 + kırpım: yeşil yapraklı dal; ilk transkripsiyonun "lily branch" tahmini çürütüldü).
- Tondolar Yeremya/Hezekiel/Yeşaya/Daniel ✓ (K1); Ansanus sancak ✓ (K1); "Judith" yazıtı hatalı ✓ (K1).
- İşbölümü hipotezi ve Maxima/Margaret belirsizliği D olarak işaretli ✓.
- **Sınır:** mandorla melek sayısı görselden sayılamadı (K2 "sekiz" → B); tondo/tabana yazıt tam transkripsiyonu yok; bütün triptik boyutu uzlaşmaz (E).

**Erişilemeyen/erişilmeyen:** K2 bibliyografyası (Cricco & Di Teodoro 2004; Fossi 2004; Smarthistory 2011) açılmadı. İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.**

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 427 | 400–500 | 3 dk ✓ |
| Orta | 1309 | 1300–1600 | 10 dk ✓ |
| İleri | 2597 | 2600–3200 | 20 dk ≈ (3 kelime alt; standart §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons 1400px (kaynak 1920×1667) tam kare + iki kırpım (üst orta yazıt/güvercin; Gabriel) vision köprüsüyle incelendi (PD; geçici `.qwen/tmp/parti1/Q979440/`). Altın zemin, bükülü sütunlar, tondolar, yan azizler, zambak vazosu, güvercin mandorlası, kabartma AVE GRATIA PLENA, yeşil yapraklı dal doğrulandı. İlk tam kare transkripsiyonunun iki tahmini (lily branch; SPIRITUS SANCTUS) kırpımla çürütüldü ve KANIT §3'e kaydedildi. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. Bütün triptik boyutu: resmî 184×168 (orta) ↔ WD 265×305/48/158 uzlaşmazlığı (C006, E) — birincil envanter defteri teyidi.
2. Kadın aziz kimliği (Maxima/Margaret) ve işbölümü hipotezi (C014/C015, D) — uzman editör.
3. K2 bibliyografya metinleri (Cricco & Di Teodoro; Fossi; Smarthistory) teyidi.
4. Mandorla melek sayısı ve tondo yazıtları tam transkripsiyonu (yüksek çözünürlük).
5. Felsefi yorumlar (İleri §7: performatif yazıt, aura, Kantçı ürperme) kurum dışı; editör onayı şart.
6. data başlığı/boyut/envanter önerileri KANIT §5'te; onaya sunulur, data/ dokunulmadı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.