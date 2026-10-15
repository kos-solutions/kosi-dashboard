export const metadata = {
  title: "Termeni și condiții · KOSI",
  description: "Termenii de utilizare a aplicației KOSI.",
}

const UPDATED = "15 octombrie 2026"

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-5 py-12 text-slate-800 leading-relaxed">
      <div className="mb-8 flex items-center gap-2">
        <span className="text-2xl font-black tracking-tight">KOSI</span>
        <span className="text-slate-400">·</span>
        <a href="#en" className="text-sm text-indigo-600 hover:underline">English version ↓</a>
      </div>

      <section id="ro" className="space-y-5">
        <h1 className="text-3xl font-bold text-slate-900">Termeni și condiții</h1>
        <p className="text-sm text-slate-500">Ultima actualizare: {UPDATED}</p>

        <p>Prin folosirea aplicației KOSI accepți acești termeni. Serviciul este oferit de <strong>ARSEGA DESIGN S.R.L.</strong> („noi"). Contact: <a className="text-indigo-600" href="mailto:office@arsega.ro">office@arsega.ro</a>.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">1. Serviciul</h2>
        <p>KOSI oferă povești de seară pentru copii, generate și citite cu ajutorul tehnologiei AI, inclusiv opțiunea de a reda poveștile în vocea clonată a părintelui. Contul este destinat utilizării de către un părinte/tutore pentru copilul său.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">2. Cont și eligibilitate</h2>
        <p>Trebuie să fii adult (părinte sau tutore legal) pentru a crea un cont și a configura aplicația. Ești responsabil pentru păstrarea accesului la emailul folosit la autentificare.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">3. Abonamente și plăți</h2>
        <p>Funcțiile premium se pot achiziționa ca abonament prin Google Play. Plata, reînnoirea și anularea sunt gestionate de contul tău Google Play, conform regulilor Google. Poți anula oricând din Google Play; accesul rămâne activ până la finalul perioadei plătite.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">4. Utilizare acceptabilă</h2>
        <p>Nu folosi aplicația în scopuri ilegale, nu încerca să o decompilezi sau să abuzezi de infrastructură, și nu încărca voci care nu îți aparțin sau pentru care nu ai dreptul.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">5. Conținut generat de AI</h2>
        <p>Poveștile sunt generate automat. Depunem eforturi ca ele să fie potrivite vârstei, dar nu putem garanta că fiecare rezultat este perfect; recomandăm supravegherea părintelui.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">6. Proprietate intelectuală</h2>
        <p>Aplicația, marca KOSI și componentele sale rămân proprietatea noastră. Vocea clonată și desenele copilului tău îți aparțin.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">7. Limitarea răspunderii</h2>
        <p>Serviciul este oferit „ca atare". În limitele permise de lege, nu răspundem pentru daune indirecte rezultate din utilizarea aplicației.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">8. Încetare</h2>
        <p>Poți înceta folosirea oricând și poți cere ștergerea contului. Putem suspenda conturi care încalcă acești termeni.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">9. Legea aplicabilă</h2>
        <p>Acești termeni sunt guvernați de legea română.</p>
      </section>

      <hr className="my-12 border-slate-200" />

      <section id="en" className="space-y-5">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <p className="text-sm text-slate-500">Last updated: October 15, 2026</p>

        <p>By using the KOSI app you accept these terms. The service is provided by <strong>ARSEGA DESIGN S.R.L.</strong> ("we"). Contact: <a className="text-indigo-600" href="mailto:office@arsega.ro">office@arsega.ro</a>.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">1. The service</h2>
        <p>KOSI provides AI-generated and AI-narrated bedtime stories for children, including the option to play stories in the parent's cloned voice. The account is intended for use by a parent/guardian for their child.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">2. Account & eligibility</h2>
        <p>You must be an adult (parent or legal guardian) to create an account and set up the app. You are responsible for retaining access to the email used for sign-in.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">3. Subscriptions & payments</h2>
        <p>Premium features may be purchased as a subscription via Google Play. Billing, renewal and cancellation are handled by your Google Play account under Google's rules. You can cancel anytime in Google Play; access remains until the end of the paid period.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">4. Acceptable use</h2>
        <p>Do not use the app for unlawful purposes, do not attempt to decompile it or abuse the infrastructure, and do not upload voices that are not yours or that you have no right to use.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">5. AI-generated content</h2>
        <p>Stories are generated automatically. We strive for age-appropriate content but cannot guarantee every result is perfect; parental supervision is recommended.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">6. Intellectual property</h2>
        <p>The app, the KOSI brand and its components remain our property. Your cloned voice and your child's drawings belong to you.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">7. Limitation of liability</h2>
        <p>The service is provided "as is". To the extent permitted by law, we are not liable for indirect damages arising from use of the app.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">8. Termination</h2>
        <p>You may stop using the app at any time and request account deletion. We may suspend accounts that violate these terms.</p>

        <h2 className="text-xl font-bold text-slate-900 pt-2">9. Governing law</h2>
        <p>These terms are governed by Romanian law.</p>

        <p className="pt-6 text-sm text-slate-400">ARSEGA DESIGN S.R.L. · office@arsega.ro</p>
      </section>
    </main>
  )
}
