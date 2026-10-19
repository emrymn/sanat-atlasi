# Qwen (Model Studio, kullandıkça öde anahtarı) için ortak çağrı. Token Plan anahtarı KULLANMA: betikler orada yasak.
import json, os, sys, time, urllib.request
URL = "https://maas.qwencloudapi.com/compatible-mode/v1/chat/completions"
MODEL = os.environ.get("QWEN_MODEL", "qwen3.7-max")
def anahtar():
    k = os.environ.get("DASHSCOPE_API_KEY")
    if not k:
        p = os.path.expanduser("~/.qwen_key")
        if os.path.exists(p): k = open(p).read().strip()
    if not k: sys.exit("Anahtar yok: ~/.qwen_key dosyasına ya da DASHSCOPE_API_KEY'e koy.")
    return k
def sor(sistem, mesaj, max_tokens=4000):
    govde = json.dumps({"model": MODEL, "messages": [{"role": "system", "content": sistem}, {"role": "user", "content": mesaj}],
                        "enable_thinking": False, "temperature": 0.2, "max_tokens": max_tokens}).encode()
    for deneme in range(4):
        try:
            r = urllib.request.urlopen(urllib.request.Request(URL, data=govde, headers={"Authorization": "Bearer " + anahtar(), "Content-Type": "application/json"}), timeout=180)
            j = json.loads(r.read()); u = j.get("usage", {})
            print(f"  · {u.get('prompt_tokens','?')} girdi + {u.get('completion_tokens','?')} çıktı token", file=sys.stderr)
            return j["choices"][0]["message"]["content"]
        except Exception as e:
            print("  hata, tekrar deneniyor:", e, file=sys.stderr); time.sleep(5 * (deneme + 1))
    sys.exit("Qwen'e ulaşılamadı.")
