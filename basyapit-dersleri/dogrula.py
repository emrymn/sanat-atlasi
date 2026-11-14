#!/usr/bin/env python3
"""basyapit-dersleri doğrulayıcı.

Kullanım:
  python3 basyapit-dersleri/dogrula.py          # gerçek pilot dosyalarını doğrula
  python3 basyapit-dersleri/dogrula.py --test   # negatif + uyum testlerini çalıştır

Katmanlar:
1. Mini JSON Schema yorumlayıcı (bağımlılıksız, her zaman çalışır).
2. Standart `jsonschema` Draft 2020-12 doğrulaması (KURULUYSA otomatik etkinleşir).
   Geliştirme ortamında izole kurulum: python3 -m venv .qwen/tmp/venv-dogrula &&
   .qwen/tmp/venv-dogrula/bin/python -m pip install jsonschema
   Sonra: .qwen/tmp/venv-dogrula/bin/python basyapit-dersleri/dogrula.py
   (Uygulamanın package.json / üretim bağımlılıkları değiştirilmez.)
3. Çapraz tutarlılık: iddia/kaynak kimlikleri, mükerrer kimlik reddi, quiz A/B kuralı,
   D/E belirsizlik işareti, kelime sayısı, 12 bölüm, durum.
4. Etiketsiz olgusal cümle tespitçisi (SEZGİSEL/HEURISTIC — UYARI üretir, hata değil).

ÖNEMLİ SEMANTİK SINIR: Bu betik YAPISAL tutarlılığı denetler. İçeriğin olgusal/semantik
doğruluğunu GARANTİ ETMEZ. Etiketsiz olgu tespitçisi yalnızca sayı/tarih/ölçüm sinyali
taşıyan cümleleri yakalar; sayı içermeyen olgusal prose'u (ör. "Hollanda en zengin
toplumdu") kaçırabilir ve yorum/talimat cümlelerinde yanlış pozitif verebilir. Kaynağın
bir iddiayı gerçekten destekleyip desteklemediği OTOMATİK çözülemez — insan/haricî model
denetimi ve ham kaynak kontrolü (AKADEMIK_BAGIMSIZ_DENETIM.md, PILOT_SON_DOGRULAMA.md) gerekir.
Çıkış kodu: 0 = temiz, 1 = hata.
"""
import json, os, re, sys, difflib
from collections import Counter

ROOT = os.path.dirname(os.path.abspath(__file__))

# jsonschema isteğe bağlı
try:
    from jsonschema import Draft202012Validator
    JSONSCHEMA = True
except ImportError:
    JSONSCHEMA = False

def hata(lista, msg): lista.append(msg)
def uyari(lista, msg): lista.append(msg)

# ---------- mini JSON Schema yorumlayıcı ----------
def coz(ref, kok):
    if not ref.startswith('#/'):
        raise ValueError('yalnız yerel $ref desteklenir: ' + ref)
    dugum = kok
    for parca in ref[2:].split('/'):
        dugum = dugum[parca]
    return dugum

