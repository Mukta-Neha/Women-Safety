export const HELPLINES = [
  {
    number: '112',
    name: 'National Emergency',
    tag: 'All Emergencies (Police, Fire, Medical)',
    color: 'bg-red-600 hover:bg-red-700 text-white',
    tel: 'tel:112',
  },
  {
    number: '1091',
    name: 'Women Helpline',
    tag: '24/7 Dedicated Women Distress Support',
    color: 'bg-rose-600 hover:bg-rose-700 text-white',
    tel: 'tel:1091',
  },
  {
    number: '100',
    name: 'Police Control',
    tag: 'Immediate Police Assistance',
    color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    tel: 'tel:100',
  },
  {
    number: '181',
    name: 'Women Helpline (Domestic Abuse)',
    tag: 'Specialized counseling and protection',
    color: 'bg-purple-600 hover:bg-purple-700 text-white',
    tel: 'tel:181',
  },
];

export const INCIDENT_CATEGORIES = [
  'Harassment',
  'Theft',
  'Stalking',
  'Unsafe Area',
  'Suspicious Activity',
  'Violence',
  'Accident',
  'Other',
];

export const INCIDENT_SEVERITIES = [
  { value: 'LOW', label: 'Low', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300' },
  { value: 'CRITICAL', label: 'Critical', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300' },
];

export const SAFE_ZONE_TYPES = [
  'Home',
  'College',
  'Office',
  'Hostel',
  'Family House',
  'Other',
];

export const DEFAULT_MAP_CENTER = [23.3441, 85.3096]; // Ranchi, India
export const DEFAULT_MAP_ZOOM = 13;

export const DEMO_USERS = [
  {
    role: 'Admin Account',
    email: 'admin@safewo.demo',
    password: 'Admin@12345',
    name: 'SafeWo Admin',
  },
  {
    role: 'Regular User (Priya)',
    email: 'priya@safewo.demo',
    password: 'Priya@12345',
    name: 'Priya Sharma',
  },
];
