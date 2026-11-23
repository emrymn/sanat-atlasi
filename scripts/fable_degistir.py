#!/usr/bin/env python3
"""Fable denetiminde "değiştir" çıkan günün resimlerinin yerine iyisini seçer (scripts/fable_denetim.py'nin ikinci adımı).

Her bozuk eser için iki tür aday toplanır; Fable 5.2 hepsini görüp birini seçer (Toplu API, yarı fiyat):
  A · aynı eserin daha iyi bir kopyası (Wikimedia Commons: eserin Wikidata kaydındaki P18 görseli, P373 kategorisindeki
      dosyalar, "digital representation of" P6243 = eser). Eser değişmez, yürüyüşün metinleri aynen kalır; kopya farklı
      kırpılmışsa Fable ayrıntı kutularını yeni resme göre düzeltir.
  B · aynı eserin iyi kopyası yoksa aynı sanatçının başka bir eseri (data/eserler_onbellek.json; uygulamada büyük kopyası
      olanlar, en bilinenler önce). Fable eseri seçer ve yürüyüşün 4–6 ayrıntısını (kutu + Türkçe metin) yazar.
Doğruluk (CLAUDE.md "Accuracy rule"): adaylar yalnız eserin kendi Wikidata kaydından ya da sanatçının katalogdaki
eserlerinden gelir; başka bir eser hiçbir zaman başka sanatçıya yazılmaz.

Sonra inceleme sayfası: eski / yeni yan yana, ayrıntı kutuları çizili. Beğenmediğini --reddet ile çıkarırsın, kalanları
`uygula` data/yuruyus.json'a yazar (A için yeni kopyayı R2'ye y/<id>-<sürüm>.jpg olarak yükler).

Çalıştır (depo kökünde; önce fable_denetim.py al bitmiş olmalı):
  export ANTHROPIC_API_KEY=...
  python3 scripts/fable_degistir.py hazirla          # adayları toplar (Commons; birkaç dakika)
  python3 scripts/fable_degistir.py gonder           # tahmini maliyet + onay, Fable'a gönderir
  python3 scripts/fable_degistir.py al               # bitince seçimleri alır, inceleme sayfasını açar
  python3 scripts/fable_degistir.py al --reddet id1,id2   # beğenmediklerini çıkar (sayfa yeniden açılır)
  # A seçimi varsa R2 için (r2_yukle.py ile aynı): pip3 install boto3; export R2_HESAP_ID=... R2_ERISIM_ANAHTARI=...
  #   R2_GIZLI_ANAHTAR=...  (R2_KOVA varsayılan sanat-atlasi)
  python3 scripts/fable_degistir.py uygula           # data/yuruyus.json (+ yuruyus_odak.json) güncellenir
  git add data/yuruyus.json data/yuruyus_odak.json && git commit -m "Günün resimleri: Fable seçimleri" && git push
"""
import argparse
import hashlib
import html
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fable_denetim as d  # noqa: E402  (ortak: api, boyut, kirp_kucult, indir, adresler)

KOK = d.KOK
KLASOR = d.KLASOR
ADAY = KLASOR / "adaylar"  # aday görselleri (.gitignore: calisma ile birlikte)
ADAYLAR = KLASOR / "adaylar.json"
KAYIT = KLASOR / "degistir_toplu.json"
SECIM = KLASOR / "secimler.json"
SAYFA = KLASOR / "secim.html"
WIKI_UA = "SanatAtlasi/1.0 (kisisel calisma uygulamasi; gorsel denetimi)"
A_EN_COK, B_EN_COK = 4, 4
EN_AZ_UZUN = 2500  # A adayının uzun kenarı en az bu (ve elimizdekinden küçük değil)


def oku(yol, varsayilan=None):
    return json.loads(Path(yol).read_text(encoding="utf-8")) if Path(yol).exists() else varsayilan


def yaz(yol, veri):
    Path(yol).write_text(json.dumps(veri, ensure_ascii=False, indent=1), encoding="utf-8")


