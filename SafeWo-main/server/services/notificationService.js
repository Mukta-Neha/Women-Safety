/**
 * SafeWo Emergency Notification & Dispatch Service
 * Handles Automated Email, Fast2SMS / Twilio Carrier SMS, and WhatsApp deep links
 */

const https = require('https');
const { sendEmergencyEmail } = require('./emailService');

const formatEmergencyMessage = (userName, userPhone, latitude, longitude) => {
  const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
  return `🚨 EMERGENCY SOS ALERT from ${userName} (${userPhone || 'Emergency'})!\nI need immediate assistance at my current location:\n📍 Live Map: ${mapsLink}\nPlease contact me or call emergency services 112 immediately!`;
};

/**
 * Send SMS via Fast2SMS (Indian SMS Gateway)
 */
const sendFast2SMS = async (numbers, message) => {
  if (!process.env.FAST2SMS_API_KEY) return null;

  return new Promise((resolve) => {
    try {
      const postData = JSON.stringify({
        route: 'q',
        message,
        numbers,
        flash: 0,
      });

      const options = {
        hostname: 'www.fast2sms.com',
        path: '/dev/bulkV2',
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          console.log(`✅ [Fast2SMS] Response:`, data);
          resolve({ success: true, data });
        });
      });

      req.on('error', (err) => {
        console.warn(`⚠️ [Fast2SMS Error]:`, err.message);
        resolve({ success: false, error: err.message });
      });

      req.write(postData);
      req.end();
    } catch (err) {
      console.warn(`⚠️ [Fast2SMS Exception]:`, err.message);
      resolve({ success: false, error: err.message });
    }
  });
};

/**
 * Master Emergency Notifications Dispatcher
 */
const sendEmergencyNotifications = async ({ user, alert, contacts }) => {
  const { latitude, longitude, accuracy } = alert;
  const emergencyMessage = formatEmergencyMessage(user.name, user.phone, latitude, longitude);
  const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

  // 1. 📧 Auto-dispatch Emergency Emails
  console.log(`\n🚀 [SafeWo Auto-Dispatch] Initiating SOS Broadcast for ${user.name}...`);
  const emailDispatchResult = await sendEmergencyEmail({
    user,
    alert: { latitude, longitude, accuracy },
    contacts,
  });

  const dispatchResults = [];
  let primaryWhatsAppUrl = null;

  // 2. Prepare WhatsApp / SMS and Carrier Gateway Dispatches
  const phoneNumbersForSMS = [];

  for (const contact of contacts) {
    const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(emergencyMessage)}`;
    const smsLink = `sms:${contact.phone}?&body=${encodeURIComponent(emergencyMessage)}`;

    if (contact.isPrimary || !primaryWhatsAppUrl) {
      primaryWhatsAppUrl = whatsappLink;
    }

    if (cleanPhone.length >= 10) {
      phoneNumbersForSMS.push(cleanPhone.slice(-10));
    }

    // A. Twilio SMS
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await twilio.messages.create({
          body: emergencyMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contact.phone,
        });
        console.log(`✅ [Twilio SMS] Delivered to ${contact.name} (${contact.phone})`);
      } catch (twilioErr) {
        console.warn(`⚠️ [Twilio SMS Error] ${contact.phone}:`, twilioErr.message);
      }
    }

    // B. Twilio WhatsApp API
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
      try {
        const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await twilio.messages.create({
          body: emergencyMessage,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${contact.phone}`,
        });
        console.log(`✅ [Twilio WhatsApp] Delivered to ${contact.name} (${contact.phone})`);
      } catch (waErr) {
        console.warn(`⚠️ [Twilio WhatsApp Error] ${contact.phone}:`, waErr.message);
      }
    }

    dispatchResults.push({
      contactId: contact._id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email || null,
      status: 'DISPATCHED',
      whatsappLink,
      smsLink,
    });
  }

  // 3. Fast2SMS Indian Carrier SMS Bulk Dispatch
  if (phoneNumbersForSMS.length > 0 && process.env.FAST2SMS_API_KEY) {
    await sendFast2SMS(phoneNumbersForSMS.join(','), emergencyMessage);
  }

  return {
    emergencyMessage,
    mapsLink,
    generalWhatsAppLink: `https://wa.me/?text=${encodeURIComponent(emergencyMessage)}`,
    generalSmsLink: `sms:?&body=${encodeURIComponent(emergencyMessage)}`,
    primaryWhatsAppUrl: primaryWhatsAppUrl || `https://wa.me/?text=${encodeURIComponent(emergencyMessage)}`,
    emailDispatch: emailDispatchResult,
    contactsDispatched: dispatchResults,
  };
};

module.exports = {
  formatEmergencyMessage,
  sendEmergencyNotifications,
};
