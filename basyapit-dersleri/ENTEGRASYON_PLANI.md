# ENTEGRASYON PLANI — Öneri (onay bekler, kod DEĞİŞTİRİLMEDİ)

**Tarih:** 13 Kasım 2026 · **Statü:**salt öneri. Bu klasördeki hiçbir dosya uygulama koduna veya `data/` verisine dokunmaz; entegrasyon ancak kullanıcı onayıyla ayrı bir iş olarak yapılır.

## 1. Mevcut durumla uyum

- Uygulama derleme adımı olmayan statik bir PWA (CLAUDE.md/KARARLAR.md); göreli yollar, GitHub Pages, iPhone 13 hedefi.
- Başyapıtlar zaten `data/basyapitlar.json` (107) + `data/eser_ayrintilari.json` (107 nokta anlatımı) ile sunuluyor; `#/basyapit` rotası var.
- Bu klasörün `DERS.json`/`SORULAR.json` dosyaları **ek** içerik katmanıdır; mevcut dosyaların yerine geçmez, onları değiştirmez.

## 2. Önerilen veri yolu (onay sonrası)

1. `basyapit-dersleri/eserler/<anahtar>/DERS.json` ve `SORULAR.json` uygulama tarafından **isteğe bağlı** yüklenir (dosya yoksa mevcut başyapıt deneyimi aynen sürer — `eserler_onbellek.json` yokken çalıştığı gibi).
2. Yükleme tembel (lazy): yalnızca kullanıcı bir başyapıtın "Ders" sekmesini açtığında fetch; service worker `cache-first` ile önbelleğe alır (veri dosyaları zaten SW kapsamında).
3. Markdown dersleri için iki seçenek:
   - **A (öneri):** ders metinleri build'de değil, çalışma zamanında basit bir MD→HTML dönüştürücüyle render edilir (bağımlılıksız, ~100 satır; başlık/paragraf/liste/kalın destekli). `[C###]` etiketleri kaynakça çekmecesine bağlanır.
   - **B:** dersler önceden HTML'e çevrilir (ek build adımı gerektirir — mevcut "derleme yok" kararıyla çelişir; bu yüzden A önerilir).
4. Soru bankası mevcut Leitner/quiz altyapısına bağlanabilir: CS soruları "Başyapıt quiz'i" olarak ayrı bir tur; TK kartları mevcut aralıklı tekrar kutularına (0–5, [0,1,3,7,14,30]) eklenebilir. Mevcut sanatçı/akım skorları bozulmaz; ayrı skor anahtarı önerilir (`basyapit:<anahtar>`).

## 3. UI önerisi (Turkish, mevcut sepya paleti)

- Başyapıt ekranına üç sekme: "İncele" (mevcut noktalar), "Ders" (seviye seçici: 3/10/20 dk), "Çalış" (quiz + kartlar).
- Ders görünümünde: künye kartı (müze + envanter + tarih belirsizliği), görsel (müze URL'sine bağlantı, lisans satırı "Rijksmuseum · Public domain"), okuma metni, "Kaynaklar" çekmecesi (KANIT_DOSYASI özeti + URL'ler + erişim durumu), "İnsan onayı bekliyor" rozeti (durum "Yayına aday" olana kadar).
- Görsel: uygulama yerel kopyası yerine **müzenin büyük taramasına** "yakın okuma" bağlantısı (İleri ders §6'daki pedagojik gerekçe: küçük kopya pointillé'yi taşıyamaz). Yerel kopya küçük önizleme olarak kalabilir.

## 4. Telif ve yayın kapısı

- Pilot eser PD (Vermeer ö. 1675) + müze görüntüsü Public Domain Mark 1.0 → görsel riski yok (Aşama 4 çerçevesi; "veri CC0" iddiası kaynaklarda doğrulanamadı, çıkarıldı).
- Korumalı sanatçı eserleri (#103–107: Picasso, Höch, Dalí, Magritte, Bacon) için ders metni hazırlansa bile **görsel yeniden yayımlanmaz**; hak politikası kararı (IS-32) beklenir. Entegrasyon, `DERS.json.durum` alanı "Yayına aday" olmayan içerikleri yalnızca geliştirici modunda gösterir.
- Hiçbir ders insan editoryal onayı olmadan yayına açılmaz (durum makinesi bunu zorlar).

## 5. Veri düzeltme önerileri (ayrı onay — bu klasör uygulamaz)

1. `basyapitlar.json` Q167605 `tarih: "1660"` → `"y. 1660"` (müze "c. 1660").
2. Q764831 (Steen) `tarih: "1665"` → `"1665–1668"` (müze aralığı).
3. `eser_ayrintilari.json` Q167605 camera obscura benzetmesine tartışma notu; "azize ciddiyeti" ifadesinin yorum olduğunun etiketlenmesi.
Bu değişiklikler Aşama 3/4 bulgularıyla birlikte IS-22/IS-25 iş paketlerinde ele alınmalıdır.

## 6. Test önerisi (onay sonrası)

- `dogrula.py` CI'a eklenir (şema + çapraz tutarlılık, bağımlılıksız).
- Playwright: başyapıt → Ders sekmesi → seviye değiştir → quiz turu → kaynak çekmecesi; dosya yokken zarif fallback; SW önbellek testi (mevcut fixture düzeniyle).
- Görsel lisans satırının PD mark doğruluğu için birim test.

## 7. Sıradaki adımlar (kullanıcı onayıyla)

1. Pilotun insan incelemesi (KALITE_KONTROL.md §6 listesi).
2. Onay gelirse Parti 1: M8 kalanı (51, 53, 56, 57, 55) — 5'erli parti, aynı standart.
3. Entegrasyon işi ayrı paket olarak açılır (bu planın §2–6'sı).