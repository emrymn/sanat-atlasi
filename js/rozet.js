// Uygulama ikonu rozeti (İ2): navigator.setAppBadge (iOS 16.4+, ana ekran uygulaması, bildirim izni ister).
// Sunucu olmadığı için sayı yalnızca uygulama açıkken güncellenir: gizlenirken yarının vadeli sayısı yazılır.
export function rozetDestekli(nav = globalThis.navigator) {
  return !!nav && typeof nav.setAppBadge === 'function';
}

export async function rozetYaz(n, nav = globalThis.navigator) {
  if (!rozetDestekli(nav)) return false;
  try {
    if (n > 0) await nav.setAppBadge(n);
    else if (typeof nav.clearAppBadge === 'function') await nav.clearAppBadge();
    else await nav.setAppBadge(0);
    return true;
  } catch (e) {
    return false;
  }
}

// Ayarlar'dan açarken izin iste. İzin verildiyse ya da bildirim API'si yoksa true
export async function rozetIzni(bildirim = globalThis.Notification) {
  if (!bildirim || typeof bildirim.requestPermission !== 'function') return true;
  if (bildirim.permission === 'granted') return true;
  if (bildirim.permission === 'denied') return false;
  try {
    return (await bildirim.requestPermission()) === 'granted';
  } catch (e) {
    return false;
  }
}
