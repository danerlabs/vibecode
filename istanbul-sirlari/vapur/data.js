/* İstanbul Sırları — Vaka 01. Bütün oyuncu metinleri bu dosyada.
   İngilizce için aynı biçimde ikinci bir nesne eklenebilir. */
window.VAKA = {
  lang: "tr",
  ui: {
    series: "İstanbul Sırları",
    caseTitle: "Sabah Vapurunda Ölüm",
    when: "10 Mart 1955 · Kadıköy → Karaköy",
    intro: "10 Mart 1955, sabah. Kadıköy'den Karaköy'e giden vapurun birinci mevki salonu, iskeleye yanaşmadan hemen önce dondu. Yerde bir adam var. Kimse konuşmuyor. Sahneyi inceleyin, kelimeleri toplayın, defterdeki boşlukları doldurun.",
    start: "Başla",
    notebook: "Defter",
    backToScene: "Sahneye dön",
    reset: "Sıfırla",
    resetAsk: "Toplanan kelimeler ve defter silinsin mi?",
    resetYes: "Sil",
    cancel: "Vazgeç",
    close: "Kapat",
    back: "Geri",
    words: "Kelimeler",
    wordsEmpty: "Henüz kelime yok. Sahnede bir şeye dokunun.",
    wordsFrom: "Bulunan kelimeler",
    newWord: "Yeni kelime",
    newWords: "Yeni kelimeler",
    check: "Kontrol et",
    wrong: "Bir şeyler yanlış",
    help: "Kelimeyi sürükleyin ya da önce kelimeye, sonra boşluğa dokunun. Aynı kelime birden fazla boşlukta durabilir.",
    selected: "Seçili",
    tapHint: "Bir boşluğa dokunun.",
    clearBlank: "Boşalt",
    zoomIn: "Yakınlaş",
    zoomOut: "Uzaklaş",
    endingTitle: "Kapanış",
    progress: "Çözülen",
    choose: "İncelemek için birini seçin.",
    sceneAlt: "Vapurun birinci mevki salonu, 10 Mart 1955 sabahı",
    caseSolved: "Vaka çözüldü",
    blank: "Boşluk",
    pageTitle: "İstanbul Sırları — Sabah Vapurunda Ölüm"
  },

  items: [
    {
      id: "face",
      title: "Yüz ve yaka",
      kind: "photo",
      image: "images/01-nihat.jpg",
      text: "Yaşlı, titiz tıraşlı bir adam. Yaka iğnesinde küçük bir firuze. Dudaklarında soluk köpük.",
      words: ["Nihat Bey", "zehir"]
    },
    {
      id: "glass",
      title: "Devrilmiş çay bardağı",
      kind: "photo",
      image: "images/01-nihat.jpg",
      text: "İnce belli çay bardağı yan yatmış. Tabağında \"N\" harfli gümüş çay kaşığı. Çayın kenarında beyazımsı tortu.",
      words: ["çay", "zehir", "Nihat Bey"]
    },
    {
      id: "valise",
      title: "Valizin içi",
      kind: "photo",
      image: "images/02-valiz.jpg",
      text: "Astarı kadife kaplı özel bir yuva boş. İç kapakta kartvizit: NİHAT BEY — Antikacı — Beyazıt. Bir anahtar yuvası boş.",
      words: ["Nihat Bey", "antikacı", "harita", "yuva"]
    },
    {
      id: "card",
      title: "Kartvizit",
      kind: "photo",
      image: "images/02-valiz.jpg",
      text: "Baskılı kart: \"Nihat Bey / Antika Eserler / Beyazıt — Çadırcılar\". Arkada kurşun kalemle: \"Ferit — Karaköy iskele — 1. mevki\".",
      words: ["Nihat Bey", "antikacı", "Ferit Bey", "Karaköy"]
    },
    {
      id: "collar",
      title: "Yaka kâğıdı",
      kind: "paper",
      text: "Genç adam; kibar tıraş. Yaka içine iğnelenmiş kâğıt: Sedat — Kâtip — Nihat Bey Yanında.",
      words: ["Sedat", "kâtip"]
    },
    {
      id: "hand",
      title: "Sağ el",
      kind: "photo",
      image: "images/03-sedat-el.jpg",
      text: "İşaret ve başparmakta ince beyaz toz. Tırnak dibinde aynı toz.",
      words: ["Sedat", "toz", "zehir"]
    },
    {
      id: "lining",
      title: "Palto astarı",
      kind: "photo",
      image: "images/05-palto-astar.jpg",
      text: "Astarın dikişi taze; iplik rengi paltodan farklı. Astarın altında katlanmış eski kâğıt: İstanbul Su Yolları Krokisi — XIX. yy. (bağımsız antika; üzerinde dükkân damgası yok).",
      /* "astarına" cümleyi tamamlar; "astar" ve "sakladı" tasarımın verdiği kelimeler. */
      words: ["Sedat", "harita", "astar", "sakladı", "astarına"]
    },
    {
      id: "pocket",
      title: "İç cep",
      kind: "photo",
      image: "images/03-sedat-el.jpg",
      text: "Boş cam şişecik; etiket yırtık, okunan kısım: …ZEHİRİ — Arsenik…. Yanında katlı kâğıt: borç senedi.",
      words: ["Sedat", "arsenik", "fare zehri", "borç"]
    },
    {
      id: "note",
      title: "Borç senedi",
      kind: "paper",
      text: "\"Ben, Sedat, Galata'da Hacı Rıfat Efendi'ye 850 (sekiz yüz elli) lira borcum olduğunu… 1 Şubat 1955.\" İmza: Sedat. Vade: 15 Mart 1955.",
      words: ["Sedat", "borç", "850 lira", "vade"]
    },
    {
      id: "shoe",
      title: "Ayakkabı burnu",
      kind: "photo",
      image: "images/04-sedat-ayakkabi.jpg",
      text: "Sağ ayakkabı burnunda taze çay lekesi; damla yönü tepsiye doğru değil, Nihat'ın bardağına doğru kaymış gibi.",
      words: ["Sedat", "çay"]
    },
    {
      id: "badge",
      title: "Göğüs kartı",
      kind: "paper",
      text: "Metal yaka kartı: HASAN — Çaycı — Denizcilik Bankası Şehir Hatları.",
      words: ["Hasan", "çaycı"]
    },
    {
      id: "tray",
      title: "Çay tepsisi",
      kind: "photo",
      image: "images/06-tepsi.jpg",
      text: "İki ince belli bardak: biri dolu (şekersiz), biri boş. Dolu bardaktaki çayın yüzeyi temiz, tortu yok. Tepsinin kenarında parmak izi smearı — iki bardağın yerleri kaymış gibi halka lekeleri.",
      words: ["Hasan", "tepsi", "bardak", "yer değişti"]
    },
    {
      id: "tip",
      title: "Bahşiş tabağı",
      kind: "paper",
      text: "40 kuruş bozukluk; bir paket çay şekeri (açılmamış); küçük defter: \"Nihat Bey — her sabah sade — 10 kr\". Zehir yok.",
      words: ["Hasan", "sade", "temiz"]
    },
    {
      id: "hasan-thought",
      title: "Aklından geçen",
      kind: "thought",
      text: "\"Ben yalnızca tepsiyi tutuyordum… bardaklar… biri eğildi mi?\"",
      words: ["Hasan", "tepsi"]
    },
    {
      id: "label",
      title: "Torba etiketi",
      kind: "paper",
      text: "Kumaş etiket: Eleni Hanım — Terzi — Beyoğlu, Asmalımescit.",
      words: ["Eleni Hanım", "terzi", "Beyoğlu"]
    },
    {
      id: "receipt",
      title: "Terzi fişi",
      kind: "paper",
      text: "\"Nihat Bey — palto yırtığı onarımı — 4 TL — ödendi 8 Mart 1955\". Altında not: \"Eski hesap kapandı. Teşekkür.\"",
      words: ["Eleni Hanım", "Nihat Bey", "hesap", "ödendi"]
    },
    {
      id: "hands",
      title: "Eller ve makas",
      kind: "paper",
      text: "Ellerinde yalnızca iplik ve tebeşir tozu. Zehir, toz şişe veya çay lekesi yok. Kanepe ile Nihat arasında bir adımlık mesafe; çaya uzanmamış.",
      words: ["Eleni Hanım", "temiz"]
    },
    {
      id: "eleni-thought",
      title: "Aklından geçen",
      kind: "thought",
      text: "\"Hesabı dün kapattık… Bu sabah neden böyle?\"",
      words: ["hesap"]
    },
    {
      id: "simit",
      title: "Simit tablası",
      kind: "paper",
      text: "Tahta tablanın altında mürekkeple: Cemil — simit. Üç simit, biri yarım. Fiyat yazısı: \"Simit 5 kr\".",
      words: ["Cemil", "simitçi", "5 kuruş"]
    },
    {
      id: "gaze",
      title: "Baktığı yön",
      kind: "thought",
      text: "Çocuk tepsiye bakıyor, yere değil. \"Uzun boylu efendi tepsideki iki bardağın yerini değiştirdi. Sonra cebinden bir şey… Çaycı görmedi.\"",
      /* "bardakları değiştirerek" bölüm D'nin tasarım cevabı; tanık cümlesinden gelir. */
      words: ["Cemil", "Sedat", "bardak", "yer değiştirdi", "gördü", "bardakları değiştirerek"]
    },
    {
      id: "cemil-note",
      title: "Cepteki not",
      kind: "paper",
      text: "Anneden not: \"Cemil, iskelede bekle, vapura fazla girme. — Anne\".",
      words: ["Cemil"]
    },
    {
      id: "press",
      title: "Basın kartı",
      kind: "paper",
      text: "FERİT BEY — Muhabir — Akşam Gazetesi. Fotoğraflı.",
      words: ["Ferit Bey", "gazeteci"]
    },
    {
      id: "notebook",
      title: "Açık defter",
      kind: "paper",
      text: "\"10 Mart — Nihat Bey / su yolları krokisi — Sedat getirecek — peşin 200 TL? Röportaj değil, alım.\" Altı çizili: \"Sedat'la anlaştık\".",
      /* "Ferit Bey'e" ve "alıcıya", bölüm C'deki boşluğun tasarım cevapları. */
      words: ["Ferit Bey", "harita", "Sedat", "alıcı", "Ferit Bey'e", "alıcıya"]
    },
    {
      id: "newspaper",
      title: "Gazete",
      kind: "paper",
      text: "Manşet: \"Kadıköy ve Suvat Vapurları Sarayburnu'nda Çarpıştı — Ölü Yok\". Küçük haber: Kapalıçarşı onarımı sürüyor. Fiyat damgası: 15 kuruş.",
      /* Kapalıçarşı, tasarımın yanıltıcı listesinde var; gazete metninde geçiyor. */
      words: ["gazete", "çarpışma", "15 kuruş", "Kapalıçarşı"]
    },
    {
      id: "ferit-pocket",
      title: "Cep ve eller",
      kind: "thought",
      text: "Kalem, basılı kartvizitler, boş cüzdan gözü. Zehir, harita, toz yok. \"Haritayı görmedim henüz…\"",
      words: ["Ferit Bey", "temiz"]
    },
    {
      id: "ticket",
      title: "1. mevki bileti",
      kind: "paper",
      text: "Denizcilik Bankası T.A.O. / Şehir Hatları / Kadıköy–Karaköy / 1. Mevki — 30 Kuruş / 10 Mart 1955. Delikli.",
      words: ["bilet", "1. mevki", "30 kuruş", "Kadıköy"]
    },
    {
      id: "plate",
      title: "Pirinç plaka",
      kind: "paper",
      text: "DENİZCİLİK BANKASI T.A.O. — İSTANBUL ŞEHİR HATLARI İŞLETMESİ",
      words: ["Denizcilik Bankası"]
    },
    {
      id: "window",
      title: "Pencere",
      kind: "paper",
      text: "Karaköy rıhtımı yaklaşmış; halatlar henüz atılmamış.",
      words: ["Karaköy", "yanaşma"]
    }
  ],

  groups: [
    {
      id: "ferit",
      title: "Sol kanepedeki adam",
      items: ["press", "notebook", "newspaper", "ferit-pocket"]
    },
    {
      id: "sedat",
      title: "Ayakta duran genç",
      items: ["collar", "hand", "lining", "pocket", "note", "shoe"]
    },
    {
      id: "nihat",
      title: "Yerde yatan adam",
      items: ["face", "glass"]
    },
    {
      id: "valiz",
      title: "Açık deri valiz",
      items: ["valise", "card"]
    },
    {
      id: "cemil",
      title: "Kapıdaki çocuk",
      items: ["simit", "gaze", "cemil-note"]
    },
    {
      id: "hasan",
      title: "Tepsili adam",
      items: ["badge", "tray", "tip", "hasan-thought"]
    },
    {
      id: "eleni",
      title: "Sağ kanepedeki kadın",
      items: ["label", "receipt", "hands", "eleni-thought"]
    }
  ],

  /* Kutular görselin yüzde cinsinden: [sol, üst, genişlik, yükseklik].
     Küçük nesneler listede sonra gelir, böylece üstte tıklanır. */
  hotspots: [
    { id: "window-l", item: "window", box: [0, 14, 25, 16], label: "Pencere" },
    { id: "window-r", item: "window", box: [80, 5, 20, 28], label: "Pencere" },
    { id: "ferit", group: "ferit", box: [0, 30, 26.5, 69], label: "Sol kanepedeki adam" },
    { id: "sedat", group: "sedat", box: [26, 0, 18.5, 63], label: "Ayakta duran genç" },
    { id: "nihat", group: "nihat", box: [17, 64, 47, 34], label: "Yerde yatan adam" },
    { id: "cemil", group: "cemil", box: [44, 18, 14.5, 46], label: "Kapıdaki çocuk" },
    { id: "hasan", group: "hasan", box: [62, 8, 16, 66], label: "Tepsili adam" },
    { id: "eleni", group: "eleni", box: [78, 31, 21.5, 50], label: "Sağ kanepedeki kadın" },
    { id: "plate", item: "plate", box: [43.5, 5, 12.5, 14], label: "Duvardaki plaka" },
    { id: "ticket", item: "ticket", box: [12, 88, 12, 11], label: "Kanepe altındaki kâğıt" },
    { id: "shoe", item: "shoe", box: [32, 52, 10, 12], label: "Ayakkabı" },
    { id: "glass", item: "glass", box: [26, 83, 13, 15], label: "Devrilmiş çay bardağı" },
    { id: "tray", item: "tray", box: [56.5, 24, 15, 15], label: "Çay tepsisi" },
    { id: "valiz", group: "valiz", box: [64, 80, 18, 19], label: "Açık valiz" }
  ],

  sections: [
    {
      id: "A",
      kicker: "Bölüm A",
      title: "Kim kimdir?",
      hint: "Sahne siluetleri A–F için: [İSİM] bir [ROL].",
      confirm: "Salonun kimler olduğu netleşti. Şimdi sıradaki soru: o sabah ne oldu?",
      rows: [
        {
          caption: "A — Yerde, yan yatmış adam",
          pieces: [
            { blank: "a-name", accept: ["Nihat Bey"] },
            " bir ",
            { blank: "a-role", accept: ["antikacı"] },
            "."
          ]
        },
        {
          caption: "B — Ayakta duran uzun boylu genç",
          pieces: [
            { blank: "b-name", accept: ["Sedat"] },
            " bir ",
            { blank: "b-role", accept: ["kâtip"] },
            "."
          ]
        },
        {
          caption: "C — Elinde tepsi tutan adam",
          pieces: [
            { blank: "c-name", accept: ["Hasan"] },
            " bir ",
            { blank: "c-role", accept: ["çaycı"] },
            "."
          ]
        },
        {
          caption: "D — Sağ kanepedeki kadın",
          pieces: [
            { blank: "d-name", accept: ["Eleni Hanım"] },
            " bir ",
            { blank: "d-role", accept: ["terzi"] },
            "."
          ]
        },
        {
          caption: "E — Kapı eşiğindeki çocuk",
          pieces: [
            { blank: "e-name", accept: ["Cemil"] },
            " bir ",
            { blank: "e-role", accept: ["simitçi"] },
            "."
          ]
        },
        {
          caption: "F — Sol kanepede, şapkalı adam",
          pieces: [
            { blank: "f-name", accept: ["Ferit Bey"] },
            " bir ",
            { blank: "f-role", accept: ["gazeteci"] },
            "."
          ]
        }
      ]
    },
    {
      id: "B",
      kicker: "Bölüm B",
      title: "Ne oldu?",
      confirm: "Olay zinciri kuruldu. Geriye neden ve nasıl'ın netleşmesi kaldı.",
      rows: [
        {
          pieces: [
            "Önce ",
            { blank: "b-who", accept: ["Sedat"] },
            " tepsideki bardakların yerini değiştirdi."
          ]
        },
        {
          pieces: [
            "Sonra çaya ",
            { blank: "b-what", accept: ["arsenik", "fare zehri"] },
            " karıştırdı."
          ]
        },
        {
          pieces: [
            "Haritayı paltosunun ",
            { blank: "b-where", accept: ["astarına", "astar"] },
            " sakladı."
          ]
        }
      ]
    },
    {
      id: "C",
      kicker: "Bölüm C",
      title: "Neden?",
      confirm: "Neden ortaya çıktı: borç ve haritayı tek başına satma hevesi.",
      rows: [
        {
          pieces: [
            "Katilin ",
            { blank: "c-motive", accept: ["borç"] },
            " vardı; vadesi yakındı."
          ]
        },
        {
          pieces: [
            "Katil haritayı ",
            { blank: "c-buyer", accept: ["Ferit Bey'e", "alıcıya", "Ferit'e", "alıcı"] },
            " kendisi satacaktı."
          ]
        }
      ]
    },
    {
      id: "D",
      kicker: "Bölüm D",
      title: "Nasıl ve kim?",
      confirm: "Vaka çözüldü. Katil artık belli.",
      rows: [
        {
          pieces: [
            "Katil, zehri ",
            {
              blank: "d-how",
              accept: [
                "bardakları değiştirerek",
                "yer değiştirme",
                "yer değiştirdi",
                "yer değişti",
                "tepsideki bardaklar"
              ]
            },
            " ile Nihat Bey'in bardağına geçirdi."
          ]
        },
        {
          pieces: [
            "Nihat Bey'i öldüren kişi: ",
            { blank: "d-who", accept: ["Sedat"] }
          ]
        }
      ]
    }
  ],

  ending: "Vapur Karaköy'e yanaşmadan her şey açığa çıktı. Nihat Bey'in sade çayı, tepside yer değiştiren iki bardaktan biriyle zehirlenmişti. Sedat, vadesi yaklaşan borcun ve satılmamış haritanın ağırlığıyla ustasını kandırmak için plan kurmuş; krokiyi paltosunun taze dikilmiş astarına gizlemişti. Hasan yalnızca tepsiyi taşımış, Eleni Hanım kapanmış bir hesabın peşinden gelmiş, Ferit Bey ise masum bir alıcı olarak defterine not düşmüştü. Cemil'in gördüğü küçük hareket, büyük sırrı çözdü. Harita, Ferit Bey'in eline hiç geçmedi."
};
