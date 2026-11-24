#!/usr/bin/env python3
"""Bugün (ana ekran) açılış karesini Fable'a seçtirir: tablonun hangi noktası ortalansın, gerekirse ne kadar yakınlaşılsın.

Açılış karesi (js/yuruyus.js yuruyusBaslat, ACILIS_Y): tablo telefonu kaplar (yakin ile çarpılır); odak noktası yatayda
ortaya, dikeyde ekranın %36'sına gelir; resim ekranı hep kapladığı için kenara yakın odak oraya kadar gidemez. Altta
sanatçının adı, eserin adı ve düğmeler var. Odak önceliği (js/gorsel.js adlaOdak): Emre'nin elle seçtiği > bu dosya
(data/yuruyus_odak.json) > otomatik yüz odağı (data/gorsel_odak.json) > [50, 40].

Elle odak (Emre, 2026-11-24: "elle odağı da değiştirebilsin"): elle odağı olan eser de Fable'a gider, şu anki kare elle
odaktan çizilir. Fable değiştirirse ve sen reddetmezsen `uygula` data/gorsel_odak_elle.json'daki noktayı Fable'ınkiyle
değiştirir (elle odak her ekranda önde olduğundan başka türlü Bugün'e geçmez; Galeri gibi kırpılan yerler de bu noktayı
kullanır). Telefonda bu cihazda işaretlenen odaklar (Ayarlar → Elle odaklar) hepsinin önündedir; Fable'ınkiler görünsün
diye onlar telefonda silinmeli.

Fable'a tablonun bütünü ve şu anki açılış karesi gider; odak (x, y yüzde) ve yakin (1–1,8) döner ya da "şu anki iyi" der.
İnceleme sayfası eski ve yeni kareyi telefon çerçevesinde yan yana gösterir; beğenmediğini --reddet ile çıkarırsın.

Çalıştır (depo kökünde):
  export ANTHROPIC_API_KEY=...
  python3 scripts/fable_odak.py hazirla             # Fable'ın değiştirdiği eserler (fable_degistir secimler.json)
  python3 scripts/fable_odak.py hazirla --hepsi     # ya da yürüyüşü olan bütün eserler
  python3 scripts/fable_odak.py gonder              # tahmini maliyet + onay
  python3 scripts/fable_odak.py al                  # bitince sonuçları alır, inceleme sayfasını açar
  python3 scripts/fable_odak.py al --reddet id1,id2 # beğenmediklerini çıkar
  python3 scripts/fable_odak.py uygula              # data/yuruyus_odak.json güncellenir
  npm run test:unit && git add data/yuruyus_odak.json && git commit -m "Bugün: Fable açılış odakları" && git push
"""
import argparse
import base64
import html
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fable_denetim as d  # noqa: E402  (ortak: api, anahtar, indir, boyut, kirp_kucult, adresler, MODEL)

KOK = d.KOK
KLASOR = d.KLASOR / "odak"
LISTE = KLASOR / "liste.json"
KAYIT = KLASOR / "toplu.json"
SONUC = KLASOR / "sonuc.json"
SAYFA = KLASOR / "inceleme.html"
SECIMLER = d.KLASOR / "secimler.json"  # fable_degistir.py
W, H = 390, 844  # iPhone ekranı (pt)
ACILIS_Y = 0.36  # js/yuruyus.js
YAZI_PAYI = 0.40  # alttan: sanatçı adı, eser adı, düğmeler
YAKIN_EN_COK = 1.8


def oku(yol, varsayilan=None):
    return json.loads(Path(yol).read_text(encoding="utf-8")) if Path(yol).exists() else varsayilan


def yaz(yol, veri):
    Path(yol).write_text(json.dumps(veri, ensure_ascii=False, indent=1), encoding="utf-8")


