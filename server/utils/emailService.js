import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter.
 * Supports standard Gmail SMTP, Custom SMTP, or falls back gracefully with logging.
 */
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return null;
  }

  // If host is explicitly set (e.g. Brevo, SendGrid, Mailgun)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  // Default to standard Google / Gmail SMTP
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

/**
 * Sends a high-converting, branded HTML OTP email to the user's inbox in real-time.
 * First uses the Resend API (production grade), and falls back to Nodemailer SMTP.
 */
export const sendOtpEmail = async ({ to, name, otp }) => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AfterBuy Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="520px" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Branding -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; text-align: center;">
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; font-weight: 800; font-size: 16px; letter-spacing: 1px;">
                AB
              </div>
              <h2 style="margin: 16px 0 0 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">
                Password Reset Verification
              </h2>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b;">
                Everything after you buy
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0;">
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 36px 32px 36px;">
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #334155;">
                Hello <strong>${name || 'User'}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #475569;">
                We received a request to reset the password for your AfterBuy account. Please enter the following 6-digit verification code:
              </p>

              <!-- 6-Digit OTP Box -->
              <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px 10px; text-align: center; margin: 0 0 24px 0;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #2563eb; display: inline-block; margin-left: 10px;">
                  ${otp}
                </span>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; tracking: 1px;">
                  Expires in 10 minutes
                </p>
              </div>

              <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 20px; color: #64748b;">
                If you did not request this code, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 36px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} AfterBuy Systems Inc. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 1. Send via Nodemailer SMTP (Universal delivery to ANY email address)
  const transporter = createTransporter();
  if (transporter) {
    try {
      const senderAddress = process.env.EMAIL_FROM || `"AfterBuy" <${process.env.EMAIL_USER}>`;
      const info = await transporter.sendMail({
        from: senderAddress,
        to,
        subject: `${otp} is your AfterBuy verification code`,
        text: `Your AfterBuy verification code is: ${otp}. It will expire in 10 minutes.`,
        html: htmlContent,
      });

      console.log(`\n🚀 [EMAIL SENT TO INBOX] Realtime OTP delivered to: ${to} (MessageId: ${info.messageId})\n`);
      return { sent: true, provider: 'smtp', messageId: info.messageId };
    } catch (error) {
      console.error(`❌ [SMTP ERROR] Failed to send via Gmail to ${to}:`, error.message);
    }
  }

  // 2. Fallback to Resend API (if configured)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const from = process.env.RESEND_FROM || 'AfterBuy <onboarding@resend.dev>';
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `${otp} is your AfterBuy verification code`,
          html: htmlContent,
        }),
      });

      const resData = await resendRes.json();

      if (resendRes.ok && resData?.id) {
        console.log(`\n🚀 [RESEND API SUCCESS] Realtime OTP delivered to ${to} (ID: ${resData.id})\n`);
        return { sent: true, provider: 'resend', id: resData.id };
      } else {
        console.warn(`⚠️ [RESEND NOTICE]:`, resData);
      }
    } catch (err) {
      console.error('❌ [RESEND API ERROR]:', err.message);
    }
  }

  // If no email provider sent successfully
  console.warn(`📩 [Console Dispatch] OTP for ${to}: ${otp}`);
  return {
    sent: false,
    reason: 'NO_PROVIDER',
  };
};

/**
 * Sends Contact Us message to official AfterBuy Support email,
 * and sends an acknowledgement confirmation to the user.
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {
  const supportEmail = process.env.EMAIL_USER || 'support.afterbuy@gmail.com';
  const transporter = createTransporter();

  const formattedDate = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // 1. Email to AfterBuy Support Team
  const adminSubject = `[AfterBuy Contact] ${subject ? subject : 'New inquiry from ' + name}`;
  const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Us Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff;">
              <h2 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.3px;">
                📩 New Inquiry Received via AfterBuy
              </h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #e0e7ff;">
                Submitted on ${formattedDate}
              </p>
            </td>
          </tr>

          <!-- Details Card -->
          <tr>
            <td style="padding: 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; width: 120px;"><strong>Sender Name:</strong></td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b;"><strong>Sender Email:</strong></td>
                  <td style="padding: 8px 0; font-size: 14px; color: #2563eb;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b;"><strong>Subject:</strong></td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a;">${subject || 'General Inquiry'}</td>
                </tr>
              </table>

              <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 16px 20px; margin: 16px 0;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Message Content:</p>
                <p style="margin: 0; font-size: 14px; line-height: 22px; color: #1e293b; white-space: pre-wrap;">${message}</p>
              </div>

              <p style="margin: 20px 0 0 0; font-size: 12px; color: #64748b;">
                💡 <em>Clicking "Reply" to this email will directly reply to <strong>${email}</strong>.</em>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 2. Confirmation Email to the User
  const userSubject = `We've received your message — AfterBuy Support`;
  const userHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>We received your message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; text-align: center;">
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; font-weight: 800; font-size: 16px; letter-spacing: 1px;">
                AB
              </div>
              <h2 style="margin: 16px 0 0 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">
                Message Received!
              </h2>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b;">
                Thank you for contacting AfterBuy Support
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 36px;">
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 36px 28px 36px;">
              <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 22px; color: #334155;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 22px; color: #475569;">
                We have received your inquiry regarding <strong>"${subject || 'Support Request'}"</strong>.
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #475569;">
                Our customer support team is reviewing your message and will get back to you within <strong>24 business hours</strong>.
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px;">
                <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Your Message Summary</p>
                <p style="margin: 0; font-size: 13px; color: #334155; line-height: 20px;">"${message}"</p>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 20px; color: #64748b;">
                Warm regards,<br>
                <strong>The AfterBuy Support Team</strong><br>
                <a href="mailto:${supportEmail}" style="color: #2563eb; text-decoration: none;">${supportEmail}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 36px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} AfterBuy Technologies Inc. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  if (transporter) {
    try {
      // 1. Send notification to official AfterBuy Support Inbox
      await transporter.sendMail({
        from: `"AfterBuy Contact Desk" <${supportEmail}>`,
        to: supportEmail,
        replyTo: `"${name}" <${email}>`,
        subject: adminSubject,
        text: `From: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: adminHtml,
      });

      console.log(`\n📬 [CONTACT US] New message delivered to support inbox: ${supportEmail} from ${email}\n`);

      // 2. Send instant acknowledgement to user's email
      await transporter.sendMail({
        from: `"AfterBuy Support" <${supportEmail}>`,
        to: email,
        subject: userSubject,
        text: `Hello ${name},\n\nWe have received your message regarding "${subject || 'Support'}". Our team will get back to you within 24 hours.\n\nAfterBuy Support`,
        html: userHtml,
      });

      console.log(`✉️ [CONTACT ACK] Confirmation sent to user: ${email}\n`);
      return { sent: true };
    } catch (err) {
      console.error('❌ [CONTACT EMAIL ERROR]:', err.message);
      return { sent: false, error: err.message };
    }
  }

  return { sent: false, reason: 'NO_TRANSPORTER' };
};

