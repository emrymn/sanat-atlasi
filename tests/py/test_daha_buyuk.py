"""İş 173: daha büyük görsel betiklerinin ağsız sınanabilen parçaları.

Çalıştır (depo kökünde): python3 -m unittest discover -s tests/py -v
Betikler macOS'taki `sips` ile görsel işler; burada yalnız aday seçimi, süzgeçler ve sorgular sınanır (ağ yok).
"""
import sys
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
import daha_buyuk as db  # noqa: E402
import devasa_indir as di  # noqa: E402
import kalite_tara as kt  # noqa: E402

TABAN = 'https://www.artic.edu/iiif/2/x'


class AicIzinliBoylar(unittest.TestCase):
    def test_yalniz_izinli_genislikler_istenir(self):
        for olcu in [(5257, 6464), (6464, 5257), (1646, 2250), None]:
            for a in di.aic_iiif_adaylari(TABAN, olcu):
                self.assertRegex(a['u'], r'/full/(3000|1686|843),/0/default\.jpg$')

    def test_dikey_eserde_genislik_orana_gore_hesaplanmaz(self):
        # eski kod 5257×6464'te `2440,` istiyordu: AIC 403 veriyor
        a = di.aic_iiif_adaylari(TABAN, (5257, 6464))
        self.assertEqual([x['u'].split('/full/')[1] for x in a], ['3000,/0/default.jpg', '1686,/0/default.jpg', '843,/0/default.jpg'])
        self.assertEqual(a[0]['boy'], 3000)  # sunucu uzun kenarı 3000'e sığdırır (2440×3000)

    def test_ozgunden_buyuk_beklenmez(self):
        a = di.aic_iiif_adaylari(TABAN, (1646, 2250))
        self.assertEqual([x['boy'] for x in a], [2250, 1686, 843])

    def test_boy_bilinmiyorsa(self):
        self.assertEqual([x['boy'] for x in di.aic_iiif_adaylari(TABAN)], [None, 1686, 843])

    def test_aic_aday_izinli_boylari_kullanir(self):
        yanit = {'data': {'is_public_domain': True, 'image_id': 'abc', 'thumbnail': {'width': 4000, 'height': 5000}}}
        with mock.patch.object(di, 'json_getir', return_value=yanit):
            a = di.aic_aday(no='123')
        self.assertEqual(a[0]['u'], 'https://www.artic.edu/iiif/2/abc/full/3000,/0/default.jpg')

    def test_kamu_mali_degilse_aday_yok(self):
        yanit = {'data': {'is_public_domain': False, 'image_id': 'abc'}}
        with mock.patch.object(di, 'json_getir', return_value=yanit):
            self.assertEqual(di.aic_aday(no='123'), [])

    def test_nga_degismedi(self):
        a = di.iiif_adaylari('https://nga/iiif/y', (23235, 23968))
        self.assertEqual(a[0]['u'], 'https://nga/iiif/y/full/!4096,4096/0/default.jpg')


class Suzgecler(unittest.TestCase):
    def test_yeterince_buyuk(self):
        self.assertTrue(db.yeterince_buyuk(3000, 843))
        self.assertFalse(db.yeterince_buyuk(1000, 0))  # r2_yukle 1600 altını yüklemez
        self.assertFalse(db.yeterince_buyuk(2000, 1700))  # 1,25 kat değil
        self.assertTrue(db.yeterince_buyuk(1600, 768))
        self.assertTrue(db.yeterince_buyuk(1600, 0))
        self.assertFalse(db.yeterince_buyuk(None, 800))

    def test_oran(self):
        self.assertTrue(db.oran_uyar((2440, 3000), 2440 / 3000))
        self.assertTrue(db.oran_uyar((1000, 1020), 1.0))
        self.assertFalse(db.oran_uyar((1000, 1100), 1.0))  # ayrıntı / çerçeveli çekim
        self.assertFalse(db.oran_uyar((1000, 1000), None))  # oran bilinmiyorsa alınmaz

    def test_gorsel_anahtari(self):
        self.assertEqual(db.gorsel_anahtari({'k': 'commons', 'd': 'A.jpg'}), 'commons:A.jpg')
        self.assertEqual(db.gorsel_anahtari({'k': 'aic', 'i': 'abc'}), 'aic:abc')


