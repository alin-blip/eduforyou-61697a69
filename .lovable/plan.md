

## Analiza: Ce lipseste din GitHub `alin-blip/highticket` vs proiectul actual

Am analizat complet repository-ul GitHub. Acesta este o platforma Node.js/tRPC/SQLite cu ~60+ pagini, in timp ce proiectul Lovable actual are versiuni simplificate ale dashboard-urilor. **Nu se pot copia direct** fiindca folosesc tRPC, wouter, DashboardLayout si hooks complet diferite. Totul trebuie rescris pentru Supabase + React Router.

### Ce exista in GitHub si lipseste/este simplificat aici

**Student (13+ pagini in GitHub vs 1 in Lovable):**
- EDUDashboard cu E.D.U. pipeline complet (Evaluate/Deliver/Unlock cu sub-pasi detaliati)
- StudentMessages (inbox cu reply), StudentPreparation (test prep AI)
- SkillScanner, IkigaiApply, FreedomLaunchpad (7 wizard tools: DefineYourPath, OfferBuilder, ProfileBuilder, OutreachGenerator, GigJobBuilder, FreedomPlanExport)
- Subdirectoare: edu/, test-prep/, wizard/

**Admin (12+ pagini vs 1):**
- AdminContacts, AdminStudents (cu management complet), AdminCourses, AdminContracts
- AdminEmailTemplates (CRUD + bulk send), AdminHr, AdminUsers (role management)
- Paginile existente (Appointments, SMS, AbandonedCarts, Campuses) sunt tab-uri simple, nu pagini complete

**Agent (10 pagini vs 1):**
- AgentCommissions, AgentLeaderboard, AgentStudents, AgentProfile
- AgentMaterials, AgentCourseIncome, AgentCourseInfo, AgentCourseVideouriAI, AgentVipCourses

**CEO (15+ pagini vs 1):**
- CeoSales, CeoTasks, CeoOkrs, CeoAgents, CeoAnalytics
- CeoAiChat, CeoCmo, CeoCmoReview, CeoContent, CeoContentCalendar, CeoContentStudio
- CeoAgentPlatform, CeoApprovals, CeoWorkflows, CeoCandidates, CeoHr

### Plan de implementare (in faze)

Datorita volumului enorm (~50+ pagini lipsa), propun implementare in faze. Fiecare faza va fi un mesaj separat.

#### Faza 1 -- Student Dashboard complet (prioritate maxima)
1. **Creare DashboardLayout** -- sidebar component reutilizabil cu navigare (inlocuieste DashboardLayout din tRPC)
2. **Rebuild EDUDashboard** -- pipeline E.D.U. complet cu 3 faze si 12 sub-pasi, progress bar, next step CTA, gamification bar
3. **StudentMessages** -- inbox cu mesaje, reply (necesita tabela `messages` in DB)
4. **StudentPreparation** -- test prep cu AI (folosind Lovable AI / Gemini)
5. **Rute noi** -- `/student/dashboard`, `/student/messages`, `/student/preparation`, `/student/documents`, `/student/finance`, `/student/profile`

#### Faza 2 -- Admin Dashboard complet
1. **AdminContacts** -- lista contacte cu search/filter, detail panel
2. **AdminStudents** -- management studenti cu tabs (Overview, Status, Messages, Documents, Activity)
3. **AdminCourses** -- CRUD cursuri
4. **AdminEmailTemplates** -- CRUD template-uri email
5. **AdminUsers** -- management roluri utilizatori
6. Navigare sidebar consistenta pe toate paginile admin

#### Faza 3 -- Agent Dashboard complet
1. **AgentDashboard** -- stats, referrals, comisioane
2. **AgentCommissions + AgentLeaderboard** -- conectate la date reale din Supabase
3. **AgentStudents** -- lista studentilor referiti
4. **AgentProfile** -- view/edit profil agent

#### Faza 4 -- CEO Dashboard + AI
1. **CeoDashboard** -- KPI-uri, sales, analytics
2. **CeoTasks + CeoOkrs** -- management taskuri si OKR-uri (tabelele exista deja)
3. **CeoContent + CeoCmo** -- content studio cu AI (Lovable AI / Gemini)
4. **CeoAgents** -- management agenti AI

#### Faza 5 -- Freedom Launchpad (wizard tools)
1. **FreedomLaunchpad** -- hub page
2. **DefineYourPath, OfferBuilder, ProfileBuilder** -- wizard tools cu AI
3. **OutreachGenerator, GigJobBuilder, FreedomPlanExport** -- restul wizard tools

### Migrari DB necesare (Faza 1)
- Tabela `messages` (sender_id, receiver_id, content, read, created_at) cu RLS
- Posibil tabela `edu_applications` pentru tracking pipeline steps detaliat

### Nota tehnica
Fiecare pagina din GitHub foloseste `trpc.xxx.query()` -- in Lovable vom folosi `supabase.from('table').select()`. Layoutul foloseste `DashboardLayout` cu sidebar -- vom crea un component echivalent. Rutarea foloseste `wouter` -- vom folosi `react-router-dom`.

**Recomandare**: Sa incepem cu Faza 1 (Student Dashboard) fiindca acesta este cel care nu functioneaza acum.