def sema_dogrula(ornek, sema, kok, yol, hatalar):
    if '$ref' in sema:
        return sema_dogrula(ornek, coz(sema['$ref'], kok), kok, yol, hatalar)
    t = sema.get('type')
    if t:
        eslesme = {
            'object': lambda x: isinstance(x, dict),
            'array': lambda x: isinstance(x, list),
            'string': lambda x: isinstance(x, str),
            'number': lambda x: isinstance(x, (int, float)) and not isinstance(x, bool),
            'integer': lambda x: isinstance(x, int) and not isinstance(x, bool),
            'boolean': lambda x: isinstance(x, bool),
        }[t]
        if not eslesme(ornek):
            hata(hatalar, f'{yol}: tip {t} bekleniyordu, {type(ornek).__name__} geldi'); return
    if 'enum' in sema and ornek not in sema['enum']:
        hata(hatalar, f'{yol}: {ornek!r} enum dışında {sema["enum"]}')
    if isinstance(ornek, str):
        if 'pattern' in sema and not re.search(sema['pattern'], ornek):
            hata(hatalar, f'{yol}: {ornek!r} desenle eşleşmiyor: {sema["pattern"]}')
        if sema.get('format') == 'uri' and not re.match(r'^https?://', ornek):
            hata(hatalar, f'{yol}: URI biçimi bekleniyordu: {ornek!r}')
    if isinstance(ornek, dict):
        for alan in sema.get('required', []):
            if alan not in ornek:
                hata(hatalar, f'{yol}: zorunlu alan eksik: {alan}')
        ozellikler = sema.get('properties', {})
        desenler = sema.get('patternProperties', {})
        if sema.get('additionalProperties') is False:
            for anahtar in ornek:
                if anahtar not in ozellikler and not any(re.search(p, anahtar) for p in desenler):
                    hata(hatalar, f'{yol}: beklenmeyen alan: {anahtar}')
        for anahtar, deger in ornek.items():
            if anahtar in ozellikler:
                sema_dogrula(deger, ozellikler[anahtar], kok, f'{yol}.{anahtar}', hatalar)
            for p, alt in desenler.items():
                if re.search(p, anahtar):
                    sema_dogrula(deger, alt, kok, f'{yol}.{anahtar}', hatalar)
    if isinstance(ornek, list):
        if 'minItems' in sema and len(ornek) < sema['minItems']:
            hata(hatalar, f'{yol}: en az {sema["minItems"]} öğe gerekli, {len(ornek)} var')
        if 'maxItems' in sema and len(ornek) > sema['maxItems']:
            hata(hatalar, f'{yol}: en çok {sema["maxItems"]} öğe, {len(ornek)} var')
        if 'items' in sema:
            for i, oge in enumerate(ornek):
                sema_dogrula(oge, sema['items'], kok, f'{yol}[{i}]', hatalar)

def jsonschema_dogrula(ornek, sema, yol, hatalar):
    """Standart Draft 2020-12 (kuruluysa). format annotation-only (default)."""
    if not JSONSCHEMA:
        return
    try:
        Draft202012Validator.check_schema(sema)
    except Exception as e:
        hata(hatalar, f'{yol}: şema Draft2020-12 geçersiz: {e}'); return
    v = Draft202012Validator(sema)
    for e in sorted(v.iter_errors(ornek), key=lambda x: list(x.path)):
        hata(hatalar, f'{yol}[jsonschema]: {"/".join(map(str, e.path))}: {e.message[:140]}')

# ---------- cümle bölücü (kısaltma korumalı) ----------
ABBR = re.compile(r'\b(no|No|c|J|Jr|Dr|Prof|ed|Ed|vs|vb|a\.g\.e)\.\s')
# Türkçe yüzyıl kısaltmaları: "17. yüzyıl", "19. yy" — nokta cümle sonu değil
YUZ = re.compile(r'\b(\d{1,2})\.\s(?=yüzyıl|yy|yıl)')
def cümleler(metin):
    m = ABBR.sub(lambda x: x.group(0).replace('.', '<DOT>'), metin)
    m = YUZ.sub(lambda x: x.group(0).replace('.', '<DOT>'), m)
    return [c.replace('<DOT>', '.') for c in re.split(r'(?<=[.!?])\s+', m)]

def kelime(metin):
    metin = re.sub(r'\[C\d{3}[^\]]*\]', '', metin)
    metin = re.sub(r'[#*`|\-]', ' ', metin)
    return len(metin.split())

BELIRSIZLIK = re.compile(r'belirsiz|doğrulanamadı|doğrulanmadı|aktarıldığına göre|aktarılmıştır|tartış|ihtilaf|yorum|hipotez|kaynakların betimlediği|atfen|kesin değil|kuşku', re.I)

# ---------- etiketsiz olgusal cümle tespitçisi (HEURISTIC) ----------
FACT = re.compile(r'\b(1[0-9]{3}|20[0-9]{2})\b|\b\d+([.,]\d+)?\s*(cm|mm|florin|fl|guilders|piksel|px)\b|\b\d+\s*×\s*\d+', re.I)
SKIP = re.compile(r'yorum|kanımca|bence|hissettirir|gibi durur|gibi görünür|olarak okunabilir|olarak yorumlanabilir|paradoks|estetik|felsefi|etik|tinin|aura|çıkarsız|yücelik|sublime|büyülü|sihir|törenmiş|nefes alır|davet|öğretir|yoğunluğu|bakın|düşünün|yazın|sıralayın|seçin|karşılaştırın|açın|bulun|listeleyin|kurun|savunun|değerlendirin|sınayın|dökün|hatırlayın|adlandırın|önerin|soru|Kaynakça|Bu ders|Bu bölüm|Bu seminer|Not:|Önemli|Ön koşul|Seviye|Eser:|Görsel|Kurum|İddia|Yöntem|Kural|Düzeltme|Doğrulama|Durum|SONUÇ|Tam künye|Birincil|İkincil|Erişilemeyen|KANIT_DOSYASI|KALITE_KONTROL|dogrula|KAYNAKCA|DÜZELTME|veri notu|dürüstlük beyanı|Açık araştırma boşlukları|okunamadı|erişilemedi|bu dosyada|\(K\d+\)', re.I)

