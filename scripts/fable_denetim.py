#!/usr/bin/env python3
"""Günün resimleri (Bugün'deki yürüyüş, data/yuruyus.json) için Fable görsel denetimi.

Emre (2026-11-23): "bazı resimlerin kalitesi kötü, yaklaşırken çok bozuluyor; mesela Ingres'in resmi kamerayla çekilmiş
fotoğraf. Hepsini Fable incelesin." Boyut ölçümü (uzun kenar) kamerayla çekilmiş, yansımalı, eğik ya da renkleri bozuk
fotoğrafı yakalamaz; bunu ancak resme bakan biri görür. Bu betik her yürüyüş eserinin resmini ve yürüyüşte yakınlaşılan
ayrıntıları (en büyük kopyadan, gerçek çözünürlükte kırpılmış) Claude Fable 5.2'ye gösterir ve "iyi / değiştirilmeli"
kararını nedenleriyle alır. Hiçbir veri dosyasını değiştirmez: sonucu scripts/fable_denetim/sonuc.json'a ve inceleme
sayfasına yazar. Değiştirme (aynı eserin daha iyi kopyası ya da başka eser) ikinci adımdır.

Toplu (Batch) API kullanılır: sonuç birkaç dakika–birkaç saat sürer, fiyat yarıdır. Göndermeden önce tahmini maliyeti
yazar ve onay ister.

Gerekenler (macOS): hazır gelen python3 ve sips; ANTHROPIC_API_KEY ortam değişkeni (Console → API keys). Paket kurmaz.

  export ANTHROPIC_API_KEY=...                    # anahtar yalnız bu Terminal penceresinde kalır
  python3 scripts/fable_denetim.py hazirla --dene 5    # önce 5 eser (Ingres dahil): görselleri indirip kırpar
  python3 scripts/fable_denetim.py gonder              # tahmini maliyeti gösterir, onaylarsan gönderir
  python3 scripts/fable_denetim.py al                  # bitmişse sonucu alır, gerçek maliyeti yazar, sayfayı açar
  python3 scripts/fable_denetim.py hazirla             # sonra hepsi (145 eser); yine gonder, al
"""
import argparse
import base64
import html
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
KLASOR = KOK / "scripts" / "fable_denetim"
CALISMA = KLASOR / "calisma"  # indirilen ve kırpılan görseller (.gitignore)
ISTEK = KLASOR / "istekler.json"
KAYIT = KLASOR / "toplu.json"
SONUC = KLASOR / "sonuc.json"
SAYFA = KLASOR / "inceleme.html"

MODEL = "claude-fable-5-2"
API = "https://api.anthropic.com/v1"
SURUM = "2026-10-21"
# Toplu API fiyatı (yarı): giriş / çıkış, milyon token başına dolar
GIRIS_FIYAT, CIKIS_FIYAT = 4.0, 20.0
TAHMINI_CIKIS = 2500  # eser başına (düşünme dahil) tahmin; gerçeği "al" yazar
EKRAN_EN = 1179  # iPhone 13 ekranının piksel eni (390 pt × 3)
UA = "Mozilla/5.0 (Macintosh) SanatAtlasi-denetim/1.0"

ILK_DENEME = ["jean-auguste-dominique-ingres", "giovanni-bellini", "jacopo-pontormo", "jan-van-eyck", "fra-angelico"]


def oku(yol):
    return json.loads(Path(yol).read_text(encoding="utf-8"))


def adresler(sid, e, kaynak):
    """js/gorsel.js yuruyusAdresleri: (1280'lik, en büyük) adres"""
    a = kaynak["adres"].rstrip("/")
    if e.get("buyuk"):
        b = e["buyuk"]
        return f"{a}/{b[:-4]}-1280.jpg" if b.endswith(".jpg") else f"{a}/{b}", f"{a}/{b}"
    ad = e["gorsel"]
    bs = (kaynak.get("b_surumler") or {}).get(ad)
    ds = (kaynak.get("surumler") or {}).get(ad)
    kucuk = f"{a}/b/{ad}{'-' + bs if bs else ''}.jpg"
    buyuk = f"{a}/d/{ad}{'-' + ds if ds else ''}.jpg" if ad in set(kaynak.get("devasa") or []) else ""
    return kucuk, buyuk


