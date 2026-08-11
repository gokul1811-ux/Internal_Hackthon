const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Database storage file path
const dbFilePath = path.join(__dirname, 'smartcare.json');

// Memory cache & DB helper for zero-dependency high portability
let data = {
  users: [],
  patients: [],
  doctors: [],
  departments: [],
  appointments: [],
  symptom_analysis: [],
  queue_entries: [],
  medicine_reminders: [],
  consultations: []
};

// Save to disk
function saveDB() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB to disk:', err);
  }
}

// Load from disk
function loadDB() {
  if (fs.existsSync(dbFilePath)) {
    try {
      const fileData = fs.readFileSync(dbFilePath, 'utf-8');
      data = JSON.parse(fileData);
    } catch (err) {
      console.error('Error loading DB from disk, re-initializing...', err);
      seedDatabase();
    }
  } else {
    seedDatabase();
  }
}

// Initial demo seed data creation
function seedDatabase() {
  console.log('Seeding initial demo data...');
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('password123', salt);

  // Departments
  const departments = [
    { id: 'dept-1', name: 'Cardiology', code: 'CARD', description: 'Heart and Cardiovascular Care' },
    { id: 'dept-2', name: 'General Medicine', code: 'GEN', description: 'Primary Care & General Diagnostics' },
    { id: 'dept-3', name: 'Pulmonology', code: 'PULM', description: 'Lung & Respiratory Healthcare' },
    { id: 'dept-4', name: 'Pediatrics', code: 'PED', description: 'Child and Infant Care' },
    { id: 'dept-5', name: 'Orthopedics', code: 'ORTH', description: 'Bone & Joint Specialists' }
  ];

  // Users & Roles
  const users = [
    {
      id: 'usr-doc-1',
      name: 'Dr. Priya Sharma',
      email: 'doctor@smartcare.demo',
      password_hash: passwordHash,
      role: 'doctor',
      phone: '+91 98765 43210',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr-doc-2',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh@smartcare.demo',
      password_hash: passwordHash,
      role: 'doctor',
      phone: '+91 98765 43211',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr-pat-1',
      name: 'Ramesh Patel',
      email: 'patient@smartcare.demo',
      password_hash: passwordHash,
      role: 'patient',
      phone: '+91 91234 56789',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr-pat-2',
      name: 'Ananya Roy',
      email: 'ananya@smartcare.demo',
      password_hash: passwordHash,
      role: 'patient',
      phone: '+91 91234 56790',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr-pat-3',
      name: 'Suresh V',
      email: 'suresh@smartcare.demo',
      password_hash: passwordHash,
      role: 'patient',
      phone: '+91 91234 56791',
      created_at: new Date().toISOString()
    }
  ];

  // Doctors
  const doctors = [
    {
      id: 'doc-1',
      user_id: 'usr-doc-1',
      name: 'Dr. Priya Sharma',
      department_id: 'dept-1',
      specialization: 'Senior Cardiologist',
      room_number: 'Room 302',
      avg_consultation_mins: 15
    },
    {
      id: 'doc-2',
      user_id: 'usr-doc-2',
      name: 'Dr. Rajesh Kumar',
      department_id: 'dept-2',
      specialization: 'General Physician',
      room_number: 'Room 105',
      avg_consultation_mins: 10
    }
  ];

  // Patients
  const patients = [
    {
      id: 'pat-1',
      user_id: 'usr-pat-1',
      age: 45,
      gender: 'Male',
      blood_group: 'O+'
    },
    {
      id: 'pat-2',
      user_id: 'usr-pat-2',
      age: 28,
      gender: 'Female',
      blood_group: 'A+'
    },
    {
      id: 'pat-3',
      user_id: 'usr-pat-3',
      age: 62,
      gender: 'Male',
      blood_group: 'B+'
    }
  ];

  // Appointments & Queue Entries
  const todayStr = new Date().toISOString().split('T')[0];

  const appointments = [
    {
      id: 'apt-101',
      patient_id: 'pat-1',
      doctor_id: 'doc-1',
      department_id: 'dept-1',
      patient_name: 'Ramesh Patel',
      doctor_name: 'Dr. Priya Sharma',
      department_name: 'Cardiology',
      appointment_date: todayStr,
      appointment_time: '10:00 AM',
      symptoms: 'I have severe chest discomfort and difficulty breathing when walking.',
      status: 'Waiting',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'apt-102',
      patient_id: 'pat-2',
      doctor_id: 'doc-1',
      department_id: 'dept-1',
      patient_name: 'Ananya Roy',
      doctor_name: 'Dr. Priya Sharma',
      department_name: 'Cardiology',
      appointment_date: todayStr,
      appointment_time: '10:30 AM',
      symptoms: 'Mild dizziness and high blood pressure reading at home.',
      status: 'Waiting',
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'apt-103',
      patient_id: 'pat-3',
      doctor_id: 'doc-2',
      department_id: 'dept-2',
      patient_name: 'Suresh V',
      doctor_name: 'Dr. Rajesh Kumar',
      department_name: 'General Medicine',
      appointment_date: todayStr,
      appointment_time: '11:00 AM',
      symptoms: 'High fever, body chills, and headache for 2 days.',
      status: 'Waiting',
      created_at: new Date(Date.now() - 900000).toISOString()
    }
  ];

  // Symptom Analysis Data
  const symptom_analysis = [
    {
      id: 'sym-101',
      appointment_id: 'apt-101',
      keywords: ['chest discomfort', 'difficulty breathing'],
      category: 'Cardiac',
      urgency: 'High',
      suggested_priority: 'Urgent Review',
      reason: 'Symptoms include chest discomfort and breathing difficulty requiring prompt emergency evaluation.',
      disclaimer: 'AI triage suggestion only — final priority must be confirmed by medical staff.'
    },
    {
      id: 'sym-102',
      appointment_id: 'apt-102',
      keywords: ['dizziness', 'blood pressure'],
      category: 'General Medical',
      urgency: 'Moderate',
      suggested_priority: 'Priority',
      reason: 'Dizziness and elevated BP noted for doctor assessment.',
      disclaimer: 'AI triage suggestion only — final priority must be confirmed by medical staff.'
    },
    {
      id: 'sym-103',
      appointment_id: 'apt-103',
      keywords: ['high fever', 'chills', 'headache'],
      category: 'Fever / Infection',
      urgency: 'Moderate',
      suggested_priority: 'Priority',
      reason: 'Fever indicators present for moderate priority triage.',
      disclaimer: 'AI triage suggestion only — final priority must be confirmed by medical staff.'
    }
  ];

  // Queue Entries
  const queue_entries = [
    {
      id: 'q-101',
      appointment_id: 'apt-101',
      patient_id: 'pat-1',
      doctor_id: 'doc-1',
      token: 'CARD-001',
      queue_position: 1,
      patients_ahead: 0,
      estimated_wait_mins: 5,
      suggested_priority: 'Urgent Review',
      confirmed_priority: 'Urgent Review',
      status: 'Waiting',
      called_at: null,
      completed_at: null
    },
    {
      id: 'q-102',
      appointment_id: 'apt-102',
      patient_id: 'pat-2',
      doctor_id: 'doc-1',
      token: 'CARD-002',
      queue_position: 2,
      patients_ahead: 1,
      estimated_wait_mins: 15,
      suggested_priority: 'Priority',
      confirmed_priority: 'Priority',
      status: 'Waiting',
      called_at: null,
      completed_at: null
    },
    {
      id: 'q-103',
      appointment_id: 'apt-103',
      patient_id: 'pat-3',
      doctor_id: 'doc-2',
      token: 'GEN-001',
      queue_position: 1,
      patients_ahead: 0,
      estimated_wait_mins: 10,
      suggested_priority: 'Priority',
      confirmed_priority: 'Priority',
      status: 'Waiting',
      called_at: null,
      completed_at: null
    }
  ];

  // Medicine Reminders
  const medicine_reminders = [
    {
      id: 'med-1',
      patient_id: 'pat-1',
      medicine_name: 'Aspirin (75mg)',
      dosage: '1 Tablet after breakfast',
      frequency: 'Daily',
      time: '08:30 AM',
      start_date: todayStr,
      end_date: '2026-08-30',
      status: 'Taken',
      notes: 'Take with full glass of water'
    },
    {
      id: 'med-2',
      patient_id: 'pat-1',
      medicine_name: 'Atorvastatin (10mg)',
      dosage: '1 Tablet before bed',
      frequency: 'Daily',
      time: '09:00 PM',
      start_date: todayStr,
      end_date: '2026-08-30',
      status: 'Pending',
      notes: 'Cholesterol control'
    },
    {
      id: 'med-3',
      patient_id: 'pat-1',
      medicine_name: 'Paracetamol (500mg)',
      dosage: '1 Tablet if pain occurs',
      frequency: 'As Needed',
      time: '02:00 PM',
      start_date: todayStr,
      end_date: '2026-08-15',
      status: 'Pending',
      notes: 'SOS for mild chest or body discomfort'
    }
  ];

  const consultations = [];

  data = {
    users,
    patients,
    doctors,
    departments,
    appointments,
    symptom_analysis,
    queue_entries,
    medicine_reminders,
    consultations
  };

  saveDB();
}

