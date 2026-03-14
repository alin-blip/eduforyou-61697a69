export function buildPurchaseConfirmationHtml(opts: {
  fullName: string;
  productName: string;
  downloadUrl?: string;
  amount: string;
}) {
  const { fullName, productName, downloadUrl, amount } = opts;

  const downloadBlock = downloadUrl
    ? `<p style="font-size:15px;color:#657180;line-height:1.6;margin:0 0 24px">Click the button below to download your product:</p>
       <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
         <a href="${downloadUrl}" style="display:inline-block;background-color:#E07B24;color:#ffffff;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none">Download ${productName}</a>
       </td></tr></table>
       <p style="font-size:13px;color:#657180;line-height:1.6;margin:16px 0 24px">If the button doesn't work, copy and paste this link: ${downloadUrl}</p>`
    : `<p style="font-size:15px;color:#657180;line-height:1.6;margin:0 0 24px">Your subscription is now active. You can access all agent features from your dashboard.</p>`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/></head>
<body style="background-color:#f4f5f7;font-family:'Plus Jakarta Sans','Inter',Arial,sans-serif">
<div style="background-color:#ffffff;padding:40px 32px;border-radius:12px;margin:40px auto;max-width:480px">
  <div style="width:48px;height:48px;border-radius:50%;background-color:#E07B24;text-align:center;line-height:48px;margin-bottom:24px"><span style="color:#fff;font-size:24px;font-weight:bold">E</span></div>
  <h1 style="font-size:24px;font-weight:bold;color:#2B3E50;margin:0 0 16px">Thank you for your purchase! 🎉</h1>
  <p style="font-size:15px;color:#657180;line-height:1.6;margin:0 0 24px">Hi ${fullName || "there"}, your purchase of <strong>${productName}</strong> for <strong>${amount}</strong> has been confirmed.</p>
  ${downloadBlock}
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
  <p style="font-size:15px;color:#657180;line-height:1.6;margin:0 0 24px">If you have any questions about your purchase, don't hesitate to reach out to us.</p>
  <p style="font-size:12px;color:#999999;margin:16px 0 0">EduForYou — You Dream. We Deliver.</p>
</div></body></html>`;
}
