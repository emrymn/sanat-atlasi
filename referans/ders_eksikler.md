# Çalış · Ders düzeni: kaynak ve eksik raporu

`scripts/ders/kaynaklar.mjs` üretir (elle düzenlenmez). Kaynak haritası: `data/ders_kaynaklari.json`.

- **Gör:** dönemin yürüyüşü yazılmış eserleri (`yuruyus.json`).
- **Öğren:** "Nasıl tanınır?" maddeleri (`akim_ozellikleri.json`). "Kanıt adayı": maddenin anahtar sözcüklerinin bir eser metninde birlikte geçtiği cümle. Adaylar `data/ders_dogrulama.json`'da elle doğrulandı (cümleye göre; görsel ayrıca açılmadı). Ekranda yalnız `durum: dogrulandi` olanlar "bu özellik bu eserde" diye gösterilir; "Genel" adaylar esere bağlı değildir (sanatçının tanıma metni ya da dönem metni), açıklama olarak kullanılabilir.
- **Ayırt et:** komşu akımlar (`akimlar.json`). Fark tablosu yeni metin yazmadan iki akımın "Nasıl tanınır?" maddeleriyle yan yana kurulabilir (uygulamadaki akım karşılaştırma sayfası da böyle). Karşılaştırma cümlesi: `akim_bilgi.json`'da öteki akımın adının geçtiği cümle.
- **Sına · "Neden?":** sanatçının `taninma`, tanıma notu ya da `kurs_notu` metni.

## Özet

| Akım | Sanatçı | Gör (yürüyüş) | Öğren (doğrulanmış eser kanıtı olan / madde) | Ayırt et (cümlesi olan / komşu) | Sına ("Neden?" kaynağı olmayan) |
|---|---|---|---|---|---|
| Gotik | 9 | 9 eser | 5 / 7 | 1 / 1 | – |
| Erken Rönesans | 8 | 8 eser | 4 / 4 | 2 / 3 | – |
| Kuzey Rönesansı | 11 | 11 eser | 3 / 4 | 2 / 3 | – |
| Yüksek Rönesans | 6 | 6 eser | 4 / 4 | 3 / 3 | – |
| Venedik Rönesansı | 5 | 5 eser | 3 / 4 | 2 / 2 | – |
| Maniyerizm | 9 | 9 eser | 3 / 4 | 3 / 3 | – |
| İtalyan Barok ve Caravaggizm | 13 | 13 eser | 3 / 4 | 1 / 5 | – |
| İspanyol Barok | 2 | 2 eser | 1 / 4 | 0 / 2 | – |
| Flaman Barok | 2 | 2 eser | 3 / 4 | 1 / 2 | – |
| Hollanda Altın Çağı | 5 | 5 eser | 3 / 4 | 1 / 3 | – |
| Fransız Klasisizmi | 4 | 4 eser | 3 / 4 | 2 / 4 | – |
| Geç İtalyan Barok | 10 | 10 eser | 4 / 4 | 2 / 3 | – |
| Rokoko | 9 | 9 eser | 3 / 4 | 3 / 3 | – |
| Neoklasisizm | 4 | 4 eser | 3 / 4 | 2 / 3 | – |
| Romantizm | 8 | 8 eser | 4 / 4 | 3 / 3 | – |
| Prerafaelitler | 3 | 3 eser | 3 / 4 | 2 / 3 | – |
| Akademizm ve Oryantalizm | 4 | 4 eser | 4 / 4 | 0 / 3 | – |
| Barbizon ve Realizm | 5 | 5 eser | 4 / 4 | 2 / 2 | – |
| Empresyonizm | 9 | 9 eser | 2 / 4 | 2 / 2 | – |
| Ukiyo-e (Japon baskısı) | 2 | 2 eser | 2 / 4 | 0 / 2 | – |
| Post-Empresyonizm | 6 | 6 eser | 2 / 4 | 2 / 3 | – |
| Sembolizm | 5 | 5 eser | 3 / 4 | 2 / 3 | – |
| Art Nouveau ve Viyana Secession | 1 | 1 eser | 1 / 4 | 2 / 2 | – |
| Ekspresyonizm | 5 | 4 eser | 2 / 4 | 2 / 3 | – |
| Kübizm | 1 | 1 eser | 1 / 4 | 1 / 2 | – |
| Dada | 4 | **yok** | 1 / 4 | 2 / 2 | – |
| Sürrealizm | 4 | **yok** | 4 / 4 | 2 / 2 | – |
| Savaş sonrası figürasyon | 1 | **yok** | 2 / 4 | 0 / 2 | – |

Toplam: 28 ders. Gör verisi olmayan akım: Dada, Sürrealizm, Savaş sonrası figürasyon. Doğrulanmış eser kanıtı olmayan "Nasıl tanınır?" maddesi: 35 / 115. Adayların doğrulaması: dogrulandi 406, yanlis 62, belirsiz 45. Karşılaştırma cümlesi olmayan komşu çifti: 27 / 74. "Neden?" kaynağı olmayan sanatçı: 0.

## Ayrıntı

### Gotik