def kare(IW, IH, kirp, odak, yakin):
    """Açılış karesinin resimdeki kutusu (piksel: x, y, w, h); js/yuruyus.js'deki kamera ile aynı hesap (eğim payı yok)"""
    kx, ky, kw, kh = kirp
    s = max(W / (kw * IW), H / (kh * IH)) * yakin
    gw, gh = W / s, H / s
    x = odak[0] / 100 * IW - gw / 2
    y = odak[1] / 100 * IH - gh * ACILIS_Y
    x = min(max(x, kx * IW), (kx + kw) * IW - gw)
    y = min(max(y, ky * IH), (ky + kh) * IH - gh)
    return x, y, gw, gh


def simdiki_odak(gorsel, odak_dosyasi, otomatik, elle):
    for kaynak, o in (("elle", elle.get(gorsel)), ("yürüyüş denetimi", odak_dosyasi["odak"].get(gorsel)),
                      ("otomatik yüz odağı", otomatik.get(gorsel))):
        if isinstance(o, list) and len(o) == 2:
            return o, kaynak
    return [50, 40], "varsayılan"


def hazirla(args):
    KLASOR.mkdir(parents=True, exist_ok=True)
    yur = oku(KOK / "data" / "yuruyus.json")["eserler"]
    kaynak = oku(KOK / "data" / "gorsel_kaynagi.json")
    odak_dosyasi = oku(KOK / "data" / "yuruyus_odak.json")
    otomatik = oku(KOK / "data" / "gorsel_odak.json")["odak"]
    elle = oku(KOK / "data" / "gorsel_odak_elle.json")["odak"]
    if args.idler:
        hedef = [s.strip() for s in args.idler.split(",") if s.strip()]
    elif args.hepsi:
        hedef = [s for s, e in yur.items() if e.get("noktalar")]
    else:
        secim = oku(SECIMLER, {})
        hedef = [s for s, v in secim.items() if not v.get("reddedildi") and v.get("secim", "")[:1] in ("A", "B")]
        if not hedef:
            sys.exit("secimler.json'da uygulanmış seçim yok; --hepsi ya da --idler kullan.")
    liste = []
    for i, sid in enumerate(hedef, 1):
        e = yur.get(sid)
        if not e:
            print(f"{sid}: yürüyüşte yok, atlandı")
            continue
        g = e["gorsel"]
        kucuk, _ = d.adresler(sid, e, kaynak)
        ham = KLASOR / f"{sid}.jpg"
        if not d.indir(kucuk, ham):
            continue
        IW, IH = d.boyut(ham)
        kirp = e.get("kirp") or odak_dosyasi["kirp"].get(g) or [0, 0, 1, 1]
        odak, nereden = simdiki_odak(g, odak_dosyasi, otomatik, elle)
        yakin = float(odak_dosyasi["yakin"].get(g) or 1)
        x, y, gw, gh = kare(IW, IH, kirp, odak, yakin)
        d.kirp_kucult(ham, KLASOR / f"{sid}-kare.jpg", (int(x), int(y), int(gw), int(gh)), 900)
        liste.append({"id": sid, "sanatci": sid, "eser": e.get("eser"), "yil": e.get("yil"), "gorsel": g,
                      "boyut": [IW, IH], "kirp": kirp, "odak": odak, "nereden": nereden, "yakin": yakin,
                      "ayrintilar": [p["ad"] for p in e.get("noktalar") or []]})
        print(f"[{i}/{len(hedef)}] {sid}: {IW}×{IH}, şu anki odak {odak} ({nereden})")
    yaz(LISTE, liste)
    print(f"\nHazır: {len(liste)} eser. Şimdi: python3 scripts/fable_odak.py gonder")


SEMA = {
    "type": "object",
    "properties": {
        "simdiki_iyi": {"type": "boolean", "description": "şu anki açılış karesi zaten iyiyse true"},
        "odak_x": {"type": "integer", "description": "0–100, tablonun solundan yüzde"},
        "odak_y": {"type": "integer", "description": "0–100, tablonun üstünden yüzde"},
        "yakin": {"type": "number", "description": "1.0 (yakınlaşma yok) … 1.8"},
        "ana_konu": {"type": "string", "description": "açılış karesinde görünmesi gereken ana konu, Türkçe kısa"},
        "aciklama": {"type": "string", "description": "Türkçe, en çok iki cümle"},
    },
    "required": ["simdiki_iyi", "odak_x", "odak_y", "yakin", "ana_konu", "aciklama"],
    "additionalProperties": False,
}

