import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Plus,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate, formatCurrency } from '../utils/formatters';
import { SPECIALTIES } from '../data/mockData';

export default function AppointmentsPage({
  appointments,
  onOpenBookingModal,
  onSelectAppointment,
  onOpenReschedule,
  onUpdateStatus,
  onCancelAppointment
}) {
  const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filtered and sorted appointments
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        // Status filter
        if (selectedStatusTab !== 'ALL' && apt.status.toUpperCase() !== selectedStatusTab) {
          return false;
        }

        // Specialty filter
        if (selectedSpecialty !== 'All Specialties' && apt.specialty !== selectedSpecialty) {
          return false;
        }

        // Date filter
        if (filterDate && apt.date !== filterDate) {
          return false;
        }

        // Search text filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesPatient = apt.patientName.toLowerCase().includes(query);
          const matchesDoctor = apt.doctorName.toLowerCase().includes(query);
          const matchesId = apt.id.toLowerCase().includes(query);
          const matchesReason = (apt.reason || '').toLowerCase().includes(query);
          if (!matchesPatient && !matchesDoctor && !matchesId && !matchesReason) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date) - new Date(a.date);
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date) - new Date(b.date);
        }
        if (sortBy === 'patient') {
          return a.patientName.localeCompare(b.patientName);
        }
        if (sortBy === 'doctor') {
          return a.doctorName.localeCompare(b.doctorName);
        }
        return 0;
      });
  }, [appointments, selectedStatusTab, selectedSpecialty, filterDate, searchQuery, sortBy]);

  const statusCounts = useMemo(() => {
    return {
      ALL: appointments.length,
      CONFIRMED: appointments.filter((a) => a.status === 'Confirmed').length,
      PENDING: appointments.filter((a) => a.status === 'Pending').length,
      COMPLETED: appointments.filter((a) => a.status === 'Completed').length,
      CANCELLED: appointments.filter((a) => a.status === 'Cancelled').length
    };
  }, [appointments]);

  const handleClearFilters = () => {
    setSelectedStatusTab('ALL');
    setSearchQuery('');
    setSelectedSpecialty('All Specialties');
    setFilterDate('');
    setSortBy('date-desc');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Appointment Schedules</h2>
          <p className="page-description">
            Search, filter, confirm, reschedule, or cancel patient clinic appointments.
          </p>
        </div>
        <button
          id="appointments-new-btn"
          className="btn btn-book-primary"
          onClick={onOpenBookingModal}
        >
          <Plus size={16} />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-bar">
        {/* Status Tabs */}
        <div className="tabs-list" role="tablist">
          {[
            { id: 'ALL', label: 'All', count: statusCounts.ALL },
            { id: 'CONFIRMED', label: 'Confirmed', count: statusCounts.CONFIRMED },
            { id: 'PENDING', label: 'Pending', count: statusCounts.PENDING },
            { id: 'COMPLETED', label: 'Completed', count: statusCounts.COMPLETED },
            { id: 'CANCELLED', label: 'Cancelled', count: statusCounts.CANCELLED }
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selectedStatusTab === tab.id}
              className={`tab-btn ${selectedStatusTab === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedStatusTab(tab.id)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Filter Controls Group */}
        <div className="filter-group">
          {/* Specialty Dropdown */}
          <select
            className="filter-input"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            aria-label="Filter by specialty"
          >
            {SPECIALTIES.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          {/* Date Picker Filter */}
          <input
            type="date"
            className="filter-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            aria-label="Filter by appointment date"
            title="Filter by specific date"
          />

          {/* Sort By Dropdown */}
          <select
            className="filter-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort appointments"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="patient">Patient Name (A-Z)</option>
            <option value="doctor">Doctor Name (A-Z)</option>
          </select>

          {(searchQuery || selectedSpecialty !== 'All Specialties' || filterDate || selectedStatusTab !== 'ALL') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleClearFilters}
              style={{ whiteSpace: 'nowrap' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Appointments List / Table */}
      {filteredAppointments.length === 0 ? (
        <div className="state-container">
          <div className="state-icon-box">
            <AlertCircle size={28} />
          </div>
          <h3 className="state-title">No matching appointments found</h3>
          <p className="state-text">
            No appointments matched your current search filters or date range. Try clearing your filters or creating a new booking.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-book-primary" onClick={onOpenBookingModal}>
              Book Appointment
            </button>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient Details</th>
                <th>Doctor & Specialty</th>
                <th>Schedule</th>
                <th>Type / Fee</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {apt.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {apt.patientName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Reason: {apt.reason || 'General Consultation'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {apt.doctorName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {apt.specialty}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{formatDate(apt.date)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {apt.time}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{formatCurrency(apt.fee)}</div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: apt.type === 'Telehealth' ? '#eef2ff' : '#f1f5f9',
                        color: apt.type === 'Telehealth' ? '#4f46e5' : '#475569'
                      }}
                    >
                      {apt.type}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={apt.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectAppointment(apt)}
                        title="View Full Details"
                      >
                        Details
                      </button>

                      {apt.status === 'Pending' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#059669', borderColor: '#a7f3d0' }}
                          onClick={() => onUpdateStatus(apt.id, 'Confirmed')}
                          title="Confirm Appointment"
                        >
                          Confirm
                        </button>
                      )}

                      {apt.status === 'Confirmed' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#2563eb', borderColor: '#bfdbfe' }}
                          onClick={() => onUpdateStatus(apt.id, 'Completed')}
                          title="Mark as Completed"
                        >
                          Complete
                        </button>
                      )}

                      {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                        <>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onOpenReschedule(apt)}
                            title="Reschedule Date/Time"
                          >
                            Reschedule
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onCancelAppointment(apt.id)}
                            title="Cancel Booking"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
