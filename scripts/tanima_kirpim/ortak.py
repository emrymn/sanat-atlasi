"""Tanıma kırpımları (İş 193) için ortak yardımcılar: veri okuma ve uygulamadaki görselin yerel adı."""
import json
import unicodedata
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
VERI = KOK / 'data' / 'tanima_kirpimlari.json'


def oku(yol):
    with open(yol, encoding='utf-8') as f:
        return json.load(f)


_onbellek = _yerel = _cikar = None


def _yukle():
    global _onbellek, _yerel, _cikar
    if _onbellek is None:
        _onbellek = oku(KOK / 'data' / 'eserler_onbellek.json')['sanatcilar']
        _yerel = oku(KOK / 'data' / 'yerel_gorseller.json')['gorseller']
        try:
            _cikar = oku(KOK / 'data' / 'eser_duzeltmeleri.json').get('gorsel_cikar', {})
        except (OSError, ValueError):
            _cikar = {}


def eser_bul(sanatci, anahtar):
    """js/basyapit.js eserEslestir gibi: QID ya da "sanatçı|başlık" anahtarıyla önbellekteki eser"""
    _yukle()
    for x in _onbellek.get(sanatci, {}).get('eserler', []):
        if (x.get('qid') and x['qid'] == anahtar) or f"{sanatci}|{x.get('baslik')}" == anahtar:
            return x
    return None


def ilk_gorsel(sanatci, anahtar):
    """Uygulamadaki ilk görsel (gorsel_cikar uygulanmış) ve yerel adı: (gorsel, ad) ya da (None, None)"""
    _yukle()
    e = eser_bul(sanatci, anahtar)
    if not e:
        return None, None
    normal = lambda a: unicodedata.normalize('NFC', str(a).replace(' ', '_').lower())
    atilan = {normal(a) for a in _cikar.get(sanatci, {}).get(e.get('qid') or '', [])}
    gl = [x for x in e.get('gorseller', []) if not (x.get('k') == 'commons' and normal(x.get('d', '')) in atilan)]
    if not gl:
        return None, None
    g = gl[0]
    anahtar_g = f"{g.get('k')}:{g.get('d') or g.get('i') or g.get('u') or ''}"
    return g, _yerel.get(anahtar_g) or anahtar_g


def eser_adi(sanatci, anahtar):
    e = eser_bul(sanatci, anahtar)
    if not e:
        return anahtar
    return e.get('tr') or e.get('ad') or e.get('baslik') or anahtar
