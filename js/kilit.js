// Kilit mantığı: bir sanatçı, konusu "işlendi" işaretlenince açılır.

export function islenenKume(islenen) {
  return islenen instanceof Set ? islenen : new Set(islenen || []);
}

export function acikMi(sanatci, islenen) {
  return islenenKume(islenen).has(sanatci.konu);
}

export function acikSanatcilar(sanatcilar, islenen) {
  const k = islenenKume(islenen);
  return sanatcilar.filter((s) => k.has(s.konu));
}

// Her akım için: açık sanatçı sayısı, toplam ve henüz kapalıysa açılacağı en erken konu.
export function akimDurumlari(akimlar, sanatcilar, islenen) {
  const k = islenenKume(islenen);
  return akimlar
    .slice()
    .sort((a, b) => a.sira - b.sira)
    .map((a) => {
      const uyeler = sanatcilar.filter((s) => s.akim === a.ad);
      const acik = uyeler.filter((s) => k.has(s.konu));
      const kapaliKonular = uyeler.filter((s) => !k.has(s.konu)).map((s) => s.konu);
      return {
        ad: a.ad,
        sira: a.sira,
        toplam: uyeler.length,
        acikSayisi: acik.length,
        acik: acik.length > 0,
        acilacagiKonu: kapaliKonular.length ? Math.min(...kapaliKonular) : null,
      };
    });
}

// Bir konu işaretlenince yeni açılan sanatçılar
export function yeniAcilanlar(sanatcilar, onceki, sonraki) {
  const o = islenenKume(onceki);
  const s = islenenKume(sonraki);
  return sanatcilar.filter((x) => !o.has(x.konu) && s.has(x.konu));
}
