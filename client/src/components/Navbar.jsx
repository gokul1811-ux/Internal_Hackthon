import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Activity, LogOut, User, Globe, Calendar, Clock, Pill, Stethoscope, Home } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage(user ? (user.role === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard') : 'landing')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            color: '#ffffff',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Smart<span style={{ color: '#0284c7' }}>Care</span>
            </span>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '-3px' }}>
              Queue & Medicine System
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!user ? (
            <>
              <button 
                className={`btn ${activePage === 'landing' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActivePage('landing')}
              >
                <Home size={16} /> {t('navHome')}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setActivePage('login-patient')}
              >
                <User size={16} /> {t('btnPatientLogin')}
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setActivePage('login-doctor')}
              >
                <Stethoscope size={16} /> {t('btnDoctorLogin')}
              </button>
            </>
          ) : user.role === 'patient' ? (
            <>
              <button 
                className={`btn ${activePage === 'patient-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActivePage('patient-dashboard')}
              >
                <Home size={16} /> {t('navDashboard')}
              </button>
              <button 
                className={`btn ${activePage === 'book' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActivePage('book')}
              >
                <Calendar size={16} /> {t('navBook')}
              </button>
              <button 
                className={`btn ${activePage === 'queue-track' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActivePage('queue-track')}
              >
                <Clock size={16} /> {t('navQueue')}
              </button>
              <button 
                className={`btn ${activePage === 'medicines' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActivePage('medicines')}
              >
                <Pill size={16} /> {t('navMedicines')}
              </button>
            </>
          ) : (
            <>
              <button 
                className={`btn ${activePage === 'doctor-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActivePage('doctor-dashboard')}
              >
                <Stethoscope size={16} /> {t('navDoctor')}
              </button>
            </>
          )}

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
            <Globe size={16} color="#64748b" />
            <select 
              value={lang} 
              onChange={(e) => toggleLanguage(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer', outline: 'none' }}
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* User Session Info & Logout */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid #e2e8f0' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                <span className={`badge ${user.role === 'doctor' ? 'badge-priority' : 'badge-normal'}`}>
                  {user.role === 'doctor' ? t('roleDoctor') : t('rolePatient')}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-secondary btn-sm"
                title={t('logout')}
                style={{ color: '#ef4444' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
