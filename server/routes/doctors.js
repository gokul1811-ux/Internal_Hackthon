const express = require('express');
const router = express.Router();
const { db } = require('../db');

// GET /api/departments
router.get('/departments', (req, res) => {
  res.json(db.departments);
});

// GET /api/doctors
router.get('/doctors', (req, res) => {
  const doctorsList = db.doctors.map(d => {
    const dept = db.departments.find(dep => dep.id === d.department_id);
    return {
      ...d,
      department_name: dept ? dept.name : 'General'
    };
  });
  res.json(doctorsList);
});

module.exports = router;
