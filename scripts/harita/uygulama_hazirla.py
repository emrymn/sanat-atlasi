# Yeni harita (İş 41, Emre): seçilen dönem resimlerini, seviye sembollerini ve öğrenciyi uygulamaya hazırlar.
# Girdi: <dönem>_secim.json (resim, resim_gece, duraklar), cikti/<dönem>/sprite/sembol-N.webp ve karakter.webp.
# Çıktı: gorseller/harita/donem_<id>_<tur>.webp (1024×3072), sembol_<id>_<n>_<tur>.webp, ogrenci_<id>_<tur>.webp
# ve data/harita.json (durak yerleri, sembol ölçüleri, saklı motif kutuları ve hikâyeleri). Dosya adları eskilerinden
# farklı: gorseller/ önbelleği sürümden bağımsız, aynı adla değişen resim telefonda yenilenmez.
# Kullanım: python3 scripts/harita/uygulama_hazirla.py
import json
from pathlib import Path

import numpy as np
from PIL import Image

BURASI = Path(__file__).resolve().parent
KOK = BURASI.parents[1]
HEDEF = KOK / 'gorseller' / 'harita'
DONEMLER = ['ortacag', 'ronesans', 'barok', 'barok2', 'aydinlanma', 'romantik', 'empresyonizm', 'postempresyonizm', 'modern']
SEMBOL_PT, OGRENCI_PT = 56, 72  # ekrandaki yükseklik (390 pt genişlikte haritada)
OLCEK = 3  # iPhone ekranı 3 kat
SERIN = (0.72, 0.78, 0.95)  # Orta Çağ ve Rönesans gecesi: ay ışığı tonu (diğerleri secim.json'daki sıcak fener tonu)

