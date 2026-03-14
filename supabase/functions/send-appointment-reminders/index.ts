import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    if (!TWILIO_API_KEY) throw new Error("TWILIO_API_KEY is not configured");

    const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
    if (!TWILIO_PHONE_NUMBER) throw new Error("TWILIO_PHONE_NUMBER is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get tomorrow's date in YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    // Fetch appointments for tomorrow with phone numbers
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("id, full_name, phone, preferred_time, campus_id, course_interest")
      .eq("preferred_date", tomorrowStr)
      .in("status", ["pending", "confirmed"])
      .not("phone", "is", null);

    if (error) throw error;

    if (!appointments || appointments.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: "No appointments for tomorrow" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch campus names
    const campusIds = [...new Set(appointments.map((a) => a.campus_id).filter(Boolean))];
    const { data: campuses } = await supabase
      .from("campuses")
      .select("id, name")
      .in("id", campusIds);

    const campusMap = new Map((campuses || []).map((c) => [c.id, c.name]));

    let sent = 0;
    let failed = 0;

    for (const appt of appointments) {
      const campusName = campusMap.get(appt.campus_id) || "our campus";
      const timeStr = appt.preferred_time || "your scheduled time";
      const body = `Hi ${appt.full_name}, reminder: your appointment at ${campusName} is tomorrow at ${timeStr}. — EduForYou`;

      try {
        const response = await fetch(`${GATEWAY_URL}/Messages.json`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": TWILIO_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: appt.phone!,
            From: TWILIO_PHONE_NUMBER,
            Body: body,
          }),
        });

        const data = await response.json();
        const status = response.ok ? "sent" : "failed";

        await supabase.from("sms_logs").insert({
          recipient_phone: appt.phone!,
          recipient_name: appt.full_name,
          message: body,
          status,
          provider_id: data.sid || null,
          error_message: response.ok ? null : JSON.stringify(data),
        });

        if (response.ok) sent++;
        else failed++;
      } catch (err) {
        console.error(`Failed to send SMS to ${appt.phone}:`, err);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed, total: appointments.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-appointment-reminders:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
