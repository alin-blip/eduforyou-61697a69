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

interface ContactConfirmationEmailProps {
  fullName: string
  subject?: string
  message: string
}

export const ContactConfirmationEmail = ({
  fullName,
  subject,
  message,
}: ContactConfirmationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We've received your message, {fullName}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
          <tr><td><div style={logoBox}><span style={logoSpan}>E</span></div></td></tr>
        </table>
        <Heading style={h1}>Thank you for reaching out!</Heading>
        <Text style={text}>
          Hi {fullName}, we've received your message and our team will get back to you within 24 hours.
        </Text>
        {subject && (
          <Text style={detailText}>
            <strong>Subject:</strong> {subject}
          </Text>
        )}
        <Text style={detailText}>
          <strong>Your message:</strong>
        </Text>
        <Text style={quoteStyle}>
          {message}
        </Text>
        <Hr style={hr} />
        <Text style={text}>
          In the meantime, feel free to explore our courses or check your eligibility on our website.
        </Text>
        <Text style={footer}>
          EduForYou — Your University Journey Starts Here
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ContactConfirmationEmail

const main = { backgroundColor: '#f4f5f7', fontFamily: "'Plus Jakarta Sans', 'Inter', Arial, sans-serif" }
const container = { backgroundColor: '#ffffff', padding: '40px 32px', borderRadius: '12px', margin: '40px auto', maxWidth: '480px' }
const logoBox = { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E07B24', textAlign: 'center' as const, lineHeight: '48px' }
const logoSpan = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold' as const }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#2B3E50', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#657180', lineHeight: '1.6', margin: '0 0 24px' }
const detailText = { fontSize: '14px', color: '#2B3E50', lineHeight: '1.5', margin: '0 0 8px' }
const quoteStyle = { fontSize: '14px', color: '#657180', lineHeight: '1.5', margin: '0 0 24px', padding: '12px 16px', backgroundColor: '#f4f5f7', borderRadius: '8px', borderLeft: '3px solid #E07B24' }
const hr = { borderColor: '#eee', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '16px 0 0' }
