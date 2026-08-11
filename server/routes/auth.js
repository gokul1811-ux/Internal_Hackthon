const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, saveDB } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'smartcare_hackathon_secret_key_2026';

// Middleware for JWT verification
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// POST /api/auth/register (Patients only)
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone, age, gender, bloodGroup } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const userId = `usr-pat-${Date.now()}`;
    const patientId = `pat-${Date.now()}`;

    const newUser = {
      id: userId,
      name,
      email: email.toLowerCase(),
      password_hash,
      role: 'patient',
      phone: phone || '',
      created_at: new Date().toISOString()
    };

    const newPatient = {
      id: patientId,
      user_id: userId,
      age: parseInt(age) || 30,
      gender: gender || 'Unspecified',
      blood_group: bloodGroup || 'O+'
    };

    db.users.push(newUser);
    db.patients.push(newPatient);
    saveDB();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name, patientId: newPatient.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        patientId: newPatient.id,
        phone: newUser.phone
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    let patientId = null;
    let doctorId = null;

    if (user.role === 'patient') {
      const p = db.patients.find(pat => pat.user_id === user.id);
      if (p) patientId = p.id;
    } else if (user.role === 'doctor') {
      const d = db.doctors.find(doc => doc.user_id === user.id);
      if (d) doctorId = d.id;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, patientId, doctorId },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId,
        doctorId,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(440).json({ error: 'User not found' });

  let patientDetails = null;
  let doctorDetails = null;

  if (user.role === 'patient') {
    patientDetails = db.patients.find(p => p.user_id === user.id);
  } else if (user.role === 'doctor') {
    doctorDetails = db.doctors.find(d => d.user_id === user.id);
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      patientDetails,
      doctorDetails
    }
  });
});

module.exports = { router, authenticateToken, JWT_SECRET };
