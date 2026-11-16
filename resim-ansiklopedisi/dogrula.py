#!/usr/bin/env python3
"""resim-ansiklopedisi doğrulayıcı.

Kullanım:
  python3 resim-ansiklopedisi/dogrula.py                 # tüm maddeleri doğrula
  python3 resim-ansiklopedisi/dogrula.py --test          # negatif + uyum testleri
  python3 resim-ansiklopedisi/dogrula.py --dosya <yol…>  # yalnız verilen maddeleri RAPORLA
                                                           (eşzamanlı üretimde genel sayı yanıltır)

Katmanlar:
1. Mini JSON Schema yorumlayıcı (bağımlılıksız, her zaman çalışır).
2. Standart `jsonschema` Draft 2020-12 doğrulaması (KURULUYSA otomatik etkinleşir).
   İzole kurulum: python3 -m venv .qwen/tmp/venv-dogrula &&
   .qwen/tmp/venv-dogrula/bin/python -m pip install jsonschema
3. Çapraz tutarlılık: claim↔kanıt birebir eşleşme, kaynak ID bütünlüğü, taksonomi,
   dizin/tür/önek tutarlılığı, doğrulama özeti, [C###] etiketleri, ilgili madde bağlantıları,
   DOGRULANDI kuralları (okunmuş kaynak + doğrudan destek), yayın statüsü kısıtları.
4. Global: mükerrer id/slug, yakın-kopya metin, CJK taraması, kapsam-dışı sezgiseli,
   etiketsiz olgusal cümle adayları (SEZGİSEL — uyarı üretir, hata değil).

ÖNEMLİ SEMANTİK SINIR: Bu betik YAPISAL tutarlılığı denetler; içeriğin olgusal/semantik
doğruluğunu GARANTİ ETMEZ. Bir URL'nin açılması akademik doğruluğu kanıtlamaz. Metnin
kaynağı gerçekten doğru yorumlayıp yorumlamadığı otomatik çözülemez — bağımsız denetim
(denetim/DENETIM_SABLONU.md) ve insan editoryal onayı şarttır. Etiketsiz olgu tespitçisi
yalnız sayı/tarih sinyali taşıyan cümleleri yakalar; sayı içermeyen olgusal önermeleri
kaçırabilir ve yorum cümlelerinde yanlış pozitif verebilir.
Çıkış kodu: 0 = temiz (hata yok), 1 = hata var.
"""
import json, os, re, sys, difflib
from collections import Counter

ROOT = os.path.dirname(os.path.abspath(__file__))

try:
    from jsonschema import Draft202012Validator
    JSONSCHEMA = True
except ImportError:
    JSONSCHEMA = False

KATEGORI_DIZIN = {
    'IKONOGRAFI': 'ikonografi',
    'MITOLOJI': 'mitoloji',
    'RESIM_TEKNIGI': 'resim-teknikleri',
    'TARIHSEL_NESNE': 'resimlerdeki-nesneler',
}
ONEK_TUR = {'IKO': 'IKONOGRAFI', 'MIT': 'MITOLOJI', 'TEK': 'RESIM_TEKNIGI', 'NES': 'TARIHSEL_NESNE'}

# TAKSONOMI.md ile senkron tutulur (sürüm 1.0)
TAKSONOMI = {
    'IKONOGRAFI': {
        'hristiyan-ikonografisi', 'antik-ikonografi', 'islam-dunyasi-ikonografisi',
        'guney-asya-ikonografisi', 'dogu-asya-ikonografisi', 'osmanli-iran-minyatur-ikonografisi',
        'bitki-hayvan-sembolizmi', 'renk-sayi-sembolizmi', 'alegorik-figurler',
        'vanitas-naturmort-sembolleri', 'kavram-alegorileri',
    },
    'MITOLOJI': {
        'yunan-roma-mitolojisi', 'misir-mezopotamya-mitolojisi', 'iskandinav-kelt-gelenekleri',
        'hint-mitolojisi', 'cin-japon-mitolojisi', 'turk-orta-asya-gelenekleri',
        'diger-mitolojik-gelenekler',
    },
    'RESIM_TEKNIGI': {
        'baglayici-ve-medya', 'uygulama-ve-yuzey', 'isik-golge-teknikleri', 'renk-teknikleri',
        'kompozisyon-ve-perspektif', 'minyatur-teknikleri', 'murekkep-teknikleri',
    },
    'TARIHSEL_NESNE': {
        'kiyafet-ve-aksesuarlar', 'muzik-aletleri', 'silah-ve-zirhlar', 'mobilyalar',
        'dini-torensel-nesneler', 'gundelik-yasam-araclari', 'bilimsel-aletler',
        'kitap-yazi-araclari', 'sofra-esyalari', 'ticaret-meslek-araclari', 'diger-nesneler',
    },
}

