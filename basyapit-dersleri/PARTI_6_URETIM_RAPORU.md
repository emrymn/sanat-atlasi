# PARTİ 6 ÜRETİM RAPORU — Kandinsky Kompozisyon VII (üretim tamamlandı)

**Tarih:** 14 Kasım 2026 · **Branch:** `content-review` · **Standart:** `AKADEMIK_STANDART.md`
**Kapsam:** MUFREDAT sırasında kalan tek üretilebilir eser — Kandinsky Kompozisyon VII (#102, M13).
**Sonuç:** 1/1 tamam · dogrula **0 hata / 0 uyarı** · CJK 0 · `--test` 25/25 · kelime aralıkta.
**Durum:** **"İnsan incelemesi bekliyor"** — "Yayına aday" değil.

---

## 1. Kapsam

| # | Anahtar | Eser | Sanatçı | Modül | Müze |
|---|---|---|---|---|---|
| 1 | Q2990634 | Kompozisyon VII (Composition VII) | Wassily Kandinsky | M13 | Tretyakov Gallery, Moskova |

## 2. Metrik

| Anahtar | İddia | A/B/C/D/E | Kelime B/O/İ | dogrula H/U | Birincil |
|---|---|---|---|---|---|
| Q2990634 | 54 | 17/24/2/4/7 | 416/1329/2714 | 0/0 | Tretyakov canlı + Wayback + Pompidou A |

Soru bankası: 10 CS + 5 DY + 5 GZ + 5 AU + 5 TK (CS/DY/GZ/TK yalnız A/B). Kelime hedefleri B 400–500 / O 1300–1600 / İ 2600–3200 — aralıkta.

## 3. Birincil kaynak erişimi

**AÇILDI (A):** Tretyakov `my.tretyakov.ru/app/masterpiece/10873?lang=en` canlı 200 (URL itwiki kaynakçasından bulundu, tahmin yok) + Wayback 2026-01-02 + Pompidou suluboya kaydı 200. Künye: 1913, yağlıboya/tuval, **200×300 cm, İnv.13230**, 1929'da GMNZI'den giriş; 30+ hazırlık eskizi ve 25–28 Kasım 1913 icrası müze metninde birebir. WD'de P217 yok.

## 4. Tartışmalar (D) / belirsizlikler (E)

- **D001 boyut:** Tretyakov 200×300 ↔ en/it infobox 200.6×302.2.
- **D002 Pompidou tarih tutumu:** canlı "1913" ↔ itwiki "1910 o 1913".
- **D:** provenans (1915 satın alma itwiki/Hermann → B), tema vurgusu, icra süresi.
- **E003:** itwiki "Münih'te yapıldı" + "ilk üç Kompozisyon WWII'de yok oldu" Tretyakov'a atıflı ama katalog metninde yok (atıf zinciri doğrulanamadı).
- **E007:** data "soyut ekspresyonizmi etkiledi" erişilen kaynaklarda desteksiz.
- Envanter no data/muze_numaralari.json'da eksik (boşluk notu).

## 5. Görsel doğrulama (Kural 6)

Commons GAC dosyası PD, 7015×4661; **vision bütçesi tükendiğinden İNCELENEMEDİ** → `incelenen_bolgeler=[]`, GZ TASLAK. Kompozisyon birincil/ikincil metinden. İnsan editör görsel teyidi ZORUNLU.

## 6. Kısıtlar (uygulandı)

- Pilot + Parti 1-5 (101 eser) dokunulmadı; uygulama kodu ve `data/` değişmedi; `main`'e merge/deployment/yayın yok; yalnız `content-review` commit/push.
- "Yayına aday" yapılmadı.

## 7. ÜRETİM SONU ve telif politikası kararı

**107 eserin 102'si üretildi** (pilot Q167605 + Parti 1-6), tümü "İnsan incelemesi bekliyor", tüm repo dogrula **0 hata**, CJK 0, `--test` 25/25.

**Kalan 5 eser (M13 #103-107) TR/AB'de telif korumalı:**
| # | Anahtar | Eser | Sanatçı | Telif bitiş (yaklaşık) |
|---|---|---|---|---|
| 103 | Q175036 | Guernica | Pablo Picasso | 2044 |
| 104 | hannah-hoch\|Cut with the Kitchen Knife | Weimar Cumhuriyeti'nin Bira Göbeğini Mutfak Bıçağıyla Kesmek | Hannah Höch | 2049 |
| 105 | salvador-dali\|The Persistence of Memory | Belleğin Azmi | Salvador Dalí | 2060 |
| 106 | Q1061035 | İmgelerin İhaneti | René Magritte | 2038 |
| 107 | francis-bacon\|Three Studies | Çarmıha Geriliş'in Dibindeki Figürler İçin Üç Çalışma | Francis Bacon | 2063 |

MUFREDAT telif uyarısı (Aşama 4 A4-1): bu eserlerin dersleri **görsel yeniden yayımlamadan** ve **hak politikası kararına bağlı** olarak hazırlanabilir. Bu 5 eser için **kullanıcının telif politikası kararı bekleniyor** (ör. yalnız metin/ek betimleme + kamusal alan görseli ikamesi, veya adil kullanım çerçevesi, veya bu eserlerin kapsam dışı bırakılması). Karar verilene kadar üretilmediler.

## 8. Kalıcı altyapı notu

- `.qwen/agents/kaynak-arastirma.md` + `.qwen/agents/ders-yazim.md` parti-bağımsız (`<PARTI>`); bu parti `.qwen/tmp/parti6`.
- `.qwen/tmp/parti6/` altında brief + ham cache + `gen.py` + `uret-Q2990634.py` + `metrics6.py`.

**Sonraki adım:** Kullanıcının (a) M13 telif-korumalı 5 eser için politika kararı ve (b) üretilen 102 eserin insan editoryal incelemesi bekleniyor. DURUM.md "Kesintide Devam" protokolü izlenir.