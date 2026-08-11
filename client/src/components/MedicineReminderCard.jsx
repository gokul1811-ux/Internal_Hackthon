import React from 'react';
import { Pill, Clock, Check, X, Calendar, AlertCircle } from 'lucide-react';

export default function MedicineReminderCard({ reminders, onUpdateStatus, onDelete }) {
  if (!reminders || reminders.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <Pill size={36} color="#cbd5e1" style={{ marginBottom: '0.5rem' }} />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No medicine reminders scheduled for today.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {reminders.map((rem) => {
        const isTaken = rem.status === 'Taken';
        const isSkipped = rem.status === 'Skipped';

        return (
          <div key={rem.id} className="card" style={{
            padding: '1rem 1.25rem',
            background: isTaken ? '#f0fdf4' : isSkipped ? '#fef2f2' : '#ffffff',
            borderColor: isTaken ? '#bbf7d0' : isSkipped ? '#fecaca' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                background: isTaken ? '#dcfce7' : isSkipped ? '#fee2e2' : '#e0f2fe',
                color: isTaken ? '#15803d' : isSkipped ? '#b91c1c' : '#0284c7',
                padding: '0.6rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Pill size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    textDecoration: isTaken ? 'line-through' : 'none',
                    color: isTaken ? '#166534' : '#0f172a'
                  }}>
                    {rem.medicine_name}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                    ({rem.dosage})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.25rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={13} color="#0284c7" /> {rem.time}
                  </span>
                  <span>•</span>
                  <span>{rem.frequency}</span>
                </div>
                {rem.notes && (
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem', fontStyle: 'italic' }}>
                    Note: {rem.notes}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isTaken ? (
                <span className="badge badge-normal" style={{ fontSize: '0.85rem' }}>
                  <Check size={14} /> Taken
                </span>
              ) : isSkipped ? (
                <span className="badge badge-urgent" style={{ fontSize: '0.85rem' }}>
                  <X size={14} /> Skipped
                </span>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => onUpdateStatus(rem.id, 'Taken')}
                    title="Mark as Taken"
                  >
                    <Check size={14} /> Taken
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onUpdateStatus(rem.id, 'Skipped')}
                    style={{ color: '#ef4444' }}
                    title="Skip Dose"
                  >
                    <X size={14} /> Skip
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
