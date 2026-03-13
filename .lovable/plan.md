

# Ce urmează — Faza 3 & 4

## Status curent
- **Faza 1 (UI/Pagini publice):** Completă — toate paginile publice, i18n, design system
- **Faza 2 (Backend/Auth):** Completă — database, autentificare, roluri, dashboard-uri de bază

## Faza 3 — Dashboard-uri extinse

### 3.1 Admin Dashboard extins
- Management utilizatori: tabel cu toți userii, toggle roluri (admin/agent/student)
- Management contacte/leads cu filtre și status pipeline
- Management blog posts (CRUD din UI)
- Vizualizare quiz results și applications cu statistici

### 3.2 Agent Dashboard extins
- Sistem referral: link unic de referral, tracking conversii
- Tabel comisioane cu status plată
- Leaderboard agenți (top referrals)
- Materiale marketing descărcabile
- Profil agent editabil

### 3.3 Student Dashboard extins
- E.D.U. Journey complet cu sub-pași interactivi
- Upload documente (storage bucket pentru acte)
- CV Builder simplu
- Student Finance status tracker
- Notificări progres

## Faza 4 — Stripe Integration
- Activare Stripe prin tool-ul dedicat Lovable
- Checkout ebook (£5) și audiobook upsell (£7)
- Abonament agenți (Standard + VIP £97/lună)
- Success/Thank You pages cu download links
- Edge function pentru webhook handling

## Ordinea recomandată
1. Extinde Admin Dashboard (cel mai util imediat)
2. Extinde Agent + Student Dashboards
3. Activează Stripe și implementează plățile
4. Adaugă storage bucket pentru documente

Estimare: 3-4 iterații pentru a completa totul.

