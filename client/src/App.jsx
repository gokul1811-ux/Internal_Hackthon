import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import { PatientLoginPage, DoctorLoginPage, PatientRegisterPage } from './pages/AuthPages';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointmentPage from './pages/BookAppointmentPage';
import QueueTrackPage from './pages/QueueTrackPage';
import DoctorDashboard from './pages/DoctorDashboard';
import MedicineRemindersPage from './pages/MedicineRemindersPage';

function MainRouter() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('landing');

  // Page switcher
  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'login-patient':
        return <PatientLoginPage setActivePage={setActivePage} />;
      case 'login-doctor':
        return <DoctorLoginPage setActivePage={setActivePage} />;
      case 'register-patient':
        return <PatientRegisterPage setActivePage={setActivePage} />;
      case 'patient-dashboard':
        return user ? <PatientDashboard setActivePage={setActivePage} /> : <PatientLoginPage setActivePage={setActivePage} />;
      case 'book':
        return user ? <BookAppointmentPage setActivePage={setActivePage} /> : <PatientLoginPage setActivePage={setActivePage} />;
      case 'queue-track':
        return user ? <QueueTrackPage setActivePage={setActivePage} /> : <PatientLoginPage setActivePage={setActivePage} />;
      case 'medicines':
        return user ? <MedicineRemindersPage /> : <PatientLoginPage setActivePage={setActivePage} />;
      case 'doctor-dashboard':
        return user?.role === 'doctor' ? <DoctorDashboard /> : <DoctorLoginPage setActivePage={setActivePage} />;
      case 'history':
        return user ? <PatientDashboard setActivePage={setActivePage} /> : <PatientLoginPage setActivePage={setActivePage} />;
      default:
        return <LandingPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </LanguageProvider>
  );
}