# Saklı motifler: kutu [x0, y0, x1, y1] dönem resminin oranı (gündüz ve gece aynı yerde). Hikâye kaynağı: "bas"
# data/basyapitlar.json'daki başyapıt (sanatçı id + başlık), "eski" eski haritanın hikâyesi, yoksa aşağıdaki metin.
MOTIFLER = {
    'ortacag': [
        ([0.0, 0.12, 0.55, 0.21], {'bas': ('gentile-da-fabriano', 'Müneccimlerin Tapınması')}),
        ([0.0, 0.22, 0.42, 0.34], {'eski': 'Limbourg brothers, Très Riches Heures, February: snowy farmyard under an arched sky'}),
        ([0.0, 0.55, 0.38, 0.70], {'bas': ('duccio-di-buoninsegna', "İsa'nın Kudüs'e Girişi")}),
        ([0.0, 0.76, 0.40, 0.86], {'yeni': 'giotto-pelerin'}),
    ],
    'ronesans': [
        ([0.20, 0.0, 0.75, 0.07], {'yeni': 'elgreco-toledo'}),
        ([0.08, 0.15, 0.40, 0.23], {'bas': ('sofonisba-anguissola', 'Satranç Oynayan Sanatçının Kız Kardeşlerinin Portresi')}),
        ([0.05, 0.28, 0.40, 0.34], {'bas': ('michelangelo', "Âdem'in Yaratılışı")}),
        ([0.0, 0.35, 0.45, 0.53], {'yeni': 'bruegel-avcilar'}),
        ([0.58, 0.61, 0.85, 0.72], {'bas': ('quentin-metsys', 'Tefeci ve Karısı')}),
        ([0.0, 0.78, 0.50, 0.95], {'bas': ('domenico-di-michelino', "Dante'yi İlahi Komedya ile Gösteren Resim")}),
    ],
    'barok': [
        ([0.40, 0.0, 1.0, 0.09], {'yeni': 'vermeer-delft'}),
        ([0.0, 0.10, 0.45, 0.20], {'yeni': 'rembrandt-gece'}),
        ([0.55, 0.22, 0.95, 0.36], {'yeni': 'rubens-cardak'}),
        ([0.60, 0.55, 1.0, 0.68], {'yeni': 'velazquez-meninas'}),
        ([0.0, 0.66, 0.45, 0.78], {'yeni': 'reni-aurora'}),
        ([0.55, 0.75, 1.0, 0.86], {'yeni': 'caravaggio-matta'}),
    ],
    'barok2': [
        ([0.0, 0.30, 0.35, 0.42], {'yeni': 'piazzetta-rebeka'}),
        ([0.50, 0.66, 1.0, 0.77], {'bas': ('nicolas-poussin', "Arkadya'da Ben de Varım (Et in Arcadia ego)")}),
        ([0.0, 0.83, 0.70, 1.0], {'yeni': 'lorrain-senlik'}),
    ],
    'aydinlanma': [
        ([0.15, 0.12, 0.50, 0.21], {'bas': ('jacques-louis-david', 'Horas Kardeşlerin Yemini (Le Serment des Horaces)')}),
        ([0.58, 0.37, 0.82, 0.46], {'yeni': 'gainsborough-andrews'}),
        ([0.0, 0.57, 0.45, 0.70], {'bas': ('jean-honore-fragonard', "Salıncak (L'Escarpolette)")}),
    ],
    'romantik': [
        ([0.55, 0.08, 1.0, 0.15], {'bas': ('jean-francois-millet', 'Başak Toplayanlar (Des glaneuses)')}),
        ([0.05, 0.37, 0.40, 0.43], {'bas': ('john-everett-millais', 'Ophelia')}),
        ([0.0, 0.48, 0.40, 0.64], {'yeni': 'turner-yangin'}),
        ([0.55, 0.68, 0.95, 0.82], {'bas': ('caspar-david-friedrich', 'Sis Denizi Üzerinde Gezgin (Der Wanderer über dem Nebelmeer)')}),
    ],
    'empresyonizm': [
        ([0.0, 0.0, 0.45, 0.21], {'yeni': 'hiroshige-erik'}),
        ([0.45, 0.30, 1.0, 0.38], {'yeni': 'monet-kopru'}),
        ([0.0, 0.87, 0.42, 1.0], {'yeni': 'renoir-galette'}),
    ],
    'postempresyonizm': [
        ([0.05, 0.0, 0.22, 0.11], {'bas': ('gustav-klimt', 'Öpücük (Der Kuss)')}),
        ([0.05, 0.20, 0.48, 0.34], {'yeni': 'bocklin-ada'}),
        ([0.0, 0.37, 0.45, 0.53], {'bas': ('vincent-van-gogh', 'Yıldızlı Gece')}),
        ([0.55, 0.72, 0.95, 0.83], {'yeni': 'seurat-jatte'}),
    ],
    'modern': [
        ([0.32, 0.06, 0.62, 0.13], {'yeni': 'bacon-papa'}),
        ([0.0, 0.14, 0.33, 0.27], {'yeni': 'dali-bellek'}),
        ([0.66, 0.17, 0.90, 0.24], {'yeni': 'magritte-sapka'}),
        ([0.70, 0.37, 0.90, 0.48], {'yeni': 'duchamp-tekerlek'}),
        ([0.08, 0.58, 0.45, 0.68], {'yeni': 'picasso-muzisyen'}),
        ([0.0, 0.71, 0.35, 0.83], {'yeni': 'marc-atlar'}),
        ([0.0, 0.83, 0.30, 1.0], {'bas': ('edvard-munch', 'Çığlık (The Scream)')}),
    ],
}

