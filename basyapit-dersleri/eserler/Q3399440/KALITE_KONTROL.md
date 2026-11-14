# KALİTE KONTROL — Q3399440 · XIV. Louis'nin Portresi (Rigaud, 1701, Louvre)

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Durum:** İnsan incelemesi bekliyor · **Yayına adaylık:** BEKLİYOR (Denetim A+B bu oturumda tamam; haricî model/insan editör denetimi ve görsel inceleme gerekli).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

- Üç dersin bütün olgusal cümleleri KANIT_DOSYASI.md'deki 71 iddiaya (C001–C071) köşeli parantezle bağlandı; etiketsiz olgusal cümle kalmadı (dogrula heuristic taraması temiz).
- D seviyeli 15 iddia (C038–C052) derslerde "(tartışma)" işaretiyle; E seviyeli 11 iddia "(belirsiz)" işaretiyle verildi (post-pass otomatik + doğal dilde ihtiyat kipleri). Brief'in özgün kuşku kipleri aynen korundu: "sans doute", "probablement", "peut-être", "jamais explicitée", "attributed", "thought to", "with no documental basis", "circa 1701–1702", "à moins qu'il ne s'agisse...".
- C seviyeli 2 iddia (C054 "zahmetsiz iktidar", C062 "manifesto/doruk noktası" + Kantorowicz okuması) açıkça "(yorum)" etiketli; felsefi bölümün tamamı yorum olarak çerçevelendi, Rigaud'nun Kantorowicz'ten etkilendiği iddia edilmedi (§7).
- Quiz kanıtları yalnız A/B: CS10 + DY5 + GZ5 + TK5'in tüm kanit dizileri A/B iddialara bağlı (otomatik kontrol: A/B dışı kanıt YOK). AU5 serbest (D/E dahil). Doğru cevapların hiçbiri D/E'ye dayanmıyor; yorum tek doğru cevap yapılmadı.
- Yanlış şık gerekçeleri bağlamsal (totoloji yok): her çeldirici, eserin nesne ailesindeki gerçek bir karşılığa (MV 2041, P002343, 70.PA.1, Belle portresi vb.) veya belgeli bir olguya bağlanarak açıklandı.
- Sayım tutarlılığı: KANIT "Sayım: 71 iddia · A=38 · B=5 · C=2 · D=15 · E=11" ↔ DERS.json birebir (dogrula sayım kontrolü temiz).

## 2. Denetim B — Kaynağa geri dönüş (bağımsız tur)

Bu oturumda, brief'ten bağımsız olarak ham cache'ler yeniden açıldı ve iddialarla karşılaştırıldı (taslağı yeniden okumak değil, kaynak metnine dönüş):

| Kaynak | Yeniden açılan | Doğrulanan anahtar noktalar |
|---|---|---|
| S6/S7 Louvre HTML+JSON | `Q3399440-louvre-text.txt`, `-louvre-cl010066115.json` | Künye (INV 7492/MR 2391, 277×194, 1701, huile sur toile); iki imza; 12×14 iplik; Aubert 1967 / Sourzac 1988; provenance (2 Mayıs 1814); "non exposé" + room ""; Mercure 1702 alıntısı; Drevet 1714–1716; Salon 1704 temkini; MV 2041 313×205; "la seule signée et datée"; HTML "20.04.2026" ↔ JSON "modified 2026-07-22" (C057) |
| S16 Versailles PDF | `Q3399440-versailles-pedagogique.txt` (7 s.) | "et non sur l'estrade" (C006/C050); dans reddi (C044); "jambe gauche... en avant" (C043); 63 yaş (C045); gut + Maintenon pozları (C002); "jamais explicitée" (C053); cenaze vermeil tacı (C008); Henri IV kısa asa (C009); fildişi adalet eli (C010); kılıç "à tort" (C011); atölye s.7 (C036/C064); kariyer (C063); regalia terminolojisi (C065); uzun asa 1,84 m/1380 (C066); Belle 1723 (C067); kolye (C068); dantel/peruk (C069); 1,60 m/2,77 m (C033); **yeni bulgu:** Benoît görsel altı notu "vers 1705" ↔ metin "vers 1700" (C061) |
| S15 Prado Wayback | `Q3399440-prado-wayback-text.txt` (2025-04-25) | P002343, 1701, 238×149, Room 019; Namur/Parrocel; "he did not send either canvas"; "attributed"/"thought to"/"with no documental basis" (C055); La Granja provenance; imza "Hyacinthus Rigaud pinxit 1701"; seri (Grand Dauphin/Bourgogne/Berry; Largillière) |
| S3/S4/S5 wikitext | `Q3399440-enwiki.wikitext`, `-frwiki.wikitext`, `-itwiki.wikitext` | 12.000 (Roman s.83 / Guiffrey s.693) ↔ 26.000 (Roman s.85) (C041); üç ölüm tarihi (C040); 62 ↔ 63 (C045); Drevet 1714–1715 + Nattier 1713/Phoenix 65-62 (C026/C048); Vittori "cousue" (C042); replika "également signée" + 276×194 (C039/C047); **yeni bulgu:** itwiki "piattaforma rialzata" → D013'e eklendi (C050); itwiki "E giocava" (C056) |
| S1/S11/S12 WD | `Q3399440-wd.json`, `-derivatives-wd.json` | P276 Room 602 (2022 ref) ↔ "non exposé" (C038); P571 precision 9/P1480 yok; MV 2041 276×194 (Joconde ref) + precision 8 + circa (C028/C039); Getty ~1750, MV 3563 1706, Fabre Jean Ranc, Münih 1722 (C031); P6216 PD (C071) |
| S9/S10 Commons | `-commons-imageinfo.json`, `-commons-versailles-imageinfo.json` | 2883×4018 PD-Art, credit Gallerix; Versailles 13778×19481, "Rigaud and workshop", "between circa 1701 and circa 1702" (C059) |
| S19 data/ | `Q3399440-data-snapshot.json` | "63 yaşındaki", "basamağın üzerinde", "bale pozunu andırır", "zahmetsiz iktidar" → veri notları (§5) |