def etiketsiz_olgu_tespit(metin):
    """Sayı/tarih/ölçüm sinyali taşıyan ama [C###] etiketi olmayan cümle adayları.
    HEURISTIC: yanlış pozitif/negatif olabilir; semantik garanti değildir."""
    out = []
    for cumle in cümleler(metin):
        c = cumle.strip()
        if not c or c.startswith('#') or '|' in c or c.startswith('- '):
            continue
        if re.search(r'\[C\d{3}', c):
            continue
        if c.endswith('?'):
            continue
        if SKIP.search(c):
            continue
        if FACT.search(c):
            out.append(c[:140])
    return out

# ---------- Parti 1 düzeltme: yeni kalite katmanları (UYARI ağırlıklı) ----------
# §8 kelime hedef aralıkları (hedef dışı = UYARI; kısa ders bilinçli tercih olabilir)
KELIME_ARALIK = {'baslangic': (400, 500), 'orta': (1300, 1600), 'ileri': (2600, 3200)}

def paragraflar(metin):
    out = []
    for blok in re.split(r'\n\s*\n', metin):
        b = blok.strip()
        if not b or b.startswith('#'):
            continue
        out.append(b)
    return out

def yakin_tekrar_kontrol(metin, fn, eser_id, U):
    """Ardışık yakın-kopya paragraflar (difflib > 0.6) → §8 dolgu UYARISI (heuristic)."""
    ps = paragraflar(metin)
    for i in range(len(ps) - 1):
        a, b = ps[i], ps[i + 1]
        if len(a) < 80 or len(b) < 80:
            continue
        r = difflib.SequenceMatcher(None, a, b).ratio()
        if r > 0.6:
            U.append(f'{eser_id}: {fn} yakın tekrar ardışık paragraf (benzerlik {r:.2f}, §8 dolgu): "{a[:55]}..."')

def seviye_tekrar_kontrol(metinler, eser_id, U):
    """Seviyeler arası birebir uzun cümle tekrarı (§8) → UYARI (heuristic)."""
    def sset(m):
        return {c.strip() for c in cümleler(m) if len(c.strip()) > 60 and not c.strip().startswith('#') and '|' not in c}
    sets = {fn: sset(m) for fn, m in metinler.items()}
    fns = list(sets)
    for i in range(len(fns)):
        for j in range(i + 1, len(fns)):
            ortak = sets[fns[i]] & sets[fns[j]]
            if len(ortak) >= 5:
                U.append(f'{eser_id}: {fns[i]} ↔ {fns[j]} seviyeler arası {len(ortak)} birebir ortak uzun cümle (§8 tekrar)')

def sayim_kontrol(ders, kanit_metni, eser_id, U):
    """KANIT 'Sayım:' satırı ↔ DERS.json iddia seviyeleri tutarlılığı → UYARI."""
    if eser_id == 'Q167605':
        return  # pilot: kendi biçimi var, değiştirilmez
    m = re.search(r'\*\*Sayım:\*\*\s*(\d+)\s*iddia[^\n]*', kanit_metni)
    if not m:
        U.append(f'{eser_id}: KANIT "Sayım:" satırı bulunamadı (sayım tutarlılığı denetlenemedi)')
        return
    actual = Counter(i['seviye'] for i in ders.get('iddialar', []))
    if int(m.group(1)) != len(ders.get('iddialar', [])):
        U.append(f'{eser_id}: KANIT Sayım toplam {m.group(1)} ≠ DERS.json {len(ders.get("iddialar", []))}')
    line = m.group(0)
    for sev in 'ABCDE':
        dm = re.search(sev + r'\s*=\s*(\d+)', line)
        if dm and int(dm.group(1)) != actual.get(sev, 0):
            U.append(f'{eser_id}: KANIT Sayım {sev}={dm.group(1)} ≠ DERS.json {sev}={actual.get(sev, 0)}')

