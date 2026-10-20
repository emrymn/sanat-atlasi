// Vikipedi girişlerinde şablonların düz metne dönüşürken bıraktığı kırıntılar
// (telaffuz/IPA, "( dinle)", yarım kalmış parantezler, eser listeleri) için elle düzeltmeler.
// Yalnızca bozuk yerler değiştirilir; bilgi eklenen yerler (doğum/ölüm) Vikipedi maddesinin kendisinden alındı.

const DEGISTIR = {
  'wassily-kandinsky': [
    ['U. 4 Aralık] 1866, Rusya – 13 Aralık 1944), ressam', 'Wassily Kandinsky (4 Aralık 1866, Moskova – 13 Aralık 1944, Neuilly-sur-Seine), Rus ressam'],
  ],
  'vincent-van-gogh': [['Vincent Willem van Gogh (telaffuz: Üst orta', 'Vincent Willem van Gogh (30 Mart 1853 – 29 Temmuz 1890), Hollandalı ressam. Üst orta']],
  'francisco-de-zurbaran': [
    [
      '17. yüzyıl İspanyol ressam. ) hakkında resimleri ile isim yapmıştır.',
      '17. yüzyıl İspanyol ressamı. Keşişleri, rahibeleri ve azizleri konu alan dinî resimleriyle isim yapmıştır.',
    ],
  ],
  'el-greco': [['El Greco,, Yunan', 'El Greco, Yunan']],
  'edvard-munch': [['Edvard Munch, (IPA: [ˈɛdvɑʈ muŋk]),, özellikle', 'Edvard Munch (12 Aralık 1863 – 23 Ocak 1944), özellikle']],
  'leonardo-da-vinci': [
    [
      'Leonardo di ser Piero da Vinci ( Leonardo da Vinci, asıl adı Leonardo di ser Piero da Vinci ("Vinci\'li Sör Piero\'nun oğlu Leonardo") olan, 15 Nisan',
      'Leonardo da Vinci, asıl adı Leonardo di ser Piero da Vinci ("Vinci\'li Sör Piero\'nun oğlu Leonardo"), 15 Nisan',
    ],
  ],
  'rembrandt-van-rijn': [['(Felemenkçe telaffuz: [ˈrɛmbrɑnt ˈɦɑrmə(n)soːn vɑn ˈrɛin] ( dinle); d. 15', '(d. 15']],
  'hans-baldung-grien': [['Strazburg, Serbest İmparatorluk Şehri (günümüzde Fransa) Alman', 'Strazburg, günümüzde Fransa) Alman']],
  'paolo-veronese': [['"16. : cinquecento) döneminde', '16. yüzyıl (İt. cinquecento) döneminde']],
};

// Bu cümleden sonrası (ör. eser listesi) atılır
const KES = {
  'agnolo-bronzino': 'verildiği düşünülmektedir.',
};

export function biyografiDuzelt(id, metin) {
  let t = String(metin || '');
  for (const [eski, yeni] of DEGISTIR[id] || []) t = t.split(eski).join(yeni);
  if (KES[id] && t.includes(KES[id])) t = t.slice(0, t.indexOf(KES[id]) + KES[id].length);
  return t
    .replace(/\s*\(\s*dinle\s*\)/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
}
