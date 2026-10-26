const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const User = require('./models/User');
const EmergencyContact = require('./models/EmergencyContact');
const Incident = require('./models/Incident');
const SafeZone = require('./models/SafeZone');
const Alert = require('./models/Alert');
const Notification = require('./models/Notification');
const Location = require('./models/Location');
const SafeHaven = require('./models/SafeHaven');
const SafeJourney = require('./models/SafeJourney');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany();
    await EmergencyContact.deleteMany();
    await Incident.deleteMany();
    await SafeZone.deleteMany();
    await Alert.deleteMany();
    await Notification.deleteMany();
    await Location.deleteMany();
    await SafeHaven.deleteMany();
    await SafeJourney.deleteMany();

    console.log('🌱 Seeding Users...');
    // Create users (pre-save hook hashes password)
    const adminUser = await User.create({
      name: 'SafeWo Admin',
      email: 'admin@safewo.demo',
      phone: '+91 98765 43210',
      password: 'Admin@12345',
      role: 'ADMIN',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      emergencyPreferences: {
        autoShareLocation: true,
        notifyBySms: true,
        soundAlarm: true,
      },
    });

    const priyaUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya@safewo.demo',
      phone: '+91 91234 56789',
      password: 'Priya@12345',
      role: 'USER',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      emergencyPreferences: {
        autoShareLocation: true,
        notifyBySms: true,
        soundAlarm: true,
      },
    });

    const ananyaUser = await User.create({
      name: 'Ananya Verma',
      email: 'ananya@safewo.demo',
      phone: '+91 98111 22334',
      password: 'Ananya@12345',
      role: 'USER',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const snehaUser = await User.create({
      name: 'Sneha Patel',
      email: 'sneha@safewo.demo',
      phone: '+91 97222 33445',
      password: 'Sneha@12345',
      role: 'USER',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    });

    const kavitaUser = await User.create({
      name: 'Kavita Rao',
      email: 'kavita@safewo.demo',
      phone: '+91 96333 44556',
      password: 'Kavita@12345',
      role: 'USER',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    console.log('🌱 Seeding Emergency Contacts...');
    // Contacts for Priya
    await EmergencyContact.create([
      {
        userId: priyaUser._id,
        name: 'Sunita Sharma (Mother)',
        relationship: 'Mother',
        phone: '+91 98351 12345',
        email: 'sunita.sharma@example.com',
        priority: 1,
        isPrimary: true,
      },
      {
        userId: priyaUser._id,
        name: 'Rajesh Sharma (Father)',
        relationship: 'Father',
        phone: '+91 98351 54321',
        email: 'rajesh.sharma@example.com',
        priority: 2,
        isPrimary: false,
      },
      {
        userId: priyaUser._id,
        name: 'Rohan Sharma (Brother)',
        relationship: 'Brother',
        phone: '+91 94311 98765',
        email: 'rohan.sharma@example.com',
        priority: 3,
        isPrimary: false,
      },
      {
        userId: priyaUser._id,
        name: 'Neha Gupta (Best Friend)',
        relationship: 'Friend',
        phone: '+91 91992 33445',
        email: 'neha.gupta@example.com',
        priority: 4,
        isPrimary: false,
      },
    ]);

    // Contacts for Ananya
    await EmergencyContact.create([
      {
        userId: ananyaUser._id,
        name: 'Meera Verma (Mother)',
        relationship: 'Mother',
        phone: '+91 98111 99887',
        email: 'meera.verma@example.com',
        priority: 1,
        isPrimary: true,
      },
      {
        userId: ananyaUser._id,
        name: 'Vikram Verma (Father)',
        relationship: 'Father',
        phone: '+91 98111 44556',
        priority: 2,
        isPrimary: false,
      },
      {
        userId: ananyaUser._id,
        name: 'Pooja Singh (Roommate)',
        relationship: 'Friend',
        phone: '+91 98111 77665',
        priority: 3,
        isPrimary: false,
      },
    ]);

    // Contacts for Sneha & Kavita
    await EmergencyContact.create([
      {
        userId: snehaUser._id,
        name: 'Deepak Patel (Husband)',
        relationship: 'Guardian',
        phone: '+91 97222 11223',
        priority: 1,
        isPrimary: true,
      },
      {
        userId: snehaUser._id,
        name: 'Aarti Patel (Sister)',
        relationship: 'Sister',
        phone: '+91 97222 88990',
        priority: 2,
        isPrimary: false,
      },
      {
        userId: kavitaUser._id,
        name: 'Dr. S. Rao (Father)',
        relationship: 'Father',
        phone: '+91 96333 11224',
        priority: 1,
        isPrimary: true,
      },
    ]);

    console.log('🌱 Seeding Safe Zones...');
    await SafeZone.create([
      {
        userId: priyaUser._id,
        name: 'Home (Morabadi)',
        type: 'Home',
        address: 'Plot 42, Morabadi, Ranchi, Jharkhand 834008',
        latitude: 23.3855,
        longitude: 85.3341,
        radius: 300,
      },
      {
        userId: priyaUser._id,
        name: 'University Campus',
        type: 'College',
        address: 'Ranchi University Campus, Shaheed Chowk, Ranchi 834001',
        latitude: 23.3689,
        longitude: 85.3256,
        radius: 500,
      },
      {
        userId: priyaUser._id,
        name: 'Software Tech Park',
        type: 'Office',
        address: 'STPI Campus, Namkum Industrial Area, Ranchi 834010',
        latitude: 23.3412,
        longitude: 85.3789,
        radius: 400,
      },
      {
        userId: ananyaUser._id,
        name: 'Girls Hostel Koramangala',
        type: 'Hostel',
        address: '5th Block, Koramangala, Bengaluru, Karnataka 560095',
        latitude: 12.9352,
        longitude: 77.6245,
        radius: 250,
      },
      {
        userId: snehaUser._id,
        name: 'Office Cyber City',
        type: 'Office',
        address: 'DLF Cyber City, Phase 2, Gurugram, Delhi NCR 122002',
        latitude: 28.4906,
        longitude: 77.0903,
        radius: 450,
      },
    ]);

    console.log('🌱 Seeding Incidents...');
    const incidentData = [
      // Ranchi
      {
        userId: priyaUser._id,
        title: 'Streetlights broken along dark alleyway near Morabadi Ground',
        description: 'Multiple streetlights have been completely non-functional for over 2 weeks behind the stadium. Very poor visibility after 7 PM. Group of men frequently loitering in the dark.',
        category: 'Unsafe Area',
        severity: 'HIGH',
        latitude: 23.3882,
        longitude: 85.3374,
        address: 'Near Morabadi Stadium Gate 3, Ranchi, Jharkhand',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [ananyaUser._id, snehaUser._id],
      },
      {
        userId: ananyaUser._id,
        title: 'Verbal harassment and catcalling near Main Road bus stand',
        description: 'Two individuals on a black motorcycle repeatedly passed by and made offensive comments to women waiting for shared autos around 8:30 PM.',
        category: 'Harassment',
        severity: 'MEDIUM',
        latitude: 23.3644,
        longitude: 85.3211,
        address: 'Main Road, Near GEL Church Complex, Ranchi, Jharkhand',
        status: 'VERIFIED',
        anonymous: true,
        helpfulUsers: [priyaUser._id],
      },
      {
        userId: snehaUser._id,
        title: 'Suspicious vehicle following pedestrians near Lalpur Chowk',
        description: 'A silver sedan with tinted windows was seen slowing down beside solo women commuters and tailing them toward Peace Road. Reported to local police beat patrol.',
        category: 'Stalking',
        severity: 'CRITICAL',
        latitude: 23.3725,
        longitude: 85.3402,
        address: 'Lalpur Chowk, Circular Road, Ranchi, Jharkhand',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [priyaUser._id, kavitaUser._id],
      },
      {
        userId: kavitaUser._id,
        title: 'Snatching attempt of handbag near Doranda Market',
        description: 'Biker snatched bag from a college student walking toward the auto stand. Bystanders intervened. Police complaint filed at Doranda Police Station.',
        category: 'Theft',
        severity: 'HIGH',
        latitude: 23.3385,
        longitude: 85.3242,
        address: 'Doranda Market Road, Ranchi, Jharkhand',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [priyaUser._id],
      },
      {
        userId: priyaUser._id,
        title: 'Isolated stretch with lack of police presence near Hinoo Bridge',
        description: 'Underpass lighting completely defunct. No security or cameras installed. Avoid taking this route alone after 8 PM.',
        category: 'Unsafe Area',
        severity: 'MEDIUM',
        latitude: 23.3255,
        longitude: 85.3195,
        address: 'Hinoo Bridge Underpass, Ranchi, Jharkhand',
        status: 'PENDING',
        anonymous: false,
        helpfulUsers: [],
      },

      // Delhi NCR
      {
        userId: ananyaUser._id,
        title: 'Persistent stalking reported near Hauz Khas Village exit',
        description: 'Woman followed by unknown person from metro station to entry gate. Security guards assisted her to reach her cab safely.',
        category: 'Stalking',
        severity: 'CRITICAL',
        latitude: 28.5494,
        longitude: 77.1932,
        address: 'Hauz Khas Village Outer Lane, New Delhi',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [snehaUser._id, priyaUser._id],
      },
      {
        userId: snehaUser._id,
        title: 'Rowdy group harassing commuters near Connaught Place Outer Circle',
        description: 'Group drinking openly and harassing women coming out of the metro gate 4. PCR van was called to disperse them.',
        category: 'Harassment',
        severity: 'HIGH',
        latitude: 28.6329,
        longitude: 77.2195,
        address: 'Connaught Place Block F, New Delhi',
        status: 'VERIFIED',
        anonymous: true,
        helpfulUsers: [priyaUser._id, ananyaUser._id, kavitaUser._id],
      },
      {
        userId: priyaUser._id,
        title: 'Zero street lighting along service road near Dwarka Sector 12',
        description: 'About 600m stretch of road in pitch darkness. High vegetation on sides creates serious safety hazard for women commuters.',
        category: 'Unsafe Area',
        severity: 'HIGH',
        latitude: 28.5921,
        longitude: 77.0392,
        address: 'Sector 12 Service Road, Dwarka, New Delhi',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [ananyaUser._id],
      },
      {
        userId: kavitaUser._id,
        title: 'Phone snatching incident near Saket Metro Station',
        description: 'Two men on scooter grabbed phone out of hand while navigating GPS near the auto stand. FIR logged.',
        category: 'Theft',
        severity: 'MEDIUM',
        latitude: 28.5204,
        longitude: 77.2023,
        address: 'Gate 2, Saket Metro Station, New Delhi',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [snehaUser._id],
      },
      {
        userId: ananyaUser._id,
        title: 'Suspicious drone observed near Rohini Sector 15 park',
        description: 'Low-flying drone spotted recording residential balconies and walking tracks at dusk. Alerted society welfare association.',
        category: 'Suspicious Activity',
        severity: 'LOW',
        latitude: 28.7188,
        longitude: 77.1265,
        address: 'Sector 15 Community Park, Rohini, Delhi',
        status: 'PENDING',
        anonymous: false,
        helpfulUsers: [],
      },

      // Bengaluru
      {
        userId: ananyaUser._id,
        title: 'Unsafe dark alley behind Sony World Signal, Koramangala',
        description: 'Streetlamps covered by overgrown banyan tree branches. Several reports of chain-snatching and harassment in this lane.',
        category: 'Unsafe Area',
        severity: 'HIGH',
        latitude: 12.9348,
        longitude: 77.6258,
        address: '80 Feet Road, Koramangala 4th Block, Bengaluru',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [priyaUser._id, kavitaUser._id],
      },
      {
        userId: snehaUser._id,
        title: 'Drunk drivers intimidating pedestrians near Indiranagar 100ft Road',
        description: 'Speeding car honking and passing derogatory slurs to female pedestrians near the brewery lane around midnight.',
        category: 'Harassment',
        severity: 'HIGH',
        latitude: 12.9719,
        longitude: 77.6412,
        address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [ananyaUser._id],
      },
      {
        userId: kavitaUser._id,
        title: 'Physical assault and bag theft near Whitefield railway station',
        description: 'Violent encounter when a commuter was pushed down and robbed while walking toward the tech park. Victim received medical aid at Manipal Hospital.',
        category: 'Violence',
        severity: 'CRITICAL',
        latitude: 12.9698,
        longitude: 77.7499,
        address: 'Whitefield Main Road, Kadugodi, Bengaluru, Karnataka',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [priyaUser._id, snehaUser._id],
      },
      {
        userId: priyaUser._id,
        title: 'Suspicious men taking photographs near Electronic City Phase 1 Toll',
        description: 'Group of three men positioned near the bus shelter secretly taking photos of women waiting for shuttle buses.',
        category: 'Suspicious Activity',
        severity: 'MEDIUM',
        latitude: 12.8452,
        longitude: 77.6602,
        address: 'Electronic City Toll Plaza, Hosur Road, Bengaluru',
        status: 'VERIFIED',
        anonymous: true,
        helpfulUsers: [ananyaUser._id],
      },
      {
        userId: ananyaUser._id,
        title: 'Hit-and-run two-wheeler accident leaving woman injured on MG Road',
        description: 'Speeding bike hit female pedestrian on zebra crossing and fled. Traffic police notified and reviewing CCTV footage.',
        category: 'Accident',
        severity: 'HIGH',
        latitude: 12.9756,
        longitude: 77.6094,
        address: 'MG Road Metro Junction, Bengaluru, Karnataka',
        status: 'RESOLVED',
        anonymous: false,
        helpfulUsers: [kavitaUser._id],
      },

      // Mumbai
      {
        userId: snehaUser._id,
        title: 'Harassment and eve-teasing near Bandra Bandstand promenade',
        description: 'Two men following solitary joggers in the early morning hours and passing inappropriate remarks. Bandra Police beat patrol informed.',
        category: 'Harassment',
        severity: 'MEDIUM',
        latitude: 19.0478,
        longitude: 72.8197,
        address: 'Bandstand Promenade, Bandra West, Mumbai, Maharashtra',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [priyaUser._id, ananyaUser._id],
      },
      {
        userId: kavitaUser._id,
        title: 'Unsafe skywalk with poor lighting at Andheri East Station',
        description: 'Multiple overhead LED tubes dead. Isolated stairs make women commuters feel extremely unsafe when returning from office shifts.',
        category: 'Unsafe Area',
        severity: 'HIGH',
        latitude: 19.1197,
        longitude: 72.8468,
        address: 'Andheri East Skywalk, MV Road, Mumbai, Maharashtra',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [snehaUser._id],
      },
      {
        userId: priyaUser._id,
        title: 'Purse snatching by biker gang near Marine Drive NCPA end',
        description: 'Two youths on modified bike snatched designer bag from woman walking with friend along the seaface. Alerted Marine Drive police station.',
        category: 'Theft',
        severity: 'HIGH',
        latitude: 18.9272,
        longitude: 72.8228,
        address: 'Marine Drive Promenade, Nariman Point, Mumbai',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [ananyaUser._id, snehaUser._id],
      },
      {
        userId: ananyaUser._id,
        title: 'Suspicious vehicle parked with no plates near Powai Lake',
        description: 'Van parked for over 48 hours without license plates near the lake jogging track. Suspicious individuals loitering around.',
        category: 'Suspicious Activity',
        severity: 'MEDIUM',
        latitude: 19.1298,
        longitude: 72.9064,
        address: 'Powai Lake Road, Hiranandani Gardens, Mumbai',
        status: 'PENDING',
        anonymous: true,
        helpfulUsers: [],
      },
      {
        userId: snehaUser._id,
        title: 'Assault and intimidation outside Dadar flower market',
        description: 'Aggressive vendor assaulted female shopper during argument. Local shopkeepers intervened and handed suspect to Dadar police.',
        category: 'Violence',
        severity: 'CRITICAL',
        latitude: 19.0178,
        longitude: 72.8428,
        address: 'Senapati Bapat Marg, Dadar West, Mumbai',
        status: 'VERIFIED',
        anonymous: false,
        helpfulUsers: [priyaUser._id, kavitaUser._id, ananyaUser._id],
      },
    ];

    await Incident.insertMany(incidentData);

    console.log('🌱 Seeding SOS Alerts...');
    // Active demo alert for Priya in Ranchi
    const activeAlert = await Alert.create({
      userId: priyaUser._id,
      type: 'SOS',
      latitude: 23.3705,
      longitude: 85.3289,
      accuracy: 8,
      message: '🚨 Emergency SOS! I feel unsafe walking back from office near Kutchery Chowk.',
      status: 'ACTIVE',
      emergencyContactsNotified: [
        { name: 'Sunita Sharma (Mother)', phone: '+91 98351 12345', status: 'NOTIFIED' },
        { name: 'Rajesh Sharma (Father)', phone: '+91 98351 54321', status: 'NOTIFIED' },
      ],
      recipients: ['Sunita Sharma (+91 98351 12345)', 'Rajesh Sharma (+91 98351 54321)'],
    });

    // Resolved historical alerts
    await Alert.create([
      {
        userId: priyaUser._id,
        type: 'UNSAFE_COMMUTE',
        latitude: 23.3644,
        longitude: 85.3211,
        accuracy: 12,
        message: 'Auto breakdown in isolated area. Requested live location sharing.',
        status: 'RESOLVED',
        emergencyContactsNotified: [
          { name: 'Sunita Sharma (Mother)', phone: '+91 98351 12345', status: 'NOTIFIED' },
        ],
        recipients: ['Sunita Sharma (+91 98351 12345)'],
        resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        resolvedBy: priyaUser._id,
        resolutionNotes: 'Reached safely after family arrived.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000),
      },
      {
        userId: ananyaUser._id,
        type: 'SOS',
        latitude: 12.9348,
        longitude: 77.6258,
        accuracy: 6,
        message: 'Being stalked near Koramangala block 4. Need immediate assistance.',
        status: 'RESOLVED',
        emergencyContactsNotified: [
          { name: 'Meera Verma (Mother)', phone: '+91 98111 99887', status: 'NOTIFIED' },
        ],
        recipients: ['Meera Verma (+91 98111 99887)'],
        resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        resolvedBy: adminUser._id,
        resolutionNotes: 'Police patrol dispatched and safely escorted user.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 45 * 60 * 1000),
      },
    ]);

    // Initial location for active alert
    await Location.create({
      userId: priyaUser._id,
      alertId: activeAlert._id,
      latitude: 23.3705,
      longitude: 85.3289,
      accuracy: 8,
    });

    console.log('🌱 Seeding Notifications...');
    await Notification.create([
      {
        userId: priyaUser._id,
        type: 'SOS',
        title: '🚨 Emergency SOS Broadcast',
        message: 'Your SOS alert is active. Live location is streaming to emergency contacts.',
        read: false,
        link: '/sos',
      },
      {
        userId: priyaUser._id,
        type: 'Incident',
        title: 'New Incident Verified Nearby',
        message: 'A HIGH severity incident was verified near Morabadi: "Streetlights broken along dark alleyway".',
        read: false,
        link: '/incidents',
      },
      {
        userId: priyaUser._id,
        type: 'Safety',
        title: 'Safe Zone Active',
        message: 'You have entered your designated safe zone: Home (Morabadi).',
        read: true,
        link: '/safe-zones',
      },
      {
        userId: adminUser._id,
        type: 'SOS',
        title: '🚨 Active Emergency SOS Detected',
        message: 'Priya Sharma triggered an emergency SOS near Kutchery Chowk, Ranchi.',
        read: false,
        link: '/admin/alerts',
      },
    ]);

    console.log('🌱 Seeding Safe Havens & Shelters...');
    await SafeHaven.create([
      {
        name: 'Kotwali Police Station & Women Desk',
        category: 'Police',
        address: 'Main Road, Near Daily Market, Ranchi 834001',
        city: 'Ranchi',
        latitude: 23.3685,
        longitude: 85.3262,
        contactPhone: '+91 651 220 8023',
        is24x7: true,
        lightingRating: 5,
        cctvGuarded: true,
        hasFemaleStaff: true,
        features: ['24/7 Female Duty Officer', 'High-Mast Street Lighting', 'CCTV Surveillance Corridor', 'Immediate PCR Dispatch'],
      },
      {
        name: 'Apollo 24/7 Pharmacy & First-Aid Kiosk',
        category: 'Pharmacy',
        address: 'Circular Road, Lalpur Chowk, Ranchi 834001',
        city: 'Ranchi',
        latitude: 23.3712,
        longitude: 85.3345,
        contactPhone: '+91 1860 500 0101',
        is24x7: true,
        lightingRating: 5,
        cctvGuarded: true,
        hasFemaleStaff: true,
        features: ['Open 24 Hours', 'Security Guard on Duty', 'Emergency First-Aid', 'Brightly Lit Frontage'],
      },
      {
        name: 'RIMS Super Speciality Hospital Emergency',
        category: 'Hospital',
        address: 'Bariatu Road, Ranchi, Jharkhand 834009',
        city: 'Ranchi',
        latitude: 23.3932,
        longitude: 85.3562,
        contactPhone: '+91 651 254 1533',
        is24x7: true,
        lightingRating: 5,
        cctvGuarded: true,
        hasFemaleStaff: true,
        features: ['Level 1 Trauma Unit', '24/7 Police Outpost Inside', 'Emergency Ambulance Fleet', 'Safe Patient Waiting Area'],
      },
      {
        name: 'Sakhi — One Stop Crisis Center for Women',
        category: 'Shelter',
        address: 'Old Commissioner Compound, Kutchery Road, Ranchi 834001',
        city: 'Ranchi',
        latitude: 23.3768,
        longitude: 85.3245,
        contactPhone: '181',
        is24x7: true,
        lightingRating: 5,
        cctvGuarded: true,
        hasFemaleStaff: true,
        features: ['Free Legal Aid', 'Psychological Counseling', 'Temporary Safe Shelter', 'Female Protection Officers'],
      },
      {
        name: 'Ranchi Railway Station CISF / RPF Post',
        category: 'Transit',
        address: 'Station Road, Chutia, Ranchi 834001',
        city: 'Ranchi',
        latitude: 23.3518,
        longitude: 85.3374,
        contactPhone: '139',
        is24x7: true,
        lightingRating: 5,
        cctvGuarded: true,
        hasFemaleStaff: true,
        features: ['Armed RPF Surveillance', '24/7 Meri Saheli Team', 'Passenger Help Desk', 'Pre-paid Taxi Booth'],
      },
      // Metro & Delhi safe spots
      {
        name: 'Connaught Place Police Post (Pink Booth)',
        category: 'Police',
        address: 'Inner Circle, Block A, Connaught Place, New Delhi 110001',
        city: 'New Delhi',
        latitude: 28.6328,
        longitude: 77.2197,
        contactPhone: '112',
        is24x7: true,
        lightingRating: 5,
        cctvGuarded: true,
        hasFemaleStaff: true,
        features: ['All-Women Pink Police Booth', 'CCTV Monitored Hub', 'Direct Wireless Helpline', 'Immediate Patrol Response'],
      },
      {
        name: 'Rajiv Chowk Metro CISF Women Helpdesk',
        category: 'Transit',
        address: 'Gate 2, Rajiv Chowk Metro Station, Connaught Place, New Delhi',
        city: 'New Delhi',
        latitude: 28.6335,
        longitude: 77.2185,
        contactPhone: '155370',
        is24x7: true,
        lightingRating: 5,
        cctvGuarded: true,
        hasFemaleStaff: true,
        features: ['CISF Armed Guard', 'Women Only Queue & Coach Monitoring', 'Emergency Exit Protocol', 'High Surveillance Zone'],
      },
      {
        name: 'AIIMS Emergency & Trauma Center',
        category: 'Hospital',
        address: 'Sri Aurobindo Marg, Ansari Nagar East, New Delhi 110029',
        city: 'New Delhi',
        latitude: 28.5672,
        longitude: 77.2100,
        contactPhone: '+91 11 2658 8500',
        is24x7: true,
        lightingRating: 5,
        cctvGuarded: true,
        hasFemaleStaff: true,
        features: ['24/7 Security Force', 'Crisis Intervention Cell', 'Emergency Medical Teams', 'Perimeter Street Lighting'],
      },
    ]);

    console.log('✅ [SafeWo Seed] Database seeded successfully!');
    console.log('====================================================');
    console.log('DEMO ACCOUNTS:');
    console.log('1. Admin: admin@safewo.demo   | Password: Admin@12345');
    console.log('2. User:  priya@safewo.demo   | Password: Priya@12345');
    console.log('3. User:  ananya@safewo.demo  | Password: Ananya@12345');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ [SafeWo Seed] Seeding error:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

module.exports = seedData;

if (require.main === module) {
  seedData().then(() => process.exit(0));
}
