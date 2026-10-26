const User = require('../models/User');
const Alert = require('../models/Alert');
const Incident = require('../models/Incident');
const { emitSOSUpdated, emitSOSResolved, emitIncidentUpdated } = require('../socket/socketHandler');

// @desc    Get complete administrative statistics and Recharts analytics data
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeAlerts = await Alert.countDocuments({ status: { $in: ['ACTIVE', 'ACKNOWLEDGED'] } });
    const totalIncidents = await Incident.countDocuments();
    const criticalIncidents = await Incident.countDocuments({ severity: 'CRITICAL' });
    const resolvedAlerts = await Alert.countDocuments({ status: 'RESOLVED' });
    const pendingIncidents = await Incident.countDocuments({ status: 'PENDING' });

    // Aggregations for Recharts
    // 1. Incidents by Category
    const categoryAgg = await Incident.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const incidentsByCategory = categoryAgg.map((item) => ({
      category: item._id,
      count: item.count,
    }));

    // 2. Incidents by Severity
    const severityAgg = await Incident.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);
    const severityColorMap = {
      LOW: '#10b981', // green
      MEDIUM: '#f59e0b', // amber
      HIGH: '#f97316', // orange
      CRITICAL: '#ef4444', // red
    };
    const incidentsBySeverity = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((sev) => {
      const match = severityAgg.find((s) => s._id === sev);
      return {
        severity: sev,
        count: match ? match.count : 0,
        color: severityColorMap[sev],
      };
    });

    // 3. Recent 6-Month Timeline Trends
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyIncidentsAgg = await Incident.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthlyAlertsAgg = await Alert.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const label = `${monthNames[m - 1]} ${y.toString().slice(-2)}`;

      const incMatch = monthlyIncidentsAgg.find((item) => item._id.year === y && item._id.month === m);
      const alertMatch = monthlyAlertsAgg.find((item) => item._id.year === y && item._id.month === m);

      monthlyTrends.push({
        month: label,
        incidents: incMatch ? incMatch.count : 0,
        alerts: alertMatch ? alertMatch.count : 0,
      });
    }

    // 4. Recent SOS Alerts
    const recentAlerts = await Alert.find()
      .populate('userId', 'name phone email profileImage')
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Recent Incidents
    const recentIncidents = await Incident.find()
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(5);

    const totalAlertsCount = await Alert.countDocuments();
    const resolutionRate = totalAlertsCount > 0 ? Math.round((resolvedAlerts / totalAlertsCount) * 100) : 100;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeAlerts,
        totalIncidents,
        criticalIncidents,
        resolvedAlerts,
        pendingIncidents,
        resolutionRate,
        incidentsByCategory,
        incidentsBySeverity,
        monthlyTrends,
        recentAlerts,
        recentIncidents,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all alerts for admin monitoring
// @route   GET /api/admin/alerts
// @access  Private/Admin
const getAdminAlerts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const alerts = await Alert.find(query)
      .populate('userId', 'name phone email profileImage')
      .sort({ status: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update SOS alert status (Acknowledge, Resolve)
// @route   PUT /api/admin/alerts/:id
// @access  Private/Admin
const updateAdminAlert = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;

    const alert = await Alert.findById(req.params.id).populate('userId', 'name phone email');
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    if (status) {
      alert.status = status;
    }
    if (resolutionNotes) {
      alert.resolutionNotes = resolutionNotes;
    }
    if (status === 'RESOLVED' || status === 'CANCELLED') {
      alert.resolvedAt = Date.now();
      alert.resolvedBy = req.user.id;
    }

    await alert.save();

    if (status === 'RESOLVED') {
      emitSOSResolved(alert);
    } else {
      emitSOSUpdated(alert);
    }

    res.status(200).json({
      success: true,
      message: `Alert status updated to ${alert.status}`,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all incidents for admin moderation
// @route   GET /api/admin/incidents
// @access  Private/Admin
const getAdminIncidents = async (req, res, next) => {
  try {
    const { status, category, severity, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'ALL') query.status = status;
    if (category && category !== 'ALL') query.category = category;
    if (severity && severity !== 'ALL') query.severity = severity;

    const total = await Incident.countDocuments(query);
    const incidents = await Incident.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: incidents.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page, 10),
      data: incidents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate incident (Approve/Verify, Reject, Resolve, Delete)
// @route   PUT /api/admin/incidents/:id
// @access  Private/Admin
const updateAdminIncidentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    if (status) {
      incident.status = status;
    }

    await incident.save();
    emitIncidentUpdated(incident);

    res.status(200).json({
      success: true,
      message: `Incident status updated to ${incident.status}`,
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAdminAlerts,
  updateAdminAlert,
  getAdminIncidents,
  updateAdminIncidentStatus,
};
