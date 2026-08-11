const express = require('express');
const cors = require('cors');
const path = require('path');
const { router: authRouter } = require('./routes/auth');
const doctorsRouter = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');
const queueRouter = require('./routes/queue');
const symptomsRouter = require('./routes/symptoms');
const medicineRouter = require('./routes/medicine');
const analyticsRouter = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/queue', queueRouter);
app.use('/api', symptomsRouter);
app.use('/api/medicine-reminders', medicineRouter);
app.use('/api/analytics', analyticsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SmartCare Queue & Medicine Server', time: new Date().toISOString() });
});

// Serve frontend static files in production if available
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('SmartCare Queue Server API is Running. Client application is developing.');
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` SmartCare Server running on http://localhost:${PORT}`);
  console.log(` Demo Doctor Credentials:  doctor@smartcare.demo  / password123`);
  console.log(` Demo Patient Credentials: patient@smartcare.demo / password123`);
  console.log(`=======================================================`);
});