def wiki(url, **p):
    p.setdefault("format", "json")
    q = url + "?" + urllib.parse.urlencode(p)
    for deneme in range(5):
        time.sleep(0.5)  # Wikimedia'yı yormamak için
        try:
            with urllib.request.urlopen(urllib.request.Request(q, headers={"User-Agent": WIKI_UA}), timeout=60) as r:
                return json.loads(r.read().decode())
        except Exception as hata:
            if deneme == 4:
                print(f"  Wikimedia isteği olmadı: {hata}")
                return {}
            bekle = 5 * 2 ** deneme
            if isinstance(hata, urllib.error.HTTPError) and hata.headers.get("Retry-After", "").isdigit():
                bekle = max(bekle, int(hata.headers["Retry-After"]))
            time.sleep(bekle)


COMMONS = "https://commons.wikimedia.org/w/api.php"


def ayni_eser_dosyalari(qid):
    """Eserin Wikidata kaydına bağlı Commons dosya adları"""
    adlar = []
    e = wiki("https://www.wikidata.org/w/api.php", action="wbgetentities", ids=qid, props="claims")
    iddia = (e.get("entities", {}).get(qid, {}) or {}).get("claims", {})
    for c in iddia.get("P18", []):
        v = c.get("mainsnak", {}).get("datavalue", {}).get("value")
        if v:
            adlar.append(v)
    for c in iddia.get("P373", []):
        kat = c.get("mainsnak", {}).get("datavalue", {}).get("value")
        if kat:
            r = wiki(COMMONS, action="query", list="categorymembers", cmtitle="Category:" + kat, cmtype="file", cmlimit=60)
            adlar += [m["title"].split(":", 1)[1] for m in r.get("query", {}).get("categorymembers", [])]
    r = wiki(COMMONS, action="query", list="search", srsearch=f"haswbstatement:P6243={qid}", srnamespace=6, srlimit=30)
    adlar += [m["title"].split(":", 1)[1] for m in r.get("query", {}).get("search", [])]
    return list(dict.fromkeys(a.replace(" ", "_") for a in adlar))


def bilgiler(adlar, genislik=1568):
    """Commons dosyalarının boyu, türü, özgün ve küçültülmüş adresi"""
    sonuc = {}
    for i in range(0, len(adlar), 40):
        r = wiki(COMMONS, action="query", prop="imageinfo", iiprop="url|size|mime", iiurlwidth=genislik,
                 titles="|".join("File:" + a for a in adlar[i:i + 40]))
        for s in (r.get("query", {}).get("pages", {}) or {}).values():
            ii = (s.get("imageinfo") or [None])[0]
            if ii:
                sonuc[s["title"].split(":", 1)[1].replace(" ", "_")] = ii
    return sonuc


