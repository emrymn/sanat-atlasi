# Çalış · Ders düzeni: kaynak ve eksik raporu

`scripts/ders/kaynaklar.mjs` üretir (elle düzenlenmez). Kaynak haritası: `data/ders_kaynaklari.json`.

- **Gör:** dönemin yürüyüşü yazılmış eserleri (`yuruyus.json`).
- **Öğren:** "Nasıl tanınır?" maddeleri (`akim_ozellikleri.json`). "Kanıt adayı": maddenin anahtar sözcüklerinin bir eser metninde birlikte geçtiği cümle; **gözle doğrulanmadan** "bu özellik bu eserde" denmez.
- **Ayırt et:** komşu akımlar (`akimlar.json`). Fark tablosu yeni metin yazmadan iki akımın "Nasıl tanınır?" maddeleriyle yan yana kurulabilir (uygulamadaki akım karşılaştırma sayfası da böyle). Karşılaştırma cümlesi: `akim_bilgi.json`'da öteki akımın adının geçtiği cümle.
- **Sına · "Neden?":** sanatçının `taninma`, tanıma notu ya da `kurs_notu` metni.

## Özet

| Akım | Sanatçı | Gör (yürüyüş) | Öğren (kanıt adayı olan / madde) | Ayırt et (cümlesi olan / komşu) | Sına ("Neden?" kaynağı olmayan) |
|---|---|---|---|---|---|
| Gotik | 9 | 9 eser | 7 / 7 | 1 / 1 | – |
| Erken Rönesans | 8 | 8 eser | 3 / 4 | 2 / 3 | – |
| Kuzey Rönesansı | 11 | 11 eser | 4 / 4 | 2 / 3 | – |
| Yüksek Rönesans | 6 | 6 eser | 2 / 4 | 3 / 3 | – |
| Venedik Rönesansı | 5 | 5 eser | 4 / 4 | 2 / 2 | – |
| Maniyerizm | 9 | 9 eser | 3 / 4 | 3 / 3 | – |
| İtalyan Barok ve Caravaggizm | 13 | 13 eser | 2 / 4 | 1 / 5 | – |
| İspanyol Barok | 2 | 2 eser | 2 / 4 | 0 / 2 | – |
| Flaman Barok | 2 | 2 eser | 1 / 4 | 1 / 2 | – |
| Hollanda Altın Çağı | 5 | 5 eser | 4 / 4 | 1 / 3 | – |
| Fransız Klasisizmi | 4 | 4 eser | 3 / 4 | 2 / 4 | – |
| Geç İtalyan Barok | 10 | 10 eser | 3 / 4 | 2 / 3 | – |
| Rokoko | 9 | 9 eser | 2 / 4 | 3 / 3 | – |
| Neoklasisizm | 4 | 4 eser | 2 / 4 | 2 / 3 | – |
| Romantizm | 8 | 8 eser | 3 / 4 | 3 / 3 | – |
| Prerafaelitler | 3 | 3 eser | 2 / 4 | 2 / 3 | – |
| Akademizm ve Oryantalizm | 4 | 4 eser | 4 / 4 | 0 / 3 | – |
| Barbizon ve Realizm | 5 | 5 eser | 4 / 4 | 2 / 2 | – |
| Empresyonizm | 9 | 9 eser | 2 / 4 | 2 / 2 | – |
| Ukiyo-e (Japon baskısı) | 2 | 2 eser | 2 / 4 | 0 / 2 | – |
| Post-Empresyonizm | 6 | 6 eser | 2 / 4 | 2 / 3 | – |
| Sembolizm | 5 | 5 eser | 3 / 4 | 2 / 3 | – |
| Art Nouveau ve Viyana Secession | 1 | 1 eser | 1 / 4 | 2 / 2 | – |
| Ekspresyonizm | 5 | 4 eser | 2 / 4 | 2 / 3 | – |
| Kübizm | 1 | 1 eser | 1 / 4 | 1 / 2 | – |
| Dada | 4 | **yok** | 0 / 4 | 2 / 2 | – |
| Sürrealizm | 4 | **yok** | 3 / 4 | 2 / 2 | – |
| Savaş sonrası figürasyon | 1 | **yok** | 1 / 4 | 0 / 2 | – |

Toplam: 28 ders. Gör verisi olmayan akım: Dada, Sürrealizm, Savaş sonrası figürasyon. Kanıt adayı bulunamayan "Nasıl tanınır?" maddesi: 43 / 115. Karşılaştırma cümlesi olmayan komşu çifti: 27 / 74. "Neden?" kaynağı olmayan sanatçı: 0.

## Ayrıntı

### Gotik

