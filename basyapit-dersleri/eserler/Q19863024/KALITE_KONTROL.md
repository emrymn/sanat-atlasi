# KALİTE KONTROL — Q19863024 · Banyosunda Batşeba · Sebastiano Ricci

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Durum:** İnsan incelemesi bekliyor · **Yayına adaylık:** BEKLİYOR (koşullar §12; insan onayı olmadan yayımlanmaz).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

- Üç dersin bütün olgusal cümleleri `[C###]` ile kanıt envanterine bağlandı; etiketsiz olgusal cümle bırakılmadı (dogrula heuristic 0 uyarı).
- C seviyesi yorumlar "(yorum)" ile işaretli (C004 yağ, C020 WGA hizmetçi/bahçe, C021 itwiki karyatid, C022 WGA köprü, C024 Budapeşte Davud/Venüs şeması).
- D iddiaları (C033–C040) "(tartışma)", E iddiaları (C041–C048) "(belirsiz)" ile işaretli; post-pass ile garanti edildi.
- Felsefi/estetik bölüm (İleri §7) açıkça C yorum; Kant/Berger anakronizm riski beyan edildi, sanatçı-etki iddiası YOK (§7).
- Konu (banyo/nü) akademik ve açık ayrıntısız betimlendi; erotik ayrıntı üretilmedi.
- **Sonuç:** Tamam. Desteklenmeyen iddia yok; kanıt yetersiz alanlar (görsel ayrıntı, sergi salonu, replika yeri, Molmenti künyesi) kısa bırakıldı / E olarak beyan edildi (§8).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

- **SMB birincil (S2, obj-865260) YENİDEN AÇILDI** (curl, HTTP 200, 2026-11-14; `.qwen/tmp/parti4/denetimB-smb.html`). Anahtar alanlar birebir teyit: Ident. Nr. 454 · obj:865260 · Ricci (1659-1734) · um 1725 · Leinwand · 111,8×144,3 · 1829/30 Königlich Preußischen Schlössern · vermeintlichen Veronese 1764-1773 · Nach dem Bade / Toilette der Venus · Botin (solda) · Molmenti 1909 · putative Veronese · circa 1725 · female messenger · Two replicas … eigenhändig · PDM 1.0 / Christoph Schmidt · 06.08.2026 · Erich Schleier · Weiß-Gelb-Blau-Rot · pearl-studded · rounded basin · Urias · Rückenfigur.
- **WGA Berlin (S5) YENİDEN AÇILDI** (HTTP 200; `denetimB-wga.html`): 109×142 · c. 1725 · four maids · boy with a mirror · far left … letter · enclosed garden · Oil on canvas → D1/D5/C004/C020 teyit.
- Budapeşte birincil (S7w MFAB Wayback 2024-07-08; S8w Szépművészeti Wayback 2022-12-03) cache'ten yeniden okundu: 1724 · 118,5×199 · 57.9 · oil on canvas · Gallery XXX · "velencei rokokó … mestere" · © ibareleri · "ongoing research". Canlı URL'ler 520 (erişim engeli beyanlı).
- itwiki/jawiki wikitext yeniden okundu: itwiki Budapeşte maddesi (data=1720, "versione più tarda 1726", "cinque ancelle + paggetto", karyatid, Santucci/Daniels atıfları); jawiki "1725 civarı", 111.8/144.3, replika cümlesi Berlin'e bağlı (D4).
- **Sonuç:** Tamam — birincil kaynaklar taslaktan bağımsız yeniden açıldı; iddialar gerçekten destekleniyor. Haricî model/insan editör denetimi ayrıca BEKLİYOR.

## 3. Şema ve yapısal doğrulama

