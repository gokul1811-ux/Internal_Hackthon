import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Clock, Bot, Pill, Activity, ArrowRight, ShieldCheck, CheckCircle2, Users, Calendar, Sparkles } from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Hero Section with Visual Image Banner */}
      <section style={{
        background: 'var(--hero-gradient)',
        borderRadius: '32px',
        padding: '3.5rem 2.5rem',
        color: '#ffffff',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}>
              <Sparkles size={16} /> Healthcare SaaS Innovation Hackathon 2026
            </div>

            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              {t('heroTitle')}
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '2rem', lineHeight: 1.6 }}>
              {t('heroSubtitle')}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setActivePage('login-patient')}
              >
                <Calendar size={20} /> {t('btnBookNow')} <ArrowRight size={18} />
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => setActivePage('login-doctor')}
                style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                {t('btnDoctorLogin')}
              </button>
            </div>

            {/* Quick Credentials Pill */}
            <div style={{
              marginTop: '2.25rem',
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'inline-flex',
              flexWrap: 'wrap',
              gap: '1.25rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '14px',
              fontSize: '0.85rem'
            }}>
              <div>
                <strong style={{ color: '#38bdf8' }}>Demo Doctor:</strong> doctor@smartcare.demo | password123
              </div>
              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.2)', paddingLeft: '1.25rem' }}>
                <strong style={{ color: '#2dd4bf' }}>Demo Patient:</strong> patient@smartcare.demo | password123
              </div>
            </div>
          </div>

          {/* Generated Visual Hero Image */}
          <div style={{ position: 'relative' }}>
            <img 
              src="/images/hero.jpg" 
              alt="SmartCare Medical AI Hero Visual" 
              style={{
                width: '100%',
                maxHeight: '380px',
                objectFit: 'cover',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Feature Showcase Cards with Generated Visual Images */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Key Clinical Capabilities</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1rem' }}>
            End-to-end digital queue triage, AI symptom recognition, and prescription reminders
          </p>
        </div>

        <div className="grid-3">
          <div className="card">
            <img 
              src="/images/smart_queue.jpg" 
              alt="Smart Queue Display Visual" 
              className="feature-card-img"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Clock size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('featSmartQueueTitle')}</h3>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.65 }}>
              {t('featSmartQueueDesc')} Unique digital tokens (`CARD-001`), live waiting position, and real-time estimated wait countdown.
            </p>
          </div>

          <div className="card">
            <img 
              src="/images/ai_triage.jpg" 
              alt="AI Triage Recognition Visual" 
              className="feature-card-img"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Bot size={20} color="#0d9488" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('featAITitle')}</h3>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.65 }}>
              {t('featAIDesc')} Analyzes patient symptom inputs to suggest urgency categories (`High`, `Moderate`, `Low`) with medical safety guardrails.
            </p>
          </div>

          <div className="card">
            <img 
              src="/images/medicine_tracker.jpg" 
              alt="Medicine Reminder Visual" 
              className="feature-card-img"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Pill size={20} color="#d97706" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('featRemindersTitle')}</h3>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.65 }}>
              {t('featRemindersDesc')} Automated pill schedule manager, dosage instructions, and daily completion tracking checklist.
            </p>
          </div>
        </div>
      </section>

      {/* 5-Step Interactive Workflow */}
      <section className="card" style={{ padding: '3.5rem 2.5rem', background: '#0f172a', color: '#ffffff', borderRadius: '28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800 }}>Seamless 5-Step Workflow</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Connecting patients and medical staff seamlessly</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap' }}>
          {[
            { title: t('step1'), desc: "Select doctor & enter symptoms text" },
            { title: t('step2'), desc: "Instant AI triage & token generation" },
            { title: t('step3'), desc: "Track live position & wait countdown" },
            { title: t('step4'), desc: "Doctor confirms priority & consults" },
            { title: t('step5'), desc: "Automated pill reminder checklist" }
          ].map((st, index) => (
            <div key={index} style={{
              flex: 1,
              minWidth: '190px',
              background: '#1e293b',
              padding: '1.35rem',
              borderRadius: '16px',
              border: '1px solid #334155',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.4rem' }}>{st.title}</div>
              <div style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5 }}>{st.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
