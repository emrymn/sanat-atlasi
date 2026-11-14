# KALİTE KONTROL — Q2629559 · Salıncak (The Swing / L'Escarpolette)

- Tarih: 2026-11-14 · Parti: `.qwen/tmp/parti3` · Durum: **İnsan incelemesi bekliyor**
- Kapsam: KANIT_DOSYASI.md + DERS_BASLANGIC/ORTA/ILERI.md + DERS.json + SORULAR.json + uret-Q2629559.py
- Salt-okunur korundu: `data/`, uygulama kodu, `main`, Vermeer pilotu (Q167605), öteki eserler. Commit/push/deploy YOK.

## 1. Denetim A — İddia-kaynak eşleştirmesi

- 68 iddia (A=38, B=9, C=3, D=10, E=8) KANIT_DOSYASI.md §2'de `**C###**` biçiminde tanımlı; DERS.json `iddialar` ile birebir eşleşiyor (dogrula: mükerrer/eksik yok).
- Üç dersteki bütün olgusal cümleler [C###] ile bağlandı. D iddiaları "(tartışma)", E iddiaları "(belirsiz)", C yorumları "(yorum)" ile işaretli (post-pass idempotent).
- C düzeyi yorumlar (C066/C067/C068) olgu olarak sunulmadı; §7 açıkça "yorum" etiketli. A/B iddialar birincil müze kaydı veya atıf zincirine dayanır.
- Quiz doğru cevapları yalnız A/B: CS10, DY5, GZ5, TK5 kanıtları A/B (dogrula `kanit_seviye_kontrol` temiz). AU5 serbest (D/E dahil). D/E'den kesin cevaplı soru üretilmedi.
- Yanlış seçenek gerekçeleri bağlamsal (totoloji yok); her CS'de 3 yanlış gerekçesi tam. `cs_gerekce_iyileştir` totoloji taraması temiz.
- Desteklenmeyen data iddiaları (yunus, köpek sembolizmi, ayakkabı yönü, spot ışığı, "ödünç verilmez", "başka bir Salıncak") kesin anlatıya alınmadı; C049/C050/C060 ile D/E olarak raporlandı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş (CANLI)

2026-11-14'te birincil ve ikincil kaynaklar yeniden açıldı (recheck dosyaları: `.qwen/tmp/parti3/Q2629559-recheck-*`):

| Kaynak | Canlı sonuç | Doğrulanan |
|---|---|---|
| S5 eMuseumPlus (objectId=65364) | 200 | about 1767-1768; Oil on canvas; 81×64.2 / 81.8×64.8; P430; Location: Study; genesis; older man no longer priest; barking dog; Falconet; Rococo; Launay 1782 |
| S6 Provenance / S7 Marks / S8 Further Reading | 200 (yeni jsessionid) | Pressigny→possibly Saint-Marc→Morny→01 June 1865 no.98→Hertford; 'fr…..rd' Signed indistinctly; Ingamells 1985 pp.161-165 + 7 künye |
| S13 The Commission | 200 | October 1767; already at work; long been assumed Saint-Julien; tax farmer; might well have informed; Salon 1767; Saint Geneviève; mal des ardents; Saint-Roch; petite maison; Carmontelle CAR 446 |
| S14 The Painting | 200 | overgrown garden + fountain; Boucher swirling diagonals pink/blue-green; P418; Menacing Cupid/Falconet/Pompadour/Salon 1757; Musical Contest P471; Blind Man's Buff/See-Saw; Isle of Love/Gulbenkian; Progress of Love/du Barry/Louveciennes/Frick; Watteau; English-style garden; du Barry 1768 |
| S15 Fashion | 200 | Bergère willow/chip/straw/silk; grey silk doublet blue lining; tricorn aloft; bag wig/1782; cuckolded husband?; soft shapeless hat; Louvre 1859; erotic frisson ankle/foot/shoes; intimate interior; love triangle; engageants/echelles; Jacqui Ansell |
| S17 Conserving | 200 | August–November 2021; 100+ years; yellowed varnish; onsite; microscope/X-radiography; trustees cleaning windows; Martin Wyld; natural resin; Manchester Square; whites/pinks; shimmering blue; underdrawing; pentimenti knee/petticoat/right shoulder; Bank of America |
| S10 Wayback 2020-08-14 | 200 | c. 1767-1768; Oval Drawing Room; pink silk; elderly husband right/young lover left; slipper fly off; symbolic offer of hat; FixingFrago 2019; Yuriko Jackall; eight masterpieces; Five paintings |
| S19 Art UK Wayback 2025-08-09 | 200 | 1767; oil on canvas; H81×W64.2; P430; Hertford 1865/Lady Wallace 1897; erotic licence/visionary nature; impudent reference church omitted; elderly seated admirer; CC BY-NC-ND |
| S3 enwiki / S4 itwiki | 200 | About 1767–68; little evidence; Marie-François-David; guillotine 1794; possibly Saint-Marc; attributed to workshop; 62.3; believed to reference; T07952; Ingamells 1989 ISBN; two putti; outstretched left foot; bergère; itwiki marito/luce sinistra/quintessenza/Pulvirenti |

- WD cache'ten bağımsuz çıkarım: P571=1767 (P1319=1761, P1326=1768, P1480=circa); P88=Q126119708 (P1480=allegedly, REFERANSIZ); P135 blog ref; P6216 PD; P973+P1065 Wayback; P180 refsiz; P1476 başlıklar. Brief ile uyumlu.
- Erişilemeyenler dürüstçe E: S9 (404→Wayback), S18 (403→Wayback), S21 Khan (Client Challenge), S22 Collé (önizleme yok), kitaplar (kaynakçada anıldı, metne erişilmedi). Uydurma bibliyografya/URL/envanter YOK.
- Görsel İNCELENMEDİ (vision kotası ana oturumda); Denetim B görsel piksel teyidi İÇERMEZ. Bu sınır §4'te.

## 3. Şema ve yapısal doğrulama (dogrula.py)

- `.qwen/tmp/venv-dogrula/bin/python basyapit-dersleri/dogrula.py` → Q2629559 için **0 HATA, 0 UYARI**.
- jsonschema Draft2020-12 katmanı AKTİF; DERS.json + SORULAR.json şema temiz.
- Çapraz tutarlılık: iddia/kaynak kimlikleri tam; mükerrer yok; quiz A/B kuralı temiz; D/E belirsizlik işareti temiz; 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor" (insan_onayi "Bekliyor" ile uyumlu).
- Kelime tutarlılığı: DERS.json `kelime_sayisi` ↔ ölçülen birebir (post-pass build'den önce çalışır).
- Etiketli olgu tespitçisi (heuristic): Q2629559'da etiketsiz olgu adayı YOK (envanter ondalık/y. kısaltma kaynaklı 3 yanlış-pozitif "yaklaşık" ve etik eklenerek giderildi).
- Yakın tekrar / seviyeler arası birebir cümle: Q2629559'da YOK.
- CJK taraması: Q2629559 dosyalarında **0** CJK karakteri.
- NOT: dogrula genel çıkış kodu 1'dir; bunun nedeni BU ESER DEĞİL, öteki eserlerin önceden var olan sorunlarıdır (Q18167078/Q3399440 eksik DERS/SORULAR.json; Q4693305 kelime tutarsızlığı). Bu dosyalara DOKUNULMADI (kapsam dışı).

## 4. Kelime tablosu

| Seviye | Dosya | Kelime | Hedef | Süre | Durum |
|---|---|---|---|---|---|
| Başlangıç | DERS_BASLANGIC.md | 424 | 400–500 | 3 dk ✓ |
| Orta | DERS_ORTA.md | 1337 | 1300–1600 | 10 dk ✓ |
| İleri | DERS_ILERI.md | 2724 | 2600–3200 | 20 dk ✓ |

Dolgu/tekrar yok; ileri düzey gerçekten daha derin (kaynak eleştirisi, D/E envanteri, metodoloji, epistemik konservasyon, felsefi yorum). Kanıt yetersizse kısa bırakıldı (§8): siparişveren kimliği, yunus, köpek sembolizmi kesinleştirilmedi.

## 5. Görsel sınırı

- Görsel bu oturumda İNCELENMEDİ; `gorsel.dogrulama.incelenen_bolgeler=[]`. Yalnız metadata/lisans (S20, 3 Commons dosyası PD).
- Kompozisyon/ikonografi betimleri "kaynakların betimlediği" çerçevesinde (S5/S10/S14/S15); piksel doğrulaması YOK.
- GZ soruları TASLAK (gz_taslak otomatik; ipucu "TASLAK (görsel bu oturumda incelenemedi…)").
- Lisans katmanı (C057/D06): eser kamu malı (WD P6216; Fragonard ö.1806, 100+ yıl pma); Commons 3 dosya PD; Art UK görseli CC BY-NC-ND; Wallace sitesi yayım lisansı VERMEZ (yalnız kişisel/akademik/eğitsel indirme). Görsel proje içine kopyalanmadı; URL+lisans+kaynak referans.
- data'nın birincil görsel dosyası (Joean Honoré Fragonard - The Swing.jpg) WD P18'den (Fragonard, The Swing.jpg) farklı; çözünürlük/credit farkı not edildi.

## 6. İnsan-inceleme noktaları (öncelikli)

1. **Görsel inceleme (vision):** 3 Commons PD dosyasından doğru eser/görsel seçilip kompozisyon, fırlayan terlik, bergère/tricorn, Falconet heykeli, köpek, pembe/mavi-yeşil karşıtlığı piksel düzeyinde doğrulanmalı; GZ TASLAK'tan çıkarılmalı. data'nın "yunuslu putto", "köpek sadakat", "ayakkabı Cupid'e doğru", "spot ışığı" iddiaları görselle sınanmalı (şu an D/E).
2. **Tarih (D01):** data "1766" ↔ müze "about 1767–68". Müze esas alındı; data düzeltilmesi onaya sunulur (data DEĞİŞTİRİLMEDİ). WD 1761 alt sınırı (E06) değerlendirilmeli.
3. **Yaşlı adam (D02):** müzenin 2020 "elderly husband" / Fashion "cuckolded husband?" ↔ güncel "older man" / Art UK "admirer" vurgu kayması; editoryal tercih netleştirilmeli.
4. **Siparişveren (E01/D03):** Saint-Julien kimliği "allegedly/assumed/little evidence"; WD P88 refsiz. Birincil belge (ödeme/mektup/envanter) aranmalı; quiz doğru cevabı yapılmamalı.
5. **Konum (D04/E08):** "Study" ↔ "Oval Drawing Room"; güncel sergileme yeri müzeden teyit edilmeli.
6. **Ingamells yılı (D05):** 1985 (müze) ↔ 1989 (enwiki); baskı farkı çözülmalı (metne erişilmedi).
7. **Görsel lisansı (D06):** yayına alınacak görselin lisansı (Commons PD ↔ Art UK CC BY-NC-ND ↔ Wallace koşulları) hak politikası kararıyla netleştirilmeli.
8. **Collé özgün metni (E09):** Fransızca asıl metne erişilmedi; müze çevirisi kullanıldı. Akademik teyit için özgün metin/katalog (Ingamells) incelenmeli.
9. **Haricî model/insan editör denetimi:** AKADEMIK_STANDART §11 gereği ayrı denetim; bu klasörde "bekliyor".

## 7. Yayına-adaylık

**BEKLİYOR.** AKADEMIK_STANDART §12 koşulları kısmen sağlandı (kimlik/atıf birincil doğrulandı; olgusal cümleler kanıt kayıtlı; yorumlar olgulardan ayrıldı; quiz A/B; kaynak bağlantıları erişim durumlarıyla kayıtlı; çelişkiler açık; Denetim A+B tamam). Ancak **görsel analiz doğru eser/görselle yapılmadı** (İNCELENMEDİ) ve **insan editoryal onay yok**. Bu iki koşul tamamlanmadan "Yayına aday" olunamaz. durum="İnsan incelemesi bekliyor".

## 8. Veri notları (özet — data/ DEĞİŞTİRİLMEDİ)

Ayrıntılı envanter KANIT_DOSYASI.md §5'te. Başlıcaları: tarih 1766 (D01); yunuslu putto (D09/E07); köpek sembolizmi/ayakkabı yönü/spot ışığı (E07); yaşlı adam kimliği (D02); siparişveren refsiz (E01); konum Study (D04); iki boyut alanı (D10); imzalar.json null ↔ Signed indistinctly (C007); muze_numaralari.json P430 kaydı yok (C005 doğrulandı); önceki AI doğrulamasına (ders_kaynaklari puan 0.5) GÜVENİLMEDİ.
