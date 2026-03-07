

# Plan: Recrearea Platformei EduForYou pe Lovable

## Prezentare Generală
Recrearea completă a platformei EduForYou (www.eduforyou.co.uk) — o platformă de consultanță educațională pentru universități din UK, cu design Navy + Orange, suport pentru 4 limbi, autentificare cu roluri, și plăți Stripe.

---

## Faza 1 — Fundația și Paginile Publice

### 1.1 Sistem de Design & Layout
- Tema Navy (#2C3E50) + Orange (#E67E22) cu font-uri și culori identice cu site-ul original
- Header cu navigare (Courses, Professional Courses, Locations, Eligibility, Ikigai Quiz, Webinars, Blog, Contact) + language switcher (EN/RO/HU/PL) + Sign In
- Footer cu 5 coloane, newsletter, link-uri legale
- Cookie consent banner

### 1.2 Sistem i18n (4 limbi)
- Context de limbă cu EN, RO, HU, PL
- Toate textele traduse prin chei de traducere

### 1.3 Pagini Publice
- **Home**: Hero cu imagine campus, statistici (7000+ studenți, £138M+), parteneri universitari, secțiune cursuri, E.D.U. Method, FAQ accordion, eligibility form inline, social proof, CTA-uri
- **Courses** (/cursuri): Grid de cursuri cu filtre (BSc/MSc, domeniu), match badges
- **Course Detail**: Pagină detaliată per curs cu campusuri, module, Apply CTA
- **Professional Courses**: Cursuri profesionale separate
- **Locations** (/locatii): 6 campusuri (London, Birmingham, Manchester, Leeds, East London, Greenford)
- **Location Detail**: Detalii per campus
- **Eligibility Quiz** (/eligibilitate): Quiz multi-step cu rezidență, vârstă, DOB, telefon
- **Ikigai Quiz**: Quiz interactiv cu recomandare de curs + lead magnet PDF
- **Finance Calculator**: Calculator Student Finance UK
- **Student Finance Page**: Explicații SFE
- **Blog** + articole individuale
- **Webinars**: Pagina webinar + webinar university + webinar agents
- **Contact**: Formular, WhatsApp, Google Maps, program
- **About** + Why Free + Team + Partners
- **Careers** + Career Apply form
- **Review Page**: Google Reviews
- **Legal**: Cookie Policy, Privacy, Terms
- **Ebook Sales Page**: Pagină de vânzare stil Russell Brunson cu countdown
- **Blackbook Sales Page**: Landing page ebook SFE
- **Lead Magnet Page**: Resurse gratuite
- **Audiobook Upsell Page**: Upsell post-checkout
- **Thank You Pages**: Post-purchase cu download PDF

---

## Faza 2 — Backend cu Lovable Cloud (Supabase)

### 2.1 Baza de Date
- **users/profiles**: profiluri utilizatori cu câmpuri extinse
- **user_roles**: roluri separate (admin, agent, student) — conform best practices de securitate
- **contacts**: leads din formulare
- **courses**: 14+ cursuri cu detalii
- **locations**: 6 campusuri
- **applications**: aplicații studenți
- **documents**: documente uploadate
- **blog_posts**: articole blog
- **quiz_results**: rezultate Ikigai/Eligibility
- **commissions**: comisioane agenți
- **referrals**: sistem referral

### 2.2 Autentificare
- Login/Register cu email via Supabase Auth
- Forgot/Reset Password
- Roluri: admin, agent, student
- Protected Routes per rol
- Agent Login Portal separat (/agent/login)

### 2.3 Edge Functions
- Procesare formulare (contact, eligibility, aplicații)
- Integrări externe (email notifications)

---

## Faza 3 — Dashboard-uri Protejate

### 3.1 Admin Dashboard (/admin)
- KPI-uri, contacte/leads, pipeline, management cursuri
- Panou utilizatori cu toggle roluri
- HR module (candidați, AI scoring)
- Panou studenți cu status management

### 3.2 Agent Dashboard (/agent)
- Statistici, studenți referiți, comisioane
- Leaderboard, materiale marketing
- Profil agent, contract obligatoriu

### 3.3 Student Dashboard (/student)
- E.D.U. Journey: Evaluate → Deliver → Unlock
- Eligibility, Course Match, E.D.U. Plan, Test Prep
- Documents, CV Builder, Student Finance status
- Bonuses, Enrollment tracking

---

## Faza 4 — Stripe Integration

- Checkout pentru ebook (£5) și audiobook (£7)
- Agent subscription (Standard + VIP la £97/lună)
- Success/Thank You pages cu download links
- Webhook handling via edge functions

---

## Notă Importantă
Acest proiect este **foarte mare** și va necesita implementare pas cu pas, faza cu fază. Recomand să începem cu Faza 1 (design system + paginile publice principale) și să avansăm progresiv. Fiecare fază va fi livrată și testată înainte de a trece la următoarea.

Unele funcționalități din repo-ul original (tRPC, SQLite, Telegram bot, Respond.io, OpenAI CEO agents) vor fi adaptate la arhitectura Lovable Cloud (Supabase + Edge Functions).