TALIMAT = f"""Bir sanat tarihi çalışma uygulamasının ana ekranında her gün bir tablo, dikey bir telefonu ({W}×{H} pt) \
tamamen kaplayacak kadar büyütülerek gösteriliyor. Senden bu açılış karesinin hangi noktaya ortalanacağına karar vermeni \
istiyorum.

Ekranın kuralları:
- Tablo ekranı kaplayacak kadar büyütülür (yatay bir tabloda yalnız bir dikey şerit görünür), yakin ile ayrıca çarpılır.
- Seçtiğin odak noktası yatayda ekranın ortasına, dikeyde ekranın üstünden %36'sına gelir.
- Tablo ekranı hep kaplar: odak kenara yakınsa kare kenarda durur, odak o konuma kadar gidemez.
- Ekranın alttan yaklaşık %{round(YAZI_PAYI * 100)}'ı koyu bir geçişin üstünde sanatçının büyük adı, eserin adı ve \
düğmelerle kaplı; oradaki şey zor görünür. Üstteki ince şerit saat ve sekme başlığıdır.

İyi bir açılış karesi: tablonun ana konusu (ana figürün yüzü, sahnenin odak noktası, kompozisyonun kalbi) ekranın üst ve \
orta kısmında, kafalar kesilmeden görünür; tablo ilk bakışta tanınır. Yakınlaşma (yakin > 1) yalnız ana konu küçük \
kalıyorsa ya da yazının arkasına düşüyorsa kullanılır; görsel yaklaşık 1280 piksel olduğu için 1.5'in üstü bulanıklaşabilir.

Sana tablonun bütünü ve şu anki açılış karesi (ekranda görünen kısım; alttaki %{round(YAZI_PAYI * 100)}'ı yazının \
altında kalır) gösteriliyor. Şu anki kare iyiyse simdiki_iyi: true de ve şu anki değerleri aynen yaz. Koordinatları \
tablonun bütününe göre yüzde olarak ver. Açıklamayı Türkçe, kısa yaz."""


def istek_govdesi(k):
    def resim(yol):
        return {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg",
                                            "data": base64.b64encode(Path(yol).read_bytes()).decode()}}
    yon = "yatay" if k["boyut"][0] > k["boyut"][1] else "dikey"
    IW, IH = k["boyut"]

    def pencere(yakin):
        _, _, gw, gh = kare(IW, IH, k["kirp"], [50, 50], yakin)
        return f"en %{gw / IW * 100:.0f}, boy %{gh / IH * 100:.0f}"
    c = [{"type": "text", "text": f"Eser: {k['eser']} ({k.get('yil') or '?'}), sanatçı: {k['sanatci']}\n"
                                  f"Görsel {IW}×{IH} px ({yon}). Ekranda görünen kısım: {pencere(1)} "
                                  f"(yakin=1.3 ile {pencere(1.3)}); %100 görünen yönde odak o yönde kareyi kaydıramaz. "
                                  f"Yürüyüşteki ayrıntılar: {', '.join(k['ayrintilar'])}\n\nTablonun bütünü:"},
         resim(KLASOR / f"{k['id']}.jpg"),
         {"type": "text", "text": f"Şu anki açılış karesi: odak x={k['odak'][0]}, y={k['odak'][1]} ({k['nereden']}), "
                                  f"yakin={k['yakin']}:"},
         resim(KLASOR / f"{k['id']}-kare.jpg")]
    return {"model": d.MODEL, "max_tokens": 8000, "system": TALIMAT,
            "output_config": {"effort": "medium", "format": {"type": "json_schema", "schema": SEMA}},
            "messages": [{"role": "user", "content": c}]}


