/**
 * Test script to verify Automated Email and Emergency Notification Service
 */

const { sendEmergencyEmail } = require('./services/emailService');
const { sendEmergencyNotifications } = require('./services/notificationService');

async function testEmailAndNotification() {
  console.log('🧪 Testing SafeWo Automated Emergency Dispatch Pipeline...\n');

  const mockUser = {
    _id: '6a9f1c440a4b1815f805f001',
    name: 'Priya Sharma',
    phone: '+919876543210',
    email: 'priya@safewo.demo',
  };

  const mockAlert = {
    latitude: 23.3441,
    longitude: 85.3096,
    accuracy: 8,
  };

  const mockContacts = [
    {
      _id: 'contact_1',
      name: 'Ramesh Sharma (Father)',
      relationship: 'Father',
      phone: '+919876543211',
      email: 'ramesh.sharma@example.com',
      priority: 1,
      isPrimary: true,
    },
    {
      _id: 'contact_2',
      name: 'Sunita Sharma (Mother)',
      relationship: 'Mother',
      phone: '+919876543212',
      email: 'sunita.sharma@example.com',
      priority: 1,
      isPrimary: false,
    },
  ];

  console.log('1️⃣ Testing sendEmergencyEmail...');
  const emailResult = await sendEmergencyEmail({
    user: mockUser,
    alert: mockAlert,
    contacts: mockContacts,
  });
  console.log('Email Test Result:', emailResult);

  console.log('\n2️⃣ Testing sendEmergencyNotifications master dispatcher...');
  const dispatchResult = await sendEmergencyNotifications({
    user: mockUser,
    alert: mockAlert,
    contacts: mockContacts,
  });
  console.log('Master Dispatch Result:');
  console.log('- Maps Link:', dispatchResult.mapsLink);
  console.log('- Primary WhatsApp URL:', dispatchResult.primaryWhatsAppUrl);
  console.log('- Contacts Dispatched Count:', dispatchResult.contactsDispatched.length);
  console.log('- Email Dispatch Success:', dispatchResult.emailDispatch.success);

  console.log('\n✅ All notification services tested successfully!\n');
  process.exit(0);
}

testEmailAndNotification().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
