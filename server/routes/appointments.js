const express = require('express');
const router = express.Router();
const { db, saveDB, recalculateQueue } = require('../db');
const { authenticateToken } = require('./auth');
const { analyzeSymptoms } = require('../services/symptomAI');

// POST /api/appointments (Book appointment + generate token + AI triage)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { doctorId, departmentId, appointmentDate, appointmentTime, symptoms } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'Doctor, appointment date, and time slot are required' });
    }

    // Find doctor & dept details
    const doctor = db.doctors.find(d => d.id === doctorId);
    if (!doctor) return res.status(404).json({ error: 'Selected doctor not found' });

    const department = db.departments.find(dep => dep.id === (departmentId || doctor.department_id));
    const deptCode = department ? department.code : 'GEN';

    // Find patient record
    const patient = db.patients.find(p => p.user_id === req.user.id);
    const patientId = patient ? patient.id : req.user.patientId || `pat-${req.user.id}`;
    const user = db.users.find(u => u.id === req.user.id);
    const patientName = user ? user.name : 'Patient';

    // Run AI Symptom Triage Analysis
    const aiResult = analyzeSymptoms(symptoms);

    const aptId = `apt-${Date.now()}`;
    const newAppointment = {
      id: aptId,
      patient_id: patientId,
      doctor_id: doctorId,
      department_id: department ? department.id : doctor.department_id,
      patient_name: patientName,
      doctor_name: doctor.name,
      department_name: department ? department.name : 'General Care',
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      symptoms: symptoms || 'No symptoms provided',
      status: 'Waiting',
      created_at: new Date().toISOString()
    };

    // Save Symptom Analysis Record
    const symId = `sym-${Date.now()}`;
    const newSymptomAnalysis = {
      id: symId,
      appointment_id: aptId,
      keywords: aiResult.keywords,
      category: aiResult.category,
      urgency: aiResult.urgency,
      suggested_priority: aiResult.suggestedPriority,
      reason: aiResult.reason,
      disclaimer: aiResult.disclaimer
    };

    // Generate Token (e.g. CARD-005)
    const doctorQueue = db.queue_entries.filter(q => q.doctor_id === doctorId);
    const tokenNum = String(doctorQueue.length + 1).padStart(3, '0');
    const token = `${deptCode}-${tokenNum}`;

    const activeAhead = doctorQueue.filter(q => q.status === 'Waiting').length;
    const avgMins = doctor.avg_consultation_mins || 10;
    const estWaitMins = (activeAhead + 1) * avgMins;

    const queueId = `q-${Date.now()}`;
    const newQueueEntry = {
      id: queueId,
      appointment_id: aptId,
      patient_id: patientId,
      doctor_id: doctorId,
      token,
      queue_position: activeAhead + 1,
      patients_ahead: activeAhead,
      estimated_wait_mins: estWaitMins,
      suggested_priority: aiResult.suggestedPriority,
      confirmed_priority: aiResult.suggestedPriority, // initial default pending doc review
      status: 'Waiting',
      called_at: null,
      completed_at: null
    };

    db.appointments.push(newAppointment);
    db.symptom_analysis.push(newSymptomAnalysis);
    db.queue_entries.push(newQueueEntry);
    saveDB();

    // Recalculate queue positions
    recalculateQueue(doctorId);

    // Fetch updated entry
    const updatedEntry = db.queue_entries.find(q => q.id === queueId);

    return res.status(201).json({
      message: 'Appointment booked successfully. Added to smart queue.',
      appointment: newAppointment,
      symptomAnalysis: newSymptomAnalysis,
      token: updatedEntry ? updatedEntry.token : token,
      queuePosition: updatedEntry ? updatedEntry.queue_position : activeAhead + 1,
      patientsAhead: updatedEntry ? updatedEntry.patients_ahead : activeAhead,
      estimatedWaitMins: updatedEntry ? updatedEntry.estimated_wait_mins : estWaitMins
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    return res.status(500).json({ error: 'Server error while booking appointment' });
  }
});

// GET /api/appointments (For current patient or doctor)
router.get('/', authenticateToken, (req, res) => {
  try {
    let userAppointments = [];

    if (req.user.role === 'patient') {
      const patient = db.patients.find(p => p.user_id === req.user.id);
      const patId = patient ? patient.id : req.user.patientId;
      userAppointments = db.appointments.filter(a => a.patient_id === patId);
    } else if (req.user.role === 'doctor') {
      const doctor = db.doctors.find(d => d.user_id === req.user.id);
      const docId = doctor ? doctor.id : req.user.doctorId;
      userAppointments = db.appointments.filter(a => a.doctor_id === docId);
    } else {
      userAppointments = db.appointments;
    }

    const detailedList = userAppointments.map(apt => {
      const sym = db.symptom_analysis.find(s => s.appointment_id === apt.id);
      const q = db.queue_entries.find(qe => qe.appointment_id === apt.id);
      return {
        ...apt,
        symptomAnalysis: sym || null,
        queueEntry: q || null
      };
    });

    return res.json(detailedList);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    return res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// GET /api/appointments/:id
router.get('/:id', authenticateToken, (req, res) => {
  const apt = db.appointments.find(a => a.id === req.params.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });

  const sym = db.symptom_analysis.find(s => s.appointment_id === apt.id);
  const q = db.queue_entries.find(qe => qe.appointment_id === apt.id);

  return res.json({
    ...apt,
    symptomAnalysis: sym || null,
    queueEntry: q || null
  });
});

module.exports = router;
