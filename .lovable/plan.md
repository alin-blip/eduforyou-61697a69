

## Status Review: What's Done vs What's Missing

### Completed (Phases 1-6)
- **Phase 1**: Core pages, auth, profiles, contacts, applications, blog, quiz
- **Phase 2**: Booking wizard (4 steps), campuses, appointments, SMS logs, abandoned carts
- **Phase 3**: Student EDU journey, gamification widget, CV builder
- **Phase 4**: CEO AI dashboard with OKRs, tasks, AI engine (Gemini)
- **Phase 5**: SEO (SEOHead on major pages), Meta Pixel + GA4 tracking, i18n (EN/RO/HU/PL)
- **Phase 6**: Agent leaderboard RPC function + leaderboard tab

### Still Missing / Incomplete

#### 1. Book Appointment CTA buttons missing from Header and course pages
The `/book-appointment` route exists but there are no visible CTAs linking to it from the Header or CourseDetail pages. Users can't discover the booking wizard.

#### 2. Stripe payments (Ebook £5, Audiobook £7, Agent subscription £97/mo)
Per the roadmap, Stripe is the final phase. The Ebook page has a "Buy Now" button but no actual payment integration. Need to enable Stripe and wire up checkout for:
- Ebook purchase (one-time £5)
- Audiobook purchase (one-time £7)  
- Agent monthly subscription (£97/mo)

#### 3. Email notification triggers
Edge functions for email exist (`send-transactional-email`, `process-email-queue`) but no automated triggers are wired:
- Appointment confirmation email after booking
- Application status change notifications
- Welcome email on signup

#### 4. SMS integration (Twilio)
The `sms_logs` table exists but there's no actual SMS sending capability. Would need Twilio connector for appointment reminders and notifications.

#### 5. Cookie banner → GDPR tracking consent logic
`CookieBanner` exists but likely doesn't gate Meta Pixel / GA4 initialization based on consent.

#### 6. Missing SEOHead on remaining pages
SEOHead was added to Index, Courses, Blog, Locations, Contact, About, Eligibility — but missing from: CourseDetail, BlogPost, Ebook, Webinar, Careers, Reviews, BookAppointment, FinanceCalculator.

#### 7. Admin dashboard: email/notification management tab
No UI for managing or viewing email queue, sent emails, or composing bulk communications.

#### 8. Profile creation trigger on signup
No database trigger to auto-create a `profiles` row when a user signs up. Students must manually have profiles created.

### Recommended Priority Order

| Priority | Task | Complexity |
|----------|------|------------|
| 1 | Add "Book Appointment" CTA to Header + course pages | Small |
| 2 | Auto-create profile on signup (DB trigger) | Small |
| 3 | SEOHead on remaining pages | Small |
| 4 | Cookie consent → gate tracking scripts | Medium |
| 5 | Email notification triggers (appointment confirm, welcome) | Medium |
| 6 | Stripe payments (Ebook, Audiobook, Agent sub) | Large |
| 7 | Twilio SMS integration | Large |

### Implementation Approach

**Step 1 — Quick wins (items 1-4):**
- Add `Book Appointment` button in Header nav and as CTA on CourseDetail
- Create a DB trigger: `ON INSERT INTO auth.users → INSERT INTO profiles`
- Add SEOHead to all remaining public pages
- Update TrackingProvider to check cookie consent before initializing pixels

**Step 2 — Email automation (item 5):**
- Wire the existing `send-transactional-email` edge function to fire on appointment creation (DB trigger or client-side call)
- Add welcome email on signup via auth hook

**Step 3 — Stripe (item 6):**
- Enable Stripe via Lovable tool
- Create checkout edge functions for Ebook/Audiobook one-time payments
- Create subscription flow for Agent portal

**Step 4 — SMS (item 7):**
- Connect Twilio via connector
- Create edge function for sending appointment reminder SMS

