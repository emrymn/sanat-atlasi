// "Yenilikler" notu (T4): sürüm değişince Bugün'de bir kez, Ayarlar'ın altında her zaman.
// Yeni bir sürümde listenin başına satır eklenir; yalnızca düzeltme olan sürümler listeye girmez.
export const YENILIKLER = [
  { surum: '1.54.0', metin: 'Ana sayfalarda (Tuval, Yolculuk, Galeri, Atölye, Defter) kenardan kaydırma artık önceki sayfaya geri götürmez. Sekme çubuğuyla geçince sayfa kaldığın yerde, yeniden yüklenmeden açılır.' },
  { surum: '1.53.0', metin: 'Kenardan kaydırarak geri artık iPhone’un Ayarlar uygulamasındaki gibi: parmağını sol kenardan sürünce önceki sayfa altta gerçek hâliyle görünür, bırakınca kaldığın yerde, yeniden yüklenmeden gelir (solda siyah ekran yok). Sayfadan çıkışlar yumuşadı: yeni sayfa sağdan gelirken eskisi altta sola çekilip kararır, geri dönünce önceki sayfa bekletmeden yerinde.' },
  { surum: '1.52.0', metin: 'iPhone gibi geçişler: esere dokununca küçük resim büyüyerek tam ekrana açılır, kapatınca yerine döner; tabloyu aşağı çekince küçülür ve arkadaki sayfa görünür. Yeni sayfa sağdan kayarak gelir, geri okuyla dönünce sağa çekilir; Başyapıtlar ve Konular kartları büyüyerek açılır. Eserler ve kartlar basınca hafifçe çöker; alttaki sekme çubuğu artık arkasındaki tabloların renklerini süzen bir cam.' },
  { surum: '1.51.0', metin: 'Tablonun ışığı: eser görüntüleyicide tablo, kendi renkleriyle arkasındaki karanlığa hafifçe ışık saçar; müzede spot altında duran bir tablo gibi. Doğru cevapta tablonun çevresi yaldızla parlar, yanlışta tablo hafifçe sarsılır.' },
  { surum: '1.50.0', metin: 'En büyük kopyaları telefona indir (Ayarlar): 4096 piksele kadar en yüksek kalitedeki hallerin hepsi telefonda durur, internet olmadan da tabloyu büyütünce keskin görünür. Yarıda kalırsa kaldığı yerden sürer; istersen tek dokunuşla silinir.' },
  { surum: '1.49.0', metin: 'Eserlerin en büyük kopyaları: görüntüleyicide açtığın eser önce hızlıca görünür, ardından 4096 piksele kadar en yüksek kalitedeki hali gelip yerine geçer; yakınlaştırınca fırça izleri seçilir.' },
  { surum: '1.48.0', metin: 'Eser görüntüleyicide resme bir kez dokununca oklar, düğmeler ve açıklama kaybolur, resim bütün ekranı kaplar; bir daha dokununca geri gelir. Telefonu yan çevirince resim tam ekran, açıklama altta ince bir şerit. Kenardan kaydırınca (iPhone’un geri hareketi) görüntüleyici kapanır; listeye geri dönünce kaldığın yerde açılır.' },
  { surum: '1.47.0', metin: 'Sanatçının adının evrensel okunuşu: “Dinle”nin yanında IPA (Uluslararası Fonetik Alfabe) yazımı, Vikipedi’den, sanatçının kendi dilinde. “Dinle” artık her sanatçıda kendi dilinde hazır kayıt çalar.' },
  { surum: '1.46.0', metin: 'Sanatçı sayfasında portre artık büyük: adın arkasında, sağ üstte silik bir tablo gibi durur; ad ve imza üstünde okunur. Portre sayılmayan görseller (sanatçının kendi tablosu, kitabe, yüzyıllar sonra yapılmış hayalî heykel) çıkarıldı.' },
  { surum: '1.45.0', metin: 'Sanatçı sayfasında adın altında “Dinle”: sanatçının adını kendi dilinde duyarsın (varsa gerçek ses kaydı, yoksa telefonun o dildeki sesi). Yanında sanatçının portresi.' },
  { surum: '1.44.0', metin: 'İmzalar kalemle yazılıyormuş gibi belirir: parlayan kalem ucu mürekkebi izler, yazı bitince üstünden ışık geçer. Küçük kaynaktan gelen 22 imza (Dürer, Tintoretto, David…) yeniden çizildi, artık piksel piksel değil. Ayarlar’da “Başka bir sanatçı getir”: günün sanatçısını o gün için değiştirir.' },
  { surum: '1.43.0', metin: 'Duvarlardaki tablolar döneminin çerçevesinde: Gotik kemerli altın, Rönesans ahşap, Barok oymalı altın, Hollanda abanoz, Empresyonist beyaz… Akım sayfalarının başlığı ve haritadaki dönem adları o dönemin harfiyle. Sanatçı sayfasında, Wikidata’da varsa ressamın gerçek imzası.' },
  { surum: '1.42.0', metin: 'Pekiştir’de bugünkü turun destesi telefonu sağa sola çevirince iskambil gibi yelpaze açılır, bırakınca yaylanıp toplanır.' },
  { surum: '1.41.0', metin: 'Koleksiyonum artık bir duvar: işaretlediğin eserler çivilere iple asılı, telefonu sağa sola çevirince sallanır, bırakınca durulur (Ayarlar’daki hareket seçimine uyar).' },
  { surum: '1.40.0', metin: 'Haritada dönem ekleri: iki dönemin kenarı birbirine akar, haritalar tek parça görünür; ekte altın bir sınır çizgisi ve yeni dönemin adı. Eke gelince çizgi ortadan iki yana açılır, ad netleşir, çizgi boyunca ışık geçer.' },
  { surum: '1.39.0', metin: 'Ayarlar’da geliştirici modu: açınca bütün konular, sanatçılar ve harita bölümleri açılır; kapatınca ilerlemen açmadan önceki haline döner.' },
  { surum: '1.38.0', metin: 'Yolculuk haritası baştan boyandı: dokuz dönem, her biri kendi ustalarının üslubunda; Empresyonizm ile Post-Empresyonizm artık ayrı dönem. Her durağın kendi sembolü var, bulunduğun yerde o dönemin kıyafetiyle öğrenci duruyor; açmadığın yerler sepya. Saklı tablolara dokununca hikâyeleri açılır.' },
  { surum: '1.37.0', metin: 'Bölüm sonucunda sergi duvarındaki tablolar telefonu sağa sola çevirince ipinden sallanır, bırakınca durulur (Ayarlar’daki hareket seçimine uyar). Sanatçı tanıtımı ve bölüm sonucu yenilendi (v0).' },
  { surum: '1.36.0', metin: 'Akım sayfaları yenilendi (v0): en önemliler üstte, ipuçlarının yanında eserden yakın plan ayrıntı, her dönemin kendi tekniğiyle kurulan “Bu dönemi pekiştir” düğmesi (vitray, mozaik, chiaroscuro…). Haritada dönem geçişinde dönemin renginde perde; İlerleme’de fırça izli “İşlendi yap”.' },
  { surum: '1.35.0', metin: 'Haritada her dönem geçişinde ekranın ortasında bölüm kartı: altın çizgiler açılır, yüzyıl ve dönemin adı belirip silinir. Bugün’de yazılar artık kutusuz, doğrudan tablonun üstünde ve tam açık.' },
  { surum: '1.34.0', metin: 'Bugün’de telefonu sağa sola çevirince, öne arkaya eğince günün tablosu hafifçe döner, ışık üstünden kayar, sanatçının adı katman katman, gölgesiyle derinlikle kayar. Ayarlar’dan kapatılabilir; iPhone ilk dokunuşta hareket izni sorar.' },
  { surum: '1.33.0', metin: 'Haritada dönem geçişleri: dönemlerin arası açıldı, her geçişte sis aralanır ve yeni dönemin adı belirir; kaydırırken duraklar yere konar, sis ve yazılar derinlikle kayar, sağ üstte hangi dönemde olduğun yazar; gündüz/gece düğmesi her yerden erişilir; yolcu büyüdü ve parlıyor; Rönesans ve XIX. yüzyıl durakları düzenli dizildi.' },
  { surum: '1.31.0', metin: 'Haritada katmanlar: Kolay ve Orta’dan önce her sanatçının 5 eseri tanıtılır, sorular yalnız bu eserlerden gelir; şıklarda biri şaşırtmalı, ikisi uzak dönemlerden; aynı soyadlı akrabalar hiçbir soruda birbirinin şıkkı olmaz.' },
  { surum: '1.30.0', metin: 'Yeni görünüm: Pekiştir (Atölye) ve İlerleme (Defter) baştan tasarlandı; yeni sekme adları ve simgeleri, eser yelpazeli düğmeler, Galeri ve haritada yenilikler. Tasarım v0 ile yapıldı.' },
  { surum: '1.29.0', metin: 'Yeni yolculuk haritası: her dönem kendi üslubunda boyandı; akımlar bölümlere ayrıldı, her bölümde tanıtım, Kolay ve Orta (geçmek için %75), isteğe bağlı Zor. Harita artık kendi sekmesinde.' },
  { surum: '1.28.0', metin: 'Yolculuk haritası: dönemler boyanmış adalar, akımlar duraklar; İlerleme’nin başında' },
  { surum: '1.27.0', metin: 'Koleksiyondaki eserler tekrar turunda daha sık; daha hızlı açılış; gelecek yük grafiği düzeldi' },
  { surum: '1.26.0', metin: 'Koleksiyonum, çalışma takvimi ve seri, öğrenme eğrisi, hatalı görsel bildirimi, ikon rozeti' },
  { surum: '1.25.0', metin: 'Genel arama, zaman şeridi, akım kimlik kartı' },
  { surum: '1.24.0', metin: 'Konu turu, Hatalarım, seviye seçimi' },
  { surum: '1.23.0', metin: 'Ters soru: “Hangisi bir … eseri?”' },
  { surum: '1.21.1', metin: 'İlerleme: kurs kitaplığı' },
];

function yeniMi(a, b) {
  const x = String(a).split('.').map(Number);
  const y = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
}

// Bugün'de gösterilecek notlar: kullanıcının son gördüğü sürümden sonraki ve şimdiki sürüme kadar olanlar (en yeni başta).
// Hiç sürüm görmemiş kullanıcıya (ilk kullanım ya da bu özellikten önceki kayıt) yalnızca şimdiki sürümün notu gösterilir;
// henüz hiç çalışmamış yeni kullanıcıya hiçbir şey gösterilmez.
export function gosterilecekler(sonGorulen, surum, calismis, liste = YENILIKLER) {
  if (!sonGorulen && !calismis) return [];
  const uygun = liste.filter((x) => !yeniMi(x.surum, surum) && (!sonGorulen || yeniMi(x.surum, sonGorulen)));
  return sonGorulen ? uygun : uygun.slice(0, 1);
}

export function yenilikYazisi(x) {
  return `${x.surum.replace(/\.0$/, '')} · ${x.metin}`;
}