def indir(url, hedef):
    if hedef.exists() and hedef.stat().st_size > 0:
        return True
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=120) as r:
            hedef.write_bytes(r.read())
        return True
    except Exception as hata:
        print(f"  indirilemedi: {url} ({hata})")
        return False


# --- görsel işleme: macOS'ta sips, yoksa (Linux'ta deneme) Pillow ---
def boyut(yol):
    if shutil.which("sips"):
        c = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(yol)], capture_output=True, text=True).stdout
        d = dict(s.strip().split(": ") for s in c.splitlines()[1:] if ": " in s)
        return int(d["pixelWidth"]), int(d["pixelHeight"])
    from PIL import Image
    with Image.open(yol) as im:
        return im.size


def kirp_kucult(kaynak, hedef, kutu, uzun):
    """kutu: (x, y, w, h) piksel; sonra uzun kenarı en çok `uzun` px (büyütmez), JPEG"""
    x, y, w, h = kutu
    if shutil.which("sips"):
        ara = hedef.with_suffix(".ara.jpg")
        # sips: -c yükseklik genişlik, --cropOffset y x (sol üstten)
        subprocess.run(["sips", "-s", "format", "jpeg", "-c", str(h), str(w), "--cropOffset", str(y), str(x),
                        str(kaynak), "--out", str(ara)], capture_output=True, check=True)
        if max(w, h) > uzun:
            subprocess.run(["sips", "-Z", str(uzun), "-s", "formatOptions", "85", str(ara), "--out", str(hedef)],
                           capture_output=True, check=True)
            ara.unlink()
        else:
            ara.rename(hedef)
        return
    from PIL import Image
    with Image.open(kaynak) as im:
        p = im.convert("RGB").crop((x, y, x + w, y + h))
        p.thumbnail((uzun, uzun))
        p.save(hedef, "JPEG", quality=85)