def hazirla(args):
    denetim = oku(d.SONUC, {})
    yur = oku(KOK / "data" / "yuruyus.json")["eserler"]
    kaynak = oku(KOK / "data" / "gorsel_kaynagi.json")
    katalog = oku(KOK / "data" / "eserler_onbellek.json")["sanatcilar"]
    yerel = oku(KOK / "data" / "yerel_gorseller.json")["gorseller"]
    devasa = set(kaynak.get("devasa") or [])
    istekler = oku(d.ISTEK, [])
    onceki = {k["id"]: k for k in istekler}
    kararlar = {"degistir"} | ({"supheli"} if args.supheli else set())
    secilen = [sid for sid, v in denetim.items() if v.get("karar") in kararlar and sid in yur]
    if args.dene:
        secilen = secilen[: args.dene]
    print(f"{len(secilen)} eser için aday aranıyor")
    ADAY.mkdir(parents=True, exist_ok=True)
    liste = []
    for n, sid in enumerate(secilen, 1):
        e = yur[sid]
        print(f"[{n}/{len(secilen)}] {sid}")
        eski = onceki.get(sid)
        W0, H0 = (eski or {}).get("boyut") or [0, 0]
        oran0 = W0 / H0 if H0 else 0
        # A · aynı eser
        a_aday = []
        if e.get("qid"):
            adlar = ayni_eser_dosyalari(e["qid"])
            for g in ((katalog.get(sid) or {}).get("eserler") or []):
                if g.get("qid") == e["qid"]:
                    adlar += [x["d"] for x in g.get("gorseller", []) if x.get("k") == "commons" and x.get("d")]
            bil = bilgiler(list(dict.fromkeys(adlar)))
            for ad, ii in bil.items():
                if ii.get("mime") not in ("image/jpeg", "image/png", "image/tiff"):
                    continue
                w, h = ii.get("width", 0), ii.get("height", 0)
                if max(w, h) < max(EN_AZ_UZUN, max(W0, H0) * 0.95):
                    continue
                if oran0 and abs((w / h) / oran0 - 1) > 0.15:  # ayrıntı, salon görünüşü, çerçeveli çekim elenir
                    continue
                a_aday.append({"ad": ad, "boyut": [w, h], "url": ii["url"], "kucuk": ii.get("thumburl") or ii["url"],
                               "sayfa": ii.get("descriptionurl", "")})
            a_aday.sort(key=lambda x: -x["boyut"][0] * x["boyut"][1])
            a_aday = a_aday[:A_EN_COK]
        # B · sanatçının başka eserleri (uygulamada büyük kopyası olanlar; kurs ve bilinenler önce)
        b_aday = []
        for g in ((katalog.get(sid) or {}).get("eserler") or []):
            if g.get("qid") == e.get("qid"):
                continue
            for x in g.get("gorseller", []):
                yad = yerel.get(f"{x.get('k')}:{x.get('d') or x.get('i') or x.get('u') or ''}")
                if yad and yad in devasa:
                    b_aday.append({"gorsel": yad, "eser": g.get("baslikEn") or g.get("baslik"), "eser_tr": g.get("baslik"),
                                   "yil": g.get("yil"), "qid": g.get("qid"), "puan": (1 if g.get("kurs") else 0, g.get("sl", 0))})
                    break
        b_aday.sort(key=lambda x: x["puan"], reverse=True)
        b_aday = b_aday[:B_EN_COK]
        # görseller: A'nın bütünü + en küçük ayrıntının kırpımı; B'nin 1280'liği
        nokta = sorted(e.get("noktalar") or [], key=lambda p: p["w"] * p["h"])[:1]
        for j, a in enumerate(a_aday):
            a["dosya"] = f"{sid}-A{j}.jpg"
            if not d.indir(a["kucuk"], ADAY / a["dosya"], WIKI_UA):
                a["dosya"] = ""
                continue
            if nokta:
                genis = min(a["boyut"][0], 3000)
                ham = ADAY / f"{sid}-A{j}-ham.jpg"
                bil = bilgiler([a["ad"]], genislik=genis).get(a["ad"], {})
                if d.indir(bil.get("thumburl") or a["url"], ham, WIKI_UA):
                    W, H = d.boyut(ham)
                    p = nokta[0]
                    x, y, w, h = int(p["x"] * W), int(p["y"] * H), max(8, int(p["w"] * W)), max(8, int(p["h"] * H))
                    x, y = max(0, min(x, W - w)), max(0, min(y, H - h))
                    a["ayrinti"] = f"{sid}-A{j}-ayrinti.jpg"
                    d.kirp_kucult(ham, ADAY / a["ayrinti"], (x, y, min(w, W - x), min(h, H - y)), 1568)
                    a["ayrinti_buyutme"] = round(d.EKRAN_EN / (p["w"] * a["boyut"][0]), 1)
                    ham.unlink()
        a_aday = [a for a in a_aday if a.get("dosya")]
        for j, b in enumerate(b_aday):
            k_url, b_url = d.adresler(sid, {"gorsel": b["gorsel"]}, kaynak)
            b["dosya"] = f"{sid}-B{j}.jpg"
            if not d.indir(k_url, ADAY / b["dosya"]):
                b["dosya"] = ""
        b_aday = [b for b in b_aday if b.get("dosya")]
        liste.append({"id": sid, "sanatci": (eski or {}).get("sanatci", sid), "eser": e.get("eser"), "yil": e.get("yil"),
                      "eski": eski, "sorun": denetim[sid], "noktalar": e.get("noktalar"), "A": a_aday, "B": b_aday})
        print(f"   {len(a_aday)} aynı eser kopyası, {len(b_aday)} başka eser")
    yaz(ADAYLAR, liste)
    print(f"\nHazır: {ADAYLAR.relative_to(KOK)}. Şimdi: python3 scripts/fable_degistir.py gonder")


