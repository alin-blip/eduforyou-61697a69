

## Twilio SMS Integration for Appointment Reminders

### What We're Building
1. Connect Twilio via the connector gateway
2. Create an edge function `send-sms` that sends SMS via the Twilio gateway
3. Create an edge function `send-appointment-reminders` that finds appointments happening tomorrow and sends reminder SMS
4. Schedule a daily cron job to trigger reminders automatically
5. Update `BookAppointment.tsx` to send an instant SMS confirmation when a phone number is provided

### Architecture

```text
Daily cron (pg_cron) → send-appointment-reminders edge fn
                         ↓
                    Query appointments (tomorrow)
                         ↓
                    For each with phone → send-sms edge fn
                         ↓
                    Twilio Gateway → SMS delivered
                         ↓
                    Log to sms_logs table
```

### Step-by-Step

**Step 1 — Connect Twilio**
Use `standard_connectors--connect` with `twilio` connector_id. This provides `TWILIO_API_KEY` and `LOVABLE_API_KEY` as environment variables.

**Step 2 — Create `send-sms` edge function**
- Gateway URL: `https://connector-gateway.lovable.dev/twilio`
- POST to `/Messages.json` with `To`, `From`, `Body` (form-urlencoded)
- Accepts: `{ to, message, recipientName? }`
- Logs result to `sms_logs` table (status: sent/failed)
- Returns success/error

**Step 3 — Create `send-appointment-reminders` edge function**
- Queries `appointments` table for `preferred_date = tomorrow` AND `status IN ('pending','confirmed')` AND `phone IS NOT NULL`
- Joins campus name via `campuses` table
- For each appointment, calls `send-sms` internally (or sends directly)
- Message template: "Hi {name}, reminder: your appointment at {campus} is tomorrow at {time}. — EduForYou"

**Step 4 — Schedule cron job**
- Enable `pg_cron` and `pg_net` extensions (migration)
- Insert cron schedule: daily at 10:00 AM UTC, calls `send-appointment-reminders`

**Step 5 — Instant SMS on booking**
- In `BookAppointment.tsx`, after successful insert, if phone is provided, invoke `send-sms` with confirmation message

**Step 6 — Config**
- Add both new functions to `supabase/config.toml` with `verify_jwt = false`
- The `send-sms` function will need a `TWILIO_PHONE_NUMBER` secret (the "From" number) — will use `add_secret` tool

### Files to Create/Modify
- `supabase/functions/send-sms/index.ts` — new
- `supabase/functions/send-appointment-reminders/index.ts` — new  
- `supabase/config.toml` — add 2 function entries
- `src/pages/BookAppointment.tsx` — add SMS confirmation call
- DB: enable `pg_cron`, `pg_net` extensions + insert cron schedule

