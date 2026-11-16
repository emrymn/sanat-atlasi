# KALİTE KONTROL — Q17277950 · Kâğıt Oynayanlar (Les Joueurs de cartes) · Paul Cézanne

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Hedef versiyon:** Courtauld (Q17277953 / FWN 686, 60×73, P.1932.SC.57, 1892–1896). Q17277950 = SERİ maddesi.
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-araştırma agent brief'i (`.qwen/tmp/parti5/Q17277950-brief.md`); ham cache `.qwen/tmp/parti5/Q17277950-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q17277950 için temiz (0 hata/0 uyarı)**.
- **Toplam iddia:** 48 (C001–C048). **A=12, B=17, C=2, D=11, E=6.**
- **A düzeyi (birincil):** Courtauld künye/label/provenance/sergi (C002/C003/C004/C021/C022/C027), Met künye/figür/teknik (C007/C008), Orsay künye/provenance (C011/C012), seri sayısı (C001), kamu malı (C026).
- **B düzeyi (ikincil/kaynak zinciri):** modeller/Paulet (C005/C006), teknik analiz/sıralama (C009/C010), Schapiro/Murphy (C013/C014), şişe/simetri (C015), tür resmi yeniden işleme (C016/C017/C047), "souvenirs"/mekân/teknik (C018/C019/C020), sergi baskı/hırsızlık (C023/C024), "le père Alexandre" (C029), Barnes alımlama/eskizler (C048).
- **C (yorum):** Katar satışı tahmini fiyat (C025), Kübizm "prelude" (C028) — "(yorum)" işaretli, quiz'e girmez.
- **D (tartışma):** C031–C041 (11 ihtilaf) — "(tartışma)" işaretli, quiz'e girmez.
- **E (belirsiz):** C030/C042/C043/C044/C045/C046 — "(belirsiz)" işaretli, quiz'e girmez.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU (C/D/E dahil, serbest). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok); dogrula totoloji kontrolü temiz.
- **GZ TASLAK:** görsel incelenmedi → gen.py `gz_taslak` otomatik uyguladı (`incelenen_bolgeler=[]`).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da yeniden açılıp iddialarla karşılaştırıldı (taslağı yeniden okumak değil):
- **S9 Courtauld canlı (200):** "The Card Players", 1892-1896, oil on canvas, 60×73 cm, P.1932.SC.57, Samuel Courtauld gift 1932, On display; label "five paintings"/"two men seated across a table"/"Farm workers from the estate of Cézanne's father"/"timeless, monumental and resolutely Provençal"; provenance Cassirer→Elias→Stang→Gold→Courtauld (March 1929); sergi Courtauld 21/10/2010-16/01/2011 + Met 07/02/2011-08/05/2011; görsel CC BY-NC 4.0. ✓
- **S7 FWN 686 canlı (200):** 1891–96; Rewald 713/Venturi 557/Rivière/Cooper/Gowing; 60×73; Vollard A 3517/B 3368; keywords Paulin Paulet + unidentified sitter + bottle(s); provenance Vollard→(Elias?)→Stang→Gold→Courtauld; sergi 2010–11 no.13. ✓ (D04/D05 teyit)
- **S8 FWN 684 canlı (200):** 1893–96; 47×56.5; Vollard A 3338 "petite bouteille noire" 46×55; RF 1969; provenance Vollard→Cochin→Durand-Ruel→Camondo (1907/1908)→Louvre 1911→Jeu de Paume 1947-1986→Orsay 1986; 1961 Aix no.12; sergi no.12. ✓ (D03/D06 teyit)
- **S10 Met Wayback 2024-08-11 (200):** 1890–92, 65.4×81.9, 61.101.1, Clark bequest 1960, Gallery 826; 4 figür + 4 pipo; Paulet 5 frank; "may have posed"; Rivière "le père Alexandre"; X-ray/IR "probably the first essay"/Met precedes Barnes; Léontine Paulet; "souvenirs of the museums"; Gasquet kitchen/Athanassoglou-Kallmyer tavern; "unconventional" (Burnstock 2010); Le Nain fig.6; provenance Vollard→Bernheim-Jeune→Knoedler→Clark; Open Access. ✓
- **S11 POP Joconde canlı (200):** RF 1969; peinture à l'huile/toile; 47.5 H/57 L; "1890 vers ; 1895 ET"; sujet bouteille/fumeur/pipe; Vollard/Cochin/Durand-Ruel/Camondo; dépôt Orsay 1986; VENTURI 558. ✓
- **S1/S2 WD (200):** Q17277950 P31=Q15727816 (series), P195=Q734266 (Courtauld), P18=Courtauld dosyası, P2048/49=47.5×57 (itwiki/hewiki), P2635=5; Q17277953 P179/P361=Q17277950, P2048/49=60×73, P217=P.1932.SC.57, P528=FWN 686. → **D01 kimlik karışıklığı bağımsız teyit.** ✓
- **S4/S5/S6 wikitext (200):** seri/Barnes/özel/Schapiro/Murphy hırsızlık/Katar/2010–11 sergi; enwiki Met sergi ref'i `localhost:5000` bozuk (N08, kullanılmadı). ✓

