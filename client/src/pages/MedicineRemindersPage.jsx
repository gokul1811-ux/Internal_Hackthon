import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import MedicineReminderCard from '../components/MedicineReminderCard';
import { Pill, Plus, Clock, Calendar, FileText, CheckCircle2, Trash2 } from 'lucide-react';

export default function MedicineRemindersPage() {
  const { token } = useAuth();
  const { t } = useLanguage();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('Daily');
  const [time, setTime] = useState('02:00 PM');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2026-12-31');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReminders = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/medicine-reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReminders(data);
      }
    } catch (err) {
      console.error('Error fetching reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [token]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/medicine-reminders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchReminders();
    } catch (err) {
      console.error('Error updating reminder status:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/medicine-reminders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchReminders();
    } catch (err) {
      console.error('Error deleting reminder:', err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!medicineName || !time) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/medicine-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          medicineName,
          dosage,
          frequency,
          time,
          startDate,
          endDate,
          notes
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setMedicineName('');
        setNotes('');
        fetchReminders();
      }
    } catch (err) {
      console.error('Error adding reminder:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('medicineTitle')}</h1>
          <p style={{ color: '#64748b' }}>Configure dosage schedules and track daily pill adherence</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} /> {t('addReminder')}
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          Loading pill reminders...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Today's Pill Checklist */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Today's Scheduled Medication Checklist
            </h3>
            <MedicineReminderCard 
              reminders={reminders}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>

          {/* Full Prescription Schedule Table */}
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Full Prescription Schedule Details
            </h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Scheduled Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.length > 0 ? (
                    reminders.map(rem => (
                      <tr key={rem.id}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{rem.medicine_name}</td>
                        <td>{rem.dosage}</td>
                        <td>{rem.frequency}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: '#0284c7' }}>
                            <Clock size={14} /> {rem.time}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            rem.status === 'Taken' ? 'badge-normal' :
                            rem.status === 'Skipped' ? 'badge-urgent' : 'badge-priority'
                          }`}>
                            {rem.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDelete(rem.id)}
                            style={{ color: '#ef4444' }}
                            title="Delete Reminder"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                        No prescription reminders recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              Add New Medicine Reminder
            </h3>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">{t('medicineName')}</label>
                <input 
                  type="text"
                  className="form-input"
                  value={medicineName}
                  onChange={e => setMedicineName(e.target.value)}
                  placeholder="e.g. Paracetamol (500mg)"
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{t('dosage')}</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={dosage}
                    onChange={e => setDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet after meal"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('frequency')}</label>
                  <select 
                    className="form-select"
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Every 8 Hours">Every 8 Hours</option>
                    <option value="As Needed (SOS)">As Needed (SOS)</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{t('time')}</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Notes / Instructions</label>
                <input 
                  type="text"
                  className="form-input"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Take with warm water"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Create Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
