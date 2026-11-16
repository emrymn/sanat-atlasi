# BAĞIMSIZ DENETİM ŞABLONU — Resim Ansiklopedisi

**Sürüm:** 1.0 · **Tarih:** 15 Kasım 2026
**Amaç:** GPT Astra ve Fable için eşdeğer akademik denetim paketleri üretmek. İki model AYNI standardı kullanır. Qwen kendi denetimini bağımsız hakemlik olarak gösteremez; bu şablon haricî denetçiler içindir.

## Paket Üretimi

`denetim/paket_uret.py` çalıştırıldığında her madde için denetim formu üretir:

```
python3 resim-ansiklopedisi/denetim/paket_uret.py
→ resim-ansiklopedisi/denetim/ASTRA_PAKETI.md
→ resim-ansiklopedisi/denetim/FABLE_PAKETI.md
```

İki paket içerik olarak birebir aynıdır (yalnız başlık/hakem adı farklı); denetçiler birbirinin sonucunu görmeden bağımsız doldurur.

## Denetçinin Dolduracağı Alanlar (her iddia için)

| # | Alan | Açıklama |
|---|---|---|
| 1 | Madde ID | örn. IKO-001 |
| 2 | İddia ID | örn. C003 |
| 3 | İddianın tam ifadesi | maddedeki haliyle aynen |
| 4 | Gösterilen kaynak | madde JSON'unda iddiaya bağlanan kaynak(lar) |
| 5 | Gerçekten incelenen kaynak | denetçinin kendisinin açtığı kaynak + erişim tarihi |
| 6 | Kaynak iddiayı destekliyor mu? | EVET / KISMEN / HAYIR / KONTROL EDİLEMEDİ |
| 7 | Hata veya belirsizlik | saptanan sorun; belirsizliğin kesinleştirilip kesinleştirilmediği |
| 8 | Önem düzeyi | KRİTİK (olgu hatası/uydurma) · CİDDİ (aşırı kesinleştirme, yanlış bağ) · KÜÇÜK (ifade/kaynak hijyeni) |
| 9 | Düzeltilmesi gereken ifade | önerilen yeni ifade |
| 10 | Bağımsız denetçinin kararı | DOGRULANDI / KISMEN_DESTEKLENIYOR / DOGRULANAMADI / CELISKILI / HATALI + madde geneli için TASLAK / BAGIMSIZ_DENETIM_BEKLIYOR / YAYIN_ONAYLI önerisi |

## Denetim Kapsamı Kontrol Listesi (madde düzeyinde)

- [ ] Kapsam: madde gerçekten resim sanatıyla ilgili mi? (Bölüm 11 sınırı)
- [ ] Sembolizm ayrımı: görünen nesne / tarihsel kullanım / atfedilen anlam / anlamın kaynağı / alternatif yorumlar ayrıştırılmış mı?
- [ ] Anlam otomatik mi atfedilmiş? (dönem-eser bağlamı doğrulanmış mı)
- [ ] Mitolojik anlatı tarihsel olgu gibi mi sunulmuş? Versiyonlar tek anlatıda birleştirilmiş mi?
- [ ] Teknik maddelerde malzeme / yöntem / yüzey / görsel etki karışmış mı?
- [ ] Nesne maddelerinde tarihsel kullanım ile sembolik iddia ayrılmış mı?
- [ ] Resim örnekleri: sanatçı-başlık-tarih-koleksiyon-VERSİYON doğru mu? (replika/başka versiyon riski)
- [] Belirsizlik ifadeleri (circa, attributed, possibly, traditionally…) korunmuş mu?
- [ ] Tartışmalı iddialarda iki bağımsız kaynak var mı? Yoksa iddia uygun statüde mi?
- [ ] DOGRULANDI statüsündeki her iddia için kaynak gerçekten okunmuş mu (pasaj kaydı gerçek mi)?
- [ ] Yorum (YORUM/HIPOTEZ) olgu gibi mi anlatılmış?
- [ ] Uydurma bibliyografya/URL/envanter şüphesi var mı?
- [ ] CJK/karakter sorunları, dil ve üslup (Türkçe, terimler özgün biçimde)

## Karar Kuralları

1. Denetçi, üretim ekibinin (Qwen) verdiği DOGRULANDI statülerine güvenmez; kaynağı kendisi açar.
2. URL'nin açılması doğrulama değildir; kaynağın doğru kavram/eser hakkında olduğu kontrol edilir.
3. KRİTİK bulgu saptanan madde otomatik olarak TASLAK'a düşürülür.
4. YAYIN_ONAYLI önerisi ancak KRİTİK ve CİDDİ bulgu kalmadığında verilebilir; nihai onay insan editoryal kararıdır.
