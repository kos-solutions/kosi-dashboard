// lib/translations.ts

export type Language = 'en' | 'ro' | 'tr' | 'sr' | 'hr' | 'bg' | 'el' | 'sq';

export const translations = {
  // 🇬🇧 English
  en: {
    sidebar: {
      dashboard: "Dashboard",
      voiceLab: "Voice Lab",
      pairing: "Pairing",
      settings: "Settings",
      signOut: "Sign Out"
    },
    header: {
      hello: "Hello, Parent!",
      subtitle: "Here is what {child} did today.",
      online: "Kosi is Online",
      offline: "Kosi is Offline"
    },
    stats: {
      stories: "Stories",
      drawings: "Drawings",
      games: "Games",
      activeTime: "Active Time"
    },
    gallery: {
      title: "Today's Gallery",
      noDrawings: "No drawings today"
    },
    activity: {
      recent: "Recent Activity",
      waiting: "Waiting for adventure...",
    }
  },

  // 🇷🇴 Română
  ro: {
    sidebar: {
      dashboard: "Panou Control",
      voiceLab: "Laborator Voce",
      pairing: "Conectare",
      settings: "Setări",
      signOut: "Ieșire"
    },
    header: {
      hello: "Salut, Părinte!",
      subtitle: "Iată ce a făcut {child} astăzi.",
      online: "Kosi e Online",
      offline: "Kosi e Offline"
    },
    stats: {
      stories: "Povești",
      drawings: "Desene",
      games: "Jocuri",
      activeTime: "Timp Activ"
    },
    gallery: {
      title: "Galeria de Azi",
      noDrawings: "Niciun desen azi"
    },
    activity: {
      recent: "Activitate Recentă",
      waiting: "Așteptăm prima aventură...",
    }
  },

  // 🇹🇷 Türkçe (Turcă)
  tr: {
    sidebar: {
      dashboard: "Kontrol Paneli",
      voiceLab: "Ses Laboratuvarı",
      pairing: "Eşleştirme",
      settings: "Ayarlar",
      signOut: "Çıkış Yap"
    },
    header: {
      hello: "Merhaba, Ebeveyn!",
      subtitle: "{child} bugün bunları yaptı.",
      online: "Kosi Çevrimiçi",
      offline: "Kosi Çevrimdışı"
    },
    stats: {
      stories: "Hikayeler",
      drawings: "Çizimler",
      games: "Oyunlar",
      activeTime: "Aktif Süre"
    },
    gallery: {
      title: "Bugünün Galerisi",
      noDrawings: "Bugün çizim yok"
    },
    activity: {
      recent: "Son Aktiviteler",
      waiting: "İlk macera bekleniyor...",
    }
  },

  // 🇷🇸 Srpski (Sârbă)
  sr: {
    sidebar: {
      dashboard: "Kontrolna Tabla",
      voiceLab: "Glasovni Lab",
      pairing: "Uparivanje",
      settings: "Podešavanja",
      signOut: "Odjavi se"
    },
    header: {
      hello: "Zdravo, Roditelju!",
      subtitle: "Evo šta je {child} radio danas.",
      online: "Kosi je na mreži",
      offline: "Kosi je van mreže"
    },
    stats: {
      stories: "Priče",
      drawings: "Crteži",
      games: "Igre",
      activeTime: "Aktivno Vreme"
    },
    gallery: {
      title: "Današnja Galerija",
      noDrawings: "Nema crteža danas"
    },
    activity: {
      recent: "Nedavna Aktivnost",
      waiting: "Čekamo prvu avanturu...",
    }
  },

  // 🇭🇷 Hrvatski (Croată)
  hr: {
    sidebar: {
      dashboard: "Nadzorna Ploča",
      voiceLab: "Glasovni Lab",
      pairing: "Uparivanje",
      settings: "Postavke",
      signOut: "Odjava"
    },
    header: {
      hello: "Pozdrav, Roditelju!",
      subtitle: "Evo što je {child} radio danas.",
      online: "Kosi je online",
      offline: "Kosi je offline"
    },
    stats: {
      stories: "Priče",
      drawings: "Crteži",
      games: "Igre",
      activeTime: "Aktivno Vrijeme"
    },
    gallery: {
      title: "Današnja Galerija",
      noDrawings: "Nema crteža danas"
    },
    activity: {
      recent: "Nedavna Aktivnost",
      waiting: "Čekamo prvu avanturu...",
    }
  },

  // 🇧🇬 Български (Bulgară)
  bg: {
    sidebar: {
      dashboard: "Табло",
      voiceLab: "Гласова Лаб",
      pairing: "Сдвояване",
      settings: "Настройки",
      signOut: "Изход"
    },
    header: {
      hello: "Здравей, Родителю!",
      subtitle: "Ето какво прави {child} днес.",
      online: "Kosi е На линия",
      offline: "Kosi е Офлайн"
    },
    stats: {
      stories: "Приказки",
      drawings: "Рисунки",
      games: "Игри",
      activeTime: "Активно Време"
    },
    gallery: {
      title: "Галерия днес",
      noDrawings: "Няма рисунки днес"
    },
    activity: {
      recent: "Последна Активност",
      waiting: "Чакаме първото приключение...",
    }
  },

  // 🇬🇷 Ελληνικά (Greacă)
  el: {
    sidebar: {
      dashboard: "Ταμπλό",
      voiceLab: "Εργαστήριο Φωνής",
      pairing: "Σύζευξη",
      settings: "Ρυθμίσεις",
      signOut: "Έξοδος"
    },
    header: {
      hello: "Γεια σου, Γονιέ!",
      subtitle: "Δείτε τι έκανε το παιδί σήμερα.", // {child} e greu de integrat natural aici fără declinare, am simplificat
      online: "Kosi Online",
      offline: "Kosi Offline"
    },
    stats: {
      stories: "Ιστορίες",
      drawings: "Σχέδια",
      games: "Παιχνίδια",
      activeTime: "Ενεργός Χρόνος"
    },
    gallery: {
      title: "Σημερινή Συλλογή",
      noDrawings: "Κανένα σχέδιο σήμερα"
    },
    activity: {
      recent: "Πρόσφατη Δραστηριότητα",
      waiting: "Περιμένουμε την πρώτη περιπέτεια...",
    }
  },

  // 🇦🇱 Shqip (Albaneză)
  sq: {
    sidebar: {
      dashboard: "Paneli",
      voiceLab: "Lab Zëri",
      pairing: "Lidhja",
      settings: "Cilësimet",
      signOut: "Dil"
    },
    header: {
      hello: "Përshëndetje, Prind!",
      subtitle: "Ja çfarë bëri {child} sot.",
      online: "Kosi është Online",
      offline: "Kosi është Jashtë linje"
    },
    stats: {
      stories: "Përralla",
      drawings: "Vizatime",
      games: "Lojëra",
      activeTime: "Koha Aktive"
    },
    gallery: {
      title: "Galeria e Sotme",
      noDrawings: "Asnjë vizatim sot"
    },
    activity: {
      recent: "Aktiviteti i Fundit",
      waiting: "Duke pritur aventurën e parë...",
    }
  }
};