OKUNMUS = {'ERISILDI_OKUNDU', 'WAYBACK_OKUNDU'}
KESINLIKLI = {'DOGRULANDI', 'KISMEN_DESTEKLENIYOR'}
TARIH_RE = re.compile(r'^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$')
CJK_RE = re.compile(r'[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]')
ETIKET_RE = re.compile(r'\[C\d{3}\]')
RESIM_SOZCUK = re.compile(r'resim|tabl[oou]|minyatür|fresk|tuval|panel|suluboya|mürekkep|portre', re.I)

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
            hatalar.append(f'{yol}: tip {t} bekleniyordu, {type(ornek).__name__} geldi'); return
    if 'enum' in sema and ornek not in sema['enum']:
        hatalar.append(f'{yol}: {ornek!r} enum dışında {sema["enum"]}')
    if isinstance(ornek, str):
        if 'pattern' in sema and not re.search(sema['pattern'], ornek):
            hatalar.append(f'{yol}: {ornek!r} desenle eşleşmiyor: {sema["pattern"]}')
        if sema.get('format') == 'uri' and ornek and not re.match(r'^https?://', ornek):
            hatalar.append(f'{yol}: URI biçimi bekleniyordu: {ornek!r}')
        if 'minLength' in sema and len(ornek) < sema['minLength']:
            hatalar.append(f'{yol}: en az {sema["minLength"]} karakter gerekli, {len(ornek)} var')
        if 'maxLength' in sema and len(ornek) > sema['maxLength']:
            hatalar.append(f'{yol}: en çok {sema["maxLength"]} karakter, {len(ornek)} var')
    if isinstance(ornek, (int, float)) and not isinstance(ornek, bool):
        if 'minimum' in sema and ornek < sema['minimum']:
            hatalar.append(f'{yol}: {ornek} < minimum {sema["minimum"]}')
        if 'maximum' in sema and ornek > sema['maximum']:
            hatalar.append(f'{yol}: {ornek} > maximum {sema["maximum"]}')
    if isinstance(ornek, dict):
        for alan in sema.get('required', []):
            if alan not in ornek:
                hatalar.append(f'{yol}: zorunlu alan eksik: {alan}')
        ozellikler = sema.get('properties', {})
        if sema.get('additionalProperties') is False:
            for anahtar in ornek:
                if anahtar not in ozellikler:
                    hatalar.append(f'{yol}: beklenmeyen alan: {anahtar}')
        for anahtar, deger in ornek.items():
            if anahtar in ozellikler:
                sema_dogrula(deger, ozellikler[anahtar], kok, f'{yol}.{anahtar}', hatalar)
    if isinstance(ornek, list):
        if 'minItems' in sema and len(ornek) < sema['minItems']:
            hatalar.append(f'{yol}: en az {sema["minItems"]} öğe gerekli, {len(ornek)} var')
        if 'maxItems' in sema and len(ornek) > sema['maxItems']:
            hatalar.append(f'{yol}: en çok {sema["maxItems"]} öğe, {len(ornek)} var')
        if 'items' in sema:
            for i, oge in enumerate(ornek):
                sema_dogrula(oge, sema['items'], kok, f'{yol}[{i}]', hatalar)

def jsonschema_dogrula(ornek, sema, yol, hatalar):
    if not JSONSCHEMA:
        return
    try:
        Draft202012Validator.check_schema(sema)
    except Exception as e:
        hatalar.append(f'{yol}: şema Draft2020-12 geçersiz: {e}'); return
    v = Draft202012Validator(sema)
    for e in sorted(v.iter_errors(ornek), key=lambda x: list(x.path)):
        hatalar.append(f'{yol}[jsonschema]: {"/".join(map(str, e.path))}: {e.message[:140]}')

# ---------- cümle bölücü (kısaltma korumalı) ----------
ABBR = re.compile(r'\b(no|No|c|J|Jr|Dr|Prof|ed|Ed|vs|vb|y|a\.g\.e|B\.G|J\.G)\.\s')
YUZ = re.compile(r'\b(\d{1,2})\.\s(?=yüzyıl|yy|yıl)')
def cumleler(metin):
    m = ABBR.sub(lambda x: x.group(0).replace('.', '<DOT>'), metin)
    m = YUZ.sub(lambda x: x.group(0).replace('.', '<DOT>'), m)
    return [c.replace('<DOT>', '.') for c in re.split(r'(?<=[.!?])\s+', m)]

OLGU_SINYAL = re.compile(r'\b(\d{3,4}|[0-9]+(?:[.,][0-9]+)?)\b|\bc\.\s*\d|\byaklaşık\b|\b\d+\.\s*yüzyıl\b')

