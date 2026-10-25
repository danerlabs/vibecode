# vibecode

Küçük, tek dosyalık tarayıcı oyunları. Her oyun kendi klasöründe durur ve GitHub Pages üzerinden telefonda açılır.

## Oyunlar

- [Martılara Simit At](https://danerlabs.github.io/vibecode/martilara-simit/)
- [Sarnıç](https://danerlabs.github.io/vibecode/sarnic/) — İstanbul hikâyesi. İlk hikâye: Martılı Saat (Ocak 1955).

## Sarnıç'a hikâye eklemek

Görünüm `sarnic/index.html` içindedir: Lora 17px, alttan krem geçiş, tam ekran resim. Akış, kayıt ve ses `sarnic/engine.js` içindedir. Oynatıcı `current: true` olan hikâyeyi doğrudan kapaktan açar.

1. `sarnic/stories/` altında bir dosya aç ve `Sarnic.story({ ... })` çağır.
2. `sarnic/index.html` içinde `Sarnic.boot()` satırının hemen üstüne script etiketini ekle. Yeni hikâyeye `current: true` yaz, eskisini `false` yap.
3. `text` bir dizi paragraftır. Her paragraf bir telefon ekranıdır. Karar sahnesinde tam üç `choices` vardır ve yalnız son paragrafta görünür. Anlatı sahnesi `next` ile bir sonraki sahneye gider.
4. Aynı mekânı paylaşan sahneler aynı resim dosyasını gösterir. Resim değişince ilk sayfa yalnız resimdir; dokununca metin gelir. Dosya `sarnic/stories/<id>/img/<ad>.webp`, yükseklik yaklaşık 1080, kırpılmaz. Kapak `cover` alanındadır. Dosya açılmazsa zemin krem kâğıtta kalır.
5. Koşullu cümle, bayrak ve sapma hikâye dosyasında `lines`, `arrive` ve `next` ile kurulur. Sahne kodu ekrana yazılmaz.
6. `sound`: `room` (hafif yağmur), `street` (yağmur, rüzgâr, martı, vapur düdüğü), `cistern` (şıp şıp). Ses ilk dokunuştan sonra açılır.
7. Son sahneden sonra kart gelir: «Bekçi sonuna ulaştın», baştan ve paylaş. Paylaşım Web Share API'dir; olmazsa bağlantı kopyalanır. İlerleme `localStorage` anahtarı `sarnic-v2` altındadır.

`Sarnic.audit()` boş dizi dönerse çıkmaz dal ve ulaşılmayan sahne yoktur. Oyun adı Sarnıç'tır.
