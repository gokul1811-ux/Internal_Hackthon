import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import TokenBadge from '../components/TokenBadge';
import QueueVisualizer from '../components/QueueVisualizer';
import MedicineReminderCard from '../components/MedicineReminderCard';
import AISymptomCard from '../components/AISymptomCard';
import { Calendar, Clock, Pill, History, PlusCircle, ArrowRight, UserCheck, Activity } from 'lucide-react';

export default function PatientDashboard({ setActivePage }) {
  const { user, token } = useAuth();
  const { t } = useLanguage();

  const [activeQueue, setActiveQueue] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Patient Dashboard Data
  const fetchData = async () => {
    if (!token) return;
    try {
      // 1. Fetch Active Queue Status
      const qRes = await fetch('/api/queue/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (qRes.ok) {
        const qData = await qRes.json();
        setActiveQueue(qData.hasActiveToken ? qData : null);
      }

      // 2. Fetch Appointments
      const aptRes = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (aptRes.ok) {
        const aptData = await aptRes.json();
        setAppointments(aptData);
      }

      // 3. Fetch Medicine Reminders
      const medRes = await fetch('/api/medicine-reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (medRes.ok) {
        const medData = await medRes.json();
        setReminders(medData);
      }
    } catch (err) {
      console.error('Error fetching patient dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll queue status every 10 seconds for real-time update
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleUpdateMedicineStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/medicine-reminders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating medicine:', err);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9, marginBottom: '0.25rem' }}>
              Patient Portal • SmartCare Queue
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800 }}>
              Welcome back, {user?.name || 'Patient'}!
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '0.35rem' }}>
              Track your live consultation queue and today's medication schedule.
            </p>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => setActivePage('book')}
            style={{ background: '#ffffff', color: '#0284c7', fontWeight: 700 }}
          >
            <PlusCircle size={18} /> {t('btnBookNow')}
          </button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid-4">
        <div className="card" onClick={() => setActivePage('book')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.75rem', borderRadius: '12px' }}>
            <Calendar size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Book Appointment</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Select Doctor & Time</span>
          </div>
        </div>

        <div className="card" onClick={() => setActivePage('queue-track')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#ccfbf1', color: '#0d9488', padding: '0.75rem', borderRadius: '12px' }}>
            <Clock size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Track Live Queue</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>View Wait Position</span>
          </div>
        </div>

        <div className="card" onClick={() => setActivePage('medicines')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.75rem', borderRadius: '12px' }}>
            <Pill size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Medicine Reminders</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Pill Schedule</span>
          </div>
        </div>

        <div className="card" onClick={() => setActivePage('history')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#f3e8ff', color: '#9333ea', padding: '0.75rem', borderRadius: '12px' }}>
            <History size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Appointment History</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Past Consultations</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Queue Token vs Medicine Reminders */}
      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Active Queue Section */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock color="#0284c7" size={20} /> Active Queue Token & Status
          </h3>

          {activeQueue ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <TokenBadge 
                token={activeQueue.token}
                position={activeQueue.queuePosition}
                patientsAhead={activeQueue.patientsAhead}
                waitMins={activeQueue.estimatedWaitMins}
                status={activeQueue.status}
                priority={activeQueue.confirmedPriority}
              />

              <div className="card">
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Doctor: {activeQueue.doctorName} ({activeQueue.departmentName})
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                  Time Slot: {activeQueue.appointmentTime}
                </div>
                <QueueVisualizer currentStatus={activeQueue.status} />
              </div>

              {activeQueue.symptomAnalysis && (
                <AISymptomCard analysis={activeQueue.symptomAnalysis} />
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <Clock size={42} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Active Queue Token</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.35rem', marginBottom: '1.25rem' }}>
                You do not have an active queue token for today. Book an appointment to join the smart doctor queue.
              </p>
              <button className="btn btn-primary" onClick={() => setActivePage('book')}>
                <PlusCircle size={16} /> Book New Appointment
              </button>
            </div>
          )}
        </div>

        {/* Today's Medicine Reminders Card */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pill color="#0d9488" size={20} /> Today's Medicine Reminders
            </h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setActivePage('medicines')}
            >
              Manage Schedule
            </button>
          </div>

          <MedicineReminderCard 
            reminders={reminders}
            onUpdateStatus={handleUpdateMedicineStatus}
          />
        </div>
      </div>

      {/* Recent Appointment History */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History color="#64748b" size={20} /> Recent Appointments
        </h3>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Token</th>
                <th>Symptoms</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.appointment_date}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{apt.appointment_time}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{apt.doctor_name}</td>
                    <td>{apt.department_name}</td>
                    <td>
                      <span className="token-pill" style={{ fontSize: '0.85rem', padding: '0.2rem 0.6rem' }}>
                        {apt.queueEntry?.token || 'N/A'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {apt.symptoms}
                    </td>
                    <td>
                      <span className={`badge ${apt.status === 'Completed' ? 'badge-normal' : 'badge-priority'}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                    No appointment history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