- Gör: Annunciation (triptik) (simone-martini, 1333; 6 nokta, rehberli inceleme de var) · The Nativity with the Prophets Isaiah and Ezekiel (duccio-di-buoninsegna, 1308; 6 nokta) · The Fall of the Rebel Angels (limbourg-kardesler, 1411; 5 nokta)
- Öğren 1. "Altın zemin ve ahşap pano üzerine tempera": Assisi'li Aziz Franciscus ve Yaşamından Sahneler (basyapitlar.json, Ne görüyoruz?) · Painted crucifix (eser_notlari.json, eser notu) · The Madonna and Child in Majesty Surrounded by Angels (yuruyus.json, Taht) · Santa Croce Çarmıhı (basyapitlar.json, özet) · İsa'nın Kudüs'e Girişi (basyapitlar.json, özet) · Saint Margaret or Agatha (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 2. "Uzun, ince, biraz düz figürler; Bizans etkisi": The Madonna and Child in Majesty Surrounded by Angels (yuruyus.json, Meryem'in yüzü) · Assisi'li Aziz Franciscus (eser_ayrintilari.json, Yüz) · Diptych: Crucifixion (eser_notlari.json, eser notu) · Crucifix (eser_notlari.json, eser notu) · The Virgin and Child with Two Angels (eser_notlari.json, eser notu) · Madonna ve çocuk (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 3. "Altın çizgilerle işlenmiş kumaş kıvrımları": **doğrulanmış eser kanıtı yok** · genel açıklama 2
- Öğren 4. "Meryem ve Çocuk, boyalı haç, sunak resmi": Meryem'in Doğumu (basyapitlar.json, özet) · Aziz Maxima ve Aziz Ansanus ile Müjde (Triptik) (basyapitlar.json, özet) · Coronation of the Virgin with Saints (Valle Romita Polyptych) (eser_notlari.json, eser notu) · St. Francis freski (Alt Kilise) (eser_notlari.json, eser notu) · Maestà di Santa Maria dei Servi (eser_notlari.json, eser notu) · The Virgin and Child with Two Angels (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 5. "Zarif, kıvrımlı çizgiler ve süslü giysiler (Uluslararası Gotik)": April (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 6. "Saray hayatı, at, av ve ayrıntılı doğa (Uluslararası Gotik)": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Öğren 7. "Minyatür inceliğinde el yazmaları (Uluslararası Gotik)": Şubat (basyapitlar.json, Ne görüyoruz?) · genel açıklama 1
- Ayırt et ↔ Erken Rönesans: The Madonna and Child in Majesty Surrounded by Angels ↔ The Tribute Money; 2 karşılaştırma cümlesi; özellik maddeleri 7 / 4

### Erken Rönesans

- Gör: İsa'nın Anahtarları Petrus'a Vermesi (Perugino) (pietro-perugino, 1480; 5 nokta, rehberli inceleme de var) · Dante Alighieri with Florence and the Realms of the Divine Comedy (Hell, Purgatory, Paradise) (domenico-di-michelino, 1465; 6 nokta) · Saint Jerome in the desert (andrea-mantegna, 1449; 6 nokta)
- Öğren 1. "Tek kaçış noktalı doğrusal perspektif": The Hunt in the Forest (eser_notlari.json, eser notu) · Vergi Parası (basyapitlar.json, Kompozisyon, ışık ve renk) · İsa'nın Anahtarları Petrus'a Vermesi (basyapitlar.json, Kompozisyon, ışık ve renk) · The Tribute Money (eser_notlari.json, eser notu) · Meryem'e Müjde (basyapitlar.json, Kompozisyon, ışık ve renk) · The Holy Trinity (fresk) (yuruyus.json, Tonozlu tavan) · genel açıklama 1
- Öğren 2. "Antik mimari ve heykelden alınmış hacimli figürler": Vergi Parası (basyapitlar.json, Kompozisyon, ışık ve renk) · Virgin and Child Enthroned with Four Angels (yuruyus.json, Klasik mimari)
- Öğren 3. "Net çizgiler, berrak ve eşit ışık": İsa'nın Anahtarları Petrus'a Vermesi (basyapitlar.json, Kompozisyon, ışık ve renk) · Meryem'e Müjde (basyapitlar.json, Kompozisyon, ışık ve renk) · genel açıklama 1
- Öğren 4. "Dini sahnelerde gerçekçi mekân ve portre": St. Peter Healing the Sick with His Shadow (eser_notlari.json, eser notu)
- Ayırt et ↔ Gotik: The Tribute Money ↔ The Madonna and Child in Majesty Surrounded by Angels; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 7
- Ayırt et ↔ Yüksek Rönesans: The Tribute Money ↔ Madonna of the Goldfinch; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Venedik Rönesansı: The Tribute Money ↔ Venus of Urbino; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Kuzey Rönesansı

