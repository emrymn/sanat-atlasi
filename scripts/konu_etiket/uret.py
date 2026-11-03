#!/usr/bin/env python3
"""Eser konuları (İş 109). Emre: "bütün resimlerin konusunu belirlememiştik ya" → her eserin türü ve konusu.

Claude, ikonografi.json'da konusu olmayan 5464 eserin başlığını (sanatçı ve yılıyla) tek tek okuyup etiketledi.
etiketler.json: {anahtar: kod} (anahtar ikonografi.json ile aynı: QID ya da "sanatçı|başlık"). Portre/manzara gibi
açık başlıklar önce kuralla tahmin edildi, Claude hepsini gözden geçirip düzeltti.
Kodlar: tek harf tür (P portre, O otoportre, M manzara, D deniz, S şehir/mimari, I iç mekân, N natürmort,
G gündelik hayat, U nü, H hayvan, L alegori/simge, X soyut, F düş/fantastik, E etüt/eskiz, R dini eser, Z diğer),
"k:<konu>" ikonografi.json'daki bir konu, "y:<İngilizce konu adı>|<din|mit|tar|ede|diger>" henüz konu sayfası
olmayan bir konu (Türkçesi tr_adlar.tsv).

  python3 scripts/konu_etiket/uret.py   # data/eser_konulari.json yazılır, k: olanlar ikonografi.json'a eklenir

İş 110 (Emre: "hikaye sayfalarını da yaz ve yazmadan önce aynı konular varsa ... birleştir"):
birlestirme.json · mevcut: aynı hikâyenin zaten var olan konu sayfasına bağlanan adlar; ayni: aynı yeni konunun
farklı adları (tek sayfada toplanır); sayfasiz: hikâyesi olmayan diziler ve temalar (tür olarak kalır).
yeni_konular_NN.json: ≥2 eserli yeni konuların Claude'un yazdığı hikâye sayfaları ({ozgun, id, ad, tur, ozet,
kaynak, hikaye, tanima}); ikonografi.json'a eserleriyle (yıl sırasıyla) eklenir. Yeniden çalıştırmak bir şey değiştirmez.

Yalnız konu ve tür; eser–sanatçı eşleşmesine dokunulmaz."""
import json, re, sys
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
BURASI = Path(__file__).resolve().parent

TURLER = {
    'portre': 'Portre', 'otoportre': 'Otoportre', 'manzara': 'Manzara', 'deniz': 'Deniz', 'sehir': 'Şehir ve mimari',
    'ic_mekan': 'İç mekân', 'naturmort': 'Natürmort', 'gundelik': 'Gündelik hayat', 'nu': 'Nü', 'hayvan': 'Hayvan',
    'alegori': 'Alegori ve simge', 'soyut': 'Soyut', 'dus': 'Düş ve fantastik', 'etut': 'Etüt ve eskiz',
    'dini': 'Dini konu', 'mitoloji': 'Mitoloji', 'tarih': 'Tarih', 'edebiyat': 'Edebiyat', 'diger': 'Diğer',
}
HARF = {'P': 'portre', 'O': 'otoportre', 'M': 'manzara', 'D': 'deniz', 'S': 'sehir', 'I': 'ic_mekan', 'N': 'naturmort',
        'G': 'gundelik', 'U': 'nu', 'H': 'hayvan', 'L': 'alegori', 'X': 'soyut', 'F': 'dus', 'E': 'etut', 'R': 'dini', 'Z': 'diger'}
KATEGORI = {'din': 'dini', 'mit': 'mitoloji', 'tar': 'tarih', 'ede': 'edebiyat'}
IKONOGRAFI_TUR = {'eski_ahit': 'dini', 'yeni_ahit': 'dini', 'aziz': 'dini', 'mitoloji': 'mitoloji',
                  'tarih_edebiyat': 'tarih', 'diger': 'alegori'}
