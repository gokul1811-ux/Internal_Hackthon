import React from 'react';
import { Bot, AlertTriangle, ShieldCheck, Tag, FileText } from 'lucide-react';

export default function AISymptomCard({ analysis }) {
  if (!analysis) return null;

  const { keywords, category, urgency, suggestedPriority, reason, disclaimer } = analysis;

  const getUrgencyBadgeClass = () => {
    switch (urgency) {
      case 'High': return 'badge-urgent';
      case 'Moderate': return 'badge-priority';
      default: return 'badge-normal';
    }
  };

  return (
    <div className="card" style={{
      borderLeft: `4px solid ${urgency === 'High' ? '#dc2626' : urgency === 'Moderate' ? '#d97706' : '#0284c7'}`,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: '#e0f2fe', padding: '0.4rem', borderRadius: '8px', color: '#0284c7' }}>
            <Bot size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>AI Symptom Recognition & Triage</h4>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Automated Preliminary Urgency Assessment</span>
          </div>
        </div>
        <span className={`badge ${getUrgencyBadgeClass()}`}>
          Urgency: {urgency || 'Low'}
        </span>
      </div>

      {/* Keywords */}
      {keywords && keywords.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <Tag size={14} color="#64748b" />
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Extracted Keywords:</span>
          {keywords.map((kw, i) => (
            <span key={i} style={{ background: '#f1f5f9', color: '#0f172a', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Category & Suggested Priority */}
      <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Suggested Category</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
            {category || 'General'}
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Suggested Queue Priority</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', marginTop: '0.2rem' }}>
            {suggestedPriority || 'Normal'}
          </div>
        </div>
      </div>

      {/* Rationale */}
      {reason && (
        <div style={{ fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <FileText size={16} color="#0284c7" style={{ shrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Triage Rationale:</strong> {reason}
          </div>
        </div>
      )}

      {/* Medical Safety Disclaimer Banner */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: '8px',
        padding: '0.65rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.8rem',
        color: '#92400e',
        fontWeight: 500
      }}>
        <ShieldCheck size={18} color="#d97706" style={{ shrink: 0 }} />
        <span>{disclaimer || 'AI suggestion only — final priority must be confirmed by medical staff.'}</span>
      </div>
    </div>
  );
}