NOKTA = {
    "type": "object",
    "properties": {"ad": {"type": "string"}, "x": {"type": "number"}, "y": {"type": "number"},
                   "w": {"type": "number"}, "h": {"type": "number"}, "metin": {"type": "string"}},
    "required": ["ad", "x", "y", "w", "h", "metin"], "additionalProperties": False,
}
SEMA = {
    "type": "object",
    "properties": {
        "secim": {"type": "string", "description": "A0..A3, B0..B3 ya da 'yok'"},
        "aciklama": {"type": "string", "description": "Türkçe, en çok iki cümle: neden bu aday"},
        "eser_adi": {"type": "string", "description": "B seçildiyse eserin Türkçe adı, yoksa boş"},
        "noktalar": {"type": "array", "items": NOKTA},
    },
    "required": ["secim", "aciklama", "eser_adi", "noktalar"], "additionalProperties": False,
}
TALIMAT = """Bir sanat tarihi çalışma uygulamasında her gün bir sanatçının bir tablosu telefonu kaplayacak kadar büyük gösteriliyor; \
kamera sonra tablonun 4–6 ayrıntısına sırayla yakınlaşıyor ve her ayrıntının altında kısa bir Türkçe açıklama kartı çıkıyor. \
Bu sanatçının şu anki görseli bir denetimde "değiştirilmeli" bulundu (nedeni aşağıda). Adaylardan en iyisini seç.

Öncelik: aynı eserin daha iyi bir kopyası (A adayları): düz, önden, eşit ışıklı tarama ya da müze fotoğrafı; çerçeve, duvar, \
yansıma, parlama, eğiklik, sıkıştırma bozukluğu yok; renkler doğal; ayrıntılar keskin. Aday gerçekten aynı tablo olmalı \
(ayrıntı, kopya, gravür ya da başka sürüm değil). A seçersen "noktalar"a şu anki ayrıntıların hepsini AYNI adlarla ve \
metinler BOŞ olarak yaz; kutuları seçtiğin kopyada aynı ayrıntıya denk gelecek şekilde (gerekirse kaydırarak) ver.

İyi bir A yoksa aynı sanatçının başka bir eseri (B adayları): görseli iyi olan, sanatçıyı en iyi tanıtan ve içinde yürünecek \
ayrıntısı bol olan eseri seç. B seçersen "eser_adi"na Türkçe adını, "noktalar"a 4–6 ayrıntı yaz: ad (2–4 kelime), kutu \
(x, y, w, h: resmin eni/boyuna oranla, 0–1; w ve h 0,12 ile 0,6 arası; kutu resmin içinde) ve metin (Türkçe, 1–2 cümle, \
sade ve doğru: ne görüyoruz, neden önemli; emin olmadığın bilgiyi yazma). Ayrıntılar resimde gerçekten görünen şeyler olmalı.

Hiçbiri şu ankinden iyi değilse "yok" seç ve noktaları boş bırak."""


def istek_govdesi(k):
    def resim(yol):
        return {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg",
                                            "data": __import__("base64").b64encode(Path(yol).read_bytes()).decode()}}
    eski = k.get("eski") or {}
    s = k["sorun"]
    c = [{"type": "text", "text": f"Sanatçı: {k['sanatci']}\nŞu anki eser: {k['eser']} ({k.get('yil') or '?'})\n"
                                  f"Denetimin bulduğu sorun: {', '.join(s.get('sorunlar', []))}. {s.get('aciklama', '')}\n"
                                  f"Şu anki görsel ({eski.get('boyut', ['?', '?'])[0]}×{eski.get('boyut', ['?', '?'])[1]} px):"}]
    if eski.get("butun") and (d.CALISMA / eski["butun"]).exists():
        c.append(resim(d.CALISMA / eski["butun"]))
    c.append({"type": "text", "text": "Şu anki ayrıntılar (ad, kutu): " + json.dumps(
        [{x: p[x] for x in ("ad", "x", "y", "w", "h")} for p in k.get("noktalar") or []], ensure_ascii=False)})
    for j, a in enumerate(k["A"]):
        c.append({"type": "text", "text": f"A{j}: aynı eserin kopyası, {a['boyut'][0]}×{a['boyut'][1]} px ({a['ad']})"})
        c.append(resim(ADAY / a["dosya"]))
        if a.get("ayrinti"):
            c.append({"type": "text", "text": f"A{j}'nin en küçük ayrıntısı, telefonda ~{a['ayrinti_buyutme']} kat büyütülür:"})
            c.append(resim(ADAY / a["ayrinti"]))
    for j, b in enumerate(k["B"]):
        c.append({"type": "text", "text": f"B{j}: başka eser: {b['eser']} ({b.get('yil') or '?'}); uygulamada büyük kopyası var"})
        c.append(resim(ADAY / b["dosya"]))
    if not k["A"] and not k["B"]:
        c.append({"type": "text", "text": "Aday bulunamadı."})
    return {"model": d.MODEL, "max_tokens": 12000, "system": TALIMAT,
            "output_config": {"effort": "high", "format": {"type": "json_schema", "schema": SEMA}},
            "messages": [{"role": "user", "content": c}]}


