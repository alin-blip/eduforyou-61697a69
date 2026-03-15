

# Audit complet post-merge

## Probleme identificate

### 1. CRITIC: Email-urile blocate in coadă (transactional_emails)
- **6 mesaje stuck** cu `read_ct` între 994-1699 (reîncercate de sute de ori)
- **Cauza**: `send-transactional-email` nu setează `purpose: "transactional"` și `label` în payload-ul trimis la coadă
- **Eroarea**: `"Only transactional emails are supported. Set purpose to \"transactional\""`
- **Fix**: Adaugă `purpose: "transactional"` și `label: templateName` în obiectul enqueued (linia 116-122 din `send-transactional-email/index.ts`)
- **Cleanup**: Ștergerea celor 6 mesaje blocate din coadă (au fost reîncercate de ~1000+ ori fără succes)

### 2. MEDIU: `ceo_agent_messages` - coloana `source` lipsește
- Pagina `CeoAiChat.tsx` face insert cu `source: 'ceo_chat'` și delete cu `.eq('source', 'ceo_chat')`, dar tabelul nu are coloana `source`
- **Fix**: Adaugă coloana `source text` la tabelul `ceo_agent_messages` prin migrare

### 3. MEDIU: `CeoAiChat.tsx` nu trimite `messages` array la edge function
- Pagina trimite `{ type: 'chat', message: userMessage }` (un singur string `message`)
- Edge function-ul așteaptă `body.messages` (array) — fix-ul anterior a adăugat `Array.isArray(body.messages) ? body.messages : []`, deci se trimite un array gol
- **Rezultat**: AI-ul nu primește istoricul conversației, fiecare mesaj este izolat
- **Fix**: Trimite `messages` array din state în loc de `message` string, sau construiește array-ul corect

### 4. LOW: Triggers pe `auth.users` — OK
- `on_auth_user_created` → `handle_new_user()` (creează profil) ✅
- `on_auth_user_created_assign_role` → `assign_default_student_role()` ✅
- 5 user_roles, 3 profiles — funcționează

### 5. LOW: `check-subscription` — funcționează acum
- Logurile recente arată succes, nu mai sunt erori `Invalid time value`
- Stripe API version `2025-08-27.basil` — fix-ul anterior pentru date parsing este activ ✅

### 6. INFO: Structura DB completă
- Toate cele 54 tabele sunt prezente ✅
- RLS policies sunt configurate pe toate tabelele ✅

---

## Plan de implementare

### Pas 1: Fix email queue — adaugă `purpose` și `label`
Editez `supabase/functions/send-transactional-email/index.ts` linia 116-122:
```ts
payload: JSON.stringify({
  message_id: messageId,
  to: recipientEmail,
  subject,
  html,
  from: FROM_ADDRESS,
  purpose: "transactional",
  label: templateName,
}),
```

### Pas 2: Cleanup mesaje blocate din coadă
Migrare SQL:
```sql
SELECT pgmq.delete('transactional_emails', msg_id) 
FROM pgmq.q_transactional_emails 
WHERE msg_id IN (1,2,3,4,5,6);
```

### Pas 3: Adaugă coloana `source` la `ceo_agent_messages`
```sql
ALTER TABLE public.ceo_agent_messages ADD COLUMN source text;
```

### Pas 4: Fix `CeoAiChat.tsx` — trimite conversation history
Actualizez `sendMessage()` să trimită array-ul `messages` în loc de un singur `message` string, pentru ca AI-ul să aibă context conversațional.