def totoloji_kontrol(sorular, eser_id, U):
    """≤3 kelimelik 'X değil.' çeldirici gerekçeleri (§10) → UYARI (heuristic)."""
    for q in sorular.get('coktan_secmeli', []):
        for harf, g in q.get('yanlis_gerekceleri', {}).items():
            gs = g.strip()
            if len(gs.split()) <= 3 and re.search(r'değil\.?$', gs):
                U.append(f'{eser_id}: CS {q["id"]} {harf} totolojik çeldirici gerekçesi (§10): "{gs}"')

# ---------- çapraz tutarlılık ----------
def capraz_kontrol(ders, sorular, kanit_metni, ders_metinleri, eser_id):
    H, U = [], []
    iddialar = {}
    for i in ders.get('iddialar', []):
        cid = i['id']
        if cid in iddialar:
            hata(H, f'{eser_id}: mükerrer iddia kimliği {cid}')
        iddialar[cid] = i
    kaynaklar = set()
    for k in ders.get('kaynaklar', []):
        if k['id'] in kaynaklar:
            hata(H, f'{eser_id}: mükerrer kaynak kimliği {k["id"]}')
        kaynaklar.add(k['id'])
    kanit_tanimli = set(re.findall(r'\*\*(C\d{3})\*\*', kanit_metni))

    for cid, i in iddialar.items():
        if cid not in kanit_tanimli:
            hata(H, f'{eser_id}: {cid} DERS.json\'da var, KANIT_DOSYASI.md\'de tanımlı değil')
        for k in i.get('kaynak_id', []):
            if k not in kaynaklar:
                hata(H, f'{eser_id}: {cid} bilinmeyen kaynak {k}')
    for cid in kanit_tanimli - set(iddialar):
        uyari(U, f'{eser_id}: {cid} KANIT_DOSYASI\'nde tanımlı ama DERS.json iddialarında yok')

    seviye_map = {'DERS_BASLANGIC.md': 'baslangic', 'DERS_ORTA.md': 'orta', 'DERS_ILERI.md': 'ileri'}
    for fn, metin in ders_metinleri.items():
        for cid in set(re.findall(r'\[(C\d{3})', metin)):
            if cid not in iddialar:
                hata(H, f'{eser_id}: {fn} bilinmeyen iddia etiketi {cid}')
            elif cid not in kanit_tanimli:
                hata(H, f'{eser_id}: {fn} {cid} kanıt dosyasında yok')
        for cumle in cümleler(metin):
            for cid in re.findall(r'\[(C\d{3})', cumle):
                if cid in iddialar and iddialar[cid]['seviye'] in ('D', 'E') and not BELIRSIZLIK.search(cumle):
                    uyari(U, f'{eser_id}: {fn} {cid} (D/E) belirsizlik işareti olmayan cümlede kullanılmış')
        for aday in etiketsiz_olgu_tespit(metin):
            uyari(U, f'{eser_id}: {fn} etiketsiz olgusal cümle adayı (heuristic): "{aday}"')
        if fn in seviye_map and 'seviyeler' in ders:
            beklenen = ders['seviyeler'][seviye_map[fn]]['kelime_sayisi']
            olculen = kelime(metin)
            if abs(olculen - beklenen) > max(10, beklenen * 0.05):
                hata(H, f'{eser_id}: {fn} kelime sayısı tutarsız (json {beklenen}, ölçülen {olculen})')
            lo, hi = KELIME_ARALIK[seviye_map[fn]]
            if not (lo <= olculen <= hi):
                uyari(U, f'{eser_id}: {fn} kelime {olculen} hedef aralık {lo}–{hi} dışında (§8; kısa ders bilinçli tercih olabilir)')
        yakin_tekrar_kontrol(metin, fn, eser_id, U)

    seviye_tekrar_kontrol(ders_metinleri, eser_id, U)
    sayim_kontrol(ders, kanit_metni, eser_id, U)
    totoloji_kontrol(sorular, eser_id, U)

    def kanit_seviye_kontrol(q, grup):
        if not q.get('kanit'):
            hata(H, f'{eser_id}: {grup} {q["id"]} boş quiz kanıtı (kanit dizisi boş)')
        for cid in q.get('kanit', []):
            if cid not in iddialar:
                hata(H, f'{eser_id}: {grup} {q["id"]} bilinmeyen kanit {cid}')
            elif iddialar[cid]['seviye'] not in ('A', 'B'):
                hata(H, f'{eser_id}: {grup} {q["id"]} A/B dışı kanıta dayanıyor: {cid} ({iddialar[cid]["seviye"]})')
    for q in sorular.get('coktan_secmeli', []):
        harfler = [s['harf'] for s in q['secenekler']]
        if q['dogru'] not in harfler:
            hata(H, f'{eser_id}: CS {q["id"]} doğru şık seçeneklerde yok')
        yanlislar = set(harfler) - {q['dogru']}
        if set(q.get('yanlis_gerekceleri', {})) != yanlislar:
            hata(H, f'{eser_id}: CS {q["id"]} yanlış gerekçeleri eksik/fazla')
        kanit_seviye_kontrol(q, 'CS')
    for grup in ('dogru_yanlis', 'gozlem_sorulari', 'tekrar_kartlari'):
        for q in sorular.get(grup, []):
            kanit_seviye_kontrol(q, grup)
    for q in sorular.get('acik_uclu', []):
        for cid in q.get('kanit', []):
            if cid not in iddialar:
                hata(H, f'{eser_id}: AU {q["id"]} bilinmeyen kanit {cid}')

    if set(ders.get('bolum_eslesme', {})) != {str(i) for i in range(1, 13)}:
        hata(H, f'{eser_id}: bolum_eslesme 12 bölüm değil')
    if ders.get('durum') == 'Yayına aday' and 'bekliyor' in ders.get('kalite_kontrol', {}).get('insan_onayi', '').lower():
        hata(H, f'{eser_id}: insan onayı beklerken "Yayına aday" olamaz')
    return H, U