def gonder(args):
    liste = oku(LISTE, [])
    if not liste:
        sys.exit("Liste boş (önce: hazirla).")
    giris = sum(2500 + sum(min(1600, (lambda w, h: w * h / 750)(*d.boyut(f)))
                           for f in (KLASOR / f"{k['id']}.jpg", KLASOR / f"{k['id']}-kare.jpg")) for k in liste)
    cikis = 2500 * len(liste)
    dolar = giris / 1e6 * d.GIRIS_FIYAT + cikis / 1e6 * d.CIKIS_FIYAT
    print(f"{len(liste)} eser · tahmini {giris / 1000:.0f}K giriş + {cikis / 1000:.0f}K çıkış ≈ {dolar:.2f} $")
    if not args.evet and input("Gönderilsin mi? (e/h) ").strip().lower() not in ("e", "evet", "y"):
        return
    d.anahtar()
    # Emre (2026-11-24, 145 eser): 30'luk paket (~50 MB) yüklenirken bağlantı koptu ("Broken pipe"). Artık 10'luk
    # paketler; her paket üç kez denenir ve gönderilen her paket hemen kaydedilir: yarıda kalırsa `gonder` yeniden
    # çalıştırılınca yalnız gönderilmeyenler gider (aynı liste için).
    k0 = oku(KAYIT, {})
    ayni = k0.get("liste") == [k["id"] for k in liste] and not k0.get("tamam")
    idler = list(k0.get("idler", [])) if ayni else []
    gonderilen = set(k0.get("gonderilen", [])) if ayni else set()
    kalan = [k for k in liste if k["id"] not in gonderilen]
    if gonderilen:
        print(f"  önceden gönderilen {len(gonderilen)} eser atlandı, {len(kalan)} kaldı")
    PAKET = 10
    for i in range(0, len(kalan), PAKET):
        parca = kalan[i:i + PAKET]
        govde = {"requests": [{"custom_id": k["id"], "params": istek_govdesi(k)} for k in parca]}
        for deneme in range(3):
            try:
                idler.append(json.loads(d.api("/messages/batches", govde))["id"])
                break
            except Exception as hata:
                if deneme == 2:
                    yaz(KAYIT, {"idler": idler, "liste": [k["id"] for k in liste], "gonderilen": sorted(gonderilen),
                                "tamam": False, "gonderildi": time.strftime("%Y-%m-%d %H:%M")})
                    sys.exit(f"Gönderilemedi ({hata}). Bağlantını kontrol edip yeniden çalıştır: python3 scripts/fable_odak.py "
                             "gonder — gönderilenler yeniden gitmez.")
                print(f"  bağlantı hatası ({hata}); {10 * (deneme + 1)} sn sonra yeniden deneniyor")
                time.sleep(10 * (deneme + 1))
        gonderilen |= {k["id"] for k in parca}
        yaz(KAYIT, {"idler": idler, "liste": [k["id"] for k in liste], "gonderilen": sorted(gonderilen),
                    "tamam": len(gonderilen) >= len(liste), "gonderildi": time.strftime("%Y-%m-%d %H:%M")})
        print(f"  gönderildi: {idler[-1]} ({len(gonderilen)}/{len(liste)})")
    print("Sonra (birkaç dakika–bir saat): python3 scripts/fable_odak.py al")


def al(args):
    sonuc = oku(SONUC, {})
    if not args.reddet or not sonuc:
        k = oku(KAYIT)
        if not k:
            sys.exit("Henüz gönderilmedi (önce: gonder).")
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
                sonuc[r["custom_id"]] = {"hata": json.dumps(res)[:300]}
                continue
            m = res["message"]
            giris += m["usage"].get("input_tokens", 0)
            cikis += m["usage"].get("output_tokens", 0)
            try:
                sonuc[r["custom_id"]] = json.loads("".join(b.get("text", "") for b in m["content"] if b["type"] == "text"))
            except ValueError:
                sonuc[r["custom_id"]] = {"hata": "yanıt okunamadı"}
        print(f"Gerçek: {giris / 1000:.0f}K giriş + {cikis / 1000:.0f}K çıkış ≈ "
              f"{giris / 1e6 * d.GIRIS_FIYAT + cikis / 1e6 * d.CIKIS_FIYAT:.2f} $")
    for sid in filter(None, (args.reddet or "").split(",")):
        if sid.strip() in sonuc:
            sonuc[sid.strip()]["reddedildi"] = True
    yaz(SONUC, sonuc)
    sayac = {}
    for v in sonuc.values():
        t = "hata" if "hata" in v else "reddedildi" if v.get("reddedildi") else "iyi" if v.get("simdiki_iyi") else "yeni"
        sayac[t] = sayac.get(t, 0) + 1
    print(f"Sonuç: {sayac}  (iyi: şu anki kare kalsın, yeni: Fable başka odak önerdi)")
    sayfa(sonuc)


