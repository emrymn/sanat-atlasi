// Eser dersleri (basyapit-dersleri/eserler/<klasör>/): yayın kapısı, Markdown → HTML ve soru doğrulama.
// Saf mantık (birim testli; ekran yok). Ekran: js/ekranlar/eserDersi.js. Bkz. KARARLAR.md "İş 175".
//
// Kapı (data/ders_yayin.json): { dersler: { başyapıt anahtarı: klasör }, onayli: [klasör] }
//   'onayli' → herkese açık · 'taslak' → yalnız geliştirici modunda, uyarıyla · 'kapali' → ders var ama görünmez
//   'yok'    → bu başyapıtın dersi yok
// Dersleri Qwen üretti; bağımsız denetimden geçip Emre onaylamadan hiçbiri 'onayli' olmaz.

export const SEVIYELER = ['baslangic', 'orta', 'ileri'];
export const SEVIYE_ADLARI = { baslangic: 'Başlangıç', orta: 'Orta', ileri: 'İleri' };
export const DERS_KOKU = 'basyapit-dersleri/eserler/';

const KLASOR = /^[A-Za-z0-9-]+$/; // yol parçası olarak güvenli (.., / yok)

export function yayinAl(json) {
  const dersler = new Map();
  const ham = json && typeof json.dersler === 'object' && json.dersler ? json.dersler : {};
  for (const [anahtar, klasor] of Object.entries(ham)) if (typeof klasor === 'string' && KLASOR.test(klasor)) dersler.set(anahtar, klasor);
  const klasorler = new Set(dersler.values());
  const onayli = new Set((json && Array.isArray(json.onayli) ? json.onayli : []).filter((k) => klasorler.has(k)));
  return { dersler, onayli };
}

export const dersKlasoru = (yayin, anahtar) => (yayin && yayin.dersler.get(anahtar)) || null;

export function dersDurumu(yayin, anahtar, gelistirici = false) {
  const k = dersKlasoru(yayin, anahtar);
  if (!k) return 'yok';
  if (yayin.onayli.has(k)) return 'onayli';
  return gelistirici ? 'taslak' : 'kapali';
}

export const dersGorunurMu = (durum) => durum === 'onayli' || durum === 'taslak';

export function dersYolu(klasor, dosya) {
  if (!KLASOR.test(klasor) || !/^[A-Z_]+\.(json|md)$/.test(dosya)) throw new Error('geçersiz ders yolu');
  return `${DERS_KOKU}${klasor}/${dosya}`;
}

