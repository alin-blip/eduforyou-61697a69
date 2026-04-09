

# Audit General: Eligibilitate, Ikigai & Zona de Membri

## Probleme Identificate

### 1. CRITIC: Categoriile din Ikigai Quiz nu se potrivesc cu cursurile
Ikigai Quiz folosește tag-uri: `Psychology`, `Health`, `Business`, `Technology`, `Construction`
Cursurile din `courses.ts` folosesc categorii: `Business`, `Computing & IT`, `Engineering`, `Psychology`, `Health & Social Care`, `Construction`, `Law`, `Marketing`, `Accounting & Finance`, `Project Management`, `Human Resources`

**Nepotriviri:**
- `Technology` (Ikigai) ≠ `Computing & IT` (cursuri) → **0 rezultate returnate**
- `Health` (Ikigai) ≠ `Health & Social Care` (cursuri) → **0 rezultate returnate**
- Categoriile `Law`, `Marketing`, `Accounting & Finance`, `Project Management`, `Human Resources`, `Engineering` nu sunt acoperite de Ikigai deloc

**Fix:** Actualizez tag-urile din Ikigai Quiz să folosească exact categoriile din `courses.ts` și adaug opțiuni pentru categoriile lipsă.

### 2. CRITIC: Eligibility Quiz - categoriile de cursuri sunt hardcoded și incomplete
Eligibility.tsx (linia 31-38) are doar 7 opțiuni hardcoded (`Business & Management`, `Computing & Technology`, etc.) care nu se potrivesc cu cele 11 categorii reale din `courses.ts`.

**Fix:** Generez lista de cursuri dinamic din `coursesData` + adaug "Not Sure Yet".

### 3. MEDIU: Build errors — AdminJobPage.tsx
`fadeUp` variant folosește `ease: 'easeOut'` ca string, dar TypeScript cere tipul `Easing`. Fix simplu: cast la `as const` sau folosește array.

### 4. MEDIU: Build errors — AdminCourses.tsx
`emptyCourse` nu include toate câmpurile din interfața `Course` (lipsesc `studyMode`, `fees`, `intakes`, `entryRequirements`, etc.).

**Fix:** Adaug toate câmpurile lipsă cu valori default.

### 5. LOW: Fluxul eligibilitate → cont → zona de membri
Fluxul actual funcționează: eligibilitate → creare cont → verificare email → login → redirect `/student`. 
**Problemă:** După creare cont, utilizatorul trebuie să verifice email-ul, apoi să navigheze manual la `/login`. Nu există redirect automat sau link direct.

**Fix:** Adaug buton "Go to Login" după crearea contului.

---

## Plan de Implementare

### Pas 1: Fix build errors (AdminJobPage + AdminCourses)
- `AdminJobPage.tsx`: Schimb `ease: 'easeOut'` în `ease: [0.0, 0.0, 0.2, 1] as const` (cubic-bezier equivalent)
- `AdminCourses.tsx`: Adaug câmpurile lipsă la `emptyCourse`

### Pas 2: Sincronizare categorii Ikigai Quiz cu cursurile reale
Actualizez `IkigaiQuiz.tsx`:
- `Technology` → `Computing & IT`
- `Health` → `Health & Social Care`
- Adaug opțiuni noi pentru `Law`, `Marketing`, `Accounting & Finance`, `Engineering`, `Project Management`, `Human Resources`
- Adaug întrebări/opțiuni relevante pentru aceste categorii

### Pas 3: Dinamizare lista cursuri în Eligibility
Înlocuiesc `courseOptions` hardcoded cu categorii extrase din `coursesData` + "Not Sure Yet".

### Pas 4: Îmbunătățire flux post-eligibilitate
Adaug link "Mergi la Login" după crearea contului, pentru navigare directă la zona de membri.

