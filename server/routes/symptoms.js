const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../services/symptomAI');

// POST /api/symptom-analysis
router.post('/symptom-analysis', (req, res) => {
  try {
    const { symptoms } = req.body;
    const result = analyzeSymptoms(symptoms);
    return res.json(result);
  } catch (err) {
    console.error('Error in symptom analysis route:', err);
    return res.status(500).json({ error: 'Failed to perform AI symptom triage analysis' });
  }
});

module.exports = router;