**Denetim B sonucu:** Brief'in 37 aday iddiasının tamamı ve 15 ihtilafın tamamı kaynak metinlerinde birebir doğrulandı; brief'e iki ek yapıldı (C061 Benoît tarih tutarsızlığı; C050'ye itwiki varyantı). Çelişkiler çözümlenmedi, D olarak korundu. Kitap/makale metinlerine erişilmedi (C060); hiçbir bibliyografik bilgi uydurulmadı — atıflar yalnız erişilen kayıtların satır içi ref/kaynakçalarından aktarıldı (Guiffrey cilt/yıl farkı notu: frwiki V=1881, en/it "1896 V" yazar; ders "Guiffrey 1881 V"yi frwiki üzerinden esas alır).

## 3. Şema ve otomatik doğrulama

- `.qwen/tmp/venv-dogrula/bin/python basyapit-dersleri/dogrula.py` → **Q3399440: 0 hata, 0 uyarı** (jsonschema Draft2020-12 katmanı AKTİF; mini yorumlayıcı + çapraz tutarlılık temiz).
- Genel koşu: 0 hata, 84–90 uyarı (sayı paralel parti üretimlerine göre değişir) — uyarıların tamamı öteki eserlere ait (kelime aralığı/heuristic); Q3399440'a ait uyarı yok. İlk turda Q3399440'ın 5 heuristic "etiketsiz olgusal cümle adayı" uyarısı vardı (cümle bölücü "V.", "XV.", "II.", "fol.", "Inv." kısaltmalarında bölünüyordu); etiketler bölünmeye dayanıklı konuma taşınarak giderildi, içerik değişmedi.
- DERS.json + SORULAR.json şema uygun; bolum_eslesme 12/12; durum "İnsan incelemesi bekliyor"; insan_onayi "Bekliyor".
- CJK taraması: 7 dosyanın tamamında **0** (Louvre bibliyografyasındaki Çince başlık ders dosyalarına alınmadı).

## 4. Kelime tablosu (gen.kelime, post-pass sonrası)

| Seviye | Hedef | Ölçülen | Sonuç |
|---|---|---|---|
| Başlangıç | 400–500 | 427 | ✓ |
| Orta | 1300–1600 | 1349 | ✓ |
| İleri | 2600–3200 | 2765 | ✓ |

Dolgu/tekrar kontrolü: yakın tekrar paragraf uyarısı yok; seviyeler arası birebir ortak uzun cümle uyarısı yok. İleri ders gerçekten daha derin: birincil iç çelişkileri, atölye ekonomisi, regalia sapma analizi, 15 ihtilaf envanteri ve çözüm protokolleri.

## 5. Görsel sınırı (Kural 6)

- Görsel **İNCELENMEDİ** (vision kotası ana oturumda); `gorsel.dogrulama.incelenen_bolgeler=[]`.
- Kompozisyon anlatımı "kaynakların betimlediği" çerçevesinde (S6/S16 birincil + wiki betimleri); doğrudan gözlem iddiası yok.
- GZ01–GZ05 **TASLAK** işaretli (gen.gz_taslak otomatik); insan editör görseli inceleyip güncellemeli.
- Lisans: PD-Art / PD-old-100-expired (CC-PD-Mark); credit **Gallerix** (Louvre değil) — etikette korunmalı; SDC copyright status kategorileri eksik (Commons tarafında iyileştirme adayı).
- Görsel projeye kopyalanmadı; URL + lisans + kaynak referansı verildi. C043/C049/C050 gibi görselle çözülebilecek ihtilaflar açık bırakıldı.

## 6. İnsan inceleme noktaları (öncelik sırasıyla)

1. **Görsel inceleme** (ana oturum vision kotası): kompozisyon betimini teyit et; GZ TASLAK → nihai; C043 (öndeki bacak), C049 (kılıç görünürlüğü), C050 (seki konumu) görsel hakemliği.
2. **C038 konum:** Louvre "non exposé" (2026) ↔ WD/frwiki "salle 602" — güncel salon teyidi (Louvre banner'ı zaten uyarıyor).
3. **C039 boyut:** Joconde kaydı (P347 000PE002386) açılıp MV 2041 313×205 ↔ 276×194 çözülmeli; çerçeveli/çerçevesiz hipotezi test edilmeli.
4. **C041 ödeme:** Roman 1919 s.83/s.85 ve Guiffrey 1881 s.693 orijinal metinleri karşılaştırılmalı (12.000 ↔ 26.000; "pounds" çeviri sorunu).
5. **C042 teknik:** yüz desteği marouflé ↔ cousue — teknik görüntüleme/radyografi; S16 "papier marouflé" MV 2041'e ait, asla karıştırılmamalı.
6. **C046 akıbet:** İspanya kopyası — arşiv/envanter takibi; itwiki Madrid iddiası (C030) desteksiz.
7. **C057 Louvre içi tutarsızlıklar:** güncelleme tarihi, sergi bitişi, ikinci imza okunuşu — müzeye bildirilebilir.
8. **C061 Benoît tarihi:** PDF metin "vers 1700" ↔ caption "vers 1705" — Versailles'a not.
9. **C040 Charles II ölüm tarihi:** üç kaynak üç tarih (1 Ekim / 1 Kasım / 18 Kasım 1700) — birincil İspanya kayıtlarıyla çözülür; ders bağlamı (C034) etkilenmez.
10. **Veri notları** (KANIT §5): data/ "basamağın üzerinde", "bale pozunu andırır", "63 yaş", "adalet asası" adlandırması, sanatcilar "1701 civarında... atölyesiyle", akım etiketi, muze_numaralari boşluğu — data DEĞİŞTİRİLMEDİ, insan onayına sunuldu.

## 7. Yayına adaylık değerlendirmesi (§12)

| Ölçüt | Durum |
|---|---|
| Temel kimlik ve atıf doğrulanmış | ✓ (Louvre birincil, A) |
| Tüm olgusal cümleler kanıt kayıtlı | ✓ (71 iddia, Denetim A) |
| Görsel analiz doğru eser/görselle yapılmış | ✗ — İNCELENMEDİ; GZ TASLAK |
| Yorumlar olgulardan ayrılmış | ✓ (C054/C062 + bölüm 7 çerçevesi) |
| Quiz cevapları doğrulanmış iddialara dayanıyor | ✓ (yalnız A/B) |
| Kaynak bağlantıları erişim durumlarıyla kayıtlı | ✓ (S1–S19; 403/JS/429 notları) |
| Ciddi çelişkiler açıkça belirtilmiş | ✓ (15 D + 11 E, envanter tablosu) |
| Denetim A + B tamamlanmış | ✓ (bu oturum) |
| Haricî model/insan editör denetimi | ✗ — BEKLİYOR |

**Sonuç: Yayına aday DEĞİL — "İnsan incelemesi bekliyor".** Görsel inceleme + haricî denetim tamamlanmadan yayımlanmaz.

## 8. Dosya envanteri

- `KANIT_DOSYASI.md` (71 iddia; S1–S19; §0–5)
- `DERS_BASLANGIC.md` (427 kelime) · `DERS_ORTA.md` (1349) · `DERS_ILERI.md` (2765)
- `DERS.json` + `SORULAR.json` (CS10/DY5/AU5/GZ5/TK5; durum: İnsan incelemesi bekliyor)
- Üretim betiği: `.qwen/tmp/parti3/uret-Q3399440.py` · dogrula çıktısı: `.qwen/tmp/parti3/Q3399440-dogrula-out.txt`
- Kapsam dışı bırakılanlar: data/, uygulama kodu, main, Vermeer pilotu (Q167605), öteki eserler — DOKUNULMADI; commit/push/deploy YAPILMADI.
