import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import TokenBadge from '../components/TokenBadge';
import QueueVisualizer from '../components/QueueVisualizer';
import AISymptomCard from '../components/AISymptomCard';
import { Clock, RefreshCw, AlertCircle, Calendar } from 'lucide-react';

export default function QueueTrackPage({ setActivePage }) {
  const { token } = useAuth();
  const { t } = useLanguage();

  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQueue = async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const res = await fetch('/api/queue/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQueueStatus(data);
      }
    } catch (err) {
      console.error('Error loading queue status:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // 5 sec auto refresh
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="container" style={{ maxWidth: '780px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Real-Time Queue Tracker</h1>
          <p style={{ color: '#64748b' }}>Live queue position and estimated consultation countdown</p>
        </div>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={fetchQueue}
          disabled={refreshing}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh Now
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          Loading live queue state...
        </div>
      ) : queueStatus && queueStatus.hasActiveToken ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TokenBadge 
            token={queueStatus.token}
            position={queueStatus.queuePosition}
            patientsAhead={queueStatus.patientsAhead}
            waitMins={queueStatus.estimatedWaitMins}
            status={queueStatus.status}
            priority={queueStatus.confirmedPriority}
          />

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{queueStatus.doctorName}</h4>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{queueStatus.departmentName} • {queueStatus.appointmentTime}</span>
              </div>
              <span className="badge badge-normal">Live Queue Active</span>
            </div>

            <QueueVisualizer currentStatus={queueStatus.status} />

            {queueStatus.status === 'Called' && (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '1rem',
                borderRadius: '8px',
                color: '#b45309',
                fontWeight: 700,
                textAlign: 'center',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={20} /> Attention: Doctor has called your token! Please proceed to consultation room.
              </div>
            )}
          </div>

          {queueStatus.symptomAnalysis && (
            <AISymptomCard analysis={queueStatus.symptomAnalysis} />
          )}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Clock size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Active Queue Token Found</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            You do not currently have a waiting queue token for today's consultations.
          </p>
          <button className="btn btn-primary" onClick={() => setActivePage('book')}>
            <Calendar size={18} /> Book Appointment Now
          </button>
        </div>
      )}
    </div>
  );
}
