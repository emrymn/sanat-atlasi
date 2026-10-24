// "Yenilikler" notu (T4): sürüm değişince Bugün'de bir kez, Ayarlar'ın altında her zaman.
// Yeni bir sürümde listenin başına satır eklenir; yalnızca düzeltme olan sürümler listeye girmez.
export const YENILIKLER = [
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