# ---------- dosya toplama ----------
def load_json(yol, hatalar):
    try:
        with open(yol, encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        hatalar.append(f'{os.path.relpath(yol, ROOT)}: JSON okunamadı: {e}')
        return None

def madde_dosyalari():
    out = []
    for tur, dizin in KATEGORI_DIZIN.items():
        d = os.path.join(ROOT, dizin)
        if not os.path.isdir(d):
            continue
        for fn in sorted(os.listdir(d)):
            if fn.endswith('.json'):
                out.append(os.path.join(d, fn))
    return out

def kanit_dosyalari():
    d = os.path.join(ROOT, 'kanit-kayitlari')
    out = {}
    if os.path.isdir(d):
        for fn in sorted(os.listdir(d)):
            if fn.endswith('.json'):
                out[fn[:-5]] = os.path.join(d, fn)
    return out

# ---------- madde doğrulama ----------
def dogrula_madde(yol, m, sema, kanit, kanit_sema, tum_idler, hatalar, uyari):
    rel = os.path.relpath(yol, ROOT) if yol else str(m.get('id', '?'))
    mid = m.get('id', '?')
    def H(msg): hatalar.append(f'{rel}: {msg}')
    def U(msg): uyari.append(f'{rel}: {msg}')

    sema_dogrula(m, sema, sema, mid, hatalar_rel(hatalar, rel))
    jsonschema_dogrula(m, sema, mid, hatalar_rel(hatalar, rel))
    if not isinstance(m, dict):
        return

    # dizin / önek / tür tutarlılığı (kontrol 10)
    tur = m.get('ansiklopedi_turu')
    onek = mid.split('-')[0] if '-' in str(mid) else '?'
    if tur in KATEGORI_DIZIN and yol:
        beklenen_dizin = KATEGORI_DIZIN[tur]
        gercek_dizin = os.path.basename(os.path.dirname(yol))
        if gercek_dizin != beklenen_dizin:
            H(f'YANLIŞ DİZİN: {tur} maddesi {beklenen_dizin}/ altında olmalı, {gercek_dizin}/ içinde (kontrol 10)')
    if onek in ONEK_TUR and tur and ONEK_TUR[onek] != tur:
        H(f'önek {onek} ↔ ansiklopedi_turu {tur} uyumsuz (kontrol 10)')
    if tur in TAKSONOMI and m.get('kategori') not in TAKSONOMI[tur]:
        H(f'kategori {m.get("kategori")!r} TAKSONOMI.md {tur} listesinde yok (kontrol 10)')

    # dosya adı = <id>-<slug>.json
    if yol and m.get('slug'):
        beklenen = f'{mid}-{m["slug"]}.json'
        if os.path.basename(yol) != beklenen:
            H(f'dosya adı {os.path.basename(yol)!r} ≠ beklenen {beklenen!r}')

    # yayın statüsü (kontrol 12)
    if m.get('yayin_durumu') == 'YAYIN_ONAYLI':
        H('YAYIN_ONAYLI: Qwen kendi maddesine yayın onayı VEREMEZ; bağımsız denetim + insan kararı gerekir (kontrol 12)')
    if m.get('yayin_durumu') == 'BAGIMSIZ_DENETIM_BEKLIYOR':
        for c in m.get('claims', []):
            if c.get('dogrulama_durumu') == 'HATALI':
                H(f'{c.get("claim_id")} HATALI ama madde BAGIMSIZ_DENETIM_BEKLIYOR: önce düzelt/çıkar (kontrol 12)')

    kaynaklar = {k.get('kaynak_id'): k for k in m.get('kaynaklar', []) if isinstance(k, dict)}
    claims = m.get('claims', [])

    # claim benzersizliği
    cid_sayac = Counter(c.get('claim_id') for c in claims if isinstance(c, dict))
    for cid, n in cid_sayac.items():
        if n > 1:
            H(f'mükerrer claim_id: {cid} ×{n}')

    # kaynak_id benzersizliği + claim→kaynak bütünlüğü (kontrol 5/6)
    kid_sayac = Counter(k.get('kaynak_id') for k in m.get('kaynaklar', []) if isinstance(k, dict))
    for kid, n in kid_sayac.items():
        if n > 1:
            H(f'mükerrer kaynak_id: {kid} ×{n}')
    kullanilan_kaynak = set()
    for c in claims:
        if not isinstance(c, dict):
            continue
        cid = c.get('claim_id')
        if not c.get('kaynak_ids'):
            H(f'{cid}: kaynak_ids boş — kaynağı olmayan önemli iddia (kontrol 6)')
        for kid in c.get('kaynak_ids', []):
            if kid not in kaynaklar:
                H(f'{cid}: kaynak_id {kid!r} madde kaynaklar listesinde yok (kontrol 5)')
            else:
                kullanilan_kaynak.add(kid)
        # DOGRULANDI kuralları (kontrol 7)
        if c.get('dogrulama_durumu') == 'DOGRULANDI':
            for kid in c.get('kaynak_ids', []):
                k = kaynaklar.get(kid, {})
                if k.get('erisim_durumu') not in OKUNMUS:
                    H(f'{cid}: DOGRULANDI ama kaynak {kid} erişim durumu {k.get("erisim_durumu")!r} — okunmamış kaynak doğrulanmış gösterilemez (kontrol 7)')
                if not k.get('url') and not k.get('kunye'):
                    H(f'{cid}: kaynak {kid} için ne url ne künye var')

    # resim örneklerinin kaynakları da "kullanılan kaynak" sayılır (uyarı sırası artefaktını önle)
    for o in m.get('dogrulanmis_resim_ornekleri', []):
        if isinstance(o, dict):
            kullanilan_kaynak.add(o.get('kaynak_id'))

    # kaynak alan kontrolleri
    for kid, k in kaynaklar.items():
        if k.get('erisim_durumu') == 'WAYBACK_OKUNDU' and not k.get('arsiv_tarihi'):
            H(f'{kid}: WAYBACK_OKUNDU ama arsiv_tarihi yok (arşiv tarihi beyan edilmelidir)')
        if k.get('erisim_durumu') == 'ERISILDI_OKUNDU' and not k.get('url'):
            H(f'{kid}: ERISILDI_OKUNDU ama url yok')
        if k.get('kunye') and 'erişilmedi' not in str(k.get('notlar', '')) and k.get('erisim_durumu') == 'ERISILEMEDI' and not k.get('notlar'):
            U(f'{kid}: erişilemeyen kaynak — notlarda "metnine erişilmedi" açıklaması önerilir')
        if kid not in kullanilan_kaynak:
            U(f'{kid}: hiçbir iddia veya resim örneği bu kaynağı kullanmıyor (yalnız bibliyografik/negatif bulgu olabilir; değilse gözden geçir)')

    # [C###] etiketleri ↔ claims
    tanimli = set(cid_sayac)
    metin_alanlari = ['kisa_tanim', 'ayrintili_aciklama', 'tarihsel_baglam', 'kulturel_baglam', 'resim_sanatiyla_iliskisi']
    metin = '\n'.join(str(m.get(a, '')) for a in metin_alanlari)
    etiketler = set(re.findall(r'\[(C\d{3})\]', metin))
    for e in sorted(etiketler - tanimli):
        H(f'metin [{e}] etiketine atıf yapıyor ama böyle bir claim yok (kontrol 5)')
    for c in claims:
        if isinstance(c, dict) and c.get('claim_id') not in etiketler and c.get('iddia_turu') in ('OLGU', 'TARIH', 'TEKNIK_TANIM'):
            U(f'{c.get("claim_id")}: olgu/tarih/teknik iddiası metinde hiç [etiket] ile kullanılmamış')

    # doğrulama özeti tutarlılığı (kontrol 8)
    ozet = m.get('dogrulama_durumu', {})
    gercek = Counter(c.get('dogrulama_durumu') for c in claims if isinstance(c, dict))
    beklenen = {
        'dogrulandi': gercek.get('DOGRULANDI', 0),
        'kismen_destekleniyor': gercek.get('KISMEN_DESTEKLENIYOR', 0),
        'dogrulanamadi': gercek.get('DOGRULANAMADI', 0),
        'celiskili': gercek.get('CELISKILI', 0),
        'hatali': gercek.get('HATALI', 0),
    }
    if isinstance(ozet, dict) and any(ozet.get(k) != v for k, v in beklenen.items()):
        H(f'dogrulama_durumu özeti {ozet} ≠ claims sayımı {beklenen} (kontrol 8)')

    # CELISKILI/HATALI → akademik_tartismalar (kontrol 8)
    if gercek.get('CELISKILI', 0) + gercek.get('HATALI', 0) > 0 and len(str(m.get('akademik_tartismalar', '')).strip()) < 40:
        H('CELISKILI/HATALI iddia var ama akademik_tartismalar boş/kısa (kontrol 8)')

    # ilgili_maddeler (kontrol 4)
    im = m.get('ilgili_maddeler', [])
    if len(set(im)) != len(im):
        U('ilgili_maddeler içinde mükerrer ID var')
    for r in im:
        if r == mid:
            H('ilgili_maddeler kendi ID’sini içeriyor')
        elif r not in tum_idler:
            H(f'ilgili_madde {r} mevcut değil — bozuk bağlantı (kontrol 4)')

    # resim örnekleri → kaynak bağlantısı (kontrol 4)
    for i, o in enumerate(m.get('dogrulanmis_resim_ornekleri', [])):
        if isinstance(o, dict) and o.get('kaynak_id') not in kaynaklar:
            H(f'dogrulanmis_resim_ornekleri[{i}]: kaynak_id {o.get("kaynak_id")!r} kaynaklar listesinde yok (kontrol 4)')
        if isinstance(o, dict):
            kullanilan_kaynak.add(o.get('kaynak_id'))

    # kapsam-dışı sezgiseli (kontrol 11)
    if tur in ('IKONOGRAFI', 'MITOLOJI', 'TARIHSEL_NESNE'):
        birlesik = str(m.get('ayrintili_aciklama', '')) + ' ' + str(m.get('resim_sanatiyla_iliskisi', ''))
        if not RESIM_SOZCUK.search(birlesik):
            U('resim sanatı sözcükleri (resim/tablo/minyatür/fresk…) metinde geçmiyor — kapsam dışı olabilir (kontrol 11, sezgisel)')
    if len(str(m.get('resim_sanatiyla_iliskisi', '')).strip()) < 100:
        H('resim_sanatiyla_iliskisi <100 karakter — her maddede resimle anlamlı bağlantı zorunlu (kontrol 11)')

    # CJK taraması (Türkçe anlatı alanları; özgün ad/alıntı alanları muaf)
    for a in metin_alanlari:
        cjk = CJK_RE.findall(str(m.get(a, '')))
        if cjk:
            U(f'{a}: {len(cjk)} CJK karakter — Türkçe anlatı alanlarında beklenmez (özgün ad/alternatif ad alanlarını kullan)')

    # etiketsiz olgusal cümle adayları (sezgisel — kontrol 6 destek)
    for a in ['ayrintili_aciklama', 'tarihsel_baglam', 'kulturel_baglam']:
        for cum in cumleler(str(m.get(a, ''))):
            temiz = ETIKET_RE.sub('', cum)
            if OLGU_SINYAL.search(cum) and not re.search(r'\[C\d{3}\]', cum) and len(temiz.split()) >= 6:
                U(f'[{a}] etiketsiz olgusal cümle adayı (sezgisel): "{temiz.strip()[:70]}…"')

    # ---------- kanıt dosyası (kontrol 5/7) ----------
    if kanit is None:
        H('kanıt kaydı dosyası yok veya okunamadı — kanit-kayitlari/<MADDE-ID>.json zorunlu (kontrol 5)')
        return
    krel, kdata = kanit
    sema_dogrula(kdata, kanit_sema, kanit_sema, f'{mid}/kanit', hatalar_rel(hatalar, rel))
    jsonschema_dogrula(kdata, kanit_sema, f'{mid}/kanit', hatalar_rel(hatalar, rel))
    if not isinstance(kdata, dict):
        return
    if kdata.get('madde_id') != mid:
        H(f'kanıt dosyası madde_id {kdata.get("madde_id")!r} ≠ {mid!r}')
    kayitlar = kdata.get('kayitlar', [])
    kcid = Counter(k.get('claim_id') for k in kayitlar if isinstance(k, dict))
    for cid, n in kcid.items():
        if n > 1:
            H(f'kanıt dosyasında mükerrer claim_id: {cid} ×{n}')
    eksik = tanimli - set(kcid)
    fazladan = set(kcid) - tanimli
    for cid in sorted(eksik):
        H(f'{cid}: kanıt kaydı YOK — her iddia için kanıt kaydı zorunlu (kontrol 5)')
    for cid in sorted(fazladan):
        H(f'kanıt kaydındaki {cid} maddede tanımlı değil (kontrol 5)')

    claim_by_id = {c.get('claim_id'): c for c in claims if isinstance(c, dict)}
    for k in kayitlar:
        if not isinstance(k, dict):
            continue
        cid = k.get('claim_id')
        c = claim_by_id.get(cid)
        if not c:
            continue
        if str(k.get('iddia', '')).strip() != str(c.get('iddia', '')).strip():
            H(f'{cid}: kanıt kaydındaki iddia metni maddedeki ile birebir aynı değil (kontrol 5)')
        if k.get('iddia_turu') != c.get('iddia_turu'):
            H(f'{cid}: iddia_turu uyuşmuyor: kanıt {k.get("iddia_turu")!r} ≠ madde {c.get("iddia_turu")!r}')
        if k.get('dogrulama_sonucu') != c.get('dogrulama_durumu'):
            H(f'{cid}: dogrulama uyuşmuyor: kanıt {k.get("dogrulama_sonucu")!r} ≠ madde {c.get("dogrulama_durumu")!r}')
        kid = k.get('kaynak_id')
        if kid not in kaynaklar:
            H(f'{cid}: kanıt kaynak_id {kid!r} madde kaynaklarında yok (kontrol 5)')
        elif kid not in c.get('kaynak_ids', []):
            U(f'{cid}: kanıtın birincil kaynağı {kid} claim.kaynak_ids içinde değil')
        for ik in k.get('ikincil_kaynak_ids', []):
            if ik not in kaynaklar:
                H(f'{cid}: ikincil_kaynak_ids {ik!r} madde kaynaklarında yok')
        er = k.get('erisim', {})
        if isinstance(er, dict):
            if er.get('durum') == 'WAYBACK_OKUNDU' and not er.get('arsiv_tarihi'):
                H(f'{cid}: kanıt erişimi WAYBACK_OKUNDU ama arsiv_tarihi yok')
            if c.get('dogrulama_durumu') == 'DOGRULANDI':
                if er.get('durum') not in OKUNMUS:
                    H(f'{cid}: DOGRULANDI ama kanıt erişim durumu {er.get("durum")!r} (kontrol 7)')
                if k.get('destek_duzeyi') != 'DOGRUDAN_DESTEK':
                    H(f'{cid}: DOGRULANDI ama destek_duzeyi {k.get("destek_duzeyi")!r} — doğrudan destek şart (kontrol 7)')
                if er.get('durum') in OKUNMUS and len(str(k.get('pasaj', '')).strip()) < 20:
                    H(f'{cid}: DOGRULANDI ama pasaj yok/kısa — incelenen pasaj kaydedilmeli (kontrol 7)')
        if k.get('destek_duzeyi') == 'DESTEKLEMIYOR' and c.get('dogrulama_durumu') == 'DOGRULANDI':
            H(f'{cid}: kaynak DESTEKLEMIYOR ama iddia DOGRULANDI (kontrol 7)')
        if c.get('iddia_turu') in ('YORUM', 'HIPOTEZ') and c.get('dogrulama_durumu') == 'DOGRULANDI':
            U(f'{cid}: {c.get("iddia_turu")} türü iddia DOGRULANDI — yorum/hipotez "olgu gibi" doğrulanmış sayılmaz; ifadeyi gözden geçir (kontrol 8)')

# hatalara rel öneki ekleyen yardımcı
def hatalar_rel(hatalar, rel):
    return _PrefixedList(hatalar, rel)

class _PrefixedList:
    def __init__(self, hedef, rel): self.h, self.rel = hedef, rel
    def append(self, msg): self.h.append(f'{self.rel}: {msg}' if not msg.startswith(self.rel) else msg)

# ---------- global kontroller ----------
def global_kontroller(maddeler, hatalar, uyari):
    """maddeler: [(yol, veri)]"""
    idler, sluglar = Counter(), Counter()
    for yol, m in maddeler:
        if isinstance(m, dict):
            idler[m.get('id')] += 1
            sluglar[m.get('slug')] += 1
    for i, n in idler.items():
        if n > 1:
            hatalar.append(f'GLOBAL: mükerrer madde id {i} ×{n} (kontrol 3)')
    for s, n in sluglar.items():
        if n > 1:
            hatalar.append(f'GLOBAL: mükerrer slug {s!r} ×{n} (kontrol 3)')

    # yakın-kopya metin (kontrol 9)
    for a in range(len(maddeler)):
        for b in range(a + 1, len(maddeler)):
            ya, ma = maddeler[a]; yb, mb = maddeler[b]
            if not (isinstance(ma, dict) and isinstance(mb, dict)):
                continue
            for alan, esik in (('kisa_tanim', 0.85), ('ayrintili_aciklama', 0.75)):
                ta, tb = str(ma.get(alan, '')), str(mb.get(alan, ''))
                if ta and tb and len(ta) > 80 and len(tb) > 80:
                    oran = difflib.SequenceMatcher(None, ta, tb).ratio()
                    if oran > esik:
                        uyari.append(f'GLOBAL: {ma.get("id")} ↔ {mb.get("id")} {alan} benzerliği {oran:.2f} > {esik} — yinelenen/yakın-kopya açıklama (kontrol 9)')

    # kaynak kütüğü (varsa) bütünlüğü
    kutuk_yol = os.path.join(ROOT, 'kaynaklar', 'KAYNAK_KUTUGU.json')
    if os.path.isfile(kutuk_yol):
        kutuk = load_json(kutuk_yol, hatalar)
        kutuk_ids = {k.get('kaynak_id') for k in (kutuk or {}).get('kaynaklar', []) if isinstance(k, dict)}
        for yol, m in maddeler:
            if not isinstance(m, dict):
                continue
            for k in m.get('kaynaklar', []):
                if isinstance(k, dict) and k.get('kaynak_id') not in kutuk_ids:
                    uyari.append(f'{m.get("id")}: kaynak {k.get("kaynak_id")} ortak kütükte yok (kaynaklar/KAYNAK_KUTUGU.json)')

# ---------- ana akış ----------
def calistir(dosya_filtre=None):
    hatalar, uyari = [], []
    sema = load_json(os.path.join(ROOT, 'semalar', 'MADDE_SEMASI.json'), hatalar)
    kanit_sema = load_json(os.path.join(ROOT, 'semalar', 'KANIT_SEMASI.json'), hatalar)
    if sema is None or kanit_sema is None:
        print('ŞEMA OKUNAMADI'); return 1, hatalar, uyari

    yollar = madde_dosyalari()
    maddeler = []
    for y in yollar:
        d = load_json(y, hatalar)
        if d is not None:
            maddeler.append((y, d))
    tum_idler = {m.get('id') for _, m in maddeler if isinstance(m, dict)}
    kdosyalari = kanit_dosyalari()

    for yol, m in maddeler:
        if not isinstance(m, dict):
            continue
        mid = m.get('id')
        kdata = None
        if mid in kdosyalari:
            kd = load_json(kdosyalari[mid], hatalar)
            if kd is not None:
                kdata = (os.path.relpath(kdosyalari[mid], ROOT), kd)
        dogrula_madde(yol, m, sema, kdata, kanit_sema, tum_idler, hatalar, uyari)

    global_kontroller(maddeler, hatalar, uyari)

    if dosya_filtre:
        anahtarlar = set()
        for f in dosya_filtre:
            anahtarlar.add(os.path.basename(f).replace('.json', ''))
            d = load_json(f, []) if os.path.isfile(f) else None
            if isinstance(d, dict) and d.get('id'):
                anahtarlar.add(d['id'])
        def ilgili(msg):
            return any(a in msg for a in anahtarlar)
        hatalar = [h for h in hatalar if ilgili(h)]
        uyari = [u for u in uyari if ilgili(u)]

    return 0, hatalar, uyari, len(maddeler)

def main():
    args = sys.argv[1:]
    if '--test' in args:
        return testler()
    filtre = None
    if '--dosya' in args:
        i = args.index('--dosya')
        filtre = args[i + 1:]
    sonuc = calistir(filtre)
    if sonuc[0] == 1:
        print('Şema okunamadı'); return 1
    _, hatalar, uyari, n = sonuc
    print(f'Katman: mini-şema + jsonschema({"AKTİF" if JSONSCHEMA else "KURULU DEĞİL"}) + çapraz tutarlılık + global')
    print(f'{n} madde tarandı · {len(hatalar)} HATA · {len(uyari)} UYARI')
    for h in hatalar:
        print('  HATA:', h)
    for u in uyari[:120]:
        print('  UYARI:', u)
    if len(uyari) > 120:
        print(f'  … ve {len(uyari) - 120} uyarı daha')
    print('NOT: Yapısal testler olgusal doğruluğu KANITLAMAZ; bağımsız denetim şarttır (AKADEMIK_DOGRULAMA_KURALLARI.md §10).')
    return 1 if hatalar else 0

# ---------- testler ----------
def _ornek_madde(mid='IKO-001', slug='test-madde'):
    return {
        'id': mid, 'slug': slug, 'turkce_ad': 'Test Maddesi', 'ozgun_ad': 'Test',
        'alternatif_adlar': [], 'ansiklopedi_turu': 'IKONOGRAFI',
        'kategori': 'bitki-hayvan-sembolizmi', 'alt_kategori': 'test',
        'kisa_tanim': 'Bu bir test kısa tanımıdır ve en az yüz elli karakter uzunluğunda olmalıdır ki şema doğrulamasından geçebilsin; ayrıca olgusal cümleler [C001] etiketiyle iddialara bağlanır ve anlam bütünlüğü korunur.',
        'ayrintili_aciklama': 'Ayrıntılı açıklama. ' * 60 + ' Tablo resimde görülür [C001]. 1650 yılında yapılmıştır [C002].',
        'tarihsel_baglam': 'Bağlam metni.', 'kulturel_baglam': 'Kültürel bağlam.',
        'resim_sanatiyla_iliskisi': 'Bu madde resim sanatındaki kullanımıyla ilişkilidir ve tabloda betimlenme biçimini kaynaklarla açıklar; en az yüz karakter gerekir.',
        'dogrulanmis_resim_ornekleri': [
            {'sanatci': 'Sanatçı A', 'eser': 'Eser Bir', 'tarih': 'c. 1600', 'koleksiyon': 'Müze1', 'kaynak_id': f'{mid}-K01', 'baglam': 'ikonografik unsur'},
            {'sanatci': 'Sanatçı B', 'eser': 'Eser İki', 'tarih': '1650', 'koleksiyon': 'Müze2', 'kaynak_id': f'{mid}-K01', 'baglam': 'karşılaştırma örneği'},
        ],
        'ilgili_maddeler': [],
        'claims': [
            {'claim_id': 'C001', 'iddia': 'Test iddiası bir: nesne tabloda görülür.', 'iddia_turu': 'OLGU',
             'kaynak_ids': [f'{mid}-K01'], 'dogrulama_durumu': 'DOGRULANDI'},
            {'claim_id': 'C002', 'iddia': 'Test iddiası iki: tarih 1650 civarıdır.', 'iddia_turu': 'TARIH',
             'kaynak_ids': [f'{mid}-K01'], 'dogrulama_durumu': 'KISMEN_DESTEKLENIYOR'},
            {'claim_id': 'C003', 'iddia': 'Test iddiası üç: yorum içerikli iddia.', 'iddia_turu': 'YORUM',
             'kaynak_ids': [f'{mid}-K02'], 'dogrulama_durumu': 'KISMEN_DESTEKLENIYOR'},
            {'claim_id': 'C004', 'iddia': 'Test iddiası dört: ek olgu.', 'iddia_turu': 'OLGU',
             'kaynak_ids': [f'{mid}-K01'], 'dogrulama_durumu': 'DOGRULANAMADI'},
            {'claim_id': 'C005', 'iddia': 'Test iddiası beş: geleneksel anlatı.', 'iddia_turu': 'GELENEKSEL_ANLATI',
             'kaynak_ids': [f'{mid}-K02'], 'dogrulama_durumu': 'KISMEN_DESTEKLENIYOR'},
        ],
        'kaynaklar': [
            {'kaynak_id': f'{mid}-K01', 'kurum_yazar': 'Müze', 'baslik': 'Katalog Kaydı',
             'url': 'https://example.org/1', 'kaynak_turu': 'BIRINCIL', 'hiyerarsi_seviyesi': 1,
             'erisim_durumu': 'ERISILDI_OKUNDU', 'erisim_tarihi': '2026-11-15'},
            {'kaynak_id': f'{mid}-K02', 'kurum_yazar': 'Yazar', 'baslik': 'Kitap',
             'kunye': 'Yazar, Kitap, 2000.', 'kaynak_turu': 'IKINCIL', 'hiyerarsi_seviyesi': 4,
             'erisim_durumu': 'ERISILDI_KISMEN', 'erisim_tarihi': '2026-11-15', 'notlar': 'önizleme erişimi'},
        ],
        'akademik_tartismalar': 'Tartışma yok.',
        'dogrulama_durumu': {'dogrulandi': 1, 'kismen_destekleniyor': 3, 'dogrulanamadi': 1, 'celiskili': 0, 'hatali': 0},
        'yayin_durumu': 'BAGIMSIZ_DENETIM_BEKLIYOR', 'son_guncelleme': '2026-11-15',
    }

def _ornek_kanit(mid='IKO-001'):
    m = _ornek_madde(mid)
    kayitlar = []
    for c in m['claims']:
        kayitlar.append({
            'claim_id': c['claim_id'], 'iddia': c['iddia'], 'iddia_turu': c['iddia_turu'],
            'kaynak_id': c['kaynak_ids'][0], 'kaynak_baslik': 'Katalog Kaydı',
            'url': 'https://example.org/1',
            'erisim': {'durum': 'ERISILDI_OKUNDU' if c['dogrulama_durumu'] == 'DOGRULANDI' else 'ERISILDI_KISMEN',
                        'tarih': '2026-11-15', 'http_kod': 200, 'yontem': 'CANLI'},
            'pasaj': 'Kaynaktan alınmış, iddiayı destekleyen yeterince uzun bir pasaj örneği.',
            'pasaj_konum': 'bölüm 2', 'belirsizlik_ifadeleri': [],
            'destek_duzeyi': 'DOGRUDAN_DESTEK' if c['dogrulama_durumu'] == 'DOGRULANDI' else 'KISMEN_DESTEK',
            'celisen_kaynaklar': [], 'dogrulama_sonucu': c['dogrulama_durumu'],
        })
    return {'madde_id': mid, 'arastirma_tarihi': '2026-11-15', 'ureten': 'test', 'kayitlar': kayitlar}

def _derle(madde_list, kanit_map, sema, kanit_sema):
    """madde_list: [(sanal_yol, veri)] → (hatalar, uyari)"""
    hatalar, uyari = [], []
    tum_idler = {m.get('id') for _, m in madde_list}
    for yol, m in madde_list:
        mid = m.get('id')
        k = kanit_map.get(mid)
        dogrula_madde(yol, m, sema, k, kanit_sema, tum_idler, hatalar, uyari)
    global_kontroller(madde_list, hatalar, uyari)
    return hatalar, uyari

def testler():
    sema = load_json(os.path.join(ROOT, 'semalar', 'MADDE_SEMASI.json'), [])
    kanit_sema = load_json(os.path.join(ROOT, 'semalar', 'KANIT_SEMASI.json'), [])
    gecti, kaldi = 0, 0
    def kontrol(ad, kosul):
        nonlocal gecti, kaldi
        if kosul: gecti += 1; print(f'  ✓ {ad}')
        else: kaldi += 1; print(f'  ✗ {ad} — BAŞARISIZ')

    def tek(m=None, k=None, mid='IKO-001', dizin='ikonografi', slug=None):
        m = m or _ornek_madde(mid, slug or 'test-madde')
        kk = {mid: (f'kanit-kayitlari/{mid}.json', k)} if k is not False else {}
        if k is None:
            kk = {mid: (f'kanit-kayitlari/{mid}.json', _ornek_kanit(mid))}
        dosya_ad = slug if slug is not None else m.get('slug')
        return _derle([(f'{dizin}/{mid}-{dosya_ad}.json', m)], kk, sema, kanit_sema)

    print('Testler:')
    h, u = tek(); kontrol('uyumlu madde → 0 hata', not h)
    m = _ornek_madde(); del m['slug']; h, _ = tek(m=m); kontrol('eksik zorunlu alan → hata', any('slug' in x for x in h))
    m = _ornek_madde(); m['claims'][1]['claim_id'] = 'C001'
    h, _ = tek(m=m, k=_ornek_kanit()); kontrol('mükerrer claim_id → hata', any('mükerrer claim_id' in x for x in h))
    m = _ornek_madde(); m['claims'][0]['kaynak_ids'] = ['IKO-001-K99']; h, _ = tek(m=m); kontrol('olmayan kaynak_id → hata', any('K99' in x for x in h))
    m = _ornek_madde(); h, _ = tek(m=m, k=False); kontrol('kanıt dosyası yok → hata', any('kanıt' in x.lower() for x in h))
    m = _ornek_madde(); k = _ornek_kanit(); k['kayitlar'].pop(); h, _ = tek(m=m, k=k); kontrol('claim↔kanıt küme uyuşmazlığı → hata', any('kanıt kaydı YOK' in x for x in h))
    m = _ornek_madde(); k = _ornek_kanit(); k['kayitlar'][0]['iddia'] = 'Başka iddia metni burada.'; h, _ = tek(m=m, k=k); kontrol('iddia metni uyuşmazlığı → hata', any('birebir aynı değil' in x for x in h))
    m = _ornek_madde(); k = _ornek_kanit(); k['kayitlar'][0]['erisim']['durum'] = 'ERISILEMEDI'
    m['kaynaklar'][0]['erisim_durumu'] = 'ERISILEMEDI'; h, _ = tek(m=m, k=k); kontrol('okunmamış kaynak + DOGRULANDI → hata (kontrol 7)', any('kontrol 7' in x for x in h))
    m = _ornek_madde(); k = _ornek_kanit(); k['kayitlar'][0]['destek_duzeyi'] = 'DESTEKLEMIYOR'; h, _ = tek(m=m, k=k); kontrol('DESTEKLEMIYOR + DOGRULANDI → hata', any('DESTEKLEMIYOR' in x for x in h))
    m = _ornek_madde(); m['yayin_durumu'] = 'YAYIN_ONAYLI'; h, _ = tek(m=m); kontrol('YAYIN_ONAYLI → hata (kontrol 12)', any('YAYIN_ONAYLI' in x for x in h))
    m = _ornek_madde(); m['ilgili_maddeler'] = ['NES-777']; h, _ = tek(m=m); kontrol('bozuk ilgili_madde → hata (kontrol 4)', any('NES-777' in x for x in h))
    m = _ornek_madde(); m['kategori'] = 'uydurma-kategori'; h, _ = tek(m=m); kontrol('taksonomi dışı kategori → hata', any('TAKSONOMI' in x for x in h))
    m = _ornek_madde(); h, _ = tek(m=m, dizin='mitoloji'); kontrol('yanlış dizin → hata (kontrol 10)', any('YANLIŞ DİZİN' in x for x in h))
    m = _ornek_madde(); m['ansiklopedi_turu'] = 'MITOLOJI'; m['kategori'] = 'hint-mitolojisi'; h, _ = tek(m=m); kontrol('önek↔tür uyumsuzluğu → hata', any('uyumsuz' in x for x in h))
    m = _ornek_madde(); m['claims'][3]['dogrulama_durumu'] = 'CELISKILI'
    m['dogrulama_durumu'] = {'dogrulandi': 1, 'kismen_destekleniyor': 2, 'dogrulanamadi': 1, 'celiskili': 1, 'hatali': 0}
    m['akademik_tartismalar'] = 'Kısa'; h, _ = tek(m=m); kontrol('CELISKILI + boş tartışma → hata (kontrol 8)', any('akademik_tartismalar' in x for x in h))
    m = _ornek_madde(); m['dogrulama_durumu']['dogrulandi'] = 9; h, _ = tek(m=m); kontrol('özet≠sayım → hata', any('sayımı' in x for x in h))
    m = _ornek_madde(); m['ayrintili_aciklama'] += ' [C999]'; h, _ = tek(m=m); kontrol('tanımsız [C999] etiketi → hata', any('C999' in x for x in h))
    m = _ornek_madde(); h, _ = tek(m=m, slug='baska-slug'); kontrol('dosya adı ≠ id-slug → hata', any('dosya adı' in x for x in h))
    m = _ornek_madde(); k = _ornek_kanit(); k['kayitlar'][0]['erisim'] = {'durum': 'WAYBACK_OKUNDU', 'tarih': '2026-11-15', 'yontem': 'WAYBACK'}
    m['kaynaklar'][0]['erisim_durumu'] = 'WAYBACK_OKUNDU'; m['kaynaklar'][0]['arsiv_tarihi'] = '2026-01-01'
    h, _ = tek(m=m, k=k); kontrol('WAYBACK kanıtta arsiv_tarihi yok → hata', any('arsiv_tarihi' in x for x in h))
    m2 = _ornek_madde('IKO-002', 'test-madde'); h, _ = _derle(
        [('ikonografi/IKO-001-test-madde.json', _ornek_madde()), ('ikonografi/IKO-002-test-madde.json', m2)],
        {'IKO-001': ('k1', _ornek_kanit()), 'IKO-002': ('k2', _ornek_kanit('IKO-002'))}, sema, kanit_sema)
    kontrol('mükerrer slug (global) → hata (kontrol 3)', any('mükerrer slug' in x for x in h))
    m = _ornek_madde(); m['kisa_tanim'] = 'Kısa tanım.'; h, _ = tek(m=m); kontrol('kisa_tanim minLength → hata', any('kisa_tanim' in x for x in h))
    m = _ornek_madde(); m['ayrintili_aciklama'] = 'Tablo resmi anlatır [C001]. Bu eser 1500 yılında yapılmıştır ve koleksiyonda korunmaktadır. ' * 20
    _, u = tek(m=m); kontrol('etiketsiz olgu adayı → uyarı (sezgisel)', any('etiketsiz olgusal' in x for x in u))
    m = _ornek_madde(); m['kulturel_baglam'] = '文化 背景'; _, u = tek(m=m); kontrol('CJK → uyarı', any('CJK' in x for x in u))

    print(f'\nSonuç: {gecti} geçti, {kaldi} kaldı')
    return 0 if kaldi == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
