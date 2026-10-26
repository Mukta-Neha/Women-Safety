# SafeWo — "Your Safety. One Click Away."
**Modern Women Safety and Emergency Response Platform**

SafeWo is a complete, production-ready, full-stack web platform designed to protect women and vulnerable individuals through rapid-response emergency protocols, real-time GPS location sharing, crowdsourced safety incident mapping, private geofenced safe zones, emergency helpline integration, and administrative monitoring dashboards.

---

## 🌟 Key Features

### 1. 🚨 One-Click SOS Emergency System
- **High-Visibility SOS Button**: Accessible from the dashboard, dedicated `/sos` hub, and fixed mobile bottom navigation with subtle pulse animations.
- **Immediate Confirmation Protocol**: Prevents accidental triggers with an auto-dispatch timer and instant override.
- **Live GPS Tracking**: Automatically requests high-accuracy browser geolocation and streams breadcrumbs in real-time.
- **Multi-Recipient Notification**: Alerts emergency contacts and community responders with live coordinates.
- **Audio Siren Beacon**: Built-in high-pitch emergency buzzer toggle using Web Audio API synthesis.
- **Resolution Control**: Safe deactivation with timestamping and notes.

### 2. 📍 Interactive Safety Incident Explorer & Reporting
- **Interactive OpenStreetMap**: Visualizes incidents with color-coded pins mapped to threat severities (**Critical** = Red, **High** = Orange, **Medium** = Amber, **Low** = Green).
- **Comprehensive Filtering**: Real-time server-side search, categories (*Harassment, Stalking, Unsafe Area, Suspicious Activity, Theft, Violence, Accident, Other*), severity levels, and distance proximity sorting.
- **Community Upvoting & Verification**: Community members can vote incidents as helpful or report inaccuracies.
- **Anonymous Reporting**: Completely masks the reporter's personal identity on public feeds.
- **Pin Drop Location Picker**: Click anywhere on the map or tap "Use Current GPS" to report exact coordinates.

### 3. 🛡️ Trusted Safe Zones & Geofencing
- **Custom Safe Zones**: Add trusted places like Home, College, Workplace, Hostel, or Family House.
- **Adjustable Perimeter**: Geofence radius slider from 50m to 2000m with interactive visual circle overlays.
- **Automated Reassurance**: Displays *"You're inside your safe zone"* when your GPS enters a trusted perimeter.
- **Strict Privacy**: Safe zones are confidential and only visible to the authenticated user.

### 4. 📞 Emergency Helplines & Contacts Circle
- **Direct 24/7 Helplines**: Instant one-touch dialing for **112** (National Emergency), **1091** (Women Helpline), **100** (Police Control), and **181** (Domestic Abuse Support) via `tel:` links.
- **Contact Priority Hierarchy**: Ranked contact cards with relationship indicators, primary contact selection, and direct calling.

### 5. ⚡ Real-Time Socket.io Synchronization
- **Instant Event Propagation**: `sos:created`, `sos:updated`, `sos:resolved`, `location:updated`, `incident:created`, and `notification:new`.
- **Live Location Streaming**: The admin map and tracking links follow user movements in real-time without page refreshes.

### 6. 📊 Admin Command Center & Telemetry
- **Recharts Analytics**:
  - Incidents by category (bar chart)
  - Threat severity distribution (pie chart)
  - 6-month monthly trends (area chart)
  - SOS response and resolution rate
- **Live Alert Monitoring**: Supervise active distress alerts with live map tracking and status updates (*Acknowledge*, *Resolve*).
- **Incident Moderation**: Verify, reject, or delete community submissions.
- **User Management**: Oversee registered accounts and access privileges.

### 7. 🌓 Dark / Light Theme & Responsive Design
- Fully responsive across desktop, tablet, and mobile displays.
- Tailwind CSS `class` dark mode persisted in `localStorage`.
- High-contrast, accessible emergency typography and touch targets.

### 8. 📞 Discreet Fake Call Simulator (Escape Tool)
- **Authentic Phone Ring Synthesis**: Synthesizes realistic phone ringtone bursts using Web Audio API without external audio file dependencies.
- **Customizable Caller Profiles**: Presets for Mom, Papa, Uber/Ola Driver, Office Manager, Police Control Room, or custom caller details.
- **Voice Speech Dialogue Simulator**: Realistic spoken conversation player via Web Speech API with subtitles and speaking equalizer animation.
- **Verbal Excuse Bank**: Quick 1-click excuse snippets to gracefully exit uncomfortable situations.
- **Countdown Trigger**: Arm calls to trigger instantly (3s), 10s, 30s, 1 min, or 3 mins.

