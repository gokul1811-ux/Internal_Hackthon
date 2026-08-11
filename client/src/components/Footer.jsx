import React from 'react';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '3rem 0 2rem',
      borderTop: '1px solid #1e293b',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Activity color="#38bdf8" size={24} />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>SmartCare</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              Smart Patient Queue & Medicine Reminder System powered by AI symptom recognition and smart priority triage.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Medical Safety & Compliance</h4>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
              <ShieldCheck color="#10b981" size={18} style={{ shrink: 0 }} />
              <span>AI triage provides preliminary priority suggestions only. Final clinical urgency is always confirmed by certified medical professionals.</span>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Hackathon Prototype</h4>
            <p style={{ fontSize: '0.85rem' }}>
              Built for live interactive demonstration. Supports live queue tracking, patient appointment booking, and automated pill reminders.
            </p>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          © 2026 SmartCare Healthcare SaaS. Designed for Hackathon Live Demo.
        </div>
      </div>
    </footer>
  );
}
