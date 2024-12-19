export const countryInfo = {
  continents: {
    AF: 'Africa',
    AN: 'Antarctica',
    AS: 'Asia',
    EU: 'Europe',
    NA: 'North America',
    OC: 'Oceania',
    SA: 'South America'
  },
  countries: {
    AD: {
      name: 'Andorra',
      native: 'Andorra',
      phone: '376',
      continent: 'EU',
      capital: 'Andorra la Vella',
      currency: 'EUR',
      languages: 'ca',
      numeric: '020'
    },
    AE: {
      name: 'United Arab Emirates',
      native: 'دولة الإمارات العربية المتحدة',
      phone: '971',
      continent: 'AS',
      capital: 'Abu Dhabi',
      currency: 'AED',
      languages: 'ar',
      numeric: '784'
    },
    AF: {
      name: 'Afghanistan',
      native: 'افغانستان',
      phone: '93',
      continent: 'AS',
      capital: 'Kabul',
      currency: 'AFN',
      languages: 'ps,uz,tk',
      numeric: '004',
      regions: [
        {
          name: 'Capital',
          native: 'مرکزی حوزه',
          districts: [
            { name: 'Kapisa', native: 'کاپیسا' },
            { name: 'Panjsher', native: 'پنجشیر' },
            { name: 'Kabul', native: 'کابل' },
            { name: 'Maidan Wardak', native: 'میدان وردک' },
            { name: 'Logar', native: 'لوگر' },
            { name: 'Parwan', native: 'پروان' }
          ]
        },
        {
          name: 'Central Highland',
          native: 'لوړه مرکزی حوزه',
          districts: [
            { name: 'Daykundi', native: 'دایکندی' },
            { name: 'Bamyan', native: 'بامیان' }
          ]
        },
        {
          name: 'Eastern',
          native: 'ختیځه حوزه',
          districts: [
            { name: 'Nuristan', native: 'نورستان' },
            { name: 'Laghman', native: 'لغمان' },
            { name: 'Kunar', native: 'کنر ها' },
            { name: 'Nangarhar', native: 'ننگرهار' }
          ]
        },
        {
          name: 'North Eastern',
          native: 'سهیل ختیځه حوزه',
          districts: [
            { name: 'Kunduz', native: 'کندز' },
            { name: 'Takhar', native: 'تخار' },
            { name: 'Badakhshan', native: 'بدخشان' },
            { name: 'Baghlan', native: 'بغلان' }
          ]
        },
        {
          name: 'Northern',
          native: 'سهیلی حوزه',
          districts: [
            { name: 'Faryab', native: 'فاریاب' },
            { name: 'Jawzjan', native: 'جوزجان' },
            { name: 'Sar-e-Pul', native: 'سرپل' },
            { name: 'Balkh', native: 'بلخ' },
            { name: 'Samangan', native: 'سمنگان' }
          ]
        },
        {
          name: 'South Eastern',
          native: 'جنوب ختیځه حوزه',
          districts: [
            { name: 'Ghazni', native: 'غزنی' },
            { name: 'Paktika', native: 'پکتیکا' },
            { name: 'Paktya', native: 'پکتیا' },
            { name: 'Khost', native: 'خوست' }
          ]
        },
        {
          name: 'Southern',
          native: 'جنوبی حوزه',
          districts: [
            { name: 'Nimroz', native: 'نیمروز' },
            { name: 'Uruzgan', native: 'ارزگان' },
            { name: 'Hilmand', native: 'هلمند' },
            { name: 'Zabul', native: 'زابل' },
            { name: 'Kandahar', native: 'کندهار' }
          ]
        },
        {
          name: 'Western',
          native: 'لویدیځه حوزه',
          districts: [
            { name: 'Badghis', native: 'بادغیس' },
            { name: 'Farah', native: 'فراه' },
            { name: 'Hirat', native: 'هرات' },
            { name: 'Ghor', native: 'غور' }
          ]
        }
      ]
    },
    AG: {
      name: 'Antigua and Barbuda',
      native: 'Antigua and Barbuda',
      phone: '1268',
      continent: 'NA',
      capital: "Saint John's",
      currency: 'XCD',
      languages: 'en',
      numeric: '028'
    },
    AI: {
      name: 'Anguilla',
      native: 'Anguilla',
      phone: '1264',
      continent: 'NA',
      capital: 'The Valley',
      currency: 'XCD',
      languages: 'en',
      numeric: '660'
    },
    AL: {
      name: 'Albania',
      native: 'Shqipëria',
      phone: '355',
      continent: 'EU',
      capital: 'Tirana',
      currency: 'ALL',
      languages: 'sq',
      numeric: '008'
    },
    AM: {
      name: 'Armenia',
      native: 'Հայաստան',
      phone: '374',
      continent: 'AS',
      capital: 'Yerevan',
      currency: 'AMD',
      languages: 'hy,ru',
      numeric: '051'
    },
    AO: {
      name: 'Angola',
      native: 'Angola',
      phone: '244',
      continent: 'AF',
      capital: 'Luanda',
      currency: 'AOA',
      languages: 'pt',
      numeric: '024',
      regions: [
        {
          name: 'Bengo',
          native: 'Bengo',
          districts: [
            { name: 'Ambriz', native: 'Ambriz' },
            { name: 'Bula-Atumba', native: 'Bula-Atumba' },
            { name: 'Dande', native: 'Dande' },
            { name: 'Dembos', native: 'Dembos' },
            { name: 'Nambuangongo', native: 'Nambuangongo' },
            { name: 'Pango-Aluquem', native: 'Pango-Aluquém' }
          ]
        },
        {
          name: 'Benguela',
          native: 'Benguela',
          districts: [
            { name: 'Baia-Farta', native: 'Baía-Farta' },
            { name: 'Balombo', native: 'Balombo' },
            { name: 'Benguela', native: 'Benguela' },
            { name: 'Bocoio', native: 'Bocoio' },
            { name: 'Caimbambo', native: 'Caimbambo' },
            { name: 'Catumbela', native: 'Catumbela' },
            { name: 'Chongoroi', native: 'Chongorói' },
            { name: 'Cubal', native: 'Cubal' },
            { name: 'Ganda', native: 'Ganda' },
            { name: 'Lobito', native: 'Lobito' }
          ]
        },
        {
          name: 'Bie',
          native: 'Bié',
          districts: [
            { name: 'Andulo', native: 'Andulo' },
            { name: 'Camacupa', native: 'Camacupa' },
            { name: 'Catabola', native: 'Catabola' },
            { name: 'Chinguar', native: 'Chinguar' },
            { name: 'Chitembo', native: 'Chitembo' },
            { name: 'Cuemba', native: 'Cuemba' },
            { name: 'Cuito (Kuito)', native: 'Cuíto (Kuito)' },
            { name: 'Cunhinga', native: 'Cunhinga' },
            { name: "N'Harea (Nharea)", native: "N'Harea (Nharea)" }
          ]
        },
        {
          name: 'Cabinda',
          native: 'Cabinda',
          districts: [
            { name: 'Belize', native: 'Belize' },
            { name: 'Buco-Zau', native: 'Buco-Zau' },
            { name: 'Cabinda', native: 'Cabinda' },
            { name: 'Cacongo', native: 'Cacongo' }
          ]
        },
        {
          name: 'Cuando Cubango',
          native: 'Cuando Cubango',
          districts: [
            { name: 'Calai', native: 'Calai' },
            { name: 'Cuangar', native: 'Cuangar' },
            { name: 'Cuchi', native: 'Cuchi' },
            { name: 'Cuito Cuanavale', native: 'Cuito Cuanavale' },
            { name: 'Dirico', native: 'Dirico' },
            { name: 'Mavinga', native: 'Mavinga' },
            { name: 'Menongue', native: 'Menongue' },
            { name: 'Nancova', native: 'Nancova' },
            { name: 'Rivungo', native: 'Rivungo' }
          ]
        },
        {
          name: 'Cuanza Norte',
          native: 'Cuanza Norte',
          districts: [
            { name: 'Cahama', native: 'Cahama' },
            { name: 'Kuroka (Curoca)', native: 'Kuroka (Curoca)' },
            { name: 'Kuvelai (Cuvelai)', native: 'Kuvelai (Cuvelai)' },
            {
              name: 'Kwanhama (Cuanhama)',
              native: 'Kwanhama (Cuanhama)'
            },
            {
              name: 'Namakunde (Namacunde)',
              native: 'Namakunde (Namacunde)'
            },
            { name: 'Ombadja', native: 'Ombadja' }
          ]
        },
        {
          name: 'Cuanza Sul',
          native: 'Cuanza Sul',
          districts: [
            { name: 'Amboim (Gabela)', native: 'Amboim (Gabela)' },
            { name: 'Cassongue', native: 'Cassongue' },
            { name: 'Conda', native: 'Conda' },
            { name: 'Ebo', native: 'Ebo' },
            { name: 'Libolo (Calulo)', native: 'Libolo (Calulo)' },
            { name: 'Mussende', native: 'Mussende' },
            { name: 'Porto Amboim', native: 'Porto Amboim' },
            { name: 'Quibala', native: 'Quibala' },
            { name: 'Quilenda', native: 'Quilenda' },
            { name: 'Seles (Uku Seles)', native: 'Seles (Uku Seles)' },
            { name: 'Sumbe (Ngangula)', native: 'Sumbe (Ngangula)' },
            { name: 'Waku-Kungo (Cela)', native: 'Waku-Kungo (Cela)' }
          ]
        },
        {
          name: 'Cunene',
          native: 'Cunene',
          districts: [
            { name: 'Cahama', native: 'Cahama' },
            { name: 'Kuroka (Curoca)', native: 'Kuroka (Curoca)' },
            { name: 'Kuvelai (Cuvelai)', native: 'Kuvelai (Cuvelai)' },
            {
              name: 'Kwanhama (Cuanhama)',
              native: 'Kwanhama (Cuanhama)'
            },
            {
              name: 'Namakunde (Namacunde)',
              native: 'Namakunde (Namacunde)'
            },
            { name: 'Ombadja', native: 'Ombadja' }
          ]
        },
        {
          name: 'Huambo',
          native: 'Huambo',
          districts: [
            { name: 'Bailundo', native: 'Bailundo' },
            { name: 'Caala', native: 'Caála' },
            { name: 'Ekunha ', native: 'Ekunha ' },
            { name: 'Huambo', native: 'Huambo' },
            {
              name: 'Katchiungo (Catchiungo)',
              native: 'Katchiungo (Catchiungo)'
            },
            {
              name: 'Londuimbali (Londuimbale)',
              native: 'Londuimbali (Londuimbale)'
            },
            { name: 'Longonjo', native: 'Longonjo' },
            { name: 'Mungo', native: 'Mungo' },
            {
              name: 'Tchicala Tcholoanga (Chicala-Choloanga)',
              native: 'Tchicala Tcholoanga (Chicala-Choloanga)'
            },
            {
              name: 'Tchinjenje (Chinjenje)',
              native: 'Tchinjenje (Chinjenje)'
            },
            { name: 'Ukuma (Ucuma)', native: 'Ukuma (Ucuma)' }
          ]
        },
        {
          name: 'Huila',
          native: 'Huíla',
          districts: [
            { name: 'Caconda', native: 'Caconda' },
            { name: 'Cacula', native: 'Cacula' },
            { name: 'Caluquembe', native: 'Caluquembe' },
            { name: 'Chibia', native: 'Chibia' },
            { name: 'Chicomba', native: 'Chicomba' },
            { name: 'Chipindo', native: 'Chipindo' },
            { name: 'Chiange (Gambos)', native: 'Chiange (Gambos)' },
            { name: 'Humpata', native: 'Humpata' },
            { name: 'Jamba', native: 'Jamba' },
            { name: 'Kuvango', native: 'Kuvango' },
            { name: 'Lubango', native: 'Lubango' },
            { name: 'Matala', native: 'Matala' },
            { name: 'Quilengues', native: 'Quilengues' },
            { name: 'Quipungo', native: 'Quipungo' }
          ]
        },
        {
          name: 'Luanda',
          native: 'Luanda',
          districts: [
            { name: 'Belas', native: 'Belas' },
            { name: 'Cacuaco', native: 'Cacuaco' },
            { name: 'Cazenga', native: 'Cazenga' },
            { name: 'Icolo e Bengo', native: 'Ícolo e Bengo' },
            { name: 'Luanda', native: 'Luanda' },
            { name: 'Quissama', native: 'Quiçama' },
            { name: 'Viana', native: 'Viana' }
          ]
        },
        {
          name: 'Lunda Norte',
          native: 'Lunda Norte',
          districts: [
            {
              name: 'Capenda-Camulemba (Capemba-Camulemba)',
              native: 'Capenda-Camulemba (Capemba-Camulemba)'
            },
            { name: 'Cambulo (Caumbo)', native: 'Cambulo (Caumbo)' },
            { name: 'Caungula', native: 'Caungula' },
            { name: 'Chitato (Tchitato)', native: 'Chitato (Tchitato)' },
            { name: 'Cuango', native: 'Cuango' },
            { name: 'Cuilo', native: 'Cuilo' },
            { name: 'Lóvua', native: 'Lóvua' },
            { name: 'Lubalo', native: 'Lubalo' },
            { name: 'Lucapa', native: 'Lucapa' },
            { name: 'Shah-Muteba', native: 'Shah-Muteba' }
          ]
        },
        {
          name: 'Lunda Sul',
          native: 'Lunda Sul',
          districts: [
            { name: 'Cacolo', native: 'Cacolo' },
            { name: 'Dala', native: 'Dala' },
            { name: 'Muconda', native: 'Muconda' },
            { name: 'Saurimo', native: 'Saurimo' }
          ]
        },
        {
          name: 'Malanje',
          native: 'Malanje',
          districts: [
            { name: 'Cacuso', native: 'Cacuso' },
            { name: 'Calandula', native: 'Calandula' },
            { name: 'Cambundi-Catembo', native: 'Cambundi-Catembo' },
            { name: 'Cangandala', native: 'Cangandala' },
            { name: 'Caombo', native: 'Caombo' },
            { name: 'Cuaba Nzoji', native: 'Cuaba Nzoji' },
            { name: 'Kunda-dia-Base', native: 'Kunda-dia-Base' },
            { name: 'Luquembo', native: 'Luquembo' },
            { name: 'Malanje', native: 'Malanje' },
            { name: 'Marimba', native: 'Marimba' },
            { name: 'Massango', native: 'Massango' },
            { name: 'Mucari', native: 'Mucari' },
            { name: 'Quela', native: 'Quela' },
            { name: 'Quirima', native: 'Quirima' }
          ]
        },
        {
          name: 'Moxico',
          native: 'Moxico',
          districts: [
            {
              name: 'Alto Zambeze (Cazombo)',
              native: 'Alto Zambeze (Cazombo)'
            },
            {
              name: "Bundas (Lumbala-N'guimbo)",
              native: "Bundas (Lumbala-N'guimbo)"
            },
            { name: 'Camanongue', native: 'Camanongue' },
            { name: 'Cameia (Lumeje)', native: 'Cameia (Lumeje)' },
            { name: 'Leua', native: 'Léua' },
            { name: 'Luau', native: 'Luau' },
            { name: 'Luacano', native: 'Luacano' },
            { name: 'Luchazes', native: 'Luchazes' },
            { name: 'Moxico (Luena)', native: 'Moxico (Luena)' }
          ]
        },
        {
          name: 'Namibe',
          native: 'Namibe',
          districts: [
            { name: 'Bibala', native: 'Bibala' },
            { name: 'Camacuio', native: 'Camacuio' },
            {
              name: 'Mossamedes (Namibe until 2016)',
              native: 'Moçâmedes (Namibe until 2016)'
            },
            { name: 'Tômbua', native: 'Tômbua' },
            { name: 'Virei', native: 'Virei' }
          ]
        },
        {
          name: 'Uige',
          native: 'Uíge',
          districts: [
            { name: 'Alto Cauale', native: 'Alto Cauale' },
            { name: 'Ambuila', native: 'Ambuila' },
            { name: 'Bembe', native: 'Bembe' },
            { name: 'Buengas', native: 'Buengas' },
            { name: 'Bungo', native: 'Bungo' },
            { name: 'Damba', native: 'Damba' },
            {
              name: 'Maquela do Zombo (Zombo)',
              native: 'Maquela do Zombo (Zombo)'
            },
            {
              name: 'Milunga (formerly Macocola)',
              native: 'Milunga (formerly Macocola)'
            },
            { name: 'Mucaba', native: 'Mucaba' },
            { name: 'Negage', native: 'Negage' },
            { name: 'Puri', native: 'Puri' },
            { name: 'Quimbele', native: 'Quimbele' },
            { name: 'Quitexe', native: 'Quitexe' },
            { name: 'Sanza Pombo', native: 'Sanza Pombo' },
            { name: 'Songo', native: 'Songo' },
            { name: 'Uige', native: 'Uíge' }
          ]
        },
        {
          name: 'Zaire',
          native: 'Zaire',
          districts: [
            { name: 'Cuimba', native: 'Cuimba' },
            { name: "M'Banza Congo", native: "M'Banza Congo" },
            { name: 'Noqui', native: 'Nóqui' },
            { name: "N'zeto", native: "N'zeto" },
            { name: 'Soyo', native: 'Soyo' },
            { name: 'Tomboco', native: 'Tomboco' }
          ]
        }
      ]
    },
    AQ: {
      name: 'Antarctica',
      native: 'Antarctica',
      phone: '',
      continent: 'AN',
      capital: '',
      currency: '',
      languages: '',
      numeric: '010'
    },
    AR: {
      name: 'Argentina',
      native: 'Argentina',
      phone: '54',
      continent: 'SA',
      capital: 'Buenos Aires',
      currency: 'ARS',
      languages: 'es,gn',
      numeric: '032'
    },
    AS: {
      name: 'American Samoa',
      native: 'American Samoa',
      phone: '1684',
      continent: 'OC',
      capital: 'Pago Pago',
      currency: 'USD',
      languages: 'en,sm',
      numeric: '016'
    },
    AT: {
      name: 'Austria',
      native: 'Österreich',
      phone: '43',
      continent: 'EU',
      capital: 'Vienna',
      currency: 'EUR',
      languages: 'de',
      numeric: '040'
    },
    AU: {
      name: 'Australia',
      native: 'Australia',
      phone: '61',
      continent: 'OC',
      capital: 'Canberra',
      currency: 'AUD',
      languages: 'en',
      numeric: '036'
    },
    AW: {
      name: 'Aruba',
      native: 'Aruba',
      phone: '297',
      continent: 'NA',
      capital: 'Oranjestad',
      currency: 'AWG',
      languages: 'nl,pa',
      numeric: '533'
    },
    AX: {
      name: 'Åland',
      native: 'Åland',
      phone: '358',
      continent: 'EU',
      capital: 'Mariehamn',
      currency: 'EUR',
      languages: 'sv',
      numeric: '248'
    },
    AZ: {
      name: 'Azerbaijan',
      native: 'Azərbaycan',
      phone: '994',
      continent: 'AS',
      capital: 'Baku',
      currency: 'AZN',
      languages: 'az',
      numeric: '031'
    },
    BA: {
      name: 'Bosnia and Herzegovina',
      native: 'Bosna i Hercegovina',
      phone: '387',
      continent: 'EU',
      capital: 'Sarajevo',
      currency: 'BAM',
      languages: 'bs,hr,sr',
      numeric: '070'
    },
    BB: {
      name: 'Barbados',
      native: 'Barbados',
      phone: '1246',
      continent: 'NA',
      capital: 'Bridgetown',
      currency: 'BBD',
      languages: 'en',
      numeric: '052'
    },
    BD: {
      name: 'Bangladesh',
      native: 'Bangladesh',
      phone: '880',
      continent: 'AS',
      capital: 'Dhaka',
      currency: 'BDT',
      languages: 'bn',
      numeric: '050',
      regions: [
        {
          name: 'Barishal',
          native: 'বরিশাল',
          districts: [
            { name: 'Barguna ', native: 'বরগুনা' },
            { name: 'Barisal ', native: 'বরিশাল' },
            { name: 'Bhola ', native: 'ভোলা' },
            { name: 'Jhalokati ', native: 'ঝালকাঠী' },
            { name: 'Patuakhali ', native: 'পটুয়াখালী' },
            { name: 'Pirojpur ', native: 'পিরোজপুর' }
          ]
        },
        {
          name: 'Chittagong',
          native: 'চট্টগ্রাম',
          districts: [
            { name: 'Brahmanbaria ', native: 'ব্রাহ্মনবাড়ীয়া' },
            { name: 'Chandpur ', native: 'চাঁদপুর' },
            { name: 'Chittagong ', native: 'চট্টগ্রাম' },
            { name: 'Comilla ', native: 'কুমিল্লা' },
            { name: "Cox's Bazar", native: 'কক্সবাজার ' },
            { name: 'Feni ', native: 'ফেনী' },
            { name: 'Khagrachari ', native: 'খাগড়াছড়ি' }
          ]
        },
        {
          name: 'Dhaka',
          native: 'ঢাকা',
          districts: [
            { name: 'Dhaka ', native: 'ঢাকা' },
            { name: 'Faridpur ', native: 'ফরিদপুর' },
            { name: 'Gazipur ', native: 'গাজীপুর' },
            { name: 'Gopalganj ', native: 'গোপালগঞ্জ' },
            { name: 'Kishoreganj ', native: 'কিশোরগঞ্জ' },
            { name: 'Madaripur ', native: 'মাদারীপুর' },
            { name: 'Manikganj ', native: 'মানিকগঞ্জ' },
            { name: 'Munshiganj ', native: 'মুন্সীগঞ্জ' },
            { name: 'Narayanganj ', native: 'নারায়ণগঞ্জ' },
            { name: 'Narsingdi ', native: 'নরসিংদী' },
            { name: 'Rajbari ', native: 'রাজবাড়ী' },
            { name: 'Shariatpur ', native: 'শরীয়তপুর' },
            { name: 'Tangail ', native: 'টাঙ্গাইল' }
          ]
        },
        {
          name: 'Khulna',
          native: 'খুলনা',
          districts: [
            { name: 'Bagerhat ', native: 'বাগেরহাট' },
            { name: 'Chuadanga ', native: 'চুয়াডাঙা' },
            { name: 'Jessore ', native: 'যশোর' },
            { name: 'Jhenaidah ', native: 'ঝিনাইদহ' },
            { name: 'Khulna ', native: 'খুলনা' },
            { name: 'Kushtia ', native: 'কুষ্টিয়া' },
            { name: 'Magura ', native: 'মাগুরা' },
            { name: 'Meherpur ', native: 'মেহেরপুর' },
            { name: 'Narail ', native: 'নড়াইল' },
            { name: 'Shatkhira ', native: 'সাতক্ষীরা' }
          ]
        },
        {
          name: 'Mymensingh',
          native: 'ময়মনসিংহ',
          districts: [
            { name: 'Jamalpur ', native: 'জামালপুর' },
            { name: 'Mymensingh ', native: 'ময়মনসিংহ' },
            { name: 'Netrakona ', native: 'নেত্রকোনা' },
            { name: 'Sherpur ', native: 'শেরপুর' }
          ]
        },
        {
          name: 'Rajshahi',
          native: 'রাজশাহী',
          districts: [
            { name: 'Bogra ', native: 'বগুরা' },
            { name: 'Jaipurhat ', native: 'জয়পুরহাট' },
            { name: 'Naogaon ', native: 'নওগাঁ' },
            { name: 'Natore ', native: 'নাটোর' },
            { name: 'Nawabganj ', native: 'নওয়াবগঞ্জ' },
            { name: 'Pabna ', native: 'পাবনা' },
            { name: 'Rajshahi ', native: 'রাজশাহী' },
            { name: 'Sirajganj ', native: 'সিরাজগঞ্জ' }
          ]
        },
        {
          name: 'Rangpur',
          native: 'রংপুর',
          districts: [
            { name: 'Rangpur ', native: 'রংপুর' },
            { name: 'Gaibandha ', native: 'গাইবান্ধা' },
            { name: 'Kurigram ', native: 'কুড়িগ্রাম' },
            { name: 'Nilphamari ', native: 'নীলফামারী' },
            { name: 'Lalmonirhat ', native: 'লালমনিরহাট' },
            { name: 'Dinajpur ', native: 'দিনাজপুর' },
            { name: 'Thakurgaon ', native: 'ঠাকুরগাঁও' },
            { name: 'Panchagarh ', native: 'পঞ্চগড়' }
          ]
        },
        {
          name: 'Sylhet',
          native: 'সিলেট',
          districts: [
            { name: 'Habiganj ', native: 'হবিগঞ্জ' },
            { name: 'Maulvibazar ', native: 'মৌলভীবাজার' },
            { name: 'Sunamganj ', native: 'সুনামগঞ্জ' },
            { name: 'Sylhet ', native: 'সিলেট' }
          ]
        }
      ]
    },
    BE: {
      name: 'Belgium',
      native: 'België',
      phone: '32',
      continent: 'EU',
      capital: 'Brussels',
      currency: 'EUR',
      languages: 'nl,fr,de',
      numeric: '056'
    },
    BF: {
      name: 'Burkina Faso',
      native: 'Burkina Faso',
      phone: '226',
      continent: 'AF',
      capital: 'Ouagadougou',
      currency: 'XOF',
      languages: 'fr,ff',
      numeric: '854'
    },
    BG: {
      name: 'Bulgaria',
      native: 'България',
      phone: '359',
      continent: 'EU',
      capital: 'Sofia',
      currency: 'BGN',
      languages: 'bg',
      numeric: '100'
    },
    BH: {
      name: 'Bahrain',
      native: '‏البحرين',
      phone: '973',
      continent: 'AS',
      capital: 'Manama',
      currency: 'BHD',
      languages: 'ar',
      numeric: '048'
    },
    BI: {
      name: 'Burundi',
      native: 'Burundi',
      phone: '257',
      continent: 'AF',
      capital: 'Bujumbura',
      currency: 'BIF',
      languages: 'fr,rn',
      numeric: '108'
    },
    BJ: {
      name: 'Benin',
      native: 'Bénin',
      phone: '229',
      continent: 'AF',
      capital: 'Porto-Novo',
      currency: 'XOF',
      languages: 'fr',
      numeric: '204',
      regions: [
        {
          name: 'Alibori',
          native: 'Alibori',
          districts: [
            { name: 'Banikoara', native: 'Banikoara' },
            { name: 'Gogounou', native: 'Gogounou' },
            { name: 'Kandi', native: 'Kandi' },
            { name: 'Karimama', native: 'Karimama' },
            { name: 'Malanville', native: 'Malanville' },
            { name: 'Segbana', native: 'Segbana' }
          ]
        },
        {
          name: 'Atacora',
          native: 'Atacora',
          districts: [
            { name: 'Boukombe', native: 'Boukombe' },
            { name: 'Cobli', native: 'Cobli' },
            { name: 'Kerou', native: 'Kerou' },
            { name: 'Kouande', native: 'Kouande' },
            { name: 'Materi', native: 'Materi' },
            { name: 'Natitingou', native: 'Natitingou' },
            { name: 'Pehunco', native: 'Pehunco' },
            { name: 'Tanguieta', native: 'Tanguieta' },
            { name: 'Toucountouna', native: 'Toucountouna' }
          ]
        },
        {
          name: 'Atlantique',
          native: 'Atlantique',
          districts: [
            { name: 'Abomey-Calavi', native: 'Abomey-Calavi' },
            { name: 'Allada', native: 'Allada' },
            { name: 'Kpomasse', native: 'Kpomasse' },
            { name: 'Ouidah', native: 'Ouidah' },
            { name: 'So-Ava', native: 'So-Ava' },
            { name: 'Toffo', native: 'Toffo' },
            { name: 'Tori', native: 'Tori' },
            { name: 'Ze', native: 'Ze' }
          ]
        },
        {
          name: 'Borgou',
          native: 'Borgou',
          districts: [
            { name: 'Bembereke', native: 'Bembereke' },
            { name: 'Kalale', native: 'Kalale' },
            { name: "N'Dali", native: "N'Dali" },
            { name: 'Nikki', native: 'Nikki' },
            { name: 'Parakou', native: 'Parakou' },
            { name: 'Perere', native: 'Perere' },
            { name: 'Sinende', native: 'Sinende' },
            { name: 'Tchaourou', native: 'Tchaourou' }
          ]
        },
        {
          name: 'Collines',
          native: 'Collines',
          districts: [
            { name: 'Bante', native: 'Bante' },
            { name: 'Dassa-Zoume', native: 'Dassa-Zoume' },
            { name: 'Glazoue', native: 'Glazoue' },
            { name: 'Ouesse', native: 'Ouesse' },
            { name: 'Savalou', native: 'Savalou' },
            { name: 'Save', native: 'Save' }
          ]
        },
        {
          name: 'Couffo',
          native: 'Couffo',
          districts: [
            { name: 'Aplahoue', native: 'Aplahoue' },
            { name: 'Djakotomey', native: 'Djakotomey' },
            { name: 'Dogbo', native: 'Dogbo' },
            { name: 'Klouekanmey', native: 'Klouekanmey' },
            { name: 'Lalo', native: 'Lalo' },
            { name: 'Toviklin', native: 'Toviklin' }
          ]
        },
        {
          name: 'Donga',
          native: 'Donga',
          districts: [
            { name: 'Bassila', native: 'Bassila' },
            { name: 'Copargo', native: 'Copargo' },
            { name: 'Djougou', native: 'Djougou' },
            { name: 'Ouake', native: 'Ouake' }
          ]
        },
        {
          name: 'Littoral',
          native: 'Littoral',
          districts: [{ name: 'Cotonou', native: 'Cotonou' }]
        },
        {
          name: 'Mono',
          native: 'Mono',
          districts: [
            { name: 'Athieme', native: 'Athieme' },
            { name: 'Bopa', native: 'Bopa' },
            { name: 'Come', native: 'Come' },
            { name: 'Grand-Popo', native: 'Grand-Popo' },
            { name: 'Houeyogbe', native: 'Houeyogbe' },
            { name: 'Lokossa', native: 'Lokossa' }
          ]
        },
        {
          name: 'Oueme',
          native: 'Oueme',
          districts: [
            { name: 'Adjarra', native: 'Adjarra' },
            { name: 'Adjohoun', native: 'Adjohoun' },
            { name: 'Aguegue', native: 'Aguegue' },
            { name: 'Akpro-Misserete', native: 'Akpro-Misserete' },
            { name: 'Avrankou', native: 'Avrankou' },
            { name: 'Bonou', native: 'Bonou' },
            { name: 'Dangbo', native: 'Dangbo' },
            { name: 'Porto-Novo', native: 'Porto-Novo' },
            { name: 'Seme-Podji', native: 'Seme-Podji' }
          ]
        },
        {
          name: 'Plateau',
          native: 'Plateau',
          districts: [
            { name: 'Adja-Ouere', native: 'Adja-Ouere' },
            { name: 'Ifangni', native: 'Ifangni' },
            { name: 'Plateau Ketou', native: 'Plateau Ketou' },
            { name: 'Pobe', native: 'Pobe' },
            { name: 'Sakete', native: 'Sakete' }
          ]
        },
        {
          name: 'Zou',
          native: 'Zou',
          districts: [
            { name: 'Abomey', native: 'Abomey' },
            { name: 'Agbangnizoun', native: 'Agbangnizoun' },
            { name: 'Bohicon', native: 'Bohicon' },
            { name: 'Cove', native: 'Cove' },
            { name: 'Djidja', native: 'Djidja' },
            { name: 'Ouinhi', native: 'Ouinhi' },
            { name: 'Zagnanado', native: 'Zagnanado' },
            { name: 'Za-Kpota', native: 'Za-Kpota' },
            { name: 'Zodogbomey', native: 'Zodogbomey' }
          ]
        }
      ]
    },
    BL: {
      name: 'Saint Barthélemy',
      native: 'Saint-Barthélemy',
      phone: '590',
      continent: 'NA',
      capital: 'Gustavia',
      currency: 'EUR',
      languages: 'fr',
      numeric: '652'
    },
    BM: {
      name: 'Bermuda',
      native: 'Bermuda',
      phone: '1441',
      continent: 'NA',
      capital: 'Hamilton',
      currency: 'BMD',
      languages: 'en',
      numeric: '060'
    },
    BN: {
      name: 'Brunei',
      native: 'Negara Brunei Darussalam',
      phone: '673',
      continent: 'AS',
      capital: 'Bandar Seri Begawan',
      currency: 'BND',
      languages: 'ms',
      numeric: '096'
    },
    BO: {
      name: 'Bolivia',
      native: 'Bolivia',
      phone: '591',
      continent: 'SA',
      capital: 'Sucre',
      currency: 'BOB,BOV',
      languages: 'es,ay,qu',
      numeric: '068'
    },
    BQ: {
      name: 'Bonaire',
      native: 'Bonaire',
      phone: '5997',
      continent: 'NA',
      capital: 'Kralendijk',
      currency: 'USD',
      languages: 'nl',
      numeric: '535'
    },
    BR: {
      name: 'Brazil',
      native: 'Brasil',
      phone: '55',
      continent: 'SA',
      capital: 'Brasília',
      currency: 'BRL',
      languages: 'pt',
      numeric: '076'
    },
    BS: {
      name: 'Bahamas',
      native: 'Bahamas',
      phone: '1242',
      continent: 'NA',
      capital: 'Nassau',
      currency: 'BSD',
      languages: 'en',
      numeric: '044'
    },
    BT: {
      name: 'Bhutan',
      native: 'ʼbrug-yul',
      phone: '975',
      continent: 'AS',
      capital: 'Thimphu',
      currency: 'BTN,INR',
      languages: 'dz',
      numeric: '064'
    },
    BV: {
      name: 'Bouvet Island',
      native: 'Bouvetøya',
      phone: '',
      continent: 'AN',
      capital: '',
      currency: 'NOK',
      languages: '',
      numeric: '074'
    },
    BW: {
      name: 'Botswana',
      native: 'Botswana',
      phone: '267',
      continent: 'AF',
      capital: 'Gaborone',
      currency: 'BWP',
      languages: 'en,tn',
      numeric: '072'
    },
    BY: {
      name: 'Belarus',
      native: 'Белару́сь',
      phone: '375',
      continent: 'EU',
      capital: 'Minsk',
      currency: 'BYR',
      languages: 'be,ru',
      numeric: '112'
    },
    BZ: {
      name: 'Belize',
      native: 'Belize',
      phone: '501',
      continent: 'NA',
      capital: 'Belmopan',
      currency: 'BZD',
      languages: 'en,es',
      numeric: '084'
    },
    CA: {
      name: 'Canada',
      native: 'Canada',
      phone: '1',
      continent: 'NA',
      capital: 'Ottawa',
      currency: 'CAD',
      languages: 'en,fr',
      numeric: '124'
    },
    CC: {
      name: 'Cocos [Keeling] Islands',
      native: 'Cocos (Keeling) Islands',
      phone: '61',
      continent: 'AS',
      capital: 'West Island',
      currency: 'AUD',
      languages: 'en',
      numeric: '166'
    },
    CD: {
      name: 'Democratic Republic of the Congo',
      native: 'République démocratique du Congo',
      phone: '243',
      continent: 'AF',
      capital: 'Kinshasa',
      currency: 'CDF',
      languages: 'fr,ln,kg,sw,lu',
      numeric: '180'
    },
    CF: {
      name: 'Central African Republic',
      native: 'Ködörösêse tî Bêafrîka',
      phone: '236',
      continent: 'AF',
      capital: 'Bangui',
      currency: 'XAF',
      languages: 'fr,sg',
      numeric: '140'
    },
    CG: {
      name: 'Republic of the Congo',
      native: 'République du Congo',
      phone: '242',
      continent: 'AF',
      capital: 'Brazzaville',
      currency: 'XAF',
      languages: 'fr,ln',
      numeric: '178'
    },
    CH: {
      name: 'Switzerland',
      native: 'Schweiz',
      phone: '41',
      continent: 'EU',
      capital: 'Bern',
      currency: 'CHE,CHF,CHW',
      languages: 'de,fr,it',
      numeric: '756'
    },
    CI: {
      name: 'Ivory Coast',
      native: "Côte d'Ivoire",
      phone: '225',
      continent: 'AF',
      capital: 'Yamoussoukro',
      currency: 'XOF',
      languages: 'fr',
      numeric: '384'
    },
    CK: {
      name: 'Cook Islands',
      native: 'Cook Islands',
      phone: '682',
      continent: 'OC',
      capital: 'Avarua',
      currency: 'NZD',
      languages: 'en',
      numeric: '184'
    },
    CL: {
      name: 'Chile',
      native: 'Chile',
      phone: '56',
      continent: 'SA',
      capital: 'Santiago',
      currency: 'CLF,CLP',
      languages: 'es',
      numeric: '152'
    },
    CM: {
      name: 'Cameroon',
      native: 'Cameroon',
      phone: '237',
      continent: 'AF',
      capital: 'Yaoundé',
      currency: 'XAF',
      languages: 'en,fr',
      numeric: '120'
    },
    CN: {
      name: 'China',
      native: '中国',
      phone: '86',
      continent: 'AS',
      capital: 'Beijing',
      currency: 'CNY',
      languages: 'zh',
      numeric: '156'
    },
    CO: {
      name: 'Colombia',
      native: 'Colombia',
      phone: '57',
      continent: 'SA',
      capital: 'Bogotá',
      currency: 'COP',
      languages: 'es',
      numeric: '170'
    },
    CR: {
      name: 'Costa Rica',
      native: 'Costa Rica',
      phone: '506',
      continent: 'NA',
      capital: 'San José',
      currency: 'CRC',
      languages: 'es',
      numeric: '188'
    },
    CU: {
      name: 'Cuba',
      native: 'Cuba',
      phone: '53',
      continent: 'NA',
      capital: 'Havana',
      currency: 'CUC,CUP',
      languages: 'es',
      numeric: '192'
    },
    CV: {
      name: 'Cape Verde',
      native: 'Cabo Verde',
      phone: '238',
      continent: 'AF',
      capital: 'Praia',
      currency: 'CVE',
      languages: 'pt',
      numeric: '132'
    },
    CW: {
      name: 'Curacao',
      native: 'Curaçao',
      phone: '5999',
      continent: 'NA',
      capital: 'Willemstad',
      currency: 'ANG',
      languages: 'nl,pa,en',
      numeric: '531'
    },
    CX: {
      name: 'Christmas Island',
      native: 'Christmas Island',
      phone: '61',
      continent: 'AS',
      capital: 'Flying Fish Cove',
      currency: 'AUD',
      languages: 'en',
      numeric: '162'
    },
    CY: {
      name: 'Cyprus',
      native: 'Κύπρος',
      phone: '357',
      continent: 'EU',
      capital: 'Nicosia',
      currency: 'EUR',
      languages: 'el,tr,hy',
      numeric: '196'
    },
    CZ: {
      name: 'Czech Republic',
      native: 'Česká republika',
      phone: '420',
      continent: 'EU',
      capital: 'Prague',
      currency: 'CZK',
      languages: 'cs,sk',
      numeric: '203'
    },
    DE: {
      name: 'Germany',
      native: 'Deutschland',
      phone: '49',
      continent: 'EU',
      capital: 'Berlin',
      currency: 'EUR',
      languages: 'de',
      numeric: '276'
    },
    DJ: {
      name: 'Djibouti',
      native: 'Djibouti',
      phone: '253',
      continent: 'AF',
      capital: 'Djibouti',
      currency: 'DJF',
      languages: 'fr,ar',
      numeric: '262'
    },
    DK: {
      name: 'Denmark',
      native: 'Danmark',
      phone: '45',
      continent: 'EU',
      capital: 'Copenhagen',
      currency: 'DKK',
      languages: 'da',
      numeric: '208'
    },
    DM: {
      name: 'Dominica',
      native: 'Dominica',
      phone: '1767',
      continent: 'NA',
      capital: 'Roseau',
      currency: 'XCD',
      languages: 'en',
      numeric: '212'
    },
    DO: {
      name: 'Dominican Republic',
      native: 'República Dominicana',
      phone: '1809,1829,1849',
      continent: 'NA',
      capital: 'Santo Domingo',
      currency: 'DOP',
      languages: 'es',
      numeric: '214'
    },
    DZ: {
      name: 'Algeria',
      native: 'الجزائر',
      phone: '213',
      continent: 'AF',
      capital: 'Algiers',
      currency: 'DZD',
      languages: 'ar',
      numeric: '012'
    },
    EC: {
      name: 'Ecuador',
      native: 'Ecuador',
      phone: '593',
      continent: 'SA',
      capital: 'Quito',
      currency: 'USD',
      languages: 'es',
      numeric: '218'
    },
    EE: {
      name: 'Estonia',
      native: 'Eesti',
      phone: '372',
      continent: 'EU',
      capital: 'Tallinn',
      currency: 'EUR',
      languages: 'et',
      numeric: '233'
    },
    EG: {
      name: 'Egypt',
      native: 'مصر‎',
      phone: '20',
      continent: 'AF',
      capital: 'Cairo',
      currency: 'EGP',
      languages: 'ar',
      numeric: '818'
    },
    EH: {
      name: 'Western Sahara',
      native: 'الصحراء الغربية',
      phone: '212',
      continent: 'AF',
      capital: 'El Aaiún',
      currency: 'MAD,DZD,MRO',
      languages: 'es',
      numeric: '732'
    },
    ER: {
      name: 'Eritrea',
      native: 'Eritrea',
      phone: '291',
      continent: 'AF',
      capital: 'Asmara',
      currency: 'ERN',
      languages: 'ti,ar,en',
      numeric: '232'
    },
    ES: {
      name: 'Spain',
      native: 'España',
      phone: '34',
      continent: 'EU',
      capital: 'Madrid',
      currency: 'EUR',
      languages: 'es,eu,ca,gl,oc',
      numeric: '724'
    },
    ET: {
      name: 'Ethiopia',
      native: 'ኢትዮጵያ',
      phone: '251',
      continent: 'AF',
      capital: 'Addis Ababa',
      currency: 'ETB',
      languages: 'am',
      numeric: '231'
    },
    FI: {
      name: 'Finland',
      native: 'Suomi',
      phone: '358',
      continent: 'EU',
      capital: 'Helsinki',
      currency: 'EUR',
      languages: 'fi,sv',
      numeric: '246'
    },
    FJ: {
      name: 'Fiji',
      native: 'Fiji',
      phone: '679',
      continent: 'OC',
      capital: 'Suva',
      currency: 'FJD',
      languages: 'en,fj,hi,ur',
      numeric: '242'
    },
    FK: {
      name: 'Falkland Islands',
      native: 'Falkland Islands',
      phone: '500',
      continent: 'SA',
      capital: 'Stanley',
      currency: 'FKP',
      languages: 'en',
      numeric: '238'
    },
    FM: {
      name: 'Micronesia',
      native: 'Micronesia',
      phone: '691',
      continent: 'OC',
      capital: 'Palikir',
      currency: 'USD',
      languages: 'en',
      numeric: '583'
    },
    FO: {
      name: 'Faroe Islands',
      native: 'Føroyar',
      phone: '298',
      continent: 'EU',
      capital: 'Tórshavn',
      currency: 'DKK',
      languages: 'fo',
      numeric: '234'
    },
    FR: {
      name: 'France',
      native: 'France',
      phone: '33',
      continent: 'EU',
      capital: 'Paris',
      currency: 'EUR',
      languages: 'fr',
      numeric: '250'
    },
    GA: {
      name: 'Gabon',
      native: 'Gabon',
      phone: '241',
      continent: 'AF',
      capital: 'Libreville',
      currency: 'XAF',
      languages: 'fr',
      numeric: '266'
    },
    GB: {
      name: 'United Kingdom',
      native: 'United Kingdom',
      phone: '44',
      continent: 'EU',
      capital: 'London',
      currency: 'GBP',
      languages: 'en',
      numeric: '826'
    },
    GD: {
      name: 'Grenada',
      native: 'Grenada',
      phone: '1473',
      continent: 'NA',
      capital: "St. George's",
      currency: 'XCD',
      languages: 'en',
      numeric: '308'
    },
    GE: {
      name: 'Georgia',
      native: 'საქართველო',
      phone: '995',
      continent: 'AS',
      capital: 'Tbilisi',
      currency: 'GEL',
      languages: 'ka',
      numeric: '268'
    },
    GF: {
      name: 'French Guiana',
      native: 'Guyane française',
      phone: '594',
      continent: 'SA',
      capital: 'Cayenne',
      currency: 'EUR',
      languages: 'fr',
      numeric: '254'
    },
    GG: {
      name: 'Guernsey',
      native: 'Guernsey',
      phone: '44',
      continent: 'EU',
      capital: 'St. Peter Port',
      currency: 'GBP',
      languages: 'en,fr',
      numeric: '831'
    },
    GH: {
      name: 'Ghana',
      native: 'Ghana',
      phone: '233',
      continent: 'AF',
      capital: 'Accra',
      currency: 'GHS',
      languages: 'en',
      numeric: '288'
    },
    GI: {
      name: 'Gibraltar',
      native: 'Gibraltar',
      phone: '350',
      continent: 'EU',
      capital: 'Gibraltar',
      currency: 'GIP',
      languages: 'en',
      numeric: '292'
    },
    GL: {
      name: 'Greenland',
      native: 'Kalaallit Nunaat',
      phone: '299',
      continent: 'NA',
      capital: 'Nuuk',
      currency: 'DKK',
      languages: 'kl',
      numeric: '304'
    },
    GM: {
      name: 'Gambia',
      native: 'Gambia',
      phone: '220',
      continent: 'AF',
      capital: 'Banjul',
      currency: 'GMD',
      languages: 'en',
      numeric: '270'
    },
    GN: {
      name: 'Guinea',
      native: 'Guinée',
      phone: '224',
      continent: 'AF',
      capital: 'Conakry',
      currency: 'GNF',
      languages: 'fr,ff',
      numeric: '324'
    },
    GP: {
      name: 'Guadeloupe',
      native: 'Guadeloupe',
      phone: '590',
      continent: 'NA',
      capital: 'Basse-Terre',
      currency: 'EUR',
      languages: 'fr',
      numeric: '312'
    },
    GQ: {
      name: 'Equatorial Guinea',
      native: 'Guinea Ecuatorial',
      phone: '240',
      continent: 'AF',
      capital: 'Malabo',
      currency: 'XAF',
      languages: 'es,fr',
      numeric: '226'
    },
    GR: {
      name: 'Greece',
      native: 'Ελλάδα',
      phone: '30',
      continent: 'EU',
      capital: 'Athens',
      currency: 'EUR',
      languages: 'el',
      numeric: '300'
    },
    GS: {
      name: 'South Georgia and the South Sandwich Islands',
      native: 'South Georgia',
      phone: '500',
      continent: 'AN',
      capital: 'King Edward Point',
      currency: 'GBP',
      languages: 'en',
      numeric: '239'
    },
    GT: {
      name: 'Guatemala',
      native: 'Guatemala',
      phone: '502',
      continent: 'NA',
      capital: 'Guatemala City',
      currency: 'GTQ',
      languages: 'es',
      numeric: '320'
    },
    GU: {
      name: 'Guam',
      native: 'Guam',
      phone: '1671',
      continent: 'OC',
      capital: 'Hagåtña',
      currency: 'USD',
      languages: 'en,ch,es',
      numeric: '316'
    },
    GW: {
      name: 'Guinea-Bissau',
      native: 'Guiné-Bissau',
      phone: '245',
      continent: 'AF',
      capital: 'Bissau',
      currency: 'XOF',
      languages: 'pt',
      numeric: '624'
    },
    GY: {
      name: 'Guyana',
      native: 'Guyana',
      phone: '592',
      continent: 'SA',
      capital: 'Georgetown',
      currency: 'GYD',
      languages: 'en',
      numeric: '328'
    },
    HK: {
      name: 'Hong Kong',
      native: '香港',
      phone: '852',
      continent: 'AS',
      capital: 'City of Victoria',
      currency: 'HKD',
      languages: 'zh,en',
      numeric: '344'
    },
    HM: {
      name: 'Heard Island and McDonald Islands',
      native: 'Heard Island and McDonald Islands',
      phone: '',
      continent: 'AN',
      capital: '',
      currency: 'AUD',
      languages: 'en',
      numeric: '334'
    },
    HN: {
      name: 'Honduras',
      native: 'Honduras',
      phone: '504',
      continent: 'NA',
      capital: 'Tegucigalpa',
      currency: 'HNL',
      languages: 'es',
      numeric: '340'
    },
    HR: {
      name: 'Croatia',
      native: 'Hrvatska',
      phone: '385',
      continent: 'EU',
      capital: 'Zagreb',
      currency: 'HRK',
      languages: 'hr',
      numeric: '191'
    },
    HT: {
      name: 'Haiti',
      native: 'Haïti',
      phone: '509',
      continent: 'NA',
      capital: 'Port-au-Prince',
      currency: 'HTG,USD',
      languages: 'fr,ht',
      numeric: '332'
    },
    HU: {
      name: 'Hungary',
      native: 'Magyarország',
      phone: '36',
      continent: 'EU',
      capital: 'Budapest',
      currency: 'HUF',
      languages: 'hu',
      numeric: '348'
    },
    ID: {
      name: 'Indonesia',
      native: 'Indonesia',
      phone: '62',
      continent: 'AS',
      capital: 'Jakarta',
      currency: 'IDR',
      languages: 'id',
      numeric: '360'
    },
    IE: {
      name: 'Ireland',
      native: 'Éire',
      phone: '353',
      continent: 'EU',
      capital: 'Dublin',
      currency: 'EUR',
      languages: 'ga,en',
      numeric: '372'
    },
    IL: {
      name: 'Israel',
      native: 'יִשְׂרָאֵל',
      phone: '972',
      continent: 'AS',
      capital: 'Jerusalem',
      currency: 'ILS',
      languages: 'he,ar',
      numeric: '376'
    },
    IM: {
      name: 'Isle of Man',
      native: 'Isle of Man',
      phone: '44',
      continent: 'EU',
      capital: 'Douglas',
      currency: 'GBP',
      languages: 'en,gv',
      numeric: '833'
    },
    IN: {
      name: 'India',
      native: 'भारत',
      phone: '91',
      continent: 'AS',
      capital: 'New Delhi',
      currency: 'INR',
      languages: 'hi,en',
      regions: [
        {
          name: 'Andman & Nicobar Island',
          native: 'अंडमान और निकोबार द्वीप',
          districts: [
            {
              name: 'South Andaman',
              native: 'दक्षिण अंडमान'
            },
            {
              name: 'North & Middle Andaman',
              native: 'उत्तर और मध्य अंडमान'
            },
            {
              name: 'Nicobar',
              native: 'निकोबार'
            }
          ]
        },
        {
          name: 'Andhra Pradesh',
          native: 'आंध्र प्रदेश',
          districts: [
            {
              name: 'Srikakulam',
              native: 'श्रीकाकुलम'
            },
            {
              name: 'Vizianagaram',
              native: 'विजयनगरम'
            },
            {
              name: 'Visakhapatnam',
              native: 'विशाखापट्टनम'
            },
            {
              name: 'East Godavari',
              native: 'पूर्व गोदावरी'
            },
            {
              name: 'West Godavari',
              native: 'पश्चिम गोदावरी'
            },
            {
              name: 'Krishna',
              native: 'कृष्णा'
            },
            {
              name: 'Guntur',
              native: 'गुंटूर'
            },
            {
              name: 'Prakasam',
              native: 'प्रकाशम'
            },
            {
              name: 'S.P.S.R.Nellore',
              native: 'नेल्लौर'
            },
            {
              name: 'Chittorr',
              native: 'चित्तूर'
            },
            {
              name: 'Kadapa',
              native: 'कड़प्पा'
            },
            {
              name: 'Ananthapur',
              native: 'अनंतपुर'
            },
            {
              name: 'Kurnool',
              native: 'कुर्नूल'
            }
          ]
        },
        {
          name: 'Arunachal Pradesh',
          native: 'अरुणाचल प्रदेश',
          districts: [
            {
              name: 'Anjaw',
              native: 'अंजाव'
            },
            {
              name: 'Changlang',
              native: 'चांगलांग'
            },
            {
              name: 'Dibang Valley',
              native: 'दिबांग घाटी'
            },
            {
              name: 'East Kameng',
              native: 'पूर्वी कामेंग'
            },
            {
              name: 'East Siang',
              native: 'पूर्वी सियांग'
            },
            {
              name: 'Kamle',
              native: 'कमले'
            },
            {
              name: 'Kra Daadi',
              native: 'कारा दादी'
            },
            {
              name: 'Kurung Kumey',
              native: 'कुरग कुमै'
            },
            {
              name: 'Lepa Rada',
              native: 'लेपा राडा'
            },
            {
              name: 'Lohit',
              native: 'लोहित'
            },
            {
              name: 'Longding',
              native: 'लोगंडिगं'
            },
            {
              name: 'Lower Dibang Valley',
              native: 'लोअर दिबांग घाटी'
            },
            {
              name: 'Lower Siang',
              native: 'लोअर सियांग'
            },
            {
              name: 'Lower Subansiri',
              native: 'लोअर सुबानसिरी'
            },
            {
              name: 'Namsai',
              native: 'नमसई'
            },
            {
              name: 'Pakke Kessang',
              native: 'पक्के केसांग'
            },
            {
              name: 'Papum Pare',
              native: 'पापुम पारे'
            },
            {
              name: 'Shi Yomi',
              native: 'शी यामी'
            },
            {
              name: 'Siang',
              native: 'सियांग'
            },
            {
              name: 'Tawang',
              native: 'तवांग'
            },
            {
              name: 'Tirap',
              native: 'तिरप'
            },
            {
              name: 'Upper Siang',
              native: 'अपर सियांग'
            },
            {
              name: 'Upper Subansiri',
              native: 'अपर सुबानसिरी'
            },
            {
              name: 'West Kameng',
              native: 'पश्चिम कामेंग'
            },
            {
              name: 'West Siang',
              native: 'पश्चिम सियांग'
            }
          ]
        },
        {
          name: 'Assam',
          native: 'असम',
          districts: [
            {
              name: 'Baksa',
              native: 'बक्सा'
            },
            {
              name: 'Barpeta',
              native: 'बारपेटा'
            },
            {
              name: 'Biswanath',
              native: 'बिश्वनाथ'
            },
            {
              name: 'Bongaigaon',
              native: 'बोंगईगांव'
            },
            {
              name: 'Cachar',
              native: 'कछार'
            },
            {
              name: 'Charaido',
              native: 'चराइडो'
            },
            {
              name: 'Chirang',
              native: 'चिरांग'
            },
            {
              name: 'Darrang',
              native: 'दरांग'
            },
            {
              name: 'Dhemaji',
              native: 'धेमाजी'
            },
            {
              name: 'Dhubri',
              native: 'धुबरी'
            },
            {
              name: 'Dibrugarh',
              native: 'डिब्रूगढ़'
            },
            {
              name: 'Dima Hasao',
              native: 'दीमा हसाओ'
            },
            {
              name: 'Goalpara',
              native: 'गोलापारा'
            },
            {
              name: 'Golaghat',
              native: 'गोलाघाट'
            },
            {
              name: 'Hailakandi',
              native: 'हैलाकांडी'
            },
            {
              name: 'Hojai',
              native: 'होजाइ'
            },
            {
              name: 'Jorhat',
              native: 'जोरहाट'
            },
            {
              name: 'Kamrup Metro',
              native: 'कामरूप मेट्रो'
            },
            {
              name: 'Kamrup Rural',
              native: 'कामरूप ग्रामीण'
            },
            {
              name: 'Karbi Anglong',
              native: 'कार्बी आंगलोंग'
            },
            {
              name: 'Karimganj',
              native: 'करीमगंज'
            },
            {
              name: 'Kokrajhar',
              native: 'कोकराझार'
            },
            {
              name: 'Lakhimpur',
              native: 'लखीमपुर'
            },
            {
              name: 'Majuli',
              native: 'माजुली'
            },
            {
              name: 'Morigaon',
              native: 'मोरीगांव'
            },
            {
              name: 'Nagaon',
              native: 'नगांव'
            },
            {
              name: 'Nalbari',
              native: 'नलबाड़ी'
            },
            {
              name: 'Sivasagar',
              native: 'शिवसागर'
            },
            {
              name: 'Sonitpur',
              native: 'सोनितपुर'
            },
            {
              name: 'SOUTH SALAMARA-MANKACHAR',
              native: 'दक्षिण सलमरा-मनकाचर'
            },
            {
              name: 'Tinsukia',
              native: 'तिनसुकिया'
            },
            {
              name: 'Udalguri',
              native: 'उदलगुड़ी'
            },
            {
              name: 'West Krabi Anglong',
              native: 'पश्चिम क्राबी आंगलोंग'
            }
          ]
        },
        {
          name: 'Bihar',
          native: 'बिहार',
          districts: [
            {
              name: 'Araria',
              native: 'अररिया'
            },
            {
              name: 'Arwal',
              native: 'अरवल'
            },
            {
              name: 'Aurangabad',
              native: 'औरंगाबाद'
            },
            {
              name: 'Banka',
              native: 'बांका'
            },
            {
              name: 'Begusarai',
              native: 'बेगूसराय'
            },
            {
              name: 'Bhagalpur',
              native: 'भागलपुर'
            },
            {
              name: 'Bhojpur',
              native: 'भोजपुर'
            },
            {
              name: 'Buxar',
              native: 'बक्सर'
            },
            {
              name: 'Darbhanga',
              native: 'दरभंगा'
            },
            {
              name: 'E-Champaran',
              native: 'ई चंपारण'
            },
            {
              name: 'Gaya',
              native: 'गया'
            },
            {
              name: 'Gopalganj',
              native: 'गोपालगंज'
            },
            {
              name: 'Jamui',
              native: 'जमुई'
            },
            {
              name: 'Jehanabad',
              native: 'जहानाबाद'
            },
            {
              name: 'Kaimur',
              native: 'कैमूर'
            },
            {
              name: 'Katihar',
              native: 'कटिहार'
            },
            {
              name: 'Khagaria',
              native: 'खगरिया'
            },
            {
              name: 'Kishanganj',
              native: 'किशनगंज'
            },
            {
              name: 'Lakhisarai',
              native: 'लखीसराय'
            },
            {
              name: 'Madhepura',
              native: 'मधेपुरा'
            },
            {
              name: 'Madhubani',
              native: 'मधुबनी'
            },
            {
              name: 'Munger',
              native: 'मुंगेर'
            },
            {
              name: 'Muzaffarpur',
              native: 'मुजफ्फरपुर'
            },
            {
              name: 'Nalanda',
              native: 'नालंदा'
            },
            {
              name: 'Nawada',
              native: 'नवादा'
            },
            {
              name: 'Patna',
              native: 'पटना'
            },
            {
              name: 'Purnia',
              native: 'पूर्णिया'
            },
            {
              name: 'Rohtas',
              native: 'रोहतास'
            },
            {
              name: 'Saharsa',
              native: 'सहरसा'
            },
            {
              name: 'Samastipur',
              native: 'समस्तीपुर'
            },
            {
              name: 'Saran',
              native: 'सरन'
            },
            {
              name: 'Sheikhpura',
              native: 'शेखपुरा'
            },
            {
              name: 'Sheohar',
              native: 'शिवहर'
            },
            {
              name: 'Sitamarhi',
              native: 'सीतामढ़ी'
            },
            {
              name: 'Siwan',
              native: 'सिवान'
            },
            {
              name: 'Supaul',
              native: 'सुपौल'
            },
            {
              name: 'Vaishali',
              native: 'वैशाली'
            },
            {
              name: 'West Champaran',
              native: 'पश्चिम चंपारण'
            }
          ]
        },
        {
          id: 5,
          name: 'Chandigarh',
          native: 'चंडीगढ़',
          districts: [
            {
              name: 'Chandigarh',
              native: 'चंडीगढ़'
            }
          ]
        },
        {
          name: 'Chhattisgarh',
          native: 'छत्तीसगढ़',
          districts: [
            {
              name: 'Balod',
              native: 'बालोद'
            },
            {
              name: 'Baloda Bazar',
              native: 'बलौदा बाजार'
            },
            {
              name: 'Balrampur',
              native: 'बलरामपुर'
            },
            {
              name: 'Bastar',
              native: 'बस्तर'
            },
            {
              name: 'Bemetra',
              native: 'बेमेतरा'
            },
            {
              name: 'Bijapur',
              native: 'बीजापुर'
            },
            {
              name: 'Bilaspur',
              native: 'बिलासपुर'
            },
            {
              name: 'Dantewada',
              native: 'दंतेवाड़ा'
            },
            {
              name: 'Dhamtari',
              native: 'धमतरी'
            },
            {
              name: 'Durg',
              native: 'दुर्ग'
            },
            {
              name: 'Gariyaband',
              native: 'गरियाबंद'
            },
            {
              name: 'Janjgir Champa',
              native: 'जांजगीर चांपा'
            },
            {
              name: 'Jashpur',
              native: 'जशपुर'
            },
            {
              name: 'Kanker',
              native: 'कांकेर'
            },
            {
              name: 'Kawardha',
              native: 'कवर्धा'
            },
            {
              name: 'Kondagaon',
              native: 'कोंडागांव'
            },
            {
              name: 'Korba',
              native: 'कोरबा'
            },
            {
              name: 'Koriya',
              native: 'कोरिया'
            },
            {
              name: 'Mahasamund',
              native: 'महासमुंद'
            },
            {
              name: 'Mungeli',
              native: 'मुंगेली'
            },
            {
              name: 'Narayanpur',
              native: 'नारायणपुर'
            },
            {
              name: 'Raigarh',
              native: 'रायगढ़'
            },
            {
              name: 'Raipur',
              native: 'रायपुर'
            },
            {
              name: 'Rajnandgaon',
              native: 'राजनंदगांव'
            },
            {
              name: 'Sukma',
              native: 'सुकमा'
            },
            {
              name: 'Surajpur',
              native: 'सूरजपुर'
            },
            {
              name: 'Surguja',
              native: 'सरगुजा'
            }
          ]
        },
        {
          name: 'D&N Haveli',
          native: 'दादरा और नागर हवेली',
          districts: [
            {
              name: 'Uni District UT',
              native: 'यूनी जिला यूटी'
            }
          ]
        },
        {
          name: 'Daman & Diu',
          native: 'दमन और दीव',
          districts: [
            {
              name: 'Daman',
              native: 'दमन'
            },
            {
              name: 'Diu',
              native: 'दीव'
            }
          ]
        },
        {
          name: 'Delhi',
          native: 'दिल्ली',
          districts: [
            {
              name: 'Central',
              native: 'केंद्रीय'
            },
            {
              name: 'East',
              native: 'पूर्व'
            },
            {
              name: 'New Delhi',
              native: 'नई दिल्ली'
            },
            {
              name: 'North',
              native: 'उत्तर'
            },
            {
              name: 'North East',
              native: 'नार्थ ईस्ट'
            },
            {
              name: 'North West',
              native: 'उत्तर पश्चिम'
            },
            {
              name: 'Shahdara',
              native: 'शाहदरा'
            },
            {
              name: 'South',
              native: 'दक्षिण'
            },
            {
              name: 'South East',
              native: 'दक्षिण पूर्व'
            },
            {
              name: 'South West',
              native: 'दक्षिण पश्चिम'
            },
            {
              name: 'West',
              native: 'पश्चिम'
            }
          ]
        },
        {
          name: 'Goa',
          native: 'गोवा',
          districts: [
            {
              name: 'North Goa',
              native: 'उत्तर गोवा'
            },
            {
              name: 'South Goa',
              native: 'दक्षिण गोवा'
            }
          ]
        },
        {
          name: 'Gujarat',
          native: 'गुजरात',
          districts: [
            {
              name: 'Ahmedabad',
              native: 'अहमदाबाद'
            },
            {
              name: 'Amreli',
              native: 'अमरेली'
            },
            {
              name: 'Anand',
              native: 'आनंद'
            },
            {
              name: 'Arvalli',
              native: 'अरवली'
            },
            {
              name: 'Banaskantha',
              native: 'बनासकांठा'
            },
            {
              name: 'Bharuch',
              native: 'भरूच'
            },
            {
              name: 'Bhavnagar',
              native: 'भावनगर'
            },
            {
              name: 'Botad',
              native: 'बोटाड'
            },
            {
              name: 'Chhotaudepur',
              native: 'छोटा उदयपुर'
            },
            {
              name: 'Dahod',
              native: 'दाहोद'
            },
            {
              name: 'Dang',
              native: 'डैंग'
            },
            {
              name: 'Dwarka',
              native: 'द्वारका'
            },
            {
              name: 'Gandhinagar',
              native: 'गांधीनगर'
            },
            {
              name: 'Gir Somnath',
              native: 'गिर सोमनाथ'
            },
            {
              name: 'Jamnagar',
              native: 'जामनगर'
            },
            {
              name: 'Junagadh',
              native: 'जूनागढ़'
            },
            {
              name: 'Kheda',
              native: 'खेड़ा'
            },
            {
              name: 'Kutch',
              native: 'कच्छ'
            },
            {
              name: 'Mahisagar',
              native: 'महिसागर'
            },
            {
              name: 'Mehsana',
              native: 'मेहसाणा'
            },
            {
              name: 'Morbi',
              native: 'मोरबी'
            },
            {
              name: 'Narmada',
              native: 'नर्मदा'
            },
            {
              name: 'Navsari',
              native: 'नवसारी'
            },
            {
              name: 'Panchmahal',
              native: 'पंचमहल'
            },
            {
              name: 'Patan',
              native: 'पाटन'
            },
            {
              name: 'Porbandar',
              native: 'पोरबंदर'
            },
            {
              name: 'Rajkot',
              native: 'राजकोट'
            },
            {
              name: 'Sabarkantha',
              native: 'साबरकांठा'
            },
            {
              name: 'Surat',
              native: 'सूरत'
            },
            {
              name: 'Surendranagar',
              native: 'सुरेंद्रनगर'
            },
            {
              name: 'Tapi',
              native: 'तापी'
            },
            {
              name: 'Vadodra',
              native: 'वड़ोदरा'
            },
            {
              name: 'Valsad',
              native: 'वलसाड'
            }
          ]
        },
        {
          name: 'Haryana',
          native: 'हरियाणा',
          districts: [
            {
              name: 'Ambala',
              native: 'अंबाला'
            },
            {
              name: 'Bhiwani',
              native: 'भिवानी'
            },
            {
              name: 'Charkhi Dadri',
              native: 'चरखी दादरी'
            },
            {
              name: 'Faridabad',
              native: 'फरीदाबाद'
            },
            {
              name: 'Fatehabad',
              native: 'फतेहाबाद'
            },
            {
              name: 'Gurugram',
              native: 'गुरुग्राम '
            },
            {
              name: 'Hisar',
              native: 'हिसार'
            },
            {
              name: 'Jhajjar',
              native: 'झज्जर'
            },
            {
              name: 'Jind',
              native: 'जींद'
            },
            {
              name: 'Kaithal',
              native: 'कैथल'
            },
            {
              name: 'Karnal',
              native: 'करनाल'
            },
            {
              name: 'Kurukshetra',
              native: 'कुरुक्षेत्र'
            },
            {
              name: 'Mewat (Nuh)',
              native: 'मेवात (नूंह)'
            },
            {
              name: 'Narnaul (Mahendergarh)',
              native: 'नारनौल (महेंद्रगढ़)'
            },
            {
              name: 'Palwal',
              native: 'पलवल'
            },
            {
              name: 'Panchkula',
              native: 'पंचकुला'
            },
            {
              name: 'Panipat',
              native: 'पानीपत'
            },
            {
              name: 'Rewari',
              native: 'रेवाड़ी'
            },
            {
              name: 'Rohtak',
              native: 'रोहतक'
            },
            {
              name: 'Sirsa',
              native: 'सिरसा'
            },
            {
              name: 'Sonipat',
              native: 'सोनीपत'
            },
            {
              name: 'Yamunanagar',
              native: 'यमुनानगर'
            }
          ]
        },
        {
          name: 'Himachal Pradesh',
          native: 'हिमाचल प्रदेश',
          districts: [
            {
              name: 'Bilaspur',
              native: 'बिलासपुर'
            },
            {
              name: 'Chamba',
              native: 'चंबा'
            },
            {
              name: 'Hamirpur',
              native: 'हमीरपुर'
            },
            {
              name: 'Kangra',
              native: 'कांगड़ा'
            },
            {
              name: 'Kinnaur',
              native: 'किन्नौर'
            },
            {
              name: 'Kullu',
              native: 'कुल्लू'
            },
            {
              name: 'L& spiti',
              native: 'लाहौल एंड स्पीति'
            },
            {
              name: 'Mandi',
              native: 'मंडीशिमला'
            },
            {
              name: 'Shimla',
              native: 'शिमला'
            },
            {
              name: 'Sirmour',
              native: 'सिरमौर'
            },
            {
              name: 'Solan',
              native: 'सोलन'
            },
            {
              name: 'Una',
              native: 'ऊना'
            }
          ]
        },
        {
          name: 'Jammu & Kashmir',
          native: 'जम्मू और कश्मीर',
          districts: [
            {
              name: 'Anantnag',
              native: 'अनंतनाग'
            },
            {
              name: 'Bandipora',
              native: 'बांदीपुरा'
            },
            {
              name: 'Baramulla',
              native: 'बारामूला'
            },
            {
              name: 'Badgam',
              native: 'बड़गाम'
            },
            {
              name: 'Doda',
              native: 'डोडा'
            },
            {
              name: 'Ganderbal',
              native: 'गांदरबल'
            },
            {
              name: 'Jammu',
              native: 'जम्मू'
            },
            {
              name: 'Kathua',
              native: 'कठुआ'
            },
            {
              name: 'Kishtwar',
              native: 'किश्तवाड़'
            },
            {
              name: 'Kulgam',
              native: 'कुलगाम'
            },
            {
              name: 'Kupwara',
              native: 'कुपवाड़ा'
            },
            {
              name: 'Poonch',
              native: 'पूंछ'
            },
            {
              name: 'Pulwama',
              native: 'पुलवामा'
            },
            {
              name: 'Rajouri',
              native: 'राजौरी'
            },
            {
              name: 'Ramban',
              native: 'रामबन'
            },
            {
              name: 'Reasi',
              native: 'रियासी'
            },
            {
              name: 'Samba',
              native: 'सांबा'
            },
            {
              name: 'Shopian',
              native: 'शोपियां'
            },
            {
              name: 'Srinagar',
              native: 'श्रीनगर'
            },
            {
              name: 'Udhampur',
              native: 'उधमपुर'
            }
          ]
        },
        {
          name: 'Jharkhand',
          native: 'झारखण्ड',
          districts: [
            {
              name: 'Bokaro',
              native: 'बोकारो'
            },
            {
              name: 'Chatra',
              native: 'चतरा'
            },
            {
              name: 'Deoghar',
              native: 'देवघर'
            },
            {
              name: 'Dhanbad',
              native: 'धनबाद'
            },
            {
              name: 'Dumka',
              native: 'दुमका'
            },
            {
              name: 'Garhwa',
              native: 'गढ़वा'
            },
            {
              name: 'Giridih',
              native: 'गिरिडीह'
            },
            {
              name: 'Godda',
              native: 'गोड्डा'
            },
            {
              name: 'Gumla',
              native: 'गुमला'
            },
            {
              name: 'Hazaribagh',
              native: 'हजारीबाग'
            },
            {
              name: 'Jamtara',
              native: 'जामताड़ा'
            },
            {
              name: 'Khunti',
              native: 'खूंटी'
            },
            {
              name: 'Kodarma',
              native: 'कोडरमा'
            },
            {
              name: 'Latehar',
              native: 'लातेहार'
            },
            {
              name: 'Lohardaga',
              native: 'लोहरदगा'
            },
            {
              name: 'Pakaur',
              native: 'पाकुर'
            },
            {
              name: 'Palamu',
              native: 'पलामू'
            },
            {
              name: 'Pashchimi Singhbhum',
              native: 'पशचिमी सिंहभूम'
            },
            {
              name: 'Purbi Singhbhum',
              native: 'पूर्बी सिंहभूम'
            },
            {
              name: 'Ramgarh',
              native: 'रामगढ़'
            },
            {
              name: 'Ranchi',
              native: 'रांची'
            },
            {
              name: 'Sahibganj',
              native: 'साहिबगंज'
            },
            {
              name: 'Saraikela',
              native: 'सराईकेला'
            },
            {
              name: 'Simdega',
              native: 'सिमडेगा'
            }
          ]
        },
        {
          name: 'Karnataka',
          native: 'कर्णाटक',
          districts: [
            {
              name: 'Bagalkote',
              native: 'बागलकोट'
            },
            {
              name: 'Bangalore rural',
              native: 'बैंगलोर ग्रामीण'
            },
            {
              name: 'Bangalore urban',
              native: 'बैंगलोर शहरी'
            },
            {
              name: 'Belgaum',
              native: 'बेलगाम'
            },
            {
              name: 'Bellary',
              native: 'बेल्लारी'
            },
            {
              name: 'Bidar',
              native: 'बीदर'
            },
            {
              name: 'Bijapur',
              native: 'बीजापुर'
            },
            {
              name: 'Chamarajanagar',
              native: 'चामराजनगर'
            },
            {
              name: 'Chikkaballapur',
              native: 'चिकबलपुर'
            },
            {
              name: 'Chikmagalur',
              native: 'चिकमंगलूर'
            },
            {
              name: 'Chitradurga',
              native: 'चित्रदुर्ग'
            },
            {
              name: 'Dakshina kannada',
              native: 'दक्षिणा कन्नडा'
            },
            {
              name: 'Davangere',
              native: 'दावनगिरि'
            },
            {
              name: 'Dharwad',
              native: 'धारवाड़'
            },
            {
              name: 'Gadag',
              native: 'गडग'
            },
            {
              name: 'Gulbarga',
              native: 'गुलबर्गा'
            },
            {
              name: 'Hassan',
              native: 'हसन'
            },
            {
              name: 'Haveri',
              native: 'हावेरी'
            },
            {
              name: 'Kodagu',
              native: 'कोडागू'
            },
            {
              name: 'Kolar',
              native: 'कोलार'
            },
            {
              name: 'Koppal',
              native: 'कोप्पल'
            },
            {
              name: 'Mandya',
              native: 'मंड्या'
            },
            {
              name: 'Mysore',
              native: 'मैसूर'
            },
            {
              name: 'Raichur',
              native: 'रायचूर'
            },
            {
              name: 'Ramanagara',
              native: 'रामनगर'
            },
            {
              name: 'Shimoga',
              native: 'शिमोगा'
            },
            {
              name: 'Tumkur',
              native: 'तुमकुर'
            },
            {
              name: 'Udupi',
              native: 'उडुपी'
            },
            {
              name: 'Uttarakannada',
              native: 'उत्तर कन्नडा'
            },
            {
              name: 'Yadgir',
              native: 'यादगीर'
            }
          ]
        },
        {
          name: 'Kerala',
          native: 'केरला',
          districts: [
            {
              name: 'Thiruvanathapuram',
              native: 'तिरुवनंतपुरम'
            },
            {
              name: 'Alappuzha',
              native: 'अलाप्पुझा'
            },
            {
              name: 'Ernakulam',
              native: 'एर्नाकुलम'
            },
            {
              name: 'Idukki',
              native: 'इडुक्की'
            },
            {
              name: 'Kannur',
              native: 'कन्नूर'
            },
            {
              name: 'Kasargode',
              native: 'कासरगोड'
            },
            {
              name: 'Kollam',
              native: 'कोल्लम'
            },
            {
              name: 'Kottayam',
              native: 'कोट्टायम'
            },
            {
              name: 'Kozhikkode',
              native: 'कोझिकोड'
            },
            {
              name: 'Malappuram',
              native: 'मलप्पुरम'
            },
            {
              name: 'Palakkad',
              native: 'पलक्कड़'
            },
            {
              name: 'Pathanamthitta',
              native: 'पथानामथिट्टा'
            },
            {
              name: 'Thrissur',
              native: 'त्रिशूर'
            },
            {
              name: 'Wayanad',
              native: 'वायनाड'
            }
          ]
        },
        {
          name: 'Ladakh',
          native: 'लद्दाख़',
          districts: [
            {
              name: 'Kargil',
              native: 'कारगिल'
            },
            {
              name: 'Leh',
              native: 'लेह'
            }
          ]
        },
        {
          name: 'Lakshadweep',
          native: 'लक्षद्वीप',
          districts: [
            {
              name: 'Lakshadweep',
              native: 'लक्षद्वीप'
            }
          ]
        },
        {
          name: 'Madhya Pradesh',
          native: 'मध्य प्रदेश',
          districts: [
            {
              name: 'Agar',
              native: 'अगर'
            },
            {
              name: 'Alirajpur',
              native: 'अलीराजपुर'
            },
            {
              name: 'Anuppur',
              native: 'अनूपपुर'
            },
            {
              name: 'Ashoknagar',
              native: 'अशोकनगर'
            },
            {
              name: 'Balaghat',
              native: 'बालाघाट'
            },
            {
              name: 'Barwani',
              native: 'बड़वानी'
            },
            {
              name: 'Betul',
              native: 'बेतुल'
            },
            {
              name: 'Bhind',
              native: 'भिंड'
            },
            {
              name: 'Bhopal',
              native: 'भोपाल'
            },
            {
              name: 'Burhanpur',
              native: 'बुरहानपुर'
            },
            {
              name: 'Chhatarpur',
              native: 'छतरपुर'
            },
            {
              name: 'Chhindwada',
              native: 'छिंदवाड़ा'
            },
            {
              name: 'Damoh',
              native: 'दमोह'
            },
            {
              name: 'Datia',
              native: 'दतिया'
            },
            {
              name: 'Dewas',
              native: 'देवास'
            },
            {
              name: 'Dhar',
              native: 'धार'
            },
            {
              name: 'Dindori',
              native: 'डिंडोरी'
            },
            {
              name: 'Guna',
              native: 'गुना'
            },
            {
              name: 'Gwalior',
              native: 'ग्वालियर'
            },
            {
              name: 'Harda',
              native: 'हरदा'
            },
            {
              name: 'Hoshangabad',
              native: 'होशंगाबाद'
            },
            {
              name: 'Indore',
              native: 'इंदौर'
            },
            {
              name: 'Jabalpur',
              native: 'जबलपुर'
            },
            {
              name: 'Jhabua',
              native: 'झाबुआ'
            },
            {
              name: 'Katni',
              native: 'कटनी'
            },
            {
              name: 'Khandwa',
              native: 'खंडवा'
            },
            {
              name: 'Khargone',
              native: 'खरगोन'
            },
            {
              name: 'Mandala',
              native: 'मंडला'
            },
            {
              name: 'Mandsoure',
              native: 'मंदसौर'
            },
            {
              name: 'Morena',
              native: 'मोरेना'
            },
            {
              name: 'Narsinghpur',
              native: 'नरसिंहपुर'
            },
            {
              name: 'Neemuch',
              native: 'नीमच'
            },
            {
              name: 'Panna',
              native: 'पन्ना'
            },
            {
              name: 'Raisen',
              native: 'रायसेन'
            },
            {
              name: 'Rajgarh',
              native: 'राजगढ़'
            },
            {
              name: 'Ratlam',
              native: 'रतलाम'
            },
            {
              name: 'Rewa',
              native: 'रीवा'
            },
            {
              name: 'Sagar',
              native: 'सागर'
            },
            {
              name: 'Satna',
              native: 'सतना'
            },
            {
              name: 'Sehore',
              native: 'सीहोर'
            },
            {
              name: 'Seoni',
              native: 'सिवनी'
            },
            {
              name: 'Shahdol',
              native: 'शाहडोल'
            },
            {
              name: 'Shajapur',
              native: 'शाजापुर'
            },
            {
              name: 'Sheopur',
              native: 'श्योपुर'
            },
            {
              name: 'Shivpuri',
              native: 'शिवपुरी'
            },
            {
              name: 'Sidhi',
              native: 'सीधी'
            },
            {
              name: 'Singroli',
              native: 'सिंगरोली'
            },
            {
              name: 'Tikamgarh',
              native: 'टीकमगढ़'
            },
            {
              name: 'Ujjain',
              native: 'उज्जैन'
            },
            {
              name: 'Umaria',
              native: 'उमरिया'
            },
            {
              name: 'Vidisha',
              native: 'विदिशा'
            }
          ]
        },
        {
          name: 'Maharashtra',
          native: 'महाराष्ट्र',
          districts: [
            {
              name: 'Ahmednagar',
              native: 'अहमदनगर'
            },
            {
              name: 'Akola',
              native: 'अकोला'
            },
            {
              name: 'Amravati',
              native: 'अमरावती'
            },
            {
              name: 'Aurangabad',
              native: 'औरंगाबाद'
            },
            {
              name: 'Beed',
              native: 'बीड'
            },
            {
              name: 'Bhandara',
              native: 'भंडारा'
            },
            {
              name: 'Buldhana',
              native: 'बुलढाना'
            },
            {
              name: 'Chandrapur',
              native: 'चंद्रपुर'
            },
            {
              name: 'Dhule',
              native: 'धुले'
            },
            {
              name: 'Gadchiroli',
              native: 'गढ़चिरोली'
            },
            {
              name: 'Gondia',
              native: 'गोंदिया'
            },
            {
              name: 'Hingoli',
              native: 'हिंगोली'
            },
            {
              name: 'Jalgaon',
              native: 'जलगांव'
            },
            {
              name: 'Jalna',
              native: 'जलना'
            },
            {
              name: 'Kolhapur',
              native: 'कोल्हापुर'
            },
            {
              name: 'Latur',
              native: 'लातूर'
            },
            {
              name: 'Mumbai City',
              native: 'मुंबई शहर'
            },
            {
              name: 'Mumbai Suburban',
              native: 'मुंबई उपनगर'
            },
            {
              name: 'Nagpur',
              native: 'नागपुर'
            },
            {
              name: 'Nanded',
              native: 'नांदेड़'
            },
            {
              name: 'Nandurbar',
              native: 'नंदुरबार'
            },
            {
              name: 'Nashik',
              native: 'नासिक'
            },
            {
              name: 'Osmanabad',
              native: 'उस्मानाबाद'
            },
            {
              name: 'Palghar',
              native: 'पालघर'
            },
            {
              name: 'Parbhani',
              native: 'परभानी'
            },
            {
              name: 'Pune',
              native: 'पुणे'
            },
            {
              name: 'Raigad',
              native: 'रायगढ़'
            },
            {
              name: 'Ratnagiri',
              native: 'रत्नागिरी'
            },
            {
              name: 'Sangli',
              native: 'सांगली'
            },
            {
              name: 'Satara',
              native: 'सतारा'
            },
            {
              name: 'Sindhudurg',
              native: 'सिंधुदुर्ग'
            },
            {
              name: 'Solapur',
              native: 'सोलापुर'
            },
            {
              name: 'Thane',
              native: 'ठाणे'
            },
            {
              name: 'Wardha',
              native: 'वर्धा'
            },
            {
              name: 'Washim',
              native: 'वाशिम'
            },
            {
              name: 'Yavatmal',
              native: 'यवतमाल'
            }
          ]
        },
        {
          name: 'Manipur',
          native: 'मणिपुर',
          districts: [
            {
              name: 'Bishanpur',
              native: 'बिशनपुर'
            },
            {
              name: 'Chandel',
              native: 'चंदेल'
            },
            {
              name: 'Churachandpur',
              native: 'चुरचांदपुर'
            },
            {
              name: 'Imphal East',
              native: 'इम्फाल पूर्व'
            },
            {
              name: 'Imphal West',
              native: 'इम्फाल पश्चिम'
            },
            {
              name: 'Jiribam',
              native: 'जिरीबाम'
            },
            {
              name: 'Kakching',
              native: 'कक्चिंग'
            },
            {
              name: 'Kamjong',
              native: 'कमजोंग'
            },
            {
              name: 'Kangpokpi',
              native: 'कांगपोकपि'
            },
            {
              name: 'Noney',
              native: 'नोनी'
            },
            {
              name: 'Pherzawl',
              native: 'फरज़ाल'
            },
            {
              name: 'Senapati',
              native: 'सेनापति'
            },
            {
              name: 'Tamenglong',
              native: 'तामेंगलांग'
            },
            {
              name: 'Tengnoupal',
              native: 'टेंगनूपाल'
            },
            {
              name: 'Thoubal',
              native: 'थौबल'
            },
            {
              name: 'Ukhrul',
              native: 'उखरूल'
            }
          ]
        },
        {
          name: 'Meghalaya',
          native: 'मेघालय',
          districts: [
            {
              name: 'East Garo Hills',
              native: 'ईस्ट गारो हिल्स'
            },
            {
              name: 'East Jaintia Hills',
              native: 'ईस्ट जैंतिया हिल्स'
            },
            {
              name: 'East Khasi Hills',
              native: 'पूर्वी खासी हिल्स'
            },
            {
              name: 'North Garo Hills',
              native: 'उत्तर गारो हिल्स'
            },
            {
              name: 'Ri Bhoi',
              native: 'री भोई'
            },
            {
              name: 'South Garo Hills',
              native: 'दक्षिण गारो हिल्स'
            },
            {
              name: 'South West Garo Hills',
              native: 'साउथ वेस्ट गारो हिल्स'
            },
            {
              name: 'South West Khasi Hills',
              native: 'दक्षिण पश्चिम खासी हिल्स'
            },
            {
              name: 'West Garo Hills',
              native: 'वेस्ट गारो हिल्स'
            },
            {
              name: 'West Jaintia Hills',
              native: 'वेस्ट जैंतिया हिल्स'
            },
            {
              name: 'West Khasi Hills',
              native: 'पश्चिम खासी हिल्स'
            }
          ]
        },
        {
          name: 'Mizoram',
          native: 'मिजोरम',
          districts: [
            {
              name: 'Aizawl',
              native: 'आइजोल'
            },
            {
              name: 'Champhai District',
              native: 'चंपई जिला'
            },
            {
              name: 'Kolasib District',
              native: 'कोलासिब जिला'
            },
            {
              name: 'Lawngtlai District',
              native: 'लॉंगटलाई जिला'
            },
            {
              name: 'Lunglei District',
              native: 'लुंगलेई जिला'
            },
            {
              name: 'Mamit District',
              native: 'ममित जिला'
            },
            {
              name: 'Saiha District',
              native: 'साईं जिला'
            },
            {
              name: 'Serchhip District',
              native: 'सेरछिप जिला'
            }
          ]
        },
        {
          name: 'Nagaland',
          native: 'नागालैंड',
          districts: [
            {
              name: 'Dimapur',
              native: 'दीमापुर'
            },
            {
              name: 'Kiphire',
              native: 'किफायर'
            },
            {
              name: 'Kohima',
              native: 'कोहिमा'
            },
            {
              name: 'Longleng',
              native: 'लोंगलेंग'
            },
            {
              name: 'Mokokchung',
              native: 'मोकोकचुंग'
            },
            {
              name: 'Mon',
              native: 'सोम'
            },
            {
              name: 'Phek',
              native: 'फेक'
            },
            {
              name: 'Peren',
              native: 'पेरेन'
            },
            {
              name: 'Tuensang',
              native: 'तुएनसांग'
            },
            {
              name: 'Wokha',
              native: 'वोखा'
            },
            {
              name: 'Zunheboto',
              native: 'जुन्हेबोटो'
            }
          ]
        },
        {
          name: 'Odisha',
          native: 'ओडिशा',
          districts: [
            {
              name: 'Anugul',
              native: 'अंगुल'
            },
            {
              name: 'Balangir',
              native: 'बलांगीर'
            },
            {
              name: 'Baleshwar',
              native: 'बालेश्वर'
            },
            {
              name: 'Bargarh',
              native: 'बारगढ़'
            },
            {
              name: 'Baudh',
              native: 'बौद्ध'
            },
            {
              name: 'Bhadrak',
              native: 'भद्रक'
            },
            {
              name: 'Cuttack',
              native: 'कटक'
            },
            {
              name: 'Deogarh',
              native: 'देवगढ़'
            },
            {
              name: 'Dhenkanal',
              native: 'ढेंकनाल'
            },
            {
              name: 'Gajapati',
              native: 'गजपति'
            },
            {
              name: 'Ganjam',
              native: 'गंजम'
            },
            {
              name: 'Jagatsinghpur',
              native: 'जगतसिंहपुर'
            },
            {
              name: 'Jajapur',
              native: 'जाजपुर'
            },
            {
              name: 'Jharsuguda',
              native: 'झारसुगुडा'
            },
            {
              name: 'Kalahandi',
              native: 'कालाहांडी'
            },
            {
              name: 'Kandhamal',
              native: 'कंधमाल'
            },
            {
              name: 'Kendrapara',
              native: 'केंद्रपाड़ा'
            },
            {
              name: 'Keonjhar',
              native: 'केओंझर'
            },
            {
              name: 'Khordha',
              native: 'खोरधा'
            },
            {
              name: 'Koraput',
              native: 'कोरापुट'
            },
            {
              name: 'Malkangiri',
              native: 'मल्कानगिरी'
            },
            {
              name: 'Mayurbhanj',
              native: 'मयूरभंज'
            },
            {
              name: 'Nabarangapur',
              native: 'नबरंगपुर'
            },
            {
              name: 'Nayagarh',
              native: 'नयागढ़'
            },
            {
              name: 'Nuapada',
              native: 'नुआपाड़ा'
            },
            {
              name: 'Puri',
              native: 'पुरी'
            },
            {
              name: 'Rayagada',
              native: 'रायगढ़'
            },
            {
              name: 'Sambalpur',
              native: 'संबलपुर'
            },
            {
              name: 'Sonapur',
              native: 'सोनापुर'
            },
            {
              name: 'Sundargarh',
              native: 'सुंदरगढ़'
            }
          ]
        },
        {
          name: 'Pondicherry',
          native: 'पुदुच्चेरी',
          districts: [
            {
              name: 'Pondicherry',
              native: 'पांडिचेरी'
            },
            {
              name: 'Karaikal',
              native: 'कराईकल'
            },
            {
              name: 'Mahe',
              native: 'माहे'
            },
            {
              name: 'Yanam',
              native: 'यानम'
            }
          ]
        },
        {
          name: 'Punjab',
          native: 'पंजाब',
          districts: [
            {
              name: 'Amritsar',
              native: 'अमृतसर'
            },
            {
              name: 'Barnala',
              native: 'बरनाला'
            },
            {
              name: 'Bathinda',
              native: 'बठिंडा'
            },
            {
              name: 'Faridkot',
              native: 'फरीदकोट'
            },
            {
              name: 'Fateh Garh Sahib',
              native: 'फतेह गढ़ साहिब'
            },
            {
              name: 'Fazilka',
              native: 'फाजिल्का'
            },
            {
              name: 'Ferozpur',
              native: 'फिरोजपुर'
            },
            {
              name: 'Gurdaspur',
              native: 'गुरदासपुर'
            },
            {
              name: 'Hoshiarpur',
              native: 'होशियारपुर'
            },
            {
              name: 'Jalandhar',
              native: 'जालंधर'
            },
            {
              name: 'Kapurthala',
              native: 'कपूरथला'
            },
            {
              name: 'Ludhiana',
              native: 'लुधियाना'
            },
            {
              name: 'Mansa',
              native: 'मानसा'
            },
            {
              name: 'Moga',
              native: 'मोगा'
            },
            {
              name: 'Mohali',
              native: 'मोहाली'
            },
            {
              name: 'Mukatsar',
              native: 'मुक्तसर'
            },
            {
              name: 'Nawanshahar',
              native: 'नवांशहर'
            },
            {
              name: 'Patiala',
              native: 'पटियाला'
            },
            {
              name: 'Pathankot',
              native: 'पठानकोट'
            },
            {
              name: 'Ropar',
              native: 'रोपड़'
            },
            {
              name: 'Sangrur',
              native: 'संगरूर '
            },
            {
              name: 'Tarn Taran',
              native: 'तरनतारन'
            }
          ]
        },
        {
          name: 'Rajasthan',
          native: 'राजस्थान',
          districts: [
            {
              name: 'Ajmer',
              native: 'अजमेर'
            },
            {
              name: 'Alwar',
              native: 'अलवर'
            },
            {
              name: 'Baran',
              native: 'बारां'
            },
            {
              name: 'Banswara',
              native: 'बांसवाड़ा'
            },
            {
              name: 'Barmer',
              native: 'बाड़मेर'
            },
            {
              name: 'Bharatpur',
              native: 'भरतपुर'
            },
            {
              name: 'Bhilwara',
              native: 'भीलवाड़ा'
            },
            {
              name: 'Bikaner',
              native: 'बीकानेर'
            },
            {
              name: 'Bundi',
              native: 'बूंदी'
            },
            {
              name: 'Chittorgarh',
              native: 'चित्तौड़गढ़'
            },
            {
              name: 'Churu',
              native: 'चुरू'
            },
            {
              name: 'Dausa',
              native: 'दौसा'
            },
            {
              name: 'Dholpur',
              native: 'धौलपुर'
            },
            {
              name: 'Dungarpur',
              native: 'डूंगरपुर'
            },
            {
              name: 'Ganganagar',
              native: 'गंगानगर'
            },
            {
              name: 'Hanumangarh',
              native: 'हनुमानगढ़'
            },
            {
              name: 'Jaipur',
              native: 'जयपुर'
            },
            {
              name: 'Jaisalmer',
              native: 'जैसलमेर'
            },
            {
              name: 'Jalore',
              native: 'जालोर'
            },
            {
              name: 'Jhalawar',
              native: 'झालावाड़'
            },
            {
              name: 'Jhunjhunu',
              native: 'झुंझुनू'
            },
            {
              name: 'Jodhpur',
              native: 'जोधपुर'
            },
            {
              name: 'Karauli',
              native: 'करौली'
            },
            {
              name: 'Kota',
              native: 'कोटा'
            },
            {
              name: 'Nagaur',
              native: 'नागौर'
            },
            {
              name: 'Pali',
              native: 'पाली'
            },
            {
              name: 'Pratapgarh',
              native: 'प्रतापगढ़'
            },
            {
              name: 'Rajsamand',
              native: 'राजसमंद'
            },
            {
              name: 'Sawai Madhopur',
              native: 'सवाई माधोपुर'
            },
            {
              name: 'Sikar',
              native: 'सीकर'
            },
            {
              name: 'Sirohi',
              native: 'सिरोही'
            },
            {
              name: 'Tonk',
              native: 'टोंक'
            },
            {
              name: 'Udaipur',
              native: 'उदयपुर'
            }
          ]
        },
        {
          name: 'Sikkim',
          native: 'सिक्किम',
          districts: [
            {
              name: 'East',
              native: 'पूर्व'
            },
            {
              name: 'West',
              native: 'पश्चिम'
            },
            {
              name: 'North',
              native: 'उत्तर'
            },
            {
              name: 'South',
              native: 'दक्षिण'
            }
          ]
        },
        {
          name: 'Tamil Nadu',
          native: 'तमिलनाडु',
          districts: [
            {
              name: 'Ariyalur',
              native: 'अरियालुर'
            },
            {
              name: 'Chennai',
              native: 'चेन्नई'
            },
            {
              name: 'Coimbatore',
              native: 'कोयंबटूर'
            },
            {
              name: 'Cuddalore',
              native: 'कुड्डालोर'
            },
            {
              name: 'Dharmapuri',
              native: 'धर्मपुरी'
            },
            {
              name: 'Dindigul',
              native: 'डिंडीगुल'
            },
            {
              name: 'Erode',
              native: 'इरोड'
            },
            {
              name: 'Kancheepuram',
              native: 'कांचीपुरम'
            },
            {
              name: 'Kanniyakumari',
              native: 'कन्याकुमारी'
            },
            {
              name: 'Karur',
              native: 'करूर'
            },
            {
              name: 'Krishnagiri',
              native: 'कृष्णागिरी'
            },
            {
              name: 'Madurai',
              native: 'मदुरै'
            },
            {
              name: 'Nagapattinam',
              native: 'नागपट्टिनम'
            },
            {
              name: 'Namakkal',
              native: 'नमक्कल'
            },
            {
              name: 'Perambalur',
              native: 'पेरम्बलुर'
            },
            {
              name: 'Pudukottai',
              native: 'पुडुकोट्टई'
            },
            {
              name: 'Ramanathapuram',
              native: 'रामनाथपुरम'
            },
            {
              name: 'Salem',
              native: 'सलेम'
            },
            {
              name: 'Sivaganga',
              native: 'शिवगंगा'
            },
            {
              name: 'Thanjavur',
              native: 'तंजावुर'
            },
            {
              name: 'The Nilgiris',
              native: 'नीलगिरी'
            },
            {
              name: 'Theni',
              native: 'थेनि '
            },
            {
              name: 'Thiruvallur',
              native: 'तिरुवल्लुर'
            },
            {
              name: 'Thoothukudi',
              native: 'थूथुकुड़ी'
            },
            {
              name: 'Tiruchirapalli',
              native: 'तिरुचिरापल्ली'
            },
            {
              name: 'Tirunelveli',
              native: 'तिरुनेलवेली'
            },
            {
              name: 'Tiruppur',
              native: 'तिरुपूर'
            },
            {
              name: 'Tiruvannamalai',
              native: 'तिरुवन्नामलाई'
            },
            {
              name: 'Tiruvarur',
              native: 'तिरुवरुर'
            },
            {
              name: 'Vellore',
              native: 'वेल्लोर'
            },
            {
              name: 'Villupuram',
              native: 'विल्लुपुरम'
            },
            {
              name: 'Virudhunagar',
              native: 'विरुधुनगर'
            }
          ]
        },
        {
          name: 'Telangana',
          native: 'तेलंगाना',
          districts: [
            {
              name: 'Adilabad',
              native: 'आदिलाबाद'
            },
            {
              name: 'Bhadradri Kothagudem',
              native: 'भद्राद्री कोठगुदेम'
            },
            {
              name: 'Hyderabad',
              native: 'हैदराबाद'
            },
            {
              name: 'Jagtial',
              native: 'जागतिअल'
            },
            {
              name: 'Jangaon',
              native: 'जनगांव'
            },
            {
              name: 'Jayashankar Bhupalapally',
              native: 'जयशंकर भूपालपल्ली'
            },
            {
              name: 'Jogulamba Gadwal',
              native: 'जोगुलम्बा गडवाल'
            },
            {
              name: 'Kamareddy',
              native: 'कामारेड्डी'
            },
            {
              name: 'Karimnagar',
              native: 'करीमनगर'
            },
            {
              name: 'Khammam',
              native: 'खम्मम'
            },
            {
              name: 'Komaram Bheem Asifabad',
              native: 'कोमाराम भीम आसिफाबाद'
            },
            {
              name: 'Mahabubabad',
              native: 'महबुबाबाद'
            },
            {
              name: 'Mahabubnagar',
              native: 'महबूबनगर'
            },
            {
              name: 'Mancherial',
              native: 'मानचेरिअल'
            },
            {
              name: 'Medak',
              native: 'मेडक'
            },
            {
              name: 'Medchal',
              native: 'मेडचाल'
            },
            {
              name: 'Nagarkurnool',
              native: 'नगरकुरनूल'
            },
            {
              name: 'Nalgonda',
              native: 'नलगोंडा'
            },
            {
              name: 'Nirmal',
              native: 'निर्मल'
            },
            {
              name: 'Nizamabad',
              native: 'निजामाबाद'
            },
            {
              name: 'Peddapalli',
              native: 'पेद्दापल्ली'
            },
            {
              name: 'Rajanna Sircilla',
              native: 'राजन्ना सिरसिला'
            },
            {
              name: 'Rangareddy',
              native: 'रंगारेड्डी'
            },
            {
              name: 'Sangareddy',
              native: 'संगारेड्डी'
            },
            {
              name: 'Siddipet',
              native: 'सिद्दीपेट'
            },
            {
              name: 'Suryapet',
              native: 'सूर्यापेट'
            },
            {
              name: 'Vikarabad',
              native: 'विकाराबाद'
            },
            {
              name: 'Wanaparthy',
              native: 'वनापार्थी'
            },
            {
              name: 'Warangal Rural',
              native: 'वारंगल ग्रामीण'
            },
            {
              name: 'Warangal Urban',
              native: 'वारंगल अर्बन'
            },
            {
              name: 'Yadadri Bhuvanagiri',
              native: 'यदाद्री भुवनगिरि'
            }
          ]
        },
        {
          name: 'Tripura',
          native: 'त्रिपुरा',
          districts: [
            {
              name: 'Unakoti District',
              native: 'उनाकोटि जिला'
            },
            {
              name: 'South District',
              native: 'दक्षिण जिला'
            },
            {
              name: 'Gomati District',
              native: 'गोमती जिला'
            },
            {
              name: 'Sepahijala District',
              native: 'सिपाहीजला जिला'
            },
            {
              name: 'Khowai District',
              native: 'खोवाई जिला'
            },
            {
              name: 'North District',
              native: 'उत्तर जिला'
            },
            {
              name: 'West District',
              native: 'पश्चिम जिला'
            },
            {
              name: 'Dhalai District',
              native: 'धलाई जिला'
            }
          ]
        },
        {
          name: 'Uttar Pradesh',
          native: 'उत्तर प्रदेश',
          districts: [
            {
              name: 'Agra',
              native: 'आगरा'
            },
            {
              name: 'Aligarh',
              native: 'अलीगढ़'
            },
            {
              name: 'Prayag Raj (Allahabad)',
              native: 'प्रयाग राज (इलाहाबाद)'
            },
            {
              name: 'Ambedkar Nagar',
              native: 'अंबेडकरनगर'
            },
            {
              name: 'Amethi',
              native: 'अमेठी'
            },
            {
              name: 'Auraiya',
              native: 'औरैया'
            },
            {
              name: 'Azamgarh',
              native: 'आजमगढ़'
            },
            {
              name: 'Badaun',
              native: 'बदायूं'
            },
            {
              name: 'Bagpat',
              native: 'बागपत'
            },
            {
              name: 'Bahraich',
              native: 'बहराइच'
            },
            {
              name: 'Balia',
              native: 'बलिया'
            },
            {
              name: 'Balrampur',
              native: 'बलरामपुर'
            },
            {
              name: 'Banda',
              native: 'बांदा'
            },
            {
              name: 'Barabanki',
              native: 'बाराबंकी'
            },
            {
              name: 'Bareilly',
              native: 'बरेली'
            },
            {
              name: 'Basti',
              native: 'बस्ती'
            },
            {
              name: 'Bijnor',
              native: 'बिजनौर'
            },
            {
              name: 'Bulandshahar',
              native: 'बुलंदशहर'
            },
            {
              name: 'Chandauli',
              native: 'चंदौली'
            },
            {
              name: 'Chitrakoot',
              native: 'चित्रकूट'
            },
            {
              name: 'Deoria',
              native: 'देवरिया'
            },
            {
              name: 'Etah',
              native: 'एटा'
            },
            {
              name: 'Etawah',
              native: 'इटावा'
            },
            {
              name: 'Faizabad',
              native: 'फैजाबाद'
            },
            {
              name: 'Farrukhabad',
              native: 'फर्रुखाबाद'
            },
            {
              name: 'Fatehpur',
              native: 'फतेहपुर'
            },
            {
              name: 'Firozabad',
              native: 'फिरोजाबाद'
            },
            {
              name: 'G B Nagar',
              native: 'जी बी नगर'
            },
            {
              name: 'Ghaziabad',
              native: 'गाज़ियाबाद'
            },
            {
              name: 'Ghazipur',
              native: 'गाजीपुर'
            },
            {
              name: 'Gonda',
              native: 'गोंडा'
            },
            {
              name: 'Gorakhpur',
              native: 'गोरखपुर'
            },
            {
              name: 'Hamirpur',
              native: 'हमीरपुर'
            },
            {
              name: 'Hapur',
              native: 'हापुड़'
            },
            {
              name: 'Hardoi',
              native: 'हरदोई'
            },
            {
              name: 'Hathras',
              native: 'हाथरस'
            },
            {
              name: 'Jalaun',
              native: 'जालौन'
            },
            {
              name: 'Jaunpur',
              native: 'जौनपुर'
            },
            {
              name: 'Jhansi',
              native: 'झांसी'
            },
            {
              name: 'JP Nagar',
              native: 'जेपी नगर'
            },
            {
              name: 'Kannauj',
              native: 'कन्नौज'
            },
            {
              name: 'Kanpur Dehat',
              native: 'कानपुर देहात'
            },
            {
              name: 'Kanpur Nagar',
              native: 'कानपुर नगर'
            },
            {
              name: 'Kashganj',
              native: 'काशगंज'
            },
            {
              name: 'Kaushambi',
              native: 'कौशाम्बी'
            },
            {
              name: 'Kushinagar',
              native: 'कुशीनगर'
            },
            {
              name: 'Lakhimpur',
              native: 'लखीमपुर'
            },
            {
              name: 'Lalitpur',
              native: 'ललितपुर'
            },
            {
              name: 'Lucknow',
              native: 'लखनऊ'
            },
            {
              name: 'Maharajganj',
              native: 'महाराजगंज'
            },
            {
              name: 'Mahoba',
              native: 'महोबा'
            },
            {
              name: 'Mainpuri',
              native: 'मैनपुरी'
            },
            {
              name: 'Mathura',
              native: 'मथुरा'
            },
            {
              name: 'Mau',
              native: 'मऊ'
            },
            {
              name: 'Meerut',
              native: 'मेरठ'
            },
            {
              name: 'Mirzapur',
              native: 'मिर्जापुर'
            },
            {
              name: 'Moradabad',
              native: 'मुरादाबाद'
            },
            {
              name: 'Muzaffarnagar',
              native: 'मुजफ्फरनगर'
            },
            {
              name: 'Pilibhit',
              native: 'पीलीभीत'
            },
            {
              name: 'Pratapgarh',
              native: 'प्रतापगढ़'
            },
            {
              name: 'Rae Bareli',
              native: 'रायबरेली'
            },
            {
              name: 'Rampur',
              native: 'रामपुर'
            },
            {
              name: 'Saharanpur',
              native: 'सहारनपुर'
            },
            {
              name: 'Sambhal',
              native: 'संभल'
            },
            {
              name: 'Sant K Nagar',
              native: 'संत कबीर नगर '
            },
            {
              name: 'Shahjahanpur',
              native: 'शाहजहांपुर'
            },
            {
              name: 'Shamli',
              native: 'शाहजहांपुर'
            },
            {
              name: 'Shrawasti',
              native: 'सरवस्ती'
            },
            {
              name: 'Siddharth Nagar',
              native: 'सिद्धार्थ नगर'
            },
            {
              name: 'Sitapur',
              native: 'सीतापुर'
            },
            {
              name: 'Sonbhadra',
              native: 'सोनभद्र'
            },
            {
              name: 'St Ravidas Nagar',
              native: 'संत रविदास नगर'
            },
            {
              name: 'Sultanpur',
              native: 'सुल्तानपुर'
            },
            {
              name: 'Unnav',
              native: 'उन्नाव'
            },
            {
              name: 'Varanasi',
              native: 'वाराणसी'
            }
          ]
        },
        {
          name: 'Uttarakhand',
          native: 'उत्तराखंड',
          districts: [
            {
              name: 'Almora',
              native: 'अल्मोड़ा'
            },
            {
              name: 'Bageshwar',
              native: 'बागेश्वर'
            },
            {
              name: 'Chamoli',
              native: 'चमोली'
            },
            {
              name: 'Champawat',
              native: 'चम्पावत'
            },
            {
              name: 'Dehradun',
              native: 'देहरादून'
            },
            {
              name: 'Haridwar',
              native: 'हरिद्वार'
            },
            {
              name: 'Nainital',
              native: 'नैनीताल'
            },
            {
              name: 'Pauri Garhwal',
              native: 'पौड़ी गढ़वाल'
            },
            {
              name: 'Pithoragarh',
              native: 'पिथोरागढ़'
            },
            {
              name: 'Tehri Garhwal',
              native: 'टिहरी गढ़वाल'
            },
            {
              name: 'Rudraprayag',
              native: 'रुद्रप्रयाग'
            },
            {
              name: 'U S NAGAR',
              native: 'यू एस नागर'
            },
            {
              name: 'Uttarkashi',
              native: 'उत्तरकाशी'
            }
          ]
        },
        {
          name: 'West Bengal',
          native: 'पश्चिम बंगाल',
          districts: [
            {
              name: 'Alipurduar',
              native: 'अलीपुरद्वार'
            },
            {
              name: 'Bankura',
              native: 'बांकुड़ा'
            },
            {
              name: 'Cooch Bihar',
              native: 'कूच बिहार'
            },
            {
              name: 'Paschim Bardhaman',
              native: 'पस्चिम बर्धमान'
            },
            {
              name: 'Purba Bardhaman',
              native: 'पुरबा बर्धमान'
            },
            {
              name: 'Birbhum',
              native: 'बीरभूम'
            },
            {
              name: 'Dakshin Dinajpur',
              native: 'दक्षिण दिनाजपुर'
            },
            {
              name: 'Darjiling',
              native: 'दार्जलिंग'
            },
            {
              name: 'Kalimpong',
              native: 'कलिम्पोंग'
            },
            {
              name: 'Haora',
              native: 'हरोरा'
            },
            {
              name: 'Hugli',
              native: 'हुगली'
            },
            {
              name: 'Jalpaiguri',
              native: 'जलपाईगुड़ी'
            },
            {
              name: 'Koch Bihar',
              native: 'कोच बिहार'
            },
            {
              name: 'Kolkata',
              native: 'कोलकाता'
            },
            {
              name: 'Malda',
              native: 'मालदा'
            },
            {
              name: 'Murshidabad',
              native: 'मुर्शिदाबाद'
            },
            {
              name: 'Nadia',
              native: 'नादिया'
            },
            {
              name: 'North 24-Parganas',
              native: 'उत्तर 24-परगना'
            },
            {
              name: 'Paschim Medinipur',
              native: 'पश्चिम  मेदिनीपुर'
            },
            {
              name: 'Purba Medinipur',
              native: 'पूर्बा मेदिनीपुर'
            },
            {
              name: 'Jhargram',
              native: 'झारग्राम'
            },
            {
              name: 'Puruliya',
              native: 'पुरुलिया'
            },
            {
              name: 'South 24-Parganas',
              native: 'दक्षिण 24-परगना'
            },
            {
              name: 'Uttar Dinajpur',
              native: 'उत्तर दिनाजपुर'
            }
          ]
        }
      ],
      numeric: '356'
    },
    IO: {
      name: 'British Indian Ocean Territory',
      native: 'British Indian Ocean Territory',
      phone: '246',
      continent: 'AS',
      capital: 'Diego Garcia',
      currency: 'USD',
      languages: 'en',
      numeric: '086'
    },
    IQ: {
      name: 'Iraq',
      native: 'العراق',
      phone: '964',
      continent: 'AS',
      capital: 'Baghdad',
      currency: 'IQD',
      languages: 'ar,ku',
      numeric: '368',
      regions: [
        {
          name: 'Al Anbar',
          native: 'محافظة الأنبار',
          districts: [
            { name: "Al-Qa'im District", native: 'قضاء القائم' },
            { name: 'Ar-Rutba District', native: 'قضاء الرطبة' },
            { name: 'Anah District', native: 'قضاء عانة' },
            { name: 'Fallujah District', native: 'قضاء الفلوجة' },
            { name: 'Haditha District', native: 'قضاء حديثة' },
            { name: 'Hīt District', native: 'قضاء هيت' },
            { name: 'Ramadi District', native: 'قضاء الرمادي' },
            { name: 'Rawah District', native: 'قضاء راوة' }
          ]
        },
        {
          name: 'Babil/ Babylon',
          native: 'محافظة بابل',
          districts: [
            { name: 'Al-Mahawil District', native: 'المحاويل' },
            { name: 'Al-Musayab District', native: 'المسيب' },
            { name: 'Hashimiya District', native: 'قضاء الهاشمية' },
            { name: 'Hilla District', native: 'ٱلْحِلَّة' }
          ]
        },
        {
          name: 'Baghdad',
          native: 'محافظة بغداد',
          districts: [
            { name: 'Rusafa', native: 'ٱلرَّصَافَة' },
            { name: 'Adhamiyah', native: 'الأعظمية' },
            { name: 'Sadr City', native: 'مدينة الصدر' },
            { name: '9 Nissan', native: 'بغداد الجديدة' },
            { name: 'Karadah', native: 'كرّادة' },
            { name: "Al-Za'franiya", native: 'مدينة الزعفرانية' },
            { name: 'Karkh', native: 'الكرخ' },
            { name: 'Kadhimyah', native: 'ٱلْكَاظِمِيَّة' },
            { name: 'Al-Mansour', native: 'المنصور' },
            { name: 'Al Rashid', native: 'اَلرَّشِيْد' },
            { name: 'Abu Ghraib District', native: 'قضاء أبي غريب' },
            { name: 'Al Istiqlal District', native: 'حي الاستقلال' },
            { name: "Al-Mada'in District", native: 'المدائن' },
            { name: 'Mahmudiya District', native: 'المحمودية' },
            { name: 'Taji District', native: 'التاجي' },
            { name: 'Al Tarmia District', native: 'الطارمية' }
          ]
        },
        {
          name: 'Basra',
          native: 'محافظة البصرة',
          districts: [
            { name: 'Abu Al-Khaseeb District', native: 'أبو الخصيب' },
            { name: 'Al-Midaina District', native: 'المدينة' },
            { name: 'Al-Qurna District', native: 'قضاء القرنة' },
            { name: 'Al-Zubair District', native: 'قضاء الزبير' },
            { name: 'Basrah District', native: 'قضاء البصرة' },
            { name: 'al-Faw District', native: 'قضاء الفاو' }
          ]
        },
        {
          name: 'Dhi Qar',
          native: 'ذي قار',
          districts: [
            { name: 'Al-Chibayish District', native: 'قضاء الجبايش' },
            { name: "Al-Rifa'i District", native: 'قضاء الرفاعي' },
            { name: 'Al-Shatra District', native: 'قضاء الشطرة' },
            { name: 'Nassriya District', native: 'قضاء الناصرية' },
            { name: 'Suq Al-Shoyokh District', native: 'قضاء سوق الشيوخ' }
          ]
        },
        {
          name: 'Al-Qādisiyyah',
          native: 'القادسية',
          districts: [
            { name: 'Afaq District', native: 'قضاء العفك' },
            { name: 'Al-Shamiya District', native: 'قضاء الشامية' },
            { name: 'Diwaniya District', native: 'قضاء الديوانية' },
            { name: 'Hamza District', native: 'قضاء الحمزة' }
          ]
        },
        {
          name: 'Diyala',
          native: 'محافظة ديالى',
          districts: [
            { name: 'Al-Khalis District', native: 'قضاء الخالص' },
            { name: 'Al-Muqdadiya District', native: 'قضاء المقدادية' },
            { name: 'Baladrooz District', native: 'قضاء بلدروز' },
            { name: "Ba'quba District", native: 'قضاء بعقوبة' },
            { name: 'Khanaqin District', native: 'قضاء خانقين' },
            { name: 'Kifri District', native: 'قضاء كفري' }
          ]
        },
        {
          name: 'Duhok',
          native: 'پارێزگای دھۆک',
          districts: [
            { name: 'Amadiya District', native: 'قضاء العمادية' },
            { name: 'Dahuk District', native: 'قضاء دهوك' },
            { name: 'Simele District', native: 'قضاء سميل' },
            { name: 'Zakho District', native: 'قضاء زاخو' }
          ]
        },
        {
          name: 'Erbil',
          native: 'پارێزگای ھەولێر',
          districts: [
            { name: 'Erbil District', native: 'قضاء أربيل;' },
            { name: 'Koisanjaq District', native: 'قضاء كويسنجق' },
            { name: 'ShaqlawaDistrict', native: 'قضاء شقلاوة' },
            { name: 'Soran District', native: 'قضاء سوران' },
            { name: 'Makhmur District', native: 'قضاء مخمور' },
            { name: 'Mergasur District', native: 'قضاء ميركسور' },
            { name: 'Choman District', native: 'قضاء جومان' },
            { name: 'Ankawa District', native: 'عنكاوا' }
          ]
        },
        {
          name: 'Halabja',
          native: 'پارێزگای ھەڵەبجە',
          districts: [
            { name: 'Halabja', native: 'حلبجة' },
            { name: 'Sirwan', native: 'قضاء سيروان' },
            { name: 'Khurmal District', native: 'قەزای خورماڵ' },
            { name: 'Byara District', native: 'بیارە' }
          ]
        },
        {
          name: 'Karbala',
          native: 'كربلاء',
          districts: [
            { name: 'Ain Al-Tamur District', native: 'قضاء عين التمر' },
            { name: 'Al-Hindiya District', native: 'قضاء الهندية' },
            { name: 'Kerbala District', native: 'قضاء كربلاء' }
          ]
        },
        {
          name: 'Kirkuk',
          native: 'محافظة كركوك',
          districts: [
            { name: 'Al-Hawiga District', native: 'قضاء الحويجة' },
            { name: 'Daquq District', native: 'قضاء داقوق' },
            { name: 'Kirkuk District', native: 'قضاء كركوك' },
            { name: 'Al-Dibis District', native: 'قضاء الدبس' }
          ]
        },
        {
          name: 'Maysan',
          native: 'ميسان',
          districts: [
            { name: 'Ali Al-Gharbi District', native: 'قضاء علي الغربي' },
            { name: 'Al-Kahla District', native: 'قضاء الكحلاء' },
            { name: 'Al-Maimouna District', native: 'قضاء الميمونة' },
            {
              name: 'Al-Mejar Al-Kabi District',
              native: 'قضاء المجر الكبير'
            },
            { name: 'Amara District', native: 'حي عمارة' },
            { name: "Qal'at Saleh District", native: 'قضاء قلعة صالح' }
          ]
        },
        {
          name: 'Muthanna',
          native: 'المثنى',
          districts: [
            { name: 'Al-Khidhir District', native: 'قضاء الخضر' },
            { name: 'Al-Rumaitha District', native: 'قضاء الرميثة' },
            { name: 'Al-Salman District', native: 'قضاء السلمان' },
            { name: 'Al-Samawa District', native: 'قضاء السماوة' }
          ]
        },
        {
          name: 'Najaf',
          native: 'النجف',
          districts: [
            { name: 'Al-Manathera District', native: 'قضاء المناذرة' },
            { name: 'Kufa District', native: 'الْكُوفَة' },
            { name: 'Najaf District', native: 'ٱلنَّجَف' },
            { name: 'Najaf Abu Sakhir', native: 'النجف ابو صخير' }
          ]
        },
        {
          name: 'Nineveh',
          native: 'محافظة نينوى',
          districts: [
            { name: 'Akre District', native: 'قضاء عقرة' },
            { name: "Al-Ba'aj District", native: 'بعاج' },
            { name: 'Al-Hamdaniya District', native: 'قضاء الحمدانية' },
            { name: 'Hatra District', native: 'قضاء الحضر' },
            { name: 'Mosul District', native: 'قضاء الموصل' },
            { name: 'Shekhan District', native: 'قضاء شيخان' },
            { name: 'Sinjar District', native: 'قضاء سنجار' },
            { name: 'Tel Afar District', native: 'قضاء تلعفر' },
            { name: 'Tel Keppe District', native: 'تل كيف' }
          ]
        },
        {
          name: 'Saladin',
          native: 'محافظة صلاح الدين',
          districts: [
            { name: 'Al-Daur District', native: 'قضاء الدور' },
            { name: 'Al-Shirqat District', native: 'الشرقاط' },
            { name: 'Baiji District', native: 'قضاء بيجي' },
            { name: 'Balad District', native: 'قضاء بلد' },
            { name: 'Samarra District', native: 'قضاء سامراء' },
            { name: 'Tikrit District', native: 'قضاء تكريت' },
            { name: 'Tooz District', native: 'قضاء طوز' },
            { name: 'Dujail District', native: 'قضاء الدجيل' }
          ]
        },
        {
          name: 'Sulaymaniyah',
          native: 'پارێزگای سلێمانی',
          districts: [
            { name: 'Pshdar District', native: 'قضاء بشدر' },
            { name: 'Chamchamal District', native: 'قەزای چەمچەماڵ' },
            { name: 'Darbandokeh District', native: 'قەزای دەربەندیخان' },
            { name: 'Dokan District', native: 'قەزای دۆکان' },
            { name: 'Kalar District', native: 'قەزای کەلار' },
            { name: 'Rania District', native: 'قضاء رانية' },
            { name: 'Sharbazher District', native: 'قەزای شارباژێڕ' },
            { name: 'Sulaymaniya District', native: 'قضاء السليمانية' },
            { name: 'Saidsadiq District', native: 'قضاء سيد صادق' },
            {
              name: 'Sharazoor District',
              native: 'قه‌زای شاره‌زوور'
            },
            { name: 'Penjwin District', native: 'قضاء بنجوين' },
            { name: 'Mawat District', native: 'قەزای ماوەت' },
            { name: 'Qaradagh District', native: 'قضاء قرة داغ' }
          ]
        },
        {
          name: 'Wasit',
          native: 'واسط',
          districts: [
            { name: 'Al-Aziziyah District', native: 'العزيزية' },
            { name: 'Al-Hai District', native: 'قضاء الحي' },
            { name: "Al-Na'maniya District", native: 'قضاء النعمانية' },
            { name: 'Al-Suwaira District', native: 'قضاء الصويرة' },
            { name: 'Badra District', native: 'قضاء بدرة' },
            { name: 'Kut District', native: 'قضاء الكوت' }
          ]
        }
      ]
    },
    IR: {
      name: 'Iran',
      native: 'ایران',
      phone: '98',
      continent: 'AS',
      capital: 'Tehran',
      currency: 'IRR',
      languages: 'fa',
      numeric: '364'
    },
    IS: {
      name: 'Iceland',
      native: 'Ísland',
      phone: '354',
      continent: 'EU',
      capital: 'Reykjavik',
      currency: 'ISK',
      languages: 'is',
      numeric: '352'
    },
    IT: {
      name: 'Italy',
      native: 'Italia',
      phone: '39',
      continent: 'EU',
      capital: 'Rome',
      currency: 'EUR',
      languages: 'it',
      numeric: '380'
    },
    JE: {
      name: 'Jersey',
      native: 'Jersey',
      phone: '44',
      continent: 'EU',
      capital: 'Saint Helier',
      currency: 'GBP',
      languages: 'en,fr',
      numeric: '832'
    },
    JM: {
      name: 'Jamaica',
      native: 'Jamaica',
      phone: '1876',
      continent: 'NA',
      capital: 'Kingston',
      currency: 'JMD',
      languages: 'en',
      numeric: '388'
    },
    JO: {
      name: 'Jordan',
      native: 'الأردن',
      phone: '962',
      continent: 'AS',
      capital: 'Amman',
      currency: 'JOD',
      languages: 'ar',
      numeric: '400',
      regions: [
        {
          name: 'Irbid',
          native: 'إربد',
          districts: [
            { name: 'Al-Aghwar Shamaliyyeh', native: 'الأغوار الشمالية' },
            { name: 'Ar Ramtha', native: 'الرمثا' },
            { name: 'Bani Knana', native: 'بني كنانة' },
            { name: 'Bani Obeid', native: 'بني عبيد' },
            { name: 'Irbid', native: 'إربد' },
            { name: 'Kora', native: 'الكورة' },
            { name: 'Mazar Shamaliyyeh', native: 'المزار الشمالي' },
            { name: 'Tayybeh', native: 'الطيبة' },
            { name: 'Wastiyyeh', native: 'الوسطية' }
          ]
        },
        {
          name: 'Ajloun',
          native: 'محافظة عجلون',
          districts: [
            { name: 'Ajloun', native: 'قصبة عجلون' },
            { name: 'Kofranjah', native: 'كفرنجة' },
            { name: ' Ain Janna', native: 'عين جنة ' },
            { name: 'Anjara', native: 'عنجرة' },
            { name: 'Sakhra', native: 'صخرة' },
            { name: 'Rawabi', native: 'روابي ' },
            { name: ' Orjan', native: 'عرجان ' },
            { name: ' Khet Al-Laban', native: 'خيط اللبن ' }
          ]
        },
        {
          name: 'Jerash',
          native: 'محافظة جرش',
          districts: [
            { name: 'Jerash', native: 'قصبة جرش' },
            { name: 'Mastaba Sub- district ', native: 'مصطبة ' },
            { name: 'Borma Sub-district ', native: 'برما ' }
          ]
        },
        {
          name: 'Mafraq',
          native: 'محافظة المفرق',
          districts: [
            { name: 'Al-Mafraq', native: 'قصبة المفرق' },
            { name: 'Ar-Ruwayshid', native: 'الرويشد' },
            { name: 'Badiah Shamaliyah', native: 'البادية الشمالية' },
            {
              name: 'Badiah Shamaliyah Gharbiyah',
              native: 'البادية الشمالية الغربية'
            }
          ]
        },
        {
          name: 'Balqa',
          native: 'البلقاء',
          districts: [
            { name: 'Ain al Basha', native: 'عين الباشا' },
            { name: 'Mahes - Fuhais', native: 'ماحص والفحيص' },
            { name: 'As-Salt', native: 'قصبة السلط' },
            { name: 'Dair Alla', native: 'دير علا' },
            { name: 'Ash-Shunah al-Janubiyah', native: 'الشونة الجنوبية' }
          ]
        },
        {
          name: 'Amman',
          native: 'محافظة العاصمة',
          districts: [
            { name: 'Amman', native: 'قصبة عمان' },
            { name: 'Al-Jiza', native: 'الجيزة' },
            { name: 'Al-Muwwaqqar', native: 'الموقر' },
            { name: "Na'oor", native: 'ناعور' },
            { name: 'Al-Quesmah', native: 'القويسمة' },
            { name: 'Sahab', native: 'سحاب' },
            { name: "Al-Jami'ah", native: 'الجامعة' },
            { name: 'Wadi al-Sayr', native: 'وادي السير' },
            { name: 'Marka', native: 'ماركا' }
          ]
        },
        {
          name: 'Zarqa',
          native: 'محافظة الزرقاء',
          districts: [
            { name: 'Hashimiyya', native: 'الهاشمية' },
            { name: 'Az-Zarqa', native: 'قصبة الزرقاء' },
            { name: 'Russeifa', native: 'الرصيفة' }
          ]
        },
        {
          name: 'Madaba',
          native: 'مادبا',
          districts: [
            { name: 'Dhiban', native: 'ذيبان' },
            { name: 'Madaba', native: 'قصبة مادبا' }
          ]
        },
        {
          name: 'Karak',
          native: 'الكرك',
          districts: [
            { name: 'Ayy', native: 'عي' },
            { name: 'Faqqu', native: 'فقوع' },
            { name: 'Al-Karak', native: 'قصبة الكرك' },
            { name: 'Al-Mazar al-Janubiyya', native: 'المزار الجنوبي' },
            { name: 'Aghwar Janoobiyah', native: 'الاغوار الجنوبية' },
            { name: 'Al-Qasr', native: 'القصر' },
            { name: 'Qatraneh', native: 'القطرانة' }
          ]
        },
        {
          name: 'Tafilah',
          native: 'الطفيلة',
          districts: [
            { name: 'Al-Hasa', native: 'الحسا' },
            { name: 'Al-Tafila', native: 'قصبة الطفيلة' },
            { name: 'Birsayra', native: 'بصيرا' }
          ]
        },
        {
          name: "Ma'an",
          native: 'معان',
          districts: [
            { name: 'Al-Husanyniyya', native: 'الحسينية' },
            { name: 'Ash-Shibek', native: 'الشوبك' },
            { name: 'Petra', native: 'البتراء' },
            { name: "Ma'an Qasabah", native: 'قصبة معان' }
          ]
        },
        {
          name: 'Aqaba',
          native: 'العقبة',
          districts: [
            { name: 'Al-Quwayra', native: 'القويره' },
            { name: 'Aqaba Qasabah', native: 'قصبة العقبة' }
          ]
        }
      ]
    },
    JP: {
      name: 'Japan',
      native: '日本',
      phone: '81',
      continent: 'AS',
      capital: 'Tokyo',
      currency: 'JPY',
      languages: 'ja',
      numeric: '392'
    },
    KE: {
      name: 'Kenya',
      native: 'Kenya',
      phone: '254',
      continent: 'AF',
      capital: 'Nairobi',
      currency: 'KES',
      languages: 'en,sw',
      numeric: '404'
    },
    KG: {
      name: 'Kyrgyzstan',
      native: 'Кыргызстан',
      phone: '996',
      continent: 'AS',
      capital: 'Bishkek',
      currency: 'KGS',
      languages: 'ky,ru',
      numeric: '417'
    },
    KH: {
      name: 'Cambodia',
      native: 'Kâmpŭchéa',
      phone: '855',
      continent: 'AS',
      capital: 'Phnom Penh',
      currency: 'KHR',
      languages: 'km',
      numeric: '116',
      regions: [
        { name: 'Banteay Meanchey', native: 'បន្ទាយមានជ័យ', districts: [] },
        { name: 'Battambang', native: 'បាត់ដំបង', districts: [] },
        { name: 'Kampong Cham', native: 'កំពង់ចាម', districts: [] },
        { name: 'Kampong Chhnang', native: 'កំពង់ឆ្នាំង', districts: [] },
        { name: 'Kampong Speu', native: 'កំពង់ស្ពឺ', districts: [] },
        { name: 'Kampong Thom', native: 'កំពង់ធំ', districts: [] },
        { name: 'Kampot', native: 'កំពត', districts: [] },
        { name: 'Kandal', native: 'កណ្តាល', districts: [] },
        { name: 'Koh Kong', native: 'កោះកុង', districts: [] },
        { name: 'Kratié', native: 'ក្រចេះ', districts: [] },
        { name: 'Mondulkiri', native: 'មណ្ឌលគិរី', districts: [] },
        { name: 'Phnom Penh', native: 'ភ្នំពេញ', districts: [] },
        { name: 'Preah Vihear', native: 'ព្រះវិហារ', districts: [] },
        { name: 'Prey Veng', native: 'ព្រៃវែង', districts: [] },
        { name: 'Pursat', native: 'ពោធិ៍សាត់', districts: [] },
        { name: 'Ratanakiri', native: 'រតនគិរី', districts: [] },
        { name: 'Siem Reap', native: 'សៀមរាប', districts: [] },
        { name: 'Preah Sihanouk', native: 'ព្រះសីហនុ', districts: [] },
        { name: 'Stung Treng', native: 'ស្ទឹងត្រែង', districts: [] },
        { name: 'Svay Rieng', native: 'ស្វាយរៀង', districts: [] },
        { name: 'Takéo', native: 'តាកែវ', districts: [] },
        { name: 'Oddar Meanchey', native: 'ឧត្តរមានជ័យ', districts: [] },
        { name: 'Kep', native: 'កែប', districts: [] },
        { name: 'Pailin', native: 'ប៉ៃលិន', districts: [] },
        { name: 'Tboung Khmum', native: 'ត្បូងឃ្មុំ', districts: [] }
      ]
    },
    KI: {
      name: 'Kiribati',
      native: 'Kiribati',
      phone: '686',
      continent: 'OC',
      capital: 'South Tarawa',
      currency: 'AUD',
      languages: 'en',
      numeric: '296'
    },
    KM: {
      name: 'Comoros',
      native: 'Komori',
      phone: '269',
      continent: 'AF',
      capital: 'Moroni',
      currency: 'KMF',
      languages: 'ar,fr',
      numeric: '174'
    },
    KN: {
      name: 'Saint Kitts and Nevis',
      native: 'Saint Kitts and Nevis',
      phone: '1869',
      continent: 'NA',
      capital: 'Basseterre',
      currency: 'XCD',
      languages: 'en',
      numeric: '659'
    },
    KP: {
      name: 'North Korea',
      native: '북한',
      phone: '850',
      continent: 'AS',
      capital: 'Pyongyang',
      currency: 'KPW',
      languages: 'ko',
      numeric: '408'
    },
    KR: {
      name: 'South Korea',
      native: '대한민국',
      phone: '82',
      continent: 'AS',
      capital: 'Seoul',
      currency: 'KRW',
      languages: 'ko',
      numeric: '410'
    },
    KW: {
      name: 'Kuwait',
      native: 'الكويت',
      phone: '965',
      continent: 'AS',
      capital: 'Kuwait City',
      currency: 'KWD',
      languages: 'ar',
      numeric: '414'
    },
    KY: {
      name: 'Cayman Islands',
      native: 'Cayman Islands',
      phone: '1345',
      continent: 'NA',
      capital: 'George Town',
      currency: 'KYD',
      languages: 'en',
      numeric: '136'
    },
    KZ: {
      name: 'Kazakhstan',
      native: 'Қазақстан',
      phone: '76,77',
      continent: 'AS',
      capital: 'Astana',
      currency: 'KZT',
      languages: 'kk,ru',
      numeric: '398'
    },
    LA: {
      name: 'Laos',
      native: 'ສປປລາວ',
      phone: '856',
      continent: 'AS',
      capital: 'Vientiane',
      currency: 'LAK',
      languages: 'lo',
      numeric: '418'
    },
    LB: {
      name: 'Lebanon',
      native: 'لبنان',
      phone: '961',
      continent: 'AS',
      capital: 'Beirut',
      currency: 'LBP',
      languages: 'ar,fr',
      numeric: '422'
    },
    LC: {
      name: 'Saint Lucia',
      native: 'Saint Lucia',
      phone: '1758',
      continent: 'NA',
      capital: 'Castries',
      currency: 'XCD',
      languages: 'en',
      numeric: '662'
    },
    LI: {
      name: 'Liechtenstein',
      native: 'Liechtenstein',
      phone: '423',
      continent: 'EU',
      capital: 'Vaduz',
      currency: 'CHF',
      languages: 'de',
      numeric: '438'
    },
    LK: {
      name: 'Sri Lanka',
      native: 'śrī laṃkāva',
      phone: '94',
      continent: 'AS',
      capital: 'Colombo',
      currency: 'LKR',
      languages: 'si,ta',
      numeric: '144'
    },
    LR: {
      name: 'Liberia',
      native: 'Liberia',
      phone: '231',
      continent: 'AF',
      capital: 'Monrovia',
      currency: 'LRD',
      languages: 'en',
      numeric: '430'
    },
    LS: {
      name: 'Lesotho',
      native: 'Lesotho',
      phone: '266',
      continent: 'AF',
      capital: 'Maseru',
      currency: 'LSL,ZAR',
      languages: 'en,st',
      numeric: '426'
    },
    LT: {
      name: 'Lithuania',
      native: 'Lietuva',
      phone: '370',
      continent: 'EU',
      capital: 'Vilnius',
      currency: 'LTL',
      languages: 'lt',
      numeric: '440'
    },
    LU: {
      name: 'Luxembourg',
      native: 'Luxembourg',
      phone: '352',
      continent: 'EU',
      capital: 'Luxembourg',
      currency: 'EUR',
      languages: 'fr,de,lb',
      numeric: '442'
    },
    LV: {
      name: 'Latvia',
      native: 'Latvija',
      phone: '371',
      continent: 'EU',
      capital: 'Riga',
      currency: 'EUR',
      languages: 'lv',
      numeric: '428'
    },
    LY: {
      name: 'Libya',
      native: '‏ليبيا',
      phone: '218',
      continent: 'AF',
      capital: 'Tripoli',
      currency: 'LYD',
      languages: 'ar',
      numeric: '434'
    },
    MA: {
      name: 'Morocco',
      native: 'المغرب',
      phone: '212',
      continent: 'AF',
      capital: 'Rabat',
      currency: 'MAD',
      languages: 'ar',
      numeric: '504'
    },
    MC: {
      name: 'Monaco',
      native: 'Monaco',
      phone: '377',
      continent: 'EU',
      capital: 'Monaco',
      currency: 'EUR',
      languages: 'fr',
      numeric: '492'
    },
    MD: {
      name: 'Moldova',
      native: 'Moldova',
      phone: '373',
      continent: 'EU',
      capital: 'Chișinău',
      currency: 'MDL',
      languages: 'ro',
      numeric: '498'
    },
    ME: {
      name: 'Montenegro',
      native: 'Црна Гора',
      phone: '382',
      continent: 'EU',
      capital: 'Podgorica',
      currency: 'EUR',
      languages: 'sr,bs,sq,hr',
      numeric: '499'
    },
    MF: {
      name: 'Saint Martin',
      native: 'Saint-Martin',
      phone: '590',
      continent: 'NA',
      capital: 'Marigot',
      currency: 'EUR',
      languages: 'en,fr,nl',
      numeric: '663'
    },
    MG: {
      name: 'Madagascar',
      native: 'Madagasikara',
      phone: '261',
      continent: 'AF',
      capital: 'Antananarivo',
      currency: 'MGA',
      languages: 'fr,mg',
      numeric: '450'
    },
    MH: {
      name: 'Marshall Islands',
      native: 'M̧ajeļ',
      phone: '692',
      continent: 'OC',
      capital: 'Majuro',
      currency: 'USD',
      languages: 'en,mh',
      numeric: '584'
    },
    MK: {
      name: 'Macedonia',
      native: 'Македонија',
      phone: '389',
      continent: 'EU',
      capital: 'Skopje',
      currency: 'MKD',
      languages: 'mk',
      numeric: '807'
    },
    ML: {
      name: 'Mali',
      native: 'Mali',
      phone: '223',
      continent: 'AF',
      capital: 'Bamako',
      currency: 'XOF',
      languages: 'fr',
      numeric: '466'
    },
    MM: {
      name: 'Myanmar',
      native: 'မြန်မာ',
      phone: '95',
      continent: 'AS',
      capital: 'Naypyidaw',
      currency: 'MMK',
      languages: 'my',
      numeric: '104'
    },
    MN: {
      name: 'Mongolia',
      native: 'Монгол улс',
      phone: '976',
      continent: 'AS',
      capital: 'Ulan Bator',
      currency: 'MNT',
      languages: 'mn',
      numeric: '496'
    },
    MO: {
      name: 'Macao',
      native: '澳門',
      phone: '853',
      continent: 'AS',
      capital: '',
      currency: 'MOP',
      languages: 'zh,pt',
      numeric: '446'
    },
    MP: {
      name: 'Northern Mariana Islands',
      native: 'Northern Mariana Islands',
      phone: '1670',
      continent: 'OC',
      capital: 'Saipan',
      currency: 'USD',
      languages: 'en,ch',
      numeric: '580'
    },
    MQ: {
      name: 'Martinique',
      native: 'Martinique',
      phone: '596',
      continent: 'NA',
      capital: 'Fort-de-France',
      currency: 'EUR',
      languages: 'fr',
      numeric: '474'
    },
    MR: {
      name: 'Mauritania',
      native: 'موريتانيا',
      phone: '222',
      continent: 'AF',
      capital: 'Nouakchott',
      currency: 'MRO',
      languages: 'ar',
      numeric: '478'
    },
    MS: {
      name: 'Montserrat',
      native: 'Montserrat',
      phone: '1664',
      continent: 'NA',
      capital: 'Plymouth',
      currency: 'XCD',
      languages: 'en',
      numeric: '500'
    },
    MT: {
      name: 'Malta',
      native: 'Malta',
      phone: '356',
      continent: 'EU',
      capital: 'Valletta',
      currency: 'EUR',
      languages: 'mt,en',
      numeric: '470'
    },
    MU: {
      name: 'Mauritius',
      native: 'Maurice',
      phone: '230',
      continent: 'AF',
      capital: 'Port Louis',
      currency: 'MUR',
      languages: 'en',
      numeric: '480'
    },
    MV: {
      name: 'Maldives',
      native: 'Maldives',
      phone: '960',
      continent: 'AS',
      capital: 'Malé',
      currency: 'MVR',
      languages: 'dv',
      numeric: '462'
    },
    MW: {
      name: 'Malawi',
      native: 'Malawi',
      phone: '265',
      continent: 'AF',
      capital: 'Lilongwe',
      currency: 'MWK',
      languages: 'en,ny',
      numeric: '454'
    },
    MX: {
      name: 'Mexico',
      native: 'México',
      phone: '52',
      continent: 'NA',
      capital: 'Mexico City',
      currency: 'MXN',
      languages: 'es',
      numeric: '484'
    },
    MY: {
      name: 'Malaysia',
      native: 'Malaysia',
      phone: '60',
      continent: 'AS',
      capital: 'Kuala Lumpur',
      currency: 'MYR',
      languages: '',
      numeric: '458'
    },
    MZ: {
      name: 'Mozambique',
      native: 'Moçambique',
      phone: '258',
      continent: 'AF',
      capital: 'Maputo',
      currency: 'MZN',
      languages: 'pt',
      numeric: '508'
    },
    NA: {
      name: 'Namibia',
      native: 'Namibia',
      phone: '264',
      continent: 'AF',
      capital: 'Windhoek',
      currency: 'NAD,ZAR',
      languages: 'en,af',
      numeric: '516'
    },
    NC: {
      name: 'New Caledonia',
      native: 'Nouvelle-Calédonie',
      phone: '687',
      continent: 'OC',
      capital: 'Nouméa',
      currency: 'XPF',
      languages: 'fr',
      numeric: '540'
    },
    NE: {
      name: 'Niger',
      native: 'Niger',
      phone: '227',
      continent: 'AF',
      capital: 'Niamey',
      currency: 'XOF',
      languages: 'fr',
      numeric: '562'
    },
    NF: {
      name: 'Norfolk Island',
      native: 'Norfolk Island',
      phone: '672',
      continent: 'OC',
      capital: 'Kingston',
      currency: 'AUD',
      languages: 'en',
      numeric: '574'
    },
    NG: {
      name: 'Nigeria',
      native: 'Nigeria',
      phone: '234',
      continent: 'AF',
      capital: 'Abuja',
      currency: 'NGN',
      languages: 'en',
      numeric: '566'
    },
    NI: {
      name: 'Nicaragua',
      native: 'Nicaragua',
      phone: '505',
      continent: 'NA',
      capital: 'Managua',
      currency: 'NIO',
      languages: 'es',
      numeric: '558'
    },
    NL: {
      name: 'Netherlands',
      native: 'Nederland',
      phone: '31',
      continent: 'EU',
      capital: 'Amsterdam',
      currency: 'EUR',
      languages: 'nl',
      numeric: '528'
    },
    NO: {
      name: 'Norway',
      native: 'Norge',
      phone: '47',
      continent: 'EU',
      capital: 'Oslo',
      currency: 'NOK',
      languages: 'no,nb,nn',
      numeric: '578'
    },
    NP: {
      name: 'Nepal',
      native: 'नेपाल',
      phone: '977',
      continent: 'AS',
      capital: 'Kathmandu',
      currency: 'NPR',
      languages: 'ne',
      numeric: '524',
      regions: [
        {
          name: 'Province 1',
          native: 'प्रदेश नं. १',
          districts: [
            { name: 'Taplejung', native: 'ताप्लेजुङ' },
            { name: 'Sankhuwasabha', native: 'संखुवासभा' },
            { name: 'Solukhumbu', native: 'सोलुखुम्बु' },
            { name: 'Okhaldhunga', native: 'ओखलढुङ्गा' },
            { name: 'Khotang', native: 'खोटाङ' },
            { name: 'Bhojpur', native: 'भोजपुर' },
            { name: 'Dhankuta', native: 'धनकुटा' },
            { name: 'Terhathum', native: 'तेह्रथुम' },
            { name: 'Panchthar', native: 'पााँचथर' },
            { name: 'Ilam', native: 'इलाम' },
            { name: 'Jhapa', native: 'झापा' },
            { name: 'Morang', native: 'मोरङ' },
            { name: 'Sunsari', native: 'सुनसरी' },
            { name: 'Udayapur', native: 'उदयपुर' }
          ]
        },
        {
          name: 'Madhesh Province',
          native: 'मधेश प्रदेश',
          districts: [
            { name: 'Saptari', native: 'सप्तरी' },
            { name: 'Siraha', native: 'ससरहा' },
            { name: 'Dhanusa', native: 'धनुषा' },
            { name: 'Mahottari', native: 'महोत्तरी' },
            { name: 'Sarlahi', native: 'सलााही' },
            { name: 'Rautahat', native: 'रौतहट' },
            { name: 'Bara', native: 'बारा' },
            { name: 'Parsa', native: 'पसाा' }
          ]
        },
        {
          name: 'Bagmati Province',
          native: 'बागमती प्रदेश',
          districts: [
            { name: 'Dolakha', native: 'दोलखा' },
            { name: 'Sindhupalchok', native: 'ससन्धुपाल्चोक' },
            { name: 'Rasuwa', native: 'रसुवा' },
            { name: 'Dhading', native: 'धाददङ' },
            { name: 'Nuwakot', native: 'नुवाकोट' },
            { name: 'Kathmandu', native: 'काठमाडौँ' },
            { name: 'Bhaktapur', native: 'भक्तपुर' },
            { name: 'Lalitpur', native: 'लसलतपुर' },
            { name: 'Kavrepalanchok', native: 'काभ्रेपलाञ्चोक' },
            { name: 'Ramechhap', native: 'रामेछाप' },
            { name: 'Sindhuli', native: 'ससन्धुली' },
            { name: 'Makwanpur', native: 'मकवानपुर' },
            { name: 'Chitawan', native: 'चचतवन' }
          ]
        },
        {
          name: 'Gandaki Province',
          native: 'गण्डकी प्रदेश',
          districts: [
            { name: 'Gorkha', native: 'गोरखा' },
            { name: 'Manang', native: 'मनाङ' },
            { name: 'Mustang', native: 'मुस्ताङ' },
            { name: 'Myagdi', native: 'म्याग्दी' },
            { name: 'Kaski', native: 'कास्की' },
            { name: 'Lamjung', native: 'लमजुङ' },
            { name: 'Tanahu', native: 'तनहुाँ' },
            {
              name: 'Nawalparasi East',
              native: 'नवलपरासी ((बदाघाट सुस्ता पूूूव)'
            },
            { name: 'Syangja', native: 'स्याङजा' },
            { name: 'Parbat', native: 'पवात' },
            { name: 'Baglung', native: 'बागलुङ' }
          ]
        },
        {
          name: 'Lumbini Province',
          native: 'लुम्म्बनी प्रदेश',
          districts: [
            { name: 'Rukum East', native: 'रुकुम (पूवी भाग)' },
            { name: 'Rolpa', native: 'रोल्पा' },
            { name: 'Pyuthan', native: 'प्यूठान' },
            { name: 'Gulmi', native: 'गुल्मी' },
            { name: 'Arghakhanchi', native: 'अघााखााँची' },
            { name: 'Palpa', native: 'पाल्पा' },
            {
              name: 'Nawalparasi West',
              native: 'नवलपरासी (बदाघाट सुस्ता पम्चचम)'
            },
            { name: 'Rupandehi', native: 'रुपन्देही' },
            { name: 'Kapilbastu', native: 'कपपलवस्तु' },
            { name: 'Dang', native: 'दाङ' },
            { name: 'Banke', native: 'बााँके' },
            { name: 'Bardiya', native: 'बददाया' }
          ]
        },
        {
          name: 'Karnali Province',
          native: 'कर्ााली प्रदेश',
          districts: [
            { name: 'Dolpa', native: 'डोल्पा' },
            { name: 'Mugu', native: 'मुगु' },
            { name: 'Humla', native: 'हुम्ला' },
            { name: 'Jumla', native: 'जुम्ला' },
            { name: 'Kalikot', native: 'कासलकोट' },
            { name: 'Dailekh', native: 'दैलेख' },
            { name: 'Jajarkot', native: 'जाजरकोट' },
            { name: 'Rukum West', native: 'रुकुम (पम्चचम भाग)' },
            { name: 'Salyan', native: 'सल्यान' },
            { name: 'Surkhet', native: 'सुखेत' }
          ]
        },
        {
          name: 'Sudurpashchim Province',
          native: 'सुदरुपम्चचम प्रदे श ',
          districts: [
            { name: 'Bajura', native: 'बाजुरा' },
            { name: 'Bajhang', native: 'बझाङ' },
            { name: 'Darchula', native: 'दाचुला' },
            { name: 'Baitadi', native: 'बैतडी' },
            { name: 'Dadeldhura', native: 'डाँडले धुरा' },
            { name: 'Doti', native: 'डोटी' },
            { name: 'Achham', native: 'अछाम' },
            { name: 'Kailali', native: 'कै लाली' },
            { name: 'Kanchanpur', native: 'कञ्चनपुर' }
          ]
        }
      ]
    },
    NR: {
      name: 'Nauru',
      native: 'Nauru',
      phone: '674',
      continent: 'OC',
      capital: 'Yaren',
      currency: 'AUD',
      languages: 'en,na',
      numeric: '520'
    },
    NU: {
      name: 'Niue',
      native: 'Niuē',
      phone: '683',
      continent: 'OC',
      capital: 'Alofi',
      currency: 'NZD',
      languages: 'en',
      numeric: '570'
    },
    NZ: {
      name: 'New Zealand',
      native: 'New Zealand',
      phone: '64',
      continent: 'OC',
      capital: 'Wellington',
      currency: 'NZD',
      languages: 'en,mi',
      numeric: '554'
    },
    OM: {
      name: 'Oman',
      native: 'عمان',
      phone: '968',
      continent: 'AS',
      capital: 'Muscat',
      currency: 'OMR',
      languages: 'ar',
      numeric: '512'
    },
    PA: {
      name: 'Panama',
      native: 'Panamá',
      phone: '507',
      continent: 'NA',
      capital: 'Panama City',
      currency: 'PAB,USD',
      languages: 'es',
      numeric: '591'
    },
    PE: {
      name: 'Peru',
      native: 'Perú',
      phone: '51',
      continent: 'SA',
      capital: 'Lima',
      currency: 'PEN',
      languages: 'es',
      numeric: '604'
    },
    PF: {
      name: 'French Polynesia',
      native: 'Polynésie française',
      phone: '689',
      continent: 'OC',
      capital: 'Papeetē',
      currency: 'XPF',
      languages: 'fr',
      numeric: '258'
    },
    PG: {
      name: 'Papua New Guinea',
      native: 'Papua Niugini',
      phone: '675',
      continent: 'OC',
      capital: 'Port Moresby',
      currency: 'PGK',
      languages: 'en',
      numeric: '598'
    },
    PH: {
      name: 'Philippines',
      native: 'Pilipinas',
      phone: '63',
      continent: 'AS',
      capital: 'Manila',
      currency: 'PHP',
      languages: 'en',
      numeric: '608'
    },
    PK: {
      name: 'Pakistan',
      native: 'Pakistan',
      phone: '92',
      continent: 'AS',
      capital: 'Islamabad',
      currency: 'PKR',
      languages: 'en,ur',
      numeric: '586'
    },
    PL: {
      name: 'Poland',
      native: 'Polska',
      phone: '48',
      continent: 'EU',
      capital: 'Warsaw',
      currency: 'PLN',
      languages: 'pl',
      numeric: '616'
    },
    PM: {
      name: 'Saint Pierre and Miquelon',
      native: 'Saint-Pierre-et-Miquelon',
      phone: '508',
      continent: 'NA',
      capital: 'Saint-Pierre',
      currency: 'EUR',
      languages: 'fr',
      numeric: '666'
    },
    PN: {
      name: 'Pitcairn Islands',
      native: 'Pitcairn Islands',
      phone: '64',
      continent: 'OC',
      capital: 'Adamstown',
      currency: 'NZD',
      languages: 'en',
      numeric: '612'
    },
    PR: {
      name: 'Puerto Rico',
      native: 'Puerto Rico',
      phone: '1787,1939',
      continent: 'NA',
      capital: 'San Juan',
      currency: 'USD',
      languages: 'es,en',
      numeric: '630'
    },
    PS: {
      name: 'Palestine',
      native: 'فلسطين',
      phone: '970',
      continent: 'AS',
      capital: 'Ramallah',
      currency: 'ILS',
      languages: 'ar',
      numeric: '275'
    },
    PT: {
      name: 'Portugal',
      native: 'Portugal',
      phone: '351',
      continent: 'EU',
      capital: 'Lisbon',
      currency: 'EUR',
      languages: 'pt',
      numeric: '620'
    },
    PW: {
      name: 'Palau',
      native: 'Palau',
      phone: '680',
      continent: 'OC',
      capital: 'Ngerulmud',
      currency: 'USD',
      languages: 'en',
      numeric: '585'
    },
    PY: {
      name: 'Paraguay',
      native: 'Paraguay',
      phone: '595',
      continent: 'SA',
      capital: 'Asunción',
      currency: 'PYG',
      languages: 'es,gn',
      numeric: '600'
    },
    QA: {
      name: 'Qatar',
      native: 'قطر',
      phone: '974',
      continent: 'AS',
      capital: 'Doha',
      currency: 'QAR',
      languages: 'ar',
      numeric: '634'
    },
    RE: {
      name: 'Réunion',
      native: 'La Réunion',
      phone: '262',
      continent: 'AF',
      capital: 'Saint-Denis',
      currency: 'EUR',
      languages: 'fr',
      numeric: '638'
    },
    RO: {
      name: 'Romania',
      native: 'România',
      phone: '40',
      continent: 'EU',
      capital: 'Bucharest',
      currency: 'RON',
      languages: 'ro',
      numeric: '642'
    },
    RS: {
      name: 'Serbia',
      native: 'Србија',
      phone: '381',
      continent: 'EU',
      capital: 'Belgrade',
      currency: 'RSD',
      languages: 'sr',
      numeric: '688'
    },
    RU: {
      name: 'Russia',
      native: 'Россия',
      phone: '7',
      continent: 'EU',
      capital: 'Moscow',
      currency: 'RUB',
      languages: 'ru',
      numeric: '643'
    },
    RW: {
      name: 'Rwanda',
      native: 'Rwanda',
      phone: '250',
      continent: 'AF',
      capital: 'Kigali',
      currency: 'RWF',
      languages: 'rw,en,fr',
      regions: [
        {
          name: 'East',
          native: 'East',
          districts: [
            {
              name: 'Bugesera',
              native: 'Bugesera'
            },
            {
              name: 'Kayonza',
              native: 'Kayonza'
            },
            {
              name: 'Kirehe',
              native: 'Kirehe'
            },
            {
              name: 'Nyagatare',
              native: 'Nyagatare'
            },
            {
              name: 'Rwamagana',
              native: 'Rwamagana'
            }
          ]
        },
        {
          name: 'Kigali City',
          native: 'Kigali City',
          districts: [
            {
              name: 'Gasabo District ',
              native: 'Gasabo District '
            },
            {
              name: 'Kicukiro',
              native: 'Kicukiro'
            },
            {
              name: 'Nyarugenge ',
              native: 'Nyarugenge '
            }
          ]
        },
        {
          name: 'North',
          native: 'North',
          districts: [
            {
              name: 'Burera ',
              native: 'Burera '
            },
            {
              name: 'Gakenke',
              native: 'Gakenke'
            },
            {
              name: 'Musanze',
              native: 'Musanze'
            }
          ]
        },
        {
          name: 'South',
          native: 'South',
          districts: [
            {
              name: 'Huye',
              native: 'Huye'
            },
            {
              name: 'Nyamagabe',
              native: 'Nyamagabe'
            },
            {
              name: 'Nyaruguru',
              native: 'Nyaruguru'
            },
            {
              name: 'Ruhango',
              native: 'Ruhango'
            },
            {
              name: 'Nyanza ',
              native: 'Nyanza '
            }
          ]
        },
        {
          name: 'West',
          native: 'West',
          districts: [
            {
              name: 'Karongi',
              native: 'Karongi'
            },
            {
              name: 'Ngororero',
              native: 'Ngororero'
            },
            {
              name: 'Nyamasheke',
              native: 'Nyamasheke'
            },
            {
              name: 'Rubavu',
              native: 'Rubavu'
            },
            {
              name: 'Rusizi',
              native: 'Rusizi'
            },
            {
              name: 'Rutsiro',
              native: 'Rutsiro'
            }
          ]
        }
      ],
      numeric: '646'
    },
    SA: {
      name: 'Saudi Arabia',
      native: 'العربية السعودية',
      phone: '966',
      continent: 'AS',
      capital: 'Riyadh',
      currency: 'SAR',
      languages: 'ar',
      numeric: '682'
    },
    SB: {
      name: 'Solomon Islands',
      native: 'Solomon Islands',
      phone: '677',
      continent: 'OC',
      capital: 'Honiara',
      currency: 'SBD',
      languages: 'en',
      numeric: '090'
    },
    SC: {
      name: 'Seychelles',
      native: 'Seychelles',
      phone: '248',
      continent: 'AF',
      capital: 'Victoria',
      currency: 'SCR',
      languages: 'fr,en',
      numeric: '690'
    },
    SD: {
      name: 'Sudan',
      native: 'السودان',
      phone: '249',
      continent: 'AF',
      capital: 'Khartoum',
      currency: 'SDG',
      languages: 'ar,en',
      numeric: '729'
    },
    SE: {
      name: 'Sweden',
      native: 'Sverige',
      phone: '46',
      continent: 'EU',
      capital: 'Stockholm',
      currency: 'SEK',
      languages: 'sv',
      numeric: '752'
    },
    SG: {
      name: 'Singapore',
      native: 'Singapore',
      phone: '65',
      continent: 'AS',
      capital: 'Singapore',
      currency: 'SGD',
      languages: 'en,ms,ta,zh',
      numeric: '702'
    },
    SH: {
      name: 'Saint Helena',
      native: 'Saint Helena',
      phone: '290',
      continent: 'AF',
      capital: 'Jamestown',
      currency: 'SHP',
      languages: 'en',
      numeric: '654'
    },
    SI: {
      name: 'Slovenia',
      native: 'Slovenija',
      phone: '386',
      continent: 'EU',
      capital: 'Ljubljana',
      currency: 'EUR',
      languages: 'sl',
      numeric: '705'
    },
    SJ: {
      name: 'Svalbard and Jan Mayen',
      native: 'Svalbard og Jan Mayen',
      phone: '4779',
      continent: 'EU',
      capital: 'Longyearbyen',
      currency: 'NOK',
      languages: 'no',
      numeric: '744'
    },
    SK: {
      name: 'Slovakia',
      native: 'Slovensko',
      phone: '421',
      continent: 'EU',
      capital: 'Bratislava',
      currency: 'EUR',
      languages: 'sk',
      numeric: '703'
    },
    SL: {
      name: 'Sierra Leone',
      native: 'Sierra Leone',
      phone: '232',
      continent: 'AF',
      capital: 'Freetown',
      currency: 'SLL',
      languages: 'en',
      numeric: '694'
    },
    SM: {
      name: 'San Marino',
      native: 'San Marino',
      phone: '378',
      continent: 'EU',
      capital: 'City of San Marino',
      currency: 'EUR',
      languages: 'it',
      numeric: '674'
    },
    SN: {
      name: 'Senegal',
      native: 'Sénégal',
      phone: '221',
      continent: 'AF',
      capital: 'Dakar',
      currency: 'XOF',
      languages: 'fr',
      numeric: '686'
    },
    SO: {
      name: 'Somalia',
      native: 'Soomaaliya',
      phone: '252',
      continent: 'AF',
      capital: 'Mogadishu',
      currency: 'SOS',
      languages: 'so,ar',
      numeric: '706'
    },
    SR: {
      name: 'Suriname',
      native: 'Suriname',
      phone: '597',
      continent: 'SA',
      capital: 'Paramaribo',
      currency: 'SRD',
      languages: 'nl',
      numeric: '740'
    },
    SS: {
      name: 'South Sudan',
      native: 'South Sudan',
      phone: '211',
      continent: 'AF',
      capital: 'Juba',
      currency: 'SSP',
      languages: 'en',
      numeric: '728'
    },
    ST: {
      name: 'São Tomé and Príncipe',
      native: 'São Tomé e Príncipe',
      phone: '239',
      continent: 'AF',
      capital: 'São Tomé',
      currency: 'STD',
      languages: 'pt',
      numeric: '678'
    },
    SV: {
      name: 'El Salvador',
      native: 'El Salvador',
      phone: '503',
      continent: 'NA',
      capital: 'San Salvador',
      currency: 'SVC,USD',
      languages: 'es',
      numeric: '222'
    },
    SX: {
      name: 'Sint Maarten',
      native: 'Sint Maarten',
      phone: '1721',
      continent: 'NA',
      capital: 'Philipsburg',
      currency: 'ANG',
      languages: 'nl,en',
      numeric: '534'
    },
    SY: {
      name: 'Syria',
      native: 'سوريا',
      phone: '963',
      continent: 'AS',
      capital: 'Damascus',
      currency: 'SYP',
      languages: 'ar',
      numeric: '760',
      regions: [
        {
          name: 'Aleppo',
          native: 'حلب',
          districts: [
            { name: "A'zaz", native: 'اعزاز' },
            { name: 'Afrin', native: 'عفرين' },
            { name: 'Ain Al Arab', native: 'عين العرب' },
            { name: 'Al Bab', native: 'الباب' },
            { name: 'As-Safira', native: 'السفيرة' },
            { name: 'Jarablus', native: 'جرابلس' },
            { name: 'Jebel Saman / Mount Simeon', native: 'جبل سمعان' },
            { name: 'Menbij', native: 'منبج' }
          ]
        },
        {
          name: 'Al-Hasakeh',
          native: 'الحسكة',
          districts: [
            { name: 'Al-Hasakeh', native: 'مركز الحسكة' },
            { name: 'Al-Malikeyyeh', native: 'المالكية' },
            { name: 'Quamishli', native: 'القامشلي' },
            { name: 'Ras Al Ain', native: 'رأس العين' }
          ]
        },
        {
          name: 'Ar-Raqqa',
          native: 'الرقة',
          districts: [
            { name: 'Ar-Raqqa', native: 'مركز الرقة' },
            { name: 'Ath-Thawrah', native: 'الثورة' },
            { name: 'Tell Abiad', native: 'تل أبيض' }
          ]
        },
        {
          name: 'As-Sweida',
          native: 'السويداء',
          districts: [
            { name: 'As-Sweida', native: 'مركز السويداء' },
            { name: 'Salkhad', native: 'صلخد' },
            { name: 'Shahba', native: 'شهبا' }
          ]
        },
        {
          name: 'Damascus',
          native: 'دمشق',
          districts: [{ name: 'Damascus', native: 'دمشق' }]
        },
        {
          name: "Dar'a",
          native: 'درعا',
          districts: [
            { name: 'As-Sanamayn', native: 'الصنمين' },
            { name: "Dar'a", native: 'درعا' },
            { name: "Izra'", native: 'ازرع' }
          ]
        },
        {
          name: 'Deir-ez-Zor',
          native: 'دير الزور',
          districts: [
            { name: 'Abu Kamal', native: 'البوكمال' },
            { name: 'Al Mayadin', native: 'الميادين' },
            { name: 'Deir-ez-Zor', native: 'مركز دير الزور' }
          ]
        },
        {
          name: 'Hama',
          native: 'حماة',
          districts: [
            { name: 'As-Salamiyeh', native: 'السلمية' },
            { name: 'As-Suqaylabiyah', native: 'السقيلبية' },
            { name: 'Hama', native: 'مركز حماة' },
            { name: 'Masyaf', native: 'مصياف' },
            { name: 'Muhradah', native: 'محردة' }
          ]
        },
        {
          name: 'Homs',
          native: 'حمص',
          districts: [
            { name: 'Al-Qusayr', native: 'القصير' },
            { name: 'Al Makhrim', native: 'المخرم' },
            { name: 'Ar-Rastan', native: 'الرستن' },
            { name: 'Homs', native: 'مركز حمص' },
            { name: 'Tadmor', native: 'تدمر' },
            { name: 'Tall Kalakh', native: 'تلكلخ' }
          ]
        },
        {
          name: 'Idleb',
          native: 'إدلب',
          districts: [
            { name: "Al Ma'ra", native: 'معرة النعمان' },
            { name: 'Ariha', native: 'أريحا' },
            { name: 'Harim', native: 'حارم' },
            { name: 'Idleb', native: 'مركز إدلب' },
            { name: 'Jisr-Ash-Shugur', native: 'جسر الشغور' }
          ]
        },
        {
          name: 'Lattakia',
          native: 'اللاذقية',
          districts: [
            { name: 'Al-Haffa', native: 'الحفة' },
            { name: 'Al-Qardaha', native: 'القرداحة' },
            { name: 'Jablah', native: 'جبلة' },
            { name: 'Lattakia', native: 'مركز اللاذقية' }
          ]
        },
        {
          name: 'Quneitra',
          native: 'القنيطرة',
          districts: [
            { name: 'Al Fiq', native: 'فيق' },
            { name: 'Quneitra', native: 'مركز القنيطرة' }
          ]
        },
        {
          name: 'Rural Damascus',
          native: 'ريف دمشق',
          districts: [
            { name: 'Al Qutayfah', native: 'القطيفة' },
            { name: 'An Nabk', native: 'النبك' },
            { name: 'At Tall', native: 'التل' },
            { name: 'Az-Zabdani', native: 'الزبداني' },
            { name: 'Darayya', native: 'داريا' },
            { name: 'Duma', native: 'دوما' },
            { name: 'Qatana', native: 'قطنا' },
            { name: 'Rural Damascus', native: 'مركز ريف دمشق' },
            { name: 'Yabroud', native: 'يبرود' }
          ]
        },
        {
          name: 'Tartous',
          native: 'طرطوس',
          districts: [
            { name: 'Banyas', native: 'بانياس' },
            { name: 'Dreikish', native: 'دريكيش' },
            { name: 'Qadmous', native: 'القدموس' },
            { name: 'Safita', native: 'صافيتا' },
            { name: 'Sheikh Badr', native: 'الشيخ بدر' },
            { name: 'Tartous', native: 'مركز طرطوس' }
          ]
        }
      ]
    },
    SZ: {
      name: 'Swaziland',
      native: 'Swaziland',
      phone: '268',
      continent: 'AF',
      capital: 'Lobamba',
      currency: 'SZL',
      languages: 'en,ss',
      numeric: '748'
    },
    TC: {
      name: 'Turks and Caicos Islands',
      native: 'Turks and Caicos Islands',
      phone: '1649',
      continent: 'NA',
      capital: 'Cockburn Town',
      currency: 'USD',
      languages: 'en',
      numeric: '796'
    },
    TD: {
      name: 'Chad',
      native: 'Tchad',
      phone: '235',
      continent: 'AF',
      capital: "N'Djamena",
      currency: 'XAF',
      languages: 'fr,ar',
      numeric: '148'
    },
    TF: {
      name: 'French Southern Territories',
      native: 'Territoire des Terres australes et antarctiques fr',
      phone: '',
      continent: 'AN',
      capital: 'Port-aux-Français',
      currency: 'EUR',
      languages: 'fr',
      numeric: '260'
    },
    TG: {
      name: 'Togo',
      native: 'Togo',
      phone: '228',
      continent: 'AF',
      capital: 'Lomé',
      currency: 'XOF',
      languages: 'fr',
      numeric: '768'
    },
    TH: {
      name: 'Thailand',
      native: 'ประเทศไทย',
      phone: '66',
      continent: 'AS',
      capital: 'Bangkok',
      currency: 'THB',
      languages: 'th',
      numeric: '764'
    },
    TJ: {
      name: 'Tajikistan',
      native: 'Тоҷикистон',
      phone: '992',
      continent: 'AS',
      capital: 'Dushanbe',
      currency: 'TJS',
      languages: 'tg,ru',
      numeric: '762'
    },
    TK: {
      name: 'Tokelau',
      native: 'Tokelau',
      phone: '690',
      continent: 'OC',
      capital: 'Fakaofo',
      currency: 'NZD',
      languages: 'en',
      numeric: '772'
    },
    TL: {
      name: 'East Timor',
      native: 'Timor-Leste',
      phone: '670',
      continent: 'OC',
      capital: 'Dili',
      currency: 'USD',
      languages: 'pt',
      numeric: '626'
    },
    TM: {
      name: 'Turkmenistan',
      native: 'Türkmenistan',
      phone: '993',
      continent: 'AS',
      capital: 'Ashgabat',
      currency: 'TMT',
      languages: 'tk,ru',
      numeric: '795'
    },
    TN: {
      name: 'Tunisia',
      native: 'تونس',
      phone: '216',
      continent: 'AF',
      capital: 'Tunis',
      currency: 'TND',
      languages: 'ar',
      numeric: '788'
    },
    TO: {
      name: 'Tonga',
      native: 'Tonga',
      phone: '676',
      continent: 'OC',
      capital: "Nuku'alofa",
      currency: 'TOP',
      languages: 'en,to',
      numeric: '776'
    },
    TR: {
      name: 'Turkey',
      native: 'Türkiye',
      phone: '90',
      continent: 'AS',
      capital: 'Ankara',
      currency: 'TRY',
      languages: 'tr',
      numeric: '792'
    },
    TT: {
      name: 'Trinidad and Tobago',
      native: 'Trinidad and Tobago',
      phone: '1868',
      continent: 'NA',
      capital: 'Port of Spain',
      currency: 'TTD',
      languages: 'en',
      numeric: '780'
    },
    TV: {
      name: 'Tuvalu',
      native: 'Tuvalu',
      phone: '688',
      continent: 'OC',
      capital: 'Funafuti',
      currency: 'AUD',
      languages: 'en',
      numeric: '798'
    },
    TW: {
      name: 'Taiwan',
      native: '臺灣',
      phone: '886',
      continent: 'AS',
      capital: 'Taipei',
      currency: 'TWD',
      languages: 'zh',
      numeric: '158'
    },
    TZ: {
      name: 'Tanzania',
      native: 'Tanzania',
      phone: '255',
      continent: 'AF',
      capital: 'Dodoma',
      currency: 'TZS',
      languages: 'sw,en',
      numeric: '834',
      regions: [
        {
          name: 'ARUSHA',
          native: 'ARUSHA',
          districts: [
            {
              name: 'Arusha City Council',
              native: 'Halmashauri ya Jiji la Arusha'
            },
            {
              name: 'Arusha Rural District Council',
              native: 'Halmashauri ya Wilaya ya Arusha Vijijini'
            },
            {
              name: 'Meru District Council',
              native: 'Halmashauri ya Wilaya ya Meru'
            },
            {
              name: 'Karatu District Council',
              native: 'Halmashauri ya Wilaya ya Karatu'
            },
            {
              name: 'Longido District Council',
              native: 'Halmashauri ya Wilaya ya Longido'
            },
            {
              name: 'Monduli District Council',
              native: 'Halmashauri ya Wilaya ya Monduli'
            },
            {
              name: 'Ngorongoro District Council',
              native: 'Halmashauri ya Wilaya ya Ngorongoro'
            }
          ]
        },
        {
          name: 'DAR ES SALAAM',
          native: 'DAR ES SALAAM',
          districts: [
            {
              name: 'Ilala City Council',
              native: 'Halmashauri ya Jiji la Ilala'
            },
            {
              name: 'Kigamboni Municipal Council',
              native: 'Halmashauri ya Manispaa ya Kigamboni'
            },
            {
              name: 'Kinondoni Municipal Council',
              native: 'Halmashauri ya Manispaa ya Kinondoni'
            },
            {
              name: 'Temeke Municipal Council',
              native: 'Halmashauri ya Manispaa ya Temeke'
            },
            {
              name: 'Ubungo Municipal Council',
              native: 'Halmashauri ya Manispaa ya Ubungo'
            }
          ]
        },
        {
          name: 'DODOMA',
          native: 'DODOMA',
          districts: [
            {
              name: 'Bahi District Council',
              native: 'Halmashauri ya Wilaya ya Bahi'
            },
            {
              name: 'Chamwino District Council',
              native: 'Halmashauri ya Wilaya ya Chamwino'
            },
            {
              name: 'Chemba District Council',
              native: 'Halmashauri ya Wilaya ya Chemba'
            },
            {
              name: 'Dodoma City Council',
              native: 'Halmashauri ya Jiji la Dodoma'
            },
            {
              name: 'Kondoa Town Council',
              native: 'Halmashauri ya Mji wa Kondoa'
            },
            {
              name: 'Kondoa District Council',
              native: 'Halmashauri ya Wilaya ya Kondoa'
            },
            {
              name: 'Kongwa District Council',
              native: 'Halmashauri ya Wilaya ya Kongwa'
            },
            {
              name: 'Mpwapwa District Council',
              native: 'Halmashauri ya Wilaya ya Mpwapwa'
            }
          ]
        },
        {
          name: 'GEITA',
          native: 'GEITA',
          districts: [
            {
              name: 'Bukombe District Council',
              native: 'Halmashauri ya Wilaya ya Bukombe'
            },
            {
              name: 'Chato District Council',
              native: 'Halmashauri ya Wilaya ya Chato'
            },
            {
              name: 'Geita District Council',
              native: 'Halmashauri ya Wilaya ya Geita'
            },
            {
              name: 'Geita Town Council',
              native: 'Halmashauri ya Mji wa Geita'
            },
            {
              name: 'Mbogwe District Council',
              native: 'Halmashauri ya Wilaya ya Mbogwe'
            },
            { name: '', native: 'Halmashauri ya Wilaya ya Nyang’hwale' }
          ]
        },
        {
          name: 'IRINGA',
          native: 'IRINGA',
          districts: [
            {
              name: 'Iringa Municipal Council',
              native: 'Halmashauri ya Manispaa ya Iringa'
            },
            {
              name: 'Iringa Rural District Council',
              native: 'Halmashauri ya Wilaya ya Iringa Vijijini'
            },
            {
              name: 'Kilolo District Council',
              native: 'Halmashauri ya Wilaya ya Kilolo'
            },
            {
              name: 'Mufindi District Council',
              native: 'Halmashauri ya Wilaya ya Mufindi'
            },
            {
              name: 'Mafinga Town Council',
              native: 'Halmashauri ya Mji wa Mafinga'
            }
          ]
        },
        {
          name: 'KAGERA',
          native: 'KAGERA',
          districts: [
            {
              name: 'Biharamuro District Council',
              native: 'Halmashauri ya Wilaya ya Biharamulo'
            },
            {
              name: 'Bukoba Municipal Council',
              native: 'Halmashauri ya Manispaa ya Bukoba'
            },
            {
              name: 'Bukoba District Council',
              native: 'Halmashauri ya Wilaya ya Bukoba'
            },
            {
              name: 'Karagwe District Council',
              native: 'Halmashauri ya Wilaya ya Karagwe'
            },
            {
              name: 'Kyerwa District Council',
              native: 'Halmashauri ya Wilaya ya Kyerwa'
            },
            {
              name: 'Missenyi District Council',
              native: 'Halmashauri ya Wilaya ya Missenyi'
            },
            {
              name: 'Muleba District Council',
              native: 'Halmashauri ya Wilaya ya Muleba'
            },
            {
              name: 'Ngara District Council',
              native: 'Halmashauri ya Wilaya ya Ngara'
            }
          ]
        },
        {
          name: 'KATAVI',
          native: 'KATAVI',
          districts: [
            {
              name: 'Mlele District Council',
              native: 'Halmashauri ya Wilaya ya Mlele'
            },
            {
              name: 'Mpanda Rural District Council',
              native: 'Halmashauri ya Wilaya ya Mpanda Vijijini'
            },
            {
              name: 'Mpanda Town Council',
              native: 'Halmashauri ya Mji wa Mpanda'
            },
            {
              name: 'Mpimbwe District Council',
              native: 'Halmashauri ya Wilaya ya Mpimbwe'
            },
            {
              name: 'Nsimbe District Council',
              native: 'Halmashauri ya Wilaya ya Nsimbe'
            }
          ]
        },
        {
          name: 'KIGOMA',
          native: 'KIGOMA',
          districts: [
            {
              name: 'Buhigwe District Council',
              native: 'Halmashauri ya Wilaya ya Buhigwe'
            },
            {
              name: 'Kakonko District Council',
              native: 'Halmashauri ya Wilaya ya Kakonko'
            },
            {
              name: 'Kasulu District Council',
              native: 'Halmashauri ya Wilaya ya Kasulu'
            },
            {
              name: 'Kasulu Town Council',
              native: 'Halmashauri ya Mji wa Kasulu'
            },
            {
              name: 'Kibondo District Council',
              native: 'Halmashauri ya Wilaya ya Kibondo'
            },
            {
              name: 'Kigoma District Council',
              native: 'Halmashauri ya Wilaya ya Kigoma'
            },
            {
              name: 'Kigoma-Ujiji Municipal Council',
              native: 'Halmashauri ya Manispaa ya Kigoma-Ujiji'
            },
            {
              name: 'Uvinza District Council',
              native: 'Halmashauri ya Wilaya ya Uvinza'
            }
          ]
        },
        {
          name: 'KILIMANJARO',
          native: 'KILIMANJARO',
          districts: [
            {
              name: 'Hai District Council',
              native: 'Halmashauri ya Wilaya ya Hai'
            },
            {
              name: 'Moshi Municipal Council',
              native: 'Halmashauri ya Manispaa ya Moshi'
            },
            {
              name: 'Moshi District Council',
              native: 'Halmashauri ya Wilaya ya Moshi'
            },
            {
              name: 'Mwanga District Council',
              native: 'Halmashauri ya Wilaya ya Mwanga'
            },
            {
              name: 'Rombo District Council',
              native: 'Halmashauri ya Wilaya ya Rombo'
            },
            {
              name: 'Same District Council',
              native: 'Halmashauri ya Wilaya ya Same'
            },
            {
              name: 'Siha District Council',
              native: 'Halmashauri ya Wilaya ya Siha'
            }
          ]
        },
        {
          name: 'LINDI',
          native: 'LINDI',
          districts: [
            {
              name: 'Kilwa District Council',
              native: 'Halmashauri ya Wilaya ya Kilwa'
            },
            {
              name: 'Lindi Municipal Council',
              native: 'Halmashauri ya Manispaa ya Lindi'
            },
            {
              name: 'Lindi District Council',
              native: 'Halmashauri ya Wilaya ya Lindi'
            },
            {
              name: 'Liwale District Council',
              native: 'Halmashauri ya Wilaya ya Liwale'
            },
            {
              name: 'Nachingwea District Council',
              native: 'Halmashauri ya Wilaya ya Nachingwea'
            },
            {
              name: 'Ruangwa District Council',
              native: 'Halmashauri ya Wilaya ya Ruangwa'
            }
          ]
        },
        {
          name: 'MANYARA',
          native: 'MANYARA',
          districts: [
            {
              name: 'Babati District Council',
              native: 'Halmashauri ya Wilaya ya Babati'
            },
            {
              name: 'Babati Town Council',
              native: 'Halmashauri ya Mji wa Babati'
            },
            {
              name: 'Hanang District Council',
              native: 'Halmashauri ya Wilaya ya Hanang'
            },
            {
              name: 'Kiteto District Council',
              native: 'Halmashauri ya Wilaya ya Kiteto'
            },
            {
              name: 'Mbulu District Council',
              native: 'Halmashauri ya Wilaya ya Mbulu'
            },
            {
              name: 'Mbulu Town Council',
              native: 'Halmashauri ya Mji wa Mbulu'
            },
            {
              name: 'Simanjiro District Council',
              native: 'Halmashauri ya Wilaya ya Simanjiro'
            }
          ]
        },
        {
          name: 'MARA',
          native: 'MARA',
          districts: [
            {
              name: 'Bunda District Council',
              native: 'Halmashauri ya Wilaya ya Bunda'
            },
            {
              name: 'Bunda Town Council',
              native: 'Halmashauri ya Mji wa Bunda'
            },
            {
              name: 'Butiama District Council',
              native: 'Halmashauri ya Wilaya ya Butiama'
            },
            {
              name: 'Musoma Municipal Council',
              native: 'Halmashauri ya Manispaa ya Musoma'
            },
            {
              name: 'Musoma District Council',
              native: 'Halmashauri ya Wilaya ya Musoma'
            },
            {
              name: 'Rorya District Council',
              native: 'Halmashauri ya Wilaya ya Rorya'
            },
            {
              name: 'Serengeti District Council',
              native: 'Halmashauri ya Wilaya ya Serengeti'
            },
            {
              name: 'Tarime District Council',
              native: 'Halmashauri ya Wilaya ya Tarime'
            }
          ]
        },
        {
          name: 'MBEYA',
          native: 'MBEYA',
          districts: [
            {
              name: 'Busokelo District Council',
              native: 'Halmashauri ya Wilaya ya Busokelo'
            },
            {
              name: 'Chunya District Council',
              native: 'Halmashauri ya Wilaya ya Chunya'
            },
            {
              name: 'Kyera District Council',
              native: 'Halmashauri ya Wilaya ya Kyera'
            },
            {
              name: 'Mbarali District Council',
              native: 'Halmashauri ya Wilaya ya Mbarali'
            },
            {
              name: 'Mbeya City Council',
              native: 'Halmashauri ya Jiji la Mbeya'
            },
            {
              name: 'Mbeya District Council',
              native: 'Halmashauri ya Wilaya ya Mbeya'
            },
            {
              name: 'Rungwe District Council',
              native: 'Halmashauri ya Wilaya ya Rungwe'
            }
          ]
        },
        {
          name: 'MOROGORO',
          native: 'MOROGORO',
          districts: [
            {
              name: 'Gairo District Council',
              native: 'Halmashauri ya Wilaya ya Gairo'
            },
            {
              name: 'Kilombero District Council',
              native: 'Halmashauri ya Wilaya ya Kilombero'
            },
            {
              name: 'Kilosa District Council',
              native: 'Halmashauri ya Wilaya ya Kilosa'
            },
            {
              name: 'Malinyi District Council',
              native: 'Halmashauri ya Wilaya ya Malinyi'
            },
            {
              name: 'Morogoro District Council',
              native: 'Halmashauri ya Wilaya ya Morogoro'
            },
            {
              name: 'Morogoro Municipal Council',
              native: 'Halmashauri ya Manispaa ya Morogoro'
            },
            {
              name: 'Mvomero District Council',
              native: 'Halmashauri ya Wilaya ya Mvomero'
            },
            {
              name: 'Ulanga District Council',
              native: 'Halmashauri ya Wilaya ya Ulanga'
            },
            {
              name: 'Ifakara Town Council',
              native: 'Halmashauri ya Mji wa Ifakara'
            }
          ]
        },
        {
          name: 'MTWARA',
          native: 'MTWARA',
          districts: [
            {
              name: 'Masasi District Council',
              native: 'Halmashauri ya Wilaya ya Masasi'
            },
            {
              name: 'Masasi Town Council',
              native: 'Halmashauri ya Mji wa Masasi'
            },
            {
              name: 'Mtwara Municipal Council',
              native: 'Halmashauri ya Manispaa ya Mtwara'
            },
            {
              name: 'Mtwara District Council',
              native: 'Halmashauri ya Wilaya ya Mtwara '
            },
            {
              name: 'Nanyumbu District Council',
              native: 'Halmashauri ya Wilaya ya Nanyumbu'
            },
            {
              name: 'Newala District Council',
              native: 'Halmashauri ya Wilaya ya Newala'
            },
            {
              name: 'Newala Town Council',
              native: 'Halmashauri ya Mji wa Newala'
            },
            {
              name: 'Tandahimba District Council',
              native: 'Halmashauri ya Wilaya ya Tandahimba'
            },
            {
              name: 'Nanyamba Town Council',
              native: 'Halmashauri ya Mji wa Nanyamba'
            }
          ]
        },
        {
          name: 'MWANZA',
          native: 'MWANZA',
          districts: [
            {
              name: 'Ilemela Municipal Council',
              native: 'Halmashauri ya Manispaa ya Ilemela'
            },
            {
              name: 'Kwimba District Council',
              native: 'Halmashauri ya Wilaya ya Kwimba'
            },
            {
              name: 'Magu District Council',
              native: 'Halmashauri ya Wilaya ya Magu'
            },
            {
              name: 'Misungwi District Council',
              native: 'Halmashauri ya Wilaya ya Misungwi'
            },
            {
              name: 'Nyamagana Municipal Council',
              native: 'Halmashauri ya Manispaa ya Nyamagana'
            },
            {
              name: 'Buchosa District Council',
              native: 'Halmashauri ya Wilaya ya Buchosa'
            },
            {
              name: 'Sengerema District Council',
              native: 'Halmashauri ya Wilaya ya Sengerema'
            },
            {
              name: 'Ukerewe District Council',
              native: 'Halmashauri ya Wilaya ya Ukerewe'
            }
          ]
        },
        {
          name: 'NJOMBE',
          native: 'NJOMBE',
          districts: [
            {
              name: 'Ludewa District Council',
              native: 'Halmashauri ya Wilaya ya Ludewa'
            },
            {
              name: 'Makambako Town Council',
              native: 'Halmashauri ya Mji wa Makambako'
            },
            {
              name: 'Makete District Council',
              native: 'Halmashauri ya Wilaya ya Makete'
            },
            {
              name: 'Njombe District Council',
              native: 'Halmashauri ya Wilaya ya Njombe'
            },
            {
              name: 'Njombe Town Council',
              native: 'Halmashauri ya Mji wa Njombe'
            },
            {
              name: 'Wanging’ombe District Council',
              native: 'Halmashauri ya Wilaya ya Wanging’ombe'
            }
          ]
        },
        {
          name: 'PWANI',
          native: 'PWANI',
          districts: [
            {
              name: 'Bagamoyo District Council',
              native: 'Halmashauri ya Wilaya ya Bagamoyo'
            },
            {
              name: 'Chalinze District Council',
              native: 'Halmashauri ya Wilaya ya Chalinze'
            },
            {
              name: 'Kibaha Municipal Council',
              native: 'Halmashauri ya Manispaa ya Kibaha'
            },
            {
              name: 'Kibaha District Council',
              native: 'Halmashauri ya Wilaya ya Kibaha'
            },
            {
              name: 'Kisarawe District Council',
              native: 'Halmashauri ya Wilaya ya Kisarawe'
            },
            {
              name: 'Mafia District Council',
              native: 'Halmashauri ya Wilaya ya Mafia'
            },
            {
              name: 'Mkuranga District Council',
              native: 'Halmashauri ya Wilaya ya Mkuranga'
            },
            {
              name: 'Rufiji District Council',
              native: 'Halmashauri ya Wilaya ya Rufiji'
            },
            {
              name: 'Kibiti District Council',
              native: 'Halmashauri ya Wilaya ya Kibiti'
            }
          ]
        },
        {
          name: 'RUKWA',
          native: 'RUKWA',
          districts: [
            {
              name: 'Kalambo District Council',
              native: 'Halmashauri ya Wilaya ya Kalambo'
            },
            {
              name: 'Nkasi District Council',
              native: 'Halmashauri ya Wilaya ya Nkasi'
            },
            {
              name: 'Sumbawanga Municipal Council',
              native: 'Halmashauri ya Manispaa ya Sumbawanga'
            },
            {
              name: 'Sumbawanga District Council',
              native: 'Halmashauri ya Wilaya ya Sumbawanga'
            }
          ]
        },
        {
          name: 'RUVUMA',
          native: 'RUVUMA',
          districts: [
            {
              name: 'Mbinga District Council',
              native: 'Halmashauri ya Wilaya ya Mbinga'
            },
            {
              name: 'Mbinga Town Council',
              native: 'Halmashauri ya Mji wa Mbinga'
            },
            {
              name: 'Namtumbo District Council',
              native: 'Halmashauri ya Wilaya ya Namtumbo'
            },
            {
              name: 'Nyasa District Council',
              native: 'Halmashauri ya Wilaya ya Nyasa'
            },
            {
              name: 'Songea Municipal Council',
              native: 'Halmashauri ya Manispaa ya Songea'
            },
            {
              name: 'Songea District Council',
              native: 'Halmashauri ya Wilaya ya Songea'
            },
            {
              name: 'Tunduru District Council',
              native: 'Halmashauri ya Wilaya ya Tunduru'
            },
            {
              name: 'Madaba District Council',
              native: 'Halmashauri ya Wilaya ya Madaba'
            }
          ]
        },
        {
          name: 'SHINYANGA',
          native: 'SHINYANGA',
          districts: [
            {
              name: 'Kahama Town Council',
              native: 'Halmashauri ya Mji wa Kahama'
            },
            {
              name: 'Kishapu District Council',
              native: 'Halmashauri ya Wilaya ya Kishapu'
            },
            {
              name: 'Shinyanga Municipal Council',
              native: 'Halmashauri ya Manispaa ya Shinyanga'
            },
            {
              name: 'Shinyanga District Council',
              native: 'Halmashauri ya Wilaya ya Shinyanga'
            },
            {
              name: 'Ushetu District Council',
              native: 'Halmashauri ya Wilaya ya Ushetu'
            },
            {
              name: 'Msalala District Council',
              native: 'Halmashauri ya Wilaya ya Msalala'
            }
          ]
        },
        {
          name: 'SIMIYU',
          native: 'SIMIYU',
          districts: [
            {
              name: 'Bariadi District Council',
              native: 'Halmashauri ya Wilaya ya Bariadi'
            },
            {
              name: 'Bariadi Town Council',
              native: 'Halmashauri ya Mji wa Bariadi'
            },
            {
              name: 'Busega District Council',
              native: 'Halmashauri ya Wilaya ya Busega'
            },
            {
              name: 'Itilima District Council',
              native: 'Halmashauri ya Wilaya ya Itilima'
            },
            {
              name: 'Maswa District Council',
              native: 'Halmashauri ya Wilaya ya Maswa'
            },
            {
              name: 'Meatu District Council',
              native: 'Halmashauri ya Wilaya ya Meatu'
            }
          ]
        },
        {
          name: 'SINGIDA',
          native: 'SINGIDA',
          districts: [
            {
              name: 'Ikungi District Council',
              native: 'Halmashauri ya Wilaya ya Ikungi'
            },
            {
              name: 'Iramba District Council',
              native: 'Halmashauri ya Wilaya ya Iramba'
            },
            {
              name: 'Manyoni District Council',
              native: 'Halmashauri ya Wilaya ya Manyoni'
            },
            {
              name: 'Mkalama District Council',
              native: 'Halmashauri ya Wilaya ya Mkalama'
            },
            {
              name: 'Singida Municipal Council',
              native: 'Halmashauri ya Manispaa ya Singida'
            },
            {
              name: 'Singida District Council',
              native: 'Halmashauri ya Wilaya ya Singida'
            },
            {
              name: 'Itigi District Council',
              native: 'Halmashauri ya Wilaya ya Itigi'
            }
          ]
        },
        {
          name: 'SONGWE',
          native: 'SONGWE',
          districts: [
            {
              name: 'Ileje District Council',
              native: 'Halmashauri ya Wilaya ya Ileje'
            },
            {
              name: 'Mbozi District Council',
              native: 'Halmashauri ya Wilaya ya Mbozi'
            },
            {
              name: 'Momba District Council',
              native: 'Halmashauri ya Wilaya ya Momba'
            },
            {
              name: 'Songwe District Council',
              native: 'Halmashauri ya Wilaya ya Songwe'
            },
            {
              name: 'Tunduma Town Council',
              native: 'Halmashauri ya Mji wa Tunduma'
            }
          ]
        },
        {
          name: 'TABORA',
          native: 'TABORA',
          districts: [
            {
              name: 'Igunga District Council',
              native: 'Halmashauri ya Wilaya ya Igunga'
            },
            {
              name: 'Kaliua District Council',
              native: 'Halmashauri ya Wilaya ya Kaliua'
            },
            {
              name: 'Nzega District Council',
              native: 'Halmashauri ya Wilaya ya Nzega'
            },
            {
              name: 'Nzenga Town Council',
              native: 'Halmashauri ya Mji wa Nzenga'
            },
            {
              name: 'Sikonge District Council',
              native: 'Halmashauri ya Wilaya ya Sikonge'
            },
            {
              name: 'Tabora Municipal Council',
              native: 'Halmashauri ya Manispaa ya Tabora'
            },
            {
              name: 'Tabora District Council',
              native: 'Halmashauri ya Wilaya ya Tabora'
            },
            {
              name: 'Urambo District Council',
              native: 'Halmashauri ya Wilaya ya Urambo'
            }
          ]
        },
        {
          name: 'TANGA',
          native: 'TANGA',
          districts: [
            {
              name: 'Handeni District Council',
              native: 'Halmashauri ya Wilaya ya Handeni'
            },
            {
              name: 'Handeni Town Council',
              native: 'Halmashauri ya Mji wa Handeni'
            },
            {
              name: 'Kilindi District Council',
              native: 'Halmashauri ya Wilaya ya Kilindi'
            },
            {
              name: 'Korogwe District Council',
              native: 'Halmashauri ya Wilaya ya Korogwe'
            },
            {
              name: 'Korogwe Town Council',
              native: 'Halmashauri ya Mji wa Korogwe'
            },
            {
              name: 'Lushoto District Council',
              native: 'Halmashauri ya Wilaya ya Lushoto'
            },
            {
              name: 'Mkinga District Council',
              native: 'Halmashauri ya Wilaya ya Mkinga'
            },
            {
              name: 'Muheza District Council',
              native: 'Halmashauri ya Wilaya ya Muheza'
            },
            {
              name: 'Pangani District Council',
              native: 'Halmashauri ya Wilaya ya Pangani'
            },
            {
              name: 'Tanga City Council',
              native: 'Halmashauri ya Jiji la Tanga'
            }
          ]
        }
      ]
    },
    UA: {
      name: 'Ukraine',
      native: 'Україна',
      phone: '380',
      continent: 'EU',
      capital: 'Kiev',
      currency: 'UAH',
      languages: 'uk',
      numeric: '804'
    },
    UG: {
      name: 'Uganda',
      native: 'Uganda',
      phone: '256',
      continent: 'AF',
      capital: 'Kampala',
      currency: 'UGX',
      languages: 'en,sw',
      numeric: '800'
    },
    UM: {
      name: 'U.S. Minor Outlying Islands',
      native: 'United States Minor Outlying Islands',
      phone: '',
      continent: 'OC',
      capital: '',
      currency: 'USD',
      languages: 'en',
      numeric: '581'
    },
    US: {
      name: 'United States',
      native: 'United States',
      phone: '1',
      continent: 'NA',
      capital: 'Washington D.C.',
      currency: 'USD,USN,USS',
      languages: 'en',
      numeric: '840'
    },
    UY: {
      name: 'Uruguay',
      native: 'Uruguay',
      phone: '598',
      continent: 'SA',
      capital: 'Montevideo',
      currency: 'UYI,UYU',
      languages: 'es',
      numeric: '858'
    },
    UZ: {
      name: 'Uzbekistan',
      native: 'O‘zbekiston',
      phone: '998',
      continent: 'AS',
      capital: 'Tashkent',
      currency: 'UZS',
      languages: 'uz,ru',
      numeric: '860'
    },
    VA: {
      name: 'Vatican City',
      native: 'Vaticano',
      phone: '39066,379',
      continent: 'EU',
      capital: 'Vatican City',
      currency: 'EUR',
      languages: 'it,la',
      numeric: '336'
    },
    VC: {
      name: 'Saint Vincent and the Grenadines',
      native: 'Saint Vincent and the Grenadines',
      phone: '1784',
      continent: 'NA',
      capital: 'Kingstown',
      currency: 'XCD',
      languages: 'en',
      numeric: '670'
    },
    VE: {
      name: 'Venezuela',
      native: 'Venezuela',
      phone: '58',
      continent: 'SA',
      capital: 'Caracas',
      currency: 'VEF',
      languages: 'es',
      numeric: '862'
    },
    VG: {
      name: 'British Virgin Islands',
      native: 'British Virgin Islands',
      phone: '1284',
      continent: 'NA',
      capital: 'Road Town',
      currency: 'USD',
      languages: 'en',
      numeric: '092'
    },
    VI: {
      name: 'U.S. Virgin Islands',
      native: 'United States Virgin Islands',
      phone: '1340',
      continent: 'NA',
      capital: 'Charlotte Amalie',
      currency: 'USD',
      languages: 'en',
      numeric: '850'
    },
    VN: {
      name: 'Vietnam',
      native: 'Việt Nam',
      phone: '84',
      continent: 'AS',
      capital: 'Hanoi',
      currency: 'VND',
      languages: 'vi',
      numeric: '704'
    },
    VU: {
      name: 'Vanuatu',
      native: 'Vanuatu',
      phone: '678',
      continent: 'OC',
      capital: 'Port Vila',
      currency: 'VUV',
      languages: 'bi,en,fr',
      numeric: '548'
    },
    WF: {
      name: 'Wallis and Futuna',
      native: 'Wallis et Futuna',
      phone: '681',
      continent: 'OC',
      capital: 'Mata-Utu',
      currency: 'XPF',
      languages: 'fr',
      numeric: '876'
    },
    WS: {
      name: 'Samoa',
      native: 'Samoa',
      phone: '685',
      continent: 'OC',
      capital: 'Apia',
      currency: 'WST',
      languages: 'sm,en',
      numeric: '882'
    },
    XK: {
      name: 'Kosovo',
      native: 'Republika e Kosovës',
      phone: '377,381,386',
      continent: 'EU',
      capital: 'Pristina',
      currency: 'EUR',
      languages: 'sq,sr',
      numeric: '000'
    },
    YE: {
      name: 'Yemen',
      native: 'اليَمَن',
      phone: '967',
      continent: 'AS',
      capital: "Sana'a",
      currency: 'YER',
      languages: 'ar',
      numeric: '887'
    },
    YT: {
      name: 'Mayotte',
      native: 'Mayotte',
      phone: '262',
      continent: 'AF',
      capital: 'Mamoudzou',
      currency: 'EUR',
      languages: 'fr',
      numeric: '175'
    },
    ZA: {
      name: 'South Africa',
      native: 'South Africa',
      phone: '27',
      continent: 'AF',
      capital: 'Pretoria',
      currency: 'ZAR',
      languages: 'af,en,nr,st,ss,tn,ts,ve,xh,zu',
      numeric: '710'
    },
    ZM: {
      name: 'Zambia',
      native: 'Zambia',
      phone: '260',
      continent: 'AF',
      capital: 'Lusaka',
      currency: 'ZMK',
      languages: 'en',
      numeric: '894'
    },
    ZW: {
      name: 'Zimbabwe',
      native: 'Zimbabwe',
      phone: '263',
      continent: 'AF',
      capital: 'Harare',
      currency: 'ZWL',
      languages: 'en,sn,nd',
      numeric: '716'
    }
  }
};