def telefon(k, odak, yakin, baslik):
    """Açılış karesinin telefon çerçevesinde CSS ile canlandırması (yarı boy)"""
    IW, IH = k["boyut"]
    x, y, gw, gh = kare(IW, IH, k["kirp"], odak, yakin)
    o = 0.5 * W / gw  # ekran px / resim px (yarı boy)
    return (f'<figure><div class="tel"><img src="{html.escape(k["id"])}.jpg" style="width:{IW * o:.1f}px;'
            f'left:{-x * o:.1f}px;top:{-y * o:.1f}px"><i class="hedef" style="left:{(odak[0] / 100 * IW - x) * o:.1f}px;'
            f'top:{(odak[1] / 100 * IH - y) * o:.1f}px"></i><b>{html.escape(k["sanatci"])}</b></div>'
            f'<figcaption>{baslik}<br>odak {odak[0]}, {odak[1]} · yakın {yakin:g}</figcaption></figure>')


def sayfa(sonuc):
    bolumler = []
    for k in oku(LISTE, []):
        v = sonuc.get(k["id"])
        if not v:
            continue
        if "hata" in v:
            bolumler.append(f'<section class="hata"><h2>{html.escape(k["sanatci"])}</h2><p>hata: '
                            f'{html.escape(v["hata"])}</p></section>')
            continue
        yeni = [v["odak_x"], v["odak_y"]]
        sinif = "red" if v.get("reddedildi") else "iyi" if v["simdiki_iyi"] else "yeni"
        bolumler.append(
            f'<section class="{sinif}"><h2>{html.escape(k["sanatci"])} <small>{html.escape(k["eser"] or "")}</small></h2>'
            f'<p><b>{"REDDEDİLDİ · " if v.get("reddedildi") else ""}{"şu anki iyi" if v["simdiki_iyi"] else "yeni odak"}'
            f'</b> · ana konu: {html.escape(v["ana_konu"])}<br>{html.escape(v["aciklama"])}</p><div class="ikili">'
            + telefon(k, k["odak"], k["yakin"], f'şu anki ({html.escape(k["nereden"])})')
            + ("" if v["simdiki_iyi"] else telefon(k, yeni, max(1.0, min(YAKIN_EN_COK, v["yakin"])), "Fable"))
            + f'<figure><img class="butun" src="{html.escape(k["id"])}.jpg"><figcaption>bütün tablo</figcaption>'
            f'</figure></div></section>')
    SAYFA.write_text(
        "<!doctype html><meta charset=utf-8><title>Fable açılış odakları</title><style>body{font:15px system-ui;"
        "background:#1d1a17;color:#efe7da;margin:20px}section{margin:0 0 28px;padding:12px;border-radius:10px;"
        "background:#26221e}.yeni{border-left:6px solid #d8b36a}.iyi{border-left:6px solid #4c8a5f}.red,.hata{opacity:.5;"
        "border-left:6px solid #777}.ikili{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start}figure{margin:0}"
        f".tel{{position:relative;width:{W // 2}px;height:{H // 2}px;overflow:hidden;border-radius:22px;"
        "border:3px solid #444;background:#000}.tel img{position:absolute;max-width:none}.tel::after{content:'';"
        f"position:absolute;left:0;right:0;bottom:0;height:{YAZI_PAYI * 100:.0f}%;background:linear-gradient(transparent,"
        "rgba(0,0,0,.75) 45%)}.tel b{position:absolute;z-index:1;left:12px;bottom:60px;font:600 26px Georgia,serif;"
        "color:#fff}.hedef{position:absolute;width:14px;height:14px;margin:-7px;border:2px solid #ffd76a;"
        f"border-radius:50%;z-index:1}}.butun{{height:{H // 2}px;border-radius:4px}}small{{opacity:.6;font-weight:400}}"
        "</style><h1>Fable açılış odakları</h1><p>Sarı halka odak noktası; alttaki koyu alan adın ve düğmelerin yeri. "
        "Beğenmediklerini çıkar: <code>python3 scripts/fable_odak.py al --reddet id1,id2</code> · sonra "
        "<code>uygula</code></p>" + "".join(bolumler), encoding="utf-8")
    print(f"İnceleme sayfası: {SAYFA.relative_to(KOK)}")
    if shutil.which("open"):
        subprocess.run(["open", str(SAYFA)])