// ---------- Ders metni: ekranda gösterilecek hâl (İş 185) ----------
// Modelin çalışma notlarını ayıkla (İş 185, 187): kanıt etiketleri, (belirsiz)/(yorum)/(B) notları, kaynak/katalog/Wikidata
// cümleleri ("NG kaydı…", "WD…", "föy…"), "X'in betimlediği gibi:" kalıpları, kod ve dosya adları, kimlik/kaynak/etkinlik bölümleri
const ATLA = /kimlik|etkinlik|kanıt|kaynak|sınır|kalite|öğrenme|sıra sizde|seminer|standart|yöntem/i;
const META = /\b(NG|WD|Wikidata|Wikipedia|Commons|[a-z]{2}wiki|föy\w*|birincil|ikincil|envanter\w*|data|vision|oturum\w*|HTTP|URL|P\d{2,}|Q\d{3,}|[KSDE]\d{1,2}|C\d{3})\b|\bwiki\b|\bParti \d|erişil\w*|\bp\.\s?\d|kaynak betim\w*|\.md\b|§|https?:/i;
const KAYNAK_KALIBI = /[^.;:!?]{0,60}?\b(betimlediği|betimlediğine|betimine|betimlemesine|kaydına|föyüne|föyünün)\s*(gibi|göre)?[:,]?\s+/gi;
const buyuk = (x) => x.replace(/^\s*([a-zçğıöşü])/, (m, h) => h.toLocaleUpperCase('tr'));
function cumleleriSuz(metin) {
  const c = metin
    .replace(KAYNAK_KALIBI, '')
    .split(/(?<=[.!?])\s+(?=["“(]?[A-ZÇĞİÖŞÜ0-9])/)
    .filter((x) => x.trim() && !META.test(x) && (x.match(/\(/g) || []).length === (x.match(/\)/g) || []).length);
  return buyuk(c.join(' '));
}
export function temizle(md) {
  const bolumler = [];
  let atla = '';
  for (let s of String(md || '').replace(/\r/g, '').split('\n')) {
    if (/^#\s/.test(s) || /^\*\*(Eser|Ön koşul|Standart|Kaynak)/i.test(s)) continue;
    const b = /^#{2,}\s+(.*)$/.exec(s);
    if (b) {
      atla = !ATLA.test(b[1]) ? '' : /kimlik/i.test(b[1]) ? 'liste' : 'tam';
      if (!atla) bolumler.push(`## ${b[1].replace(/^\d+[.)]\s*/, '').replace(/\s*\([^)]*\)/g, '').replace(/\s*[—–-]\s*[^—–-]*\b(NG|WD|wiki|föy)\b.*$/i, '')}`);
      continue;
    }
    // kimlik bölümünde yalnız liste atlanır (düz paragraf eserin tanıtımıdır); diğer atlanan bölümler bütünüyle gider
    if (atla === 'tam' || (atla === 'liste' && /^\s*([-*]|\d+[.)])\s/.test(s))) continue;
    if (/^\s*\|/.test(s)) continue;
    const on = (/^(\s*(?:[-*]|\d+[.)])\s+)/.exec(s) || [''])[0];
    let g = s
      .slice(on.length)
      .replace(/`[^`]*`/g, '')
      .replace(/\s*\[[CKSDE]\d{1,4}\]/g, '')
      .replace(/\s*\((belirsiz|tartışma|yorum|karşılaştırma)[^()]*\)/gi, '')
      .replace(/\s*\((?:[ABCDE](?:\s*[\/–-]\s*[ABCDE])?)\)/g, '')
      .replace(/\s*\([^()]*oturum[^()]*\)\.?/gi, '');
    g = cumleleriSuz(g)
      .replace(/\s+([.,;:])/g, '$1')
      .replace(/(\S) {2,}/g, '$1 ')
      .trim();
    if (!g || /^[\s.,;:—–-]*$/.test(g)) continue;
    bolumler.push(on + g);
  }
  // boş kalan alt başlıkları at
  return bolumler.filter((x, i, l) => !/^## /.test(x) || (l[i + 1] !== undefined && !/^## /.test(l[i + 1]))).join('\n');
}

// ---------- Markdown → HTML (derslerde geçen yapılar: başlık, paragraf, liste, tablo, çizgi, alıntı) ----------
const kacis = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Satır içi: önce kaçış, sonra `kod`, **kalın**, *italik*, [C012] kanıt etiketi. Bağlantı üretilmez (dış adres yok).
export function satirIci(metin) {
  return kacis(metin)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
    .replace(/\[([CKS]\d{1,4})\]/g, '<sup class="drs-kanit" data-kanit="$1">$1</sup>');
}

const tabloSatiri = (s) =>
  s
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((h) => h.trim());

export function mdHtml(md, { ilkBaslikYok = true } = {}) {
  const satirlar = String(md || '').replace(/\r/g, '').split('\n');
  const cikti = [];
  let i = 0;
  let ilk = ilkBaslikYok;
  const liste = (desen, etiket) => {
    const ogeler = [];
    while (i < satirlar.length && desen.test(satirlar[i])) ogeler.push(satirlar[i++].replace(desen, ''));
    cikti.push(`<${etiket}>${ogeler.map((o) => `<li>${satirIci(o)}</li>`).join('')}</${etiket}>`);
  };
  while (i < satirlar.length) {
    const s = satirlar[i];
    const b = /^(#{1,6})\s+(.*)$/.exec(s);
    if (!s.trim()) i++;
    else if (b) {
      i++;
      if (b[1].length === 1 && ilk) ilk = false; // sayfanın kendi başlığı var
      else cikti.push(`<h${Math.min(4, b[1].length + 1)}>${satirIci(b[2])}</h${Math.min(4, b[1].length + 1)}>`);
    } else if (/^\s*[-*]\s+/.test(s)) liste(/^\s*[-*]\s+/, 'ul');
    else if (/^\s*\d+[.)]\s+/.test(s)) liste(/^\s*\d+[.)]\s+/, 'ol');
    else if (/^-{3,}\s*$/.test(s)) {
      cikti.push('<hr>');
      i++;
    } else if (s.startsWith('|')) {
      const t = [];
      while (i < satirlar.length && satirlar[i].startsWith('|')) t.push(satirlar[i++]);
      const ayrac = t.length > 1 && /^[\s|:-]+$/.test(t[1]);
      const govde = (ayrac ? t.slice(2) : t).map((r) => `<tr>${tabloSatiri(r).map((h) => `<td>${satirIci(h)}</td>`).join('')}</tr>`);
      const bas = ayrac ? `<thead><tr>${tabloSatiri(t[0]).map((h) => `<th>${satirIci(h)}</th>`).join('')}</tr></thead>` : '';
      cikti.push(`<div class="drs-tablo"><table>${bas}<tbody>${govde.join('')}</tbody></table></div>`);
    } else if (s.startsWith('>')) {
      const a = [];
      while (i < satirlar.length && satirlar[i].startsWith('>')) a.push(satirlar[i++].replace(/^>\s?/, ''));
      cikti.push(`<blockquote>${satirIci(a.join(' '))}</blockquote>`);
    } else {
      const p = [];
      while (i < satirlar.length && satirlar[i].trim() && !/^(#{1,6}\s|\s*[-*]\s+|\s*\d+[.)]\s+|\||>|-{3,}\s*$)/.test(satirlar[i])) p.push(satirlar[i++].trim());
      cikti.push(`<p>${satirIci(p.join(' '))}</p>`);
    }
  }
  return cikti.join('\n');
}

// ---------- DERS.json: kanıt etiketi → iddia ve kaynakları ----------
export function kanitDizini(ders) {
  const kaynaklar = new Map((ders && Array.isArray(ders.kaynaklar) ? ders.kaynaklar : []).filter((k) => k && k.id).map((k) => [k.id, k]));
  const iddialar = new Map();
  for (const x of ders && Array.isArray(ders.iddialar) ? ders.iddialar : []) {
    if (!x || typeof x.id !== 'string' || typeof x.ifade !== 'string') continue;
    const k = (Array.isArray(x.kaynak_id) ? x.kaynak_id : []).map((id) => kaynaklar.get(id)).filter(Boolean);
    iddialar.set(x.id, { ifade: x.ifade, kaynaklar: k.map((y) => [y.kurum, y.belge].filter(Boolean).join(' · ')) });
  }
  return iddialar;
}

// ---------- SORULAR.json: yalnız biçimi sağlam çoktan seçmeliler ----------
const yazi = (x) => typeof x === 'string' && x.trim().length > 0;

export function sorulariAl(json) {
  const l = json && Array.isArray(json.coktan_secmeli) ? json.coktan_secmeli : [];
  return l
    .filter((s) => s && yazi(s.soru) && Array.isArray(s.secenekler) && s.secenekler.length >= 2 && s.secenekler.every((o) => o && yazi(o.harf) && yazi(o.metin)))
    .filter((s) => s.secenekler.filter((o) => o.harf === s.dogru).length === 1 && new Set(s.secenekler.map((o) => o.harf)).size === s.secenekler.length)
    .map((s) => ({
      id: yazi(s.id) ? s.id : '',
      soru: s.soru,
      secenekler: s.secenekler.map((o) => ({ harf: o.harf, metin: o.metin })),
      dogru: s.dogru,
      gerekce: yazi(s.gerekce) ? s.gerekce : '',
      yanlis: s.yanlis_gerekceleri && typeof s.yanlis_gerekceleri === 'object' ? s.yanlis_gerekceleri : {},
    }));
}
