import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import CancelConfirmModal from '../components/appointments/CancelConfirmModal';
import { formatDate, formatCurrency } from '../utils/formatters';
import { SPECIALTIES } from '../data/mockData';
import { useAppointmentFilter } from '../hooks/useAppointmentFilter';

export default function AppointmentsPage({
  appointments,
  externalSearchQuery = '',
  onOpenBookingModal,
  onSelectAppointment,
  onOpenReschedule,
  onUpdateStatus,
  onCancelAppointment
}) {
  const {
    filteredAppointments,
    statusCounts,
    selectedStatusTab,
    setSelectedStatusTab,
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    filterDate,
    setFilterDate,
    sortBy,
    setSortBy,
    clearFilters,
    hasActiveFilters
  } = useAppointmentFilter(appointments, externalSearchQuery);

  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // Sync external search query if updated from parent
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery, setSearchQuery]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Appointment Schedules</h2>
          <p className="page-description">
            Filter, search, confirm, reschedule, or cancel patient clinic appointments.
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
        <div className="tabs-list" role="tablist" aria-label="Appointment status tabs">
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
          {/* Keyword Search Input */}
          <input
            type="text"
            className="filter-input"
            placeholder="Filter patient, doctor, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter appointments by text"
          />

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
            title="Filter by date"
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
            <option value="fee-desc">Fee (Highest First)</option>
          </select>

          {hasActiveFilters && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={clearFilters}
              style={{ whiteSpace: 'nowrap' }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
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
            No appointments matched your current search filters or date range. Try resetting your filter controls or booking a new visit.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {hasActiveFilters && (
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
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
                            onClick={() => setAppointmentToCancel(apt)}
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

      {/* Cancellation Confirmation Safeguard Modal */}
      <CancelConfirmModal
        isOpen={!!appointmentToCancel}
        onClose={() => setAppointmentToCancel(null)}
        appointment={appointmentToCancel}
        onConfirmCancel={onCancelAppointment}
      />
    </div>
  );
}