def uygula(args):
    sonuc = oku(SONUC, {})
    liste = {k["id"]: k for k in oku(LISTE, [])}
    yur = oku(KOK / "data" / "yuruyus.json")["eserler"]
    elle_yol = KOK / "data" / "gorsel_odak_elle.json"
    elle_veri = oku(elle_yol)
    elle = elle_veri["odak"]
    yol = KOK / "data" / "yuruyus_odak.json"
    veri = oku(yol)
    degisen, elle_degisen = [], []
    for sid, v in sonuc.items():
        k = liste.get(sid)
        if not k or "hata" in v or v.get("reddedildi") or v.get("simdiki_iyi"):
            continue
        g = k["gorsel"]
        if yur.get(sid, {}).get("gorsel") != g:
            print(f"{sid}: görsel değişmiş, atlandı")
            continue
        x, y = min(100, max(0, int(v["odak_x"]))), min(100, max(0, int(v["odak_y"])))
        yakin = round(max(1.0, min(YAKIN_EN_COK, float(v["yakin"]))), 2)
        veri["odak"][g] = [x, y]
        if g in elle:  # elle odak önde: Bugün'e ancak o nokta değişirse geçer
            elle[g] = [x, y]
            elle_degisen.append(sid)
        if yakin > 1.01:
            veri["yakin"][g] = yakin
        else:
            veri["yakin"].pop(g, None)
        veri.setdefault("sanatcilar", {})[g] = sid
        degisen.append(f"{sid} ({x}, {y}{f', ×{yakin:g}' if yakin > 1.01 else ''})")
    if not degisen:
        print("Uygulanacak odak yok.")
        return
    yol.write_text(json.dumps(veri, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    if elle_degisen:
        elle_yol.write_text(json.dumps(elle_veri, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"{len(degisen)} eserin açılış odağı yazıldı: {', '.join(degisen)}")
    if elle_degisen:
        print(f"Bunların {len(elle_degisen)} tanesinin elle odağı da değişti (data/gorsel_odak_elle.json): "
              f"{', '.join(elle_degisen)}")
    print('Sonra: npm run test:unit && git add data/yuruyus_odak.json data/gorsel_odak_elle.json && '
          'git commit -m "Bugün: Fable açılış odakları" && git push')


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    alt = p.add_subparsers(dest="komut", required=True)
    h = alt.add_parser("hazirla")
    h.add_argument("--hepsi", action="store_true", help="yürüyüşü olan bütün eserler")
    h.add_argument("--idler", default="", help="virgülle ayrılmış sanatçı kimlikleri")
    g = alt.add_parser("gonder")
    g.add_argument("--evet", action="store_true")
    a = alt.add_parser("al")
    a.add_argument("--reddet", default="", help="virgülle ayrılmış sanatçı kimlikleri")
    alt.add_parser("uygula")
    x = p.parse_args()
    {"hazirla": hazirla, "gonder": gonder, "al": al, "uygula": uygula}[x.komut](x)


if __name__ == "__main__":
    main()