# "diger" kategorisindeki konuların türü (dizi ve temalar)
DIGER = {
    "A Harlot's Progress": 'gundelik', 'A Sunday on La Grande Jatte': 'gundelik', 'Ages of Man': 'alegori',
    'Ballet Dancers': 'gundelik', 'Before and After': 'gundelik', 'Bewitched Groom': 'dus', 'Black Paintings': 'dus',
    'Blue and Rose Periods': 'gundelik', 'Breton Life': 'gundelik', 'Brothels of Paris': 'gundelik',
    'Bullfighting': 'gundelik', 'Caricature': 'gundelik', 'Circus and Café-Concert': 'gundelik',
    "Commedia dell'arte": 'gundelik', 'Cutting the Stone': 'gundelik', 'Dance of Death': 'alegori',
    'Death and the Maiden': 'alegori', 'Death and the Miser': 'alegori', 'Equality before Death': 'alegori',
    'Fifty-three Stations of the Tōkaidō': 'manzara', 'Fight Between Carnival and Lent': 'gundelik',
    'Five Senses': 'alegori', 'Fountain of Youth': 'dus', 'Four Seasons': 'alegori', 'Four Stages of Cruelty': 'gundelik',
    'Fête galante': 'gundelik', 'Garden of Earthly Delights': 'dus', 'Gare Saint-Lazare': 'sehir', 'Haystacks': 'manzara',
    'Horse Racing': 'gundelik', 'Houses of Parliament Series': 'sehir', 'Hunting Scenes': 'gundelik',
    'Ill-Matched Lovers': 'gundelik', 'Isle of the Dead': 'dus', 'Jewish Cemetery': 'manzara',
    'Knight, Death and the Devil': 'alegori', 'La Tauromaquia': 'gundelik', 'Labours of the Months': 'gundelik',
    'Lawyers': 'gundelik', 'Les Poseuses': 'nu', 'Liber Studiorum': 'manzara', 'Liberal Arts': 'alegori',
    'Lion Hunt': 'hayvan', 'Los Caprichos': 'dus', 'Los Disparates': 'dus', 'Ludus pro Patria': 'alegori',
    'Luncheon on the Grass': 'gundelik', 'Melancholia': 'alegori', 'Monomaniacs': 'portre',
    'Mont Sainte-Victoire': 'manzara', 'Mother and Child': 'gundelik', 'Moulin Rouge and Café-Concert': 'gundelik',
    'Netherlandish Proverbs': 'gundelik', 'One Hundred Famous Views of Edo': 'manzara', 'Orientalism': 'gundelik',
    'Pastoral': 'gundelik', 'Photomontage': 'soyut', 'Progress of Love': 'gundelik', 'Rouen Cathedral Series': 'sehir',
    'Ruins and Graves': 'manzara', 'Rückenfigur': 'manzara', 'Saltimbanques': 'gundelik', 'Scherzi di Fantasia': 'dus',
    'Seven Deadly Sins': 'alegori', 'Severed Heads': 'naturmort', 'Ship of Fools': 'alegori',
    'Sixty-nine Stations of the Kiso Kaidō': 'manzara', 'Starry Night': 'manzara', 'Tahitian Life': 'gundelik',
    'The Bedroom': 'ic_mekan', 'The Bride': 'soyut', 'The Card Players': 'gundelik', 'The Frieze of Life': 'alegori',
    'The Nightmare': 'dus', 'The Painter and His Model': 'gundelik', 'The Procuress': 'gundelik', 'The Scream': 'dus',
    'The Sick Child': 'gundelik', 'The Swing': 'gundelik', 'Third-Class Carriage': 'gundelik',
    'Thirty-six Views of Mount Fuji': 'manzara', 'Times of Day': 'alegori', 'Virtues and Vices': 'alegori',
    'Virtues': 'alegori', 'Vollard Suite': 'etut', 'Water Lilies': 'manzara', 'Witches': 'dus', 'Woman Bathing': 'nu',
}
ALANLAR = ('id', 'ad', 'ozgun', 'tur', 'ozet', 'kaynak', 'hikaye', 'tanima')


def birlestirme():
    """(ad → mevcut konu id, ad → aynı yeni konunun asıl adı, asıl ad → yeni konu sayfası)"""
    b = json.loads((BURASI / 'birlestirme.json').read_text(encoding='utf-8'))
    yeni = {}
    for p in sorted(BURASI.glob('yeni_konular_[0-9][0-9].json')):
        for k in json.loads(p.read_text(encoding='utf-8')):
            if k['ozgun'] in yeni:
                raise SystemExit(f'{p.name}: iki kez yazılmış konu {k["ozgun"]}')
            yeni[k['ozgun']] = k
    return b['mevcut'], b['ayni'], yeni


