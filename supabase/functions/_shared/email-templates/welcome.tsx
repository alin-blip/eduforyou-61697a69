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
  Button,
} from 'npm:@react-email/components@0.0.22'

interface WelcomeEmailProps {
  fullName: string
  siteUrl?: string
}

export const WelcomeEmail = ({
  fullName,
  siteUrl = 'https://eduforyou.co.uk',
}: WelcomeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to EduForYou, {fullName}! Your university journey starts now.</Preview>
    <Body style={main}>
      <Container style={container}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
          <tr><td><div style={logoBox}><span style={logoSpan}>E</span></div></td></tr>
        </table>
        <Heading style={h1}>Welcome to EduForYou! 🎓</Heading>
        <Text style={text}>
          Hi {fullName || 'there'}, welcome aboard! We're thrilled to have you on your journey towards a UK university education.
        </Text>
        <Text style={text}>
          Here's what you can do now:
        </Text>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
          <tr>
            <td style={stepCell}>
              <strong style={{ color: '#E07B24' }}>1.</strong> Check your eligibility for Student Finance
            </td>
          </tr>
          <tr>
            <td style={stepCell}>
              <strong style={{ color: '#E07B24' }}>2.</strong> Explore 50+ accredited courses
            </td>
          </tr>
          <tr>
            <td style={stepCell}>
              <strong style={{ color: '#E07B24' }}>3.</strong> Book a free campus appointment
            </td>
          </tr>
        </table>
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td align="center">
              <Button href={`${siteUrl}/eligibilitate`} style={button}>
                Check Your Eligibility
              </Button>
            </td>
          </tr>
        </table>
        <Hr style={hr} />
        <Text style={text}>
          Our service is 100% free — from course selection to graduation. No hidden fees, ever.
        </Text>
        <Text style={footer}>
          EduForYou — You Dream. We Deliver.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = { backgroundColor: '#f4f5f7', fontFamily: "'Plus Jakarta Sans', 'Inter', Arial, sans-serif" }
const container = { backgroundColor: '#ffffff', padding: '40px 32px', borderRadius: '12px', margin: '40px auto', maxWidth: '480px' }
const logoBox = { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E07B24', textAlign: 'center' as const, lineHeight: '48px' }
const logoSpan = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold' as const }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#2B3E50', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#657180', lineHeight: '1.6', margin: '0 0 24px' }
const stepCell = { fontSize: '14px', color: '#2B3E50', padding: '8px 16px', lineHeight: '1.5' }
const button = { backgroundColor: '#E07B24', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '600' as const, textDecoration: 'none' }
const hr = { borderColor: '#eee', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '16px 0 0' }
