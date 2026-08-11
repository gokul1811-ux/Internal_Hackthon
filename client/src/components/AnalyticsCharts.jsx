import React from 'react';
import { BarChart2, PieChart, Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function AnalyticsCharts({ analyticsData }) {
  if (!analyticsData) return null;

  const { totalToday, waitingCount, inConsultationCount, completedCount, priorityDistribution, categoryDistribution } = analyticsData;

  const urgent = priorityDistribution?.urgent || 0;
  const priority = priorityDistribution?.priority || 0;
  const normal = priorityDistribution?.normal || 0;
  const grandTotal = urgent + priority + normal || 1;

  const urgentPct = Math.round((urgent / grandTotal) * 100);
  const priorityPct = Math.round((priority / grandTotal) * 100);
  const normalPct = Math.round((normal / grandTotal) * 100);

  return (
    <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
      {/* Priority Distribution Visual Progress Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <PieChart size={18} color="#0284c7" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Smart Triage Priority Breakdown</h4>
        </div>

        {/* Visual Stack Bar */}
        <div style={{
          height: '24px',
          width: '100%',
          background: '#f1f5f9',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '1rem'
        }}>
          <div style={{ width: `${urgentPct}%`, background: '#ef4444', transition: 'width 0.3s' }} title={`Urgent: ${urgent}`} />
          <div style={{ width: `${priorityPct}%`, background: '#f59e0b', transition: 'width 0.3s' }} title={`Priority: ${priority}`} />
          <div style={{ width: `${normalPct}%`, background: '#10b981', transition: 'width 0.3s' }} title={`Normal: ${normal}`} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <span>Urgent Review: <strong>{urgent} ({urgentPct}%)</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <span>Priority: <strong>{priority} ({priorityPct}%)</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span>Normal: <strong>{normal} ({normalPct}%)</strong></span>
          </div>
        </div>
      </div>

      {/* Categories Distribution */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <BarChart2 size={18} color="#0d9488" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Top Symptom Categories Today</h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {categoryDistribution && Object.keys(categoryDistribution).length > 0 ? (
            Object.entries(categoryDistribution).map(([cat, count]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>{cat}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '100px',
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min((count / totalToday) * 100, 100)}%`,
                      height: '100%',
                      background: '#0284c7'
                    }} />
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a', width: '20px', textAlign: 'right' }}>{count}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No category data logged yet today.</p>
          )}
        </div>
      </div>
    </div>
  );
}
