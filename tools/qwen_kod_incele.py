"""Claude Code'un yazdığı uygulama kodunu Qwen'e inceletir (ikinci göz).
Kullanım (deponun kök klasöründe):  python3 tools/qwen_kod_incele.py
Çıktı: qwen_kod_raporu.md — içeriğini claude.ai/code oturumuna yapıştır: "Bu inceleme raporunu doğrula, gerçek sorunları düzelt."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__)); from qwen_ortak import sor
UZ = (".html", ".css", ".js", ".mjs", ".webmanifest")
dosyalar = []
for kok, dizinler, adlar in os.walk("."):
    dizinler[:] = [d for d in dizinler if d not in (".git", "node_modules", "tools", "data", "tests", "icons")]
    for ad in adlar:
        if ad.endswith(UZ): dosyalar.append(os.path.join(kok, ad))
SISTEM = ("Kıdemli bir web geliştiricisisin. Tek kullanıcılı, iPhone'da ana ekrana eklenen bir PWA'nın kodunu inceliyorsun (statik dosyalar, GitHub Pages). "
 "Şunlara bak: hatalar ve kenar durumları, iOS Safari/PWA uyumsuzlukları, service worker önbellek hataları, IndexedDB/localStorage veri kaybı riski, "
 "Wikidata/Commons isteklerinde hata yönetimi, erişilebilirlik ve dokunma hedefleri, gereksiz karmaşıklık. "
 "Her bulgu için: dosya · sorun · neden önemli · somut düzeltme. Önem sırasına koy. Emin değilsen belirt. Türkçe yaz.")
rapor = ["# Qwen kod incelemesi", ""]
for yol in sorted(dosyalar):
    kod = open(yol, encoding="utf-8", errors="ignore").read()
    if len(kod) > 60000: kod = kod[:60000] + "\n/* … kesildi … */"
    print(yol, file=sys.stderr)
    rapor.append(f"## {yol}\n\n" + sor(SISTEM, f"Dosya: {yol}\n\n```\n{kod}\n```"))
open("qwen_kod_raporu.md", "w", encoding="utf-8").write("\n\n".join(rapor))
print("Bitti: qwen_kod_raporu.md")
