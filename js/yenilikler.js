// "Yenilikler" notu (T4): sürüm değişince Bugün'de bir kez, Ayarlar'ın altında her zaman.
// Yeni bir sürümde listenin başına satır eklenir; yalnızca düzeltme olan sürümler listeye girmez.
export const YENILIKLER = [
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
