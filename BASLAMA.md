# Sanat Atlası · bu gece başlatmak için (≈15 dk)

Bu klasör uygulamanın **tarifi ve verisi**. Kodu Claude Code yazacak.

## 1. GitHub deposu (5 dk)
1. github.com → hesabın yoksa **Sign up** (e-posta, şifre, kullanıcı adı).
2. Sağ üst **+** → **New repository** → ad: `sanat-atlasi` → **Public** → **Create repository**.
3. Açılan sayfada **uploading an existing file** bağlantısı → bu klasörün **içindekileri** (CLAUDE.md, BASLAMA.md, `data` ve `tools` klasörleri) sürükle bırak → **Commit changes**.
   (Klasör sürüklenmezse Chrome'dan dene; ya da önce dosyaları, sonra "Add file → Upload files" ile `data` içindekileri `data/` yoluna yükle.)

## 2. Claude Code oturumu (2 dk, sonra kendi kendine çalışır)
1. claude.ai/code → GitHub'ı bağla (ilk seferde izin ister) → `sanat-atlasi` deposunu seç.
2. Şu isteği yapıştır ve gönder:

> CLAUDE.md dosyasındaki tarifi baştan sona uygula. Soru sormadan ilerle; belirsiz yerlerde kendi kararını ver ve KARARLAR.md'ye yaz. Testleri çalıştır. Bitince değişiklikleri main dalına gönder (gerekirse PR aç) ve Türkçe kısa bir özet yaz.

3. Sekmeyi kapatabilirsin; oturum bulutta çalışmaya devam eder. Sabah bak.
   PR açtıysa GitHub'da **Merge pull request** de.

## 3. Yayına alma ve iPhone'a ekleme (3 dk)
1. GitHub'da depo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, klasör **/(root)** → **Save**.
   (Claude Code GitHub Actions ile kurduysa Source: **GitHub Actions** seç.) 1–2 dk sonra adres çıkar: `https://<kullanıcı-adın>.github.io/sanat-atlasi/`
2. iPhone'da **Safari** ile bu adresi aç → **Paylaş** → **Ana Ekrana Ekle**.
3. Uygulamayı ana ekrandan aç; **İlerleme**'de işlediğin konular işaretli gelir (1–6, 9, 10, 11). Yeni konu bitirdikçe oradan işaretle.

## 4. Qwen denetimi (isteğe bağlı, Mac'te)
Depoyu bilgisayarına indirip (Code → Download ZIP) klasörde:
- `python3 tools/qwen_icerik_denetim.py` → `qwen_icerik_raporu.md` → raporu bana (Cowork) gönder, düzeltmeleri kontrol edip veriye işlerim.
- `python3 tools/qwen_kod_incele.py` → `qwen_kod_raporu.md` → içeriğini Claude Code oturumuna yapıştır.
Betikler `~/.qwen_key`'deki **kullandıkça öde** anahtarını kullanır (ücretsiz kota). **Token Plan anahtarı koyma**: betikler orada yasak.
