# Daraltılmış tarama komutları 07–11

Her bölüm ayrı Qwen Code oturumunda (glm-5.3 · Medium) çalıştırılır. Oturuma yapıştırılacak komut:
`koordinasyon/TARAMA_KOMUTLARI.md dosyasında "## Parti NN" bölümünü ve altındaki "Ortak talimat"ı uygula.`

## Parti 07

Eserler (10): Q3228340 Q328523 Q3399440 Q3476580 Q3605055 Q3640080 Q3697588 Q3698260 Q3705703 Q3769169
Çıktı: `basyapit-dersleri/denetim/IC_TUTARLILIK_07.json` · commit adı: "İç tutarlılık 07"

## Parti 08

Eserler (10): Q3793426 Q3821820 Q3937621 Q3947103 Q3998957 Q3998985 Q4388208 Q45585 Q4693305 Q471379
Çıktı: `basyapit-dersleri/denetim/IC_TUTARLILIK_08.json` · commit adı: "İç tutarlılık 08"

## Parti 09

Eserler (10): Q500242 Q500985 Q512755 Q531329 Q540488 Q546297 Q5826309 Q5856992 Q5966403 Q63341
Çıktı: `basyapit-dersleri/denetim/IC_TUTARLILIK_09.json` · commit adı: "İç tutarlılık 09"

## Parti 10

Eserler (10): Q698487 Q700834 Q727875 Q764831 Q7731855 Q867403 Q890678 Q94802 Q956541 bacon
Çıktı: `basyapit-dersleri/denetim/IC_TUTARLILIK_10.json` · commit adı: "İç tutarlılık 10"

## Parti 11

Eserler (7): bosch dali domenico-di-michelino duccio hoch hogarth kauffman
Çıktı: `basyapit-dersleri/denetim/IC_TUTARLILIK_11.json` · commit adı: "İç tutarlılık 11"

## Ortak talimat

ÖN ADIM: `git checkout content-review && git pull`. Bu dosyayı ve yalnız kendi parti bölümünü oku; başka partinin eserlerine dokunma.

GÖREV: Partideki eserlerin ders dosyalarında (`basyapit-dersleri/eserler/<id>/`: DERS.json, DERS_BASLANGIC.md, DERS_ORTA.md, DERS_ILERI.md, SORULAR.json, KANIT_DOSYASI.md, KALITE_KONTROL.md) yalnız soru hatalarını ve gerçek çelişkileri listele. Hiçbir ders dosyasını değiştirme, yeni içerik yazma, internete çıkma. `basyapit-dersleri/denetim/` klasörünü ve bu dosya dışında `koordinasyon/` klasörünü OKUMA.

Yöntem: her eser için AYRI bir alt ajan başlat. Her alt ajan kendi eserinde:
1. SORULAR.json'daki her sorunun doğru cevabını, her şıkkı, gerekçeyi ve yanlış-gerekçelerini; tekrar kartlarının arka yüzünü derslerle karşılaştırsın.
2. Üç dersteki kişi, yer, sahne ve olay anlatımlarını birbiriyle ve DERS.json iddialarıyla karşılaştırsın.
TÜM alt ajanlar bitmeden dosya yazma ve commit atma. Bitince her eser için bulgu sayısını listele; yarıda kalan varsa yeniden tarat.

Aranacak türler (YALNIZ bu ikisi):
- C soru hatası: doğru cevap derslerle çelişiyor; birden fazla şık savunulabilir; gerekçe başka soruya/esere/sanatçıya ait ya da yanlış bir olgu söylüyor; yorum tek doğru cevap gibi soruluyor. Tekrar kartlarının (TK) arka yüzü dahil.
- E gerçek çelişki: aynı eser hakkında iki cümle farklı KİŞİ, YER, SAHNE ya da OLAY söylüyor (ör. bir derste "Beytüllahim'e varış", diğerinde "eve dönüş"; ya da İngilizce "by 1879" Türkçede "1879'a kadar" diye ters çevrilmiş).
- Bulgu DEĞİLDİR: yıl/ölçü/sayı farkları, "muhtemelen/c." nitelemelerinin düşmesi, etiket ([C###]) uyuşmazlıkları, üslup, KANIT/KALITE iç notları, dış doğrulama.

Kurallar: her bulgu için iki alıntı — tek satırdan, ≤200 karakter, dosyadan BİREBİR kopya; birebir alıntılayamıyorsan yazma. Emin değilsen yazma. onem: YÜKSEK (yanlış olgu öğretir ya da doğru cevabı yanlış sayar), ORTA, DÜŞÜK.

Çıktı biçimi: `[{"eser_id","tur","dosya_1","alinti_1","dosya_2","alinti_2","aciklama","onem"}]` (bulgu yoksa `[]`).

Bitince: tek commit (yalnız kendi JSON dosyan), sonra `git pull --rebase && git push`. Push reddedilirse (başka sekme aynı anda push etmiştir) aynı iki komutu tekrarla. Bana commit kimliğini, eser başına bulgu sayısını ve `git show --stat HEAD` çıktısını ver. Commit'te değişen dosya sayısı 1 olmalı; farklıysa push etme, bildir.
