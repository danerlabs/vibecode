# vibecode

Küçük, tek dosyalık tarayıcı oyunları. Her oyun kendi klasöründe durur ve GitHub Pages üzerinden telefonda açılır.

## Oyunlar

- [Martılara Simit At](https://danerlabs.github.io/vibecode/martilara-simit/)
- [Sarnıç](https://danerlabs.github.io/vibecode/sarnic/) — haftalık İstanbul hikâyesi. Bu hafta: Martılı Saat (Kış 1955).

## Sarnıç'a hikâye eklemek

Görünüm ve ses ortaktır. Kâğıt, yazı, palet ve düğmeler `sarnic/index.html` içindedir. Akış, kayıt, paylaşım kartı ve ses `sarnic/engine.js` içindedir. Yeni hafta bu iki dosyaya sahne yazmaz: bir hikâye dosyası, resimler ve bir script satırı yeter.

1. `sarnic/stories/` altında yeni bir dosya aç. Örnek: `kapalicarsi.js`.
2. Dosyada aşağıdaki gibi `Sarnic.story({ ... })` çağır.
3. `sarnic/index.html` içinde `Sarnic.boot()` satırının hemen üstüne ekle: `<script src="stories/kapalicarsi.js"></script>`
4. Yeni hikâyeye `current: true` yaz, bir öncekinin `current` değerini `false` yap. Birden fazlası `true` ise listedeki sonuncusu bu haftanın hikâyesidir; ötekiler «Geçmiş hikâyeler» rafına iner.
5. Seçim sahnesinde tam üç seçenek olsun. Son sahnesinde seçenek yoktur; `ending`, `endName` ve `endBlurb` vardır. `endName` paylaşım kartında ve X metninde görünür.
6. `sound` hazır settendir: `room` (hafif yağmur), `street` (yağmur, rüzgâr, martı, vapur düdüğü), `cistern` (şıp şıp). Ses ilk dokunuştan sonra açılır.
7. Sahne resmi dikey bir WebP’dir, yaklaşık 1080×1920. Dosya `sarnic/stories/<hikâye-id>/img/<sahne-id>.webp`. Kapak `cover.webp`. Dosya yoksa sayfa kâğıt dokuda kalır. Resim açılınca metnin üstüne koyu sepia bir perde iner. Başka bir yol için sahneye `image: 'stories/kapalicarsi/img/avlu.webp'` yaz. Kâğıdı zorlamak için `image: false`.
8. `when`, seçimin yapıldığı andaki bayraklara bakılır. `set` ancak koşul tutunca yazılır. Tutmazsa oyun `else` sahnesine gider ve `setElse` uygulanır.
9. `id` yayınlandıktan sonra değişmesin. Bulunan sonlar `localStorage` anahtarı `sarnic-v1` altında bu ada yazılır. Resim klasörünün adı da bu `id` ile aynıdır.

```javascript
Sarnic.story({
  id: 'kapalicarsi',
  current: true,
  title: 'Kapalıçarşı',
  blurb: 'Bir cümle.',
  start: 'avlu',
  scenes: {
    avlu: {
      title: 'Avlu',
      sound: 'room',
      text: 'Öğle ışığı camekânlarda. En az bir iki cümle.',
      choices: [
        { t: 'Anahtarı al, eşiğe geç', to: 'esik', set: { sakladin: true } },
        { t: 'Boş geç', to: 'esik' },
        { t: 'Vazgeç', to: 'son' },
      ],
    },
    esik: {
      title: 'Eşik',
      sound: 'room',
      text: function (s) {
        return s.sakladin ? 'Anahtar avcunda.' : 'Avuçların boş.';
      },
      choices: [
        { t: 'Kapıyı dene', to: 'gizli', when: function (s) { return s.sakladin; }, else: 'son', setElse: { kacirdi: true } },
        { t: 'Sokağa çık', to: 'son' },
        { t: 'Bekle', to: 'son' },
      ],
    },
    gizli: {
      title: 'Arka dükkân',
      sound: 'room',
      text: 'Kapı ancak anahtarla açıldı.',
      choices: [
        { t: 'Çık', to: 'son' },
        { t: 'Bak', to: 'son' },
        { t: 'Bırak', to: 'son' },
      ],
    },
    son: {
      ending: 'cikis',
      endName: 'Çıkış',
      endBlurb: 'Kartta görünen kısa cümle.',
      title: 'Çıkış',
      sound: 'street',
      text: 'Kapı çekildi.',
    },
  },
});
```

Sahne kendini tekrar etmesin; her dal bir sona varsın. Konsolda `Sarnic.audit()` hata listesi boşsa, ulaşılmayan sahne ve çıkmaz dal yoktur. `text` düz yazı olabilir ya da `text(flags)` bayrağa göre cümle kurar. Oyun adı her yerde Sarnıç'tır; hikâye adı `title` alanındadır.