def gonder(args):
    liste = [k for k in oku(ADAYLAR, []) if k["A"] or k["B"]]
    if not liste:
        sys.exit("Aday yok (önce: hazirla).")
    giris = 0
    for k in liste:
        dosyalar = [ADAY / a["dosya"] for a in k["A"]] + [ADAY / a["ayrinti"] for a in k["A"] if a.get("ayrinti")]
        dosyalar += [ADAY / b["dosya"] for b in k["B"]]
        giris += 1500 + sum(min(1600, (lambda w, h: w * h / 750)(*d.boyut(f))) for f in dosyalar) + 1600
    cikis = 4000 * len(liste)
    dolar = giris / 1e6 * d.GIRIS_FIYAT + cikis / 1e6 * d.CIKIS_FIYAT
    print(f"{len(liste)} eser · tahmini {giris / 1000:.0f}K giriş + {cikis / 1000:.0f}K çıkış ≈ {dolar:.2f} $")
    if not args.evet and input("Gönderilsin mi? (e/h) ").strip().lower() not in ("e", "evet", "y"):
        return
    d.anahtar()
    idler = []
    for i in range(0, len(liste), 30):
        govde = {"requests": [{"custom_id": k["id"], "params": istek_govdesi(k)} for k in liste[i:i + 30]]}
        idler.append(json.loads(d.api("/messages/batches", govde))["id"])
        print(f"  gönderildi: {idler[-1]}")
    yaz(KAYIT, {"idler": idler, "gonderildi": time.strftime("%Y-%m-%d %H:%M"), "tahmin": round(dolar, 2)})
    print("Sonra: python3 scripts/fable_degistir.py al")


def al(args):
    secim = oku(SECIM, {})
    if not args.reddet or not secim:
        k = oku(KAYIT)
        satirlar = []
        for bid in k["idler"]:
            t = json.loads(d.api(f"/messages/batches/{bid}"))
            if t["processing_status"] != "ended":
                print(f"Henüz bitmedi ({bid}): {t['request_counts']}. Biraz sonra yeniden dene.")
                return
            satirlar += d.api(f"/messages/batches/{bid}/results").splitlines()
        giris = cikis = 0
        for s in filter(None, satirlar):
            r = json.loads(s)
            res = r["result"]
            if res["type"] != "succeeded" or res["message"].get("stop_reason") == "refusal":
                secim[r["custom_id"]] = {"secim": "hata", "aciklama": json.dumps(res)[:300], "noktalar": []}
                continue
            m = res["message"]
            giris += m["usage"].get("input_tokens", 0)
            cikis += m["usage"].get("output_tokens", 0)
            try:
                secim[r["custom_id"]] = json.loads("".join(b.get("text", "") for b in m["content"] if b["type"] == "text"))
            except ValueError:
                secim[r["custom_id"]] = {"secim": "hata", "aciklama": "yanıt okunamadı", "noktalar": []}
        print(f"Gerçek: {giris / 1000:.0f}K giriş + {cikis / 1000:.0f}K çıkış ≈ "
              f"{giris / 1e6 * d.GIRIS_FIYAT + cikis / 1e6 * d.CIKIS_FIYAT:.2f} $")
    for sid in filter(None, (args.reddet or "").split(",")):
        if sid.strip() in secim:
            secim[sid.strip()]["reddedildi"] = True
    yaz(SECIM, secim)
    sayac = {}
    for v in secim.values():
        t = "reddedildi" if v.get("reddedildi") else (v["secim"][:1] if v["secim"][:1] in "AB" else v["secim"])
        sayac[t] = sayac.get(t, 0) + 1
    print(f"Seçimler: {sayac}  (A: aynı eserin iyi kopyası, B: başka eser)")
    sayfa(secim)


def kutular(noktalar):
    return "".join(f'<i style="left:{p["x"] * 100}%;top:{p["y"] * 100}%;width:{p["w"] * 100}%;height:{p["h"] * 100}%"'
                   f' title="{html.escape(p["ad"])}"></i>' for p in noktalar or [])


