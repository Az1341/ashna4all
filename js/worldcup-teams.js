/* ============================================================
   GOALCURRENT.LIVE — World Cup 2026 Teams Data
   Squad data for all 48 qualified nations
   Source: FIFA.com / official squad announcements June 2026
   ============================================================ */

var WC26_TEAMS = {

  /* ── GROUP A ── */
  'Mexico': {
    flag:'🇲🇽', code:'MEX', conf:'CONCACAF', group:'A', host:true,
    coach:'Javier Aguirre',
    squad:[
      {n:1,  name:'Guillermo Ochoa',    pos:'GK'},
      {n:13, name:'Rodolfo Cota',       pos:'GK'},
      {n:23, name:'Carlos Acevedo',     pos:'GK'},
      {n:3,  name:'Jesús Gallardo',     pos:'DEF'},
      {n:4,  name:'Edson Álvarez',      pos:'DEF'},
      {n:5,  name:'Johan Vásquez',      pos:'DEF'},
      {n:15, name:'Héctor Moreno',      pos:'DEF'},
      {n:2,  name:'Jorge Sánchez',      pos:'DEF'},
      {n:14, name:'Luis Romo',          pos:'MID'},
      {n:8,  name:'Orbelín Pineda',     pos:'MID'},
      {n:16, name:'Héctor Herrera',     pos:'MID'},
      {n:18, name:'Erick Gutiérrez',    pos:'MID'},
      {n:7,  name:'Hirving Lozano',     pos:'FWD'},
      {n:9,  name:'Raúl Jiménez',       pos:'FWD'},
      {n:10, name:'Alexis Vega',        pos:'FWD'},
      {n:11, name:'Henry Martín',       pos:'FWD'},
    ]
  },

  'South Africa': {
    flag:'🇿🇦', code:'RSA', conf:'CAF', group:'A',
    coach:'Hugo Broos',
    squad:[
      {n:1,  name:'Ronwen Williams',    pos:'GK'},
      {n:22, name:'Veli Mothwa',        pos:'GK'},
      {n:5,  name:'Rushine De Reuck',   pos:'DEF'},
      {n:6,  name:'Siyanda Xulu',       pos:'DEF'},
      {n:3,  name:'Innocent Maela',     pos:'DEF'},
      {n:2,  name:'Reeve Frosler',      pos:'DEF'},
      {n:8,  name:'Teboho Mokoena',     pos:'MID'},
      {n:10, name:'Themba Zwane',       pos:'MID'},
      {n:11, name:'Percy Tau',          pos:'FWD'},
      {n:9,  name:'Evidence Makgopa',   pos:'FWD'},
      {n:7,  name:'Lyle Foster',        pos:'FWD'},
    ]
  },

  'South Korea': {
    flag:'🇰🇷', code:'KOR', conf:'AFC', group:'A',
    coach:'Hong Myung-bo',
    squad:[
      {n:1,  name:'Kim Seung-gyu',      pos:'GK'},
      {n:4,  name:'Kim Min-jae',        pos:'DEF'},
      {n:3,  name:'Kim Jin-su',         pos:'DEF'},
      {n:2,  name:'Lee Ki-je',          pos:'DEF'},
      {n:16, name:'Hwang In-beom',      pos:'MID'},
      {n:8,  name:'Son Jun-ho',         pos:'MID'},
      {n:10, name:'Son Heung-min',      pos:'FWD', captain:true},
      {n:7,  name:'Lee Jae-sung',       pos:'FWD'},
      {n:9,  name:'Cho Gue-sung',       pos:'FWD'},
      {n:11, name:'Hwang Hee-chan',     pos:'FWD'},
    ]
  },

  'Czech Republic': {
    flag:'🇨🇿', code:'CZE', conf:'UEFA', group:'A',
    coach:'Ivan Hašek',
    squad:[
      {n:1,  name:'Jiří Staněk',        pos:'GK'},
      {n:5,  name:'Tomáš Souček',       pos:'MID'},
      {n:10, name:'Patrik Schick',      pos:'FWD'},
      {n:7,  name:'Ondřej Lingr',       pos:'FWD'},
      {n:9,  name:'Adam Hložek',        pos:'FWD'},
      {n:8,  name:'Lukáš Provod',       pos:'MID'},
      {n:3,  name:'Jan Bořil',          pos:'DEF'},
      {n:4,  name:'Ladislav Krejčí',    pos:'DEF'},
    ]
  },

  /* ── GROUP B ── */
  'Canada': {
    flag:'🇨🇦', code:'CAN', conf:'CONCACAF', group:'B', host:true,
    coach:'Jesse Marsch',
    squad:[
      {n:1,  name:'Maxime Crépeau',     pos:'GK'},
      {n:3,  name:'Alphonso Davies',    pos:'DEF'},
      {n:5,  name:'Steven Vitória',     pos:'DEF'},
      {n:4,  name:'Alistair Johnston',  pos:'DEF'},
      {n:8,  name:'Stephen Eustáquio', pos:'MID'},
      {n:10, name:'Jonathan David',     pos:'FWD'},
      {n:7,  name:'Cyle Larin',         pos:'FWD'},
      {n:9,  name:'Tajon Buchanan',     pos:'FWD'},
      {n:11, name:'Liam Millar',        pos:'FWD'},
    ]
  },

  'Bosnia & Herzegovina': {
    flag:'🇧🇦', code:'BIH', conf:'UEFA', group:'B',
    coach:'Sergej Barbarez',
    squad:[
      {n:1,  name:'Ibrahim Šehić',      pos:'GK'},
      {n:9,  name:'Edin Džeko',         pos:'FWD', captain:true},
      {n:10, name:'Miralem Pjanić',     pos:'MID'},
      {n:7,  name:'Anel Ahmedhodžić',   pos:'DEF'},
      {n:8,  name:'Sead Kolašinac',     pos:'DEF'},
    ]
  },

  'Qatar': {
    flag:'🇶🇦', code:'QAT', conf:'AFC', group:'B',
    coach:'Marquez Lopez',
    squad:[
      {n:1,  name:'Meshaal Barsham',    pos:'GK'},
      {n:10, name:'Hassan Al-Haydos',   pos:'MID', captain:true},
      {n:9,  name:'Almoez Ali',         pos:'FWD'},
      {n:11, name:'Akram Afif',         pos:'FWD'},
      {n:7,  name:'Mohammed Muntari',   pos:'FWD'},
    ]
  },

  'Switzerland': {
    flag:'🇨🇭', code:'SUI', conf:'UEFA', group:'B',
    coach:'Murat Yakin',
    squad:[
      {n:1,  name:'Yann Sommer',        pos:'GK'},
      {n:10, name:'Granit Xhaka',       pos:'MID', captain:true},
      {n:9,  name:'Haris Seferović',    pos:'FWD'},
      {n:7,  name:'Xherdan Shaqiri',    pos:'FWD'},
      {n:23, name:'Manuel Akanji',      pos:'DEF'},
      {n:5,  name:'Denis Zakaria',      pos:'MID'},
      {n:11, name:'Breel Embolo',       pos:'FWD'},
    ]
  },

  /* ── GROUP C ── */
  'Brazil': {
    flag:'🇧🇷', code:'BRA', conf:'CONMEBOL', group:'C',
    coach:'Dorival Júnior',
    squad:[
      {n:1,  name:'Alisson Becker',     pos:'GK'},
      {n:3,  name:'Marquinhos',         pos:'DEF', captain:true},
      {n:6,  name:'Alex Sandro',        pos:'DEF'},
      {n:4,  name:'Éder Militão',       pos:'DEF', injured:true},
      {n:14, name:'Danilo',             pos:'DEF'},
      {n:8,  name:'Casemiro',           pos:'MID'},
      {n:5,  name:'Lucas Paquetá',      pos:'MID'},
      {n:17, name:'Bruno Guimarães',    pos:'MID'},
      {n:10, name:'Neymar Jr',          pos:'FWD'},
      {n:9,  name:'Gabriel Jesus',      pos:'FWD'},
      {n:11, name:'Raphinha',           pos:'FWD'},
      {n:7,  name:'Vinicius Jr',        pos:'FWD'},
      {n:20, name:'Rodrygo',            pos:'FWD', injured:true},
    ]
  },

  'Morocco': {
    flag:'🇲🇦', code:'MAR', conf:'CAF', group:'C',
    coach:'Walid Regragui',
    squad:[
      {n:1,  name:'Yassine Bounou',     pos:'GK'},
      {n:6,  name:'Romain Saïss',       pos:'DEF', captain:true},
      {n:3,  name:'Noussair Mazraoui',  pos:'DEF'},
      {n:5,  name:'Nayef Aguerd',       pos:'DEF'},
      {n:8,  name:'Azzedine Ounahi',    pos:'MID'},
      {n:4,  name:'Sofyan Amrabat',     pos:'MID'},
      {n:7,  name:'Hakim Ziyech',       pos:'FWD'},
      {n:10, name:'Brahim Díaz',        pos:'FWD'},
      {n:9,  name:'Youssef En-Nesyri',  pos:'FWD'},
      {n:19, name:'Achraf Hakimi',      pos:'DEF'},
    ]
  },

  'Haiti': {
    flag:'🇭🇹', code:'HAI', conf:'CONCACAF', group:'C',
    coach:'Marc Collat',
    squad:[
      {n:1,  name:'Josué Duverger',     pos:'GK'},
      {n:10, name:'Duckens Nazon',      pos:'FWD'},
      {n:9,  name:'Frantzdy Pierrot',   pos:'FWD'},
    ]
  },

  'Scotland': {
    flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', code:'SCO', conf:'UEFA', group:'C',
    coach:'Steve Clarke',
    squad:[
      {n:1,  name:'Angus Gunn',         pos:'GK'},
      {n:5,  name:'Grant Hanley',       pos:'DEF', captain:true},
      {n:3,  name:'Andy Robertson',     pos:'DEF'},
      {n:2,  name:'Aaron Hickey',       pos:'DEF'},
      {n:8,  name:'John McGinn',        pos:'MID'},
      {n:10, name:'Callum McGregor',    pos:'MID'},
      {n:7,  name:'Ryan Christie',      pos:'MID'},
      {n:9,  name:'Lyndon Dykes',       pos:'FWD'},
      {n:11, name:'Scott McTominay',    pos:'MID'},
    ]
  },

  /* ── GROUP D ── */
  'USA': {
    flag:'🇺🇸', code:'USA', conf:'CONCACAF', group:'D', host:true,
    coach:'Mauricio Pochettino',
    squad:[
      {n:1,  name:'Matt Turner',        pos:'GK'},
      {n:4,  name:'Tyler Adams',        pos:'MID', captain:true},
      {n:5,  name:'Antonee Robinson',   pos:'DEF'},
      {n:3,  name:'Walker Zimmerman',   pos:'DEF'},
      {n:2,  name:'Dest Sergiño',       pos:'DEF'},
      {n:8,  name:'Weston McKennie',    pos:'MID'},
      {n:10, name:'Christian Pulisic',  pos:'FWD'},
      {n:9,  name:'Josh Sargent',       pos:'FWD'},
      {n:7,  name:'Giovanni Reyna',     pos:'MID'},
      {n:11, name:'Tim Weah',           pos:'FWD'},
    ]
  },

  'Paraguay': {
    flag:'🇵🇾', code:'PAR', conf:'CONMEBOL', group:'D',
    coach:'Gustavo Alfaro',
    squad:[
      {n:1,  name:'Antony Silva',       pos:'GK'},
      {n:9,  name:'Antonio Sanabria',   pos:'FWD'},
      {n:10, name:'Miguel Almirón',     pos:'MID'},
      {n:7,  name:'Ángel Romero',       pos:'FWD'},
      {n:5,  name:'Gustavo Gómez',      pos:'DEF', captain:true},
    ]
  },

  'Australia': {
    flag:'🇦🇺', code:'AUS', conf:'AFC', group:'D',
    coach:'Tony Popovic',
    squad:[
      {n:1,  name:'Mathew Ryan',        pos:'GK'},
      {n:10, name:'Ajdin Hrustic',      pos:'MID'},
      {n:9,  name:'Mitchell Duke',      pos:'FWD'},
      {n:7,  name:'Mathew Leckie',      pos:'FWD', captain:true},
      {n:11, name:'Martin Boyle',       pos:'FWD'},
      {n:4,  name:'Harry Souttar',      pos:'DEF'},
      {n:8,  name:'Riley McGree',       pos:'MID'},
    ]
  },

  'Turkey': {
    flag:'🇹🇷', code:'TUR', conf:'UEFA', group:'D',
    coach:'Vincenzo Montella',
    squad:[
      {n:1,  name:'Altay Bayındır',     pos:'GK'},
      {n:10, name:'Hakan Çalhanoğlu',   pos:'MID', captain:true},
      {n:9,  name:'Burak Yılmaz',       pos:'FWD'},
      {n:7,  name:'Kerem Aktürkoğlu',   pos:'FWD'},
      {n:11, name:'Arda Güler',         pos:'MID'},
      {n:4,  name:'Samet Akaydin',      pos:'DEF'},
    ]
  },

  /* ── GROUP E ── */
  'Germany': {
    flag:'🇩🇪', code:'GER', conf:'UEFA', group:'E',
    coach:'Julian Nagelsmann',
    squad:[
      {n:1,  name:'Manuel Neuer',       pos:'GK', captain:true},
      {n:5,  name:'Antonio Rüdiger',    pos:'DEF'},
      {n:4,  name:'Jonathan Tah',       pos:'DEF'},
      {n:3,  name:'David Raum',         pos:'DEF'},
      {n:6,  name:'Joshua Kimmich',     pos:'MID'},
      {n:8,  name:'Toni Kroos',         pos:'MID'},
      {n:7,  name:'Kai Havertz',        pos:'FWD'},
      {n:9,  name:'Niclas Füllkrug',    pos:'FWD'},
      {n:10, name:'Jamal Musiala',      pos:'FWD'},
      {n:11, name:'Leroy Sané',         pos:'FWD'},
      {n:13, name:'Thomas Müller',      pos:'FWD'},
      {n:14, name:'Florian Wirtz',      pos:'MID'},
    ]
  },

  'Ivory Coast': {
    flag:'🇨🇮', code:'CIV', conf:'CAF', group:'E',
    coach:'Emerse Faé',
    squad:[
      {n:1,  name:'Yahia Fofana',       pos:'GK'},
      {n:10, name:'Sébastien Haller',   pos:'FWD'},
      {n:11, name:'Nicolas Pépé',       pos:'FWD'},
      {n:9,  name:'Wilfried Zaha',      pos:'FWD'},
      {n:8,  name:'Franck Kessié',      pos:'MID'},
      {n:3,  name:'Serge Aurier',       pos:'DEF'},
    ]
  },

  'Curaçao': {
    flag:'🇨🇼', code:'CUW', conf:'CONCACAF', group:'E',
    coach:'Remko Bicentini',
    squad:[
      {n:1,  name:'Eloy Room',          pos:'GK'},
      {n:9,  name:'Leandro Bacuna',     pos:'MID', captain:true},
      {n:7,  name:'Cuco Martina',       pos:'DEF'},
    ]
  },

  'Ecuador': {
    flag:'🇪🇨', code:'ECU', conf:'CONMEBOL', group:'E',
    coach:'Sebastián Beccacece',
    squad:[
      {n:1,  name:'Hernán Galíndez',    pos:'GK'},
      {n:10, name:'Moisés Caicedo',     pos:'MID'},
      {n:9,  name:'Enner Valencia',     pos:'FWD', captain:true},
      {n:7,  name:'Gonzalo Plata',      pos:'FWD'},
      {n:11, name:'Jeremy Sarmiento',   pos:'FWD'},
    ]
  },

  /* ── GROUP F ── */
  'Netherlands': {
    flag:'🇳🇱', code:'NED', conf:'UEFA', group:'F',
    coach:'Ronald Koeman',
    squad:[
      {n:1,  name:'Bart Verbruggen',    pos:'GK'},
      {n:4,  name:'Virgil van Dijk',    pos:'DEF', captain:true},
      {n:5,  name:'Nathan Aké',         pos:'DEF'},
      {n:2,  name:'Denzel Dumfries',    pos:'DEF'},
      {n:8,  name:'Frenkie de Jong',    pos:'MID'},
      {n:10, name:'Memphis Depay',      pos:'FWD'},
      {n:11, name:'Steven Bergwijn',    pos:'FWD'},
      {n:7,  name:'Donyell Malen',      pos:'FWD'},
      {n:21, name:'Xavi Simons',        pos:'MID', injured:true},
    ]
  },

  'Japan': {
    flag:'🇯🇵', code:'JPN', conf:'AFC', group:'F',
    coach:'Hajime Moriyasu',
    squad:[
      {n:1,  name:'Shuichi Gonda',      pos:'GK'},
      {n:5,  name:'Yuto Nagatomo',      pos:'DEF'},
      {n:3,  name:'Ko Itakura',         pos:'DEF'},
      {n:8,  name:'Wataru Endo',        pos:'MID', captain:true},
      {n:10, name:'Takumi Minamino',    pos:'FWD'},
      {n:9,  name:'Ayase Ueda',         pos:'FWD'},
      {n:7,  name:'Ritsu Doan',         pos:'FWD'},
      {n:11, name:'Kaoru Mitoma',       pos:'FWD'},
    ]
  },

  'Sweden': {
    flag:'🇸🇪', code:'SWE', conf:'UEFA', group:'F',
    coach:'Jon Dahl Tomasson',
    squad:[
      {n:1,  name:'Robin Olsen',        pos:'GK'},
      {n:6,  name:'Victor Nilsson Lindelöf', pos:'DEF'},
      {n:10, name:'Emil Forsberg',      pos:'MID', captain:true},
      {n:9,  name:'Viktor Gyökeres',    pos:'FWD'},
      {n:7,  name:'Dejan Kulusevski',   pos:'FWD'},
      {n:11, name:'Alexander Isak',     pos:'FWD'},
    ]
  },

  'Tunisia': {
    flag:'🇹🇳', code:'TUN', conf:'CAF', group:'F',
    coach:'Faouzi Benzarti',
    squad:[
      {n:1,  name:'Aymen Dahmen',       pos:'GK'},
      {n:10, name:'Youssef Msakni',     pos:'FWD', captain:true},
      {n:9,  name:'Seifeddine Jaziri',  pos:'FWD'},
      {n:7,  name:'Wahbi Khazri',       pos:'FWD'},
      {n:8,  name:'Ellyes Skhiri',      pos:'MID'},
    ]
  },

  /* ── GROUP G ── */
  'Belgium': {
    flag:'🇧🇪', code:'BEL', conf:'UEFA', group:'G',
    coach:'Domenico Tedesco',
    squad:[
      {n:1,  name:'Koen Casteels',      pos:'GK'},
      {n:5,  name:'Jan Vertonghen',     pos:'DEF', captain:true},
      {n:4,  name:'Toby Alderweireld',  pos:'DEF'},
      {n:3,  name:'Yannick Carrasco',   pos:'DEF'},
      {n:6,  name:'Axel Witsel',        pos:'MID'},
      {n:8,  name:'Youri Tielemans',    pos:'MID'},
      {n:7,  name:'Kevin De Bruyne',    pos:'MID'},
      {n:10, name:'Eden Hazard',        pos:'FWD'},
      {n:9,  name:'Romelu Lukaku',      pos:'FWD'},
      {n:11, name:'Leandro Trossard',   pos:'FWD'},
    ]
  },

  'Egypt': {
    flag:'🇪🇬', code:'EGY', conf:'CAF', group:'G',
    coach:'Hossam Hassan',
    squad:[
      {n:1,  name:'Mohamed El-Shennawy', pos:'GK'},
      {n:10, name:'Mohamed Salah',      pos:'FWD', captain:true},
      {n:9,  name:'Omar Marmoush',      pos:'FWD'},
      {n:7,  name:'Trezeguet',          pos:'FWD'},
      {n:8,  name:'Tarek Hamed',        pos:'MID'},
    ]
  },

  'Iran': {
    flag:'🇮🇷', code:'IRN', conf:'AFC', group:'G',
    coach:'Amir Ghalenoei',
    squad:[
      {n:1,  name:'Alireza Beiranvand', pos:'GK'},
      {n:9,  name:'Sardar Azmoun',      pos:'FWD', captain:true},
      {n:10, name:'Ali Gholizadeh',     pos:'FWD'},
      {n:7,  name:'Mehdi Taremi',       pos:'FWD'},
      {n:8,  name:'Saeid Ezatolahi',    pos:'MID'},
    ]
  },

  'New Zealand': {
    flag:'🇳🇿', code:'NZL', conf:'OFC', group:'G',
    coach:'Darren Bazeley',
    squad:[
      {n:1,  name:'Oliver Sail',        pos:'GK'},
      {n:10, name:'Chris Wood',         pos:'FWD', captain:true},
      {n:7,  name:'Liberato Cacace',    pos:'DEF'},
      {n:9,  name:'Oli McEntee',        pos:'FWD'},
    ]
  },

  /* ── GROUP H ── */
  'Spain': {
    flag:'🇪🇸', code:'ESP', conf:'UEFA', group:'H',
    coach:'Luis de la Fuente',
    squad:[
      {n:1,  name:'Unai Simón',         pos:'GK'},
      {n:4,  name:'Aymeric Laporte',    pos:'DEF'},
      {n:3,  name:'Alejandro Balde',    pos:'DEF'},
      {n:2,  name:'Dani Carvajal',      pos:'DEF'},
      {n:5,  name:'Rodri',              pos:'MID', captain:true},
      {n:8,  name:'Pedri',              pos:'MID'},
      {n:6,  name:'Gavi',               pos:'MID'},
      {n:10, name:'Dani Olmo',          pos:'FWD'},
      {n:7,  name:'Lamine Yamal',       pos:'FWD'},
      {n:9,  name:'Álvaro Morata',      pos:'FWD'},
      {n:11, name:'Ferran Torres',      pos:'FWD'},
    ]
  },

  'Cape Verde': {
    flag:'🇨🇻', code:'CPV', conf:'CAF', group:'H',
    coach:'Bubista',
    squad:[
      {n:1,  name:'Vozinha',            pos:'GK'},
      {n:10, name:'Ryan Mendes',        pos:'FWD', captain:true},
      {n:9,  name:'Garry Rodrigues',    pos:'FWD'},
    ]
  },

  'Saudi Arabia': {
    flag:'🇸🇦', code:'KSA', conf:'AFC', group:'H',
    coach:'Roberto Mancini',
    squad:[
      {n:1,  name:'Mohammed Al-Owais', pos:'GK'},
      {n:10, name:'Salem Al-Dawsari',   pos:'FWD', captain:true},
      {n:9,  name:'Firas Al-Buraikan',  pos:'FWD'},
      {n:7,  name:'Sami Al-Najei',      pos:'MID'},
      {n:4,  name:'Ali Al-Bulaihi',     pos:'DEF'},
    ]
  },

  'Uruguay': {
    flag:'🇺🇾', code:'URU', conf:'CONMEBOL', group:'H',
    coach:'Marcelo Bielsa',
    squad:[
      {n:1,  name:'Sergio Rochet',      pos:'GK'},
      {n:3,  name:'Diego Godín',        pos:'DEF', captain:true},
      {n:4,  name:'Ronald Araújo',      pos:'DEF'},
      {n:8,  name:'Federico Valverde',  pos:'MID'},
      {n:10, name:'Giorgian De Arrascaeta', pos:'MID'},
      {n:9,  name:'Darwin Núñez',       pos:'FWD'},
      {n:11, name:'Luis Suárez',        pos:'FWD'},
      {n:7,  name:'Rodrigo Bentancur', pos:'MID'},
    ]
  },

  /* ── GROUP I ── */
  'France': {
    flag:'🇫🇷', code:'FRA', conf:'UEFA', group:'I',
    coach:'Didier Deschamps',
    squad:[
      {n:1,  name:'Mike Maignan',       pos:'GK'},
      {n:4,  name:'Raphaël Varane',     pos:'DEF'},
      {n:5,  name:'William Saliba',     pos:'DEF'},
      {n:3,  name:'Theo Hernández',     pos:'DEF'},
      {n:2,  name:'Benjamin Pavard',    pos:'DEF'},
      {n:8,  name:'Aurélien Tchouaméni', pos:'MID'},
      {n:6,  name:'Eduardo Camavinga',  pos:'MID'},
      {n:14, name:'Adrien Rabiot',      pos:'MID'},
      {n:10, name:'Kylian Mbappé',      pos:'FWD', captain:true},
      {n:7,  name:'Antoine Griezmann',  pos:'FWD'},
      {n:9,  name:'Olivier Giroud',     pos:'FWD'},
      {n:11, name:'Ousmane Dembélé',    pos:'FWD'},
    ]
  },

  'Senegal': {
    flag:'🇸🇳', code:'SEN', conf:'CAF', group:'I',
    coach:'Aliou Cissé',
    squad:[
      {n:1,  name:'Edouard Mendy',      pos:'GK'},
      {n:3,  name:'Kalidou Koulibaly',  pos:'DEF', captain:true},
      {n:5,  name:'Abdou Diallo',       pos:'DEF'},
      {n:8,  name:'Cheikhou Kouyaté',   pos:'MID'},
      {n:10, name:'Sadio Mané',         pos:'FWD'},
      {n:9,  name:'Boulaye Dia',        pos:'FWD'},
      {n:7,  name:'Ismaila Sarr',       pos:'FWD'},
    ]
  },

  'Iraq': {
    flag:'🇮🇶', code:'IRQ', conf:'AFC', group:'I',
    coach:'Jesús Casas',
    squad:[
      {n:1,  name:'Jalal Hassan',       pos:'GK'},
      {n:10, name:'Amjad Attwan',       pos:'MID'},
      {n:9,  name:'Aymen Hussein',      pos:'FWD', captain:true},
      {n:7,  name:'Mohanad Ali',        pos:'FWD'},
    ]
  },

  'Norway': {
    flag:'🇳🇴', code:'NOR', conf:'UEFA', group:'I',
    coach:'Ståle Solbakken',
    squad:[
      {n:1,  name:'Ørjan Nyland',       pos:'GK'},
      {n:9,  name:'Erling Haaland',     pos:'FWD', captain:true},
      {n:10, name:'Martin Ødegaard',    pos:'MID'},
      {n:7,  name:'Mohamed Elyounoussi', pos:'FWD'},
      {n:8,  name:'Sander Berge',       pos:'MID'},
      {n:4,  name:'Leo Skiri Østigård', pos:'DEF'},
    ]
  },

  /* ── GROUP J ── */
  'Argentina': {
    flag:'🇦🇷', code:'ARG', conf:'CONMEBOL', group:'J',
    coach:'Lionel Scaloni',
    squad:[
      {n:23, name:'Emiliano Martínez',  pos:'GK'},
      {n:13, name:'Cristian Romero',    pos:'DEF'},
      {n:6,  name:'Germán Pezzella',    pos:'DEF'},
      {n:3,  name:'Nicolás Tagliafico', pos:'DEF'},
      {n:2,  name:'Nahuel Molina',      pos:'DEF'},
      {n:5,  name:'Leandro Paredes',    pos:'MID'},
      {n:8,  name:'Marcos Acuña',       pos:'MID'},
      {n:7,  name:'Rodrigo De Paul',    pos:'MID'},
      {n:10, name:'Lionel Messi',       pos:'FWD', captain:true},
      {n:9,  name:'Julián Álvarez',     pos:'FWD'},
      {n:11, name:'Ángel Di María',     pos:'FWD'},
      {n:22, name:'Lautaro Martínez',   pos:'FWD'},
    ]
  },

  'Algeria': {
    flag:'🇩🇿', code:'ALG', conf:'CAF', group:'J',
    coach:'Vladimir Petković',
    squad:[
      {n:1,  name:'Raïs M\'Bolhi',      pos:'GK'},
      {n:10, name:'Riyad Mahrez',       pos:'FWD', captain:true},
      {n:9,  name:'Islam Slimani',      pos:'FWD'},
      {n:7,  name:'Youcef Atal',        pos:'DEF'},
      {n:8,  name:'Ismaël Bennacer',    pos:'MID'},
    ]
  },

  'Austria': {
    flag:'🇦🇹', code:'AUT', conf:'UEFA', group:'J',
    coach:'Ralf Rangnick',
    squad:[
      {n:1,  name:'Patrick Pentz',      pos:'GK'},
      {n:8,  name:'David Alaba',        pos:'DEF', captain:true},
      {n:10, name:'Marcel Sabitzer',    pos:'MID'},
      {n:9,  name:'Marko Arnautović',   pos:'FWD'},
      {n:7,  name:'Christoph Baumgartner', pos:'MID'},
      {n:11, name:'Michael Gregoritsch', pos:'FWD'},
    ]
  },

  'Jordan': {
    flag:'🇯🇴', code:'JOR', conf:'AFC', group:'J',
    coach:'Hussein Ammouta',
    squad:[
      {n:1,  name:'Yazeed Abo Laila',   pos:'GK'},
      {n:10, name:'Mousa Al-Taamari',   pos:'FWD', captain:true},
      {n:9,  name:'Baha\' Faisal',      pos:'FWD'},
    ]
  },

  /* ── GROUP K ── */
  'Portugal': {
    flag:'🇵🇹', code:'POR', conf:'UEFA', group:'K',
    coach:'Roberto Martínez',
    squad:[
      {n:1,  name:'Rui Patrício',       pos:'GK'},
      {n:5,  name:'Rúben Dias',         pos:'DEF'},
      {n:3,  name:'Nuno Mendes',        pos:'DEF'},
      {n:2,  name:'João Cancelo',       pos:'DEF'},
      {n:8,  name:'Bruno Fernandes',    pos:'MID'},
      {n:16, name:'Renato Sanches',     pos:'MID'},
      {n:10, name:'Bernardo Silva',     pos:'MID'},
      {n:7,  name:'Cristiano Ronaldo',  pos:'FWD', captain:true},
      {n:9,  name:'André Silva',        pos:'FWD'},
      {n:11, name:'Rafael Leão',        pos:'FWD'},
      {n:17, name:'Pedro Neto',         pos:'FWD'},
    ]
  },

  'DR Congo': {
    flag:'🇨🇩', code:'COD', conf:'CAF', group:'K',
    coach:'Sébastien Desabre',
    squad:[
      {n:1,  name:'Joël Kiassumbua',    pos:'GK'},
      {n:10, name:'Yannick Bolasie',    pos:'FWD'},
      {n:9,  name:'Cédric Bakambu',     pos:'FWD', captain:true},
      {n:7,  name:'Chancel Mbemba',     pos:'DEF'},
    ]
  },

  'Uzbekistan': {
    flag:'🇺🇿', code:'UZB', conf:'AFC', group:'K',
    coach:'Srecko Katanec',
    squad:[
      {n:1,  name:'Utkir Yusupov',      pos:'GK'},
      {n:10, name:'Eldor Shomurodov',   pos:'FWD', captain:true},
      {n:9,  name:'Dostonbek Khamdamov', pos:'FWD'},
      {n:7,  name:'Otabek Shukurov',    pos:'MID'},
    ]
  },

  'Colombia': {
    flag:'🇨🇴', code:'COL', conf:'CONMEBOL', group:'K',
    coach:'Néstor Lorenzo',
    squad:[
      {n:1,  name:'Camilo Vargas',      pos:'GK'},
      {n:3,  name:'Yerry Mina',         pos:'DEF'},
      {n:13, name:'Davinson Sánchez',   pos:'DEF'},
      {n:8,  name:'Wilmar Barrios',     pos:'MID'},
      {n:10, name:'James Rodríguez',    pos:'MID', captain:true},
      {n:7,  name:'Luis Díaz',          pos:'FWD'},
      {n:9,  name:'Falcao García',      pos:'FWD'},
      {n:11, name:'Rafael Santos Borré', pos:'FWD'},
    ]
  },

  /* ── GROUP L ── */
  'England': {
    flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', code:'ENG', conf:'UEFA', group:'L',
    coach:'Thomas Tuchel',
    squad:[
      {n:1,  name:'Jordan Pickford',    pos:'GK'},
      {n:5,  name:'John Stones',        pos:'DEF'},
      {n:6,  name:'Marc Guéhi',         pos:'DEF'},
      {n:3,  name:'Luke Shaw',          pos:'DEF'},
      {n:2,  name:'Trent Alexander-Arnold', pos:'DEF'},
      {n:4,  name:'Declan Rice',        pos:'MID'},
      {n:8,  name:'Jude Bellingham',    pos:'MID'},
      {n:10, name:'Bukayo Saka',        pos:'FWD'},
      {n:7,  name:'Jack Grealish',      pos:'FWD'},
      {n:9,  name:'Harry Kane',         pos:'FWD', captain:true},
      {n:20, name:'Ivan Toney',         pos:'FWD'},
      {n:11, name:'Eberechi Eze',       pos:'FWD'},
      {n:19, name:'Noni Madueke',       pos:'FWD'},
    ]
  },

  'Croatia': {
    flag:'🇭🇷', code:'CRO', conf:'UEFA', group:'L',
    coach:'Zlatko Dalić',
    squad:[
      {n:1,  name:'Dominik Livaković',  pos:'GK'},
      {n:6,  name:'Dejan Lovren',       pos:'DEF'},
      {n:3,  name:'Borna Sosa',         pos:'DEF'},
      {n:2,  name:'Josip Stanisić',     pos:'DEF'},
      {n:10, name:'Luka Modrić',        pos:'MID', captain:true},
      {n:4,  name:'Ivan Perišić',       pos:'FWD'},
      {n:7,  name:'Ante Budimir',       pos:'FWD'},
      {n:9,  name:'Andrej Kramarić',    pos:'FWD'},
      {n:8,  name:'Marcelo Brozović',   pos:'MID'},
      {n:11, name:'Mateo Kovačić',      pos:'MID'},
    ]
  },

  'Ghana': {
    flag:'🇬🇭', code:'GHA', conf:'CAF', group:'L',
    coach:'Otto Addo',
    squad:[
      {n:1,  name:'Lawrence Ati Zigi',  pos:'GK'},
      {n:5,  name:'Daniel Amartey',     pos:'DEF', captain:true},
      {n:3,  name:'Baba Rahman',        pos:'DEF'},
      {n:10, name:'Thomas Partey',      pos:'MID'},
      {n:9,  name:'Jordan Ayew',        pos:'FWD'},
      {n:7,  name:'Mohammed Kudus',     pos:'FWD'},
      {n:11, name:'Inaki Williams',     pos:'FWD'},
    ]
  },

  'Panama': {
    flag:'🇵🇦', code:'PAN', conf:'CONCACAF', group:'L',
    coach:'Thomas Christiansen',
    squad:[
      {n:1,  name:'Luis Mejía',         pos:'GK'},
      {n:9,  name:'Rolando Blackburn',  pos:'FWD'},
      {n:10, name:'Armando Cooper',     pos:'MID', captain:true},
      {n:7,  name:'Édgar Bárcenas',     pos:'FWD'},
      {n:5,  name:'Fidel Escobar',      pos:'DEF'},
    ]
  }

};
