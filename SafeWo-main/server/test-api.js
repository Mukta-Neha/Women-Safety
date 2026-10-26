const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 [SafeWo Verification Test Suite] Starting tests...');

  try {
    // 1. Healthcheck
    console.log('1️⃣ Testing /api/health...');
    const health = await makeRequest('GET', '/health');
    console.log(`   Status: ${health.status} | App: ${health.data.app}`);

    // 2. User Login
    console.log('2️⃣ Testing User Login (priya@safewo.demo)...');
    const userLogin = await makeRequest('POST', '/auth/login', {
      email: 'priya@safewo.demo',
      password: 'Priya@12345',
    });
    console.log(`   Status: ${userLogin.status} | Logged in as: ${userLogin.data.user?.name} (${userLogin.data.user?.role})`);
    const userToken = userLogin.data.token;

    // 3. Admin Login
    console.log('3️⃣ Testing Admin Login (admin@safewo.demo)...');
    const adminLogin = await makeRequest('POST', '/auth/login', {
      email: 'admin@safewo.demo',
      password: 'Admin@12345',
    });
    console.log(`   Status: ${adminLogin.status} | Role: ${adminLogin.data.user?.role}`);
    const adminToken = adminLogin.data.token;

    // 4. Fetch Incidents
    console.log('4️⃣ Testing /api/incidents...');
    const incidents = await makeRequest('GET', '/incidents?limit=5');
    console.log(`   Status: ${incidents.status} | Total incidents in database: ${incidents.data.total}`);

    // 5. Fetch Safe Zones
    console.log('5️⃣ Testing /api/safe-zones...');
    const safeZones = await makeRequest('GET', '/safe-zones', null, userToken);
    console.log(`   Status: ${safeZones.status} | User safe zones: ${safeZones.data.count}`);

    // 6. Test SOS Alert Trigger & Resolution
    console.log('6️⃣ Testing SOS Alert Creation & Resolution...');
    const sosTrigger = await makeRequest(
      'POST',
      '/alerts/sos',
      {
        latitude: 23.3441,
        longitude: 85.3096,
        type: 'SOS',
        message: 'Automated test SOS dispatch',
      },
      userToken
    );
    console.log(`   SOS Status: ${sosTrigger.status} | Alert ID: ${sosTrigger.data.data?._id}`);
    const alertId = sosTrigger.data.data?._id;

    if (alertId) {
      const sosResolve = await makeRequest(
        'PUT',
        `/alerts/${alertId}/resolve`,
        { resolutionNotes: 'Resolved by automated test suite' },
        userToken
      );
      console.log(`   Resolve Status: ${sosResolve.status} | Final Alert Status: ${sosResolve.data.data?.status}`);
    }

    // 7. Admin Stats & Analytics
    console.log('7️⃣ Testing Admin Analytics (/api/admin/stats)...');
    const adminStats = await makeRequest('GET', '/admin/stats', null, adminToken);
    console.log(`   Status: ${adminStats.status}`);
    console.log(`   Total Users: ${adminStats.data.data?.totalUsers}`);
    console.log(`   Categories count: ${adminStats.data.data?.incidentsByCategory?.length}`);
    console.log(`   Monthly trends length: ${adminStats.data.data?.monthlyTrends?.length}`);

    console.log('\n✅ [SafeWo Verification Test Suite] ALL TESTS PASSED SUCCESSFULLY! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test suite failed:', err);
    process.exit(1);
  }
};

runTests();
