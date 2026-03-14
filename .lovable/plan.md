
Obiectiv: repar blocajul de autentificare (rămâne pe /login), redirect-ul la index când apeși Dashboard și Sign Out care pare “mort”.

Diagnostic (confirmat):
- Utilizatorul este autentificat (header arată Dashboard + Sign Out), dar rămâne pe /login.
- `fetchRoles` pornește, dar nu mai returnează rezultat.
- În `AuthContext`, `onAuthStateChange` face `await fetchRoles(...)` în callback-ul auth.
- Do I know what the issue is? Da: callback-ul auth este blocat de apeluri async în interior, ceea ce poate bloca fluxul de sesiune (efect în lanț: roluri goale, redirect greșit, signOut care nu finalizează vizibil).

Plan de implementare

1) Refactor critic în `src/contexts/AuthContext.tsx`
- Transform callback-ul `onAuthStateChange` în non-async.
- Mut încărcarea rolurilor/subscription în execuție deferată (după callback), fără `await` direct în handler-ul auth.
- Introduc stare explicită pentru încărcarea rolurilor (ex: `rolesLoading` / `rolesResolved`) separată de `loading` auth.
- Fac reset determinist pe SIGNED_OUT (user/session/roles/subscription) ca UI-ul să reacționeze instant.

2) Hardening pentru sign out (aceeași zonă AuthContext)
- `signOut` va avea tratare de eroare + cleanup local defensiv (nu depinde doar de callback-ul auth pentru a ascunde butonul Logout).
- Elimin efectul de “butonul nu face nimic” chiar dacă rețeaua întârzie.

3) Corectare logică redirect login în `src/pages/Login.tsx`
- Redirectul către dashboard rulează doar când auth + roluri sunt rezolvate, nu doar când `roles.length > 0`.
- Pentru caz anormal (utilizator fără rol), afișez feedback clar și fallback controlat (nu buclă pe /login).

4) Corectare acces Dashboard în `src/components/layout/Header.tsx` și `src/components/ProtectedRoute.tsx`
- Header: nu calculează agresiv `/student` când rolurile încă nu sunt încărcate.
- ProtectedRoute: dacă user există dar rolurile nu sunt încă rezolvate, arată loader, nu redirect prematur la `/`.
- Păstrez prioritatea existentă de roluri (admin > agent > student) ca să nu schimb comportamentul business.

5) Curățenie și stabilitate
- Scot logurile temporare de debug după validare.
- Verific că nu rămâne niciun flux care setează `loading=false` înainte de finalizarea stării auth+roles.

Validare după implementare (end-to-end)
- Login cu contul tău: trebuie să plece automat din /login către dashboard corect.
- Click pe Dashboard din header: trebuie să intre în /admin (sau rolul prioritar), fără redirect la /.
- Click pe Sign Out: trebuie să dispară imediat starea de user logat și să rămână pe /login cu buton Sign In.
- Reîmprospătare pagină după login: sesiunea + rolurile se rehidratează fără blocaj.

Detalii tehnice (pe scurt)
- Fără schimbări de DB/RLS pentru fixul principal (datele de rol există deja și trigger-ele sunt prezente).
- Bug-ul este de orchestrare frontend auth-state, nu de permisiuni backend.
- Fișiere țintă:  
  - `src/contexts/AuthContext.tsx`  
  - `src/pages/Login.tsx`  
  - `src/components/layout/Header.tsx`  
  - `src/components/ProtectedRoute.tsx`