# ---------- gerçek dosyaları doğrula ----------
def ana():
    H, U = [], []
    semalar = json.load(open(os.path.join(ROOT, 'DERS_SEMASI.json')))
    print(f'jsonschema Draft2020-12 katmanı: {"AKTİF" if JSONSCHEMA else "KURULU DEĞİL (mini yorumlayıcı yeterli)"}')
    eser_kok = os.path.join(ROOT, 'eserler')
    if not os.path.isdir(eser_kok):
        hata(H, 'eserler/ klasörü yok'); return H, U
    for eser_id in sorted(os.listdir(eser_kok)):
        dizin = os.path.join(eser_kok, eser_id)
        if not os.path.isdir(dizin):
            continue
        print(f'--- {eser_id} ---')
        ders_yol = os.path.join(dizin, 'DERS.json')
        soru_yol = os.path.join(dizin, 'SORULAR.json')
        kanit_yol = os.path.join(dizin, 'KANIT_DOSYASI.md')
        for yol in (ders_yol, soru_yol, kanit_yol):
            if not os.path.exists(yol):
                hata(H, f'{eser_id}: eksik dosya {os.path.basename(yol)}')
        if not (os.path.exists(ders_yol) and os.path.exists(soru_yol)):
            continue
        ders = json.load(open(ders_yol))
        sorular = json.load(open(soru_yol))
        sema_dogrula(ders, semalar['DERS'], semalar['DERS'], f'{eser_id}.DERS', H)
        sema_dogrula(sorular, semalar['SORULAR'], semalar['SORULAR'], f'{eser_id}.SORULAR', H)
        jsonschema_dogrula(ders, semalar['DERS'], f'{eser_id}.DERS', H)
        jsonschema_dogrula(sorular, semalar['SORULAR'], f'{eser_id}.SORULAR', H)
        kanit_metni = open(kanit_yol).read() if os.path.exists(kanit_yol) else ''
        ders_metinleri = {}
        for fn in ('DERS_BASLANGIC.md', 'DERS_ORTA.md', 'DERS_ILERI.md'):
            yol = os.path.join(dizin, fn)
            if os.path.exists(yol):
                ders_metinleri[fn] = open(yol).read()
            else:
                hata(H, f'{eser_id}: eksik ders dosyası {fn}')
        h, u = capraz_kontrol(ders, sorular, kanit_metni, ders_metinleri, eser_id)
        H += h; U += u
        print(f'    iddia: {len(ders.get("iddialar", []))} | CS: {len(sorular.get("coktan_secmeli", []))} DY: {len(sorular.get("dogru_yanlis", []))} AU: {len(sorular.get("acik_uclu", []))} GZ: {len(sorular.get("gozlem_sorulari", []))} TK: {len(sorular.get("tekrar_kartlari", []))}')
    return H, U

