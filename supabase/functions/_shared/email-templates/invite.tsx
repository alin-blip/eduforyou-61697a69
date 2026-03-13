/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to join EduForYou</Preview>
    <Body style={main}>
      <Container style={container}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}><tr><td><div style={logoBox}><span style={logoSpan}>E</span></div></td></tr></table>
        <Heading style={h1}>You've been invited!</Heading>
        <Text style={text}>
          You've been invited to join{' '}
          <Link href={siteUrl} style={link}><strong>EduForYou</strong></Link>
          . Click below to accept and start your university journey.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={footer}>
          If you weren't expecting this invitation, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#f4f5f7', fontFamily: "'Plus Jakarta Sans', 'Inter', Arial, sans-serif" }
const container = { backgroundColor: '#ffffff', padding: '40px 32px', borderRadius: '12px', margin: '40px auto', maxWidth: '480px' }
const logoBox = { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E07B24', textAlign: 'center' as const, lineHeight: '48px' }
const logoSpan = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold' as const }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#2B3E50', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#657180', lineHeight: '1.6', margin: '0 0 24px' }
const link = { color: '#E07B24', textDecoration: 'underline' }
const button = { backgroundColor: '#E07B24', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '12px', padding: '14px 28px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#999999', margin: '32px 0 0', borderTop: '1px solid #eee', paddingTop: '16px' }
