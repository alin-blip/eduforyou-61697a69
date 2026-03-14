

## Diagnoză

Problema are mai multe cauze:

1. **Doar un singur utilizator are roluri** -- `alinflorinradu@icloud.com` are toate cele 3 roluri (admin, agent, student). Celălalt cont (`radusarahmaria@gmail.com`) nu are niciun rol, deci `ProtectedRoute` îl redirecționează la `/`.

2. **Nu există trigger pentru atribuirea automată a rolului `student`** la signup. Când cineva creează un cont, nu primește niciun rol în `user_roles`.

3. **Race condition la login** -- `Login.tsx` face `navigate('/')` imediat după autentificare, dar rolurile se încarcă asincron cu `setTimeout`. Dacă utilizatorul navighează manual la `/student`, `ProtectedRoute` poate verifica rolurile înainte să fie încărcate.

4. **Login-ul redirecționează mereu la `/`** (Index), nu la dashboard-ul corespunzător rolului.

## Plan de implementare

### 1. Migrare DB: Trigger pentru rol implicit `student`
- Creare trigger `on_auth_user_created` care inserează automat rolul `student` în `user_roles` la fiecare signup nou
- Atribuire retroactivă rol `student` pentru utilizatorii existenți fără niciun rol

### 2. Fix AuthContext -- eliminare race condition
- Înlocuire `setTimeout(() => fetchRoles(...), 0)` cu apel direct `await fetchRoles()`
- Asigurare că `loading` rămâne `true` până când și rolurile sunt încărcate, nu doar sesiunea

### 3. Fix Login.tsx -- redirect inteligent la dashboard
- După login reușit, redirecționare la dashboard-ul corespunzător rolului (admin → `/admin`, agent → `/agent`, student → `/student`) în loc de `/`
- Așteptare ca rolurile să fie disponibile înainte de redirect (folosind un efect care monitorizează `roles` din `useAuth`)

### 4. Fix ProtectedRoute -- loading state corect
- Verificare că nu redirecționează la `/` cât timp rolurile nu au fost încă încărcate (distinție între "nu are rol" și "rolurile nu s-au încărcat încă")

