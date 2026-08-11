import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { Stethoscope, Users, Clock, CheckCircle, AlertTriangle, PhoneCall, FileText, Check, ShieldCheck, Tag } from 'lucide-react';

export default function DoctorDashboard() {
  const { token, user } = useAuth();
  const { t } = useLanguage();

  const [queue, setQueue] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Complete Consultation Modal State
  const [selectedQueueItem, setSelectedQueueItem] = useState(null);
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [submittingComplete, setSubmittingComplete] = useState(false);

  // Fetch Doctor Queue & Analytics Data
  const fetchData = async () => {
    if (!token) return;
    try {
      // 1. Fetch Queue List
      const qRes = await fetch('/api/queue', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (qRes.ok) {
        const qData = await qRes.json();
        setQueue(qData);
      }

      // 2. Fetch Analytics
      const aRes = await fetch('/api/analytics/doctor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (aRes.ok) {
        const aData = await aRes.json();
        setAnalytics(aData);
      }
    } catch (err) {
      console.error('Error loading doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // 8 sec auto update
    return () => clearInterval(interval);
  }, [token]);

  // Doctor Action: Confirm or Modify Priority
  const handleConfirmPriority = async (queueId, priority) => {
    try {
      const res = await fetch(`/api/queue/${queueId}/confirm-priority`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ priority })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error confirming priority:', err);
    }
  };

  // Doctor Action: Call Patient
  const handleCallPatient = async (queueId) => {
    try {
      const res = await fetch(`/api/queue/${queueId}/call`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error calling patient:', err);
    }
  };

  // Doctor Action: Complete Consultation Submission
  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQueueItem) return;
    setSubmittingComplete(true);

    try {
      const res = await fetch(`/api/queue/${selectedQueueItem.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ diagnosisNotes, prescriptionNotes })
      });

      if (res.ok) {
        setSelectedQueueItem(null);
        setDiagnosisNotes('');
        setPrescriptionNotes('');
        fetchData();
      }
    } catch (err) {
      console.error('Error completing consultation:', err);
    } finally {
      setSubmittingComplete(false);
    }
  };

  // Find next waiting patient for quick action
  const nextPatient = queue.find(q => q.status === 'Waiting');

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner Header */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.25rem' }}>
              Doctor Command Center • Clinical Queue & AI Triage
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800 }}>
              {user?.name || 'Doctor'} Portal
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Review AI symptom urgency recommendations, confirm queue priorities, and call patients.
            </p>
          </div>

          {nextPatient && (
            <button 
              className="btn btn-success btn-lg"
              onClick={() => handleCallPatient(nextPatient.id)}
              style={{ padding: '0.85rem 1.5rem', fontWeight: 800 }}
            >
              <PhoneCall size={20} /> Call Next Patient ({nextPatient.token})
            </button>
          )}
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid-4">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.75rem', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{t('todayAppointments')}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {analytics?.totalToday ?? queue.length}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.75rem', borderRadius: '12px' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{t('waitingPatients')}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>
              {queue.filter(q => q.status === 'Waiting').length}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#ccfbf1', color: '#0d9488', padding: '0.75rem', borderRadius: '12px' }}>
            <Stethoscope size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{t('inConsultation')}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d9488' }}>
              {queue.filter(q => q.status === 'In Consultation').length}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem', borderRadius: '12px' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{t('completedConsultations')}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d' }}>
              {queue.filter(q => q.status === 'Completed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      {analytics && <AnalyticsCharts analyticsData={analytics} />}

      {/* Main Live Patient Queue Table */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Live Patient Queue & AI Priority Review</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Review patient symptoms, AI triage suggestion, and confirm final clinical priority
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Token / Time</th>
                <th>Patient Name</th>
                <th>Patient Symptoms</th>
                <th>AI Triage Assessment</th>
                <th>Confirmed Priority</th>
                <th>Queue Status</th>
                <th>Doctor Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.length > 0 ? (
                queue.map(item => (
                  <tr key={item.id} style={{
                    background: item.status === 'In Consultation' ? '#f0fdf4' : 'transparent'
                  }}>
                    {/* Token / Time */}
                    <td>
                      <div className="token-pill" style={{ fontSize: '0.95rem', padding: '0.3rem 0.75rem' }}>
                        {item.token}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>
                        {item.appointment_time}
                      </div>
                    </td>

                    {/* Patient Name */}
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.patient_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pos #{item.queue_position}</div>
                    </td>

                    {/* Symptoms */}
                    <td style={{ maxWidth: '220px', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 500, color: '#334155', fontStyle: 'italic' }}>
                        "{item.symptoms}"
                      </div>
                    </td>

                    {/* AI Assessment */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Category:</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{item.aiCategory}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Suggested:</span>
                          <span className={`badge ${
                            item.aiSuggestedPriority === 'Urgent Review' ? 'badge-urgent' :
                            item.aiSuggestedPriority === 'Priority' ? 'badge-priority' : 'badge-normal'
                          }`}>
                            {item.aiSuggestedPriority}
                          </span>
                        </div>
                        {item.aiReason && (
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.15rem' }}>
                            {item.aiReason}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Confirmed Priority Selection */}
                    <td>
                      <select 
                        className="form-select"
                        value={item.confirmed_priority || item.aiSuggestedPriority || 'Normal'}
                        onChange={(e) => handleConfirmPriority(item.id, e.target.value)}
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem', fontWeight: 700 }}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Priority">Priority</option>
                        <option value="Urgent Review">Urgent Review</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`badge ${
                        item.status === 'Completed' ? 'badge-normal' :
                        item.status === 'In Consultation' ? 'badge-urgent' : 'badge-priority'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {item.status === 'Waiting' && (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleCallPatient(item.id)}
                          >
                            <PhoneCall size={14} /> Call
                          </button>
                        )}

                        {item.status === 'In Consultation' && (
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => setSelectedQueueItem(item)}
                          >
                            <Check size={14} /> Complete
                          </button>
                        )}

                        {item.status === 'Completed' && (
                          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                            Done
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#64748b', padding: '2.5rem' }}>
                    No queue entries scheduled for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Consultation Completion & Notes Modal */}
      {selectedQueueItem && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Complete Consultation — Token {selectedQueueItem.token}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Patient: <strong>{selectedQueueItem.patient_name}</strong>
            </p>

            <form onSubmit={handleCompleteSubmit}>
              <div className="form-group">
                <label className="form-label">Clinical Diagnosis / Doctor Notes</label>
                <textarea 
                  className="form-textarea"
                  rows={3}
                  value={diagnosisNotes}
                  onChange={e => setDiagnosisNotes(e.target.value)}
                  placeholder="e.g. Mild cardiac discomfort rule out acute angina. Rest advised."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prescription / Medication Advice</label>
                <textarea 
                  className="form-textarea"
                  rows={3}
                  value={prescriptionNotes}
                  onChange={e => setPrescriptionNotes(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg SOS, Aspirin 75mg once daily."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedQueueItem(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={submittingComplete}
                >
                  {submittingComplete ? 'Saving...' : 'Finalize & Mark Consultation Completed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
