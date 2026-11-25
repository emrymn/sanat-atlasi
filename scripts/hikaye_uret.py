#!/usr/bin/env python3
"""Sanatçı hikâyeleri: bir ressamın hayatının dönemleri, kırılma anları ve bunların resimlerine nasıl yansıdığı.

Emre'nin istediği: çarpıcı, ilginç ve derin, uzun hikâyeler; ressamın kendi resimleriyle zenginleşsin. Ayrı bir sekmede
okunacak ve Fola sesiyle dinlenecek (ses: scripts/ses_uret.py).

Her sanatçı için dört adım (ara dosyalar hikaye/<id>/ altında; yarıda kalırsa kaldığı yerden sürer):
  1. arastirma.json: Gemini, Google Arama bağlantısıyla (grounding) sanatçıyı araştırır. Elinde sanatçının bizdeki
     eser listesi (qid, ad, yıl) vardır. Çıktı İngilizce bir dosyadır: dönemler, kırılma anları, ilişkiler, efsane ile
     belgelenmiş olanın ayrımı, her dönemi listeden hangi eserlerin gösterdiği. Arama kaynakları (adres + başlık) saklanır.
  2. taslak.json: Gemini (aramasız) yalnız bu dosyaya dayanarak Türkçe hikâyeyi bölüm bölüm yazar.
  3. denetim.json: ikinci okuyucu (QWEN_* tanımlıysa Qwen, yoksa Gemini) hikâyeyi dosyayla karşılaştırır; dosyada
     dayanağı olmayan, abartılı ya da efsaneyi gerçek gibi anlatan cümleleri listeler.
  4. son.json: Gemini bu sorunları düzeltir (cümleyi çıkarır, yumuşatır ya da "anlatılır ki" diye çerçeveler).
Sonuç data/sanatci_hikayeleri.json'a yazılır.

Doğruluk kuralı (CLAUDE.md): bir eser sanatçıya yalnız bizim verimizden (kurs_eserleri ya da Wikidata P170) bağlanır.
Model eser uyduramaz: hikâyede yalnız listedeki qid'ler kalır, ötekiler kod tarafından atılır. Bağlantı kurulan öteki
sanatçılar, bizde varsa kimlikleriyle eşlenir (uygulamada dokununca o sanatçıya gidilir).

Anahtarlar:
  GEMINI_API_KEY   (AI Studio → API Keys; Mac'te export)
  QWEN_ANAHTAR, QWEN_ADRES, QWEN_MODEL   (isteğe bağlı; OpenAI uyumlu uç. QwenCloud → Token Plan Quick Start'taki
                   "base URL" ve model adı. Tanımlı değilse denetimi de Gemini yapar.)

Kullanım (depo kökünde):
  python3 scripts/hikaye_uret.py --modeller            # anahtarın görebildiği Gemini modelleri
  python3 scripts/hikaye_uret.py --dene                # 10 sanatçılık deneme (DENEME listesi)
  python3 scripts/hikaye_uret.py --sanatci caravaggio  # tek sanatçı (birden çok: virgülle)
  python3 scripts/hikaye_uret.py --dene --yeniden 3    # 3. adımdan (denetim) itibaren yeniden
Her adımın sonunda harcanan jeton ve arama sayısı yazılır; toplam en sonda (maliyeti AI Studio → Spend'de doğrula).
"""
import argparse
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
CALISMA = KOK / 'hikaye'
CIKTI = KOK / 'data' / 'sanatci_hikayeleri.json'
API = 'https://generativelanguage.googleapis.com/v1beta'
DENEME = ['caravaggio', 'artemisia-gentileschi', 'rembrandt-van-rijn', 'francisco-de-goya', 'vincent-van-gogh',
          'edvard-munch', 'edouard-manet', 'j-m-w-turner', 'michelangelo', 'gustav-klimt']
HEDEF_KELIME = (2200, 3000)  # ~15–20 dk ses; ilk denemede model 1400–1800'de kaldı

TOPLAM = {'girdi': 0, 'cikti': 0, 'dusunce': 0, 'arama': 0, 'istek': 0}


# ---------------------------------------------------------------- ortak