def main():
    ik_yolu = KOK / 'data/ikonografi.json'
    ik = json.loads(ik_yolu.read_text())
    konular = {k['id']: k for k in ik['konular']}
    etiketli = {a: k['id'] for k in ik['konular'] for a, _ in k['eserler']}
    ob = json.loads((KOK / 'data/eserler_onbellek.json').read_text())['sanatcilar']
    sanatcilar = {s['id'] for s in json.loads((KOK / 'data/sanatcilar.json').read_text())}
    tr = dict(l.rstrip('\n').split('\t') for l in (BURASI / 'tr_adlar.tsv').read_text(encoding='utf-8').splitlines() if l.strip())
    cevap = json.loads((BURASI / "etiketler.json").read_text(encoding="utf-8"))
    mevcut, ayni, yeni = birlestirme()
    for ad, kid in mevcut.items():
        if kid not in konular:
            raise SystemExit(f'birlestirme.json: {ad} → bilinmeyen konu {kid}')
    for k in yeni.values():
        if k['id'] not in konular:  # yeni konu sayfası: eserleri aşağıda eklenir
            yk = {a: k[a] for a in ALANLAR}
            yk['eserler'] = []
            ik['konular'].append(yk)
            konular[k['id']] = yk
        elif konular[k['id']].get('ozgun') != k['ozgun']:
            raise SystemExit(f'kimlik çakışması: {k["id"]}')
        else:  # metin düzeltmeleri yeni_konular dosyasından gelir
            konular[k['id']].update({a: k[a] for a in ALANLAR})
    def ytur(kod):
        """yeni konu sayfasına giden "y:" etiketinin türü (mevcut sayfaya bağlananlar o sayfanın türünü alır)"""
        if not kod or not kod.startswith('y:'):
            return None
        ad, kat = re.fullmatch(r'y:([^|]+)\|(\w+)', kod).groups()
        return None if ad in mevcut else KATEGORI.get(kat) or DIGER.get(ad, 'alegori')

    yil = {}
    eserler, eklenecek = {}, []
    for sid, v in ob.items():
        if sid not in sanatcilar:
            continue
        for e in v['eserler']:
            a = e.get('qid') or f"{sid}|{e['baslik']}"
            yil[a] = e.get('yil')
            kod = cevap.get(a)
            if a in etiketli:
                k = konular[etiketli[a]]
                eserler[a] = {'t': ytur(kod) or IKONOGRAFI_TUR[k['tur']], 'k': k['id']}
                continue
            if not kod:
                raise SystemExit(f'etiketsiz eser: {a}')
            if kod.startswith('k:'):
                kid = kod[2:]
                eserler[a] = {'t': IKONOGRAFI_TUR[konular[kid]['tur']], 'k': kid}
                eklenecek.append((kid, a, sid))
            elif kod.startswith('y:'):
                ad, kat = re.fullmatch(r'y:([^|]+)\|(\w+)', kod).groups()
                asil = ayni.get(ad, ad)
                kid = mevcut.get(ad) or (yeni[asil]['id'] if asil in yeni else None)
                if kid:
                    eserler[a] = {'t': ytur(kod) or IKONOGRAFI_TUR[konular[kid]['tur']], 'k': kid}
                    eklenecek.append((kid, a, sid))
                else:
                    eserler[a] = {'t': ytur(kod), 'a': tr[ad], 'en': ad}
            else:
                eserler[a] = {'t': HARF[kod]}
    fazla = set(cevap) - set(eserler)
    if fazla:
        print(f'uyarı: listede olmayan {len(fazla)} etiket (eser önbellekten çıkmış olabilir)')
    # ikonografi.json: yeni bağlananlar konunun eser listesine yılına göre yerleşir (eski sıra korunur)
    eklenen = 0
    for kid, a, sid in eklenecek:
        liste = konular[kid]['eserler']
        if any(x[0] == a for x in liste):
            continue
        y = yil.get(a)
        yer = len(liste)
        if y is not None:
            for j, (b, _) in enumerate(liste):
                if yil.get(b) is not None and yil[b] > y:
                    yer = j
                    break
        liste.insert(yer, [a, sid])
        eklenen += 1
    bos = [k['ozgun'] for k in yeni.values() if not konular[k['id']]['eserler']]
    if bos:
        raise SystemExit(f'eseri olmayan yeni konu: {bos}')
    ik_yolu.write_text(json.dumps(ik, ensure_ascii=False, indent=1))  # dosyanın kendi biçimi (girintili, satır sonu yok)
    cikti = {
        'surum': 1,
        'kaynak': 'Claude Code, eser başlıklarından, 2026-11; konusu olanlar data/ikonografi.json',
        'aciklama': 'Her eserin türü (t) ve konusu: k = ikonografi.json konu kimliği, a = konu sayfası henüz olmayan konunun Türkçe adı (en: İngilizce yerleşik adı). Anahtar ikonografi.json ile aynı (QID ya da "sanatçı|başlık").',
        'turler': TURLER,
        'eserler': eserler,
    }
    (KOK / 'data/eser_konulari.json').write_text(json.dumps(cikti, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'{len(eserler)} eser · ikonografi.json\'a eklenen {eklenen} · konu sayısı {len(ik["konular"])}')


if __name__ == '__main__':
    main()