### 9. 🚶‍♀️ Safe Journey ("Walk With Me" Timed Guardian Monitor)
- **Trip Setup**: Destination, vehicle plate number, driver details, and transport mode (Cab, Walking, Auto-Rickshaw, Bus, Metro).
- **Periodic Safety Check-Ins**: Interval countdown timer (3m, 5m, 10m, 15m) prompting user to tap *"I Am Safe"* to reset the clock.
- **Live Phone Battery Health**: Auto-reads device battery level via `navigator.getBattery()`.
- **Missed Check-In Escalation**: Grace period audio alarm and automated escalation if a check-in is missed.
- **Trip Sharing**: One-click formatted WhatsApp / SMS trip status sharing.

### 10. 🕵️‍♀️ Stealth Camouflage Cloak (Anti-Prying Screen Disguise)
- **One-Touch Disguise (Esc / Alt+S)**: Instantly cloaks the entire website into a working scientific Calculator or clean Notepad.
- **Functional Math Engine**: Real calculator where users can perform actual arithmetic.
- **Secret PIN Unmasking**: Type `1234=` on the calculator or `safewo` in notes to return to SafeWo.

### 11. 🛡️ 24/7 Verified Safe Havens & Route Safety Score
- **Interactive Safe Haven Map**: Plotted with custom markers for Police Stations, 24/7 Pharmacies, Hospitals, Transit / Metro CISF Posts, and Women Crisis Shelters.
- **Route Safety Score Evaluator**: Evaluates origin & destination to compute a 0-100% Safety Index score based on incident proximity, haven density, and time of day.
- **Community Safe Spot Suggestions**: Users can suggest verified 24/7 safe spaces.

### 12. ⚖️ Women’s Legal Rights & Cyber Safety Kit
- **Statutory Rights Directory**: Comprehensive guides to Zero FIR filing rights, sunset arrest protections (CrPC Sec 46(4)), POSH Act 2013 workplace guidelines, free legal aid (NALSA 15100), and privacy shields.
- **Digital Evidence Preservation Checklist**: Forensic evidence rules for screenshots, raw headers, and reporting to National Cyber Helpline 1930 / cybercrime.gov.in.
- **Personal Safety Readiness Quiz**: 5-question interactive audit scoring individual preparedness.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router v6, Axios, Lucide React, Leaflet & React-Leaflet, Recharts, Socket.io-client |
| **Backend** | Node.js, Express.js, MongoDB / Mongoose, Socket.io, JWT (jsonwebtoken), bcryptjs, Express-Validator, Helmet, CORS, Express-Rate-Limit, Morgan |
| **Maps** | OpenStreetMap, Leaflet |
| **Database** | MongoDB (with automatic embedded fallback to `mongodb-memory-server` for zero-setup local runs) |

---

## 📁 Complete Folder Structure