def sayfa(secim):
    liste = {k["id"]: k for k in oku(ADAYLAR, [])}
    bolumler = []
    for sid, v in secim.items():
        k = liste.get(sid)
        if not k:
            continue
        eski = (k.get("eski") or {}).get("butun", "")
        s = v["secim"]
        yeni, ad = "", ""
        if s[:1] in "AB" and s[1:].isdigit() and int(s[1:]) < len(k[s[0]]):
            a = k[s[0]][int(s[1:])]
            yeni = f"adaylar/{a['dosya']}"
            ad = a.get("ad") or f"{a['eser']} ({a.get('yil')})"
        noktalar = v.get("noktalar", [])
        metinler = "".join(f"<li><b>{html.escape(p['ad'])}</b> {html.escape(p['metin'])}</li>"
                           for p in v.get("noktalar", []) if p.get("metin"))
        bolumler.append(
            f'<section class="{"red" if v.get("reddedildi") else s[:1]}"><h2>{html.escape(k["sanatci"])} '
            f'<small>{sid}</small></h2><p><b>{s}</b>{" · REDDEDİLDİ" if v.get("reddedildi") else ""} · '
            f'{html.escape(v.get("eser_adi") or "")} {html.escape(ad)}<br>{html.escape(v["aciklama"])}</p>'
            f'<div class="ikili"><figure><img src="calisma/{html.escape(eski)}"><figcaption>şu anki: '
            f'{html.escape(k["eser"] or "")}</figcaption></figure>'
            + (f'<figure><span class="kap"><img src="{html.escape(yeni)}">{kutular(noktalar)}</span>'
               f'<figcaption>yeni</figcaption></figure>' if yeni else "")
            + f'</div><ol>{metinler}</ol></section>')
    SAYFA.write_text(
        "<!doctype html><meta charset=utf-8><title>Fable seçimleri</title><style>body{font:15px system-ui;"
        "background:#1d1a17;color:#efe7da;margin:20px}section{margin:0 0 28px;padding:12px;border-radius:10px;"
        "background:#26221e}.A{border-left:6px solid #4c8a5f}.B{border-left:6px solid #d8b36a}.red,.y,.h{opacity:.5;"
        "border-left:6px solid #777}.ikili{display:flex;gap:12px;flex-wrap:wrap}figure{margin:0}img{height:380px;"
        "display:block;border-radius:4px}.kap{position:relative;display:inline-block}.kap i{position:absolute;"
        "border:2px solid #ffd76a;box-sizing:border-box}small{opacity:.6;font-weight:400}</style><h1>Fable seçimleri"
        "</h1><p>Beğenmediklerini çıkar: <code>python3 scripts/fable_degistir.py al --reddet id1,id2</code> · sonra "
        "<code>uygula</code></p>" + "".join(bolumler), encoding="utf-8")
    print(f"İnceleme sayfası: {SAYFA.relative_to(KOK)}")
    if shutil.which("open"):
        subprocess.run(["open", str(SAYFA)])


def nokta_gecerli(p):
    return (0 <= p["x"] and 0 <= p["y"] and p["x"] + p["w"] <= 1.0001 and p["y"] + p["h"] <= 1.0001
            and 0.05 <= p["w"] <= 0.9 and 0.05 <= p["h"] <= 0.9)


def r2_yukle(yerel, anahtar):
    try:
        import boto3
    except ImportError:
        sys.exit("A seçimlerini yüklemek için: pip3 install boto3 (r2_yukle.py ile aynı)")
    for v in ("R2_HESAP_ID", "R2_ERISIM_ANAHTARI", "R2_GIZLI_ANAHTAR"):
        if not os.environ.get(v):
            sys.exit(f"{v} yok (README · Görseller Cloudflare R2'de; r2_yukle.py ile aynı değişkenler)")
    s3 = boto3.client("s3", endpoint_url=f"https://{os.environ['R2_HESAP_ID']}.r2.cloudflarestorage.com",
                      aws_access_key_id=os.environ["R2_ERISIM_ANAHTARI"],
                      aws_secret_access_key=os.environ["R2_GIZLI_ANAHTAR"], region_name="auto")
    s3.upload_file(str(yerel), os.environ.get("R2_KOVA", "sanat-atlasi"), anahtar,
                   ExtraArgs={"ContentType": "image/jpeg", "CacheControl": "public, max-age=31536000, immutable"})


