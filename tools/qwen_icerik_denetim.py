"""Sanatçı verisini Qwen'e denetletir: akım ataması, doğum/ölüm yılları, kısa anlatımlardaki olgu hataları, Türkçe.
Kullanım (deponun kök klasöründe):  python3 tools/qwen_icerik_denetim.py
Çıktı: qwen_icerik_raporu.md  — dosyayı Claude'a (Cowork) gönder; düzeltmeleri Claude kontrol edip uygular. Veri dosyasını bu betik DEĞİŞTİRMEZ."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__)); from qwen_ortak import sor
A = json.load(open("data/sanatcilar.json", encoding="utf-8"))
SISTEM = ("Sen titiz bir sanat tarihi editörüsün. Sana JSON biçiminde sanatçı kayıtları verilecek. Her kayıt için yalnızca GERÇEK sorunları bildir: "
 "(1) akım ataması yanlış ya da çok tartışmalıysa, (2) doğum/ölüm yılı yanlışsa (yaklaşık yıllar için 1-2 yıllık fark sorun değil), "
 "(3) 'anlatim', 'taninma', 'kurs_notu' veya eser bilgilerinde olgu hatası varsa (yanlış eser–sanatçı eşleşmesi, yanlış şehir/tarih), "
 "(4) Türkçede bozuk ya da anlaşılmaz cümle varsa. Emin olmadığın şeyi hata diye yazma; 'emin değilim' de. "
 "Sorun yoksa o kaydı hiç yazma. Biçim: '### <ad>' başlığı, altında madde madde: sorun · neden · önerilen düzeltme.")
rapor = ["# Qwen içerik denetimi", ""]
for i in range(0, len(A), 8):
    parca = [{k: a.get(k) for k in ("ad", "akim", "dogum", "olum", "kurs_notu", "anlatim", "taninma", "onemli_eserler")} | {"kurs_eserleri": [w.get("baslik") for w in a.get("kurs_eserleri", [])]} for a in A[i:i+8]]
    print(f"{i+1}–{i+len(parca)} / {len(A)}", file=sys.stderr)
    rapor.append(sor(SISTEM, json.dumps(parca, ensure_ascii=False)))
open("qwen_icerik_raporu.md", "w", encoding="utf-8").write("\n\n".join(rapor))
print("Bitti: qwen_icerik_raporu.md")