# ---------- testler ----------
def temel_fixture():
    ders = {
        'surum': '1.0', 'eser_id': 'TEST', 'sanatci_id': 'test', 'baslik': 'Test',
        'kunye': {'sanatci': 'T', 'tarih': 'y. 1660', 'teknik': 'tuval', 'muze': 'M', 'envanter': 'X'},
        'gorsel': {'url': 'https://example.org/i.jpg', 'kaynak': 'M', 'lisans': 'PD', 'dogrulama': {'yontem': 'test', 'sinirlar': 'yok'}},
        'seviyeler': {s: {'dosya': f'DERS_{s.upper()}.md', 'hedef_sure_dk': 3, 'kelime_sayisi': 3} for s in ('baslangic', 'orta', 'ileri')},
        'bolum_eslesme': {str(i): ['DERS_ORTA.md'] for i in range(1, 13)},
        'ogrenme_kazanimlari': ['k'],
        'temel_kavramlar': [{'ad': 'k', 'tanim': 't'}],
        'iddialar': [
            {'id': 'C001', 'ifade': 'A olgu', 'seviye': 'A', 'kaynak_id': ['K1'], 'kullanim': 'olgu'},
            {'id': 'C002', 'ifade': 'C yorum', 'seviye': 'C', 'kaynak_id': ['K1'], 'kullanim': 'yorum'},
            {'id': 'C003', 'ifade': 'D ihtilaf', 'seviye': 'D', 'kaynak_id': ['K1'], 'kullanim': 'tartisma'},
            {'id': 'C004', 'ifade': 'E belirsiz', 'seviye': 'E', 'kaynak_id': ['K1'], 'kullanim': 'belirsiz'},
        ],
        'kaynaklar': [{'id': 'K1', 'kurum': 'M', 'belge': 'b', 'url': 'https://example.org', 'erisim_tarihi': '2026-11-13', 'erisim_durumu': '200', 'tur': 'birincil'}],
        'durum': 'İnsan incelemesi bekliyor',
    }
    sorular = {
        'surum': '1.0', 'eser_id': 'TEST',
        'coktan_secmeli': [{'id': 'CS01', 'soru': 's?', 'secenekler': [{'harf': h, 'metin': h} for h in 'ABCD'], 'dogru': 'A', 'gerekce': 'g', 'yanlis_gerekceleri': {'B': 'b', 'C': 'c', 'D': 'd'}, 'kanit': ['C001']}],
        'dogru_yanlis': [{'id': 'DY01', 'ifade': 'i', 'dogru': True, 'aciklama': 'a', 'kanit': ['C001']}],
        'acik_uclu': [{'id': 'AU01', 'soru': 's', 'beklenen_ogeler': ['o'], 'kanit': ['C003']}],
        'gozlem_sorulari': [{'id': 'GZ01', 'soru': 's', 'kanit': ['C001']}],
        'tekrar_kartlari': [{'id': 'TK01', 'on': 'o', 'arka': 'a', 'kanit': ['C001']}],
    }
    kanit = '**C001** — x\n**C002** — x\n**C003** — x\n**C004** — x\n'
    metinler = {fn: 'Bir cümle [C001]. Tartışmalı bir nokta belirsiz [C003].' for fn in ('DERS_BASLANGIC.md', 'DERS_ORTA.md', 'DERS_ILERI.md')}
    return ders, sorular, kanit, metinler