def uygula(args):
    secim = oku(SECIM, {})
    liste = {k["id"]: k for k in oku(ADAYLAR, [])}
    yol = KOK / "data" / "yuruyus.json"
    veri = oku(yol)
    yur = veri["eserler"]
    odak_yol = KOK / "data" / "yuruyus_odak.json"
    odak = oku(odak_yol)
    indirme = KLASOR / "yeni"
    indirme.mkdir(exist_ok=True)
    degisen = []
    for sid, v in secim.items():
        s = v.get("secim", "")
        if v.get("reddedildi") or s[:1] not in "AB" or sid not in yur or sid not in liste:
            continue
        aday = liste[sid][s[0]][int(s[1:])]
        e = yur[sid]
        eski_gorsel = e.get("gorsel")
        if s[0] == "A":
            eski_ad = {p["ad"]: p for p in e["noktalar"]}
            yeni = [p for p in v.get("noktalar", []) if p["ad"] in eski_ad and nokta_gecerli(p)]
            if len(yeni) == len(e["noktalar"]):
                for p in yeni:
                    for x in ("x", "y", "w", "h"):
                        eski_ad[p["ad"]][x] = round(p[x], 3)
            ham = indirme / f"{sid}.jpg"
            print(f"{sid}: aynı eserin kopyası indiriliyor ({aday['boyut'][0]}×{aday['boyut'][1]})")
            if not d.indir(aday["url"], ham, WIKI_UA):
                continue
            buyuk = indirme / f"{sid}-buyuk.jpg"
            W, H = d.boyut(ham)
            d.kirp_kucult(ham, buyuk, (0, 0, W, H), 4096)
            kucuk = indirme / f"{sid}-1280.jpg"
            d.kirp_kucult(ham, kucuk, (0, 0, W, H), 1280)
            surum = hashlib.md5(buyuk.read_bytes()).hexdigest()[:8]
            anahtar = f"y/{sid}-{surum}.jpg"
            r2_yukle(buyuk, anahtar)
            r2_yukle(kucuk, anahtar[:-4] + "-1280.jpg")
            e["buyuk"] = anahtar
            e.pop("kirp", None)
        else:
            noktalar = [p for p in v.get("noktalar", []) if nokta_gecerli(p) and p.get("metin")]
            if not 4 <= len(noktalar) <= 7:
                print(f"{sid}: B seçiminin ayrıntıları geçersiz ({len(noktalar)}), atlandı")
                continue
            e["eser"] = aday["eser"]
            e["yil"] = aday.get("yil")
            if aday.get("qid"):
                e["qid"] = aday["qid"]
            e["gorsel"] = aday["gorsel"]
            e["noktalar"] = [{"ad": p["ad"], "x": round(p["x"], 3), "y": round(p["y"], 3), "w": round(p["w"], 3),
                              "h": round(p["h"], 3), "metin": p["metin"]} for p in noktalar]
            for x in ("buyuk", "kirp"):
                e.pop(x, None)
        # eski görselin açılış düzeltmeleri yeni görsele uymaz
        for alan in ("odak", "yakin", "kirp"):
            if s[0] == "B" or alan != "odak":
                (odak.get(alan) or {}).pop(eski_gorsel, None)
        degisen.append(f"{sid} ({s})")
    if not degisen:
        print("Uygulanacak seçim yok.")
        return
    yol.write_text(json.dumps(veri, ensure_ascii=False, indent=1), encoding="utf-8")
    odak_yol.write_text(json.dumps(odak, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(degisen)} eser güncellendi: {', '.join(degisen)}")
    print('Sonra: git add data/yuruyus.json data/yuruyus_odak.json && git commit -m "Günün resimleri: Fable seçimleri" '
          "&& git push")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    alt = p.add_subparsers(dest="komut", required=True)
    h = alt.add_parser("hazirla")
    h.add_argument("--supheli", action="store_true", help="şüpheli bulunanlara da aday ara")
    h.add_argument("--dene", type=int, default=0)
    g = alt.add_parser("gonder")
    g.add_argument("--evet", action="store_true")
    a = alt.add_parser("al")
    a.add_argument("--reddet", default="", help="virgülle ayrılmış sanatçı kimlikleri")
    alt.add_parser("uygula")
    x = p.parse_args()
    {"hazirla": hazirla, "gonder": gonder, "al": al, "uygula": uygula}[x.komut](x)


if __name__ == "__main__":
    main()
