# DURUM — Resim Ansiklopedisi (kesintide buradan devam et)

**Son güncelleme:** 15 Kasım 2026 · **Branch:** content-review

## Amaç

Sanat Atlası bünyesinde, yalnız resim sanatına odaklı, kaynakları doğrulanabilir dört bağımsız ansiklopedi: (1) Resimde İkonografi ve Semboller Sözlüğü, (2) Resimde Mitoloji Ansiklopedisi, (3) Resim Teknikleri Atlası, (4) Resimlerdeki Tarihsel Nesneler Kataloğu. Nihai hedef 400 madde (100+100+100+100); **bu aşamada yalnız 20 maddelik pilot** — pilot bağımsız denetimden (Astra + Fable) geçmeden 21. maddeye geçilmez.

## Durum Sözlüğü

Madde: `TASLAK → BAGIMSIZ_DENETIM_BEKLIYOR → YAYIN_ONAYLI` (sonuncusu yalnız insan kararıyla).
İddia: `DOGRULANDI / KISMEN_DESTEKLENIYOR / DOGRULANAMADI / CELISKILI / HATALI`.

## İlerleme Kaydı

| Aşama | Durum | Not |
|---|---|---|
| Altyapı: AKADEMIK_DOGRULAMA_KURALLARI.md | ✅ TAMAM | v1.0 |
| Altyapı: TAKSONOMI.md | ✅ TAMAM | v1.0 |
| Altyapı: semalar/MADDE_SEMASI.json + KANIT_SEMASI.json | ✅ TAMAM | Draft 2020-12 |
| Altyapı: dogrula.py (12 kontrol + --test 23/23 + --dosya filtresi) | ✅ TAMAM | venv: .qwen/tmp/venv-dogrula |
| Altyapı: denetim şablonu + paket_uret.py | ✅ TAMAM | paketler üretim sonrası üretilir |
| Ajanlar: ansiklopedi-kaynak-arastirma + ansiklopedi-madde-yazim | ✅ TAMAM | .qwen/agents/ altında iki tanım |
| Pilot seçim (20 konu, ID/slug ataması) | ✅ TAMAM | pilot/PILOT_SECIM.md |
| Kaynak araştırması (8 batch brief) | ✅ 8/8 TAMAM (iko-a/b, mit-a/b, tek-a/b, nes-a/b) | brief'ler .qwen/tmp/ansiklopedi-pilot/<batch>/ |
| Madde yazımı (ajanlar) | ✅ 20/20 TAMAM | iko (5 madde ajanı) · nes-a/b, mit-a, tek-a (2–3'lük ajanlar) · MIT-004/005, TEK-004/005 tek-maddelik ajanlar (stream-cap sonrası bölme) |
| Kaynak kütüğü birleştirme (kaynaklar/KAYNAK_KUTUGU.json) | ✅ TAMAM | 248 kayıt, 7 çok-maddeli kaynak grubu |
| Çapraz bağ tamamlama (ilgili_maddeler) | ✅ TAMAM | eklenen: IKO-004↔NES-002, IKO-005↔MIT-005, NES-003↔TEK-004, MIT-004↔TEK-005, IKO-001→TEK-001; kaldırılan: TEK-005→NES-003 (kavram-birleştirme riski) |
| dogrula.py tam koşum + PILOT_KALITE_RAPORU.md | ✅ TAMAM | tam koşum: 0 HATA/66 UYARI · --test 23/23 · rapor: PILOT_KALITE_RAPORU.md |
| Denetim paketleri (ASTRA/FABLE) | ✅ ÜRETİLDİ | denetim/ASTRA_PAKETI.md + FABLE_PAKETI.md (192 iddia); denetçi sonuçları BEKLENİYOR |
| GENEL_RAPOR.md kapanışı | ✅ TAMAM | |
| Commit + push (content-review) | ⏳ | bu oturumda yapılacak |

## Madde Durum Tablosu (15 Kasım 2026 kapanışı — hepsi BAGIMSIZ_DENETIM_BEKLIYOR)

| ID | Konu | Araştırma | Yazım | İddia (D/KSM/DĞL/ÇLŞ) | Durum |
|---|---|---|---|---|---|
| IKO-001 | lotus | iko-a ✅ | ✅ | 10 (10/0/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| IKO-002 | nimbus | iko-a ✅ | ✅ | 10 (10/0/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| IKO-003 | Çin ejderhası | iko-a ✅ | ✅ | 10 (9/1/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| IKO-004 | vanitas sembolleri | iko-b ✅ | ✅ | 10 (10/0/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| IKO-005 | ayna | iko-b ✅ | ✅ | 10 (8/1/0/1) | BAGIMSIZ_DENETIM_BEKLIYOR |
| MIT-001 | Medusa | mit-a ✅ | ✅ | 10 (9/0/0/1) | BAGIMSIZ_DENETIM_BEKLIYOR |
| MIT-002 | Prometheus | mit-a ✅ | ✅ | 10 (9/0/0/1) | BAGIMSIZ_DENETIM_BEKLIYOR |
| MIT-003 | Osiris | mit-a ✅ | ✅ | 10 (9/1/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| MIT-004 | Krishna | mit-b ✅ | ✅ (tek-madde ajanı) | 8 (5/1/0/2) | BAGIMSIZ_DENETIM_BEKLIYOR |
| MIT-005 | Amaterasu | mit-b ✅ | ✅ (tek-madde ajanı) | 8 (7/1/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| TEK-001 | fresk | tek-a ✅ | ✅ | 10 (9/1/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| TEK-002 | yumurta tempera | tek-a ✅ | ✅ | 10 (10/0/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| TEK-003 | glaze | tek-a ✅ | ✅ | 10 (10/0/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| TEK-004 | mürekkep resmi | tek-b ✅ | ✅ (tek-madde ajanı) | 8 (6/0/0/2) | BAGIMSIZ_DENETIM_BEKLIYOR |
| TEK-005 | wasli | tek-b ✅ | ✅ (tek-madde ajanı) | 8 (4/1/1/2) | BAGIMSIZ_DENETIM_BEKLIYOR |
| NES-001 | lavta | nes-a ✅ | ✅ | 10 (8/1/0/1) | BAGIMSIZ_DENETIM_BEKLIYOR |
| NES-002 | kum saati | nes-a ✅ | ✅ | 10 (8/1/1/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| NES-003 | hokka-fırça | nes-a ✅ | ✅ | 10 (7/3/0/0) | BAGIMSIZ_DENETIM_BEKLIYOR |
| NES-004 | Şark halısı | nes-b ✅ | ✅ | 10 (7/2/0/1) | BAGIMSIZ_DENETIM_BEKLIYOR |
| NES-005 | zırh | nes-b ✅ | ✅ | 10 (9/0/0/1) | BAGIMSIZ_DENETIM_BEKLIYOR |

Toplam: 192 iddia · 248 kaynak kaydı (213 okundu) · 90 resim örneği · dogrula 0 hata/66 uyarı. Ajan raporları: `pilot/URETIM_NOTU_*.md`.

## Kesinti Sonrası Devam Kuralları

1. Bu dosyayı ve `pilot/PILOT_SECIM.md`'yi oku.
2. `.qwen/tmp/ansiklopedi-pilot/<batch>/` altındaki brief'lerin hangilerinin tamam olduğunu kontrol et (`*-brief.md`).
3. Kategori dizinlerinde hangi `<ID>-<slug>.json` + `kanit-kayitlari/<ID>.json` çiftlerinin var olduğuna bak; tamamlanmış işi yeniden üretme.
4. Eksikleri ilgili ajanlarla tamamla; sonra birleştirme → dogrula → rapor → denetim paketleri → commit.

## Kısıtlar (değişmez)

- Yalnız `content-review` branch; `main`, `data/`, uygulama kodu ve mevcut 107 ders dosyası DEĞİŞTİRİLMEZ.
- Deployment yok; ansiklopedi içeriği otomatik yayımlanmaz.
- Qwen kendi maddesine YAYIN_ONAYLI veremez.
