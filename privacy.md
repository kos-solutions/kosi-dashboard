# Politica de Confidențialitate - KOSI

**Data intrării în vigoare:** 1 Ianuarie 2026  
**Ultima actualizare:** 31 Decembrie 2025

---

## Introducere

Bine ați venit la KOSI ("noi," "al nostru," sau "ne referim la noi"). KOSI este o aplicație de povestire interactivă alimentată de AI, concepută pentru copii cu vârste cuprinse între 5-8 ani. Suntem dedicați protejării confidențialității și securității utilizatorilor noștri, în special a copiilor.

Această Politică de Confidențialitate explică modul în care colectăm, utilizăm, stocăm și protejăm informațiile dumneavoastră atunci când utilizați aplicația mobilă KOSI și tabloul de bord pentru părinți.

**Prin utilizarea KOSI, sunteți de acord cu termenii acestei Politici de Confidențialitate.**

---

## 1. Informațiile pe care le colectăm

### 1.1 Informații furnizate de dumneavoastră

#### **Informații despre contul părintelui/tutorelui:**
- Adresa de email (pentru crearea contului și accesul la tabloul de bord)
- Parolă (criptată și stocată în siguranță)
- Informații de plată (procesate de Google Play Billing; nu stocăm detalii ale cardului de credit)

#### **Informații despre profilul copilului:**
- Prenumele copilului (pentru personalizare)
- Intervalul de vârstă (5-8 ani, pentru conținut adecvat)
- Limba preferată (română, greacă, turcă, sârbă, croată, bulgară sau albaneză)

#### **Înregistrări vocale:**
- **Înregistrări vocale ale părinților:** Când utilizați funcția Voice Cloning, colectăm o înregistrare vocală de 30 de secunde pentru a genera modelul vocal personalizat. Această înregistrare este:
  - Criptată în tranzit și în repaus
  - Stocată în siguranță pe serverele noastre
  - Folosită exclusiv pentru a genera clona vocală prin API-ul ElevenLabs
  - Nu este partajată cu terțe părți, cu excepția furnizorului nostru de sinteză vocală
  - Poate fi ștearsă oricând din Setări

- **Input vocal al copilului:** Când copilul dumneavoastră vorbește pentru a solicita povești, procesăm temporar audio-ul prin API-ul Whisper al OpenAI pentru conversia vorbire-text. Acest audio este:
  - Procesat în timp real
  - Nu este stocat permanent
  - Șters imediat după transcriere
  - Nu este folosit pentru antrenarea modelelor AI

### 1.2 Informații colectate automat

#### **Informații despre dispozitiv:**
- Model de dispozitiv și versiune Android
- Identificator unic de dispozitiv (pentru asocierea tabloului de bord pentru părinți)
- Versiunea aplicației
- Setări de limbă

#### **Informații despre utilizare:**
- Povești solicitate și ascultate
- Jocuri jucate și scoruri obținute
- Timp petrecut în aplicație
- Funcții utilizate (povești, jocuri, muzică, relaxare)
- Jurnale de erori (anonimizate)

### 1.3 Informații pe care NU le colectăm

NU colectăm:
- Numele complet sau prenumele copilului
- Locația precisă a copilului
- Fotografii sau videoclipuri ale copilului (cu excepția vocii, așa cum este descris mai sus)
- Informații de contact ale copilului
- Informații despre rețelele sociale
- Istoricul de navigare în afara aplicației
- Orice informații personale sensibile dincolo de cele enumerate mai sus

---

## 2. Cum folosim informațiile dumneavoastră

### 2.1 Pentru a furniza și îmbunătăți serviciul