def api_anahtari():
    k = re.sub(r'\s', '', os.environ.get('GEMINI_API_KEY', ''))
    if k and not k.isascii():
        sys.exit("GEMINI_API_KEY'de ASCII olmayan bir karakter var; anahtarı AI Studio'dan yeniden kopyala.")
    return k


def istek(adres, govde=None, basliklar=None, deneme=5):
    for i in range(deneme):
        try:
            veri = json.dumps(govde).encode() if govde is not None else None
            r = urllib.request.Request(adres, data=veri, headers={'Content-Type': 'application/json', **(basliklar or {})},
                                       method='POST' if veri else 'GET')
            with urllib.request.urlopen(r, timeout=600) as y:
                return json.loads(y.read())
        except urllib.error.HTTPError as e:
            govde_hata = e.read().decode(errors='replace')
            if e.code in (429, 500, 502, 503, 504) and i < deneme - 1:
                bekle = 30 * (i + 1)
                print(f'    {e.code}, {bekle} sn sonra yeniden…', flush=True)
                time.sleep(bekle)
                continue
            sys.exit(f'HTTP {e.code}: {govde_hata[:800]}')
        except (urllib.error.URLError, TimeoutError) as e:
            if i < deneme - 1:
                time.sleep(15)
                continue
            sys.exit(f'Ağ hatası: {e}')


def gemini_basliklari():
    k = api_anahtari()
    return {'x-goog-api-key': k} if k else {}


def modelleri_listele():
    sonuc, sayfa = [], ''
    while True:
        d = istek(f'{API}/models?pageSize=200' + (f'&pageToken={sayfa}' if sayfa else ''), basliklar=gemini_basliklari())
        sonuc += d.get('models', [])
        sayfa = d.get('nextPageToken')
        if not sayfa:
            return sonuc


def model_sec(istenen):
    if istenen:
        return istenen
    adaylar = []
    for m in modelleri_listele():
        ad = m['name'].split('/')[-1]
        if 'generateContent' not in m.get('supportedGenerationMethods', []):
            continue
        # "-customtools" gibi özel amaçlı türevler değil, düz Pro
        if 'pro' not in ad or re.search(r'tts|image|vision|embed|live|audio|computer|robotics|customtools|tools', ad):
            continue
        surum = tuple(int(x) for x in re.findall(r'\d+', ad.split('pro')[0])) or (0,)
        onizleme = 'preview' in ad or 'exp' in ad
        adaylar.append((surum, not onizleme, ad))
    if not adaylar:
        sys.exit('Pro model bulunamadı; --model ile adını ver (--modeller listeler).')
    return max(adaylar)[2]


def say(kullanim, arama=0):
    TOPLAM['girdi'] += kullanim.get('promptTokenCount', 0)
    TOPLAM['cikti'] += kullanim.get('candidatesTokenCount', 0)
    TOPLAM['dusunce'] += kullanim.get('thoughtsTokenCount', 0)
    TOPLAM['arama'] += arama
    TOPLAM['istek'] += 1
    return (f"girdi {kullanim.get('promptTokenCount', 0):,} · çıktı {kullanim.get('candidatesTokenCount', 0):,} · "
            f"düşünce {kullanim.get('thoughtsTokenCount', 0):,}" + (f' · arama {arama}' if arama else ''))


def buyuk_tip(sema):
    """responseSchema'nın tip adları büyük harfle (OBJECT, STRING, ARRAY)"""
    if isinstance(sema, dict):
        return {k: (v.upper() if k == 'type' else buyuk_tip(v)) for k, v in sema.items()}
    if isinstance(sema, list):
        return [buyuk_tip(x) for x in sema]
    return sema