- `DERS.json` + `SORULAR.json`: DERS_SEMASI.json (Draft 2020-12) — mini yorumlayıcı + jsonschema **AKTİF**, 0 hata.
- `dogrula.py`: **Q19863024 0 hata / 0 uyarı**. `--test` **25/25**.
- 12 bölüm `bolum_eslesme` tam; iddia kimlikleri KANIT ↔ DERS.json eşleşiyor; **Sayım 48 = A25/B2/C5/D8/E8** tutarlı.
- Quiz: CS10 + DY5 + GZ5 + TK5 kanıtı **yalnız A/B**; AU5 serbest. CS yanlış gerekçeleri gerçek/bağlamsal (totoloji yok). Doğru cevaplar D/E'ye dayanmıyor.
- `gorsel.dogrulama.incelenen_bolgeler=[]` → GZ 5/5 **TASLAK** (otomatik).
- CJK taraması: **0** (DERS.json, SORULAR.json, KANIT, 3 ders). Japonca kitap başlıkları CJK yazılmadan ISBN+betimle verildi (özgün başlık brief'te).
- **Not:** Genel dogrula çıktısındaki 12 HATA başka eserlerin (Q1978815, Q28797801, Q29530, Q3212142, Q956541) eksik dosyalarıdır; bu göreve ait değildir, dokunulmadı.

## 4. Kelime tablosu

| Seviye | Hedef | Ölçülen | Durum |
|---|---|---|---|
| Başlangıç | 400–500 | 440 | aralıkta |
| Orta | 1300–1600 | 1326 | aralıkta |
| İleri | 2600–3200 | 2636 | aralıkta |

Dolgu/tekrar yok; seviyeler arası birebir uzun cümle tekrarı uyarısı yok. İleri düzey gerçekten daha derin (yöntem, versiyon/replika metodolojisi, alımlama, felsefi yorum, D/E envanteri).

## 5. Görsel sınırı

- **Hiçbir görsel incelenmedi** (vision kotası ana oturumda); yalnız metadata+lisans+çözünürlük (C047 E).
- Kompozisyon "kaynakların betimlediği" ibaresiyle SMB (A) + WGA/itwiki (C) metninden; kesin gözlem yazılmadı.
- Berlin görselleri PD (PDM 1.0 / Yorck / anagoria 4408×3384); Budapeşte müze fotoğrafları © (C029) — yeniden yayımlanmadı, URL+lisans referans.
- Data görsel ayrıntıları (altın vazo, hayvan başlı çeşme, mermer havuz, el saçta, bilezik, selviler, bulutlu gökyüzü, korkuluk, turuncu/sarı elbise, pembe yastık) **E** (C041); WD P180 kısmi destek, görsel teyit değil.
- **GZ 5/5 TASLAK**; insan editör doğru eser görseliyle teyit ZORUNLU.

## 6. İnsan-inceleme noktaları (öncelikli)

1. **Görsel teyit:** Berlin görseli (SMB/Anagoria) açılıp kompozisyon betimleri (haberci solda, çarşaf, cepheden baş, yuvarlatılmış havuz, kavisli duvar, renk akoru) ve GZ soruları doğrulanmalı; hizmetçi sayısı (D5: 4↔5) görselle çözülmeli.
2. **Data düzeltmeleri (data/ dokunulmadı, onaya sunulur):**
   - Tarih "1725" → "um 1725" (circa); görev başlığı "c.1720" hatalı (C034/C035).
   - Haberci: "sağdaki genç haberci" spekülasyonu birincille çelişiyor → "en solda kadın haberci" (C012/C038).
   - "Pastel renkler" birincilde yok; ders_kaynaklari "dogrulandi" durumu yeniden değerlendirilmeli (C040).
   - "Mermer havuz" → E2 (C041); görsel ayrıntılar gözden geçirilmeli.
   - kunye/muze_numaralari boşluğu: env. 454 artık A kaynaklı (C006).
3. **Birincil teyit:** SMB kaydı canlı güncel (06.08.2026); insan editör permalink'i tekrar açmalı. Budapeşte canlı 520 → Wayback arşiv tarihleri (2024-07-08 / 2022-12-03) not edildi; canlı erişim tekrar denenmeli.
4. **Erişilmeyen kitaplar:** Daniels 1976, Santucci 2008, NHK 1993, Ōshima 2013, Pigler 1967, Schleier 2019 (kitap), Molmenti 1909 — B/C iddiaların kaynak zinciri insan editörce teyit edilmeli (özellikle C025/C026 B).
5. **Versiyon karıştırma:** itwiki Budapeşte maddesi; Berlin/Budapeşte künye ve replika atfı (D4) insan editörce netleştirilmeli.

## 7. Yayına-adaylık (§12)

| Koşul | Durum |
|---|---|
| Temel kimlik/atıf doğrulanmış | ✓ (birincil SMB, Denetim B) |
| Tüm olgusal cümleler kanıt kayıtlı | ✓ (Denetim A) |
| Görsel analiz doğru eser/görselle | ✗ — İNCELENMEDİ (E); GZ TASLAK |
| Yorumlar olgulardan ayrılmış | ✓ (C işaretli) |
| Quiz cevapları doğrulanmış iddialara | ✓ (A/B) |
| Kaynak bağlantıları erişim durumlarıyla | ✓ |
| Ciddi çelişkiler açıkça | ✓ (D1–D8) |
| Denetim A + B | ✓ (B birincil yeniden açıldı) |
| Haricî model/insan editör onayı | ✗ — BEKLİYOR |

**Sonuç:** Görsel inceleme ve insan editoryal onay tamamlanmadan **Yayına aday DEĞİL**. Durum: **İnsan incelemesi bekliyor**.