- **Generare povești:** Trimitem solicitări de povești către OpenAI GPT-4 pentru a genera povești personalizate, adecvate vârstei copilului
- **Sinteză vocală:** Folosim ElevenLabs pentru a genera narațiune vocală, inclusiv vocea clonată pentru utilizatorii premium
- **Recunoaștere vocală:** Folosim OpenAI Whisper pentru a transcrie solicitările vocale ale copilului în text
- **Siguranță conținut:** Folosim API-ul de moderare OpenAI pentru a filtra conținutul neadecvat înainte ca acesta să ajungă la copilul dumneavoastră
- **Funcționalitatea aplicației:** Folosim identificatorii de dispozitiv pentru a asocia tableta copilului cu tabloul de bord pentru părinți
- **Monitorizarea performanței:** Analizăm modelele de utilizare pentru a remedia erorile și a îmbunătăți performanța aplicației

### 2.2 Pentru a comunica cu dumneavoastră

- **Gestionarea contului:** Resetări de parolă, notificări despre cont, alerte de securitate
- **Tabloul de bord pentru părinți:** Transcrieri ale poveștilor, rapoarte de utilizare, alerte de siguranță
- **Actualizări de serviciu:** Funcții noi, actualizări de conținut, oferte promoționale (puteți renunța)
- **Suport:** Răspuns la întrebările și problemele tehnice

### 2.3 Pentru a asigura siguranța

- **Moderare conținut:** Toate poveștile generate de AI trec prin filtre multiple de siguranță
- **Monitorizare utilizare:** Tabloul de bord pentru părinți vă permite să monitorizați exact ce conținut a accesat copilul
- **Prevenirea abuzurilor:** Înregistrăm utilizarea API pentru a preveni abuzul serviciului

---

## 3. Partajarea și divulgarea informațiilor

### 3.1 Furnizori de servicii terțe părți

Partajăm informații cu următorii furnizori de servicii de încredere care ne ajută să operăm KOSI:

#### **OpenAI (Generare povești și siguranță):**
- **Ce partajăm:** Solicitări de povești, transcrierii vocale ale copilului (temporare), conținut pentru moderare
- **Scop:** Generare povești, transcriere vorbire, filtrare conținut neadecvat
- **Retenție date:** OpenAI nu folosește datele KOSI pentru a antrena modele (conform termenilor API)
- **Politica de confidențialitate:** https://openai.com/policies/privacy-policy

#### **ElevenLabs (Sinteză vocală):**
- **Ce partajăm:** Înregistrări vocale ale părinților (pentru clonarea vocii), text povești
- **Scop:** Generare narațiune vocală cu vocea dumneavoastră
- **Retenție date:** Modelele vocale sunt stocate în siguranță, pot fi șterse
- **Politica de confidențialitate:** https://elevenlabs.io/privacy

#### **Supabase (Bază de date și autentificare):**
- **Ce partajăm:** Informații cont, asocieri dispozitive, date de utilizare
- **Scop:** Stocare securizată a datelor și autentificare
- **Retenție date:** Criptate în repaus, conforme GDPR
- **Politica de confidențialitate:** https://supabase.com/privacy

### 3.2 Cerințe legale

Putem divulga informațiile dumneavoastră dacă este cerut de lege sau pentru a:
- Respecta obligațiile legale (ordine judecătorești, citații)
- Proteja siguranța copiilor sau preveni vătămarea
- Investiga fraude sau probleme de securitate
- Aplica Termenii noștri de serviciu

### 3.3 Ce NU facem

NU:
- Vindem informațiile personale terților
- Folosim datele pentru publicitate targetată
- Partajăm informațiile cu brokeri de date
- Permitem terților să vă urmărească copilul între aplicații

---

## 4. Securitatea datelor

### 4.1 Măsuri de securitate

Implementăm măsuri de securitate standard din industrie:

- **Criptare:** Toate datele sunt criptate în tranzit (HTTPS/TLS) și în repaus (AES-256)
- **Controlul accesului:** Politici stricte de acces pentru angajați; doar personalul autorizat poate accesa datele
- **Autentificare:** Hash-uri securizate pentru parole (bcrypt), coduri de asociere a dispozitivelor
- **Monitorizare:** Sisteme automate detectează și răspund la amenințări de securitate
- **Audituri regulate:** Revizuim și actualizăm regulat practicile noastre de securitate

### 4.2 Securitatea înregistrărilor vocale

