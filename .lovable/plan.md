

# Plan: Migrare completă Manus → Lovable

## Analiza diferentelor

Proiectul Manus (highticket) este o platformă full-stack cu Node.js/tRPC/SQLite, cu ~40+ pagini și integrări complexe. Proiectul Lovable actual are deja structura de bază (Home, Courses, Locations, Blog, Admin, Agent, Student dashboards) conectată la Lovable Cloud.

### Ce EXISTĂ deja in Lovable:
- Public: Home, Courses, CourseDetail, Locations, LocationDetail, About, Blog, BlogPost, Contact, Eligibility, IkigaiQuiz, FinanceCalculator, StudentFinance, Careers, Webinar, Reviews, Ebook, Agents, Legal
- Auth: Login cu roluri (admin/agent/student)
- Admin: Dashboard cu users, contacts, blog, applications, quiz results
- Agent/Student: Dashboard-uri de bază
- DB: profiles, user_roles, contacts, blog_posts, applications, quiz_results, referrals, student_documents + email tables

### Ce lipseste (din Manus):

**Tier 1 - Pagini si funcționalități de vânzare:**
- EbookSalesPage (pagina de vânzare Russell Brunson style)
- BlackbookSalesPage
- AudiobookUpsellPage + ThankYouEbookPage
- Stripe checkout integration
- BookAppointment (wizard 4 pași)

**Tier 2 - Funcționalități admin avansate:**
- Admin: SMS logs, Campuses, Appointments, Abandoned carts, Email sequences
- Admin: Users panel cu toggle isAgent
- GoHighLevel CRM sync

**Tier 3 - CEO AI Dashboard:**
- 6+ pagini CEO (Dashboard, Sales, Tasks, Analytics, OKRs, Agents)
- AI Agent Platform (orchestrare, workflows, approvals)
- AI Engine (OpenAI) - daily summary, recommendations, lead scoring
- Agent runner cu marketing agents (Copywriter, CMO, Social Media, Email)

**Tier 4 - Student EDU Journey:**
- EDU Dashboard cu E/D/U phases
- Gamification (points, streaks, levels, badges)
- CV Builder, Test Prep, Course Match
- AI E.D.U Plan generation

**Tier 5 - Tracking & SEO:**
- Meta Pixel + GA4 event tracking pe toate paginile
- React Helmet SEO cu JSON-LD schemas
- Conversions API (CAPI)
- i18n complet (EN, RO, HU, PL)

**Tier 6 - Agent portal avansat:**
- Agent login dedicat, contract modal
- Commissions & Leaderboard conectate la backend
- Agent profile page, materials, students management

## Abordare recomandata

Aceasta migrare este un proiect MARE care va necesita **20-30+ sesiuni** de lucru. Recomand sa lucram in faze, prioritizand ce aduce valoare imediata:

### Faza 1 (acum): Pagini de vanzare + Stripe
- Recreez EbookSalesPage, BlackbookSalesPage, AudiobookUpsellPage
- Integrez Stripe pentru checkout
- Adaug tabelele necesare (purchase_logs)

### Faza 2: Admin avansat
- Appointments system (tabel + admin panel + booking page)
- Campuses cu adrese complete
- SMS logs, abandoned carts, email sequences

### Faza 3: Student EDU Journey
- EDU Dashboard cu phases
- Gamification system
- Documents, CV Builder

### Faza 4: CEO AI Dashboard
- AI Engine cu Lovable AI (fara API key necesar)
- Dashboard, Tasks, OKRs, Analytics
- AI Agent Platform

### Faza 5: SEO & Tracking
- Meta Pixel + GA4
- JSON-LD schemas
- i18n complet

## Important de retinut

- **Arhitectura backend difera complet**: Manus foloseste tRPC + SQLite, Lovable foloseste Supabase (Postgres + Edge Functions). Codul backend NU poate fi copiat direct - trebuie rescris.
- **Frontend-ul se poate adapta**: Componentele React din Manus pot fi adaptate, dar folosesc wouter (nu react-router) si au alte pattern-uri.
- **Unele integrari externe** (Twilio, GoHighLevel, Meta CAPI) vor necesita API keys si edge functions.

Cu ce faza vrei sa incepem?

