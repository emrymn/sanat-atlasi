# KALİTE KONTROL — Q27978197 · Üç Çağ ve Ölüm (Die drei Lebensalter und der Tod) · Hans Baldung Grien

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M4) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 25 (C001–C025). A=10, B=10, C=2, D=2, E=1.
- **A düzeyi:** KHM birincil kaydı (künye/envanter/boyut/malzeme/salon/betim/provenance) + görsel inceleme (C016–C020).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). Üretimde 4 D/C-kanıt hatası yakalanıp düzeltildi (CS07→C004, DY05→C004, TK02→C011, TK04→C011).
- **E/D işareti:** C007/C010 "(tartışma)"; C024 "(belirsiz)" cümle içinde; dogrula belirsizlik denetimi temiz.
- **Yorum ayrımı:** C021 (Vanitas üçlüsü) ve C022 (ayna körlüğü) C; derslerde "(yorum)".

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (KHM ham HTML), K2/K3 (dewiki/frwiki wikitext), K4 (WD), K5 (Commons özgün) 14 Kasım 2026'da yeniden açıldı:
- Künye: "Die drei Lebensalter und der Tod"; um 1509/1510; Lindenholz; 48,2×32,8×2,4 (çerçeve 61,3×46×4,5); Inv. Gemäldegalerie 2636; Kabinett 16 ✓ (K1).
- Betim: kum saati / gençlik örtüsü / saklanan Knabe ✓ (K1). Provenance Thun/1803/1806 ✓ (K1/K2).
- dewiki: Dürer+Donauschule; üç yaş; aynı-kadın belirsiz; ayna Vergänglichkeit; çürüyen beden; Steckenpferd; Vanitas=Eitelkeit ✓ (K2).
- **İki ihtilaf D:** boyut 32,8↔32,5 (C007); figür kimliği (C010).
- **Görsel:** K5 vision köprüsüyle İNCELENDİ; dört figür + ayna/kum saati/örtü doğrulandı; çocuk nesne kimliği (ok/elma ↔ Steckenpferd) görselden kesin değil → gözlem/betim ayrımı (C018).

**Erişilemeyen/erişilmeyen:** Schütz 1996 (KHM Führer Nr.36 p.311); Tuschka the-artinspector.de 2020 (C024). en/it wiki sitelink yok → dewiki/frwiki kullanıldı.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı (bu eser).** CJK: 0.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 439 | 400–500 | 3 dk (aralık içinde) |
| Orta | 1304 | 1300–1600 | 10 dk (aralık içinde) |
| İleri | 2604 | 2600–3200 | 20 dk (aralık içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons özgün 1079×1613 (KHM credit) indirildi; **vision köprüsü transkripsiyonu ile genel görünüm incelendi.** Dört figür, el aynası, kum saati, örtü zinciri, arka plan yaprakları doğrulandı. **Sınır:** çözünürlük 1079px ile sınırlı (KHM yüksek çözünürlüğü indirilmedi); transkripsiyon lossy/untrusted; çocuk yanındaki nesne kimliği kesin değil; imza/yazıt görünmez. Görsel A iddiaları C016–C020. Görsel projeye kopyalanmadı; geçici .qwen/tmp/parti2/img/. **GZ soruları TASLAK değil (görsel incelendi).** İnsan editör yüksek çözünürlük teyidi önerilir.

## 6. İnsan incelemesi gerektiren noktalar

1. **Figür kimliği (C010, D):** aynı kadın mı farklı kişiler mi; KHM Knabe tanımı kısmen daraltır ama kapatmaz.
2. **Boyut (C007, D):** 32,8 ↔ 32,5.
3. **Tarih hassasiyeti:** um 1509/1510 ↔ data çıplak 1509; "y. 1509/1510" önerisi.
4. **Çocuk nesneleri (C013/C018):** Steckenpferd (dewiki) ↔ transkripsiyon ok/elma; yüksek çözünürlük teyidi.
5. **Ölüm tasviri (C012, B yorum):** çürüyen beden ↔ iskelet/tırpan; dewiki aktarımı.
6. Felsefi yorumlar (İleri §7: Kant yücelik, Benjamin aura, tiksinti estetiği) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Bu eserde birincil KHM kaydı AÇILDI (Parti 1 JS-kabuğu sorunu yok) ve görsel İNCELENDİ → kanıt konumu güçlü; figür kimliği/boyut ihtilafları ve çözünürlük sınırı insan teyidi gerektirir.**