def gemini(model, metin, arama=False, sema=None, sicaklik=0.7):
    govde = {'contents': [{'role': 'user', 'parts': [{'text': metin}]}],
             'generationConfig': {'temperature': sicaklik, 'maxOutputTokens': 32768}}
    if arama:
        govde['tools'] = [{'google_search': {}}]
    if sema:
        govde['generationConfig']['responseMimeType'] = 'application/json'
        govde['generationConfig']['responseSchema'] = buyuk_tip(sema)
    d = istek(f'{API}/models/{model}:generateContent', govde, gemini_basliklari())
    aday = (d.get('candidates') or [{}])[0]
    yazi = ''.join(p.get('text', '') for p in aday.get('content', {}).get('parts', []) if not p.get('thought'))
    if not yazi.strip():
        sys.exit(f"Boş cevap (finishReason: {aday.get('finishReason')}): {json.dumps(d)[:600]}")
    meta = aday.get('groundingMetadata', {})
    kaynaklar = [{'baslik': c['web'].get('title', ''), 'adres': c['web'].get('uri', '')}
                 for c in meta.get('groundingChunks', []) if c.get('web')]
    aramalar = meta.get('webSearchQueries', [])
    print('    ' + say(d.get('usageMetadata', {}), len(aramalar)), flush=True)
    return yazi, kaynaklar, aramalar


def qwen(metin):
    adres, anahtar, model = (os.environ.get(k, '').strip() for k in ('QWEN_ADRES', 'QWEN_ANAHTAR', 'QWEN_MODEL'))
    govde = {'model': model, 'messages': [{'role': 'user', 'content': metin}], 'temperature': 0.2,
             'response_format': {'type': 'json_object'}}
    d = istek(adres.rstrip('/') + '/chat/completions', govde, {'Authorization': f'Bearer {anahtar}'})
    k = d.get('usage', {})
    print(f"    qwen girdi {k.get('prompt_tokens', 0):,} · çıktı {k.get('completion_tokens', 0):,}", flush=True)
    return d['choices'][0]['message']['content']


def qwen_var():
    return all(os.environ.get(k, '').strip() for k in ('QWEN_ADRES', 'QWEN_ANAHTAR', 'QWEN_MODEL'))


def json_ayikla(yazi):
    yazi = yazi.strip()
    yazi = re.sub(r'^```(?:json)?\s*|\s*```$', '', yazi)
    return json.loads(yazi)


def oku(yol):
    return json.loads(Path(yol).read_text(encoding='utf-8'))