def testler():
    semalar = json.load(open(os.path.join(ROOT, 'DERS_SEMASI.json')))
    sonuclar = []
    def calis(ad, ders, sorular, kanit, metinler, beklenen_hata_substr):
        H, U = [], []
        sema_dogrula(ders, semalar['DERS'], semalar['DERS'], 'T.DERS', H)
        sema_dogrula(sorular, semalar['SORULAR'], semalar['SORULAR'], 'T.SORULAR', H)
        jsonschema_dogrula(ders, semalar['DERS'], 'T.DERS', H)
        jsonschema_dogrula(sorular, semalar['SORULAR'], 'T.SORULAR', H)
        h, u = capraz_kontrol(ders, sorular, kanit, metinler, 'TEST')
        H += h
        if beklenen_hata_substr is None:
            ok = not H; detay = 'temiz' if ok else '; '.join(H)
        else:
            ok = any(beklenen_hata_substr in x for x in H)
            detay = next((x for x in H if beklenen_hata_substr in x), 'BEKLENEN HATA YOK: ' + '; '.join(H))
        sonuclar.append((ad, ok, detay))

    d, s, k, m = temel_fixture(); calis('pozitif_kontrol', d, s, k, m, None)
    d, s, k, m = temel_fixture(); d['iddialar'][0]['kaynak_id'] = ['K99']; calis('kayip_kaynak', d, s, k, m, 'bilinmeyen kaynak K99')
    d, s, k, m = temel_fixture(); m['DERS_ORTA.md'] = 'Bilinmeyen [C999].'; calis('eksik_kanit_etiketi_metin', d, s, k, m, 'bilinmeyen iddia etiketi C999')
    d, s, k, m = temel_fixture(); k = '**C001** — x\n'; calis('eksik_kanit_tanimi', d, s, k, m, 'KANIT_DOSYASI.md\'de tanımlı değil')
    d, s, k, m = temel_fixture(); d['iddialar'].append(dict(d['iddialar'][0])); calis('mukerrer_iddia', d, s, k, m, 'mükerrer iddia kimliği C001')
    d, s, k, m = temel_fixture(); d['kaynaklar'].append(dict(d['kaynaklar'][0])); calis('mukerrer_kaynak', d, s, k, m, 'mükerrer kaynak kimliği K1')
    d, s, k, m = temel_fixture(); s['coktan_secmeli'][0]['kanit'] = ['C002']; calis('cs_C_kanit', d, s, k, m, 'A/B dışı kanıta dayanıyor: C002 (C)')
    d, s, k, m = temel_fixture(); s['dogru_yanlis'][0]['kanit'] = ['C003']; calis('dy_D_kanit', d, s, k, m, 'A/B dışı kanıta dayanıyor: C003 (D)')
    d, s, k, m = temel_fixture(); s['tekrar_kartlari'][0]['kanit'] = ['C004']; calis('tk_E_kanit', d, s, k, m, 'A/B dışı kanıta dayanıyor: C004 (E)')
    d, s, k, m = temel_fixture(); s['gozlem_sorulari'][0]['kanit'] = ['C002']; calis('gz_C_kanit', d, s, k, m, 'A/B dışı kanıta dayanıyor: C002 (C)')

    # --- YENİ: etiketsiz olgusal cümle tespitçisi (heuristic) ---
    def tespit_test(ad, metin, beklenen_flag):
        flag = bool(etiketsiz_olgu_tespit(metin))
        ok = flag == beklenen_flag
        sonuclar.append((ad, ok, f'flag={flag} beklenen={beklenen_flag}'))
    tespit_test('etiketsiz_olgu_yakalanir', "Vermeer 1632 yılında Delft'te doğdu.", True)
    tespit_test('etiketli_olgu_temiz', "Vermeer 1632 yılında Delft'te doğdu [C002].", False)
    tespit_test('yorum_temiz', "Bu resim hem çok gerçekçi hem de neredeyse büyülü hissettirir.", False)
    tespit_test('soru_temiz', "Işık hangi yönden geliyor?", False)
    tespit_test('talimat_temiz', "Resme bir dakika bakın ve düşünün.", False)
    tespit_test('sayisiz_olgu_kacar_SEMANTIK_SINIR', "Hollanda Cumhuriyeti Avrupa'nın en zengin toplumuydu.", False)  # sayı yok → kaçar (bilinen sınır)

    # --- YENİ: şema ↔ içerik ↔ dogrula uyumu ---
    B = os.path.join(ROOT, 'eserler', 'Q167605')
    if os.path.isdir(B):
        rd = json.load(open(os.path.join(B, 'DERS.json')))
        rs = json.load(open(os.path.join(B, 'SORULAR.json')))
        H = []
        sema_dogrula(rd, semalar['DERS'], semalar['DERS'], 'GERCEK.DERS', H)
        sema_dogrula(rs, semalar['SORULAR'], semalar['SORULAR'], 'GERCEK.SORULAR', H)
        jsonschema_dogrula(rd, semalar['DERS'], 'GERCEK.DERS', H)
        jsonschema_dogrula(rs, semalar['SORULAR'], 'GERCEK.SORULAR', H)
        sonuclar.append(('sema_gercek_icerik_uyumu', not H, 'temiz' if not H else '; '.join(H)))
    d, s, k, m = temel_fixture(); d['iddialar'][0]['seviye'] = 'X'; calis('sema_negatif_seviye', d, s, k, m, 'enum dışında')
    d, s, k, m = temel_fixture(); d['iddialar'][0]['kullanim'] = 'gecersiz'; calis('sema_negatif_kullanim', d, s, k, m, 'enum dışında')
    d, s, k, m = temel_fixture(); d['durum'] = 'Bilinmiyor'; calis('sema_negatif_durum', d, s, k, m, 'enum dışında')

    # --- YENİ: Parti 1 düzeltme kalite katmanları ---
    def uyari_test(ad, ders, sorular, kanit, metinler, beklenen_substr):
        H, U = capraz_kontrol(ders, sorular, kanit, metinler, 'TEST')
        ok = any(beklenen_substr in x for x in U)
        sonuclar.append((ad, ok, next((x for x in U if beklenen_substr in x), 'BEKLENEN UYARI YOK')))
    d, s, k, m = temel_fixture()
    para = 'Bu bir test paragrafıdır ve yeterince uzundur ki benzerlik ölçülebilsin diye bazı kelimeler içerir burada [C001].'
    m['DERS_ORTA.md'] = para + '\n\n' + para
    uyari_test('yakin_tekrar_yakalanir', d, s, k, m, 'yakın tekrar')
    d, s, k, m = temel_fixture(); k = '**C001** — x\n**C002** — x\n**C003** — x\n**C004** — x\n**Sayım:** 9 iddia · A=5 · B=0 · C=0 · D=0 · E=0.'
    uyari_test('sayim_tutarsizligi', d, s, k, m, 'Sayım')
    d, s, k, m = temel_fixture(); s['coktan_secmeli'][0]['yanlis_gerekceleri'] = {'B': 'Bosch değil.', 'C': 'Bruegel değil.', 'D': 'Holbein değil.'}
    uyari_test('totoloji_yakalanir', d, s, k, m, 'totolojik')
    d, s, k, m = temel_fixture(); s['dogru_yanlis'][0]['kanit'] = []; calis('bos_quiz_kaniti', d, s, k, m, 'boş quiz kanıtı')
    d, s, k, m = temel_fixture(); m['DERS_BASLANGIC.md'] = 'Kısa [C001].'
    uyari_test('kelime_aralik_disi', d, s, k, m, 'hedef aralık')

    print('=== NEGATİF + UYUM TESTLERİ ===')
    hepsi = True
    for ad, ok, detay in sonuclar:
        print(f'{"GEÇTİ" if ok else "KALDI"} | {ad} | {detay}')
        hepsi = hepsi and ok
    print(f'\n{sum(1 for _,ok,_ in sonuclar if ok)}/{len(sonuclar)} test geçti | jsonschema: {"AKTİF" if JSONSCHEMA else "KURULU DEĞİL"}')
    print('NOT: Testler yapısal reddetmeyi doğrular; semantik/olgusal doğruluğu garanti etmez.')
    print('NOT: etiketsiz_olgu tespitçisi heuristic\'tir; sayı içermeyen olgusal prose kaçabilir (sayisiz_olgu_kacar testi bu sınırı belgeler).')
    return 0 if hepsi else 1

if __name__ == '__main__':
    if '--test' in sys.argv:
        sys.exit(testler())
    H, U = ana()
    print()
    for u in U:
        print('UYARI:', u)
    for h in H:
        print('HATA:', h)
    print(f'\nSONUÇ: {len(H)} hata, {len(U)} uyarı')
    sys.exit(1 if H else 0)