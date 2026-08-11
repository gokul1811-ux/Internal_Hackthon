const express = require('express');
const router = express.Router();
const { db, saveDB, recalculateQueue } = require('../db');
const { authenticateToken } = require('./auth');

// GET /api/queue - Doctor/Staff queue view
router.get('/', authenticateToken, (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    
    if (!doctorId && req.user.role === 'doctor') {
      const doc = db.doctors.find(d => d.user_id === req.user.id);
      if (doc) doctorId = doc.id;
    }

    let entries = db.queue_entries;
    if (doctorId) {
      entries = entries.filter(q => q.doctor_id === doctorId);
    }

    const detailedQueue = entries.map(q => {
      const apt = db.appointments.find(a => a.id === q.appointment_id);
      const sym = db.symptom_analysis.find(s => s.appointment_id === q.appointment_id);
      const patientUser = apt ? db.users.find(u => u.name === apt.patient_name) : null;
      return {
        ...q,
        patient_name: apt ? apt.patient_name : 'Patient',
        appointment_time: apt ? apt.appointment_time : '--:--',
        symptoms: apt ? apt.symptoms : '',
        aiCategory: sym ? sym.category : 'General',
        aiUrgency: sym ? sym.urgency : 'Low',
        aiSuggestedPriority: sym ? sym.suggested_priority : 'Normal',
        aiReason: sym ? sym.reason : '',
        aiDisclaimer: sym ? sym.disclaimer : ''
      };
    });

    return res.json(detailedQueue);
  } catch (err) {
    console.error('Error fetching queue:', err);
    return res.status(500).json({ error: 'Failed to fetch queue entries' });
  }
});

// GET /api/queue/status - Patient live status lookup
router.get('/status', authenticateToken, (req, res) => {
  try {
    const patient = db.patients.find(p => p.user_id === req.user.id);
    const patId = patient ? patient.id : req.user.patientId;

    const activeQueueEntry = db.queue_entries.find(
      q => q.patient_id === patId && (q.status === 'Waiting' || q.status === 'Called' || q.status === 'In Consultation')
    );

    if (!activeQueueEntry) {
      return res.json({ hasActiveToken: false });
    }

    const apt = db.appointments.find(a => a.id === activeQueueEntry.appointment_id);
    const sym = db.symptom_analysis.find(s => s.appointment_id === activeQueueEntry.appointment_id);

    return res.json({
      hasActiveToken: true,
      token: activeQueueEntry.token,
      queuePosition: activeQueueEntry.queue_position,
      patientsAhead: activeQueueEntry.patients_ahead,
      estimatedWaitMins: activeQueueEntry.estimated_wait_mins,
      status: activeQueueEntry.status,
      confirmedPriority: activeQueueEntry.confirmed_priority,
      doctorName: apt ? apt.doctor_name : 'Doctor',
      departmentName: apt ? apt.department_name : 'Department',
      appointmentTime: apt ? apt.appointment_time : '--:--',
      symptoms: apt ? apt.symptoms : '',
      symptomAnalysis: sym || null
    });
  } catch (err) {
    console.error('Error fetching queue status:', err);
    return res.status(500).json({ error: 'Failed to fetch live queue status' });
  }
});

// POST /api/queue/:id/confirm-priority (Doctor confirms or updates queue priority)
router.post('/:id/confirm-priority', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only authorized doctors can modify queue priority' });
    }

    const { priority } = req.body; // 'Normal', 'Priority', 'Urgent Review'
    if (!['Normal', 'Priority', 'Urgent Review'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    const entry = db.queue_entries.find(q => q.id === req.params.id);
    if (!entry) return res.status(404).json({ error: 'Queue entry not found' });

    entry.confirmed_priority = priority;
    saveDB();

    // Recalculate queue order based on updated confirmed priority
    recalculateQueue(entry.doctor_id);

    return res.json({
      message: `Queue priority updated to ${priority}`,
      queueEntry: entry
    });
  } catch (err) {
    console.error('Error confirming priority:', err);
    return res.status(500).json({ error: 'Failed to update priority' });
  }
});

// POST /api/queue/:id/call (Doctor calls patient)
router.post('/:id/call', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can call patients' });
    }

    const entry = db.queue_entries.find(q => q.id === req.params.id);
    if (!entry) return res.status(404).json({ error: 'Queue entry not found' });

    entry.status = 'In Consultation';
    entry.called_at = new Date().toISOString();

    const apt = db.appointments.find(a => a.id === entry.appointment_id);
    if (apt) apt.status = 'In Consultation';

    saveDB();
    recalculateQueue(entry.doctor_id);

    return res.json({
      message: `Patient with token ${entry.token} called for consultation`,
      queueEntry: entry
    });
  } catch (err) {
    console.error('Error calling patient:', err);
    return res.status(500).json({ error: 'Failed to call patient' });
  }
});

// POST /api/queue/:id/complete (Doctor completes consultation + notes)
router.post('/:id/complete', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can complete consultations' });
    }

    const { diagnosisNotes, prescriptionNotes, followUpDate } = req.body;

    const entry = db.queue_entries.find(q => q.id === req.params.id);
    if (!entry) return res.status(404).json({ error: 'Queue entry not found' });

    entry.status = 'Completed';
    entry.completed_at = new Date().toISOString();

    const apt = db.appointments.find(a => a.id === entry.appointment_id);
    if (apt) apt.status = 'Completed';

    // Record Consultation details
    const consultId = `cns-${Date.now()}`;
    const newConsultation = {
      id: consultId,
      appointment_id: entry.appointment_id,
      doctor_id: entry.doctor_id,
      patient_id: entry.patient_id,
      diagnosis_notes: diagnosisNotes || 'Routine consultation completed.',
      prescription_notes: prescriptionNotes || 'No prescription specified.',
      follow_up_date: followUpDate || '',
      created_at: new Date().toISOString()
    };

    db.consultations.push(newConsultation);
    saveDB();

    recalculateQueue(entry.doctor_id);

    return res.json({
      message: `Consultation completed for token ${entry.token}`,
      queueEntry: entry,
      consultation: newConsultation
    });
  } catch (err) {
    console.error('Error completing consultation:', err);
    return res.status(500).json({ error: 'Failed to complete consultation' });
  }
});

module.exports = router;
