

# Freedom Launchpad - Plan de implementare

## Ce este Freedom Launchpad
Un set de 6 module wizard interactive integrate in Student Dashboard care ghidează studenții prin:
1. **Skill Scanner** - AI analizează experiențele și identifică competențe monetizabile
2. **Ikigai Builder** - Generare poziționare unică bazată pe conceptul Ikigai (cu vizualizare cercuri)
3. **Offer Builder** - Creare pachete de servicii (Starter/Standard/Premium) cu pricing AI
4. **Profile Builder** - Generare profiluri optimizate pentru Facebook, Instagram, LinkedIn, TikTok
5. **Outreach Generator** - Template-uri de mesaje pentru LinkedIn, Email, WhatsApp
6. **Freedom Plan Export** - Export PDF/DOCX cu toate datele din cele 5 module

Codul există deja în proiectul [Freedom Path Planner](/projects/e68e154a-8118-4fe2-a4f4-e035f59881d7) și va fi adaptat la arhitectura curentă.

---

## Componente de portat si adaptat

### Database (5 tabele noi + RLS)
- `skill_entries` (user_id, skill, category, confidence, description)
- `ikigai_results` (user_id, what_you_love, what_youre_good_at, what_world_needs, what_you_can_be_paid_for, ikigai_statements, service_angles)
- `offers` (user_id, smv, target_market, pricing_justification, starter/standard/premium_package)
- `social_profiles` (user_id, platform, bio, headline, about, hashtags, content_pillars, cta, username_suggestions)
- `outreach_templates` (user_id, platform, templates, sequence_suggestion, response_rate_tips)

Toate cu RLS: userii pot CRUD doar propriile date.

### Edge Functions (5 noi)
- `skill-scanner` - folosește Lovable AI pentru analiza competențelor
- `ikigai-builder` - generare Ikigai positioning
- `offer-builder` - generare pachete de servicii
- `profile-builder` - generare profiluri sociale
- `outreach-generator` - generare template-uri outreach

### Pagini wizard (6 noi in `src/pages/wizard/`)
Adaptate de la `MainLayout` la `DashboardLayout` (student sidebar):
- `SkillScanner.tsx` (~630 linii)
- `IkigaiBuilder.tsx` (~549 linii)
- `OfferBuilder.tsx` (~605 linii)
- `ProfileBuilder.tsx` (~709 linii)
- `OutreachGenerator.tsx` (~646 linii)
- `FreedomPlanExport.tsx` (~353 linii)

Hub page: `DefineYourPath.tsx` - dashboard cu progresul fiecărui modul.

### Componente suport (4 noi)
- `src/components/ikigai/IkigaiCircles.tsx` - vizualizare Ikigai
- `src/components/gigs/GigJobBuilder.tsx`, `GigJobCard.tsx`, `GigJobDialog.tsx`

### Adaptări necesare
- Înlocuire `MainLayout` → inline (fără layout wrapper, deoarece `DashboardLayout` e deja aplicat de `StudentDashboard`)
- Înlocuire `useAuth` de la `@/lib/auth` → `@/contexts/AuthContext`
- Înlocuire `useI18n` de la `@/lib/i18n` → texte hardcodate (proiectul curent nu are același sistem i18n)
- Înlocuire `useFeatureGating` → eliminare (nu există în proiectul curent)
- Rute noi în `StudentDashboard.tsx` sub `/student/launchpad/*`

### Rute noi în StudentDashboard
```
/student/launchpad       → DefineYourPath (hub)
/student/launchpad/skills → SkillScanner
/student/launchpad/ikigai → IkigaiBuilder
/student/launchpad/offer  → OfferBuilder
/student/launchpad/profile → ProfileBuilder
/student/launchpad/outreach → OutreachGenerator
/student/launchpad/export → FreedomPlanExport
```

Nav item nou în sidebar: `{ title: 'Launchpad', url: '/student/launchpad', icon: Rocket }`

---

## Ordinea de implementare
1. Creare tabele database + RLS policies
2. Creare cele 5 edge functions (portat + adaptat la Lovable AI gateway)
3. Creare componente suport (IkigaiCircles, GigJobBuilder)
4. Creare cele 7 pagini wizard (adaptat importuri, layout, i18n)
5. Integrare rute în StudentDashboard + sidebar nav

Aceasta este o implementare mare (~4000+ linii de cod) care va fi făcută în pași.

