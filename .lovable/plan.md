

## Plan: Zona de Membri (Student) + CRM Admin — Adaptare din Highticket

Am analizat repo-ul `highticket` și comparat cu ce avem. Iată ce lipsește și planul de implementare.

---

### Ce are Highticket și noi nu avem

**Student Member Area (lipsă):**
1. **E.D.U. Pipeline complet** — 3 faze cu sub-pași detaliați (Evaluate: Quiz, Ikigai, Catalog, Discovery Call, AI Test Prep / Deliver: Documents, Application, University Submission, Visa, Accommodation / Unlock: Pre-Departure, Networking, Career, Alumni)
2. **Welcome Banner** personalizat cu numele studentului
3. **Next Step Card** cu countdown timer + CTA "Book Discovery Call"
4. **Book Consultation Card** integrat în dashboard
5. **Upcoming Tasks** (tabel cu date + status)
6. **Test Prep AI** — modul de practică teste cu generare AI
7. **Student Referral Page** — studenții pot referi alți studenți
8. **Student Preparation Page** — pregătire pre-plecare

**Admin CRM (lipsă):**
1. **Admin Students Page** — expandable detail panels per student cu tabs (Overview, Status, Messages, Documents, Activity)
2. **Admin Pipeline/Funnel** — vizualizare pipeline Kanban pe etape
3. **Admin Dashboard CRM** — KPIs live (lead-uri azi, revenue, conversie, pipeline chart, vânzări produse)
4. **Email Templates CRUD** — create/edit/delete/send templates cu variabile dinamice
5. **Email Sequences** — secvențe automate (welcome, eligibility, ikigai, abandoned cart)
6. **Admin Contracts Page** — managementul contractelor
7. **Admin HR Page** — resurse umane
8. **Admin Eligibility Stats** — statistici eligibilitate
9. **SMS Bulk Send** — trimitere SMS în masă

---

### Plan de Implementare (Prioritizat)

#### Faza 1 — Student Dashboard Redesign (E.D.U. Pipeline Complet)

**1.1 Redesign StudentJourney.tsx**
- Adaugă sub-pașii completi din reference (nu doar 3x3, ci design-ul real cu Discovery Call, AI Test Prep, Visa Guidance etc.)
- Welcome banner personalizat: "Welcome back, {name}! 👋"
- Next Step Card cu countdown timer și CTA dinamic
- Upcoming Tasks tabel cu date și statusuri

**1.2 Adaugă pagina StudentPreparation**
- Pre-departure checklist cu items: packing list, visa docs, accommodation confirmation
- Timeline vizuală cu date importante

**1.3 Adaugă pagina StudentReferral**  
- Formular de referral integrat cu tabelul `referrals`
- View referral-uri existente și status

#### Faza 2 — Admin CRM Complet

**2.1 Admin Students Page** (`/admin/students`)
- Lista tuturor studenților cu expandable panels
- Tabs per student: Overview (info + quiz results), Status (change E.D.U. phase), Messages (send/view), Documents (view uploaded), Activity (timeline)
- Necesită: query join profiles + applications + documents + messages

**2.2 Admin Dashboard CRM redesign** 
- KPIs: lead-uri azi, studenți activi, revenue (din orders), rata conversie
- Pipeline chart (contacts by status: new → contacted → qualified → converted)  
- Vânzări produse breakdown (ebook, audiobook, agent plan)
- Quick actions (send email, add contact, view pipeline)

**2.3 Email Templates CRUD** (`/admin/email-templates`)
- Necesită tabel nou `email_templates` (name, subject, html_content, category, created_at)
- Necesită tabel nou `email_sends` (template_id, recipient_email, status, sent_at)
- UI: CRUD cu dialog, preview HTML, send test, statistici
- Categorii: welcome, eligibility, ikigai, application, abandoned_cart, appointment, custom

**2.4 Admin Pipeline Kanban** (`/admin/pipeline`)
- Drag-and-drop pe coloane: New → Contacted → Qualified → Converted
- Bazat pe tabelul `contacts.status`

#### Faza 3 — Database Schema Changes

Tabele noi necesare:
```sql
-- Email Templates
CREATE TABLE email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  category text DEFAULT 'custom',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email Sends (tracking)
CREATE TABLE email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES email_templates(id),
  recipient_email text NOT NULL,
  status text DEFAULT 'sent',
  sent_at timestamptz DEFAULT now()
);
```

RLS: Admin-only pentru ambele tabele.

#### Faza 4 — Nav Updates

- Admin sidebar: adaugă Students, Pipeline, Email Templates
- Student sidebar: eventual adaugă Preparation, Referral

---

### Ce NU se poate porta direct

Repo-ul highticket folosește:
- **tRPC** (server-side) — noi folosim Supabase direct
- **Drizzle ORM** + SQLite — noi avem Supabase/Postgres
- **wouter** routing — noi avem react-router-dom

Deci tot codul trebuie **rescris/adaptat**, nu copiat. Dar design-ul și logica se pot replica.

---

### Ordinea recomandată

1. Student Dashboard redesign (E.D.U. pipeline complet + welcome + next step)
2. Admin Students page (cel mai important pentru CRM)
3. Admin Dashboard CRM (KPIs + pipeline chart)
4. Email Templates CRUD (cu tabele noi)
5. Admin Pipeline Kanban

