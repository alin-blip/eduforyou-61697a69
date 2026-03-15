import { createClient } from 'npm:@supabase/supabase-js@2'
import { render } from 'npm:@react-email/render@0.0.12'
import { ContactConfirmationEmail } from '../_shared/email-templates/contact-confirmation.tsx'
import { AppointmentConfirmationEmail } from '../_shared/email-templates/appointment-confirmation.tsx'
import { WelcomeEmail } from '../_shared/email-templates/welcome.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const FROM_ADDRESS = 'EduForYou <noreply@notify.eduforyou.co.uk>'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json()
    const { template, ...data } = body

    if (!template) {
      return new Response(
        JSON.stringify({ error: 'Missing template type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let html: string
    let subject: string
    let recipientEmail: string
    let templateName: string
    let metadata: Record<string, unknown> = {}

    switch (template) {
      case 'contact-confirmation': {
        const { recipientEmail: email, fullName, subject: msgSubject, message } = data
        if (!email || !fullName || !message) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
        recipientEmail = email
        templateName = 'contact-confirmation'
        subject = 'We received your message — EduForYou'
        metadata = { fullName, subject: msgSubject }
        html = render(ContactConfirmationEmail({ fullName, subject: msgSubject, message }))
        break
      }

      case 'appointment-confirmation': {
        const { recipientEmail: email, fullName, campusName, courseInterest, preferredDate, preferredTime } = data
        if (!email || !fullName) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
        recipientEmail = email
        templateName = 'appointment-confirmation'
        subject = `Your appointment at ${campusName} is confirmed — EduForYou`
        metadata = { fullName, campusName, preferredDate, preferredTime }
        html = render(AppointmentConfirmationEmail({ fullName, campusName, courseInterest, preferredDate, preferredTime }))
        break
      }

      case 'welcome': {
        const { recipientEmail: email, fullName } = data
        if (!email) {
          return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
        recipientEmail = email
        templateName = 'welcome'
        subject = 'Welcome to EduForYou! Your journey starts now 🎓'
        metadata = { fullName }
        html = render(WelcomeEmail({ fullName }))
        break
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown template: ${template}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Check suppression list
    const { data: suppressed } = await supabase
      .from('suppressed_emails')
      .select('id')
      .eq('email', recipientEmail)
      .limit(1)

    const messageId = `${templateName}-${crypto.randomUUID()}`

    if (suppressed && suppressed.length > 0) {
      await supabase.from('email_send_log').insert({
        message_id: messageId,
        template_name: templateName,
        recipient_email: recipientEmail,
        status: 'suppressed',
        metadata,
      })
      return new Response(JSON.stringify({ success: true, suppressed: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Log as pending
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: recipientEmail,
      status: 'pending',
      metadata,
    })

    // Enqueue
    await supabase.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload: JSON.stringify({
        message_id: messageId,
        to: recipientEmail,
        subject,
        html,
        from: FROM_ADDRESS,
        purpose: "transactional",
        label: templateName,
      }),
    })

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Error sending transactional email:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
