import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  appointmentCount
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays, badge: appointmentCount },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'patients', label: 'Patients', icon: Users }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Sidebar navigation">
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <Stethoscope size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="brand-title">MediCare Hub</h1>
              <p className="brand-subtitle">Clinical Operations</p>
            </div>
          </div>
          {isOpen && (
            <button
              onClick={onClose}
              className="mobile-menu-btn"
              aria-label="Close navigation sidebar"
              style={{ display: 'flex', color: '#cbd5e1' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isOpen) onClose();
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="nav-item-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="clinic-status-box">
            <div className="status-indicator-dot" />
            <div>
              <p className="clinic-status-label">Clinic Open</p>
              <p className="clinic-status-text">08:00 AM – 08:00 PM</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
