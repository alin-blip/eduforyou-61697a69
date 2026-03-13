import { createClient } from 'npm:@supabase/supabase-js@2'
import { render } from 'npm:@react-email/render@0.0.12'
import { ContactConfirmationEmail } from '../_shared/email-templates/contact-confirmation.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Validate request
    const { recipientEmail, fullName, subject, message } = await req.json()
    if (!recipientEmail || !fullName || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Render email template
    const html = render(
      ContactConfirmationEmail({ fullName, subject, message })
    )

    const messageId = `contact-confirm-${crypto.randomUUID()}`

    // Create service role client to enqueue
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check suppression list
    const { data: suppressed } = await supabase
      .from('suppressed_emails')
      .select('id')
      .eq('email', recipientEmail)
      .limit(1)

    if (suppressed && suppressed.length > 0) {
      // Log as suppressed
      await supabase.from('email_send_log').insert({
        message_id: messageId,
        template_name: 'contact-confirmation',
        recipient_email: recipientEmail,
        status: 'suppressed',
        metadata: { fullName, subject },
      })

      return new Response(
        JSON.stringify({ success: true, suppressed: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log as pending
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: 'contact-confirmation',
      recipient_email: recipientEmail,
      status: 'pending',
      metadata: { fullName, subject },
    })

    // Enqueue to transactional queue
    await supabase.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      message_body: JSON.stringify({
        message_id: messageId,
        to: recipientEmail,
        subject: 'We received your message — EduForYou',
        html,
        from: 'EduForYou <noreply@notify.eduforyou.co.uk>',
      }),
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending contact confirmation:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
