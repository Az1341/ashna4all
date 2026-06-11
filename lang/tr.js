/**
 * GoalCurrent.live — Language File
 * Language : Turkish / Türkçe
 * Code     : tr  |  Direction: ltr
 */
window.GC_LANG = {
  meta: { code:'tr', name:'Türkçe', dir:'ltr', flag:'🇹🇷', locale:'tr_TR' },
  nav: {
    home:'Ana Sayfa', liveScores:'Canlı Sonuçlar', todayFixtures:'Bugünkü Maçlar',
    latestNews:'Son Haberler', fixtures:'Fikstür', standings:'Puan Durumu',
    teams:'Takımlar', news:'Haberler', results:'Sonuçlar', overview:'Genel Bakış',
    groups:'Gruplar', bracket:'Eleme Turu', venues:'Stadyumlar', table:'Puan Tablosu',
    myTeams:'Takımlarım', mainMenu:'Ana Menü', competitions:'Turnuvalar',
    worldCup:'Dünya Kupası 2026', premierLeague:'Premier Lig',
    championsLeague:'Şampiyonlar Ligi', countdown:'Geri Sayım'
  },
  live: {
    liveNow:'Canlı', finishedToday:'Bugün Bitti', upcoming:'Yaklaşan',
    noMatches:'Bugün maç yok', loading:'Yükleniyor…', failed:'Yüklenemedi',
    halfTime:'DY', halfTimeFull:'Devre Arası', fullTime:'MS', fullTimeFull:'Maç Sonu',
    extraTime:'UZ', penaltyShootout:'Pen.', matchStats:'Maç İstatistikleri',
    awaitingScore:'Sonuç Bekleniyor', postponed:'Ertelendi', cancelled:'İptal Edildi',
    abandoned:'Terk Edildi', tbd:'Belirsiz', kickOff:'Maç Başlangıcı', minute:'dk'
  },
  fixtures: {
    groupStage:'Grup Aşaması', roundOf16:'Son 16', quarterFinal:'Çeyrek Final',
    semiFinal:'Yarı Final', thirdPlace:'3. lük Maçı', final:'Final',
    kickOff:'Maç Başlangıcı', venue:'Stadyum', broadcaster:'Yayıncı',
    noFixtures:'Fikstür mevcut değil', allFixtures:'Tüm 104 maçı görüntüle',
    filter:'Filtrele', allGroups:'Tüm Gruplar'
  },
  standings: {
    pos:'Sır', team:'Takım', played:'O', won:'G', drawn:'B', lost:'M',
    goalsFor:'A', goalsAgainst:'Y', goalDiff:'Av', points:'P',
    form:'Form', qualified:'Elendi', eliminated:'Elendi', title:'Puan Durumu', groupTitle:'Grup'
  },
  countdown: {
    days:'Gün', hours:'Saat', minutes:'Dakika', seconds:'Saniye',
    untilKickoff:'Dünya Kupası 2026\'ya Kalan', tournamentLive:'Turnuva Başladı!',
    nextMatch     : 'Sonraki maça kalan',
    opens:'Başlıyor', hosts:'Ev Sahipleri', teams:'Takım', matches:'Maç',
    venues:'Stadyum', daysLeft:'Gün Kaldı'
  },
  buttons: {
    viewMatch:'Maçı Görüntüle', predict:'Skor Tahmin Et', addFavourite:'Favorilere Ekle',
    removeFavourite:'Kaldır', readMore:'Devamını Oku', subscribe:'Abone Ol',
    accept:'Kabul Et ✓', reject:'Reddet', close:'Kapat ✕', viewAll:'Tümünü Gör',
    backToTop:'Yukarı Çık', share:'Paylaş', copyLink:'Bağlantıyı Kopyala', wcHub:'DK2026 Merkezi →'
  },
  news: {
    breaking:'Son Dakika', latest:'Son Haberler', by:'GoalCurrent tarafından',
    noNews:'Haber bulunamadı', loadMore:'Daha Fazla Yükle',
    published:'Yayınlandı', updated:'Güncellendi', relatedNews:'İlgili Haberler'
  },
  cookie: {
    message:'İçeriği kişiselleştirmek ve trafiği analiz etmek için çerezler kullanıyoruz.',
    learnMore:'Çerez Politikası', accept:'Kabul Et ✓', reject:'Reddet'
  },
  subscribe: {
    title:'⚽ Haberdar Olun',
    subtitle:'Dünya Kupası 2026 golleri, sonuçları ve haberleri doğrudan gelen kutunuza gelsin.',
    placeholder:'E-posta adresinizi girin', button:'Ücretsiz Abone Ol ✉️', noThanks:'✕',
    footer:'İstediğiniz zaman abonelikten çıkın · Brevo tarafından desteklenmektedir'
  },
  favourites: {
    myTeams:'Takımlarım', addTeam:'Takım Ekle', removeTeam:'Kaldır',
    noFavourites:'Henüz favori takım yok', tapToAdd:'Eklemek için herhangi bir takımda ★ tuşuna basın',
    yourFavourites:'Favorileriniz'
  },
  venues: {
    capacity:'Kapasite', city:'Şehir', country:'Ev Sahibi Ülke', stadium:'Stadyum',
    surface:'Zemin', opened:'Açılış', grass:'Doğal Çim', turf:'Suni Çim'
  },
  teams: {
    squad:'Kadro', coach:'Teknik Direktör', group:'Grup', ranking:'FIFA Sıralaması',
    titles:'Dünya Kupası Şampiyonlukları', allTeams:'Tüm Takımlar', searchTeam:'Takım ara…'
  },
  bracket: {
    winner:'Kazanan', tbd:'Belirsiz', groupWinner:'Grup Birincisi',
    runnerUp:'Grup İkincisi', title:'Eleme Turu'
  },
  errors: {
    loading:'Yükleniyor…', failed:'Veriler yüklenemedi.',
    noData:'Veri mevcut değil.', tryAgain:'Lütfen tekrar deneyin.',
    offline:'Çevrimdışı görünüyorsunuz.', apiError:'Veriler geçici olarak kullanılamıyor.'
  },
  langSelector: { label:'Dil', ariaLabel:'Dil seçin' },

  // ── HOMEPAGE SPECIFIC ─────────────────────────────────────────────────────
  gc: {
    headerSub         : 'Canlı Sonuçlar · Dünya Kupası 2026 · Haberler',
    liveMatchCentre   : 'Canlı Maç Merkezi',
    upcomingMatches   : 'YAKLAŞAN MAÇLAR — DÜNYA KUPASI 2026',
    openingCeremonies : 'Dünya Kupası 2026 Açılış Törenleri',
    matchPreviews     : 'Resmi FIFA Maç Önizlemeleri',
    video1Desc        : 'Resmi FIFA Dünya Kupası 2026 maç önizlemesi. Meksika, A Grubu'nda evinde Güney Afrika'ya karşı turnuvayı açıyor.',
    video2Desc        : 'Resmi FIFA Dünya Kupası 2026 maç önizlemesi. Güney Kore, A Grubu'nda Çekya ile karşılaşıyor.'
  },

  seo: {
    pages: {
      home:{ title:'GoalCurrent.live — Dünya Kupası 2026 | Canlı Sonuçlar',
             desc :'Dünya Kupası 2026 canlı sonuçları, fikstür ve haberleri.' },
      live:{ title:'Canlı Sonuçlar | Dünya Kupası 2026 | GoalCurrent.live',
             desc :'Dünya Kupası 2026 sonuçları anlık güncelleniyor.' },
      news:{ title:'Futbol Haberleri | GoalCurrent.live',
             desc :'Son futbol haberleri — Dünya Kupası 2026, Premier Lig ve Şampiyonlar Ligi.' }
    }
  }
};
