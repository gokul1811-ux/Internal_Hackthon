const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('./auth');

// GET /api/analytics/doctor
router.get('/doctor', authenticateToken, (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    if (!doctorId && req.user.role === 'doctor') {
      const doc = db.doctors.find(d => d.user_id === req.user.id);
      if (doc) doctorId = doc.id;
    }

    const appointments = doctorId 
      ? db.appointments.filter(a => a.doctor_id === doctorId)
      : db.appointments;

    const queueEntries = doctorId
      ? db.queue_entries.filter(q => q.doctor_id === doctorId)
      : db.queue_entries;

    const totalToday = appointments.length;
    const waitingCount = queueEntries.filter(q => q.status === 'Waiting').length;
    const inConsultationCount = queueEntries.filter(q => q.status === 'In Consultation').length;
    const completedCount = queueEntries.filter(q => q.status === 'Completed').length;

    // Priority breakdown
    const urgentCount = queueEntries.filter(q => (q.confirmed_priority || q.suggested_priority) === 'Urgent Review').length;
    const priorityCount = queueEntries.filter(q => (q.confirmed_priority || q.suggested_priority) === 'Priority').length;
    const normalCount = queueEntries.filter(q => (q.confirmed_priority || q.suggested_priority) === 'Normal').length;

    // Category distribution
    const categories = {};
    db.symptom_analysis.forEach(sa => {
      const cat = sa.category || 'General';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    return res.json({
      totalToday,
      waitingCount,
      inConsultationCount,
      completedCount,
      priorityDistribution: {
        urgent: urgentCount,
        priority: priorityCount,
        normal: normalCount
      },
      categoryDistribution: categories,
      avgWaitTimeMins: 12
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return res.status(500).json({ error: 'Failed to fetch analytics metrics' });
  }
});

module.exports = router;
