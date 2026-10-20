# v0 referansı (React + Tailwind prototip) — sadece BAKMAK için

Bu dosyalar v0'da yapılmış bir tasarım prototipinden alındı. Uygulamaya olduğu gibi KOPYALANMAYACAK; aşağıdaki üç parça bizim düz HTML/CSS/JS yapımıza çevrilecek.

1. Alt sekme çubuğu → tab-bar.tsx (+ atlas-app.tsx'teki yerleşimi)
2. Sanatçı ekranları → artist-screen.tsx ve daily-artist-screen.tsx
   - Kenardan kenara kahraman resim (sanatçı 300px, Günün sanatçısı 430px), alta doğru zemine eriyen degrade
   - Adın resmin alt kısmına binmesi (-mt-8 / -mt-14), büyük serif ad (36px / 44px)
   - Altın çizgili "Kursta: Konu N" satırı, "Notlarımdan", akım renkli "Nasıl tanırım?" kutusu
   - Dönem kutusundaki MovementTimeline (önceki akım ← bu akım → sonraki akım)
   - Eser galerisi: Günün sanatçısında yatay snap-kaydırma, sanatçı sayfasında iki sütunlu masonry
3. Geniş resimler → artwork.tsx (FramedArtwork: en-boy oranını koruyan çerçeve, `width: min(100%, h*oran + çerçeve)`,
   oran 1.45'te kesilir; ArtImage: yüklenirken akım renginde zemin, hata olunca çizgili desen, yüklenince opaklık geçişi)
   + globals.css'teki .art-frame / .art-mat / .art-window, --shadow-art, --mat, --frame, label-caps, kâğıt dokusu, animasyonlar
