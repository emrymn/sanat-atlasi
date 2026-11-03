#!/usr/bin/env python3
"""Görsel denetimi sonuçlarını uygulamaya işler (İş 107).

  python3 scripts/gorsel_denetim/isle.py           # sonuc_*.json → data/gorsel_kararlari.json + data/eserler_onbellek.json
  python3 scripts/gorsel_denetim/isle.py --ozet    # yalnız sayıları göster, dosyaya yazma

Kararlar Gemini'nin (TALIMAT.md); Claude ilk partiyi baştan sona, sonrakileri örnekleyerek kontrol eder ve katılmadığı
kararları aşağıdaki DUZELTME'ye yazar. `uygun` olanlar kayda girmez. Anahtar biçimi scripts/kaynaklar/birlestir.mjs
kararAnahtari ile aynı: Commons'ta dosya adı (küçük harf, boşluk yerine _), müze görsellerinde "kaynak:adres".
eserler_onbellek.json, onbellek.mjs yeniden çalıştırılmadan da aynı sonucu versin diye doğrudan güncellenir:
kotu → görselin puanı 5 (galeride sona, pekiştirmede kullanılmaz); cikar → görsel atılır, görseli kalmayan eser düşer.
Aynı sonuçlarla yeniden çalıştırmak bir şey değiştirmez."""
import json, sys, urllib.parse
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
BURASI = Path(__file__).resolve().parent

# Claude'un denetiminde Gemini'den farklı karar verilenler: anahtar → (karar, gerekçe)
DUZELTME = {
    # 4.31 "Madonna, Fragment": eserin kendisi bir parça; görsel bütün parçayı gösteriyor (Gemini "ayrıntı" demişti)
    'commons:Gentile_da_Fabriano_041.jpg': ('uygun', None),
    # 2.12 Avignon'daki sinopya: çok karanlık, figür seçilmiyor (Gemini "uygun" demişti)
    'commons:Sinopia_figurant_le_Christ_Rédempteur_en_Gloire_entouré_par_des_anges.jpg': ('kotu', 'bulanik'),
    # 22.38 Tintoretto'nun tavan resmi: oval resim, yaldızlı tavan çerçevesinin ortasında küçük kalıyor (Gemini "uygun ?")
    'commons:Jacopo_Tintoretto_-_Glorification_of_St_Roch.jpg': ('kotu', 'cerceve'),
    # 23.46 Veronese'nin Müjde'si (Cleveland): ince bir çerçeve, resim görüntünün çoğunu kaplıyor (Gemini "çerçeve ?")
    'cma:https://openaccess-cdn.clevelandart.org/1950.251/1950.251_web.jpg': ('uygun', None),
    # 31.48 Artemisia "Judith and Maidservant" (Capodimonte): kalın yaldızlı çerçeve ve duvarla çekilmiş (Gemini "uygun")
    'commons:Artemisia_gentileschi,_giuditta_e_la_fantesca_abra_con_la_testa_recisa_di_oloferne,_1645-50,_Q377.JPG': ('kotu', 'cerceve'),
    # 42–88. partiler (Gemini Antigravity): ince çerçeve, resim görüntünün çoğunu kaplıyor (Gemini "çerçeve")
    'commons:Claude_lorrain,_porto_di_mare,_effetto_di_nebbia,_1646.JPG': ('uygun', None),
    'commons:Royal_Ontario_Museum-9492.jpg': ('uygun', None),
    'commons:Bemberg_Fondation_Toulouse_-_Portrait_de_la_comtesse_Kagenek_en_Flore_-_Elisabeth_Vigée-Lebrun_1783_75x62_HT_Inv.1128.jpg': ('uygun', None),
    'commons:Johann_Heinrich_Füssli_-_Portrait_of_a_Lady_-_Detroit_Institute_of_Arts_55.5.B.jpg': ('uygun', None),
    # 76.36 Monet'nin parçalanmış Kırda Öğle Yemeği: sol parça eserin bugün var olan hâli (Gemini "ayrıntı")
    "commons:Claude_Monet_-_Le_dejeurner_sur_l'herbe_(left_panel).jpg": ('uygun', None),
    # 44.9 Boucher: Cleveland'ın tek kaydında iki ayrı tablo üst üste (Gemini "uygun"; Poussin Dört Mevsim kolajı gibi)
    'cma:https://openaccess-cdn.clevelandart.org/1948.181/1948.181_web.jpg': ('kotu', 'kolaj'),
}


