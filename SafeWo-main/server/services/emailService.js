/**
 * SafeWo Automated Emergency Email Service
 * Sends instant rich HTML distress emails with live Google Maps links to all emergency contacts
 */

const nodemailer = require('nodemailer');

let cachedTransporter = null;

const getTransporter = async () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  // 1. If real SMTP credentials exist in .env (e.g. Gmail App Password)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    if (process.env.EMAIL_HOST) {
      cachedTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Default to Gmail or specified service
      cachedTransporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
    console.log(`📧 [SafeWo Email Service] Configured with active SMTP: ${process.env.EMAIL_USER}`);
    return cachedTransporter;
  }

  // 2. Fallback: Create Ethereal test inbox for zero-setup live email testing
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`📧 [SafeWo Email Service] Configured with Ethereal Test Inbox: ${testAccount.user}`);
    return cachedTransporter;
  } catch (err) {
    console.warn(`⚠️ [SafeWo Email Service] Failed to create Ethereal account:`, err.message);
    return null;
  }
};

/**
 * Generate rich HTML email template
 */
const generateEmailHtml = ({ userName, userPhone, userEmail, latitude, longitude, accuracy, time }) => {
  const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SafeWo Emergency SOS Alert</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 2px solid #ef4444; box-shadow: 0 10px 25px rgba(239, 68, 68, 0.2);">
    
    <!-- Emergency Banner Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: #ffffff; padding: 30px 24px; text-align: center;">
      <span style="background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
        🚨 URGENT DISTRESS SIGNAL
      </span>
      <h1 style="margin: 14px 0 6px 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">
        EMERGENCY SOS ALERT
      </h1>
      <p style="margin: 0; font-size: 15px; color: #fee2e2;">
        <strong>${userName}</strong> has triggered an SOS distress alert and needs immediate assistance!
      </p>
    </div>

    <!-- Alert Body Content -->
    <div style="padding: 28px 24px;">
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #991b1b; line-height: 1.5;">
          <strong>⚠️ Immediate Action Required:</strong> You are receiving this automatic email because you are listed as an Emergency Contact for <strong>${userName}</strong> on SafeWo. Their real-time location was broadcasted at <strong>${time}</strong>.
        </p>
      </div>

      <!-- Vital Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Person in Need:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700; text-align: right;">${userName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700; text-align: right;">
              <a href="tel:${userPhone}" style="color: #dc2626; text-decoration: none;">${userPhone || 'Not provided'}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Sender Email:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600; text-align: right;">${userEmail || 'N/A'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">GPS Coordinates:</td>
            <td style="padding: 10px 0; color: #0f172a; font-family: monospace; font-weight: 700; text-align: right;">
              ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (±${Math.round(accuracy || 10)}m)
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Alert Time:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600; text-align: right;">${time}</td>
          </tr>
        </tbody>
      </table>

      <!-- Primary Action: Open Google Maps -->
      <div style="text-align: center; margin: 30px 0 24px 0;">
        <a href="${mapsUrl}" target="_blank" style="display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 900; font-size: 16px; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4); letter-spacing: 0.5px;">
          📍 VIEW LIVE LOCATION ON GOOGLE MAPS
        </a>
      </div>

      <p style="text-align: center; font-size: 12px; color: #64748b; margin-bottom: 24px;">
        Or copy and paste link: <a href="${mapsUrl}" style="color: #2563eb;">${mapsUrl}</a>
      </p>

      <!-- Emergency Checklist -->
      <div style="background: #f8fafc; border-radius: 12px; padding: 16px; font-size: 13px; color: #334155; line-height: 1.6;">
        <strong style="display: block; color: #0f172a; margin-bottom: 6px;">Recommended Steps:</strong>
        1. Immediately try calling <strong>${userName}</strong> at <strong><a href="tel:${userPhone}" style="color: #dc2626;">${userPhone}</a></strong>.<br>
        2. If they do not answer or are unreachable, call National Emergency <strong><a href="tel:112" style="color: #dc2626;">112</a></strong> or Police <strong><a href="tel:100" style="color: #dc2626;">100</a></strong>.<br>
        3. Provide responders with their live GPS coordinates: <code>${latitude}, ${longitude}</code>.
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #0f172a; color: #94a3b8; padding: 16px 24px; text-align: center; font-size: 12px;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #ffffff;">SafeWo — Women Safety & Emergency Response Platform</p>
      <p style="margin: 0;">This is an automated safety broadcast dispatched in real time.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send Automated Emergency Email
 */
const sendEmergencyEmail = async ({ user, alert, contacts }) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.warn(`⚠️ [SafeWo Email] No email transporter available.`);
      return { success: false, reason: 'NO_TRANSPORTER' };
    }

    // Collect recipient emails
    const recipientEmails = [];

    // Add emergency contacts who have emails
    contacts.forEach((c) => {
      if (c.email && c.email.includes('@')) {
        recipientEmails.push(c.email.trim().toLowerCase());
      }
    });

    // Also include user's registered email
    if (user.email && user.email.includes('@')) {
      recipientEmails.push(user.email.trim().toLowerCase());
    }

    // Deduplicate
    const uniqueRecipients = [...new Set(recipientEmails)];

    if (uniqueRecipients.length === 0) {
      console.log(`ℹ️ [SafeWo Email] No recipient emails found for contacts or user.`);
      return { success: false, reason: 'NO_RECIPIENT_EMAILS', recipients: [] };
    }

    const { latitude, longitude, accuracy } = alert;
    const nowFormatted = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const emailHtml = generateEmailHtml({
      userName: user.name,
      userPhone: user.phone,
      userEmail: user.email,
      latitude,
      longitude,
      accuracy,
      time: nowFormatted,
    });

    const mailOptions = {
      from: `"SafeWo Emergency Dispatch" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'sos@safewo.org'}>`,
      to: uniqueRecipients.join(', '),
      subject: `🚨 URGENT: Emergency SOS Alert from ${user.name}!`,
      text: `EMERGENCY SOS ALERT!\n\n${user.name} (${user.phone}) has triggered an emergency SOS!\nLive GPS Location: https://maps.google.com/?q=${latitude},${longitude}\nCoordinates: ${latitude}, ${longitude}\nTime: ${nowFormatted}\n\nPlease call them or dial 112 immediately!`,
      html: emailHtml,
      priority: 'high',
      headers: {
        'X-Priority': '1 (Highest)',
        'X-MSMail-Priority': 'High',
        Importance: 'High',
      },
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log(`\n======================================================`);
    console.log(`📧 [SafeWo Automated Email DISPATCHED]`);
    console.log(`👥 Recipients (${uniqueRecipients.length}): ${uniqueRecipients.join(', ')}`);
    console.log(`🆔 Message ID: ${info.messageId}`);
    if (previewUrl) {
      console.log(`🔗 Ethereal Live Email Preview: ${previewUrl}`);
    }
    console.log(`======================================================\n`);

    return {
      success: true,
      recipients: uniqueRecipients,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
    };
  } catch (err) {
    console.error(`❌ [SafeWo Email Error]`, err.message);
    return {
      success: false,
      error: err.message,
    };
  }
};

module.exports = {
  sendEmergencyEmail,
  generateEmailHtml,
};