Înregistrările vocale ale părinților sunt:
- Criptate cu criptare AES-256
- Stocate în centre de date sigure, conforme GDPR
- Accesibile doar de către dumneavoastră și furnizorul nostru de sinteză vocală (ElevenLabs)
- Protejate prin autentificare cu mai mulți factori pentru accesul la tabloul de bord
- Pot fi șterse permanent oricând

---

## 5. Retenția datelor

### 5.1 Cât timp păstrăm datele

- **Informații cont:** Până când vă ștergeți contul, plus 30 de zile pentru copii de siguranță
- **Înregistrări vocale părinți:** Până când le ștergeți sau închideți contul
- **Transcrieri povești:** Stocate în tabloul de bord pentru părinți pentru 90 de zile, apoi șterse automat
- **Analiză utilizare:** Anonimizate după 12 luni
- **Input vocal copil:** Șters imediat după transcriere (nu este stocat)
- **Jurnale erori:** Păstrate 6 luni pentru depanare

---

## 6. Drepturile dumneavoastră (GDPR)

Aveți următoarele drepturi cu privire la datele personale:

### 6.1 Acces
Solicitați o copie a tuturor datelor personale pe care le deținem despre dumneavoastră.

### 6.2 Rectificare
Corectați orice informații inexacte sau incomplete.

### 6.3 Ștergere ("Dreptul de a fi uitat")
Solicitați ștergerea completă a contului și a tuturor datelor asociate.

**Cum să ștergeți datele:**
1. Mergeți la Setări → Cont → Șterge cont
2. Sau trimiteți email: privacy@kosiapp.com cu subiect "Cerere ștergere date"
3. Vom confirma ștergerea în 48 de ore
4. Toate datele șterse permanent în 30 de zile

### 6.4 Portabilitate date
Solicitați datele în format ușor de citit (JSON/CSV).

**Pentru a vă exercita drepturile, contactați-ne la:** privacy@kosiapp.com

---

## 7. Confidențialitatea copiilor (COPPA și GDPR)

KOSI este conceput pentru copii cu vârste cuprinse între 5-8 ani. Luăm foarte în serios confidențialitatea copiilor.

### 7.1 Consimțământ parental

- **Creare cont:** Doar părinții/tutorii pot crea conturi
- **Voice Cloning:** Doar părinții pot înregistra și autoriza clonarea vocii
- **Acces tablou de bord:** Doar părinții pot accesa tabloul de bord pentru părinți
- **Control date:** Părinții au control complet asupra colectării și ștergerii datelor

### 7.2 Control parental

Părinții pot:
- Vizualiza fiecare poveste pe care copilul lor a auzit-o (transcrieri complete)
- Monitoriza timpul petrecut în aplicație
- Șterge orice sau toate datele oricând
- Dezactiva funcții specifice
- Dezasocia dispozitive de la distanță
- Exporta toate datele

---

## 8. Modificări la această politică

Vom actualiza "Ultima actualizare" la început și vă vom notifica prin email pentru modificări semnificative.

---

## 9. Contactați-ne

**Email:** privacy@kosiapp.com  
**Suport:** support@kosiapp.com  
**Website:** https://kosiapp.com

**Ofițer de protecție a datelor:**  
Email: dpo@kosiapp.com

**Adresa poștală:**  
KOSI - KOS Solutions  
București, România

---

## Rezumat

✅ Colectăm doar date esențiale: email părinte, prenume copil, înregistrări vocale (opțional)  
✅ Înregistrările vocale sunt criptate și pot fi șterse oricând  
✅ Input-ul vocal al copilului este temporar și nu este stocat  
✅ Toate poveștile sunt filtrate pentru siguranță  
✅ Părinții au tablou de bord complet pentru monitorizare  
✅ Nu vindem date și nu afișăm reclame  
✅ Suntem conformi GDPR și COPPA  
✅ Puteți șterge toate datele oricând  

**Întrebări? Trimiteți-ne email la privacy@kosiapp.com**

---

**Vă mulțumim că aveți încredere în KOSI!** ❤️
