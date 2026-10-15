export const metadata = {
  title: "Politică de confidențialitate · KOSI",
  description: "Cum colectează și protejează KOSI datele părinților și copiilor.",
}

const UPDATED = "15 octombrie 2026"

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-5 py-12 text-slate-800 leading-relaxed">
      <div className="mb-8 flex items-center gap-2">
        <span className="text-2xl font-black tracking-tight">KOSI</span>
        <span className="text-slate-400">·</span>
        <a href="#en" className="text-sm text-indigo-600 hover:underline">English version ↓</a>
      </div>

      {/* ============ ROMÂNĂ ============ */}
      <section id="ro" className="space-y-5">
        <h1 className="text-3xl font-bold text-slate-900">Politică de confidențialitate</h1>
        <p className="text-sm text-slate-500">Ultima actualizare: {UPDATED}</p>

        <p>KOSI este o aplicație de povești de seară pentru copii (3–8 ani), în care părintele își poate clona vocea ca aplicația să citească povești cu vocea lui. Această politică explică ce date colectăm, de ce, și cum le protejăm. Operatorul de date este <strong>ARSEGA DESIGN S.R.L.</strong>, Popești-Leordeni, Ilfov, România. Contact: <a className="text-indigo-600" href="mailto:office@arsega.ro">office@arsega.ro</a>.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">1. Ce date colectăm</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Contul părintelui:</strong> adresa de email (pentru autentificare prin link magic).</li>
          <li><strong>Datele copilului:</strong> prenumele (opțional, introdus de părinte), desenele create în aplicație și jurnalul de activitate (povești ascultate, jocuri, timp de utilizare).</li>
          <li><strong>Înregistrarea vocală a părintelui:</strong> ~60 de secunde de voce, furnizate voluntar de părinte pentru crearea unei voci AI.</li>
          <li><strong>Date tehnice:</strong> identificatorul dispozitivului și codul de împerechere, necesare conectării dispozitivului copilului cu panoul părintelui.</li>
          <li><strong>Achiziții:</strong> starea abonamentului, gestionată de Google Play Billing (nu vedem și nu stocăm datele cardului).</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-2">2. Cum folosim datele</h2>
        <p>Folosim datele exclusiv pentru a furniza serviciul: generarea și citirea poveștilor, redarea lor în vocea părintelui, și afișarea activității în panoul parental. <strong>Nu vindem datele, nu le folosim pentru publicitate și nu afișăm reclame în aplicație.</strong></p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">3. Copiii și consimțământul parental</h2>
        <p>KOSI este destinat utilizării de către copii sub supravegherea unui părinte. Contul este creat și controlat de părinte. Zonele sensibile (setări, plăți) sunt protejate de o <strong>poartă parentală</strong>. Colectarea oricăror date despre copil are loc numai pe baza acțiunii și consimțământului părintelui, în conformitate cu GDPR și cu cerințele pentru aplicații destinate familiilor. Părintele poate oricând vedea, exporta sau șterge datele copilului din panou.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">4. Vocea părintelui</h2>
        <p>Înregistrarea vocală este trimisă către furnizorul nostru de sinteză vocală (ElevenLabs) pentru a crea un model de voce folosit doar la citirea poveștilor pe dispozitivul familiei. Vocea nu este folosită în alt scop. Părintele poate șterge vocea clonată din panou în orice moment; ștergerea o elimină atât din sistemele noastre, cât și de la furnizor.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">5. Terți (persoane împuternicite)</h2>
        <p>Pentru a funcționa, KOSI folosește furnizori care procesează date în numele nostru:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Supabase</strong> – bază de date, autentificare și stocare (regiune UE).</li>
          <li><strong>ElevenLabs</strong> – crearea vocii AI din înregistrarea părintelui.</li>
          <li><strong>OpenAI</strong> – generarea textului poveștilor.</li>
          <li><strong>Google Cloud Text-to-Speech</strong> – citirea poveștilor cu voce standard (când nu se folosește vocea clonată).</li>
          <li><strong>Google Play Billing</strong> – procesarea abonamentelor.</li>
          <li><strong>Cloudflare Turnstile</strong> – protecție anti-bot la autentificarea în panou.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-2">6. Transfer internațional</h2>
        <p>Unii furnizori (ElevenLabs, OpenAI) procesează date în afara Spațiului Economic European, inclusiv în SUA, pe baza clauzelor contractuale standard și a garanțiilor impuse de aceștia. Restul datelor sunt stocate în UE.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">7. Păstrare și ștergere</h2>
        <p>Păstrăm datele atât timp cât contul este activ. Părintele poate șterge jurnalul de activitate și vocea clonată direct din panou, iar la cerere ștergem complet contul și datele asociate scriind la <a className="text-indigo-600" href="mailto:office@arsega.ro">office@arsega.ro</a>.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">8. Securitate</h2>
        <p>Toate comunicațiile sunt criptate în tranzit (HTTPS). Accesul la date este restricționat prin reguli de securitate la nivel de rând (RLS) și autentificare, astfel încât un părinte vede doar dispozitivele și datele propriului copil.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">9. Drepturile tale</h2>
        <p>Conform GDPR, ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate și opoziție privind datele personale. Ne poți contacta la <a className="text-indigo-600" href="mailto:office@arsega.ro">office@arsega.ro</a>. Ai de asemenea dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">10. Modificări</h2>
        <p>Putem actualiza această politică; vom modifica data de mai sus și, pentru schimbări importante, vom anunța în aplicație sau prin email.</p>
      </section>

      <hr className="my-12 border-slate-200" />

      {/* ============ ENGLISH ============ */}
      <section id="en" className="space-y-5">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last updated: October 15, 2026</p>

        <p>KOSI is a bedtime-story app for children (ages 3–8) in which a parent can clone their own voice so the app reads stories in that voice. This policy explains what data we collect, why, and how we protect it. The data controller is <strong>ARSEGA DESIGN S.R.L.</strong>, Popești-Leordeni, Ilfov, Romania. Contact: <a className="text-indigo-600" href="mailto:office@arsega.ro">office@arsega.ro</a>.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">1. Data we collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Parent account:</strong> email address (for magic-link sign-in).</li>
          <li><strong>Child data:</strong> first name (optional, entered by the parent), drawings made in the app, and an activity log (stories played, games, usage time).</li>
          <li><strong>Parent voice recording:</strong> ~60 seconds of voice, provided voluntarily by the parent to create an AI voice.</li>
          <li><strong>Technical data:</strong> device identifier and pairing code, needed to link the child's device to the parent dashboard.</li>
          <li><strong>Purchases:</strong> subscription status, handled by Google Play Billing (we never see or store card details).</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-2">2. How we use data</h2>
        <p>We use data solely to provide the service: generating and narrating stories, playing them in the parent's voice, and showing activity in the parent dashboard. <strong>We do not sell data, do not use it for advertising, and show no ads in the app.</strong></p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">3. Children & parental consent</h2>
        <p>KOSI is intended for use by children under a parent's supervision. The account is created and controlled by the parent. Sensitive areas (settings, payments) are protected by a <strong>parental gate</strong>. Any collection of a child's data occurs only through the parent's action and consent, in line with GDPR and families-app requirements. Parents can view, export, or delete their child's data from the dashboard at any time.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">4. The parent's voice</h2>
        <p>The voice recording is sent to our speech provider (ElevenLabs) to create a voice model used only to narrate stories on the family's device. The voice is not used for any other purpose. Parents can delete the cloned voice from the dashboard at any time; deletion removes it from both our systems and the provider.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">5. Third parties (processors)</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Supabase</strong> – database, authentication and storage (EU region).</li>
          <li><strong>ElevenLabs</strong> – creating the AI voice from the parent's recording.</li>
          <li><strong>OpenAI</strong> – generating story text.</li>
          <li><strong>Google Cloud Text-to-Speech</strong> – narration with a standard voice (when the cloned voice is not used).</li>
          <li><strong>Google Play Billing</strong> – subscription processing.</li>
          <li><strong>Cloudflare Turnstile</strong> – anti-bot protection on dashboard sign-in.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-2">6. International transfers</h2>
        <p>Some providers (ElevenLabs, OpenAI) process data outside the European Economic Area, including in the US, under standard contractual clauses and their own safeguards. Other data is stored in the EU.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">7. Retention & deletion</h2>
        <p>We retain data for as long as the account is active. Parents can delete the activity log and the cloned voice directly from the dashboard, and on request we fully delete the account and associated data by writing to <a className="text-indigo-600" href="mailto:office@arsega.ro">office@arsega.ro</a>.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">8. Security</h2>
        <p>All communication is encrypted in transit (HTTPS). Data access is restricted via row-level security (RLS) and authentication, so a parent sees only their own child's devices and data.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">9. Your rights</h2>
        <p>Under GDPR you have the right to access, rectification, erasure, restriction, portability and objection regarding your personal data. Contact us at <a className="text-indigo-600" href="mailto:office@arsega.ro">office@arsega.ro</a>. You may also lodge a complaint with the Romanian Data Protection Authority (ANSPDCP).</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">10. Changes</h2>
        <p>We may update this policy; we will change the date above and, for material changes, notify you in the app or by email.</p>

        <p className="pt-6 text-sm text-slate-400">ARSEGA DESIGN S.R.L. · office@arsega.ro</p>
      </section>
    </main>
  )
}
