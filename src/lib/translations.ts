// lib/translations.ts

export type Language = 'en' | 'ro' | 'tr' | 'sr' | 'hr' | 'bg' | 'el' | 'sq';

export const translations = {
  // 🇬🇧 English
  en: {
    sidebar: { dashboard: "Dashboard", voiceLab: "Voice Lab", pairing: "Pairing", settings: "Settings", signOut: "Sign Out" },
    header: { hello: "Hello, Parent!", subtitle: "Here is what {child} did today.", online: "Kosi is Online", offline: "Kosi is Offline" },
    stats: { stories: "Stories", drawings: "Drawings", games: "Games", activeTime: "Active Time" },
    gallery: { title: "Today's Gallery", noDrawings: "No drawings today" },
    controls: { title: "Quick Controls", stop: "Stop All", greet: "Say Hello", light: "Light", sleep: "Sleep Mode" },
    activity: {
      title: "Live Activity", recent: "Recent Activity", waiting: "Waiting for adventure...",
      types: { story: "Story", draw: "Drawing", music: "Music", game: "Game", default: "Activity" }
    },
    pairing: { title: "Connect Device", instruction: "Enter the code displayed on your phone app:", placeholder: "Ex: 123456", button: "Connect", success: "Connected successfully!", error: "Invalid code" },
    settings: { title: "Settings", childName: "Child Name", save: "Save Changes", language: "Dashboard Language", device: "Connected Device" },
    voiceLab: { title: "Voice Lab", subtitle: "Clone your voice for stories", record: "Record Sample", stop: "Stop Recording", save: "Save Voice", status: "Ready to record" }
  },

  // 🇷🇴 Română
  ro: {
    sidebar: { dashboard: "Panou Control", voiceLab: "Laborator Voce", pairing: "Conectare", settings: "Setări", signOut: "Ieșire" },
    header: { hello: "Salut, Părinte!", subtitle: "Iată ce a făcut {child} astăzi.", online: "Kosi e Online", offline: "Kosi e Offline" },
    stats: { stories: "Povești", drawings: "Desene", games: "Jocuri", activeTime: "Timp Activ" },
    gallery: { title: "Galeria de Azi", noDrawings: "Niciun desen azi" },
    controls: { title: "Comenzi Rapide", stop: "Stop Tot", greet: "Salută", light: "Lumină", sleep: "Mod Somn" },
    activity: {
      title: "Activitate Live", recent: "Activitate Recentă", waiting: "Așteptăm prima aventură...",
      types: { story: "Poveste", draw: "Desen", music: "Muzică", game: "Joc", default: "Activitate" }
    },
    pairing: { title: "Conectare Dispozitiv", instruction: "Introdu codul afișat în aplicația de pe telefon:", placeholder: "Ex: 123456", button: "Conectează", success: "Conectat cu succes!", error: "Cod invalid" },
    settings: { title: "Setări", childName: "Nume Copil", save: "Salvează", language: "Limbă Dashboard", device: "Dispozitiv Conectat" },
    voiceLab: { title: "Laborator Voce", subtitle: "Clonează vocea pentru povești", record: "Înregistrează", stop: "Stop", save: "Salvează Vocea", status: "Pregătit" }
  },

  // 🇹🇷 Türkçe
  tr: {
    sidebar: { dashboard: "Kontrol Paneli", voiceLab: "Ses Laboratuvarı", pairing: "Eşleştirme", settings: "Ayarlar", signOut: "Çıkış Yap" },
    header: { hello: "Merhaba, Ebeveyn!", subtitle: "{child} bugün bunları yaptı.", online: "Kosi Çevrimiçi", offline: "Kosi Çevrimdışı" },
    stats: { stories: "Hikayeler", drawings: "Çizimler", games: "Oyunlar", activeTime: "Aktif Süre" },
    gallery: { title: "Bugünün Galerisi", noDrawings: "Bugün çizim yok" },
    controls: { title: "Hızlı Kontroller", stop: "Durdur", greet: "Merhaba De", light: "Işık", sleep: "Uyku Modu" },
    activity: {
      title: "Canlı Aktivite", recent: "Son Aktiviteler", waiting: "İlk macera bekleniyor...",
      types: { story: "Hikaye", draw: "Çizim", music: "Müzik", game: "Oyun", default: "Aktivite" }
    },
    pairing: { title: "Cihaz Eşleştirme", instruction: "Telefondaki uygulamada gösterilen kodu girin:", placeholder: "Ör: 123456", button: "Bağlan", success: "Başarıyla bağlandı!", error: "Geçersiz kod" },
    settings: { title: "Ayarlar", childName: "Çocuk İsmi", save: "Kaydet", language: "Panel Dili", device: "Bağlı Cihaz" },
    voiceLab: { title: "Ses Laboratuvarı", subtitle: "Hikayeler için sesini kopyala", record: "Kaydet", stop: "Durdur", save: "Sesi Kaydet", status: "Hazır" }
  },

  // 🇷🇸 Srpski
  sr: {
    sidebar: { dashboard: "Kontrolna Tabla", voiceLab: "Glasovni Lab", pairing: "Uparivanje", settings: "Podešavanja", signOut: "Odjavi se" },
    header: { hello: "Zdravo, Roditelju!", subtitle: "Evo šta je {child} radio danas.", online: "Kosi je na mreži", offline: "Kosi je van mreže" },
    stats: { stories: "Priče", drawings: "Crteži", games: "Igre", activeTime: "Aktivno Vreme" },
    gallery: { title: "Današnja Galerija", noDrawings: "Nema crteža danas" },
    controls: { title: "Brze Komande", stop: "Stop", greet: "Pozdravi", light: "Svetlo", sleep: "Spavanje" },
    activity: {
      title: "Aktivnost Uživo", recent: "Nedavna Aktivnost", waiting: "Čekamo prvu avanturu...",
      types: { story: "Priča", draw: "Crtež", music: "Muzika", game: "Igra", default: "Aktivnost" }
    },
    pairing: { title: "Poveži Uređaj", instruction: "Unesite kod iz aplikacije:", placeholder: "Npr: 123456", button: "Poveži", success: "Uspešno povezano!", error: "Nevažeći kod" },
    settings: { title: "Podešavanja", childName: "Ime Deteta", save: "Sačuvaj", language: "Jezik Table", device: "Povezan Uređaj" },
    voiceLab: { title: "Glasovni Lab", subtitle: "Kloniraj glas za priče", record: "Snimi", stop: "Stop", save: "Sačuvaj Glas", status: "Spremno" }
  },

  // 🇭🇷 Hrvatski
  hr: {
    sidebar: { dashboard: "Nadzorna Ploča", voiceLab: "Glasovni Lab", pairing: "Uparivanje", settings: "Postavke", signOut: "Odjava" },
    header: { hello: "Pozdrav, Roditelju!", subtitle: "Evo što je {child} radio danas.", online: "Kosi je online", offline: "Kosi je offline" },
    stats: { stories: "Priče", drawings: "Crteži", games: "Igre", activeTime: "Aktivno Vrijeme" },
    gallery: { title: "Današnja Galerija", noDrawings: "Nema crteža danas" },
    controls: { title: "Brze Naredbe", stop: "Stop", greet: "Pozdravi", light: "Svjetlo", sleep: "Spavanje" },
    activity: {
      title: "Aktivnost Uživo", recent: "Nedavna Aktivnost", waiting: "Čekamo prvu avanturu...",
      types: { story: "Priča", draw: "Crtež", music: "Glazba", game: "Igra", default: "Aktivnost" }
    },
    pairing: { title: "Poveži Uređaj", instruction: "Unesite kod iz aplikacije:", placeholder: "Npr: 123456", button: "Poveži", success: "Uspješno povezano!", error: "Neispravan kod" },
    settings: { title: "Postavke", childName: "Ime Djeteta", save: "Spremi", language: "Jezik Ploče", device: "Povezan Uređaj" },
    voiceLab: { title: "Glasovni Lab", subtitle: "Kloniraj glas za priče", record: "Snimi", stop: "Stop", save: "Spremi Glas", status: "Spremno" }
  },

  // 🇧🇬 Български
  bg: {
    sidebar: { dashboard: "Табло", voiceLab: "Гласова Лаб", pairing: "Сдвояване", settings: "Настройки", signOut: "Изход" },
    header: { hello: "Здравей, Родителю!", subtitle: "Ето какво прави {child} днес.", online: "Kosi е На линия", offline: "Kosi е Офлайн" },
    stats: { stories: "Приказки", drawings: "Рисунки", games: "Игри", activeTime: "Активно Време" },
    gallery: { title: "Галерия днес", noDrawings: "Няма рисунки днес" },
    controls: { title: "Бързи Команди", stop: "Стоп", greet: "Поздрави", light: "Светлина", sleep: "Сън" },
    activity: {
      title: "Активност на живо", recent: "Последна Активност", waiting: "Чакаме първото приключение...",
      types: { story: "Приказка", draw: "Рисунка", music: "Музика", game: "Игра", default: "Активност" }
    },
    pairing: { title: "Свързване", instruction: "Въведете кода от приложението:", placeholder: "Пр: 123456", button: "Свържи", success: "Успешно свързване!", error: "Невалиден код" },
    settings: { title: "Настройки", childName: "Име на детето", save: "Запази", language: "Език на таблото", device: "Свързано устройство" },
    voiceLab: { title: "Гласова Лаборатория", subtitle: "Клонирай гласа си", record: "Запис", stop: "Стоп", save: "Запази", status: "Готово" }
  },

  // 🇬🇷 Ελληνικά
  el: {
    sidebar: { dashboard: "Ταμπλό", voiceLab: "Εργαστήριο Φωνής", pairing: "Σύζευξη", settings: "Ρυθμίσεις", signOut: "Έξοδος" },
    header: { hello: "Γεια σου, Γονιέ!", subtitle: "Δείτε τι έκανε το παιδί σήμερα.", online: "Kosi Online", offline: "Kosi Offline" },
    stats: { stories: "Ιστορίες", drawings: "Σχέδια", games: "Παιχνίδια", activeTime: "Ενεργός Χρόνος" },
    gallery: { title: "Σημερινή Συλλογή", noDrawings: "Κανένα σχέδιο σήμερα" },
    controls: { title: "Γρήγορες Εντολές", stop: "Στοπ", greet: "Χαιρετισμός", light: "Φως", sleep: "Ύπνος" },
    activity: {
      title: "Ζωντανή Δραστηριότητα", recent: "Πρόσφατη Δραστηριότητα", waiting: "Περιμένουμε την πρώτη περιπέτεια...",
      types: { story: "Ιστορία", draw: "Σχέδιο", music: "Μουσική", game: "Παιχνίδι", default: "Δραστηριότητα" }
    },
    pairing: { title: "Σύνδεση Συσκευής", instruction: "Εισάγετε τον κωδικό από την εφαρμογή:", placeholder: "Πχ: 123456", button: "Σύνδεση", success: "Συνδέθηκε επιτυχώς!", error: "Άκυρος κωδικός" },
    settings: { title: "Ρυθμίσεις", childName: "Όνομα Παιδιού", save: "Αποθήκευση", language: "Γλώσσα", device: "Συσκευή" },
    voiceLab: { title: "Εργαστήριο Φωνής", subtitle: "Κλωνοποίηση φωνής", record: "Εγγραφή", stop: "Στοπ", save: "Αποθήκευση", status: "Έτοιμο" }
  },

  // 🇦🇱 Shqip
  sq: {
    sidebar: { dashboard: "Paneli", voiceLab: "Lab Zëri", pairing: "Lidhja", settings: "Cilësimet", signOut: "Dil" },
    header: { hello: "Përshëndetje, Prind!", subtitle: "Ja çfarë bëri {child} sot.", online: "Kosi është Online", offline: "Kosi është Jashtë linje" },
    stats: { stories: "Përralla", drawings: "Vizatime", games: "Lojëra", activeTime: "Koha Aktive" },
    gallery: { title: "Galeria e Sotme", noDrawings: "Asnjë vizatim sot" },
    controls: { title: "Komanda të Shpejta", stop: "Ndal", greet: "Përshëndet", light: "Drita", sleep: "Gjumi" },
    activity: {
      title: "Aktiviteti Live", recent: "Aktiviteti i Fundit", waiting: "Duke pritur aventurën e parë...",
      types: { story: "Përrallë", draw: "Vizatim", music: "Muzikë", game: "Lojë", default: "Aktivitet" }
    },
    pairing: { title: "Lidh Pajisjen", instruction: "Shkruani kodin nga aplikacioni:", placeholder: "P.sh: 123456", button: "Lidh", success: "Lidhur me sukses!", error: "Kod i pavlefshëm" },
    settings: { title: "Cilësimet", childName: "Emri i Fëmijës", save: "Ruaj", language: "Gjuha e Panelit", device: "Pajisja e Lidhur" },
    voiceLab: { title: "Laboratori i Zërit", subtitle: "Klono zërin tënd", record: "Regjistro", stop: "Ndal", save: "Ruaj Zërin", status: "Gati" }
  }
};