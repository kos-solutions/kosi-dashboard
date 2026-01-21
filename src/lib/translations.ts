// lib/translations.ts

export type Language = 'en' | 'ro' | 'tr' | 'sr' | 'hr' | 'bg' | 'el' | 'sq';

export const translations = {
  // 🇬🇧 English
  en: {
    sidebar: { dashboard: "Dashboard", voiceLab: "Voice Lab", pairing: "Pairing", settings: "Settings", signOut: "Sign Out" },
    header: { hello: "Hello, Parent!", subtitle: "Here is what {child} did today.", online: "Kosi is Online", offline: "Kosi is Offline" },
    voiceCloneCard: {
        title: "Parent Voice (AI)",
        subtitle: "Kosi will sound exactly like you",
        active: "Voice active and ready for stories!",
        inactive: "Record 60 seconds of your voice to create a magic experience.",
        btnStart: "Start Cloning",
        btnManage: "Manage Voice"
    },
    activitySummary: {
        title: "Activity – Today",
        minutes: "minutes",
        sessions: "sessions",
        alerts: "alerts",
        loading: "Loading stats...",
        footer: "Quiet day, no sensitive events."
    },
    pairing: { 
        title: "Connect Device", 
        step1: "1. Open the Kosi App on your phone.", 
        step2: "2. Long press the KOSI LOGO (top-left) for 5 seconds.",
        step3: "3. Enter the generated code here:", 
        placeholder: "Ex: KOSI-1234", 
        button: "Connect", 
        success: "Connected successfully!", 
        error: "Invalid code" 
    },
    settings: { 
        title: "Settings", 
        childName: "Child Name", 
        save: "Save Changes", 
        language: "Dashboard Language", 
        device: "Connected Device",
        dangerZone: "Danger Zone",
        deleteData: "Delete Activity Data",
        deleteWarning: "This will wipe all history and drawings. Cannot be undone.",
        confirm: "Are you sure you want to delete all data?",
        deleted: "Data cleared successfully."
    },
    voiceLabPage: {
        back: "Back to Dashboard",
        title: "Voice Lab 🎤",
        subtitle: "Record your voice to read magic stories to your child.",
        readAloud: "Read this aloud:",
        storyText: "Once upon a time, in a magic land where clouds were made of cotton candy, Kosi the little explorer walked every day through the emerald forest to learn new things about friendship and courage...",
        recording: "Recording...",
        success: "Recording complete!",
        delete: "Delete & Retry",
        cloneBtn: "Clone Voice",
        processing: "Processing..."
    },
    stats: { stories: "Stories", drawings: "Drawings", games: "Games", activeTime: "Active Time" },
    gallery: { title: "Today's Gallery", noDrawings: "No drawings today" },
    controls: { title: "Quick Controls", stop: "Stop All", greet: "Say Hello", light: "Light", sleep: "Sleep Mode" },
    activity: { title: "Live Activity", recent: "Recent Activity", waiting: "Waiting for adventure...", types: { story: "Story", draw: "Drawing", music: "Music", game: "Game", default: "Activity" } }
  },

  // 🇷🇴 Română
  ro: {
    sidebar: { dashboard: "Panou Control", voiceLab: "Laborator Voce", pairing: "Conectare", settings: "Setări", signOut: "Ieșire" },
    header: { hello: "Salut, Părinte!", subtitle: "Iată ce a făcut {child} astăzi.", online: "Kosi e Online", offline: "Kosi e Offline" },
    voiceCloneCard: {
        title: "Vocea Părintelui (AI)",
        subtitle: "Kosi va suna exact ca tine",
        active: "Voce activă și gata de povești!",
        inactive: "Înregistrează 60 de secunde din vocea ta pentru a crea o experiență magică.",
        btnStart: "Începe Clonarea",
        btnManage: "Gestionează Vocea"
    },
    activitySummary: {
        title: "Activitate – Astăzi",
        minutes: "minute",
        sessions: "sesiuni",
        alerts: "alerte",
        loading: "Se încarcă...",
        footer: "Zi liniștită, fără evenimente sensibile."
    },
    pairing: { 
        title: "Conectare Dispozitiv", 
        step1: "1. Deschide Aplicația Kosi pe telefon.", 
        step2: "2. Ține apăsat pe LOGO-UL KOSI (stânga-sus) timp de 5 secunde.",
        step3: "3. Introdu codul generat aici:", 
        placeholder: "Ex: KOSI-1234", 
        button: "Conectează", 
        success: "Conectat cu succes!", 
        error: "Cod invalid" 
    },
    settings: { 
        title: "Setări", 
        childName: "Nume Copil", 
        save: "Salvează", 
        language: "Limbă Dashboard", 
        device: "Dispozitiv Conectat",
        dangerZone: "Zona de Pericol",
        deleteData: "Șterge Datele de Activitate",
        deleteWarning: "Asta va șterge tot istoricul și desenele. Nu se poate anula.",
        confirm: "Ești sigur că vrei să ștergi tot?",
        deleted: "Date șterse cu succes."
    },
    voiceLabPage: {
        back: "Înapoi la Dashboard",
        title: "Laborator Voce 🎤",
        subtitle: "Înregistrează-ți vocea pentru a-i citi copilului tău povești magice.",
        readAloud: "Citește cu voce tare:",
        storyText: "Era odată ca niciodată, un tărâm magic unde norii erau făcuți din vată de zahăr. Kosi, micul robot explorator, mergea în fiecare zi prin pădurea de smarald pentru a învăța lucruri noi despre prietenie și curaj...",
        recording: "Se înregistrează...",
        success: "Înregistrare finalizată!",
        delete: "Șterge și refă",
        cloneBtn: "Clonează Vocea",
        processing: "Se procesează..."
    },
    stats: { stories: "Povești", drawings: "Desene", games: "Jocuri", activeTime: "Timp Activ" },
    gallery: { title: "Galeria de Azi", noDrawings: "Niciun desen azi" },
    controls: { title: "Comenzi Rapide", stop: "Stop Tot", greet: "Salută", light: "Lumină", sleep: "Mod Somn" },
    activity: { title: "Activitate Live", recent: "Activitate Recentă", waiting: "Așteptăm prima aventură...", types: { story: "Poveste", draw: "Desen", music: "Muzică", game: "Joc", default: "Activitate" } }
  },

  // 🇹🇷 Türkçe
  tr: {
    sidebar: { dashboard: "Kontrol Paneli", voiceLab: "Ses Laboratuvarı", pairing: "Eşleştirme", settings: "Ayarlar", signOut: "Çıkış Yap" },
    header: { hello: "Merhaba, Ebeveyn!", subtitle: "{child} bugün bunları yaptı.", online: "Kosi Çevrimiçi", offline: "Kosi Çevrimdışı" },
    voiceCloneCard: {
        title: "Ebeveyn Sesi (AI)",
        subtitle: "Kosi tıpkı senin gibi konuşacak",
        active: "Ses aktif ve masallara hazır!",
        inactive: "Sihirli bir deneyim için sesini 60 saniye boyunca kaydet.",
        btnStart: "Klonlamayı Başlat",
        btnManage: "Sesi Yönet"
    },
    activitySummary: {
        title: "Aktivite – Bugün",
        minutes: "dakika",
        sessions: "oturum",
        alerts: "uyarı",
        loading: "Yükleniyor...",
        footer: "Sakin bir gün, hassas olay yok."
    },
    pairing: { 
        title: "Cihaz Eşleştirme", 
        step1: "1. Telefonunuzdaki Kosi Uygulamasını açın.", 
        step2: "2. KOSI LOGOSUNA (sol üst) 5 saniye boyunca basılı tutun.",
        step3: "3. Oluşturulan kodu buraya girin:", 
        placeholder: "Ör: KOSI-1234", 
        button: "Bağlan", 
        success: "Başarıyla bağlandı!", 
        error: "Geçersiz kod" 
    },
    settings: { 
        title: "Ayarlar", 
        childName: "Çocuk İsmi", 
        save: "Kaydet", 
        language: "Panel Dili", 
        device: "Bağlı Cihaz",
        dangerZone: "Tehlike Bölgesi",
        deleteData: "Aktivite Verilerini Sil",
        deleteWarning: "Bu işlem tüm geçmişi ve çizimleri siler. Geri alınamaz.",
        confirm: "Tüm verileri silmek istediğinize emin misiniz?",
        deleted: "Veriler başarıyla silindi."
    },
    voiceLabPage: {
        back: "Panele Dön",
        title: "Ses Laboratuvarı 🎤",
        subtitle: "Çocuğuna sihirli masallar okumak için sesini kaydet.",
        readAloud: "Bunu sesli oku:",
        storyText: "Bir zamanlar, bulutların pamuk şekerden yapıldığı sihirli bir diyar vardı. Küçük robot kaşif Kosi, arkadaşlık ve cesaret hakkında yeni şeyler öğrenmek için her gün zümrüt ormanında yürürdü...",
        recording: "Kaydediliyor...",
        success: "Kayıt tamamlandı!",
        delete: "Sil ve Tekrarla",
        cloneBtn: "Sesi Klonla",
        processing: "İşleniyor..."
    },
    stats: { stories: "Hikayeler", drawings: "Çizimler", games: "Oyunlar", activeTime: "Aktif Süre" },
    gallery: { title: "Bugünün Galerisi", noDrawings: "Bugün çizim yok" },
    controls: { title: "Hızlı Kontroller", stop: "Durdur", greet: "Merhaba De", light: "Işık", sleep: "Uyku Modu" },
    activity: { title: "Canlı Aktivite", recent: "Son Aktiviteler", waiting: "İlk macera bekleniyor...", types: { story: "Hikaye", draw: "Çizim", music: "Müzik", game: "Oyun", default: "Aktivite" } }
  },

  // 🇷🇸 Srpski
  sr: {
    sidebar: { dashboard: "Kontrolna Tabla", voiceLab: "Glasovni Lab", pairing: "Uparivanje", settings: "Podešavanja", signOut: "Odjavi se" },
    header: { hello: "Zdravo, Roditelju!", subtitle: "Evo šta je {child} radio danas.", online: "Kosi je na mreži", offline: "Kosi je van mreže" },
    voiceCloneCard: {
        title: "Glas Roditelja (AI)",
        subtitle: "Kosi će zvučati baš kao ti",
        active: "Glas je aktivan i spreman za priče!",
        inactive: "Snimi 60 sekundi svog glasa za magično iskustvo.",
        btnStart: "Započni Kloniranje",
        btnManage: "Upravljaj Glasom"
    },
    activitySummary: {
        title: "Aktivnost – Danas",
        minutes: "minuta",
        sessions: "sesija",
        alerts: "upozorenja",
        loading: "Učitavanje...",
        footer: "Miran dan, bez osetljivih događaja."
    },
    pairing: { 
        title: "Poveži Uređaj", 
        step1: "1. Otvorite Kosi aplikaciju na telefonu.", 
        step2: "2. Držite KOSI LOGO (gore levo) 5 sekundi.",
        step3: "3. Unesite kod ovde:", 
        placeholder: "Npr: KOSI-1234", 
        button: "Poveži", 
        success: "Uspešno povezano!", 
        error: "Nevažeći kod" 
    },
    settings: { 
        title: "Podešavanja", 
        childName: "Ime Deteta", 
        save: "Sačuvaj", 
        language: "Jezik Table", 
        device: "Povezan Uređaj",
        dangerZone: "Opasna Zona",
        deleteData: "Obriši Podatke o Aktivnosti",
        deleteWarning: "Ovo će obrisati svu istoriju i crteže. Ne može se poništiti.",
        confirm: "Da li ste sigurni da želite obrisati sve?",
        deleted: "Podaci uspešno obrisani."
    },
    voiceLabPage: {
        back: "Nazad na Tablu",
        title: "Glasovni Lab 🎤",
        subtitle: "Snimi svoj glas da čitaš magične priče svom detetu.",
        readAloud: "Pročitaj ovo naglas:",
        storyText: "Bilo jednom u čarobnoj zemlji gde su oblaci bili od šećerne vune. Kosi, mali robot istraživač, šetao je svaki dan kroz smaragdnu šumu da nauči nove stvari o prijateljstvu i hrabrosti...",
        recording: "Snimanje...",
        success: "Snimanje završeno!",
        delete: "Obriši i Ponovi",
        cloneBtn: "Kloniraj Glas",
        processing: "Obrada..."
    },
    stats: { stories: "Priče", drawings: "Crteži", games: "Igre", activeTime: "Aktivno Vreme" },
    gallery: { title: "Današnja Galerija", noDrawings: "Nema crteža danas" },
    controls: { title: "Brze Komande", stop: "Stop", greet: "Pozdravi", light: "Svetlo", sleep: "Spavanje" },
    activity: { title: "Aktivnost Uživo", recent: "Nedavna Aktivnost", waiting: "Čekamo prvu avanturu...", types: { story: "Priča", draw: "Crtež", music: "Muzika", game: "Igra", default: "Aktivnost" } }
  },

  // 🇭🇷 Hrvatski
  hr: {
    sidebar: { dashboard: "Nadzorna Ploča", voiceLab: "Glasovni Lab", pairing: "Uparivanje", settings: "Postavke", signOut: "Odjava" },
    header: { hello: "Pozdrav, Roditelju!", subtitle: "Evo što je {child} radio danas.", online: "Kosi je online", offline: "Kosi je offline" },
    voiceCloneCard: {
        title: "Glas Roditelja (AI)",
        subtitle: "Kosi će zvučati baš kao ti",
        active: "Glas je aktivan i spreman za priče!",
        inactive: "Snimi 60 sekundi svog glasa za magično iskustvo.",
        btnStart: "Započni Kloniranje",
        btnManage: "Upravljaj Glasom"
    },
    activitySummary: {
        title: "Aktivnost – Danas",
        minutes: "minuta",
        sessions: "sesija",
        alerts: "upozorenja",
        loading: "Učitavanje...",
        footer: "Miran dan, bez osjetljivih događaja."
    },
    pairing: { 
        title: "Poveži Uređaj", 
        step1: "1. Otvorite Kosi aplikaciju na telefonu.", 
        step2: "2. Držite KOSI LOGO (gore lijevo) 5 sekundi.",
        step3: "3. Unesite kod ovdje:", 
        placeholder: "Npr: KOSI-1234", 
        button: "Poveži", 
        success: "Uspješno povezano!", 
        error: "Neispravan kod" 
    },
    settings: { 
        title: "Postavke", 
        childName: "Ime Djeteta", 
        save: "Spremi", 
        language: "Jezik Ploče", 
        device: "Povezan Uređaj",
        dangerZone: "Opasna Zona",
        deleteData: "Izbriši Podatke o Aktivnosti",
        deleteWarning: "Ovo će izbrisati svu povijest i crteže. Ne može se poništiti.",
        confirm: "Jeste li sigurni da želite sve izbrisati?",
        deleted: "Podaci uspješno izbrisani."
    },
    voiceLabPage: {
        back: "Natrag na Ploču",
        title: "Glasovni Lab 🎤",
        subtitle: "Snimi svoj glas da čitaš magične priče svom djetetu.",
        readAloud: "Pročitaj ovo naglas:",
        storyText: "Bilo jednom u čarobnoj zemlji gdje su oblaci bili od šećerne vune. Kosi, mali robot istraživač, šetao je svaki dan kroz smaragdnu šumu da nauči nove stvari o prijateljstvu i hrabrosti...",
        recording: "Snimanje...",
        success: "Snimanje završeno!",
        delete: "Izbriši i Ponovi",
        cloneBtn: "Kloniraj Glas",
        processing: "Obrada..."
    },
    stats: { stories: "Priče", drawings: "Crteži", games: "Igre", activeTime: "Aktivno Vrijeme" },
    gallery: { title: "Današnja Galerija", noDrawings: "Nema crteža danas" },
    controls: { title: "Brze Naredbe", stop: "Stop", greet: "Pozdravi", light: "Svjetlo", sleep: "Spavanje" },
    activity: { title: "Aktivnost Uživo", recent: "Nedavna Aktivnost", waiting: "Čekamo prvu avanturu...", types: { story: "Priča", draw: "Crtež", music: "Glazba", game: "Igra", default: "Aktivnost" } }
  },

  // 🇧🇬 Български
  bg: {
    sidebar: { dashboard: "Табло", voiceLab: "Гласова Лаб", pairing: "Сдвояване", settings: "Настройки", signOut: "Изход" },
    header: { hello: "Здравей, Родителю!", subtitle: "Ето какво прави {child} днес.", online: "Kosi е На линия", offline: "Kosi е Офлайн" },
    voiceCloneCard: {
        title: "Родителски Глас (AI)",
        subtitle: "Kosi ще звучи точно като теб",
        active: "Гласът е активен и готов!",
        inactive: "Запиши 60 секунди от гласа си за магическо преживяване.",
        btnStart: "Започни Клониране",
        btnManage: "Управление"
    },
    activitySummary: {
        title: "Активност – Днес",
        minutes: "минути",
        sessions: "сесии",
        alerts: "сигнали",
        loading: "Зареждане...",
        footer: "Спокоен ден, без събития."
    },
    pairing: { 
        title: "Свързване", 
        step1: "1. Отворете приложението Kosi на телефона.", 
        step2: "2. Задръжте ЛОГОТО на KOSI (горе вляво) за 5 секунди.",
        step3: "3. Въведете кода тук:", 
        placeholder: "Пр: KOSI-1234", 
        button: "Свържи", 
        success: "Успешно свързване!", 
        error: "Невалиден код" 
    },
    settings: { 
        title: "Настройки", 
        childName: "Име на детето", 
        save: "Запази", 
        language: "Език на таблото", 
        device: "Свързано устройство",
        dangerZone: "Опасна Зона",
        deleteData: "Изтрий Данни за Активност",
        deleteWarning: "Това ще изтрие цялата история и рисунки. Не може да се отмени.",
        confirm: "Сигурни ли сте, че искате да изтриете всичко?",
        deleted: "Данните са изчистени успешно."
    },
    voiceLabPage: {
        back: "Назад към Таблото",
        title: "Гласова Лаборатория 🎤",
        subtitle: "Запиши гласа си, за да четеш приказки на детето си.",
        readAloud: "Прочети на глас:",
        storyText: "Имало едно време, в една вълшебна страна, където облаците били от захарен памук. Коси, малкият робот изследовател, вървял всеки ден през изумрудената гора, за да научи нови неща за приятелството...",
        recording: "Записване...",
        success: "Записът завърши!",
        delete: "Изтрий и Опитай пак",
        cloneBtn: "Клонирай Гласа",
        processing: "Обработка..."
    },
    stats: { stories: "Приказки", drawings: "Рисунки", games: "Игри", activeTime: "Активно Време" },
    gallery: { title: "Галерия днес", noDrawings: "Няма рисунки днес" },
    controls: { title: "Бързи Команди", stop: "Стоп", greet: "Поздрави", light: "Светлина", sleep: "Сън" },
    activity: { title: "Активност на живо", recent: "Последна Активност", waiting: "Чакаме първото приключение...", types: { story: "Приказка", draw: "Рисунка", music: "Музика", game: "Игра", default: "Активност" } }
  },

  // 🇬🇷 Ελληνικά
  el: {
    sidebar: { dashboard: "Ταμπλό", voiceLab: "Εργαστήριο Φωνής", pairing: "Σύζευξη", settings: "Ρυθμίσεις", signOut: "Έξοδος" },
    header: { hello: "Γεια σου, Γονιέ!", subtitle: "Δείτε τι έκανε το παιδί σήμερα.", online: "Kosi Online", offline: "Kosi Offline" },
    voiceCloneCard: {
        title: "Φωνή Γονέα (AI)",
        subtitle: "Το Kosi θα ακούγεται ακριβώς σαν εσένα",
        active: "Η φωνή είναι ενεργή!",
        inactive: "Ηχογράφησε 60 δευτερόλεπτα για μια μαγική εμπειρία.",
        btnStart: "Έναρξη Κλωνοποίησης",
        btnManage: "Διαχείριση"
    },
    activitySummary: {
        title: "Δραστηριότητα – Σήμερα",
        minutes: "λεπτά",
        sessions: "συνεδρίες",
        alerts: "ειδοποιήσεις",
        loading: "Φόρτωση...",
        footer: "Ήσυχη μέρα, χωρίς συμβάντα."
    },
    pairing: { 
        title: "Σύνδεση Συσκευής", 
        step1: "1. Ανοίξτε την εφαρμογή Kosi στο κινητό.", 
        step2: "2. Πατήστε παρατεταμένα το ΛΟΓΟΤΥΠΟ KOSI (πάνω αριστερά) για 5 δευτερόλεπτα.",
        step3: "3. Εισάγετε τον κωδικό εδώ:", 
        placeholder: "Πχ: KOSI-1234", 
        button: "Σύνδεση", 
        success: "Συνδέθηκε επιτυχώς!", 
        error: "Άκυρος κωδικός" 
    },
    settings: { 
        title: "Ρυθμίσεις", 
        childName: "Όνομα Παιδιού", 
        save: "Αποθήκευση", 
        language: "Γλώσσα", 
        device: "Συσκευή",
        dangerZone: "Ζώνη Κινδύνου",
        deleteData: "Διαγραφή Δεδομένων",
        deleteWarning: "Αυτό θα διαγράψει όλο το ιστορικό. Δεν αναιρείται.",
        confirm: "Είστε σίγουροι ότι θέλετε να τα διαγράψετε όλα;",
        deleted: "Τα δεδομένα διαγράφηκαν επιτυχώς."
    },
    voiceLabPage: {
        back: "Πίσω στο Ταμπλό",
        title: "Εργαστήριο Φωνής 🎤",
        subtitle: "Ηχογράφησε τη φωνή σου για να λες παραμύθια.",
        readAloud: "Διάβασε αυτό δυνατά:",
        storyText: "Μια φορά κι έναν καιρό, σε μια μαγική χώρα όπου τα σύννεφα ήταν φτιαγμένα από μαλλί της γριάς. Ο Κόσι, ο μικρός εξερευνητής, περπατούσε κάθε μέρα στο σμαραγδένιο δάσος για να μάθει νέα πράγματα...",
        recording: "Εγγραφή...",
        success: "Η εγγραφή ολοκληρώθηκε!",
        delete: "Διαγραφή & Ξανά",
        cloneBtn: "Κλωνοποίηση Φωνής",
        processing: "Επεξεργασία..."
    },
    stats: { stories: "Ιστορίες", drawings: "Σχέδια", games: "Παιχνίδια", activeTime: "Ενεργός Χρόνος" },
    gallery: { title: "Σημερινή Συλλογή", noDrawings: "Κανένα σχέδιο σήμερα" },
    controls: { title: "Γρήγορες Εντολές", stop: "Στοπ", greet: "Χαιρετισμός", light: "Φως", sleep: "Ύπνος" },
    activity: { title: "Ζωντανή Δραστηριότητα", recent: "Πρόσφατη Δραστηριότητα", waiting: "Περιμένουμε την πρώτη περιπέτεια...", types: { story: "Ιστορία", draw: "Σχέδιο", music: "Μουσική", game: "Παιχνίδι", default: "Δραστηριότητα" } }
  },

  // 🇦🇱 Shqip
  sq: {
    sidebar: { dashboard: "Paneli", voiceLab: "Lab Zëri", pairing: "Lidhja", settings: "Cilësimet", signOut: "Dil" },
    header: { hello: "Përshëndetje, Prind!", subtitle: "Ja çfarë bëri {child} sot.", online: "Kosi është Online", offline: "Kosi është Jashtë linje" },
    voiceCloneCard: {
        title: "Zëri i Prindit (AI)",
        subtitle: "Kosi do të tingëllojë si ti",
        active: "Zëri aktiv dhe gati!",
        inactive: "Regjistro 60 sekonda të zërit tënd për një përvojë magjike.",
        btnStart: "Fillo Klonimin",
        btnManage: "Menaxho Zërin"
    },
    activitySummary: {
        title: "Aktiviteti – Sot",
        minutes: "minuta",
        sessions: "seanca",
        alerts: "njoftime",
        loading: "Duke ngarkuar...",
        footer: "Ditë e qetë, pa ngjarje."
    },
    pairing: { 
        title: "Lidh Pajisjen", 
        step1: "1. Hapni Aplikacionin Kosi në telefon.", 
        step2: "2. Mbani shtypur LOGON E KOSI-t (lart majtas) për 5 sekonda.",
        step3: "3. Shkruani kodin këtu:", 
        placeholder: "P.sh: KOSI-1234", 
        button: "Lidh", 
        success: "Lidhur me sukses!", 
        error: "Kod i pavlefshëm" 
    },
    settings: { 
        title: "Cilësimet", 
        childName: "Emri i Fëmijës", 
        save: "Ruaj", 
        language: "Gjuha e Panelit", 
        device: "Pajisja e Lidhur",
        dangerZone: "Zona e Rrezikut",
        deleteData: "Fshi Të Dhënat e Aktivitetit",
        deleteWarning: "Kjo do të fshijë gjithë historikun. Nuk mund të zhbëhet.",
        confirm: "Jeni të sigurt që doni të fshini gjithçka?",
        deleted: "Të dhënat u pastruan me sukses."
    },
    voiceLabPage: {
        back: "Kthehu në Panel",
        title: "Laboratori i Zërit 🎤",
        subtitle: "Regjistro zërin tënd për të lexuar përralla.",
        readAloud: "Lexo këtë me zë të lartë:",
        storyText: "Na ishte një herë, në një vend magjik ku retë ishin bërë nga pambuku i sheqerit. Kosi, eksploruesi i vogël robot, ecte çdo ditë në pyllin smerald për të mësuar gjëra të reja mbi miqësinë...",
        recording: "Po regjistron...",
        success: "Regjistrimi përfundoi!",
        delete: "Fshi & Provo Përsëri",
        cloneBtn: "Klono Zërin",
        processing: "Duke përpunuar..."
    },
    stats: { stories: "Përralla", drawings: "Vizatime", games: "Lojëra", activeTime: "Koha Aktive" },
    gallery: { title: "Galeria e Sotme", noDrawings: "Asnjë vizatim sot" },
    controls: { title: "Komanda të Shpejta", stop: "Ndal", greet: "Përshëndet", light: "Drita", sleep: "Gjumi" },
    activity: { title: "Aktiviteti Live", recent: "Aktiviteti i Fundit", waiting: "Duke pritur aventurën e parë...", types: { story: "Përrallë", draw: "Vizatim", music: "Muzikë", game: "Lojë", default: "Aktivitet" } }
  }
};