# Başyapıtlarda ya da eski haritada olmayan eserlerin kısa hikâyesi
YENI = {
    'giotto-pelerin': dict(eser_tr='Aziz Franciscus Pelerinini Yoksul Bir Şövalyeye Veriyor', sanatci='Giotto di Bondone', yil='yaklaşık 1297–1299', yer='Aziz Franciscus Üst Bazilikası, Assisi', teknik='fresk',
        hikaye="Assisi'deki Aziz Franciscus döngüsünün sahnelerinden biri: genç Franciscus, yolda karşılaştığı yoksullaşmış bir şövalyeye kendi pelerinini verir. Arkadaki iki tepe sahneyi ikiye böler; birinde kasaba, ötekinde bir manastır vardır. Döngünün Giotto'ya ait olup olmadığı tartışmalıdır."),
    'elgreco-toledo': dict(eser_tr='Toledo Manzarası', sanatci='El Greco', yil='yaklaşık 1596–1600', yer='Metropolitan Museum of Art, New York', teknik='tuval üzerine yağlı boya',
        hikaye="El Greco'nun yaşadığı kenti fırtınalı, yeşil-gri bir gökyüzü altında gösterdiği tablo. Katedral ve Alcázar gerçekte durdukları yerden oynatılmıştır; ressam kenti gördüğü gibi değil, hissettiği gibi boyamıştır. İspanyol sanatının ilk büyük manzara resimlerinden biri sayılır."),
    'bruegel-avcilar': dict(eser_tr='Karda Avcılar', sanatci='Pieter Bruegel (Yaşlı)', yil='1565', yer='Kunsthistorisches Museum, Viyana', teknik='ahşap üzerine yağlı boya',
        hikaye="Yılın aylarını anlatan bir dizinin kış tablosu. Yorgun avcılar köpekleriyle karlı tepeden köye iner; aşağıda donmuş göllerde insanlar kayar, oynar. Bakışı soldan sağa, tepeden vadiye çeken çaprazıyla Bruegel'in en ünlü manzarasıdır."),
    'vermeer-delft': dict(eser_tr='Delft Manzarası', sanatci='Johannes Vermeer', yil='yaklaşık 1660–1661', yer='Mauritshuis, Lahey', teknik='tuval üzerine yağlı boya',
        hikaye="Vermeer'in doğduğu kenti nehrin karşı kıyısından gösterdiği sakin manzara. Bulutların gölgesi ön plandaki duvarları karartırken arkadaki çatılar güneşte parlar. Yüzeydeki küçük ışık noktaları, ressamın ışığı nasıl taneli bir doku olarak boyadığını gösterir."),
    'rembrandt-gece': dict(eser_tr='Gece Devriyesi', sanatci='Rembrandt van Rijn', yil='1642', yer='Rijksmuseum, Amsterdam', teknik='tuval üzerine yağlı boya',
        hikaye="Amsterdam'daki bir milis bölüğünün, Kaptan Frans Banninck Cocq ve yardımcısının önderliğindeki grup portresi. Rembrandt kişileri sıraya dizmek yerine harekete geçirmiş, ışığı birkaç figüre toplamıştır. Sahne aslında gündüzdür; 'gece' adı, zamanla kararan vernikten gelir."),
    'rubens-cardak': dict(eser_tr='Hanımeli Çardağı (Rubens ve Isabella Brant)', sanatci='Peter Paul Rubens', yil='yaklaşık 1609', yer='Alte Pinakothek, Münih', teknik='tuval üzerine yağlı boya',
        hikaye="Rubens'in kendisini ve evlendiği Isabella Brant'ı bir hanımeli çardağının altında el ele gösterdiği çift portresi. Evlilikten kısa süre sonra yapılmıştır. Hanımeli sevginin ve sadakatin simgesi olarak çifti çevreler."),
    'velazquez-meninas': dict(eser_tr='Nedimeler (Las Meninas)', sanatci='Diego Velázquez', yil='1656', yer='Museo del Prado, Madrid', teknik='tuval üzerine yağlı boya',
        hikaye="Küçük prenses Margarita'nın nedimeleri ve saray halkıyla çevrili olduğu sahnede Velázquez kendini de dev bir tuvalin başında boyamıştır. Arka duvardaki aynada kral ve kraliçe görünür; resme bakan bizim yerimizde onların durduğu düşünülür. Kimin kimi izlediği sorusuyla sanat tarihinin en çok tartışılan tablolarındandır."),
    'reni-aurora': dict(eser_tr='Aurora', sanatci='Guido Reni', yil='1614', yer="Casino dell'Aurora, Palazzo Pallavicini-Rospigliosi, Roma", teknik='tavan freski',
        hikaye="Şafak tanrıçası Aurora, güneş tanrısı Apollon'un arabasının önünde uçarak karanlığı dağıtır. Arabanın çevresinde el ele dans eden kadınlar Saatler'dir (Horai). Reni'nin berrak renkleri ve dengeli düzeni, Barok'un klasik yanının en ünlü örneklerindendir."),
    'caravaggio-matta': dict(eser_tr="Aziz Matta'nın Çağrılışı", sanatci='Caravaggio', yil='1599–1600', yer='San Luigi dei Francesi, Roma (Contarelli Şapeli)', teknik='tuval üzerine yağlı boya',
        hikaye="İsa, vergi toplayan Matta'yı havarisi olmaya çağırır. Sağdan, İsa'nın uzanan elini izleyen keskin bir ışık huzmesi karanlık odadaki masaya düşer. Caravaggio kutsal öyküyü sıradan bir meyhane köşesine taşımış, ışık ve gölge karşıtlığını (tenebrizm) anlatının merkezine koymuştur."),
    'piazzetta-rebeka': dict(eser_tr='Kuyu Başında Rebeka', sanatci='Giovanni Battista Piazzetta', yil='yaklaşık 1740', yer='Pinacoteca di Brera, Milano', teknik='tuval üzerine yağlı boya',
        hikaye="Tekvin'deki öyküde İbrahim'in hizmetkârı Eliezer, kuyu başında su veren Rebeka'yı İshak'a eş olarak seçer ve ona mücevher sunar. Piazzetta kutsal sahneyi gündelik, neredeyse köy hayatından bir an gibi boyar; ışıklı ve yumuşak renkleri Venedik'in geç Barok üslubunu taşır."),
    'lorrain-senlik': dict(eser_tr='Köy Şenliği', sanatci='Claude Lorrain', yil='1639', yer='Musée du Louvre, Paris', teknik='tuval üzerine yağlı boya',
        hikaye="Altın akşam ışığına bürünmüş geniş bir kır manzarasında köylüler ağaçların altında dans eder. Claude için asıl konu ışık ve uzaklıktır: figürler küçüktür, gözümüz ufka doğru yumuşakça açılan manzarada dolaşır. Bu ideal manzara anlayışı yüzyıllarca ressamları ve bahçe tasarımcılarını etkiledi."),
    'gainsborough-andrews': dict(eser_tr='Bay ve Bayan Andrews', sanatci='Thomas Gainsborough', yil='yaklaşık 1750', yer='National Gallery, Londra', teknik='tuval üzerine yağlı boya',
        hikaye="Yeni evli Robert ve Frances Andrews kendi topraklarında, bir meşenin altında poz verir. Sağda uzanan ekin demetleri ve tarlalar, ailenin varlığını gösteren manzaranın kendisidir. Bayan Andrews'in kucağındaki alan bitirilmeden boş bırakılmıştır."),
    'turner-yangin': dict(eser_tr="Lordlar ve Avam Kamarası'nın Yanışı", sanatci='J. M. W. Turner', yil='1834–1835', yer='Philadelphia Museum of Art (bir versiyonu Cleveland Museum of Art)', teknik='tuval üzerine yağlı boya',
        hikaye="16 Ekim 1834 gecesi Londra'daki eski Westminster Sarayı yandı; Turner yangını Thames kıyısından izleyip eskizler yaptı. Tablolarında alevler, duman ve sudaki yansımalar tek bir ışık girdabına dönüşür. Bugünkü Neo-Gotik parlamento binası (Barry ve Pugin) bu yangından sonra yapıldı."),
    'hiroshige-erik': dict(eser_tr='Kameido Erik Bahçesi', sanatci='Utagawa Hiroshige', yil='1857', yer="Edo'nun Yüz Ünlü Manzarası dizisi", teknik='renkli ağaç baskı',
        hikaye="Ön planda kıvrık gövdeli yaşlı bir erik ağacı, arkasında çiçek açmış bahçede gezinenler ve kızıl bir gökyüzü. Hiroshige yakındaki dalı iri, uzaktakini küçük göstererek derinlik yaratır. Van Gogh bu baskıyı 1887'de yağlı boyayla kopyalamıştır."),
    'monet-kopru': dict(eser_tr='Nilüferli Havuz (Japon Köprüsü)', sanatci='Claude Monet', yil='1899', yer="Giverny'deki bahçesinin dizisinden; örnekleri National Gallery (Londra) ve Metropolitan Museum'da", teknik='tuval üzerine yağlı boya',
        hikaye="Monet, Giverny'deki evinin bahçesine bir nilüfer havuzu ve Japon baskılarından esinlenen yeşil kemerli bir köprü yaptırdı. Hayatının son otuz yılında bu havuzu yüzlerce kez boyadı. Su yüzeyindeki yansımalar ve ışık, resmin asıl konusu hâline gelir."),
    'renoir-galette': dict(eser_tr="Moulin de la Galette'te Balo", sanatci='Pierre-Auguste Renoir', yil='1876', yer="Musée d'Orsay, Paris", teknik='tuval üzerine yağlı boya',
        hikaye="Montmartre'daki bir açık hava dans bahçesinde pazar öğleden sonrası: gençler dans eder, sohbet eder. Ağaçların arasından süzülen güneş, giysilerin ve yüzlerin üstünde benekler hâlinde titrer. Renoir'ın Paris'in neşeli gündelik hayatını anlatan en ünlü tablosudur."),
    'bocklin-ada': dict(eser_tr='Ölüler Adası', sanatci='Arnold Böcklin', yil='1880–1886 arasında beş versiyon', yer='ilk versiyonu Kunstmuseum Basel; diğerleri New York, Berlin ve Leipzig', teknik='tuval ya da ahşap üzerine yağlı boya',
        hikaye="Durgun, karanlık bir suda selvilerle kaplı kayalık bir ada; kayalara oyulmuş mezar kapıları ve adaya yaklaşan küçük bir kayıkta beyazlar giymiş ayakta bir figür. Böcklin öyküyü açıklamaz; resim sessizlik ve ölüm üzerine bir rüya gibidir. Sembolizmin en çok çoğaltılan imgelerinden biridir."),
    'seurat-jatte': dict(eser_tr="Grande Jatte Adası'nda Bir Pazar Öğleden Sonrası", sanatci='Georges Seurat', yil='1884–1886', yer='Art Institute of Chicago', teknik='tuval üzerine yağlı boya',
        hikaye="Seine üzerindeki Grande Jatte adasında dinlenen Parisliler: şemsiyeli kadınlar, silindir şapkalı erkekler, tasmalı bir maymun. Seurat renkleri paletinde karıştırmak yerine tuvale yan yana küçük saf renk noktaları koymuştur; göz onları uzaktan karıştırır. Bu teknik noktacılık (puantilizm) olarak bilinir."),
    'bacon-papa': dict(eser_tr="Velázquez'in Papa X. Innocentius Portresinden Çalışma", sanatci='Francis Bacon', yil='1953', yer='Des Moines Art Center', teknik='tuval üzerine yağlı boya',
        hikaye="Bacon, Velázquez'in ünlü papa portresini mor bir karanlığın içinde, ince çizgilerden bir kafesin içinde çığlık atan bir figüre dönüştürdü. Haritada figür gösterilmez; müzenin penceresinde yalnız mor oda, altın çizgili kafes ve boş koltuk görünür."),
    'dali-bellek': dict(eser_tr='Belleğin Azmi', sanatci='Salvador Dalí', yil='1931', yer='Museum of Modern Art (MoMA), New York', teknik='tuval üzerine yağlı boya',
        hikaye="Issız bir kıyıda, kuru bir dala ve bir kutunun kenarına sarkan eriyen cep saatleri. Dalí rüyadaki imgeleri fotoğraf netliğinde boyamayı amaçlar; zaman burada katı değil yumuşaktır. Sürrealizmin en tanınmış tablosudur."),
    'magritte-sapka': dict(eser_tr='Melon şapka ve elma (İnsanoğlu)', sanatci='René Magritte', yil='1964 (İnsanoğlu)', yer='özel koleksiyon', teknik='tuval üzerine yağlı boya',
        hikaye="Magritte'in resimlerinde melon şapkalı adam ve havada duran yeşil elma sık sık görünür; en ünlüsü 'İnsanoğlu'nda elma adamın yüzünü kapatır. Sıradan nesneleri beklenmedik biçimde bir araya getirerek gördüğümüze ne kadar güvenebileceğimizi sorgular. Haritada yalnız şapka ve elma vardır."),
    'duchamp-tekerlek': dict(eser_tr='Bisiklet Tekerleği', sanatci='Marcel Duchamp', yil='1913 (özgün nesne kayıp; 1951 versiyonu MoMA, New York)', yer='Museum of Modern Art (MoMA), New York', teknik='hazır nesne: tabure üstüne takılmış bisiklet tekerleği',
        hikaye="Duchamp, mutfak taburesinin üstüne ters takılmış bir bisiklet tekerleğini sanat yapıtı olarak sundu. Sonradan 'hazır nesne' (readymade) diye adlandırdığı bu fikirle sanatın el becerisi değil seçim ve düşünce olabileceğini savundu. Dada'nın ve kavramsal sanatın başlangıç noktalarından biridir."),
    'picasso-muzisyen': dict(eser_tr='Üç Müzisyen', sanatci='Pablo Picasso', yil='1921', yer='Museum of Modern Art (MoMA), New York (ikinci versiyonu Philadelphia Museum of Art)', teknik='tuval üzerine yağlı boya',
        hikaye="Harlequin, Pierrot ve keşiş kılığında üç müzisyen, kesilmiş kâğıt parçaları gibi düz ve renkli biçimlerden kurulmuştur. Bu, kolaj fikrini boyaya taşıyan sentetik kübizmin olgun bir örneğidir. Figürlerin arkasındaki karanlıkta bir köpek de saklanır."),
    'marc-atlar': dict(eser_tr='Büyük Mavi Atlar', sanatci='Franz Marc', yil='1911', yer='Walker Art Center, Minneapolis', teknik='tuval üzerine yağlı boya',
        hikaye="Üç mavi at, kırmızı tepelerin önünde birbirine yaslanır. Marc renklere duygusal anlamlar yüklemiştir: mavi onun için erkeklik, ciddiyet ve maneviyattır. Kandinsky ile birlikte kurduğu Mavi Süvari (Der Blaue Reiter) grubunun simge imgelerindendir."),
}


