# vibecode

Küçük, tek dosyalık tarayıcı oyunları. Her oyun kendi klasöründe durur ve GitHub Pages üzerinden telefonda açılır.

## Oyunlar

- [Martılara Simit At](https://danerlabs.github.io/vibecode/martilara-simit/)
- [Sarnıç](https://danerlabs.github.io/vibecode/sarnic/) — haftalık İstanbul hikâyesi. Bu hafta: Martılı Saat (Kış 1955).

## Sarnıç'a hikâye eklemek

Görünüm ve ses ortaktır. Kâğıt dokusu, yazı, palet ve düğmeler `sarnic/index.html` içindedir. Akış, kayıt, paylaşım kartı, ses ve çizim kalemi `sarnic/engine.js` içindedir. Yeni hafta bu iki dosyaya sahne yazmaz: bir hikâye dosyası ve bir script satırı yeter.

1. `sarnic/stories/` altında yeni bir dosya aç. Örnek: `kapalicarsi.js`.
2. Dosyada aşağıdaki gibi `Sarnic.story({ ... })` çağır.
3. `sarnic/index.html` içinde `Sarnic.boot()` satırının hemen üstüne ekle: `<script src="stories/kapalicarsi.js"></script>`
4. Yeni hikâyeye `current: true` yaz, bir öncekinin `current` değerini `false` yap. Birden fazlası `true` ise listedeki sonuncusu bu haftanın hikâyesidir; ötekiler «Geçmiş hikâyeler» rafına iner.
5. Seçim sahnesinde tam üç seçenek olsun. Son sahnesinde seçenek yoktur; `ending`, `endName` ve `endBlurb` vardır. `endName` paylaşım kartında ve X metninde görünür.
6. `sound` hazır settendir: `room` (hafif yağmur), `street` (yağmur, rüzgâr, martı, vapur düdüğü), `cistern` (şıp şıp). Ses ilk dokunuştan sonra açılır.
7. `ill` ya motor kitaplığından bir addır ya da bu hikâyenin `illustrations` çizimidir. Aynı ad varsa hikâyedeki çizim kitaplığı ezer. Kapak için `cover` kullan; boşsa `watch` çizilir.
8. `when`, seçimin yapıldığı andaki bayraklara bakılır. `set` ancak koşul tutunca yazılır. Tutmazsa oyun `else` sahnesine gider ve `setElse` uygulanır.
9. `id` yayınlandıktan sonra değişmesin. Bulunan sonlar `localStorage` anahtarı `sarnic-v1` altında bu ada yazılır.

Çizimler aynı kalemi kullanır: koyu mürekkep siluet, kâğıt rengi delik, az çizgi. Yeni bir sahne resmi birkaç şekil yeter:

```javascript
bedesten(d) {
  d.column(150, 70, 160);
  d.column(360, 70, 160);
  d.arch(178, 66, 182, 90);
  d.watch(320, 200, 0.7);
}
```

Kalemde `fill`, `cut`, `band`, `ground`, `rain`, `watch`, `gull`, `building`, `column`, `arch` ve `stamp('watch')` vardır. `stamp` kitaplıktaki silueti aynı tuvale basar. `d.ctx` durur; yeni hikâye yeni bir palet açmaz.

Kitaplık adları: `watch`, `street`, `door`, `gloves`, `letter`, `well`, `passage`, `cistern`, `figure`, `flood`, `gull`.

```javascript
Sarnic.story({
  id: 'kapalicarsi',
  current: true,
  title: 'Kapalıçarşı',
  blurb: 'Bir cümle.',
  start: 'avlu',
  cover: 'street',
  illustrations: {
    bedesten(d) {
      d.ground(190);
      d.column(140, 80, 140);
      d.arch(80, 210, 480, 120);
    },
  },
  scenes: {
    avlu: {
      title: 'Avlu',
      ill: 'bedesten',
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
      ill: 'door',
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
      ill: 'bedesten',
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
      ill: 'door',
      sound: 'street',
      text: 'Kapı çekildi.',
    },
  },
});
```

Sahne kendini tekrar etmesin; her dal bir sona varsın. Konsolda `Sarnic.audit()` hata listesi boşsa, ulaşılmayan sahne ve çıkmaz dal yoktur. `text` düz yazı olabilir ya da `text(flags)` bayrağa göre cümle kurar. Oyun adı her yerde Sarnıç'tır; hikâye adı `title` alanındadır.
