const express = require('express');
const router = express.Router();
const { db, saveDB } = require('../db');
const { authenticateToken } = require('./auth');

// GET /api/medicine-reminders
router.get('/', authenticateToken, (req, res) => {
  try {
    const patient = db.patients.find(p => p.user_id === req.user.id);
    const patId = patient ? patient.id : req.user.patientId;

    const reminders = db.medicine_reminders.filter(m => m.patient_id === patId);
    return res.json(reminders);
  } catch (err) {
    console.error('Error fetching medicine reminders:', err);
    return res.status(500).json({ error: 'Failed to fetch medicine reminders' });
  }
});

// POST /api/medicine-reminders
router.post('/', authenticateToken, (req, res) => {
  try {
    const { medicineName, dosage, frequency, time, startDate, endDate, notes } = req.body;

    if (!medicineName || !time) {
      return res.status(400).json({ error: 'Medicine name and time are required' });
    }

    const patient = db.patients.find(p => p.user_id === req.user.id);
    const patId = patient ? patient.id : req.user.patientId || `pat-${req.user.id}`;

    const newReminder = {
      id: `med-${Date.now()}`,
      patient_id: patId,
      medicine_name: medicineName,
      dosage: dosage || '1 Tablet',
      frequency: frequency || 'Daily',
      time,
      start_date: startDate || new Date().toISOString().split('T')[0],
      end_date: endDate || '2026-12-31',
      status: 'Pending',
      notes: notes || ''
    };

    db.medicine_reminders.push(newReminder);
    saveDB();

    return res.status(201).json({
      message: 'Medicine reminder created successfully',
      reminder: newReminder
    });
  } catch (err) {
    console.error('Error creating medicine reminder:', err);
    return res.status(500).json({ error: 'Failed to create medicine reminder' });
  }
});

// PUT /api/medicine-reminders/:id (Update status or details)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const reminder = db.medicine_reminders.find(m => m.id === req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Medicine reminder not found' });

    const { status, medicineName, dosage, frequency, time, notes } = req.body;

    if (status) reminder.status = status; // 'Taken', 'Pending', 'Skipped'
    if (medicineName) reminder.medicine_name = medicineName;
    if (dosage) reminder.dosage = dosage;
    if (frequency) reminder.frequency = frequency;
    if (time) reminder.time = time;
    if (notes !== undefined) reminder.notes = notes;

    saveDB();

    return res.json({
      message: 'Medicine reminder updated',
      reminder
    });
  } catch (err) {
    console.error('Error updating medicine reminder:', err);
    return res.status(500).json({ error: 'Failed to update medicine reminder' });
  }
});

// DELETE /api/medicine-reminders/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const idx = db.medicine_reminders.findIndex(m => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Medicine reminder not found' });

    db.medicine_reminders.splice(idx, 1);
    saveDB();

    return res.json({ message: 'Medicine reminder deleted successfully' });
  } catch (err) {
    console.error('Error deleting medicine reminder:', err);
    return res.status(500).json({ error: 'Failed to delete medicine reminder' });
  }
});

module.exports = router;