class Smk(unittest.TestCase):
    def test_sorgu_yalniz_smk_koleksiyonundaki_numara(self):
        s = db.smk_sorgusu(['Q1', 'Q2'])
        self.assertIn('VALUES ?eser { wd:Q1 wd:Q2 }', s)
        self.assertIn('pq:P195 wd:Q671384', s)

    def test_aday_secimi(self):
        it = {'object_number': 'KMSsp10', 'public_domain': True, 'has_image': True,
              'image_native': 'https://api.smk.dk/api/v1/thumbnail/x.jpg', 'image_width': 1275, 'image_height': 1600}
        self.assertEqual(db.smk_aday_sec({'items': [it]}, 'KMSsp10'), {'u': it['image_native'], 'boy': 1600})
        self.assertIsNone(db.smk_aday_sec({'items': [it]}, 'KMSsp1'))  # numara birebir aynı olmalı
        self.assertIsNone(db.smk_aday_sec({'items': [dict(it, public_domain=False)]}, 'KMSsp10'))
        self.assertIsNone(db.smk_aday_sec({'items': [dict(it, has_image=False)]}, 'KMSsp10'))
        self.assertIsNone(db.smk_aday_sec(None, 'KMSsp10'))


class Deneme(unittest.TestCase):
    """--dene: indirmeden en büyük uygun aday seçilir."""

    def test_en_buyuk_uygun_aday(self):
        a = [{'u': 'a', 'boy': 843}, {'u': 'b', 'boy': 3000}, {'u': 'c', 'boy': 1686}]
        self.assertEqual(db.dene_ve_koy('ad', a, 'aic', None, 0.8, 843, dene=True), ('bulunur', 3000))

    def test_kaynak_da_kucuk(self):
        a = [{'u': 'a', 'boy': 843}]
        self.assertEqual(db.dene_ve_koy('ad', a, 'aic', None, 0.8, 843, dene=True), ('kucuk', None))

    def test_aday_yok(self):
        self.assertEqual(db.dene_ve_koy('ad', [], 'smk', None, 0.8, 800, dene=True), ('yok', None))

    def test_4096_ustu_kucultulecek_sayilir(self):
        a = [{'u': 'a', 'boy': 7000}]
        self.assertEqual(db.dene_ve_koy('ad', a, 'smk', None, 1.0, 800, dene=True), ('bulunur', 4096))


class CommonsTemsil(unittest.TestCase):
    """kalite_tara: Commons'ta eseri temsil eden (P6243) dosyalar."""

    def test_sonuclar_saklanir(self):
        yanit = {'query': {'pages': {'1': {'title': 'File:Bir eser.jpg', 'imageinfo': [{'width': 4000, 'height': 3000, 'thumburl': 't'}]}}}}
        bellek, kayit = {}, []
        with mock.patch.object(kt, 'api', return_value=yanit) as api:
            self.assertEqual(kt.temsil_dosyalari('Q5', bellek, lambda: kayit.append(1)), {'Bir_eser.jpg': [4000, 3000, 't']})
            self.assertIn('haswbstatement:P6243=Q5', api.call_args[0][0]['gsrsearch'])
            kt.temsil_dosyalari('Q5', bellek, lambda: kayit.append(1))
            self.assertEqual(api.call_count, 1)  # ikinci kez sorulmaz
        self.assertEqual(kayit, [1])

    def test_bos_sonuc_da_saklanir(self):
        bellek = {}
        with mock.patch.object(kt, 'api', return_value={'batchcomplete': ''}):
            self.assertEqual(kt.temsil_dosyalari('Q6', bellek, lambda: None), {})
        self.assertEqual(bellek, {'Q6': {}})

    def test_basarisiz_istek_saklanmaz(self):
        bellek = {}
        with mock.patch.object(kt, 'api', return_value={}):  # 429 ya da ağ hatası: api {} döner
            self.assertEqual(kt.temsil_dosyalari('Q7', bellek, lambda: None), {})
        self.assertEqual(bellek, {})

    def test_aday_suzgecinden_gecer(self):
        # P6243 adayları da aynı süzgeçten geçer: oran %5, en az 2000 px ve 1,25 kat
        adaylar = {'iyi.jpg': [4000, 3000, 't'], 'ayrinti.jpg': [3000, 3000, 't'], 'kucuk.jpg': [1500, 1125, 't']}
        self.assertEqual([x[1] for x in kt.uygun_adaylar(adaylar, 4 / 3, 1200)], ['iyi.jpg'])


if __name__ == '__main__':
    unittest.main()