**Erişilemeyen:** Art UK (S16, 403 + Wayback timeout); Barnes/Katar birincil katalog URL'si yok; Orsay müze nesne sayfası URL'si yok (Orsay birincil kanıtı S11+S8). Kitap/monografi metinleri erişilmedi (C045); DOI/JSTOR doğrulanmadı.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12, venv-dogrula): **Q17277950 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şemaya uygun; 12 bölüm eşlemesi tam; iddia/kaynak kimlikleri tutarlı; sayım satırı (48) DERS.json ile eşleşiyor; quiz kanıtları A/B; D/E belirsizlik işaretli. **CJK: 0.**
**Not:** dogrula genel çıktısı (15 hata/98 uyarı) eşzamanlı parti5 batch'indeki ÖTEKİ eserlere aittir (Q17026577, Q227494, Q3793426, Q471379, Q698487, Q890678); Q17277950 bu sayıya katkı vermez.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 413 | 400–500 | 3 dk |
| Orta | 1378 | 1300–1600 | 10 dk |
| İleri | 2641 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (dogrula yakın-tekrar ve seviyeler-arası tekrar kontrolleri temiz). İleri düzey gerçekten daha derin: yöntem/QID ontolojisi, otoriteler arası tarih/provenance ihtilafı, sıralama hipotezi, estetik yorum (açıkça C), ihtilaf envanteri.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (9 dosya); **vision kotası ana oturumda → İNCELENMEDİ (C042 E).** app görseli "Paul Cézanne, Les joueurs de carte (1892-95).jpg" 1683×1385, PD-Art, credit FWN 686 → Courtauld (Q17277953); yerel oran 1.216 ≈ 73/60. Kompozisyon S9/S7/S8/S10 (A) + S4/S6 (B) **metninden**; "kaynakların betimlediği" ibaresi kullanıldı. **GZ TASLAK.** Courtauld'un kendi fotoğrafı CC BY-NC 4.0 (non-commercial; akademik <3000 baskı istisnası); app Commons PD-Art dosyasını kullanır, eser kamu malı. Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU** (özellikle N02/E09 "şişe yok" self-note, C046).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C042, E):** incelenemedi; GZ TASLAK; ana oturum vision teyidi + insan editör zorunlu.
2. **N02/E09 "şişe yok" (C046):** basyapitlar.json self-note görselde şişe olmadığını söylüyor; FWN/Courtauld/enwiki şişe der. Görsel teyidi gerekli; versiyon karışması olasılığı değerlendirilmeli.
3. **QID kimliği (C031/D01, N01):** Q17277950 SERİ; app Courtauld versiyonu gibi kullanıyor. WD seri maddesi Courtauld koleksiyonu + Orsay boyutu (47.5×57) ile karışık. data/WD düzeltmesi insan onayına sunulur (bu ders data'yı değiştirmez).
4. **N03/D10 (C040):** yuruyus.json Met'i "beş figürlü" diyor (yanlış: Met 4, Barnes 5); iç çelişki ("Dört Provenceli"). Düzeltme önerisi.
5. **N04:** aynı QID altında Courtauld + Met görselleri karışık (eser_ayrintilari Courtauld, yuruyus Met). Versiyon tutarlılığı kararı.
6. **11 ihtilaf (D):** boyut (Orsay 4 varyant, Barnes 2), tarih (Courtauld/Orsay otoriteleri), provenance ilk sahip (Cassirer↔Vollard, Elias "?"), sıralama, Met sergi tarihi (7↔9 Şubat), Le Nain atfı, itwiki boyut hatası.
7. **Birincil sınır:** Barnes/Katar birincil katalog URL'si yok (boyut/tarih enwiki B + Met fig.1 dolaylı); Orsay müze nesne sayfası yok (POP+FWN ile kanıtlandı).
8. **Literatür (C045, E):** kitap/monografi metinleri erişilmedi; yalnız bibliyografyada anıldı. DOI/JSTOR doğrulanmadı.
9. **Felsefi/estetik yorumlar (İleri §7, C028):** "human still life", Kübizm prelude, teleolojik okuma riski — kurum dışı yorum; editör onayı.
10. **Katar satışı (C025/C044):** tahmini 250–320 M$, kesin değil; yorum/aktarım.

## 7. Yayına adaylık

Otomatik kısım sağlandı (Denetim A + B, şema, kelime, quiz A/B, CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Courtauld/FWN 686+684/Met/Joconde AÇILDI (A); görsel İNCELENMEDİ (E); 11 D + 6 E açık; data/ uyuşmazlıkları (N01–N08) insan onayına sunuldu, data DEĞİŞTİRİLMEDİ.** Görsel teyidi + QID/versiyon kararı + haricî editör onayı olmadan yayımlanmaz.