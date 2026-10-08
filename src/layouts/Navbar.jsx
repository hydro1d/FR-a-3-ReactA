import React from 'react';
import { Menu, Search, Plus, Calendar, Bell } from 'lucide-react';

export default function Navbar({
  onToggleSidebar,
  onOpenBookingModal,
  searchQuery,
  onSearchChange
}) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="global-search">
          <Search size={16} className="global-search-icon" />
          <input
            id="global-search-input"
            type="text"
            className="global-search-input"
            placeholder="Search patients, doctors, or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        <button
          id="btn-new-appointment-top"
          className="btn-book-primary"
          onClick={onOpenBookingModal}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Appointment</span>
        </button>

        <div className="navbar-user-chip" title="Active Staff Profile">
          <div className="user-avatar">DR</div>
          <div className="user-meta-hidden-sm">
            <p className="user-meta-name">Clinic Desk</p>
            <p className="user-meta-role">Receptionist</p>
          </div>
        </div>
      </div>
    </header>
  );
}