```
SafeWo/
├── package.json               # Root orchestrator (dev:server, dev:client, seed)
├── .env.example               # Root environment variables template
├── README.md                  # Detailed documentation
│
├── client/                    # Frontend React + Vite SPA
│   ├── index.html             # Entry HTML with Leaflet CSS & Google Fonts
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration with /api proxy
│   ├── tailwind.config.js     # Custom Rose & Navy theme palette + Dark Mode
│   ├── postcss.config.js
│   ├── public/
│   │   └── shield.svg         # SafeWo shield icon
│   └── src/
│       ├── main.jsx           # React DOM root with Redux & Router
│       ├── App.jsx            # Application Router, Navbar, Banners & Modals
│       ├── index.css          # Tailwind directives, animations & custom styles
│       ├── redux/
│       │   ├── store.js       # Central Redux store
│       │   └── slices/        # auth, alert, incident, contact, safeZone, notification, theme
│       ├── services/
│       │   ├── api.js         # Axios instance with JWT interceptors
│       │   └── socket.js      # Socket.io client connector
│       ├── hooks/
│       │   ├── useGeolocation.js    # Browser Geolocation API + Fallback handler
│       │   ├── useSafeZoneCheck.js  # Haversine distance geofence detector
│       │   └── useSocketEvents.js   # Real-time WebSocket synchronization
│       ├── utils/
│       │   ├── constants.js   # Helplines, categories, demo users
│       │   └── formatters.js  # Date/time, badges, colors
│       ├── components/
│       │   ├── common/        # Navbar, MobileNav, SOSButton, SOSModal, ActiveSOSBanner, HelplineBanner, Modals, Badges, Pagination
│       │   ├── cards/         # EmergencyContactCard, IncidentCard, SafeZoneCard, AlertCard, StatsCard
│       │   ├── maps/          # IncidentMap, SafeZoneMap, LiveSOSMap, LocationPickerMap
│       │   ├── filters/       # IncidentFilters
│       │   ├── modals/        # ReportIncidentModal, ContactModal, SafeZoneModal
│       │   └── routes/        # ProtectedRoute, AdminRoute
│       └── pages/
│           ├── Home.jsx             # Public Landing Page
│           ├── Login.jsx            # Login with One-Click Demo Fill
│           ├── Register.jsx         # User Registration
│           ├── ForgotPassword.jsx   # Password Recovery
│           ├── ResetPassword.jsx    # Reset Token Verification
│           ├── Dashboard.jsx        # Safety Hub with SOS, Contacts & Safe Zones
│           ├── SOSPage.jsx          # Dedicated Live SOS Emergency Tracker
│           ├── Incidents.jsx        # Safety Incident Explorer (Map + List)
│           ├── IncidentDetails.jsx  # Single Incident View + Helpful & Report
│           ├── EmergencyContacts.jsx# Contacts Circle Management
│           ├── SafeZones.jsx        # Geofenced Safe Zones Management
│           ├── AlertHistory.jsx     # Historical Alert Log
│           ├── Profile.jsx          # Profile & Password Management
│           ├── Settings.jsx         # Dark Mode, Location Diagnostics & Privacy
│           ├── AdminDashboard.jsx   # Recharts Analytics & Telemetry
│           ├── AdminAlerts.jsx      # Real-time SOS Monitoring Center
│           ├── AdminIncidents.jsx   # Incident Moderation Console
│           ├── AdminUsers.jsx       # User Directory
│           └── NotFound.jsx         # 404 Error Page
│
└── server/                    # Backend REST API & WebSocket Server
    ├── package.json           # Server dependencies & scripts
    ├── server.js              # Express app + HTTP Server + Socket.io
    ├── seed.js                # Database seeder with realistic Indian locations
    ├── .env                   # Server environment variables
    ├── .env.example
    ├── config/
    │   └── db.js              # MongoDB connector + MongoMemoryServer fallback
    ├── models/
    │   ├── User.js            # User model with bcrypt encryption
    │   ├── EmergencyContact.js# Emergency contacts with priority
    │   ├── Incident.js        # Incident reports with coordinates & status
    │   ├── SafeZone.js        # Safe zones with radius
    │   ├── Alert.js           # Emergency SOS alerts
    │   ├── Notification.js    # In-app notifications
    │   └── Location.js        # Live tracking breadcrumbs
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── contactController.js
    │   ├── alertController.js
    │   ├── incidentController.js
    │   ├── safeZoneController.js
    │   ├── notificationController.js
    │   └── adminController.js
    ├── middleware/
    │   ├── auth.js            # JWT verification & role authorization
    │   ├── validation.js      # express-validator rules
    │   ├── errorHandler.js    # Centralized safe error handler
    │   └── rateLimiter.js     # Rate limiting security
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── contactRoutes.js
    │   ├── alertRoutes.js
    │   ├── incidentRoutes.js
    │   ├── safeZoneRoutes.js
    │   ├── notificationRoutes.js
    │   └── adminRoutes.js
    ├── socket/
    │   └── socketHandler.js   # Authenticated WebSocket rooms & emitters
    └── utils/
        ├── jwt.js             # Token generator
        └── distance.js        # Haversine distance & geofence calculators
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended; verified on Node v22)
- npm (v9+)
- (Optional) Local MongoDB or MongoDB Atlas URI (if not installed, SafeWo automatically boots an in-memory database!)

---

### Step 1: Install Dependencies

From the project root:
```bash
# Install root, backend, and frontend packages
npm run install:all
```

Or install individually:
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

---

### Step 2: Seed Demo Data

Run the seed script to populate realistic demo accounts, emergency contacts, incidents (Ranchi, Delhi, Bangalore, Mumbai), safe zones, and sample alerts:

```bash
# From root:
npm run seed

