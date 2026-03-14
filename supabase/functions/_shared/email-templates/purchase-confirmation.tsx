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

interface PurchaseConfirmationEmailProps {
  fullName: string
  productName: string
  downloadUrl?: string
  amount: string
  siteUrl?: string
}

export const PurchaseConfirmationEmail = ({
  fullName,
  productName,
  downloadUrl,
  amount,
  siteUrl = 'https://eduforyou.co.uk',
}: PurchaseConfirmationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your purchase of {productName} is confirmed — EduForYou</Preview>
    <Body style={main}>
      <Container style={container}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
          <tr><td><div style={logoBox}><span style={logoSpan}>E</span></div></td></tr>
        </table>
        <Heading style={h1}>Thank you for your purchase! 🎉</Heading>
        <Text style={text}>
          Hi {fullName || 'there'}, your purchase of <strong>{productName}</strong> for <strong>{amount}</strong> has been confirmed.
        </Text>
        {downloadUrl ? (
          <>
            <Text style={text}>
              Click the button below to download your product:
            </Text>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td align="center">
                  <Button href={downloadUrl} style={button}>
                    Download {productName}
                  </Button>
                </td>
              </tr>
            </table>
            <Text style={{ ...text, fontSize: '13px', marginTop: '16px' }}>
              If the button doesn't work, copy and paste this link into your browser: {downloadUrl}
            </Text>
          </>
        ) : (
          <Text style={text}>
            Your subscription is now active. You can access all agent features from your dashboard.
          </Text>
        )}
        <Hr style={hr} />
        <Text style={text}>
          If you have any questions about your purchase, don't hesitate to reach out to us.
        </Text>
        <Text style={footer}>
          EduForYou — You Dream. We Deliver.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PurchaseConfirmationEmail

const main = { backgroundColor: '#f4f5f7', fontFamily: "'Plus Jakarta Sans', 'Inter', Arial, sans-serif" }
const container = { backgroundColor: '#ffffff', padding: '40px 32px', borderRadius: '12px', margin: '40px auto', maxWidth: '480px' }
const logoBox = { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E07B24', textAlign: 'center' as const, lineHeight: '48px' }
const logoSpan = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold' as const }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#2B3E50', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#657180', lineHeight: '1.6', margin: '0 0 24px' }
const button = { backgroundColor: '#E07B24', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '600' as const, textDecoration: 'none' }
const hr = { borderColor: '#eee', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '16px 0 0' }
