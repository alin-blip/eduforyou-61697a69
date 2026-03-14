/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface AppointmentConfirmationEmailProps {
  fullName: string
  campusName: string
  courseInterest: string
  preferredDate: string
  preferredTime: string
}

export const AppointmentConfirmationEmail = ({
  fullName,
  campusName,
  courseInterest,
  preferredDate,
  preferredTime,
}: AppointmentConfirmationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your appointment at {campusName} is confirmed, {fullName}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
          <tr><td><div style={logoBox}><span style={logoSpan}>E</span></div></td></tr>
        </table>
        <Heading style={h1}>Appointment Confirmed! 🎉</Heading>
        <Text style={text}>
          Hi {fullName}, your appointment has been booked successfully. Here are your details:
        </Text>
        <table width="100%" cellPadding="0" cellSpacing="0" style={detailsTable}>
          <tr>
            <td style={labelCell}>📍 Campus</td>
            <td style={valueCell}>{campusName}</td>
          </tr>
          <tr>
            <td style={labelCell}>📚 Course</td>
            <td style={valueCell}>{courseInterest}</td>
          </tr>
          <tr>
            <td style={labelCell}>📅 Date</td>
            <td style={valueCell}>{preferredDate}</td>
          </tr>
          <tr>
            <td style={labelCell}>🕐 Time</td>
            <td style={valueCell}>{preferredTime}</td>
          </tr>
        </table>
        <Hr style={hr} />
        <Text style={text}>
          One of our advisors will be ready to welcome you. If you need to reschedule, simply reply to this email or contact us.
        </Text>
        <Text style={text}>
          Don't forget to bring a valid ID document to your appointment.
        </Text>
        <Text style={footer}>
          EduForYou — You Dream. We Deliver.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default AppointmentConfirmationEmail

const main = { backgroundColor: '#f4f5f7', fontFamily: "'Plus Jakarta Sans', 'Inter', Arial, sans-serif" }
const container = { backgroundColor: '#ffffff', padding: '40px 32px', borderRadius: '12px', margin: '40px auto', maxWidth: '480px' }
const logoBox = { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E07B24', textAlign: 'center' as const, lineHeight: '48px' }
const logoSpan = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold' as const }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#2B3E50', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#657180', lineHeight: '1.6', margin: '0 0 24px' }
const detailsTable = { backgroundColor: '#f4f5f7', borderRadius: '8px', padding: '4px', marginBottom: '24px', borderCollapse: 'collapse' as const }
const labelCell = { fontSize: '14px', color: '#657180', padding: '10px 16px', borderBottom: '1px solid #eee', width: '120px' }
const valueCell = { fontSize: '14px', color: '#2B3E50', fontWeight: '600' as const, padding: '10px 16px', borderBottom: '1px solid #eee' }
const hr = { borderColor: '#eee', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '16px 0 0' }