- Gör: Arnolfini Portrait (jan-van-eyck, 1434; 6 nokta, rehberli inceleme de var) · Elçiler (hans-holbein-genc, 1533; 6 nokta, rehberli inceleme de var) · The fountain of youth (lucas-cranach-yasl, 1546; 6 nokta)
- Öğren 1. "Yağlı boyada inanılmaz ayrıntı (kumaş, metal, cam)": Elçiler (The Ambassadors) (basyapitlar.json, Kompozisyon, ışık ve renk) · genel açıklama 2
- Öğren 2. "Gizli simgelerle dolu gündelik nesneler": Mérode Altarpiece (eser_notlari.json, eser notu) · Mérode Triptiği (basyapitlar.json, Anlam ve semboller) · The Annunciation (eser_notlari.json, eser notu) · Elçiler (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 3. "Pencereden görünen manzara, iç mekân ışığı": Death of the Virgin (eser_notlari.json, eser notu) · Self-Portrait (eser_notlari.json, eser notu) · Donor Henri de Werl, protected by St. John the Baptist (yuruyus.json, Pencereler) · Mérode Triptiği (eser_ayrintilari.json, Pencereden kent) · Madonna ve çocuk (eser_notlari.json, eser notu) · genel açıklama 1
- Öğren 4. "Ciddi, gerçekçi, idealleştirilmemiş yüzler": **doğrulanmış eser kanıtı yok**
- Ayırt et ↔ Gotik: Arnolfini Portrait ↔ The Madonna and Child in Majesty Surrounded by Angels; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 7
- Ayırt et ↔ Erken Rönesans: Arnolfini Portrait ↔ The Tribute Money; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Flaman Barok: Arnolfini Portrait ↔ The Rape of the Daughters of Leucippus; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Yüksek Rönesans

- Gör: Christ at the Column (donato-bramante, 1487; 6 nokta, rehberli inceleme de var) · The Judgment of Paris (baskı) (marcantonio-raimondi, 1510; 6 nokta, rehberli inceleme de var) · The School of Athens (Atina Okulu) (raphael, 1512; 6 nokta, rehberli inceleme de var)
- Öğren 1. "Piramit biçimli, dengeli kompozisyon": The Virgin and Child with Saint Anne için cartoon (hazırlık çizimi) (eser_notlari.json, eser notu) · Madonna of the Goldfinch (eser_notlari.json, eser notu) · Alba Meryemi (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 2. "Sfumato: yumuşak geçişli gölgeler": The Virgin and Child with Saint Anne için cartoon (hazırlık çizimi) (eser_notlari.json, eser notu) · Jupiter and Io (yuruyus.json, Belini saran el) · Jüpiter ve Io (eser_ayrintilari.json, Belini saran el) · Leda ve Kuğu (eser_notlari.json, eser notu) · Portrait of a Woman (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 3. "İdeal güzellik ve sakin, ağırbaşlı figürler": Vitruvian Man (eser_notlari.json, eser notu) · Galatea (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 4. "Anatomiye hâkim, heykel gibi bedenler": Sütundaki İsa (basyapitlar.json, özet) · Âdem'in Yaratılışı (basyapitlar.json, Kompozisyon, ışık ve renk) · The Judgment of Paris (baskı) (yuruyus.json, Venüs ve Cupid) · Paris'in Hükmü (eser_ayrintilari.json, Venüs ve Cupid) · genel açıklama 1
- Ayırt et ↔ Erken Rönesans: Madonna of the Goldfinch ↔ The Tribute Money; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Venedik Rönesansı: Madonna of the Goldfinch ↔ Venus of Urbino; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Maniyerizm: Madonna of the Goldfinch ↔ Deposition; 3 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Venedik Rönesansı

- Gör: Bacchus ve Ariadne (titian, 1520; 7 nokta) · Saint George and the Dragon (tintoretto, 1555; 5 nokta) · Kana'da Düğün (paolo-veronese, 1562; 6 nokta, rehberli inceleme de var)
- Öğren 1. "Çizgiden çok renk (colore): sıcak, doygun tonlar": Urbino Venüsü (Venus of Urbino) (basyapitlar.json, Kompozisyon, ışık ve renk) · genel açıklama 1
- Öğren 2. "Yumuşak ışık ve atmosferli manzara": Çobanların Tapınması (eser_notlari.json, eser notu) · Madonna del Prato (Bellini) (eser_notlari.json, eser notu) · Saint Francis in the Desert (eser_notlari.json, eser notu) · Yudit (yuruyus.json, Manzara) · genel açıklama 3
- Öğren 3. "Görünür fırça izi, tuval üzerine yağlı boya": **doğrulanmış eser kanıtı yok** · genel açıklama 2
- Öğren 4. "Çıplak figür, mitoloji ve şölen sahneleri": The Feast of the Gods (eser_notlari.json, eser notu) · Naked Young Woman in Front of the Mirror (eser_notlari.json, eser notu) · The Feast of the Gods (eser_notlari.json, eser notu)
- Ayırt et ↔ Yüksek Rönesans: Venus of Urbino ↔ Madonna of the Goldfinch; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Maniyerizm: Venus of Urbino ↔ Deposition; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Maniyerizm

- Gör: Anguissola kardeşlerin portresi (oyun oynayan kardeşler) (sofonisba-anguissola, 1555; 6 nokta, rehberli inceleme de var) · The Burial of the Count of Orgaz (el-greco, 1586; 6 nokta, rehberli inceleme de var) · Deposition (jacopo-pontormo, 1525; 5 nokta, rehberli inceleme de var)
- Öğren 1. "Uzatılmış boyunlar ve uzuvlar": **doğrulanmış eser kanıtı yok**
- Öğren 2. "Asitli, yapay renkler (pembe, nane yeşili)": Deposition of Christ (eser_notlari.json, eser notu) · Çarmıhtan İndiriliş (basyapitlar.json, Kompozisyon, ışık ve renk) · Aziz Thomas'ın Şüphesi (basyapitlar.json, Kompozisyon, ışık ve renk) · genel açıklama 1
- Öğren 3. "Kıvrılan figürler, sıkışık ya da boş merkezli kompozisyon": Çarmıhtan İndiriliş (eser_notlari.json, eser notu) · Deposition from the Cross (eser_notlari.json, eser notu) · Deposition of Christ (eser_notlari.json, eser notu) · Bir Alegori (Venüs, Aşk Tanrısı, Zaman ve Akılsızlık) (basyapitlar.json, Kompozisyon, ışık ve renk) · Deposition (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 4. "Soğuk, tedirgin ya da zarif-yapay bir hava": Çarmıhtan İndiriliş (basyapitlar.json, Kompozisyon, ışık ve renk) · Portrait of Bartolomeo Panciatichi (eser_notlari.json, eser notu) · Carlo Rimbotti (1518–1591) (eser_notlari.json, eser notu) · Aziz Thomas'ın Şüphesi (basyapitlar.json, Kompozisyon, ışık ve renk)
- Ayırt et ↔ Yüksek Rönesans: Deposition ↔ Madonna of the Goldfinch; 3 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Venedik Rönesansı: Deposition ↔ Venus of Urbino; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: Deposition ↔ Supper at Emmaus; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### İtalyan Barok ve Caravaggizm

- Gör: The Lute Player (orazio-gentileschi, 1612; 6 nokta, rehberli inceleme de var) · Assumption of the Virgin (annibale-carracci, 1587; 5 nokta) · The Conversion of Saint Paul (caravaggio, 1600; 5 nokta)
- Öğren 1. "Tenebrizm: zifiri karanlıkta sert spot ışığı": Holofernes'in Kafasını Kesen Judith (basyapitlar.json, Kompozisyon, ışık ve renk) · Emmaus'ta Akşam Yemeği (basyapitlar.json, Kompozisyon, ışık ve renk) · genel açıklama 1
- Öğren 2. "Sokaktan alınmış gerçekçi, kirli ayaklı modeller": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Öğren 3. "En dramatik an; izleyiciye taşan hareket": Massacre of the Innocents (eser_notlari.json, eser notu) · Judith and Holofernes (eser_notlari.json, eser notu) · Women Gladiators (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 4. "Çapraz kompozisyon, yakın plan figürler": David and Goliath (eser_notlari.json, eser notu) · Arrest of Christ (eser_notlari.json, eser notu) · Saints Peter and Paul (eser_notlari.json, eser notu) · Kratos Prometheus’u zincirlerken (eser_notlari.json, eser notu) · Concert (eser_notlari.json, eser notu) · Pezevenk Kadın (basyapitlar.json, özet)
- Ayırt et ↔ İspanyol Barok: Supper at Emmaus ↔ Agnus Dei; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Flaman Barok: Supper at Emmaus ↔ The Rape of the Daughters of Leucippus; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Hollanda Altın Çağı: Supper at Emmaus ↔ Açık Pencere Önünde Mektup Okuyan Kız; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Maniyerizm: Supper at Emmaus ↔ Deposition; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Geç İtalyan Barok: Supper at Emmaus ↔ Apotheosis of Saint Ignatius; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### İspanyol Barok

- Gör: Las Meninas (The Maids of Honor) (diego-velazquez, 1656; 6 nokta) · The Defense of Cadiz Against the English (francisco-de-zurbaran, 1634; 5 nokta)
- Öğren 1. "Karanlık zemin, sert ve sade ışık": The Lunch (eser_notlari.json, eser notu) · Tanrı'nın Kuzusu (eser_ayrintilari.json, Yün bukleleri) · Crucifixion of Christ (eser_notlari.json, eser notu) · Still Life with Lemons, Oranges and a Rose (eser_notlari.json, eser notu) · Tanrı'nın Kuzusu (Agnus Dei) (basyapitlar.json, özet) · genel açıklama 2
- Öğren 2. "Derin dindarlık: azizler, çileciler, natürmort": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Öğren 3. "Saray portrelerinde gümüşi gri tonlar (Velázquez)": **doğrulanmış eser kanıtı yok**
- Öğren 4. "Gerçekçi, ağırbaşlı ve sessiz figürler": **doğrulanmış eser kanıtı yok** · genel açıklama 2
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: Agnus Dei ↔ Supper at Emmaus; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Hollanda Altın Çağı: Agnus Dei ↔ Açık Pencere Önünde Mektup Okuyan Kız; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Flaman Barok

- Gör: The Fall of the Damned (peter-paul-rubens, 1621; 4 nokta) · The Vision of the Blessed Hermann Joseph (anthony-van-dyck, 1629; 4 nokta)
- Öğren 1. "Etli, canlı, hareketli bedenler (Rubens)": The Rape of the Daughters of Leucippus (eser_notlari.json, eser notu) · The Fall of the Damned (yuruyus.json, Düşen bedenler) · The Three Graces (eser_notlari.json, eser notu) · Romulus and Remus (eser_notlari.json, eser notu) · Çarmıhın Dikilişi (basyapitlar.json, Neden önemli?) · Drunken Silenus (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 2. "Sıcak renkler, kıvrılan diyagonal kompozisyon": Romulus and Remus (eser_notlari.json, eser notu) · The Rape of the Daughters of Leucippus (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 3. "Zengin portreler, ipek ve dantel (van Dyck)": Lord John Stuart and His Brother, Lord Bernard Stuart (eser_notlari.json, eser notu) · Portrait of Lady Theresa Shirley (eser_notlari.json, eser notu) · genel açıklama 1
- Öğren 4. "Av, mitoloji ve büyük sunak resimleri": **doğrulanmış eser kanıtı yok** · genel açıklama 2
- Ayırt et ↔ Hollanda Altın Çağı: The Rape of the Daughters of Leucippus ↔ Açık Pencere Önünde Mektup Okuyan Kız; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: The Rape of the Daughters of Leucippus ↔ Supper at Emmaus; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Hollanda Altın Çağı

- Gör: The Return of the Prodigal Son (rembrandt-van-rijn, 1668; 6 nokta, rehberli inceleme de var) · Açık Pencere Önünde Mektup Okuyan Kız (johannes-vermeer, 1658; 5 nokta) · Young Man and Woman in an Inn (frans-hals, 1623; 5 nokta)
- Öğren 1. "Gündelik hayat (janr), iç mekân, natürmort": Merrymakers at Shrovetide (eser_notlari.json, eser notu) · A Mayor of Delft and his Daughter (eser_notlari.json, eser notu) · Aziz Nicholas Yortusu (basyapitlar.json, Neden önemli?) · Woman with a Water Jug (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 2. "Pencereden süzülen sakin ışık (Vermeer)": The Astronomer (eser_notlari.json, eser notu) · Süt Boşaltan Kadın (eser_ayrintilari.json, Sepet ve bakır kova) · Açık Pencere Önünde Mektup Okuyan Kız (eser_notlari.json, eser notu) · Woman with a Water Jug (eser_notlari.json, eser notu) · The Geographer (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 3. "Grup portreleri ve derin ışık-gölge (Rembrandt)": Gece Devriyesi (eser_notlari.json, eser notu) · Militia Company of District XI under the Command of Captain Reynier Reael (eser_notlari.json, eser notu) · Regentesses of the Old Men's Alms House (eser_notlari.json, eser notu) · The Banquet of the Officers of the St George Militia Company in 1616 (eser_notlari.json, eser notu) · Susanna and the Elders (eser_notlari.json, eser notu) · Dr. Nicolaes Tulp'un Anatomi Dersi (eser_notlari.json, eser notu) · genel açıklama 1
- Öğren 4. "Küçük boy, burjuva alıcı için resim": **doğrulanmış eser kanıtı yok** · genel açıklama 2
- Ayırt et ↔ Flaman Barok: Açık Pencere Önünde Mektup Okuyan Kız ↔ The Rape of the Daughters of Leucippus; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İspanyol Barok: Açık Pencere Önünde Mektup Okuyan Kız ↔ Agnus Dei; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: Açık Pencere Önünde Mektup Okuyan Kız ↔ Supper at Emmaus; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Fransız Klasisizmi

- Gör: Portrait of Louis XIV (hyacinthe-rigaud, 1701; 6 nokta, rehberli inceleme de var) · The King governs by himself, 1661 (charles-le-brun, 1681; 5 nokta) · The Agony in the Garden (nicolas-poussin, 1626; 4 nokta)
- Öğren 1. "Düzenli, yatay, sahne gibi kompozisyon": Bacchanal Before a Statue of Pan (eser_notlari.json, eser notu) · The Adoration of the Golden Calf (eser_notlari.json, eser notu) · Landscape with Polyphemus (eser_notlari.json, eser notu) · Arkadya'da Ben de Varım (Et in Arcadia ego) (basyapitlar.json, Kompozisyon, ışık ve renk) · Landscape with the Finding of Moses (yuruyus.json, Ağaçların çerçevesi) · The Adoration of the Shepherds (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 2. "Antik ve İncil konuları, ders veren anlatı": **doğrulanmış eser kanıtı yok**
- Öğren 3. "Serin renkler, net çizgi, idealize manzara": Saba Melikesi'nin Gemiye Binişi (eser_ayrintilari.json, Sandık yükleyen hamallar) · The Abduction of Europa (eser_notlari.json, eser notu) · Landscape with the Burial of Saint Serapia (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 4. "Duygudan çok akıl ve ölçü": Arkadya'da Ben de Varım (eser_ayrintilari.json, Düşünceli çoban) · genel açıklama 2
- Ayırt et ↔ Rokoko: Et in Arcadia Ego ↔ The Swing; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: Et in Arcadia Ego ↔ Supper at Emmaus; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Neoklasisizm: Et in Arcadia Ego ↔ The Oath of the Horatii; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Geç İtalyan Barok: Et in Arcadia Ego ↔ Apotheosis of Saint Ignatius; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Geç İtalyan Barok

- Gör: Feast of Herod (mattia-preti, 1658; 5 nokta) · Searching for Fleas (giuseppe-maria-crespi, 1720; 5 nokta) · Allegory of Fortune (salvator-rosa, 1658; 4 nokta)
- Öğren 1. "Tavanlarda gökyüzüne açılan yanılsama (quadratura)": Apotheosis of Saint Ignatius (yuruyus.json, Göğe açılan tavan) · Allegory of the Jesuits' Missionary Work (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 2. "Açık, havadar renkler, uçan figürler": The Marriage of the Virgin (eser_notlari.json, eser notu) · Bathsheba at Her Bath (eser_notlari.json, eser notu) · Apotheosis of Saint Sebastian (eser_notlari.json, eser notu) · Bathsheba at her bath (eser_notlari.json, eser notu) · genel açıklama 1
- Öğren 3. "Venedik manzaraları (veduta) ve kalabalık şölenler": The Wedding at Cana (eser_notlari.json, eser notu)
- Öğren 4. "Teatral, dekoratif büyük ölçek": Feast of Herod (yuruyus.json, Arkadaki seyirciler)
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: Apotheosis of Saint Ignatius ↔ Supper at Emmaus; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Rokoko: Apotheosis of Saint Ignatius ↔ The Swing; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Fransız Klasisizmi: Apotheosis of Saint Ignatius ↔ Et in Arcadia Ego; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Rokoko

- Gör: Pilgrimage to the Island of Cythera (jean-antoine-watteau, 1717; 6 nokta, rehberli inceleme de var) · The Triumph of Venus (francois-boucher, 1740; 5 nokta) · Before (william-hogarth, 1731; 4 nokta)
- Öğren 1. "Pastel tonlar: pembe, açık mavi, krem": Juno in the Clouds (eser_notlari.json, eser notu) · The Birth of Venus (eser_notlari.json, eser notu) · The Triumph of Venus (eser_notlari.json, eser notu) · Venus Consoling Love (eser_notlari.json, eser notu) · Cupid Crowned by Psyche (eser_notlari.json, eser notu) · Salıncak (L'Escarpolette) (basyapitlar.json, Kompozisyon, ışık ve renk) · genel açıklama 3
- Öğren 2. "Hafif, oyunbaz aşk ve bahçe sahneleri (fête galante)": Jupiter and Callisto (eser_notlari.json, eser notu) · The Progress of Love (slaytta: The Meeting, from Love of the Shepherds) (eser_notlari.json, eser notu) · The Stolen Kiss (eser_notlari.json, eser notu) · Blind Man's Bluff (eser_notlari.json, eser notu) · The See-Saw (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 3. "Kıvrımlı, asimetrik süsleme": **doğrulanmış eser kanıtı yok**
- Öğren 4. "Aristokrat zarafeti, tüy gibi fırça": Venus Consoling Love (eser_notlari.json, eser notu)
- Ayırt et ↔ Fransız Klasisizmi: The Swing ↔ Et in Arcadia Ego; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Neoklasisizm: The Swing ↔ The Oath of the Horatii; 3 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Geç İtalyan Barok: The Swing ↔ Apotheosis of Saint Ignatius; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Neoklasisizm

- Gör: İmparator Napolyon Tuileries'deki Çalışma Odasında (jacques-louis-david, 1812; 5 nokta) · Colonel Guy Johnson and Karonghyontye (benjamin-west, 1776; 4 nokta) · Telemachus and the Nymphs of Calypso (angelica-kauffman, 1782; 4 nokta)
- Öğren 1. "Keskin çizgi, pürüzsüz yüzey, görünmez fırça": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Öğren 2. "Antik Roma ve Yunan konuları; erdem ve fedakârlık": Cornelia, Mother of the Gracchi (slaytta: Cornelia Pointing to Her Children as Her Treasures) (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 3. "Friz gibi yatay, sahne düzeni": Gracchusların Annesi Kornelia (basyapitlar.json, Kompozisyon, ışık ve renk) · genel açıklama 1
- Öğren 4. "Sert, berrak ışık; heykel gibi figürler": Horas Kardeşlerin Yemini (Le Serment des Horaces) (basyapitlar.json, özet) · genel açıklama 1
- Ayırt et ↔ Rokoko: The Oath of the Horatii ↔ The Swing; 3 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Akademizm ve Oryantalizm: The Oath of the Horatii ↔ La Grande Odalisque (Large Odalisque); 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Romantizm: The Oath of the Horatii ↔ Bulutların Üzerinde Yolculuk; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Romantizm

- Gör: Bulutların Üzerinde Yolculuk (caspar-david-friedrich, 1818; 6 nokta, rehberli inceleme de var) · The Raft of the Medusa (theodore-gericault, 1819; 6 nokta, rehberli inceleme de var) · The Fighting Temeraire (j-m-w-turner, 1839; 5 nokta)
- Öğren 1. "Duygu, tutku ve fırtına; dramatik doğa": Snow Storm: Hannibal and his Army Crossing the Alps (eser_notlari.json, eser notu) · Salisbury Cathedral from the Meadows (eser_notlari.json, eser notu) · Hadleigh Castle, The Mouth of the Thames--Morning after a Stormy Night (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 2. "Serbest, hareketli fırça ve güçlü renk": Weymouth Bay: Bowleaze Cove and Jordon Hill (eser_notlari.json, eser notu) · Hadleigh Castle, The Mouth of the Thames--Morning after a Stormy Night (eser_notlari.json, eser notu) · Portrait of Paganini (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 3. "Yüce (sublime): insan doğa karşısında küçük": Mountain Landscape with Rainbow (eser_notlari.json, eser notu) · Deniz Kenarında Keşiş (eser_notlari.json, eser notu) · Sis Denizi Üzerinde Gezgin (Der Wanderer über dem Nebelmeer) (basyapitlar.json, Anlam ve semboller) · Burning of the Houses of Parliament (eser_notlari.json, eser notu) · Köle Gemisi (The Slave Ship) (basyapitlar.json, Anlam ve semboller)
- Öğren 4. "Egzotik, tarihî ve güncel trajik konular": Medusa'nın Salı (Le Radeau de la Méduse) (basyapitlar.json, özet) · Halka Yol Gösteren Özgürlük (basyapitlar.json, Neden önemli?) · genel açıklama 2
- Ayırt et ↔ Neoklasisizm: Bulutların Üzerinde Yolculuk ↔ The Oath of the Horatii; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Prerafaelitler: Bulutların Üzerinde Yolculuk ↔ Mariana; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Barbizon ve Realizm: Bulutların Üzerinde Yolculuk ↔ The Gleaners; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Prerafaelitler

- Gör: The Lady of Shalott (william-holman-hunt, 1890; 5 nokta) · Proserpine (dante-gabriel-rossetti, 1874; 5 nokta) · Mariana (john-everett-millais, 1851; 5 nokta)
- Öğren 1. "Parlak, saf renkler; beyaz zemin üzerine": Ophelia (eser_ayrintilari.json, Eğik söğüt) · The Hireling Shepherd (eser_notlari.json, eser notu) · Valentine Rescuing Sylvia from Proteus (eser_notlari.json, eser notu) · The Girlhood of Mary Virgin (eser_notlari.json, eser notu) · Mariana (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 2. "Her yaprağı tek tek çizilmiş doğa ayrıntısı": Mariana (yuruyus.json, Sunak) · Ophelia (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 3. "Orta Çağ efsaneleri, Shakespeare, uzun saçlı kadınlar": **doğrulanmış eser kanıtı yok** · genel açıklama 2
- Öğren 4. "Düz, keskin ışık; simgelerle dolu sahne": The Girlhood of Mary Virgin (eser_notlari.json, eser notu) · genel açıklama 1
- Ayırt et ↔ Romantizm: Mariana ↔ Bulutların Üzerinde Yolculuk; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Sembolizm: Mariana ↔ The Apparition; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Akademizm ve Oryantalizm: Mariana ↔ La Grande Odalisque (Large Odalisque); 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Akademizm ve Oryantalizm

- Gör: The Dream of Ossian (jean-auguste-dominique-ingres, 1813; 4 nokta) · The Carpet Merchant (jean-leon-gerome, 1887; 4 nokta) · Dante and Virgil in Hell (william-adolphe-bouguereau, 1850; 5 nokta)
- Öğren 1. "Kusursuz, cilalı yüzey ve akademik çizim": Venus Rising (eser_notlari.json, eser notu) · Köle Pazarı (basyapitlar.json, Kompozisyon, ışık ve renk) · Venüs'ün Doğuşu (basyapitlar.json, özet) · The Source (eser_notlari.json, eser notu) · Venüs'ün Doğuşu (Cabanel) (eser_notlari.json, eser notu) · Pygmalion and Galatea by Jean-Léon Gérôme (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 2. "Mitoloji, tarih ve idealize çıplak": Echo (eser_notlari.json, eser notu) · The Source (eser_notlari.json, eser notu) · Nymph abducted by a faun (eser_notlari.json, eser notu) · Slave Market in Rome (eser_notlari.json, eser notu) · Köle Pazarı (basyapitlar.json, özet) · genel açıklama 3
- Öğren 3. "Doğu sahneleri: hamam, çarşı, harem (hayalî)": Büyük Odalık (eser_ayrintilari.json, Nargile ve tütsü) · Büyük Odalık (La Grande Odalisque) (basyapitlar.json, Ne görüyoruz?) · The Carpet Merchant (yuruyus.json, Tüccarlar ve alıcılar) · Köle Pazarı (basyapitlar.json, Anlam ve semboller) · genel açıklama 1
- Öğren 4. "Fotoğraf gibi ayrıntı, teatral kurgu": Köle Pazarı (basyapitlar.json, Neden önemli?) · genel açıklama 1
- Ayırt et ↔ Neoklasisizm: La Grande Odalisque (Large Odalisque) ↔ The Oath of the Horatii; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Romantizm: La Grande Odalisque (Large Odalisque) ↔ Bulutların Üzerinde Yolculuk; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Prerafaelitler: La Grande Odalisque (Large Odalisque) ↔ Mariana; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Barbizon ve Realizm

- Gör: Ornans'ta Cenaze (gustave-courbet, 1840; 6 nokta, rehberli inceleme de var) · The Connoisseur (honore-daumier, 1855; 4 nokta) · The Gleaners (jean-francois-millet, 1857; 6 nokta, rehberli inceleme de var)
- Öğren 1. "Köylü, işçi ve sıradan insanın gündelik hayatı": Üçüncü Mevki Vagon (basyapitlar.json, Neden önemli?) · Başak Toplayanlar (Des glaneuses) (basyapitlar.json, Neden önemli?) · genel açıklama 2
- Öğren 2. "Toprak renkleri: kahve, okra, yeşil": The Edge of the Woods at Monts-Girard, Fontainebleau Forest (eser_notlari.json, eser notu) · The Emigrants (eser_notlari.json, eser notu) · Üçüncü Mevki Vagon (basyapitlar.json, Kompozisyon, ışık ve renk) · An Old Chapel in a Valley (eser_notlari.json, eser notu) · An Early Summer Morning in the Forest of Fontainebleau (eser_notlari.json, eser notu) · Shepherdess with her Flock (eser_notlari.json, eser notu) · genel açıklama 3
- Öğren 3. "Açık havada doğa; orman ve tarla": Diana and Actaeon (Diana Surprised in Her Bath) (yuruyus.json, Su) · The Bridge at Narni (eser_notlari.json, eser notu) · The Forest of Fontainebleau: Morning (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 4. "İdealize etmeden, ağır ve gerçek": Başak Toplayanlar (Des glaneuses) (basyapitlar.json, Neden önemli?) · genel açıklama 1
- Ayırt et ↔ Romantizm: The Gleaners ↔ Bulutların Üzerinde Yolculuk; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Empresyonizm: The Gleaners ↔ Impression, Sunrise (Impression, Soleil Levant); 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Empresyonizm

- Gör: A Bar at the Folies-Bergère (edouard-manet, 1882; 6 nokta, rehberli inceleme de var) · Paris Street; Rainy Day (gustave-caillebotte, 1877; 6 nokta, rehberli inceleme de var) · Bale Sınıfı (Degas, Metropolitan Sanat Müzesi) (edgar-degas, 1874; 5 nokta)
- Öğren 1. "Kısa, görünür fırça vuruşları; bulanık değil titreşen yüzey": Boulevard Montmartre, Mardi Gras (eser_notlari.json, eser notu) · Saint-Martin Kanalı manzarası (eser_notlari.json, eser notu) · İzlenim, Gün Doğumu (eser_ayrintilari.json, Sudaki yansıma) · Haystacks (eser_notlari.json, eser notu) · İzlenim, Gün Doğumu (Impression, soleil levant) (basyapitlar.json, Kompozisyon, ışık ve renk) · Young girl in a park (eser_notlari.json, eser notu) · genel açıklama 1
- Öğren 2. "Anlık ışık ve hava; gölgede bile renk": Woman in the Garden (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 3. "Açık havada (en plein air) manzara, kafe, nehir": **doğrulanmış eser kanıtı yok**
- Öğren 4. "Siyah yok denecek kadar az; açık palet": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Ayırt et ↔ Barbizon ve Realizm: Impression, Sunrise (Impression, Soleil Levant) ↔ The Gleaners; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Post-Empresyonizm: Impression, Sunrise (Impression, Soleil Levant) ↔ Yıldızlı Gece; 4 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Ukiyo-e (Japon baskısı)

- Gör: Sudden Shower over Shin-Ōhashi Bridge and Atake (utagawa-hiroshige, 1857; 6 nokta, rehberli inceleme de var) · Kanagawa Oki Nami Ura (katsushika-hokusai, 1830; 5 nokta)
- Öğren 1. "Ahşap baskı; düz renk alanları ve net kontur": Sundai, Edo (eser_notlari.json, eser notu) · Fuji Dağı'nın 36 Manzarası (basyapitlar.json, Kompozisyon, ışık ve renk) · Okitsu (eser_notlari.json, eser notu) · Kırmızı Fuji (eser_ayrintilari.json, Bokashi geçişi) · Numazu (eser_notlari.json, eser notu) · Shin-Ōhashi Köprüsü ve Atake'de Ani Sağanak (basyapitlar.json, özet) · genel açıklama 3
- Öğren 2. "Asimetrik, yukarıdan ya da kesik kadraj": **doğrulanmış eser kanıtı yok**
- Öğren 3. "Dalga, Fuji, oyuncular, kurtizanlar": Kanagawa Oki Nami Ura (yuruyus.json, Fuji Dağı) · 36 Fuji Dağı Manzarası (Hokusai) (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 4. "Gölge ve perspektif yerine desen": **doğrulanmış eser kanıtı yok**
- Ayırt et ↔ Empresyonizm: 36 Fuji Dağı Manzarası (Hokusai) ↔ Impression, Sunrise (Impression, Soleil Levant); 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Post-Empresyonizm: 36 Fuji Dağı Manzarası (Hokusai) ↔ Yıldızlı Gece; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Post-Empresyonizm

- Gör: Nereden geliyoruz? Neyiz? Nereye gidiyoruz? (paul-gauguin, 1897; 6 nokta, rehberli inceleme de var) · The Card Players (paul-cezanne, 1890; 5 nokta, rehberli inceleme de var) · Gece Kahvesi (vincent-van-gogh, 1888; 5 nokta)
- Öğren 1. "Kalın, yönlü fırça ya da noktalar (puantilizm)": Kâğıt Oynayanlar (eser_ayrintilari.json, Pipo ve yüz) · Kâğıt Oynayanlar (Les Joueurs de cartes) (basyapitlar.json, Kompozisyon, ışık ve renk) · Yıldızlı Gece (eser_ayrintilari.json, Büyük girdap) · Kırmızı Üzüm Bağı (eser_notlari.json, eser notu) · The Eiffel Tower (eser_notlari.json, eser notu) · genel açıklama 1
- Öğren 2. "Duygu ya da yapı için abartılmış renk": Lady in Blue (eser_notlari.json, eser notu) · Kâğıt Oynayanlar (Les Joueurs de cartes) (basyapitlar.json, Neden önemli?) · Arles'daki Yatak Odası (eser_notlari.json, eser notu) · Yıldızlı Gece (basyapitlar.json, Neden önemli?) · genel açıklama 2
- Öğren 3. "Geometrik sadeleştirme (Cézanne)": **doğrulanmış eser kanıtı yok**
- Öğren 4. "Kişisel üslup: her sanatçı ayrı yol": **doğrulanmış eser kanıtı yok**
- Ayırt et ↔ Empresyonizm: Yıldızlı Gece ↔ Impression, Sunrise (Impression, Soleil Levant); 4 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Sembolizm: Yıldızlı Gece ↔ The Apparition; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Ekspresyonizm: Yıldızlı Gece ↔ Çığlık (tablo); 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Sembolizm

- Gör: The Cyclops (odilon-redon, 1914; 5 nokta, rehberli inceleme de var) · The Sacred Grove, Beloved of the Arts and the Muses (pierre-puvis-de-chavannes, 1886; 5 nokta) · The Apparition (gustave-moreau, 1876; 5 nokta)
- Öğren 1. "Rüya, ölüm, mit ve gizem": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Öğren 2. "Gerçek değil ruh hâli; düşsel ışık": The Sanctuary of Hercules (eser_notlari.json, eser notu) · Siren (eser_notlari.json, eser notu) · Kiklop (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 3. "Ölümcül kadın, melek, sfenks figürleri": The Apparition (yuruyus.json, Salome) · genel açıklama 2
- Öğren 4. "Süslü ya da soluk, esrarlı renkler": The Sacred Grove, Beloved of the Arts and the Muses (yuruyus.json, Göl) · The Shepherd's Song (eser_notlari.json, eser notu) · Jeunes Filles au bord de la mer (eser_notlari.json, eser notu) · Summer (eser_notlari.json, eser notu) · Saint George and the Dragon (eser_notlari.json, eser notu) · genel açıklama 2
- Ayırt et ↔ Post-Empresyonizm: The Apparition ↔ Yıldızlı Gece; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Prerafaelitler: The Apparition ↔ Mariana; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Art Nouveau ve Viyana Secession: The Apparition ↔ Öpücük; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Art Nouveau ve Viyana Secession

- Gör: Öpücük (gustav-klimt, 1907; 6 nokta, rehberli inceleme de var)
- Öğren 1. "Kıvrılan bitkisel çizgiler": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Öğren 2. "Altın varak ve mozaik gibi desen (Klimt)": Öpücük (yuruyus.json, Altın tozu fon) · Hope II (eser_notlari.json, eser notu) · Öpücük (Der Kuss) (basyapitlar.json, özet) · genel açıklama 2
- Öğren 3. "Düz, dekoratif yüzey; afiş ve tasarım": **doğrulanmış eser kanıtı yok**
- Öğren 4. "Uzun saçlı, zarif kadın figürleri": **doğrulanmış eser kanıtı yok**
- Ayırt et ↔ Sembolizm: Öpücük ↔ The Apparition; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Ekspresyonizm: Öpücük ↔ Çığlık (tablo); 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Ekspresyonizm

- Gör: Berlin Street Scene (ernst-ludwig-kirchner, 1913; 6 nokta, rehberli inceleme de var) · Çığlık (tablo) (edvard-munch, 1893; 5 nokta, rehberli inceleme de var) · Composition VII (wassily-kandinsky, 1913; 5 nokta, rehberli inceleme de var)
- Öğren 1. "Duyguyu bağıran, gerçek dışı renkler": Berlin Sokak Sahnesi (basyapitlar.json, Kompozisyon, ışık ve renk) · Çığlık (The Scream) (basyapitlar.json, Neden önemli?) · Mocking of Christ (eser_notlari.json, eser notu) · genel açıklama 1
- Öğren 2. "Sert, açılı, çarpıtılmış biçimler": Çığlık (The Scream) (basyapitlar.json, Neden önemli?) · Mocking of Christ (eser_notlari.json, eser notu) · Berlin Street Scene (eser_notlari.json, eser notu) · Street, Berlin (eser_notlari.json, eser notu) · genel açıklama 1
- Öğren 3. "Kalın kontur, kaba fırça; ağaç baskı": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Öğren 4. "Kaygı, yalnızlık, kent ve savaş": **doğrulanmış eser kanıtı yok**
- Ayırt et ↔ Post-Empresyonizm: Çığlık (tablo) ↔ Yıldızlı Gece; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Art Nouveau ve Viyana Secession: Çığlık (tablo) ↔ Öpücük; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Kübizm: Çığlık (tablo) ↔ Portrait of Ambroise Vollard; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Kübizm

- Gör: The Saltimbanques (pablo-picasso, 1905; 5 nokta)
- Öğren 1. "Nesne aynı anda birçok açıdan, parçalanmış": Guernica (basyapitlar.json, Kompozisyon, ışık ve renk) · genel açıklama 2
- Öğren 2. "Geometrik düzlemler; kahve, gri, toprak tonları": **doğrulanmış eser kanıtı yok** · genel açıklama 2
- Öğren 3. "Natürmort, gitar, şişe, gazete harfleri": **doğrulanmış eser kanıtı yok**
- Öğren 4. "Kolaj: yapıştırılmış kâğıt ve malzeme": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Ayırt et ↔ Ekspresyonizm: Portrait of Ambroise Vollard ↔ Çığlık (tablo); 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Dada: Portrait of Ambroise Vollard ↔ Cut with the Kitchen Knife Through the Beer-Belly of the Weimar Republic; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Dada

- Gör: **yürüyüş yok**
- Öğren 1. "Akla ve sanata karşı alay": L.H.O.O.Q, Mona Lisa with moustache (eser_notlari.json, eser notu) · Monte Carlo bond (eser_notlari.json, eser notu) · genel açıklama 2
- Öğren 2. "Hazır nesne (ready-made), kolaj, fotomontaj": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Öğren 3. "Rastlantı ve saçmalık": **doğrulanmış eser kanıtı yok** · genel açıklama 1
- Öğren 4. "Savaş karşıtı, kışkırtıcı": **doğrulanmış eser kanıtı yok**
- Ayırt et ↔ Kübizm: Cut with the Kitchen Knife Through the Beer-Belly of the Weimar Republic ↔ Portrait of Ambroise Vollard; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Sürrealizm: Cut with the Kitchen Knife Through the Beer-Belly of the Weimar Republic ↔ The Persistence of Memory; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Sürrealizm

- Gör: **yürüyüş yok**
- Öğren 1. "Rüya mantığı; imkânsız bir araya gelişler": Belleğin Azmi (eser_ayrintilari.json, Daldaki saat) · The Persistence of Memory (eser_notlari.json, eser notu) · Belleğin Azmi (The Persistence of Memory) (basyapitlar.json, özet) · genel açıklama 2
- Öğren 2. "Fotoğraf gibi gerçekçi teknik, akıl dışı sahne": İmgelerin İhaneti (La trahison des images) (basyapitlar.json, Neden önemli?) · genel açıklama 1
- Öğren 3. "Eriyen saatler, boş ufuklar, uzun gölgeler": Young Virgin Auto-Sodomized by the Horns of Her Own Chastity (eser_notlari.json, eser notu) · Belleğin Azmi (The Persistence of Memory) (basyapitlar.json, özet) · genel açıklama 2
- Öğren 4. "Bilinçaltı, arzu ve korku": The Spectre of Sex-Appeal (eser_notlari.json, eser notu)
- Ayırt et ↔ Dada: The Persistence of Memory ↔ Cut with the Kitchen Knife Through the Beer-Belly of the Weimar Republic; 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Sembolizm: The Persistence of Memory ↔ The Apparition; 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Savaş sonrası figürasyon

- Gör: **yürüyüş yok**
- Öğren 1. "Çarpıtılmış, acı çeken insan bedeni": **doğrulanmış eser kanıtı yok**
- Öğren 2. "Kafes ya da boş oda içinde yalnız figür": Study for the Portrait of Pope Innocent X (eser_notlari.json, eser notu) · genel açıklama 1
- Öğren 3. "Kalın, etli boya; çığlık ve şiddet": **doğrulanmış eser kanıtı yok**
- Öğren 4. "Soyutun karşısında figürü sürdürmek": Çarmıha Geriliş'in Dibindeki Figürler İçin Üç Çalışma (Three Studies for Figures at the Base of a Crucifixion) (basyapitlar.json, Neden önemli?)
- Ayırt et ↔ Sürrealizm: Study after Velazquez's portrait of Pope Innocent X ↔ The Persistence of Memory; 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Ekspresyonizm: Study after Velazquez's portrait of Pope Innocent X ↔ Çığlık (tablo); 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
