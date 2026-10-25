'use strict';

/*
 * Martılı Saat — Ocak 1955.
 * Her dizi bir ekran sayfasıdır. Notlar bayrak ve yön olarak uygulanır;
 * sahne kodu ekrana yazılmaz.
 * S08 notu «lokantadan ya da Pera yolundan» diyor. Önlük sahnesi (S09)
 * ancak Rıza'yı henüz görmemiş lokanta yolunda anlamlı. Pera (P3) ve
 * kuyudan geri dönüş (S10) S09'u atlar. Düz masa yolu S09'a gider.
 */
(function (Sarnic) {
  const IMG = 'stories/martili-saat/img/';

  const KEY = {
    S01: 'lokanta', S02: 'lokanta',
    S03: 'kirmizi-eldiven', S04: 'kirmizi-eldiven',
    S05: 'masa-ipuclari', S06: 'masa-ipuclari', S07: 'masa-ipuclari', S08: 'masa-ipuclari',
    S09: 'rizanin-onlugu',
    S10: 'kuyu-agzi',
    P1: 'pera-yokusu',
    P2: 'pera-arka-kapi', P3: 'pera-arka-kapi',
    S11: 'kopru-iskele', S12: 'kopru-iskele',
    S13: 'tas-kapi', S14: 'tas-kapi', S15: 'tas-kapi',
    S16: 'sarnic', S17: 'sarnic',
    S18: 'riza-ve-su-saati', S19: 'riza-ve-su-saati',
    S20: 'kilit', S21: 'kilit',
    'E-BEKCI': 'son-bekci',
    'E-GOZ': 'son-martinin-gozu',
    'E-TUFAN': 'son-tufan',
    'E-OLTA': 'son-olta',
    'E-ARKA': 'son-arka-kapi',
  };

  const SOUND = {
    S01: 'room', S02: 'room', S03: 'room', S04: 'room', S05: 'room',
    S06: 'room', S07: 'room', S08: 'room', S09: 'room', S10: 'room',
    P1: 'street', P2: 'street', P3: 'street',
    S11: 'street', S12: 'street', S13: 'street', S14: 'street', S15: 'street',
    S16: 'cistern', S17: 'cistern', S18: 'cistern', S19: 'cistern',
    S20: 'cistern', S21: 'cistern',
    'E-BEKCI': 'cistern', 'E-GOZ': 'cistern', 'E-OLTA': 'cistern',
    'E-TUFAN': 'street', 'E-ARKA': 'street',
  };

  const ENDING = {
    'E-BEKCI': 'Bekçi',
    'E-GOZ': 'Martının Gözü',
    'E-TUFAN': 'Tufan',
    'E-OLTA': 'Olta',
    'E-ARKA': 'Arka Kapı',
  };

  const SCENE = {
    S01: {
      next: 'S02',
      text: [
        'Ocak 1955. Lodos, Galata Köprüsü\'nün demirlerini inletiyor. Köprünün altındaki balık lokantasında camlar buğulu, sobada odun çıtırdıyor.',
        'Kırk gün önce babanı, Hasırcılar\'daki saatçi Hikmet Usta\'yı toprağa verdin. Karabük\'teki fabrikadan izin alıp İstanbul\'a döndün ama bu şehirde hâlâ yabancı gibisin.',
        'Bu sabah otele göndereni yazmayan bir paket geldi. İçinden kapağında martı kabartması olan gümüş bir cep saati çıktı.',
      ],
    },
    S02: {
      next: 'S03',
      text: [
        'Yaşlı, bıyıklı garson çayını bırakırken tabağın altına katlanmış sarı bir kağıt sıkıştırıyor ve tek kelime etmeden uzaklaşıyor.',
        'Kağıtta aceleyle yazılmış bir satır var: “Saat 9\'da Pera Palas\'ın arka kapısı. Saati getir. Kimseye söyleme.”',
        'Saatin kapağını açıyorsun: tam sekiz. Dışarıda bir vapur düdüğü sise karışıyor. Garson mutfak kapısının önünde sigarasını yakıyor. Kalkıp yanına gidiyorsun.',
      ],
    },
    S03: {
      text: [
        '“Bu kağıdı kim verdi?”',
        'Garson sesini alçaltıyor: “Fötr şapkalı, uzun paltolu bir adam efendim. ‘Martılı saati taşıyan misafir’ dedi. Bir de şunu söylememi istedi: Kırmızı eldivenli kadına güvenme.”',
        'O anda cam kapı açılıyor. Kırmızı eldivenli, şık bir kadın içeri giriyor, doğruca senin boş masana oturup bir gazete açıyor. Garson “Ben bir şey söylemedim” diyerek mutfağa kayboluyor. Saat 8:15.',
      ],
      choices: [
        { t: 'Masana dön, kadının karşısına otur', to: 'S04' },
        { t: 'Mutfağın arka kapısından çık, Pera\'ya tırman', to: 'P1' },
        { t: 'Bir süre uzaktan kadını izle', to: 'S04' },
      ],
    },
    S04: {
      next: 'S05',
      text: [
        '“Garson beni kötüledi, değil mi?” Otuzlarında bir kadın. Gülümsüyor ama gözleri gülmüyor. “Fötr şapkalı adamın adı Kemal. O saat için geldi.”',
        'Eldivenli parmağıyla kapaktaki martıya dokunuyor. “İçinde bir harita var. Babanız saati size göndermemi istemişti. Paketi ben yolladım. Saat 9\'da Pera Palas\'a giderseniz sizi Kemal ve iki adamı bekliyor olacak.”',
        'Camın ardındaki siste fötr şapkalı bir gölge belirip kayboluyor. Saat 8:25.',
      ],
    },
    S05: {
      text: [
        'Saati açıyorsun. Kadranın arkasına incecik bir harita kazınmış: Sarayburnu, Sirkeci ve aralarında yerin altından geçen kesik bir çizgi. Çizginin ucunda bir martı ve silik bir yazı: “Yerebatan değil. Balıkçının kuyusu.”',
        'Kadın haritaya eğilirken eldiveni sıyrılıyor. Bileğinde solmuş bir dövme var: küçük bir çapa ve iki harf, K ile L.',
        '“Hadi,” diyor, “vaktimiz az.” Saat 8:35.',
      ],
      choices: [
        { t: 'Belli etme; önce ne istediğini sor', to: 'S08' },
        { t: 'Dövmeyi doğrudan sor', to: 'S06' },
        { t: '“Balıkçının kuyusu” burası olabilir: garsona koş', to: 'S10' },
      ],
    },
    S06: {
      text: [
        'Kadın eldivenini yavaşça indiriyor. “Dikkatlisiniz. Babanız gibi.”',
        '“Babama göre çok gençsiniz. Onu nereden tanıyorsunuz?”',
        'Bir fotoğraf çıkarıyor: dükkanın önünde baban ve küçük bir kız. Babanın elinde aynı martılı saat. “O kız benim, adım Leyla. Babamız balıkçıydı, denizde kaldı. Kemal\'le beni babanız yanına aldı, bana saat tamirini öğretti. Çapa babamızın işaretiydi. Kemal ise sonra yanlış insanlarla iş tuttu.”',
      ],
      choices: [
        { t: '“Babamdan bana kalan başka bir şey var mı?” diye sor', to: 'S08' },
        { t: 'Fotoğrafa daha dikkatli bak', to: 'S07' },
        { t: 'Leyla\'yı da al, garsonun yanına git', to: 'S10' },
      ],
    },
    S07: {
      next: 'S08',
      text: [
        'Fotoğrafta bir şey gözüne takılıyor: babanın başparmağı martının gözüne bastırıyor. “Hep öyle tutardı,” diyor Leyla. “Huyuydu.”',
        'Kendi saatindeki martının gözüne bastırıyorsun. Tık. Kapağın içinde ikinci, minicik bir kapak açılıyor. İçinde sigara kağıdı inceliğinde bir not: “Kemal\'e: Seni de oğlum bildim. Kapı sana da açık. H.”',
        'Leyla\'nın gözleri doluyor. Notu katlayıp cebine koyuyorsun.',
      ],
    },
    S08: {
      text: [
        'Leyla açılmış bir zarf uzatıyor. “Babanız ölmeden önce bunu size elden vermemi istedi. Dün gece evime biri girdi. Bulduğumda zarf açıktı.”',
        '“Evladım, saat artık sende. Sarnıçta hazine yok. Orada Bizans\'tan kalma bir su saati var. Şehrin altındaki eski su yollarının kapaklarını o yönetir. Martı saati tanır: dokuzda kapıyı açar, ibreler geri çevrilince kilitler. Leyla\'ya güven, Kemal\'i de kaybetme. Asıl dikkat edeceğin kişi, bu sırrı kırk yıl önce satmak isteyen adam: Balıkçı Rıza. Baban.”',
      ],
    },
    S09: {
      next: 'S11',
      text: [
        'Başını kaldırıyorsun. Mutfak kapısının buğulu camının ardında yaşlı garson sana el sallıyor. Önlüğünün göğsünde işlemeli bir isim: Rıza.',
        'Leyla fısıldıyor: “Lokantanın sahibi o. Kendi lokantasında garsonluk yapar, herkesi dinler. Kemal ona borçlu, ne derse yapar.”',
        'Demek seni Pera\'ya çağıran notu Kemal\'e yazdıran da, seni Leyla\'ya karşı uyaran da oydu. Leyla koluna giriyor: “Burada kalamayız.”',
      ],
    },
    S10: {
      text: [
        '“Balıkçının kuyusu mu?” Garson gülümsüyor. “Gelin efendim.”',
        'Mutfağın dibindeki taş fırının demir kapağını omzuyla itiyor. Ardında karanlık bir kuyu ağzı açılıyor. Nemli bir soğuk yükseliyor, aşağıdan damla sesleri geliyor. Bir ip merdiven sarkıyor.',
        '“Babanız buradan inerdi. Önce siz buyurun.” Leyla\'nın parmakları kolunu sıkıyor. Garsonun önlüğünde işlemeli bir isim var: Rıza.',
      ],
      choices: [
        { t: 'Merdivenden in', to: 'E-OLTA' },
        { t: '“Önce mektubu okumak istiyorum” de, masaya dön', to: 'S08' },
        { t: 'Leyla\'nın elini tut, sokak kapısından kaç', to: 'S08' },
      ],
    },
    P1: {
      next: 'P2',
      text: [
        'Mutfağın arka kapısından buz gibi rüzgara çıkıyorsun. Yüksekkaldırım\'ın dik basamakları siste kayboluyor. Arkanda kimse yok, ya da sen öyle sanıyorsun.',
        'Galata Kulesi\'nin karanlık gövdesini geçip Tepebaşı\'na varıyorsun. Pera Palas\'ın arka sokağı ıssız, mutfak bacalarından buhar yükseliyor.',
        'Saat 8:55. Arka kapının önünde fötr şapkalı, uzun paltolu bir adam bekliyor. İki yanında iri yarı iki gölge.',
      ],
    },
    P2: {
      text: [
        '“Martılı saat,” diyor adam. Sesi sakin ama yorgun. “Ben Kemal. Saati ver, kimse üzülmesin.”',
        'İri adamlardan biri bir adım atıyor. Kemal elini kaldırıp onu durduruyor. Ama adamın ona değil, başka birine çalıştığı belli.',
        'Gözün Kemal\'in bileğine takılıyor: solmuş bir çapa dövmesi, yanında K ile L. Cebindeki saat tik takla dokuza yaklaşıyor.',
      ],
      choices: [
        { t: 'Saati ver', to: 'E-ARKA' },
        { t: '“Bu notu sana kim yazdırdı?” diye sor', to: 'P3' },
        { t: 'Arkanı dön, sise doğru koş', to: 'P3' },
      ],
    },
    P3: {
      next: 'S08',
      text: [
        'O an kırmızı eldivenli bir el seni hizmet kapısından içeri çekiyor. Buharlı mutfaklardan, şaşkın aşçıların arasından koşuyorsunuz.',
        '“Adım Leyla,” diyor kadın nefes nefese. “Babanızın çırağıyım. Kemal ağabeyim. Balıkçı Rıza\'ya borcu var, onun adına çalışıyor.”',
        'Başka bir kapıdan çıkıp Haliç\'e doğru iniyorsunuz. Bir sokak lambasının altında duruyor ve çantasını açıyor.',
      ],
    },
    S11: {
      next: 'S12',
      text: [
        'Leyla saati alıp haritaya eğiliyor. “Yol lokantada başlamıyor, yalnızca altından geçiyor. Başlangıç burada: köprübaşındaki taş rıhtım.”',
        'Köprübaşındaki taş rıhtımdan eski balıkçı iskelesine iniyorsunuz. Martılar demirlere dizilmiş, dalgalar taşlara vuruyor.',
        'Sisin içinde paslı bir el pompası duruyor. Gövdesinde saatin kapağındakiyle aynı martı kabartması, ortasında saat büyüklüğünde yuvarlak bir oyuk. Saat 8:57.',
      ],
    },
    S12: {
      text: [
        'Arkanızdan ayak sesleri geliyor. İskele merdiveninin başında fötr şapkalı bir adam beliriyor, yanında iki iri adam.',
        '“Leyla,” diyor sakin bir sesle. “Kardeşim. Yine yanlış tarafı seçmişsin.”',
        'Leyla\'nın sesi titriyor: “Rıza sana altın mı söz verdi, Kemal? Aşağıda altın yok.” Kemal bir an duraksıyor. Adamları duraksamıyor. Biri ceketinin içine uzanıyor.',
      ],
      choices: [
        { t: 'Saati pompanın oyuğuna bastır', to: 'S13' },
        { t: 'Kemal\'e babanın mektubunu anlat', to: 'S14' },
        { t: 'Leyla\'yı korumak için saati Kemal\'e ver', to: 'E-ARKA' },
      ],
    },
    S13: {
      text: [
        'Saati oyuğa bastırıyorsun, tam oturuyor. İçerideki bronz dişliler saatin kurgusunu kavrıyor. İbreler kendi kendine dönüp dokuzda duruyor.',
        'Yerin altından derin, metalik bir gıcırtı geliyor. İskelenin yanındaki taş zemin kayarak açılıyor, aşağı nemli basamaklar iniyor.',
        'Adamlar koşmaya başlıyor. Leyla saati oyuktan çekip eline tutuşturuyor: “Saat çıkınca kapı kapanır!” Taş geri kaymaya başladı bile.',
      ],
      choices: [
        { t: 'Leyla\'yla aşağı atla', to: 'S16' },
        { t: 'Leyla\'yı aşağı it, adamları sen oyala', to: 'S15' },
        { t: 'Babanın kağıdını Kemal\'e fırlat, sonra atla', to: 'S16' },
      ],
    },
    S14: {
      text: [
        '“Babam mektubunda senin adını da yazmış, Kemal. ‘Kaybetme’ demiş. Rıza seni kullanıyor. Aşağıda altın değil, şehri sular altında bırakabilecek bir makine var.”',
        'Kemal\'in eli bileğindeki çapaya gidiyor. Ama adamlardan biri üstüne atılıp saati kapmaya çalışıyor. Boğuşmada saat pompanın oyuğuna çarpıyor ve tık diye oturuyor.',
        'İbreler dokuzda duruyor, taş zemin açılıyor. Leyla saati çekip sana uzatıyor. Taş kapanmaya başladı bile.',
      ],
      choices: [
        { t: 'Leyla\'yla aşağı atla', to: 'S16' },
        { t: 'Leyla\'yı aşağı it, adamları sen oyala', to: 'S15' },
        { t: 'Babanın kağıdını Kemal\'e fırlat, sonra atla', to: 'S16' },
      ],
    },
    S15: {
      next: 'E-TUFAN',
      text: [
        'Leyla\'yı basamaklara itiyorsun. Taş gümbürtüyle kapanıyor. İri adamlar kollarını büküyor, yüzün ıslak taşlara yapışıyor.',
        'Kemal “Bırakın onu!” diye bağırıyor ama sözü geçmiyor. Seni lokantaya sürüklüyorlar. Mutfak boş, fırının ardındaki kuyu açık.',
        'Aşağıdan, çok derinlerden bir gürleme yükseliyor. Leyla orada yalnız.',
      ],
    },
    S16: {
      next: 'S17',
      text: [
        'Basamaklara atlıyorsunuz. Arkanızda taş gümbürtüyle kapanıyor. Kemal\'in bağırışı boğuk bir yankıya dönüşüp kesiliyor.',
        'Basamakların dibinde nefesin kesiliyor. Önünüzde devasa bir sarnıç uzanıyor. Onlarca mermer sütun kara suyun içinden yükseliyor. Tavandaki eski ızgaralardan sokak lambalarının soluk ışığı süzülüyor.',
        'Şıp. Şıp. Tavandan damlayan su, sessizliği bir saatin tıkırtısı gibi bölüyor.',
      ],
    },
    S17: {
      next: 'S18',
      text: [
        'Sarnıcın ortasında küçük bir taş adacık var. Üstünde insan boyunda, dişlilerle ve borularla kaplı bronz bir mekanizma duruyor: su saati. Tepesinde kanatlarını açmış bronz bir martı var, gagası aralık.',
        'Babanın işareti buymuş. Kırk yıl önce burada görmüş olmalı.',
        'Adacığa giden dar taş yolda yeni, ıslak ayak izleri var. Yanlarında kuyu ipinde yırtılmış, çamurlu bir önlük. Adacıkta bir fener yanıyor.',
      ],
    },
    S18: {
      text: [
        'Fenerin ardından yavaş bir alkış duyuluyor. Rıza ortaya çıkıyor ama artık yorgun bir garson değil. Dimdik duruyor, elinde paslı bir levye var.',
        '“Babanın evladı olduğun belli.” Levyeyi büyük demir kola dayıyor. “Saat olmadan martı beni tanımaz. Ama bu kolu çekersem eski su yollarının kapakları açılır, bir saat içinde Eminönü\'yü su basar. Saati ver. Suyu yöneten adama bu şehir her şeyi öder, sana da pay veririm.”',
        'Martı, Rıza\'nın tam arkasında.',
      ],
      choices: [
        { t: 'Saati ver; Eminönü\'yü kurtarmanın tek yolu bu', to: 'E-OLTA' },
        { t: 'Saati gizlice Leyla\'ya ver, Rıza\'yı konuşturup oyala', to: 'S20' },
        { t: 'Blöf yap: “Babam senin hakkında başka şeyler de yazmış…”', to: 'S19' },
      ],
    },
    S19: {
      text: [
        'Mektubu havaya kaldırıyorsun. “Babam kırk yıl önce sana ne teklif ettiğini de yazmış, onu kime ihbar ettiğini de.”',
        'Tamamen blöf. Ama Rıza\'nın levyeyi tutan eli titriyor. “Yalan,” diyor, sesi çatallanıyor.',
        'Yana, sütunlara doğru yürüyorsun. Rıza gözünü senden ayırmadan dönüyor ve martıya sırtını açıyor. Leyla suyun kenarından martının dibine süzülüyor. Saat hâlâ senin cebinde. Aranızda beş altı metre var.',
      ],
      choices: [
        { t: 'Saati Leyla\'ya fırlat', to: 'S20' },
        { t: 'Martıya kendin koş', to: 'E-TUFAN' },
        { t: '“Tamam, veriyorum” de, son anda elini çek', to: 'E-OLTA' },
      ],
    },
    S20: {
      next: 'S21',
      text: [
        'Gümüş saat sütunların arasından parlayarak süzülüyor. Rıza “Hayır!” diye bağırıp levyeye yükleniyor. Kol gıcırdayarak iniyor, uzaklardan suyun gürlemesi geliyor.',
        'Leyla saati martının gagasına takıyor ve ibreleri geri çeviriyor. Dokuz… sekiz buçuk… sekiz…',
        'Derin bir “klank” sarnıcı sarsıyor. Dişliler duruyor, kol yarı yolda kilitleniyor, gürleme yavaşça kesiliyor. Rıza dizlerinin üstüne çöküyor. “Kırk yıl,” diye mırıldanıyor. “Kırk yıl bekledim.”',
      ],
    },
    S21: {
      text: [
        'Sarnıcın öbür ucunda fener ışıkları beliriyor. Kuyunun ip merdiveninden Kemal iniyor, ardında iki polis var.',
        '“Taş kapanınca lokantaya gittim,” diyor Kemal. “Rıza\'nın masasında yabancı bir alıcıyla yazışmalarını buldum. Altın lafı yalanmış. Karakola koştum.”',
        'Polisler Rıza\'nın kollarına giriyor. Leyla saati gagadan çıkarıp sana uzatıyor.',
      ],
    },
    'E-BEKCI': {
      text: [
        'Kapağı açıyorsun. Kilitle birlikte haritanın altındaki gizli yay boşalmış, ince bir pirinç levha kalkmış. Üstünde babanın eğik harfleri var: “Aferin evladım. Artık bekçi sensin.”',
        'Yukarıda lodos diniyor. Sabah Eminönü uyandığında kimse ayaklarının altında neler olduğunu bilmeyecek. Sen bileceksin.',
      ],
    },
    'E-GOZ': {
      text: [
        'Kemal avucundaki ince kağıdı gösteriyor. “Seni de oğlum bildim…” Sesi kırılıyor. “Taş kapanırken elime düştü. Okuyunca Rıza\'nın adamlarını bırakıp koştum.”',
        'Leyla ağabeyine sarılıyor. İki solgun çapa yan yana duruyor.',
        'Kapağın içindeki levhada babanın yazısı var: “Aferin evladım. Artık bekçi sensin.” Martının gözüne bastırınca altında bir satır daha beliriyor: “Yalnız değilsin.”',
      ],
    },
    'E-TUFAN': {
      text: [
        'Sabah Eminönü\'nün bodrumları, Mısır Çarşısı\'nın dükkanları ve tramvay rayları kahverengi suyun altında. Gazeteler “Asırlık su yolları çöktü” diye yazıyor. Kimse gerçeği bilmiyor.',
        'Saat cebinde hâlâ çalışıyor. Ama artık her tıkırtısı bir sitem gibi.',
      ],
    },
    'E-OLTA': {
      text: [
        'Kırk yıl balık tutmuş eller hızlıdır. Saat bir anda Rıza\'nın avucunda. Martının gagasına takıp ibreleri dokuzda tutuyor. Mekanizma uyanıyor, su yolları birer birer homurdanıyor.',
        '“Oltaya gelen balığa kızılmaz,” diyor gülerek.',
        'Haftalar sonra şehrin suyunu “onaran” gizemli bir şirketten söz ediliyor. Faturaları Balıkçı Rıza\'nın lokantasına gidiyor.',
      ],
    },
    'E-ARKA': {
      text: [
        'Saati uzatıyorsun. Kemal bir şey söyleyecekmiş gibi saate bakıyor ama iri adamlardan biri saati onun elinden kapıyor.',
        'Gece yarısı ıslak bir arka sokakta tek başına kalıyorsun, elinde boş bir köstek. Üç gün sonra Rıza\'nın lokantası kapalı. Kapıda bir not var: “Tadilat.”',
        'Ayaklarının altında, çok derinde, bir şey çalışmaya başlıyor.',
      ],
    },
  };

  function swapFirst(paragraph, sentence) {
    const i = paragraph.indexOf('. ');
    if (i < 0) return sentence;
    return sentence + ' ' + paragraph.slice(i + 2);
  }

  function lines(id, flags) {
    const scene = SCENE[id];
    if (!scene) return null;
    const flagsNow = flags || {};
    const text = scene.text.slice();
    if (id === 'S19' && flagsNow.paper === 'mektup') {
      text[0] = swapFirst(text[0], '“Mektup Kemal\'de, Rıza. Şu an Karaköy Karakolu\'nda okunuyor.”');
    }
    if (id === 'S20' && flagsNow.quiet) {
      text[0] = swapFirst(text[0], 'Rıza konuşmanın ortasında Leyla\'nın gölgesini fark ediyor.');
    }
    const lead = [];
    if (id === 'S04' && flagsNow.watched) {
      lead.push('Kadın gazetesinin üstünden doğrudan sana bakıyor ve karşısındaki sandalyeyi gösteriyor.');
    }
    if (id === 'P3' && flagsNow.asked) {
      lead.push('Kemal bir an duraksıyor. Adamları değil, o duraksıyor.');
    }
    if (id === 'P3' && flagsNow.ran) {
      lead.push('Ayak sesleri arkanda büyüyor.');
    }
    if (id === 'S11' && flagsNow.fromPera) {
      lead.push('“Balıkçı Rıza,” diyor Leyla, “size çayı getiren yaşlı garson.”');
    }
    if (id === 'S16' && flagsNow.paper) {
      lead.push('Son anda kağıdın Kemal\'in eline düştüğünü gördün.');
    }
    if (id === 'E-TUFAN' && flagsNow.self) {
      lead.push('Rıza levyeyi bırakıp bütün ağırlığıyla kola asılıyor. Saati gagaya taktığında kol sonuna kadar inmiş.');
    }
    if (id === 'E-TUFAN' && flagsNow.above) {
      lead.push('Leyla tek başına martıya yetişemiyor.');
    }
    if (id === 'E-OLTA' && flagsNow.well) {
      lead.push('Dipte ayağın suya değdiğinde ip merdiven yukarı çekiliyor. Rıza\'nın feneri tepende: ‘Saati at, merdiveni atayım.’');
    }
    if (id === 'E-ARKA' && flagsNow.bridge) {
      lead.push('Leyla\'nın çığlığı siste kayboluyor.');
    }
    return lead.concat(text);
  }

  function arrive(id, via, index, flags) {
    if (id === 'S04') flags.watched = via === 'S03' && index === 2;
    if (id === 'S07') flags.goz = true;
    if (id === 'S08') {
      flags.fromPera = via === 'P3';
      flags.fledWell = via === 'S10';
    }
    if (id === 'P3') {
      flags.asked = via === 'P2' && index === 1;
      flags.ran = via === 'P2' && index === 2;
    }
    if (id === 'S16' && (via === 'S13' || via === 'S14') && index === 2) {
      if (flags.goz) {
        flags.not = true;
        flags.paper = 'not';
      } else {
        flags.paper = 'mektup';
      }
    }
    if (id === 'S20') flags.quiet = via === 'S18';
    if (id === 'E-ARKA') flags.bridge = via === 'S12';
    if (id === 'E-TUFAN') {
      flags.above = via === 'S15';
      flags.self = via === 'S19';
    }
    if (id === 'E-OLTA') flags.well = via === 'S10';
  }

  function next(id, flags) {
    const flagsNow = flags || {};
    if (id === 'S08') return (flagsNow.fromPera || flagsNow.fledWell) ? 'S11' : 'S09';
    if (id === 'S21') return (flagsNow.goz && flagsNow.not) ? 'E-GOZ' : 'E-BEKCI';
    const scene = SCENE[id];
    return (scene && scene.next) || null;
  }

  Sarnic.story({
    id: 'martili-saat',
    current: true,
    cover: IMG + 'kapak.webp',
    coverSound: 'street',
    start: 'S01',
    ids: function () { return Object.keys(SCENE); },
    image: function (id) { return KEY[id] ? IMG + KEY[id] + '.webp' : null; },
    sound: function (id) { return SOUND[id] || 'room'; },
    lines: lines,
    choices: function (id) {
      const scene = SCENE[id];
      return scene && scene.choices ? scene.choices : null;
    },
    next: next,
    arrive: arrive,
    endingName: function (id) { return ENDING[id] || null; },
  });
})(window.Sarnic);