def hazirla(args):
    yur = oku(KOK / "data" / "yuruyus.json")["eserler"]
    kaynak = oku(KOK / "data" / "gorsel_kaynagi.json")
    adlar = oku(KOK / "data" / "eser_adlari_tr.json") if (KOK / "data" / "eser_adlari_tr.json").exists() else {}
    sanatcilar = {s["id"]: s for s in oku(KOK / "data" / "sanatcilar.json")}
    secim = list(yur)
    if args.dene:
        secim = [s for s in ILK_DENEME if s in yur][: args.dene]
        secim += [s for s in yur if s not in secim][: max(0, args.dene - len(secim))]
    CALISMA.mkdir(parents=True, exist_ok=True)
    istekler = []
    for i, sid in enumerate(secim, 1):
        e = yur[sid]
        print(f"[{i}/{len(secim)}] {sid}")
        kucuk, buyuk = adresler(sid, e, kaynak)
        dosya = CALISMA / f"{sid}.jpg"
        if not (buyuk and indir(buyuk, dosya)) and not indir(kucuk, dosya):
            continue
        W, H = boyut(dosya)
        butun = CALISMA / f"{sid}-butun.jpg"
        kirp_kucult(dosya, butun, (0, 0, W, H), 1568)
        # en zorlu (en küçük) 3 ayrıntı: telefonda en çok büyütülenler
        noktalar = sorted(e.get("noktalar") or [], key=lambda n: n["w"] * n["h"])[:3]
        parcalar = []
        for j, n in enumerate(noktalar):
            x, y = int(n["x"] * W), int(n["y"] * H)
            w, h = max(8, int(n["w"] * W)), max(8, int(n["h"] * H))
            x, y = max(0, min(x, W - w)), max(0, min(y, H - h))
            p = CALISMA / f"{sid}-ayrinti{j}.jpg"
            kirp_kucult(dosya, p, (x, y, min(w, W - x), min(h, H - y)), 1568)
            parcalar.append({"ad": n.get("ad", ""), "dosya": p.name, "piksel": [w, h],
                             "buyutme": round(EKRAN_EN / w, 1)})
        s = sanatcilar.get(sid, {})
        istekler.append({
            "id": sid, "sanatci": s.get("ad", sid), "akim": s.get("akim", ""), "eser": e.get("eser", ""),
            "eser_tr": adlar.get(e.get("eser", ""), ""), "yil": e.get("yil"), "boyut": [W, H],
            "buyuk_var": bool(buyuk), "butun": butun.name, "ayrintilar": parcalar,
        })
    ISTEK.write_text(json.dumps(istekler, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{len(istekler)} eser hazır: {ISTEK.relative_to(KOK)}. Şimdi: python3 scripts/fable_denetim.py gonder")


SEMA = {
    "type": "object",
    "properties": {
        "karar": {"type": "string", "enum": ["iyi", "supheli", "degistir"]},
        "sorunlar": {"type": "array", "items": {"type": "string", "enum": [
            "kamera_cekimi", "yansima_parlama", "egik_aci", "cerceve_duvar", "dusuk_cozunurluk",
            "sikistirma_bozuklugu", "renk_bozuk", "kirpik_eksik", "leke_hasar", "baska_eser"]}},
        "yakin_netlik": {"type": "integer", "description": "0 kusursuz … 3 telefonda belirgin bozuk"},
        "aciklama": {"type": "string", "description": "Türkçe, en çok iki cümle"},
    },
    "required": ["karar", "sorunlar", "yakin_netlik", "aciklama"],
    "additionalProperties": False,
}

TALIMAT = """Bir sanat tarihi çalışma uygulamasının ana ekranında her gün bir tablo telefonu kaplayacak kadar büyük gösteriliyor; \
kamera sonra tablonun ayrıntılarına yakınlaşıyor (ayrıntı ekranın enini doldurur). Senden bu tablonun görselinin bu iş için \
uygun olup olmadığına karar vermeni istiyorum.

İyi bir görsel: tablonun düz, önden, eşit ışıkla yapılmış bir taraması ya da müze fotoğrafı; çerçeve, duvar, ziyaretçi, \
yansıma, parlama ve eğiklik yok; renkler doğal; ayrıntılar yakından bakınca da keskin.

Değiştirilmeli: müzede elde çekilmiş fotoğraf (parlama, cam ya da vernik yansıması, eğik açı, çerçeve/duvar görünüyor), \
ayrıntıda bulanıklık, bloklaşma ya da sıkıştırma bozukluğu, belirgin renk bozulması (aşırı sarı, soluk, aşırı doygun), \
kırpılmış ya da eksik tablo, ya da görsel eserin kendisi değil (başka eser, kopya, gravür).

"supheli": karar vermek için yeterince emin değilsen. Her ayrıntı kırpımının yanında gerçek piksel boyutu ve telefonda \
kaç kat büyütüleceği yazıyor: 3 katın üstü genellikle belirgin bozulma demektir, ama keskin bir taramada 2-3 kat sorun \
olmayabilir; kırpımın kendisine bak. Açıklamayı Türkçe, kısa yaz."""


def istek_govdesi(k):
    icerik = [{"type": "text", "text": (
        f"Eser: {k['eser']}" + (f" ({k['eser_tr']})" if k["eser_tr"] else "") + f", {k['yil'] or '?'}\n"
        f"Sanatçı: {k['sanatci']} ({k['akim']})\nEn büyük kopyanın boyutu: {k['boyut'][0]}×{k['boyut'][1]} px"
        + ("" if k["buyuk_var"] else " (daha büyük kopyası yok)") + "\n\nBütün tablo:")}]

    def resim(ad):
        return {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg",
                                            "data": base64.b64encode((CALISMA / ad).read_bytes()).decode()}}
    icerik.append(resim(k["butun"]))
    for a in k["ayrintilar"]:
        icerik.append({"type": "text", "text": f"Ayrıntı \"{a['ad']}\": {a['piksel'][0]}×{a['piksel'][1]} px, "
                                               f"telefonda yaklaşık {a['buyutme']} kat büyütülür."})
        icerik.append(resim(a["dosya"]))
    return {
        "model": MODEL, "max_tokens": 8000, "system": TALIMAT,
        "output_config": {"effort": "medium", "format": {"type": "json_schema", "schema": SEMA}},
        "messages": [{"role": "user", "content": icerik}],
    }


def jeton_tahmini(k):
    def g(ad):
        return min(1600, (lambda w, h: w * h / 750)(*boyut(CALISMA / ad)))
    return 900 + g(k["butun"]) + sum(g(a["dosya"]) + 40 for a in k["ayrintilar"])


def anahtar():
    a = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not a:
        sys.exit("ANTHROPIC_API_KEY yok. Terminal'de önce: export ANTHROPIC_API_KEY=... (Console → API keys)")
    return a


def api(yol, govde=None, yontem=None):
    r = urllib.request.Request(API + yol, data=None if govde is None else json.dumps(govde).encode(),
                               method=yontem or ("POST" if govde is not None else "GET"),
                               headers={"x-api-key": anahtar(), "anthropic-version": SURUM,
                                        "content-type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=600) as y:
            return y.read().decode()
    except urllib.error.HTTPError as h:
        sys.exit(f"API hatası {h.code}: {h.read().decode()[:800]}")


def gonder(args):
    istekler = oku(ISTEK)
    giris = sum(jeton_tahmini(k) for k in istekler)
    cikis = TAHMINI_CIKIS * len(istekler)
    dolar = giris / 1e6 * GIRIS_FIYAT + cikis / 1e6 * CIKIS_FIYAT
    print(f"{len(istekler)} eser · tahmini {giris / 1000:.0f}K giriş + {cikis / 1000:.0f}K çıkış jetonu ≈ {dolar:.2f} $")
    if not args.evet and input("Gönderilsin mi? (e/h) ").strip().lower() not in ("e", "evet", "y"):
        return
    anahtar()
    # Toplu isteğin üst sınırı 256 MB; eser başına ~1,2 MB görsel olduğundan 40'lık parçalar halinde
    idler = []
    for i in range(0, len(istekler), 40):
        govde = {"requests": [{"custom_id": k["id"], "params": istek_govdesi(k)} for k in istekler[i:i + 40]]}
        idler.append(json.loads(api("/messages/batches", govde))["id"])
        print(f"  gönderildi: {idler[-1]} ({min(i + 40, len(istekler))}/{len(istekler)})")
    KAYIT.write_text(json.dumps({"idler": idler, "gonderildi": time.strftime("%Y-%m-%d %H:%M"),
                                 "tahmin": round(dolar, 2)}, indent=1), encoding="utf-8")
    print("Birkaç dakika–birkaç saat sürer. Sonra: python3 scripts/fable_denetim.py al")


def al(args):
    k = oku(KAYIT)
    satirlar = []
    for bid in k["idler"]:
        t = json.loads(api(f"/messages/batches/{bid}"))
        if t["processing_status"] != "ended":
            print(f"Henüz bitmedi ({bid}): {t['request_counts']}. Biraz sonra yeniden dene.")
            return
        satirlar += api(f"/messages/batches/{bid}/results").splitlines()
    istekler = {x["id"]: x for x in oku(ISTEK)}
    sonuc = oku(SONUC) if SONUC.exists() else {}
    giris = cikis = 0
    for s in filter(None, satirlar):
        r = json.loads(s)
        sid, res = r["custom_id"], r["result"]
        if res["type"] != "succeeded":
            sonuc[sid] = {"karar": "hata", "aciklama": json.dumps(res)[:300]}
            continue
        m = res["message"]
        giris += m["usage"].get("input_tokens", 0)
        cikis += m["usage"].get("output_tokens", 0)
        if m.get("stop_reason") == "refusal":
            sonuc[sid] = {"karar": "hata", "aciklama": "model yanıtlamadı (refusal)"}
            continue
        metin = "".join(b.get("text", "") for b in m["content"] if b["type"] == "text")
        try:
            sonuc[sid] = json.loads(metin)
        except ValueError:
            sonuc[sid] = {"karar": "hata", "aciklama": metin[:300]}
        sonuc[sid]["boyut"] = istekler.get(sid, {}).get("boyut")
    SONUC.write_text(json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
    dolar = giris / 1e6 * GIRIS_FIYAT + cikis / 1e6 * CIKIS_FIYAT
    sayac = {}
    for v in sonuc.values():
        sayac[v["karar"]] = sayac.get(v["karar"], 0) + 1
    print(f"Bitti. Gerçek: {giris / 1000:.0f}K giriş + {cikis / 1000:.0f}K çıkış ≈ {dolar:.2f} $ "
          f"(eser başına {dolar / max(1, len(satirlar)):.3f} $). Kararlar: {sayac}")
    sayfa(istekler, sonuc)


def sayfa(istekler, sonuc):
    sira = {"degistir": 0, "supheli": 1, "hata": 2, "iyi": 3}
    kartlar = []
    for sid, v in sorted(sonuc.items(), key=lambda x: (sira.get(x[1]["karar"], 9), x[0])):
        k = istekler.get(sid, {})
        resimler = "".join(f'<img src="calisma/{html.escape(a["dosya"])}" title="{html.escape(a["ad"])}">'
                           for a in k.get("ayrintilar", []))
        kartlar.append(
            f'<section class="{v["karar"]}"><h2>{html.escape(k.get("sanatci", sid))} · '
            f'<i>{html.escape(k.get("eser", ""))}</i></h2><p><b>{v["karar"]}</b> · '
            f'{", ".join(v.get("sorunlar", []))} · {html.escape(v.get("aciklama", ""))}</p>'
            f'<div><img class="b" src="calisma/{html.escape(k.get("butun", ""))}">{resimler}</div></section>')
    SAYFA.write_text(
        "<!doctype html><meta charset=utf-8><title>Fable görsel denetimi</title><style>"
        "body{font:15px system-ui;background:#1d1a17;color:#efe7da;margin:20px}section{margin:0 0 28px;padding:12px;"
        "border-radius:10px;background:#26221e}.degistir{border-left:6px solid #c0503a}.supheli{border-left:6px solid "
        "#d8b36a}.iyi{border-left:6px solid #4c8a5f}img{height:220px;margin:4px;border-radius:4px}img.b{height:320px}"
        "</style><h1>Fable görsel denetimi</h1>" + "".join(kartlar), encoding="utf-8")
    print(f"İnceleme sayfası: {SAYFA.relative_to(KOK)}")
    if shutil.which("open"):
        subprocess.run(["open", str(SAYFA)])


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    alt = p.add_subparsers(dest="komut", required=True)
    h = alt.add_parser("hazirla")
    h.add_argument("--dene", type=int, default=0, help="yalnız bu kadar eser (önce Ingres ve bilinen sorunlular)")
    g = alt.add_parser("gonder")
    g.add_argument("--evet", action="store_true", help="onay sorma")
    alt.add_parser("al")
    a = p.parse_args()
    {"hazirla": hazirla, "gonder": gonder, "al": al}[a.komut](a)


if __name__ == "__main__":
    main()