def taban(sp):
    """Sembolün kaidesinin ortası: alt %35'te en geniş opak satır (yuvarlak taş kaidenin enine çapı)."""
    a = np.array(sp.getchannel('A')) > 128
    ys = np.where(a.any(1))[0]
    y0 = int(ys.max() - 0.35 * (ys.max() - ys.min()))
    _, yb = max((a[y].sum(), y) for y in range(y0, ys.max() + 1))
    xs = np.where(a[yb])[0]
    return (xs.min() + xs.max()) / 2 / sp.width, yb / sp.height


def ayak(sp):
    """Öğrencinin ayağı: en alttaki opak satırın ortası."""
    a = np.array(sp.getchannel('A')) > 128
    yb = np.where(a.any(1))[0].max()
    xs = np.where(a[yb])[0]
    return (xs.min() + xs.max()) / 2 / sp.width, (yb + 1) / sp.height


def tonla(sp, ton):
    a = np.array(sp).astype(float)
    a[..., :3] *= ton
    return Image.fromarray(a.clip(0, 255).astype('uint8'))


def kucuk(sp, yukseklik_pt):
    sp = sp.crop(sp.getchannel('A').getbbox())
    h = yukseklik_pt * OLCEK
    return sp.resize((round(sp.width * h / sp.height), h), Image.LANCZOS)