def dosya_normal(ad):
    s = str(ad or '').strip()
    if '%' in s:
        try:
            s = urllib.parse.unquote(s)
        except Exception:
            pass
    return s.replace(' ', '_')


def karar_anahtari(g):
    if g['k'] == 'commons':
        return dosya_normal(g.get('d')).lower()
    return f"{g['k']}:{g.get('d') or g.get('i') or g.get('u') or ''}"


def sonuc_anahtari(a):
    """sonuc_*.json'daki anahtar (yerel_anahtar biçimi: 'commons:Dosya.jpg', 'met:https://…') → karar anahtarı"""
    k, _, d = a.partition(':')
    return dosya_normal(d).lower() if k == 'commons' else a


def main():
    yaz = '--ozet' not in sys.argv
    kararlar_yolu = KOK / 'data/gorsel_kararlari.json'
    kd = json.loads(kararlar_yolu.read_text())
    kararlar = kd['kararlar']
    yeni = {}
    sayi = {'uygun': 0, 'kotu': 0, 'cikar': 0}
    for p in sorted(BURASI.glob('sonuc_[0-9][0-9][0-9].json')):
        for s in json.loads(p.read_text()):
            # Gemini 7. partiden sonra alanın adını "durum" yazdı; ikisi de kabul edilir
            karar, _ = DUZELTME.get(s['anahtar'], (s.get('karar', s.get('durum')), s.get('neden')))
            if karar not in sayi:
                raise SystemExit(f'{p.name}: bilinmeyen karar {karar!r} ({s["anahtar"]})')
            sayi[karar] += 1
            if karar != 'uygun':
                yeni[sonuc_anahtari(s['anahtar'])] = karar
    degisen = {a: k for a, k in yeni.items() if kararlar.get(a) != k}
    print(f"sonuç: uygun {sayi['uygun']} · kotu {sayi['kotu']} · cikar {sayi['cikar']} · yeni/değişen karar {len(degisen)}")

    ob_yolu = KOK / 'data/eserler_onbellek.json'
    ob = json.loads(ob_yolu.read_text())
    tum = {**kararlar, **yeni}
    puan5 = atilan_gorsel = dusen_eser = 0
    for v in ob['sanatcilar'].values():
        kalan = []
        for e in v.get('eserler', []):
            gorseller = []
            for g in e.get('gorseller', []):
                k = tum.get(karar_anahtari(g))
                if k == 'cikar':
                    atilan_gorsel += 1
                    continue
                if k == 'kotu' and g.get('p') != 5:
                    g['p'] = 5
                    puan5 += 1
                gorseller.append(g)
            if not gorseller:
                dusen_eser += 1
                continue
            # birlestir.mjs gorselleriSirala ile aynı: puana göre (eşitlikte eski sıra)
            e['gorseller'] = [g for _, g in sorted(enumerate(gorseller), key=lambda x: (-(x[1].get('p') or 0), x[0]))]
            if any((g.get('p') if g.get('p') is not None else 100) > 5 for g in e['gorseller']):
                e.pop('pekistirme', None)
            else:
                e['pekistirme'] = False
            kalan.append(e)
        v['eserler'] = kalan
    print(f'önbellek: puanı 5 olan görsel {puan5} · atılan görsel {atilan_gorsel} · düşen eser {dusen_eser}')
    if not yaz:
        return
    kararlar.update(yeni)
    kararlar_yolu.write_text(json.dumps(kd, ensure_ascii=False, indent=1))
    ob_yolu.write_text(json.dumps(ob, ensure_ascii=False, separators=(',', ':')))  # onbellek.mjs gibi: JSON.stringify, satır sonu yok


if __name__ == '__main__':
    main()
