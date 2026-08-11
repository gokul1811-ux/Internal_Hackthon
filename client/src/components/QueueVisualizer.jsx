import React from 'react';
import { Clock, Bell, Stethoscope, CheckCircle } from 'lucide-react';

export default function QueueVisualizer({ currentStatus }) {
  const steps = [
    { key: 'Waiting', label: 'Waiting in Queue', icon: Clock },
    { key: 'Called', label: 'Called to Room', icon: Bell },
    { key: 'In Consultation', label: 'In Consultation', icon: Stethoscope },
    { key: 'Completed', label: 'Consultation Done', icon: CheckCircle }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Waiting': return 0;
      case 'Called': return 1;
      case 'In Consultation': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '10%',
          right: '10%',
          height: '4px',
          background: '#e2e8f0',
          zIndex: 1
        }}>
          <div style={{
            height: '100%',
            background: '#0284c7',
            width: `${(activeIndex / 3) * 100}%`,
            transition: 'width 0.4s ease'
          }} />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div key={step.key} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2,
              flex: 1
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: isActive ? '#0284c7' : isDone ? '#059669' : '#ffffff',
                border: `2px solid ${isActive ? '#0284c7' : isDone ? '#059669' : '#cbd5e1'}`,
                color: isActive || isDone ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive ? '0 0 0 4px rgba(2, 132, 199, 0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                <Icon size={20} />
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0284c7' : isDone ? '#059669' : '#64748b',
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