# Or inside server/:
cd server
npm run seed
```

---

### Step 3: Run the Application

You can run both client and server concurrently with one command:

```bash
# From root directory:
npm run dev
```

Or run them in separate terminals:

```bash
# Terminal 1 - Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2 - Frontend Client (Port 5173)
cd client
npm run dev
```

Open your browser and navigate to:
**`http://localhost:5173`**

---

## 🔑 Demo Login Credentials

Pre-seeded accounts are readily available for immediate evaluation:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **System Admin** | `admin@safewo.demo` | `Admin@12345` | Complete Admin Console, Live SOS Dispatch, Incident Moderation, Analytics |
| **Standard User (Priya)** | `priya@safewo.demo` | `Priya@12345` | Dashboard, SOS Alert, Safe Zones, Contacts, Report Incidents |
| **Standard User (Ananya)**| `ananya@safewo.demo` | `Ananya@12345` | Alternative user with contacts and reports |

> 💡 **Quick Login Tip**: On the `/login` page, click either the **"Demo User (Priya)"** or **"Demo Admin"** button to automatically populate credentials and sign in with a single click.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user account.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Get authenticated user details (Bearer token required).
- `POST /api/auth/forgot-password` — Generate password reset token.
- `POST /api/auth/reset-password` — Reset password using token.

### Emergency SOS Alerts (`/api/alerts`)
- `POST /api/alerts/sos` — Trigger SOS alert with GPS coordinates and notify contacts.
- `GET /api/alerts/active` — Fetch current user's active SOS alert (if any).
- `POST /api/alerts/location` — Stream live GPS breadcrumb during SOS.
- `GET /api/alerts` — Fetch user's historical alerts (paginated & filterable).
- `GET /api/alerts/:id` — Fetch alert details and path history trail.
- `PUT /api/alerts/:id/resolve` — Mark alert as resolved.
- `PUT /api/alerts/:id/cancel` — Cancel false alarm.

### Safety Incidents (`/api/incidents`)
- `GET /api/incidents` — Browse incidents with keyword search, category/severity/date filters, pagination, and distance sorting.
- `GET /api/incidents/:id` — Get single incident details.
- `POST /api/incidents` — Report safety incident (with anonymous option).
- `PUT /api/incidents/:id` — Update incident report.
- `DELETE /api/incidents/:id` — Delete incident report.
- `POST /api/incidents/:id/helpful` — Toggle helpful upvote.
- `POST /api/incidents/:id/misinformation` — Flag incident for moderation.

### Emergency Contacts (`/api/contacts`)
- `GET /api/contacts` — Get user's emergency circle sorted by priority.
- `POST /api/contacts` — Add new contact.
- `PUT /api/contacts/:id` — Update contact information or priority.
- `DELETE /api/contacts/:id` — Remove contact.

### Safe Zones (`/api/safe-zones`)
- `GET /api/safe-zones` — Get safe zones with distance calculations.
- `POST /api/safe-zones` — Create safe zone (Home, College, Office) with radius.
- `PUT /api/safe-zones/:id` — Update safe zone.
- `DELETE /api/safe-zones/:id` — Delete safe zone.
- `POST /api/safe-zones/check` — Verify if coordinate falls within any safe zone perimeter.

### In-App Notifications (`/api/notifications`)
- `GET /api/notifications` — Fetch user notifications and unread count.
- `PUT /api/notifications/:id/read` — Mark notification as read.
- `PUT /api/notifications/read-all` — Mark all notifications as read.
- `DELETE /api/notifications` — Clear notifications.

### Admin Console (`/api/admin`) *(Admin Authorization Required)*
- `GET /api/admin/stats` — Metrics and Recharts data aggregations.
- `GET /api/admin/alerts` — Monitor all active and past emergency broadcasts.
- `PUT /api/admin/alerts/:id` — Update alert status (*ACKNOWLEDGED*, *RESOLVED*).
- `GET /api/admin/incidents` — Manage all incident submissions.
- `PUT /api/admin/incidents/:id` — Approve, reject, or resolve incident status.

---

## ⚡ Socket.io Real-Time Events

