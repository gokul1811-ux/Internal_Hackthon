import React from 'react';
import { Ticket, Users, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TokenBadge({ token, position, patientsAhead, waitMins, status, priority }) {
  const getStatusColor = () => {
    switch (status) {
      case 'Called': return '#d97706';
      case 'In Consultation': return '#0284c7';
      case 'Completed': return '#059669';
      default: return '#64748b';
    }
  };

  const getPriorityBadgeClass = () => {
    switch (priority) {
      case 'Urgent Review': return 'badge-urgent';
      case 'Priority': return 'badge-priority';
      default: return 'badge-normal';
    }
  };

  return (
    <div className="card" style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #cbd5e1',
      boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
          <Ticket size={18} color="#0284c7" /> Digital Queue Token
        </div>
        <span className={`badge ${getPriorityBadgeClass()}`}>
          {priority || 'Normal'}
        </span>
      </div>

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <div className="token-pill" style={{ fontSize: '2.2rem', padding: '0.6rem 2rem' }}>
          {token || 'N/A'}
        </div>
        <div style={{ marginTop: '0.5rem', fontWeight: 700, color: getStatusColor(), fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          {status === 'In Consultation' && <CheckCircle2 size={16} />}
          {status === 'Called' && <AlertCircle size={16} />}
          Status: {status || 'Waiting'}
        </div>
      </div>

      <div className="grid-2" style={{ gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
            <Users size={14} /> Patients Ahead
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            {patientsAhead ?? 0}
          </div>
        </div>

        <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#0369a1', fontSize: '0.75rem', fontWeight: 600 }}>
            <Clock size={14} /> Est. Wait Time
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>
            {waitMins ?? 0} <span style={{ fontSize: '0.85rem' }}>mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
