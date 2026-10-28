// Her dönemin kendi çerçevesi (İş 48): duvarlarda (bölüm sonucunun sergi duvarı, Koleksiyonum) tablo, döneminde
// çerçevelendiği gibi durur. Çerçeve de dönemi tanımanın bir ipucu; bu yüzden sorularda kullanılmaz (cevabı ele verir).
// Tipler gerçek çerçeve geleneklerine dayanır: Gotik panolar sivri kemerli altın, Rönesans koyu ahşap ve ince yaldız
// (tabernakel), Barok kalın oymalı altın, Hollanda Altın Çağı siyah abanoz, Rokoko kıvrımlı açık altın, XIX. yüzyıl
// salonu düz geniş yaldız, Empresyonistler beyaz çerçeve (Degas, Pissarro), Viyana Secession geometrik altın,
// Japon baskısı ince ahşap çıta ve kâğıt paspartu, modern resim çerçevesiz (ince çıta).
export const AKIM_CERCEVELERI = {
  'Antik Yunan ve Roma': 'tas',
  Romanesk: 'kemer',
  Gotik: 'kemer',
  'Uluslararası Gotik': 'kemer',
  'Erken Rönesans': 'tabernakel',
  'Kuzey Rönesansı': 'tabernakel',
  'Yüksek Rönesans': 'tabernakel',
  'Venedik Rönesansı': 'tabernakel',
  Maniyerizm: 'tabernakel',
  'İtalyan Barok ve Caravaggizm': 'barok',
  'İspanyol Barok': 'barok',
  'Flaman Barok': 'barok',
  'Hollanda Altın Çağı': 'abanoz',
  'Fransız Klasisizmi': 'barok',
  'Geç İtalyan Barok': 'barok',
  Rokoko: 'rokoko',
  Neoklasisizm: 'salon',
  Romantizm: 'salon',
  Prerafaelitler: 'salon',
  'Akademizm ve Oryantalizm': 'salon',
  'Barbizon ve Realizm': 'salon',
  Empresyonizm: 'beyaz',
  'Ukiyo-e (Japon baskısı)': 'cita-kagit',
  'Post-Empresyonizm': 'beyaz',
  Sembolizm: 'secession',
  'Art Nouveau ve Viyana Secession': 'secession',
  Ekspresyonizm: 'cita',
  Kübizm: 'cita',
  Dada: 'cita',
  Sürrealizm: 'cita',
  'Savaş sonrası figürasyon': 'cita',
};

// Bilinmeyen akım (ya da eski kayıt) için duvarların eski altın çerçevesi
export const cerceveTipi = (akim) => AKIM_CERCEVELERI[akim] || 'altin';