def yaz(yol, veri):
    Path(yol).parent.mkdir(parents=True, exist_ok=True)
    Path(yol).write_text(json.dumps(veri, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def sade(s):
    s = unicodedata.normalize('NFKD', s or '').lower()
    return re.sub(r'[^a-z0-9]+', ' ', ''.join(c for c in s if not unicodedata.combining(c))).strip()


# ---------------------------------------------------------------- veri

def katalog():
    sanatcilar = {s['id']: s for s in oku(KOK / 'data' / 'sanatcilar.json')}
    onbellek = oku(KOK / 'data' / 'eserler_onbellek.json')['sanatcilar']
    return sanatcilar, onbellek


def eser_listesi(sid, onbellek):
    return [{'qid': e['qid'], 'ad': e.get('baslikEn') or e['baslik'], 'tr': e['baslik'], 'yil': e.get('yil'),
             'muze': e.get('muze')} for e in onbellek.get(sid, {}).get('eserler', []) if e.get('qid')]


def yillar(s):
    def y(v):
        return '?' if v is None else (f'MÖ {-v}' if v < 0 else str(v))
    return f"{y(s.get('dogum'))}–{y(s.get('olum'))}"


# ---------------------------------------------------------------- adımlar

def arastirma_istemi(s, eserler, digerleri):
    liste = '\n'.join(f"- {e['qid']}: {e['ad']} ({e['yil'] or 'n.d.'}{', ' + e['muze'] if e['muze'] else ''})" for e in eserler)
    return f"""You are an art historian preparing a research dossier for a long, gripping narrative about {s['ad_arama']} ({yillar(s)}), {s['akim']}.

Use Google Search. Prefer museum websites, catalogues raisonnés, scholarly biographies, Smarthistory, Khan Academy, Grove/Oxford Art, the artist's own letters. Wikipedia only as a starting point.

Find what makes this life dramatic and what it did to the art:
1. Life periods (4–7), each with years, place, circumstances, and the turning point that ended it: deaths, illnesses, debts, trials, exile, loves, patrons, rivals, commissions won and lost, failures, scandals, war, religion, technical discoveries.
2. For EACH period: how exactly it changed the paintings: subject, palette, light, brushwork, scale, mood, recurring motifs. Be concrete (e.g. "after X, the backgrounds turn black and figures are lit from a single high window").
3. For EACH period: which works FROM THE LIST BELOW belong to it and what in that specific picture shows the change. Use only qids from this list; never mention a work as this artist's if it is not in the list (you may mention other artists' works for comparison).
4. Surprising, lesser-known but well-documented facts and anecdotes. Separate clearly: DOCUMENTED (sources agree) vs. LEGEND/ATTRIBUTED (often told, poorly sourced) vs. DISPUTED (scholars disagree).
5. Connections with other artists: teachers, pupils, rivals, friends, who influenced them and whom they influenced, with what concretely passed between them. Artists in our app (use these exact names when relevant): {', '.join(digerleri)}.
6. Common misconceptions about this artist that a good storyteller must not repeat.

Write the dossier in English, dense with facts, dates, names, quotes (with who said them and when). After each paragraph, name the source(s) you used.

THE ARTIST'S WORKS IN OUR COLLECTION (qid: title (year, museum)):
{liste}
"""


TASLAK_SEMASI = {
    'type': 'object',
    'properties': {
        'baslik': {'type': 'string'},
        'alt_baslik': {'type': 'string'},
        'giris': {'type': 'array', 'items': {'type': 'string'}},
        'bolumler': {'type': 'array', 'items': {
            'type': 'object',
            'properties': {
                'baslik': {'type': 'string'},
                'yillar': {'type': 'string'},
                'paragraflar': {'type': 'array', 'items': {'type': 'string'}},
                'eserler': {'type': 'array', 'items': {
                    'type': 'object',
                    'properties': {'qid': {'type': 'string'}, 'bag': {'type': 'string'}},
                    'required': ['qid', 'bag']}},
            },
            'required': ['baslik', 'yillar', 'paragraflar', 'eserler']}},
        'kapanis': {'type': 'array', 'items': {'type': 'string'}},
        'baglantilar': {'type': 'array', 'items': {
            'type': 'object',
            'properties': {'sanatci': {'type': 'string'}, 'iliski': {'type': 'string'}},
            'required': ['sanatci', 'iliski']}},
    },
    'required': ['baslik', 'alt_baslik', 'giris', 'bolumler', 'kapanis', 'baglantilar'],
}


def taslak_istemi(s, eserler, dosya):
    liste = '\n'.join(f"- {e['qid']}: {e['tr']} / {e['ad']} ({e['yil'] or '?'})" for e in eserler)
    return f"""Sen usta bir Türkçe anlatıcısın; bir sanat tarihi uygulaması için {s['ad']} ({yillar(s)}) hakkında uzun, sürükleyici bir hikâye yazıyorsun. Okuyan ve dinleyen, sanat tarihi öğrenen bir üniversite öğrencisi (Emre). Hikâye hem okunacak hem de sesli dinlenecek.

YALNIZ aşağıdaki araştırma dosyasına dayan. Dosyada olmayan hiçbir olgu, tarih, isim, alıntı ekleme. Efsane ya da tartışmalı olanı gerçekmiş gibi anlatma: "anlatılır ki", "rivayete göre", "tarihçiler burada ayrılır" diye çerçevele. Dosyanın "yanlış bilinenler" kısmındakileri tekrarlama.

Nasıl yazılacak:
- Sanatçının hayatını 4–7 döneme böl (bölümler). Her bölüm bir kırılma anıyla, çarpıcı bir sahneyle ya da somut bir ayrıntıyla açılsın; kuru biyografi değil, hikâye.
- Her bölümde hayattaki olayın resme NASIL yansıdığını göster: o dönemin bir iki eserine "bak" dedirt; ışığa, renge, yüze, boşluğa, fırçaya dikkat çek. Eserleri bölümün "eserler" alanına qid ile koy (yalnız aşağıdaki listeden, bölüm başına 1–4), "bag" alanında o eserin bu döneme bağını bir iki cümleyle anlat. Paragraflarda eserin Türkçe adını kullan.
- UZUNLUK ÖNEMLİ: toplam EN AZ {HEDEF_KELIME[0]}, en çok {HEDEF_KELIME[1]} kelime (giriş + bölümler + kapanış); 5–7 bölüm, her bölüm 4–6 paragraf, paragraflar 70–140 kelime. Kısa kalmasın: dosyadaki ayrıntıları, alıntıları, sahneleri kullan.
- Sesli okunacak: kısa ve orta cümleler, parantez ve dipnot yok, kısaltma yok (yy. yerine yüzyıl), yıllar yazıyla değil rakamla. Yabancı adları ilk geçtiği yerde tam yaz.
- "giris": 1–2 paragraf, en çarpıcı anla başla. "kapanis": 1–2 paragraf, bıraktığı iz ve bugün nasıl bakmalı.
- "baglantilar": hocalar, öğrenciler, rakipler, etkilediği ve etkilendiği sanatçılar (3–8); "sanatci" yalnız ad, "iliski" bir iki cümle, ne geçti aralarında.
- Başlık kısa ve merak uyandırsın; alt başlık bir cümle.
- Doğal, sıcak, akıcı Türkçe; çeviri kokmasın. Abartılı sıfat ve klişe yok ("dahi", "eşsiz", "büyüleyici" gibi sözlerden kaçın); çarpıcılık olgulardan gelsin.

ESER LİSTESİ (qid: Türkçe ad / özgün ad (yıl)):
{liste}

ARAŞTIRMA DOSYASI:
{dosya}
"""


def genisletme_istemi(hikaye, kelime, dosya):
    return f"""Aşağıdaki Türkçe hikâye {kelime} kelime; en az {HEDEF_KELIME[0]} kelime olmalı. Yalnız araştırma dosyasındaki olgularla genişlet: bölümlere sahne, ayrıntı, alıntı ve eserlere bakış ekle; gerekirse dosyada yeri olan bir bölüm ekle. Var olan cümleleri, eserleri ve bağlantıları koru; dosyada olmayan bir şey ekleme. Aynı JSON yapısında döndür.

HİKÂYE:
{json.dumps(hikaye, ensure_ascii=False)}

ARAŞTIRMA DOSYASI:
{dosya}
"""


def denetim_istemi(dosya, kaynaklar, hikaye):
    k = '\n'.join(f"- {x['baslik']}: {x['adres']}" for x in kaynaklar[:60])
    return f"""You are a strict fact-checker for an art history app. Below: a research dossier (with its web sources) and a Turkish story written ONLY from that dossier.

List every sentence in the story that:
- states something not supported by the dossier (invented facts, dates, names, quotes, numbers),
- presents a legend, attribution or disputed claim as certain fact,
- exaggerates or distorts what the dossier says,
- links a painting to a period or event the dossier does not support.
Ignore style. Do not flag reasonable descriptions of what is visible in a painting.

Answer as JSON: {{"sorunlar": [{{"cumle": "<exact Turkish sentence>", "sorun": "<short explanation in Turkish>", "oneri": "<corrected Turkish sentence, or empty to delete>"}}]}}. Empty list if none.

SOURCES:
{k}

DOSSIER:
{dosya}

STORY (JSON):
{json.dumps(hikaye, ensure_ascii=False)}
"""


def duzeltme_istemi(hikaye, sorunlar):
    return f"""Aşağıdaki Türkçe hikâyede bir denetçi şu sorunları buldu. Her sorunlu cümleyi öneriye göre düzelt; öneri boşsa cümleyi çıkar ve paragrafı akıcı kalacak biçimde bağla. Başka hiçbir şeyi değiştirme; yapı, eserler ve bağlantılar aynı kalsın.

SORUNLAR:
{json.dumps(sorunlar, ensure_ascii=False, indent=1)}

HİKÂYE:
{json.dumps(hikaye, ensure_ascii=False)}
"""


def temizle(hikaye, eserler, sanatcilar, sid):
    """Listede olmayan eserleri atar, bağlantıları bizdeki sanatçılarla eşler, kelime sayar."""
    gecerli = {e['qid'] for e in eserler}
    atilan = []
    for b in hikaye['bolumler']:
        kalan = []
        for e in b['eserler']:
            (kalan if e['qid'] in gecerli and e['qid'] not in {x['qid'] for x in kalan} else atilan).append(e)
        b['eserler'] = kalan
    adlar = {}
    for s in sanatcilar.values():
        for a in {s['ad'], s.get('ad_arama', '')}:
            if a:
                adlar[sade(a)] = s['id']
    for bag in hikaye['baglantilar']:
        a = sade(bag['sanatci'])
        bulunan = adlar.get(a) or next((i for n, i in adlar.items() if a and (a in n or n in a) and min(len(a), len(n)) > 5), None)
        if bulunan and bulunan != sid:
            bag['id'] = bulunan
    metinler = hikaye['giris'] + [p for b in hikaye['bolumler'] for p in b['paragraflar']] + hikaye['kapanis']
    hikaye['kelime'] = sum(len(p.split()) for p in metinler)
    return atilan


def uret(sid, model, sanatcilar, onbellek, yeniden):
    s = sanatcilar.get(sid)
    if not s:
        sys.exit(f'Sanatçı yok: {sid}')
    eserler = eser_listesi(sid, onbellek)
    if len(eserler) < 3:
        print(f'  {sid}: bizde {len(eserler)} eser var, atlandı')
        return None
    klasor = CALISMA / sid
    yollar = {1: klasor / 'arastirma.json', 2: klasor / 'taslak.json', 3: klasor / 'denetim.json', 4: klasor / 'son.json'}
    for n, y in yollar.items():
        if yeniden and n >= yeniden and y.exists():
            y.unlink()
    print(f"\n{s['ad']} ({len(eserler)} eser)", flush=True)

    if not yollar[1].exists():
        print('  1/4 araştırma (Google Arama ile)…', flush=True)
        digerleri = [x['ad'] for x in sanatcilar.values() if x['id'] != sid]
        # Model bazen aramadan, kendi bildiğiyle yazıyor (Caravaggio'da 0 kaynak): kaynaksız dosya kabul edilmez
        for deneme in range(3):
            istem = arastirma_istemi(s, eserler, digerleri)
            if deneme:
                istem = ('IMPORTANT: You MUST run Google searches before writing (at least 5 queries); a dossier '
                         'without web sources will be rejected.\n\n' + istem)
            dosya, kaynaklar, aramalar = gemini(model, istem, arama=True, sicaklik=0.4)
            if len(kaynaklar) >= 5:
                break
            print(f'    yalnız {len(kaynaklar)} kaynak; yeniden aranıyor…', flush=True)
        else:
            sys.exit(f'{sid}: üç denemede de yeterli kaynak gelmedi; durdu.')
        yaz(yollar[1], {'model': model, 'dosya': dosya, 'kaynaklar': kaynaklar, 'aramalar': aramalar})
    a = oku(yollar[1])
    print(f"  araştırma: {len(a['dosya'].split()):,} kelime, {len(a['kaynaklar'])} kaynak", flush=True)

    if not yollar[2].exists():
        print('  2/4 hikâye…', flush=True)
        yazi, _, _ = gemini(model, taslak_istemi(s, eserler, a['dosya']), sema=TASLAK_SEMASI, sicaklik=0.8)
        t = json_ayikla(yazi)
        kelime = sum(len(p.split()) for p in t['giris'] + [p for b in t['bolumler'] for p in b['paragraflar']] + t['kapanis'])
        if kelime < HEDEF_KELIME[0] * 0.85:
            print(f'    {kelime} kelime, kısa; genişletiliyor…', flush=True)
            yazi, _, _ = gemini(model, genisletme_istemi(t, kelime, a['dosya']), sema=TASLAK_SEMASI, sicaklik=0.7)
            t = json_ayikla(yazi)
        yaz(yollar[2], t)
    taslak = oku(yollar[2])

    if not yollar[3].exists():
        denetci = os.environ.get('QWEN_MODEL') if qwen_var() else model
        print(f'  3/4 denetim ({denetci})…', flush=True)
        istem = denetim_istemi(a['dosya'], a['kaynaklar'], taslak)
        if qwen_var():
            yazi = qwen(istem)
        else:
            yazi, _, _ = gemini(model, istem, sicaklik=0.1, sema={
                'type': 'object', 'properties': {'sorunlar': {'type': 'array', 'items': {
                    'type': 'object', 'properties': {'cumle': {'type': 'string'}, 'sorun': {'type': 'string'},
                                                     'oneri': {'type': 'string'}},
                    'required': ['cumle', 'sorun', 'oneri']}}}, 'required': ['sorunlar']})
        yaz(yollar[3], {'denetci': denetci, **json_ayikla(yazi)})
    denetim = oku(yollar[3])
    print(f"  denetim: {len(denetim['sorunlar'])} sorun", flush=True)

    if not yollar[4].exists():
        if denetim['sorunlar']:
            print('  4/4 düzeltme…', flush=True)
            yazi, _, _ = gemini(model, duzeltme_istemi(taslak, denetim['sorunlar']), sema=TASLAK_SEMASI, sicaklik=0.2)
            son = json_ayikla(yazi)
        else:
            son = taslak
        yaz(yollar[4], son)
    son = oku(yollar[4])
    atilan = temizle(son, eserler, sanatcilar, sid)
    if atilan:
        print(f"  listede olmayan {len(atilan)} eser atıldı: {', '.join(e['qid'] for e in atilan)}")
    print(f"  bitti: {son['kelime']:,} kelime, {len(son['bolumler'])} bölüm, "
          f"{sum(len(b['eserler']) for b in son['bolumler'])} eser, {len(son['baglantilar'])} bağlantı", flush=True)
    return {**son, 'kaynaklar': a['kaynaklar'], 'model': model, 'denetci': denetim['denetci'],
            'duzeltilen': len(denetim['sorunlar']), 'olusturma': time.strftime('%Y-%m-%d')}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--dene', action='store_true', help='10 sanatçılık deneme')
    ap.add_argument('--sanatci', help='sanatçı kimlikleri, virgülle')
    ap.add_argument('--model', default=os.environ.get('HIKAYE_MODEL', ''), help='Gemini modeli (yoksa en yeni Pro)')
    ap.add_argument('--yeniden', type=int, choices=[1, 2, 3, 4], help='bu adımdan itibaren yeniden üret')
    ap.add_argument('--modeller', action='store_true', help='kullanılabilir modelleri listele')
    g = ap.parse_args()

    if not api_anahtari() and not os.environ.get('HIKAYE_BULUT'):
        sys.exit('GEMINI_API_KEY yok (export GEMINI_API_KEY=...).')
    if g.modeller:
        for m in modelleri_listele():
            if 'generateContent' in m.get('supportedGenerationMethods', []):
                print(m['name'].split('/')[-1], '·', m.get('displayName', ''))
        return
    kimlikler = DENEME if g.dene else [x.strip() for x in (g.sanatci or '').split(',') if x.strip()]
    if not kimlikler:
        sys.exit('--dene ya da --sanatci ver.')

    model = model_sec(g.model)
    print(f"Model: {model} · denetçi: {os.environ.get('QWEN_MODEL') if qwen_var() else model}")
    sanatcilar, onbellek = katalog()
    cikti = oku(CIKTI) if CIKTI.exists() else {
        'surum': 1,
        'aciklama': ('Sanatçı hikâyeleri (scripts/hikaye_uret.py): Gemini Google Arama ile araştırır, hikâyeyi yalnız '
                     'o dosyadan yazar, ikinci bir model denetler. Eserler yalnız bizim verimizden (qid).'),
        'sanatcilar': {}}
    for sid in kimlikler:
        h = uret(sid, model, sanatcilar, onbellek, g.yeniden)
        if h:
            cikti['sanatcilar'][sid] = h
            yaz(CIKTI, cikti)

    print(f"\nToplam: {TOPLAM['istek']} istek · girdi {TOPLAM['girdi']:,} · çıktı {TOPLAM['cikti']:,} · "
          f"düşünce {TOPLAM['dusunce']:,} jeton · {TOPLAM['arama']} arama")
    print(f'Hikâyeler: {CIKTI.relative_to(KOK)}  ·  ara dosyalar: hikaye/<sanatçı>/')


if __name__ == '__main__':
    main()