// Initial DB load
loadDB();

// Helper recalculate queue positions and estimated wait times
function recalculateQueue(doctorId) {
  let entries = data.queue_entries.filter(q => q.doctor_id === doctorId && (q.status === 'Waiting' || q.status === 'Called' || q.status === 'In Consultation'));
  
  // Sort priority: Urgent Review -> Priority -> Normal, then creation order
  const priorityOrder = { 'Urgent Review': 1, 'Priority': 2, 'Normal': 3 };
  
  entries.sort((a, b) => {
    let prioA = priorityOrder[a.confirmed_priority || a.suggested_priority] || 4;
    let prioB = priorityOrder[b.confirmed_priority || b.suggested_priority] || 4;
    if (prioA !== prioB) return prioA - prioB;
    return a.queue_position - b.queue_position;
  });

  const doc = data.doctors.find(d => d.id === doctorId);
  const avgMins = doc ? doc.avg_consultation_mins : 10;

  let activeCount = 0;
  entries.forEach((entry, index) => {
    if (entry.status === 'Waiting') {
      entry.patients_ahead = activeCount;
      entry.estimated_wait_mins = (activeCount + 1) * avgMins;
      activeCount++;
    } else if (entry.status === 'In Consultation') {
      entry.patients_ahead = 0;
      entry.estimated_wait_mins = 2; // almost done
    }
  });

  saveDB();
}

module.exports = {
  db: data,
  saveDB,
  recalculateQueue
};
