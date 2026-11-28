# Denetim Raporu: `ayni-konu-venus-olympia`

## 1. Tarih ve Yaş Doğrulaması
- **Tiziano Vecellio (d. ~1488–1490 – ö. 1576):** 1538 yılında *Urbino Venüsü* tamamlandığında yaklaşık 48–50 yaşındaydı. Metinde "ellili yaşlarına yaklaşan Tiziano Vecellio" şeklinde doğrulandı.
- **Édouard Manet (d. 23 Ocak 1832 – ö. 30 Nisan 1883):** 1856 Floransa kopyasında 24 yaşında; 1863 *Olympia* ve *Çimenler Üzerinde Öğle Yemeği* yılında 31 yaşında; 1865 Paris Salonu'nda 33 yaşında. İki tablo arasındaki zaman farkı: `1863 - 1538 = 325` yıl. Metinde doğrulandı.
- **Victorine Meurent (d. 1844 – ö. 1927):** 1863 *Olympia* modellik döneminde 19 yaşında; 1876 Salon'undaki *Otoportre* sergisinde 32 yaşında. Doğrulandı.
- **Temel tarihler:** *Urbino Venüsü* ve Guidobaldo della Rovere'nin "la donna nuda" mektubu Mart 1538; Manet'nin Floransa kopyası 1856 (özel koleksiyonda); *Olympia* boyanışı 1863; Paris Salonu sergisi ve Zacharie Astruc şiiri Mayıs 1865; Meurent'in Salon sergisi 1876; Claude Monet'nin bağış kampanyası ve Lüksemburg Müzesi'ne giriş 1890; Georges Clemenceau emriyle Louvre'a geçiş 1907; Orsay Müzesi'ne taşınma 1986; Venedik'te iki tablonun yan yana sergilenmesi 2013; Denise Murrell *Posing Modernity* / *Le Modèle noir* sergileri 2018–2019.

## 2. Dizi Kuralı ve Kaynak Denetimi
- **Aynı Konu dizisi kuralı:** İki tablo yan yana okutuldu; dört somut görsel karşılaştırma (uyuyan sadakat köpeği vs. uyanık kara kedi, yumuşak davetkâr bakış ve gevşek el vs. doğrudan meydan okuyan bakış ve gergin el, sıcak altın ışık ve derin oda vs. düz ön ışık ve kapalı perde, çeyiz sandığı vs. müşteri buketi ve modern Paris süsleri) yapıldı; "hangisi daha iyi" hükmü verilmedi.
- **Kaynak URL denetimi:** `kaynaklar` listesinde `http://employees.oneonta.edu/...` adresi olduğu fark edildi; `scripts/dizi_ekle.py` tüm kaynak adreslerinin `https://` ile başlamasını şart koşuyor! Bu nedenle `http://` olan SUNY Oneonta adresi yerine `https://www.rrauction.com/auctions/lot-detail/348066406780413-claude-monet-letter-to-monet-on-manets-olympia/` veya `https://www.modernartappreciation.com/impressionism-1870-1890` kullanılacak (kontrol edilecek).

## 3. Eser ve Biçim Denetimi
- Tüm görsel eserler (`Q727875`, `Q500812`, `Q152509`, `Q737062`, `Q1245354`) `data/eserler_onbellek.json` katalogundan doğrulandı.
- Metinde yalnızca Türkçe eser adları kullanıldı (`Urbino Venüsü`, `Çimenler Üzerinde Öğle Yemeği`, `Olympia`).
- Parantez, dipnot, kısaltma ve yasaklı sıfat ("dahi", "eşsiz", "büyüleyici") bulunmadığı kontrol edildi.