| Event | Direction | Description |
|---|---|---|
| `connection` | Client &rarr; Server | Authenticates with JWT token; joins `user:<id>` and `admin-channel` rooms. |
| `sos:created` | Server &rarr; Admin / Circle | Broadcasts immediately when a user confirms an emergency SOS. |
| `location:send` | Client &rarr; Server | Client streams GPS updates during active SOS. |
| `location:updated` | Server &rarr; Admin / Viewer | Streams real-time coordinate changes to live maps without page reload. |
| `sos:resolved` | Server &rarr; All | Signals that the victim is safe; clears active alert banner across clients. |
| `incident:created` | Server &rarr; Public | New incident report broadcasted to all map viewers. |
| `incident:updated` | Server &rarr; Public | Incident status or helpful counter update broadcasted. |
| `notification:new` | Server &rarr; Client | In-app notification delivered directly to the user's bell icon. |

---

## 🧪 Comprehensive Walkthrough & Testing Flows

### Flow 1: Complete Emergency SOS Alert Lifecycle
1. Sign in as `priya@safewo.demo`.
2. On the **Dashboard**, click the pulsing **"SEND SOS"** button.
3. Review the confirmation dialog showing your current GPS coordinates.
4. Click **"Send SOS Now"** (or allow the 3-second auto-send timer to elapse).
5. Notice the persistent red banner **"🚨 SOS ACTIVE"** across the top of the entire application.
6. Open an incognito window or second browser tab, log in as `admin@safewo.demo`, and navigate to **Admin &rarr; Active SOS Monitoring** (`/admin/alerts`).
7. Notice the active distress alert instantly appears via WebSockets without refreshing. Click it to view the live tracking map with the pulsing beacon.
8. From either Priya's session or the Admin console, click **"I'm Safe / Resolve SOS"**.
9. The emergency state immediately resolves across both sessions!

### Flow 2: Incident Exploration & Reporting
1. Navigate to **Incidents** (`/incidents`).
2. Toggle between **Split**, **Map**, and **List** views.
3. Filter by Category (*Harassment*, *Theft*) or Severity (*Critical*).
4. Click any map pin to view the popup preview, or click **"Details"** to view the full page with description and helpful upvoting.
5. Click **"Report Incident"** to drop a custom pin or use your current GPS, enter details, optionally check **"Report Anonymously"**, and submit.
6. The incident instantly shows on the map and in the admin moderation queue.

### Flow 3: Emergency Contacts Management
1. Navigate to **Contacts** (`/contacts`).
2. Click **"Add Emergency Contact"**.
3. Fill in Contact Name, Relationship (*Mother, Sister, Guardian*), Phone Number, and check **"Set as Primary"**.
4. Test the **"Call Now"** button (triggers native device dialer via `tel:`).
5. Edit or delete contacts with the accessible dialogs.

### Flow 4: Safe Zones & Geofencing
1. Navigate to **Safe Zones** (`/safe-zones`).
2. View your trusted perimeters displayed as green circles on the map.
3. Add a safe zone near your current coordinates with a 300m radius.
4. Observe the indicator: *"You're inside your safe zone"* when your GPS falls within the perimeter.

### Flow 5: Admin Command Center & Analytics
1. Sign in as `admin@safewo.demo`.
2. Explore Recharts data:
   - Category distribution bar chart
   - Threat severity distribution pie chart
   - 6-month incident vs. alert trends area chart
3. Navigate to **Incident Moderation** (`/admin/incidents`) and approve (*Verify*) or dismiss (*Reject*) submissions.

---

## 🛡️ Security & Privacy Features
- **Zero Public Exposure of Private Residences**: Safe zones are confidential to the user.
- **On-Demand Location Broadcasting**: GPS tracking is activated strictly when the user deliberately triggers SOS.
- **JWT Authentication & Bcrypt Hashing**: Passwords are encrypted with salt factor 10.
- **Express-Rate-Limit**: Guards authentication and public endpoints from brute-force attempts.
- **Helmet HTTP Security**: Secure headers configured.
- **Input Sanitization**: Express-validator protects all incoming payloads.

---

## 🔮 Future Integration Possibilities
- **External SMS Gateway**: Connect Twilio / AWS SNS inside `server/controllers/alertController.js` to send physical SMS messages with Google Maps links to emergency contacts.
- **Web Push Notifications**: Integrate standard Service Worker Push API for background lockscreen alerts.
- **Hardware Bluetooth Wearable**: Connect low-energy Bluetooth (BLE) smart ring or pendant buttons to trigger the SOS endpoint via Web Bluetooth API.

---

## 📄 License
SafeWo is open-source software crafted with care for women safety and community resilience.
