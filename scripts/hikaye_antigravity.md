# Antigravity (Neon) için sanatçı hikâyesi istemi

Hikâyeler API'de sanatçı başına ~62 TL tutuyor (scripts/hikaye_uret.py); Antigravity'de Emre'nin abonelik kotasından
gider. Caravaggio denemesinde (PR #241) kalite API'ninkine yakındı, kaynaklar daha seçkindi; bir tarih hatası vardı
(annesinin ölümü), bu yüzden aşağıda kronoloji tablosu ve tarih/yaş denetimi zorunlu. Neon bitirince Claude hikâyeyi
okur, olgu hatalarını düzeltir, `scripts/hikaye_ekle.py` ile denetleyip ekler.

Kullanım: Antigravity'de `/clear`, sonra aşağıdaki bloğu yapıştır; `SANATCI` yerine kimliği yaz (ör. `claude-monet`,
kimlikler `data/sanatcilar.json`'da). Aynı anda birden çok sanatçı için: `SANATCI` yerine virgüllü liste ve "her biri için
ayrı ayrı" de.

```text
Görev: SANATCI için uzun, araştırmalı bir Türkçe sanatçı hikâyesi yaz (sanatçı kimliği; adı ve yılları data/sanatcilar.json'da).

ÇALIŞMA YERİ: ~/Desktop/sanat-atlasi'de başka işler çalışabilir; orada dal değiştirme, dosya düzenleme. Ayrı çalışma ağacında çalış:
- ../sanat-atlasi-ag yoksa: cd ~/Desktop/sanat-atlasi && git fetch origin main && git worktree add ../sanat-atlasi-ag -b neon/hikaye-SANATCI origin/main
- varsa: cd ~/Desktop/sanat-atlasi-ag && git fetch origin main && git checkout -B neon/hikaye-SANATCI origin/main
hikaye/ klasörüne ve data/sanatci_hikayeleri.json'a bakma.

1. ARAŞTIRMA (web araması zorunlu, en az 25 arama)
Müze siteleri ve katalogları, akademik biyografiler, Smarthistory, Grove/Oxford Art, sanatçının mektupları ve çağdaş belgeler, erken biyografiler. Wikipedia yalnız başlangıç.
Bul: hayatın 4–7 dönemi (yıl, yer, koşullar, dönemi bitiren kırılma anı); her dönemin resme etkisi (konu, palet, ışık, fırça, ölçek, ruh hali; somut); her dönemi gösteren eserler; az bilinen ama belgeli olaylar; BELGELİ / EFSANE / TARTIŞMALI ayrımı; diğer sanatçılarla bağlantılar (data/sanatcilar.json'daki adlarla); yaygın yanlışlar.
Dosyanın başına bir KRONOLOJİ TABLOSU koy: doğum, anne ve babanın ölümü, evlilikler, çocuklar, taşınmalar, önemli siparişler, hastalıklar, ölüm; her satırda tarih + kaynak adresi.
Çıktı: hikaye-deneme/SANATCI-arastirma.md. Her paragrafın sonunda gerçekten açtığın sayfaların GERÇEK adresleri.

2. ESERLER (doğruluk kuralı)
Sanatçının bizdeki eserleri: data/eserler_onbellek.json → sanatcilar.SANATCI.eserler (qid, baslik, baslikEn, yil). Eserlerin Türkçe adları data/eser_adlari_tr.json → adlar[qid]; metinde yalnız Türkçe adı kullan, İngilizce eser adı yazma. Hikâyede YALNIZ bu listedeki eserleri kullan, qid ile. Listede olmayan bir eseri sanatçının eseri gibi anma (başka sanatçıların eserleri karşılaştırma için anılabilir).

3. HİKÂYE
Yalnız araştırma dosyana dayan; dosyada olmayan olgu, tarih, isim, alıntı ekleme. Efsane ve tartışmalı olanı "anlatılır ki", "rivayete göre", "tarihçiler burada ayrılır" diye çerçevele.
- 5–7 bölüm; her bölüm bir kırılma anı, çarpıcı bir sahne ya da somut ayrıntıyla açılsın. Kuru biyografi değil, hikâye.
- Her bölümde olayın resme NASIL yansıdığını göster; okura o dönemin eserlerine "bak" dedirt (ışık, renk, yüz, boşluk, fırça). Bölüm başına 1–4 eser.
- Toplam 2200–3000 kelime; bölüm başına 4–6 paragraf, paragraflar 70–140 kelime.
- Sesli de okunacak: kısa ve orta cümleler, parantez/dipnot/kısaltma yok, yıllar rakamla, yabancı adlar ilk geçişte tam.
- Okura adıyla seslenme.
- Doğal, sıcak, akıcı Türkçe; çeviri kokmasın. "dahi, eşsiz, büyüleyici" gibi klişeler yok; çarpıcılık olgulardan gelsin.

4. DENETİM
- Hikâyedeki HER tarihi ve HER yaşı kronoloji tablosuyla karşılaştır; yaşları doğum yılından hesaplayarak doğrula ("on üç yaşında", "altı yaşındaki" gibi).
- Hikâyeyi araştırma dosyasıyla cümle cümle karşılaştır; dayanağı olmayan, abartılı ya da efsaneyi gerçek gibi anlatan cümleleri düzelt veya çıkar.
- Ne düzelttiğini hikaye-deneme/SANATCI-denetim.md'ye yaz.

5. ÇIKTI: hikaye-deneme/SANATCI.json, tam olarak bu yapı:
{ "baslik": "", "alt_baslik": "", "giris": ["paragraf"], "bolumler": [{ "baslik": "", "yillar": "1571–1592", "paragraflar": ["..."], "eserler": [{ "qid": "Q...", "bag": "bu eserin bu döneme bağı, 1–2 cümle" }] }], "kapanis": ["paragraf"], "baglantilar": [{ "sanatci": "ad", "iliski": "1–2 cümle" }], "kaynaklar": [{ "baslik": "Kurum — sayfa adı", "adres": "https://..." }] }
Sonra şunu çalıştır ve uyarıları gider (betik yoksa bu adımı atla): python3 scripts/hikaye_ekle.py hikaye-deneme/SANATCI.json --sanatci SANATCI

6. Dalda (neon/hikaye-SANATCI) commit et, push et, taslak PR aç. Commit: git -c user.name=emrymn -c user.email=emrymn@users.noreply.github.com commit ... Uygulama koduna ve data/ dosyalarına dokunma.
```
