import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AISymptomCard from '../components/AISymptomCard';
import TokenBadge from '../components/TokenBadge';
import { Calendar, Clock, Stethoscope, Building2, FileText, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BookAppointmentPage({ setActivePage }) {
  const { token } = useAuth();
  const { t } = useLanguage();

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [symptoms, setSymptoms] = useState('I have severe chest discomfort and difficulty breathing when walking.');

  const [aiPreview, setAiPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch departments & doctors
  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        if (data.length > 0) setSelectedDept(data[0].id);
      })
      .catch(console.error);

    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        if (data.length > 0) setSelectedDoctor(data[0].id);
      })
      .catch(console.error);
  }, []);

  // Filter doctors by selected department
  const filteredDoctors = selectedDept
    ? doctors.filter(d => d.department_id === selectedDept)
    : doctors;

  // Real-time AI Triage analysis preview on symptom input
  useEffect(() => {
    if (!symptoms || symptoms.trim().length < 5) {
      setAiPreview(null);
      return;
    }

    const timer = setTimeout(() => {
      setAnalyzing(true);
      fetch('/api/symptom-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      })
        .then(res => res.json())
        .then(data => {
          setAiPreview(data);
          setAnalyzing(false);
        })
        .catch(() => setAnalyzing(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [symptoms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          departmentId: selectedDept,
          appointmentDate,
          appointmentTime,
          symptoms
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to book appointment');

      setBookingSuccess(data);
    } catch (err) {
      setError(err.message || 'Server error while booking');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'];

  if (bookingSuccess) {
    const { appointment, token: tokenCode, queuePosition, patientsAhead, estimatedWaitMins, symptomAnalysis } = bookingSuccess;
    return (
      <div className="container" style={{ maxWidth: '680px', margin: '2rem auto' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderTop: '4px solid #10b981' }}>
          <div style={{ background: '#dcfce7', color: '#15803d', width: '64px', height: '64px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Appointment Confirmed!
          </h2>
          <p style={{ color: '#059669', fontWeight: 600, marginTop: '0.25rem' }}>
            Your appointment has been added to the queue.
          </p>

          <div style={{ margin: '1.75rem 0' }}>
            <TokenBadge 
              token={tokenCode}
              position={queuePosition}
              patientsAhead={patientsAhead}
              waitMins={estimatedWaitMins}
              status="Waiting"
              priority={symptomAnalysis?.suggested_priority || 'Normal'}
            />
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Doctor:</span>
              <strong style={{ color: '#0f172a' }}>{appointment.doctor_name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Department:</span>
              <strong style={{ color: '#0f172a' }}>{appointment.department_name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Scheduled Time:</span>
              <strong style={{ color: '#0284c7' }}>{appointment.appointment_date} at {appointment.appointment_time}</strong>
            </div>
          </div>

          {symptomAnalysis && (
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <AISymptomCard analysis={symptomAnalysis} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setActivePage('patient-dashboard')}>
              Go to Patient Dashboard
            </button>
            <button className="btn btn-secondary" onClick={() => setActivePage('queue-track')}>
              Track Live Queue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('bookTitle')}</h1>
        <p style={{ color: '#64748b' }}>Select department, doctor, slot, and enter symptoms for smart queue prioritization.</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid-2" style={{ gap: '2rem' }}>
        {/* Left Column: Form Controls */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={16} color="#0284c7" /> {t('selectDepartment')}
            </label>
            <select 
              className="form-select"
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              required
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Stethoscope size={16} color="#0284c7" /> {t('selectDoctor')}
            </label>
            <select 
              className="form-select"
              value={selectedDoctor}
              onChange={e => setSelectedDoctor(e.target.value)}
              required
            >
              {filteredDoctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization} ({doc.room_number})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="#0284c7" /> {t('selectDate')}
            </label>
            <input 
              type="date"
              className="form-input"
              value={appointmentDate}
              onChange={e => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="#0284c7" /> {t('selectTime')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {timeSlots.map(slot => (
                <button
                  type="button"
                  key={slot}
                  className={`btn btn-sm ${appointmentTime === slot ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAppointmentTime(slot)}
                  style={{ fontSize: '0.8rem', padding: '0.4rem' }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} color="#0284c7" /> {t('symptomsLabel')}
            </label>
            <textarea 
              className="form-textarea"
              rows={4}
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder={t('symptomsPlaceholder')}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Generating Queue Token...' : t('btnConfirmBooking')} <ArrowRight size={18} />
          </button>
        </div>

        {/* Right Column: AI Triage Live Preview Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 700 }}>
            <Sparkles size={18} /> Real-Time AI Symptom Triage Preview
          </div>

          {analyzing ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Analyzing symptom patterns...
            </div>
          ) : aiPreview ? (
            <AISymptomCard analysis={aiPreview} />
          ) : (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              Type your symptoms on the left to see instant AI urgency & priority classification preview.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