- Gör: Annunciation (triptik) (simone-martini, 1333; 6 nokta, rehberli inceleme de var) · The Nativity with the Prophets Isaiah and Ezekiel (duccio-di-buoninsegna, 1308; 6 nokta) · The Fall of the Rebel Angels (limbourg-kardesler, 1411; 5 nokta)
- Öğren 1. "Altın zemin ve ahşap pano üzerine tempera": Assisi'li Aziz Franciscus ve Yaşamından Sahneler (basyapitlar.json, Ne görüyoruz?) · The Madonna and Child in Majesty Surrounded by Angels (yuruyus.json, Taht) · Santa Croce Çarmıhı (basyapitlar.json, özet) · İsa'nın Kudüs'e Girişi (basyapitlar.json, özet)
- Öğren 2. "Uzun, ince, biraz düz figürler; Bizans etkisi": The Madonna and Child in Majesty Surrounded by Angels (yuruyus.json, Meryem'in yüzü) · Assisi'li Aziz Franciscus (eser_ayrintilari.json, Yüz) · İsa'nın Kudüs'e Girişi (basyapitlar.json, Neden önemli?) · Ağıt (basyapitlar.json, Neden önemli?)
- Öğren 3. "Altın çizgilerle işlenmiş kumaş kıvrımları": Assisi'li Aziz Franciscus ve Yaşamından Sahneler (basyapitlar.json, Kompozisyon, ışık ve renk) · Santa Croce Çarmıhı (eser_ayrintilari.json, Saydam bel örtüsü) · Aziz Maxima ve Aziz Ansanus ile Müjde (Triptik) (basyapitlar.json, Kompozisyon, ışık ve renk) · Müneccimlerin Tapınması (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 4. "Meryem ve Çocuk, boyalı haç, sunak resmi": Meryem'in Doğumu (basyapitlar.json, özet) · Aziz Maxima ve Aziz Ansanus ile Müjde (Triptik) (basyapitlar.json, özet) · Ağıt (basyapitlar.json, Neden önemli?) · Annunciation (triptik) (yuruyus.json, Altın yazı)
- Öğren 5. "Zarif, kıvrımlı çizgiler ve süslü giysiler (Uluslararası Gotik)": Şubat (basyapitlar.json, Neden önemli?) · Assisi'li Aziz Franciscus ve Yaşamından Sahneler (basyapitlar.json, Kompozisyon, ışık ve renk) · Santa Croce Çarmıhı (eser_ayrintilari.json, Saydam bel örtüsü) · Ağıt (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 6. "Saray hayatı, at, av ve ayrıntılı doğa (Uluslararası Gotik)": Şubat (basyapitlar.json, Neden önemli?)
- Öğren 7. "Minyatür inceliğinde el yazmaları (Uluslararası Gotik)": Şubat (basyapitlar.json, Ne görüyoruz?)
- Ayırt et ↔ Erken Rönesans: 2 karşılaştırma cümlesi; özellik maddeleri 7 / 4

### Erken Rönesans

- Gör: İsa'nın Anahtarları Petrus'a Vermesi (Perugino) (pietro-perugino, 1480; 5 nokta, rehberli inceleme de var) · Dante Alighieri with Florence and the Realms of the Divine Comedy (Hell, Purgatory, Paradise) (domenico-di-michelino, 1465; 6 nokta) · Saint Jerome in the desert (andrea-mantegna, 1449; 6 nokta)
- Öğren 1. "Tek kaçış noktalı doğrusal perspektif": Vergi Parası (basyapitlar.json, Kompozisyon, ışık ve renk) · İsa'nın Anahtarları Petrus'a Vermesi (basyapitlar.json, Kompozisyon, ışık ve renk) · Meryem'e Müjde (basyapitlar.json, Kompozisyon, ışık ve renk) · The Holy Trinity (fresk) (yuruyus.json, Tonozlu tavan)
- Öğren 2. "Antik mimari ve heykelden alınmış hacimli figürler": Vergi Parası (basyapitlar.json, Kompozisyon, ışık ve renk) · Virgin and Child Enthroned with Four Angels (yuruyus.json, Klasik mimari)
- Öğren 3. "Net çizgiler, berrak ve eşit ışık": İsa'nın Anahtarları Petrus'a Vermesi (basyapitlar.json, Kompozisyon, ışık ve renk) · Meryem'e Müjde (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 4. "Dini sahnelerde gerçekçi mekân ve portre": **kanıt adayı yok**
- Ayırt et ↔ Gotik: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 7
- Ayırt et ↔ Yüksek Rönesans: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Venedik Rönesansı: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Kuzey Rönesansı

- Gör: Arnolfini Portrait (jan-van-eyck, 1434; 6 nokta, rehberli inceleme de var) · Elçiler (hans-holbein-genc, 1533; 6 nokta, rehberli inceleme de var) · The fountain of youth (lucas-cranach-yasl, 1546; 6 nokta)
- Öğren 1. "Yağlı boyada inanılmaz ayrıntı (kumaş, metal, cam)": Elçiler (The Ambassadors) (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 2. "Gizli simgelerle dolu gündelik nesneler": Mérode Triptiği (basyapitlar.json, Anlam ve semboller)
- Öğren 3. "Pencereden görünen manzara, iç mekân ışığı": Donor Henri de Werl, protected by St. John the Baptist (yuruyus.json, Pencereler) · Mérode Triptiği (eser_ayrintilari.json, Pencereden kent) · Crucifixion of Scheut (yuruyus.json, Kırmızı perde) · Self-Portrait (yuruyus.json, Pencereden Alpler)
- Öğren 4. "Ciddi, gerçekçi, idealleştirilmemiş yüzler": Âdem ile Havva (basyapitlar.json, Neden önemli?)
- Ayırt et ↔ Gotik: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 7
- Ayırt et ↔ Erken Rönesans: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Flaman Barok: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Yüksek Rönesans

- Gör: Christ at the Column (donato-bramante, 1487; 6 nokta, rehberli inceleme de var) · The Judgment of Paris (baskı) (marcantonio-raimondi, 1510; 6 nokta, rehberli inceleme de var) · The School of Athens (Atina Okulu) (raphael, 1512; 6 nokta, rehberli inceleme de var)
- Öğren 1. "Piramit biçimli, dengeli kompozisyon": **kanıt adayı yok**
- Öğren 2. "Sfumato: yumuşak geçişli gölgeler": Jupiter and Io (yuruyus.json, Belini saran el) · Jüpiter ve Io (eser_ayrintilari.json, Belini saran el) · Âdem'in Yaratılışı (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 3. "İdeal güzellik ve sakin, ağırbaşlı figürler": **kanıt adayı yok**
- Öğren 4. "Anatomiye hâkim, heykel gibi bedenler": Sütundaki İsa (basyapitlar.json, özet) · Âdem'in Yaratılışı (basyapitlar.json, Kompozisyon, ışık ve renk) · The Judgment of Paris (baskı) (yuruyus.json, Venüs ve Cupid) · Paris'in Hükmü (eser_ayrintilari.json, Venüs ve Cupid)
- Ayırt et ↔ Erken Rönesans: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Venedik Rönesansı: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Maniyerizm: 3 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Venedik Rönesansı

- Gör: Bacchus ve Ariadne (titian, 1520; 7 nokta) · Saint George and the Dragon (tintoretto, 1555; 5 nokta) · Kana'da Düğün (paolo-veronese, 1562; 6 nokta, rehberli inceleme de var)
- Öğren 1. "Çizgiden çok renk (colore): sıcak, doygun tonlar": Urbino Venüsü (Venus of Urbino) (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 2. "Yumuşak ışık ve atmosferli manzara": Yudit (yuruyus.json, Manzara)
- Öğren 3. "Görünür fırça izi, tuval üzerine yağlı boya": Urbino Venüsü (eser_ayrintilari.json, Örten el)
- Öğren 4. "Çıplak figür, mitoloji ve şölen sahneleri": Son Akşam Yemeği (Tintoretto) (eser_ayrintilari.json, Tabak taşıyan kadın)
- Ayırt et ↔ Yüksek Rönesans: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Maniyerizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Maniyerizm

- Gör: Anguissola kardeşlerin portresi (oyun oynayan kardeşler) (sofonisba-anguissola, 1555; 6 nokta, rehberli inceleme de var) · The Burial of the Count of Orgaz (el-greco, 1586; 6 nokta, rehberli inceleme de var) · Deposition (jacopo-pontormo, 1525; 5 nokta, rehberli inceleme de var)
- Öğren 1. "Uzatılmış boyunlar ve uzuvlar": **kanıt adayı yok**
- Öğren 2. "Asitli, yapay renkler (pembe, nane yeşili)": Çarmıhtan İndiriliş (basyapitlar.json, Kompozisyon, ışık ve renk) · Aziz Thomas'ın Şüphesi (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 3. "Kıvrılan figürler, sıkışık ya da boş merkezli kompozisyon": Bir Alegori (Venüs, Aşk Tanrısı, Zaman ve Akılsızlık) (basyapitlar.json, Kompozisyon, ışık ve renk) · Çarmıhtan İndiriliş (basyapitlar.json, Kompozisyon, ışık ve renk) · Aziz Thomas'ın Şüphesi (eser_ayrintilari.json, Cangiante örtü) · Satranç Oynayan Sanatçının Kız Kardeşlerinin Portresi (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 4. "Soğuk, tedirgin ya da zarif-yapay bir hava": Çarmıhtan İndiriliş (basyapitlar.json, Kompozisyon, ışık ve renk) · Çarmıhtan İndiriliş (basyapitlar.json, Kompozisyon, ışık ve renk) · Aziz Thomas'ın Şüphesi (basyapitlar.json, Kompozisyon, ışık ve renk)
- Ayırt et ↔ Yüksek Rönesans: 3 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Venedik Rönesansı: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### İtalyan Barok ve Caravaggizm

- Gör: The Lute Player (orazio-gentileschi, 1612; 6 nokta, rehberli inceleme de var) · Assumption of the Virgin (annibale-carracci, 1587; 5 nokta) · The Conversion of Saint Paul (caravaggio, 1600; 5 nokta)
- Öğren 1. "Tenebrizm: zifiri karanlıkta sert spot ışığı": Holofernes'in Kafasını Kesen Judith (basyapitlar.json, Kompozisyon, ışık ve renk) · Emmaus'ta Akşam Yemeği (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 2. "Sokaktan alınmış gerçekçi, kirli ayaklı modeller": **kanıt adayı yok**
- Öğren 3. "En dramatik an; izleyiciye taşan hareket": **kanıt adayı yok**
- Öğren 4. "Çapraz kompozisyon, yakın plan figürler": Pezevenk Kadın (basyapitlar.json, özet) · Lavta Çalan (basyapitlar.json, Kompozisyon, ışık ve renk) · Emmaus'ta Akşam Yemeği (basyapitlar.json, Kompozisyon, ışık ve renk)
- Ayırt et ↔ İspanyol Barok: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Flaman Barok: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Hollanda Altın Çağı: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Maniyerizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Geç İtalyan Barok: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### İspanyol Barok

- Gör: Las Meninas (The Maids of Honor) (diego-velazquez, 1656; 6 nokta) · The Defense of Cadiz Against the English (francisco-de-zurbaran, 1634; 5 nokta)
- Öğren 1. "Karanlık zemin, sert ve sade ışık": Tanrı'nın Kuzusu (eser_ayrintilari.json, Yün bukleleri)
- Öğren 2. "Derin dindarlık: azizler, çileciler, natürmort": **kanıt adayı yok**
- Öğren 3. "Saray portrelerinde gümüşi gri tonlar (Velázquez)": Las Meninas (The Maids of Honor) (yuruyus.json, Cüce ve köpek) · Papa X. Innocentius'un Portresi (basyapitlar.json, Neden önemli?)
- Öğren 4. "Gerçekçi, ağırbaşlı ve sessiz figürler": **kanıt adayı yok**
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Hollanda Altın Çağı: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Flaman Barok

- Gör: The Fall of the Damned (peter-paul-rubens, 1621; 4 nokta) · The Vision of the Blessed Hermann Joseph (anthony-van-dyck, 1629; 4 nokta)
- Öğren 1. "Etli, canlı, hareketli bedenler (Rubens)": The Fall of the Damned (yuruyus.json, Düşen bedenler) · Çarmıhın Dikilişi (basyapitlar.json, Neden önemli?)
- Öğren 2. "Sıcak renkler, kıvrılan diyagonal kompozisyon": **kanıt adayı yok**
- Öğren 3. "Zengin portreler, ipek ve dantel (van Dyck)": **kanıt adayı yok**
- Öğren 4. "Av, mitoloji ve büyük sunak resimleri": **kanıt adayı yok**
- Ayırt et ↔ Hollanda Altın Çağı: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Hollanda Altın Çağı

- Gör: The Return of the Prodigal Son (rembrandt-van-rijn, 1668; 6 nokta, rehberli inceleme de var) · Açık Pencere Önünde Mektup Okuyan Kız (johannes-vermeer, 1658; 5 nokta) · Young Man and Woman in an Inn (frans-hals, 1623; 5 nokta)
- Öğren 1. "Gündelik hayat (janr), iç mekân, natürmort": Aziz Nicholas Yortusu (basyapitlar.json, Neden önemli?)
- Öğren 2. "Pencereden süzülen sakin ışık (Vermeer)": Aziz Nicholas Yortusu (basyapitlar.json, Kompozisyon, ışık ve renk) · Süt Boşaltan Kadın (eser_ayrintilari.json, Sepet ve bakır kova)
- Öğren 3. "Grup portreleri ve derin ışık-gölge (Rembrandt)": Müsrif Oğulun Dönüşü (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 4. "Küçük boy, burjuva alıcı için resim": Choice between richness and youth (yuruyus.json, Duvardaki resim)
- Ayırt et ↔ Flaman Barok: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İspanyol Barok: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Fransız Klasisizmi

- Gör: Portrait of Louis XIV (hyacinthe-rigaud, 1701; 6 nokta, rehberli inceleme de var) · The King governs by himself, 1661 (charles-le-brun, 1681; 5 nokta) · The Agony in the Garden (nicolas-poussin, 1626; 4 nokta)
- Öğren 1. "Düzenli, yatay, sahne gibi kompozisyon": Arkadya'da Ben de Varım (Et in Arcadia ego) (basyapitlar.json, Kompozisyon, ışık ve renk) · Landscape with the Finding of Moses (yuruyus.json, Ağaçların çerçevesi) · İskender'in Babil'e Girişi (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 2. "Antik ve İncil konuları, ders veren anlatı": **kanıt adayı yok**
- Öğren 3. "Serin renkler, net çizgi, idealize manzara": Arkadya'da Ben de Varım (Et in Arcadia ego) (basyapitlar.json, Kompozisyon, ışık ve renk) · Saba Melikesi'nin Gemiye Binişi (eser_ayrintilari.json, Sandık yükleyen hamallar)
- Öğren 4. "Duygudan çok akıl ve ölçü": Arkadya'da Ben de Varım (eser_ayrintilari.json, Düşünceli çoban)
- Ayırt et ↔ Rokoko: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Neoklasisizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Geç İtalyan Barok: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Geç İtalyan Barok

- Gör: Feast of Herod (mattia-preti, 1658; 5 nokta) · Searching for Fleas (giuseppe-maria-crespi, 1720; 5 nokta) · Allegory of Fortune (salvator-rosa, 1658; 4 nokta)
- Öğren 1. "Tavanlarda gökyüzüne açılan yanılsama (quadratura)": Apotheosis of Saint Ignatius (yuruyus.json, Göğe açılan tavan)
- Öğren 2. "Açık, havadar renkler, uçan figürler": Banyosunda Batşeba (basyapitlar.json, özet)
- Öğren 3. "Venedik manzaraları (veduta) ve kalabalık şölenler": **kanıt adayı yok**
- Öğren 4. "Teatral, dekoratif büyük ölçek": Feast of Herod (yuruyus.json, Arkadaki seyirciler) · The Glorification of Saint Dominic (yuruyus.json, Göksel ışık)
- Ayırt et ↔ İtalyan Barok ve Caravaggizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Rokoko: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Fransız Klasisizmi: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Rokoko

- Gör: Pilgrimage to the Island of Cythera (jean-antoine-watteau, 1717; 6 nokta, rehberli inceleme de var) · The Triumph of Venus (francois-boucher, 1740; 5 nokta) · Before (william-hogarth, 1731; 4 nokta)
- Öğren 1. "Pastel tonlar: pembe, açık mavi, krem": Salıncak (L'Escarpolette) (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 2. "Hafif, oyunbaz aşk ve bahçe sahneleri (fête galante)": Salıncak (L'Escarpolette) (basyapitlar.json, özet)
- Öğren 3. "Kıvrımlı, asimetrik süsleme": **kanıt adayı yok**
- Öğren 4. "Aristokrat zarafeti, tüy gibi fırça": **kanıt adayı yok**
- Ayırt et ↔ Fransız Klasisizmi: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Neoklasisizm: 3 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Geç İtalyan Barok: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Neoklasisizm

- Gör: İmparator Napolyon Tuileries'deki Çalışma Odasında (jacques-louis-david, 1812; 5 nokta) · Colonel Guy Johnson and Karonghyontye (benjamin-west, 1776; 4 nokta) · Telemachus and the Nymphs of Calypso (angelica-kauffman, 1782; 4 nokta)
- Öğren 1. "Keskin çizgi, pürüzsüz yüzey, görünmez fırça": **kanıt adayı yok**
- Öğren 2. "Antik Roma ve Yunan konuları; erdem ve fedakârlık": **kanıt adayı yok**
- Öğren 3. "Friz gibi yatay, sahne düzeni": Gracchusların Annesi Kornelia (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 4. "Sert, berrak ışık; heykel gibi figürler": Horas Kardeşlerin Yemini (Le Serment des Horaces) (basyapitlar.json, özet)
- Ayırt et ↔ Rokoko: 3 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Akademizm ve Oryantalizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Romantizm: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Romantizm

- Gör: Bulutların Üzerinde Yolculuk (caspar-david-friedrich, 1818; 6 nokta, rehberli inceleme de var) · The Raft of the Medusa (theodore-gericault, 1819; 6 nokta, rehberli inceleme de var) · The Fighting Temeraire (j-m-w-turner, 1839; 5 nokta)
- Öğren 1. "Duygu, tutku ve fırtına; dramatik doğa": **kanıt adayı yok**
- Öğren 2. "Serbest, hareketli fırça ve güçlü renk": Bulutların Üzerinde Yolculuk (yuruyus.json, Rüzgârdaki saçlar) · Sis Denizi Üzerinde Gezgin (Der Wanderer über dem Nebelmeer) (eser_ayrintilari.json, Rüzgârdaki saçlar) · Köle Gemisi (The Slave Ship) (basyapitlar.json, Neden önemli?) · Halka Yol Gösteren Özgürlük (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 3. "Yüce (sublime): insan doğa karşısında küçük": Sis Denizi Üzerinde Gezgin (Der Wanderer über dem Nebelmeer) (basyapitlar.json, Anlam ve semboller) · Köle Gemisi (The Slave Ship) (basyapitlar.json, Anlam ve semboller)
- Öğren 4. "Egzotik, tarihî ve güncel trajik konular": Medusa'nın Salı (Le Radeau de la Méduse) (basyapitlar.json, özet) · Halka Yol Gösteren Özgürlük (basyapitlar.json, Neden önemli?)
- Ayırt et ↔ Neoklasisizm: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Prerafaelitler: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Barbizon ve Realizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Prerafaelitler

- Gör: The Lady of Shalott (william-holman-hunt, 1890; 5 nokta) · Proserpine (dante-gabriel-rossetti, 1874; 5 nokta) · Mariana (john-everett-millais, 1851; 5 nokta)
- Öğren 1. "Parlak, saf renkler; beyaz zemin üzerine": Ophelia (eser_ayrintilari.json, Eğik söğüt)
- Öğren 2. "Her yaprağı tek tek çizilmiş doğa ayrıntısı": Mariana (yuruyus.json, Sunak)
- Öğren 3. "Orta Çağ efsaneleri, Shakespeare, uzun saçlı kadınlar": **kanıt adayı yok**
- Öğren 4. "Düz, keskin ışık; simgelerle dolu sahne": **kanıt adayı yok**
- Ayırt et ↔ Romantizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Sembolizm: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Akademizm ve Oryantalizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Akademizm ve Oryantalizm

- Gör: The Dream of Ossian (jean-auguste-dominique-ingres, 1813; 4 nokta) · The Carpet Merchant (jean-leon-gerome, 1887; 4 nokta) · Dante and Virgil in Hell (william-adolphe-bouguereau, 1850; 5 nokta)
- Öğren 1. "Kusursuz, cilalı yüzey ve akademik çizim": Köle Pazarı (basyapitlar.json, Kompozisyon, ışık ve renk) · Venüs'ün Doğuşu (basyapitlar.json, özet)
- Öğren 2. "Mitoloji, tarih ve idealize çıplak": Köle Pazarı (basyapitlar.json, özet)
- Öğren 3. "Doğu sahneleri: hamam, çarşı, harem (hayalî)": Büyük Odalık (eser_ayrintilari.json, Nargile ve tütsü) · The Carpet Merchant (yuruyus.json, Tüccarlar ve alıcılar) · Köle Pazarı (basyapitlar.json, Anlam ve semboller)
- Öğren 4. "Fotoğraf gibi ayrıntı, teatral kurgu": Köle Pazarı (basyapitlar.json, Neden önemli?)
- Ayırt et ↔ Neoklasisizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Romantizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Prerafaelitler: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Barbizon ve Realizm

- Gör: Ornans'ta Cenaze (gustave-courbet, 1840; 6 nokta, rehberli inceleme de var) · The Connoisseur (honore-daumier, 1855; 4 nokta) · The Gleaners (jean-francois-millet, 1857; 6 nokta, rehberli inceleme de var)
- Öğren 1. "Köylü, işçi ve sıradan insanın gündelik hayatı": Üçüncü Mevki Vagon (basyapitlar.json, Neden önemli?) · Başak Toplayanlar (Des glaneuses) (basyapitlar.json, Neden önemli?)
- Öğren 2. "Toprak renkleri: kahve, okra, yeşil": Üçüncü Mevki Vagon (basyapitlar.json, Kompozisyon, ışık ve renk) · Başak Toplayanlar (Des glaneuses) (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 3. "Açık havada doğa; orman ve tarla": Diana and Actaeon (Diana Surprised in Her Bath) (yuruyus.json, Su)
- Öğren 4. "İdealize etmeden, ağır ve gerçek": Başak Toplayanlar (Des glaneuses) (basyapitlar.json, Neden önemli?)
- Ayırt et ↔ Romantizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Empresyonizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Empresyonizm

- Gör: A Bar at the Folies-Bergère (edouard-manet, 1882; 6 nokta, rehberli inceleme de var) · Paris Street; Rainy Day (gustave-caillebotte, 1877; 6 nokta, rehberli inceleme de var) · Bale Sınıfı (Degas, Metropolitan Sanat Müzesi) (edgar-degas, 1874; 5 nokta)
- Öğren 1. "Kısa, görünür fırça vuruşları; bulanık değil titreşen yüzey": İzlenim, Gün Doğumu (eser_ayrintilari.json, Sudaki yansıma)
- Öğren 2. "Anlık ışık ve hava; gölgede bile renk": **kanıt adayı yok**
- Öğren 3. "Açık havada (en plein air) manzara, kafe, nehir": **kanıt adayı yok**
- Öğren 4. "Siyah yok denecek kadar az; açık palet": Mavi Koltukta Küçük Kız (eser_ayrintilari.json, Çoraplar ve ayakkabılar)
- Ayırt et ↔ Barbizon ve Realizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Post-Empresyonizm: 4 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Ukiyo-e (Japon baskısı)

- Gör: Sudden Shower over Shin-Ōhashi Bridge and Atake (utagawa-hiroshige, 1857; 6 nokta, rehberli inceleme de var) · Kanagawa Oki Nami Ura (katsushika-hokusai, 1830; 5 nokta)
- Öğren 1. "Ahşap baskı; düz renk alanları ve net kontur": Fuji Dağı'nın 36 Manzarası (basyapitlar.json, Kompozisyon, ışık ve renk) · Shin-Ōhashi Köprüsü ve Atake'de Ani Sağanak (basyapitlar.json, özet)
- Öğren 2. "Asimetrik, yukarıdan ya da kesik kadraj": **kanıt adayı yok**
- Öğren 3. "Dalga, Fuji, oyuncular, kurtizanlar": Kanagawa Oki Nami Ura (yuruyus.json, Fuji Dağı)
- Öğren 4. "Gölge ve perspektif yerine desen": **kanıt adayı yok**
- Ayırt et ↔ Empresyonizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Post-Empresyonizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Post-Empresyonizm

- Gör: Nereden geliyoruz? Neyiz? Nereye gidiyoruz? (paul-gauguin, 1897; 6 nokta, rehberli inceleme de var) · The Card Players (paul-cezanne, 1890; 5 nokta, rehberli inceleme de var) · Gece Kahvesi (vincent-van-gogh, 1888; 5 nokta)
- Öğren 1. "Kalın, yönlü fırça ya da noktalar (puantilizm)": Kâğıt Oynayanlar (eser_ayrintilari.json, Pipo ve yüz) · Yıldızlı Gece (eser_ayrintilari.json, Büyük girdap) · Asnières'de Yıkananlar (eser_ayrintilari.json, Hasır şapkalı adam)
- Öğren 2. "Duygu ya da yapı için abartılmış renk": Kâğıt Oynayanlar (Les Joueurs de cartes) (basyapitlar.json, Neden önemli?) · Yıldızlı Gece (basyapitlar.json, Neden önemli?)
- Öğren 3. "Geometrik sadeleştirme (Cézanne)": **kanıt adayı yok**
- Öğren 4. "Kişisel üslup: her sanatçı ayrı yol": **kanıt adayı yok**
- Ayırt et ↔ Empresyonizm: 4 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Sembolizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Ekspresyonizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Sembolizm

- Gör: The Cyclops (odilon-redon, 1914; 5 nokta, rehberli inceleme de var) · The Sacred Grove, Beloved of the Arts and the Muses (pierre-puvis-de-chavannes, 1886; 5 nokta) · The Apparition (gustave-moreau, 1876; 5 nokta)
- Öğren 1. "Rüya, ölüm, mit ve gizem": **kanıt adayı yok**
- Öğren 2. "Gerçek değil ruh hâli; düşsel ışık": Kiklop (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 3. "Ölümcül kadın, melek, sfenks figürleri": The Apparition (yuruyus.json, Salome) · Kiklop (basyapitlar.json, Ne görüyoruz?) · The Sphinx, or, The Caresses (yuruyus.json, Sfenks)
- Öğren 4. "Süslü ya da soluk, esrarlı renkler": The Sacred Grove, Beloved of the Arts and the Muses (yuruyus.json, Göl)
- Ayırt et ↔ Post-Empresyonizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Prerafaelitler: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Art Nouveau ve Viyana Secession: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Art Nouveau ve Viyana Secession

- Gör: Öpücük (gustav-klimt, 1907; 6 nokta, rehberli inceleme de var)
- Öğren 1. "Kıvrılan bitkisel çizgiler": **kanıt adayı yok**
- Öğren 2. "Altın varak ve mozaik gibi desen (Klimt)": Öpücük (yuruyus.json, Altın tozu fon) · Öpücük (eser_ayrintilari.json, Altın tozu fon)
- Öğren 3. "Düz, dekoratif yüzey; afiş ve tasarım": **kanıt adayı yok**
- Öğren 4. "Uzun saçlı, zarif kadın figürleri": **kanıt adayı yok**
- Ayırt et ↔ Sembolizm: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Ekspresyonizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Ekspresyonizm

- Gör: Berlin Street Scene (ernst-ludwig-kirchner, 1913; 6 nokta, rehberli inceleme de var) · Çığlık (tablo) (edvard-munch, 1893; 5 nokta, rehberli inceleme de var) · Composition VII (wassily-kandinsky, 1913; 5 nokta, rehberli inceleme de var)
- Öğren 1. "Duyguyu bağıran, gerçek dışı renkler": Berlin Sokak Sahnesi (basyapitlar.json, Kompozisyon, ışık ve renk) · Çığlık (The Scream) (basyapitlar.json, Neden önemli?)
- Öğren 2. "Sert, açılı, çarpıtılmış biçimler": Çığlık (The Scream) (basyapitlar.json, Neden önemli?)
- Öğren 3. "Kalın kontur, kaba fırça; ağaç baskı": **kanıt adayı yok**
- Öğren 4. "Kaygı, yalnızlık, kent ve savaş": **kanıt adayı yok**
- Ayırt et ↔ Post-Empresyonizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Art Nouveau ve Viyana Secession: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Kübizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Kübizm

- Gör: The Saltimbanques (pablo-picasso, 1905; 5 nokta)
- Öğren 1. "Nesne aynı anda birçok açıdan, parçalanmış": Guernica (basyapitlar.json, Kompozisyon, ışık ve renk)
- Öğren 2. "Geometrik düzlemler; kahve, gri, toprak tonları": **kanıt adayı yok**
- Öğren 3. "Natürmort, gitar, şişe, gazete harfleri": **kanıt adayı yok**
- Öğren 4. "Kolaj: yapıştırılmış kâğıt ve malzeme": **kanıt adayı yok**
- Ayırt et ↔ Ekspresyonizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Dada: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Dada

- Gör: **yürüyüş yok**
- Öğren 1. "Akla ve sanata karşı alay": **kanıt adayı yok**
- Öğren 2. "Hazır nesne (ready-made), kolaj, fotomontaj": **kanıt adayı yok**
- Öğren 3. "Rastlantı ve saçmalık": **kanıt adayı yok**
- Öğren 4. "Savaş karşıtı, kışkırtıcı": **kanıt adayı yok**
- Ayırt et ↔ Kübizm: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Sürrealizm: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Sürrealizm

- Gör: **yürüyüş yok**
- Öğren 1. "Rüya mantığı; imkânsız bir araya gelişler": Belleğin Azmi (eser_ayrintilari.json, Daldaki saat)
- Öğren 2. "Fotoğraf gibi gerçekçi teknik, akıl dışı sahne": İmgelerin İhaneti (La trahison des images) (basyapitlar.json, Neden önemli?)
- Öğren 3. "Eriyen saatler, boş ufuklar, uzun gölgeler": Belleğin Azmi (The Persistence of Memory) (basyapitlar.json, özet)
- Öğren 4. "Bilinçaltı, arzu ve korku": **kanıt adayı yok**
- Ayırt et ↔ Dada: 2 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Sembolizm: 1 karşılaştırma cümlesi; özellik maddeleri 4 / 4

### Savaş sonrası figürasyon

- Gör: **yürüyüş yok**
- Öğren 1. "Çarpıtılmış, acı çeken insan bedeni": **kanıt adayı yok**
- Öğren 2. "Kafes ya da boş oda içinde yalnız figür": **kanıt adayı yok**
- Öğren 3. "Kalın, etli boya; çığlık ve şiddet": **kanıt adayı yok**
- Öğren 4. "Soyutun karşısında figürü sürdürmek": Çarmıha Geriliş'in Dibindeki Figürler İçin Üç Çalışma (Three Studies for Figures at the Base of a Crucifixion) (basyapitlar.json, Neden önemli?)
- Ayırt et ↔ Sürrealizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
- Ayırt et ↔ Ekspresyonizm: 0 karşılaştırma cümlesi; özellik maddeleri 4 / 4