def main():
    HEDEF.mkdir(parents=True, exist_ok=True)
    eski = json.loads((KOK / 'gorseller' / 'harita_eski' / 'harita.json').read_text())['eserler']
    bas = json.loads((KOK / 'data' / 'basyapitlar.json').read_text())['eserler']
    adlar = {s['id']: s['ad'] for s in json.loads((KOK / 'data' / 'sanatcilar.json').read_text())}
    veri = {'surum': 2, 'boyut': [390, 1170], 'bolgeler': {}, 'eserler': {}}
    for d in DONEMLER:
        sec = json.loads((BURASI / f'{d}_secim.json').read_text())
        ton = SERIN if d in ('ortacag', 'ronesans') else tuple(sec.get('gece_sembol_tonu', (0.88, 0.70, 0.48)))
        for tur, anahtar in (('gunduz', 'resim'), ('gece', 'resim_gece')):
            Image.open(BURASI / sec[anahtar].removeprefix('scripts/harita/')).convert('RGB').resize((1024, 3072), Image.LANCZOS).save(
                HEDEF / f'donem_{d}_{tur}.webp', quality=80, method=6)
        semboller = []
        for n in range(1, len(sec['duraklar']) + 1):
            sp = kucuk(Image.open(BURASI / 'cikti' / d / 'sprite' / f'sembol-{n}.webp').convert('RGBA'), SEMBOL_PT)
            sp.save(HEDEF / f'sembol_{d}_{n}_gunduz.webp', quality=90, method=6)
            tonla(sp, ton).save(HEDEF / f'sembol_{d}_{n}_gece.webp', quality=90, method=6)
            ax, ay = taban(sp)
            semboller.append({'w': round(sp.width / OLCEK, 1), 'h': SEMBOL_PT, 'ax': round(ax, 4), 'ay': round(ay, 4)})
        og = kucuk(Image.open(BURASI / 'cikti' / d / 'sprite' / 'karakter.webp').convert('RGBA'), OGRENCI_PT)
        og.save(HEDEF / f'ogrenci_{d}_gunduz.webp', quality=90, method=6)
        tonla(og, ton).save(HEDEF / f'ogrenci_{d}_gece.webp', quality=90, method=6)
        _, ay = ayak(og)
        ax = 0.5  # öğrenci durağın yanında, gövdesinin ortasından yerleşir
        motifler = []
        for kutu, kaynak in MOTIFLER[d]:
            if 'eski' in kaynak:
                anahtar, m = kaynak['eski'], eski[kaynak['eski']]
            elif 'bas' in kaynak:
                sid, baslik = kaynak['bas']
                b = next(x for x in bas if x['sanatci'] == sid and x['baslik'] == baslik)
                anahtar = f'{sid}:{b["anahtar"]}'
                m = {'eser_tr': b['baslik'], 'eser_ozgun': b.get('ozgun'), 'sanatci': adlar[sid], 'yil': b.get('tarih'), 'yer': b.get('muze'), 'hikaye': b.get('ozet')}
            else:
                anahtar, m = kaynak['yeni'], YENI[kaynak['yeni']]
            m = dict(m)
            m['sanatci_id'] = next((i for i, a in adlar.items() if a.lower() == (m.get('sanatci') or '').lower()), None)
            veri['eserler'][anahtar] = m
            motifler.append({'kutu': kutu, 'eser': anahtar})
        veri['bolgeler'][d] = {
            'duraklar': [[round(x, 4), round(y, 4)] for x, y in sec['duraklar']],
            'semboller': semboller,
            'yolcu': {'w': round(og.width / OLCEK, 1), 'h': OGRENCI_PT, 'ax': round(ax, 4), 'ay': round(ay, 4)},
            'motifler': motifler,
        }
    (KOK / 'data' / 'harita.json').write_text(json.dumps(veri, ensure_ascii=False, separators=(',', ':')))
    print(sum(f.stat().st_size for f in HEDEF.iterdir()) // 1024, 'KB')


if __name__ == '__main__':
    main()
