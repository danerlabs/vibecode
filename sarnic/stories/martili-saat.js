'use strict';

/*
 * Bu haftanın hikâyesi. Yeni hafta için bu dosyayı kopyalama:
 * sarnic/stories/ altına yeni bir dosya koy ve index.html'e bir script satırı ekle.
 * Ayrıntı README'de, «Sarnıç'a hikâye eklemek».
 */
Sarnic.story({
  id: 'martili-saat',
  current: true,
  title: 'Martılı Saat (Kış 1955)',
  blurb: 'Galata Köprüsü\'nün altında bir gümüş saat, kırmızı eldiven ve dokuza kadar süren bir kış gecesi.',
  start: 'restoran',
  cover: 'restaurant',
  illustrations: {
    restaurant(d) {
      d.rain();
      d.fill(c => c.rect(0, 52, d.w, 128));
      d.cut(c => {
        c.moveTo(72, 180);
        c.quadraticCurveTo(186, 90, 300, 180);
        c.closePath();
      });
      d.cut(c => {
        c.moveTo(340, 180);
        c.quadraticCurveTo(454, 90, 568, 180);
        c.closePath();
      });
      d.band(198);
      d.watch(180, 232, 0.58);
    },
    door(d) {
      d.stamp('door');
      const ctx = d.ctx;
      ctx.save();
      ctx.translate(492, 168);
      ctx.fillStyle = d.red;
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 34, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(20, -18, 11, 16, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
    eye(d) {
      d.fill(c => {
        c.moveTo(150, 146);
        c.quadraticCurveTo(320, 62, 490, 146);
        c.quadraticCurveTo(320, 230, 150, 146);
        c.closePath();
      });
      d.cut(c => c.arc(320, 146, 34, 0, Math.PI * 2));
      d.fill(c => c.arc(328, 146, 14, 0, Math.PI * 2));
    },
  },
  scenes: {
    restoran: {
      title: 'Galataaltı',
      ill: 'restaurant',
      sound: 'room',
      text: 'Kış 1955. Galata Köprüsü\'nün altında camlar buğu tutmuş. Palamut soğuyor, yağmur demire vuruyor.\n\nPeçetede bir satır var: «Saat 9\'da Pera Palas\'ın arka kapısı. Saati getir.»\n\nCebindeki gümüş köstekli saatin kapağında bir martı duruyor. Yaşlı garson çayı bırakırken eğiliyor. «Kırmızı eldivenli kadına güvenme.» Sesi, az önce mutfaktan gelen öksürüğün aynısı.',
      choices: [
        { t: 'Saatin kapağını arala', to: 'saat' },
        { t: 'Notu garsona göster', to: 'saat', set: { showedNote: true } },
        { t: 'Hesabı bırak, yağmura çık', to: 'yagmur', set: { hurried: true } },
      ],
    },
    saat: {
      title: 'Köstekli saat',
      ill: 'watch',
      sound: 'room',
      text: 'Kapağın içi buğulu. Akrep ile yelkovan dokuza yaslanmış; oysa sen kurmadın. Martının gözü minicik bir vida.\n\nGarson tezgâhın ötesinden bakmıyor gibi yapıyor. Kaşık, masada seninle aynı hızda titriyor.',
      choices: [
        { t: 'Kapağın iç dikişini kaldır', to: 'yagmur', set: { mapFound: true } },
        { t: 'Saati kulağına dayayıp dinle', to: 'yagmur' },
        { t: 'Garsonun cümlesini içinden tekrarla', to: 'yagmur', set: { suspicious: true } },
      ],
    },
    yagmur: {
      title: 'Lodos',
      ill: 'street',
      sound: 'street',
      text(s) {
        let t = '';
        if (s.hurried) t += 'Hesabı yarım bıraktın. Garsonun bakışı ensende kaldı.\n\n';
        if (s.mapFound) t += 'Kapağın astarından ince bir kâğıt çıktı: «Yerebatan değil. Balıkçının kuyusu.»\n\n';
        if (s.suspicious) t += '«Güvenme» dedi. Kime güvendiğini söylemedi.\n\n';
        t += 'Yağmur Karaköy\'ü inceltiyor. Vapur düdüğü karşı kıyıdan geliyor, martılar köprünün demirine dizilmiş. Pera\'nın ışıkları yukarıda, ıslak taşın içinde.';
        return t;
      },
      choices: [
        { t: 'Köprü ayağındaki martı pompasına uğra', to: 'pera', set: { sawPump: true } },
        { t: 'Yokuşu Pera\'ya tırman', to: 'pera' },
        { t: 'Bir kahve ocağında buğuyu sil', to: 'pera', set: { thoughtful: true } },
      ],
    },
    pera: {
      title: 'Arka kapı',
      ill: 'door',
      sound: 'street',
      text(s) {
        const wait = s.thoughtful ? 'Kahvede avuçların ısındı. Saat hâlâ dokuza bakıyor.\n\n' : '';
        const pump = s.sawPump ? 'Pompanın gagası aklında. Şimdi başka bir kapıdasın.\n\n' : '';
        return wait + pump + 'Pera Palas\'ın arka kapısı hizmet merdivenine bakıyor. Fanusta tek mum. Kapı aralanınca kırmızı eldiven görünüyor; deri ıslak, dikiş eski.\n\nKadın genç. «Leyla» diyor. Arkasındaki fötr şapkalı adam kardeşi kadar benziyor. «Kemal.»';
      },
      choices: [
        { t: '«Babamın çırağı sen misin?»', to: 'leyla', set: { trust: 'open' } },
        { t: 'Eşiği geçmeden dur', to: 'kemal', set: { trust: 'wary' } },
        { t: 'Kapının kör noktasında bekle', to: 'kemal', set: { trust: 'hid' } },
      ],
    },
    leyla: {
      title: 'Kırmızı eldiven',
      ill: 'gloves',
      sound: 'room',
      text: 'Leyla eldiveni çıkarmaz. «Saatleri baban öğretti. Kapağı o kazıdı. Martı onun işareti.»\n\nKemal kapının yanında, kolları bağlı. İçeriden otelin sıcaklığı vuruyor. Dışarıda yağmur, içeride babanın adı.',
      choices: [
        { t: 'Saati bir anlığına avucuna bırak', to: 'mektup', set: { offeredWatch: true } },
        { t: '«Mektup sende mi?» diye sor', to: 'mektup' },
        { t: 'Kapaktaki sözü ona oku', to: 'mektup', set: { mapFound: true, toldMap: true } },
      ],
    },
    kemal: {
      title: 'Fötr',
      ill: 'figure',
      sound: 'room',
      text(s) {
        const hid = s.trust === 'hid' ? 'Kör noktadan çıkman yarım saniye sürdü. Kemal senden önce görmüş.\n\n' : '';
        return hid + 'Kemal öne çıkıyor. Fötründen yağmur damlıyor. «Kardeşim acele eder. Ben etmem. Saat sende kalsın, biz konuşalım.»\n\nLeyla\'nın eldivenleri ışıkta daha kırmızı. Garsonun cümlesi kulağının içinde duruyor.';
      },
      choices: [
        { t: 'Saati Kemal\'e uzat', to: 'mektup', set: { offeredKemal: true } },
        { t: 'Dinle, saati cebinde tut', to: 'mektup' },
        { t: 'Leyla\'yı bir adım öteye çek', to: 'mektup', set: { trust: 'partial' } },
      ],
    },
    mektup: {
      title: 'Babanın mektubu',
      ill: 'letter',
      sound: 'room',
      text(s) {
        let t = '';
        if (s.offeredWatch) t += 'Leyla saati avcunda tarttı, kapağı kapattı, sana geri verdi. «Henüz değil.»\n\n';
        if (s.offeredKemal) t += 'Kemal saati almadı. «Bu bende durmaz» dedi.\n\n';
        if (s.toldMap) t += 'Leyla kapağın içini ezbere bildi: «Yerebatan değil. Balıkçının kuyusu.»\n\n';
        else if (s.mapFound) t += 'Cebindeki kâğıt duruyor: «Yerebatan değil. Balıkçının kuyusu.»\n\n';
        t += 'Leyla iç cebinden sararmış bir zarf çıkarıyor. Mühür çatlamış. Babanın yazısı acele, yine de düzgün.\n\nSarnıçtaki su saati eski kanalları tutuyormuş. Yanlış elde Eminönü\'nün altı dolarmış. Kenarda, daha koyu: Yerebatan\'a gitme. Balıkçının kuyusu. Köprünün martısı.';
        return t;
      },
      choices: [
        { t: 'Mektubu son satırına kadar oku', to: 'suphe', set: { readLetter: true } },
        { t: '«Garson kim?» diye sor', to: 'suphe', set: { askedWaiter: true } },
        { t: 'Mektubu okumadan katla', to: 'suphe', set: { unread: true } },
      ],
    },
    suphe: {
      title: 'Aynı öksürük',
      ill: 'figure',
      sound: 'street',
      text(s) {
        let t = '';
        if (s.showedNote) t += 'Adam peçetedeki saati ezbere biliyor. «Dokuz» diyor, sen söylemeden.\n\n';
        if (s.suspicious || s.askedWaiter) t += 'Öksürük, mutfaktakiyle aynı perdede.\n\n';
        if (s.unread) t += 'Zarf cebinde, içini tam okumadın. Kâğıt yine de ağır.\n\n';
        t += 'Otelin yan sokağında palto yakası kalkık bir adam. Lokantanın sahibi gibi duruyor, çünkü öyle: tezgâhın arkasındaki garson. Aynı leke, aynı sağ el.\n\n«Saati bana ver» diyor usulca. «Kız seni içeri çeker.»';
        return t;
      },
      choices: [
        { t: '«Siz Balıkçı Rıza\'sınız.»', to: 'kopru', set: { noticedRiza: true } },
        { t: 'Saati emanete bırak', to: 'end_olta' },
        { t: 'Cevap vermeden kalabalığa karış', to: 'kopru' },
      ],
    },
    kopru: {
      title: 'Martı pompası',
      ill: 'gull',
      sound: 'street',
      text(s) {
        let t = '';
        if (s.noticedRiza) t += 'Leyla fısıldıyor: «Rıza arkada. Saat onda onda kalırsa şehir uyanır.»\n\n';
        else t += 'Leyla yanında nefesini tutmuş. Arkandaki adımı ikiniz de duymuyorsunuz.\n\n';
        if (s.sawPump) t += 'Pompayı bir kez görmüştün. Şimdi gagası sana bakıyor.\n\n';
        t += 'Köprünün ayağında, suyun üstünde, demir bir martı. Gagası pompa ağzı, kuyruk menteşeli. Yukarıdan insanlar geçiyor. Kimse aşağı bakmıyor.';
        return t;
      },
      choices: [
        { t: 'Saati martının yuvasına oturt', to: 'gecit', set: { usedPump: true } },
        { t: 'Kuyunun taş ağzını ara', to: 'kuyu' },
        {
          t: 'Saati dokuza kur, martının gözüne bak',
          to: 'end_goz',
          when: s => s.mapFound && s.noticedRiza && s.sawPump,
          else: 'gecit',
          setElse: { eyeFailed: true },
        },
      ],
    },
    kuyu: {
      title: 'Balıkçının kuyusu',
      ill: 'well',
      sound: 'street',
      text: 'Harita yalan söylemiyor. Pompanın bir karış altında, yosunlu taşta kuyu ağzı. Balık pulu kokusu, lokantayla aynı.\n\nMerdiven dar. Leyla eldivenini dişine takıp çıkarıyor. İlk kez çıplak el. Parmaklarında saat yağı.',
      choices: [
        { t: 'Leyla ile birlikte in', to: 'gecit', set: { together: true } },
        { t: '«Sen bekle» deyip tek in', to: 'gecit', set: { aloneStep: true } },
        { t: 'Ağzı bırak, saati Rıza\'ya götür', to: 'end_olta' },
      ],
    },
    gecit: {
      title: 'Şıp',
      ill: 'passage',
      sound: 'cistern',
      text(s) {
        let open = 'Kuyu dar. Pul kokusu, lokantanın mutfağıyla aynı.';
        if (s.usedPump) open = 'Saat martının gövdesinde bir diş döndü, kapak kalktı. Leyla saati geri çıkardı. «Bunu asıl heykel ister.»';
        else if (s.eyeFailed) open = 'Göz açılmadı. Kuyruk menteşesi yine de gevşedi, soğuk yukarı vurdu.';
        const hand = s.aloneStep
          ? 'Leyla yukarıda kaldı, sen indin. Damlayı sen sayıyorsun.'
          : 'Leyla yanında. Eldivensiz eli soğuk. «Baban burada sayardı» diyor.';
        return open + '\n\nİlk damla bileğine düşüyor. Şıp. Sonra bir tane daha, daha aşağıdan. Geçit köprünün gölgesinden kopup şehre iniyor.\n\n' + hand;
      },
      choices: [
        { t: 'Leyla\'nın elini tut, devam et', to: 'esik' },
        { t: 'Elini bırak, yalnız yürü', to: 'esik', set: { split: true } },
        { t: 'Yukarıya seslen', to: 'riza', set: { ambush: true } },
      ],
    },
    esik: {
      title: 'Eşik',
      ill: 'cistern',
      sound: 'cistern',
      text(s) {
        const split = s.split
          ? 'Leyla bir adım geride. Şıp şıp ikinizin arasını sayıyor.\n\n'
          : 'Damla sütundan sütuna atlıyor. Şıp. Şıp.\n\n';
        return split + 'Eşikte hava değişiyor. Burası köprü değil. Sütunlar suyun içinden kalkıyor, her biri bir saatin dişi gibi.\n\nOrtada, henüz loş, bir martı heykeli. Gaga açık.';
      },
      choices: [
        { t: 'Heykele birlikte yürü', to: 'sarnic' },
        { t: 'Yalnız yürü', to: 'yalniz' },
        { t: 'Mektubu burada oku, sonra ilerle', to: 'sarnic', set: { bluffReady: true } },
      ],
    },
    sarnic: {
      title: 'Su saati',
      ill: 'cistern',
      sound: 'cistern',
      text: 'Heykel taş. Gagası bir yuva, gövdesi dişli. Bunun bir saat olduğunu ancak şimdi anlıyorsun. Kanallar kaideden Eminönü\'ne doğru gidiyor.\n\nHer damla bir sütunu ayrı sayıyor. Şıp, şıp. Su, ayakkabının dikişini yokluyor. Yukarıda şehir, habersiz.',
      choices: [
        { t: 'Gagayı incele', to: 'riza', set: { sawBeak: true } },
        { t: 'Mektubu yüksek sesle oku', to: 'riza', set: { bluffReady: true } },
        { t: 'Saati Leyla\'nın avucuna koy', to: 'riza', set: { gaveEarly: true } },
      ],
    },
    yalniz: {
      title: 'Tek başına',
      ill: 'passage',
      sound: 'cistern',
      text: 'Leyla yukarıda ya da geride. Şıp şıp çoğalıyor, artık sağdan. Heykelin gagası karanlıkta bir yarık.\n\nTek başına hangi yöne çevrileceğini bilmiyorsun. Su yükselmiyor henüz. Yalnızca bekliyor.',
      choices: [
        { t: 'Saati gagaya tak, akrebi ileri it', to: 'end_tufan' },
        { t: 'Merdiveni karanlıkta ara', to: 'end_yalniz' },
        { t: 'Leyla\'nın adını bağır', to: 'riza', set: { called: true } },
      ],
    },
    riza: {
      title: 'Paltonun sahibi',
      ill: 'figure',
      sound: 'cistern',
      text(s) {
        let t = 'Rıza suyun içinden geliyor. Palto ıslak, öksürük aynı öksürük. Garson, sahibi, ikisi de o.\n\n';
        if (s.ambush) t += 'Yukarıya seslenmen onu da indirdi.\n\n';
        if (s.called) t += 'Leyla adını duyup merdivenden iniyor, nefes nefese.\n\n';
        if (s.gaveEarly) t += 'Saat çoktan Leyla\'nın avucunda.\n\n';
        if (s.bluffReady) t += 'Mektubun cümleleri dilinin ucunda.\n\n';
        t += '«Garsonluk biter» diyor. «Saat bende durursa şehir susar.» Leyla heykelin yanında. Kemal henüz yok.';
        return t;
      },
      choices: [
        { t: 'Mektubu göster, vakit kazan', to: 'atis' },
        { t: 'Saati Rıza\'ya ver', to: 'end_olta' },
        { t: 'Saati kendin gagaya geçir, ileri kur', to: 'end_tufan' },
      ],
    },
    atis: {
      title: 'Son dişli',
      ill: 'cistern',
      sound: 'cistern',
      text(s) {
        const bluff = s.bluffReady || s.readLetter
          ? 'Rıza mektuba bakıyor. Son satırı tanımıyor. Bir adım şaşırıyor.'
          : 'Zarfı görüyor, içini değil. Yine de bir adım şaşırıyor.';
        const hand = s.gaveEarly
          ? 'Saat Leyla\'nın avucunda sıcak.'
          : 'Saat senin avucunda sıcak. Heykelin gagası Leyla\'nın eline yakın.';
        return bluff + '\n\n' + hand + '\n\nYukarıdan, çok uzak, bir düdük var. Polis mi, vapur mu, belli değil. Şıp. Şıp. Su sabırsız.';
      },
      choices: [
        { t: 'Saati Leyla\'ya fırlat, kilidi o çevirsin', to: 'end_bekci' },
        { t: 'Saati Rıza\'nın uzanan eline bırak', to: 'end_olta' },
        { t: 'Akrebi ileri kaçırıp gagaya bas', to: 'end_tufan' },
      ],
    },
    end_bekci: {
      ending: 'bekci',
      endName: 'Bekçi',
      endBlurb: 'Artık bekçi sensin.',
      title: 'Bekçi',
      ill: 'watch',
      sound: 'street',
      text: 'Leyla saati havada tutuyor. Gagaya oturtuyor, akrebi geri alıyor. Dişliler bir kez öksürür gibi yapıyor, sonra kilit. Su sütunların dibine çekiliyor.\n\nKemal merdivende. Arkasında iki polis. Rıza\'nın palto cebinden senin peçeten çıkıyor. Mektup ıslandı, işini gördü.\n\nSaatin kapağı, ıslak ışıkta, yeni bir cümle gösteriyor. Kazı yeni değilmiş: «Aferin oğlum. Artık bekçi sensin.»',
    },
    end_tufan: {
      ending: 'tufan',
      endName: 'Tufan',
      endBlurb: 'Eminönü suyun altında.',
      title: 'Tufan',
      ill: 'flood',
      sound: 'street',
      text: 'Akrebi ileri kaçıyor. Heykel suyu yutmak yerine kusuyor. Önce bir uğultu, sonra Eminönü\'nün altından tahta çatırtısı.\n\nLeyla «Geri!» diye bağırıyor. Geç kalıyorsun. Rıza gülmüyor. O da ıslanıyor.\n\nYukarı çıktığında köprünün altı dere olmuş. Saat sende değil. Şehir o gece balık gibi nefes alıyor.',
    },
    end_olta: {
      ending: 'olta',
      endName: 'Olta',
      endBlurb: 'Saat Rıza\'da kaldı.',
      title: 'Olta',
      ill: 'figure',
      sound: 'street',
      text: 'Rıza saati avucunda tartıyor, martıya bakıyor, gülümsüyor. «Garson bahşişi» diyor. Kapağı kapatıyor.\n\nGarson oydu, sahibi oydu. Uyarıyı da o vermişti, seni Leyla\'dan ayırmak için. Eldivenler yağmurda bir leke gibi kalıyor. Yetişemiyorlar.\n\nErtesi sabah Eminönü suskun. Saat Rıza\'da. Kanallar onun saatinde.',
    },
    end_yalniz: {
      ending: 'yalniz',
      endName: 'Karanlık Su',
      endBlurb: 'Kilit yarım, su eşikte.',
      title: 'Karanlık Su',
      ill: 'passage',
      sound: 'street',
      text: 'Karanlıkta merdiven yer değiştiriyor. Şıp şıp artık sağdan. Saati bir çıkıntıya koyuyorsun, bir daha bulamıyorsun.\n\nYukarıya vardığında şafak sökmemiş. Leyla köprüde, eldivenleri çıkmış, elleri boş. «Kilit yarım kaldı» diyor.\n\nEminönü\'de su, dükkânların eşiğini yokluyor. Taşmıyor. Çekilmiyor da.',
    },
    end_goz: {
      ending: 'goz',
      endName: 'Martının Gözü',
      endBlurb: 'Dokuz, dışarıdan kilit.',
      title: 'Martının Gözü',
      ill: 'eye',
      sound: 'street',
      text: 'Saati dokuza kurunca martının gözü ince bir kapak gibi açılıyor. İçinde babanın ikinci cümlesi, kazınmış: dışarıdan dokuz, içeriden kilit.\n\nPompa bir kez yutkunuyor. Kanallar, sarnıca inmeden, uykuya yatıyor. Rıza\'nın öksürüğü köprünün üstünde kalıyor. Aşağı inmiyorsun.\n\nLeyla yağmurun içinden geliyor. Kapağa birlikte bakıyorsunuz. Yazı orada: «Aferin oğlum. Artık bekçi sensin.» Kemal düdük çalmıyor. Bu gece polis yok. Sadece martı, sadece dokuz.',
    },
  },
});
