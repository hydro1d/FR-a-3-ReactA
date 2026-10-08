import React from 'react';
import {
  CalendarDays,
  Users,
  Clock,
  ArrowRight,
  RefreshCw,
  Plus,
  Stethoscope
} from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function DashboardPage({
  appointments,
  doctors,
  patients,
  onNavigateTab,
  onOpenBookingModal,
  onOpenBookingWithDoctor,
  onSelectAppointment,
  onRefresh,
  isLoading
}) {
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;

  // Most recent 5 appointments
  const recentAppointments = appointments.slice(0, 5);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Clinic Overview Dashboard</h2>
          <p className="page-description">
            Live schedule, clinical staff availability, and upcoming patient consultations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            title="Simulate refreshing data"
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Syncing...' : 'Sync Data'}</span>
          </button>
          <button
            id="dashboard-book-btn"
            className="btn btn-book-primary btn-sm"
            onClick={onOpenBookingModal}
          >
            <Plus size={16} />
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          label="Total Scheduled"
          value={appointments.length}
          subtext={`${confirmedCount} confirmed bookings`}
          icon={CalendarDays}
          color="#0d9488"
          bg="#f0fdfa"
        />
        <StatsCard
          label="Pending Triage"
          value={pendingCount}
          subtext="Requires desk verification"
          icon={Clock}
          color="#d97706"
          bg="#fffbeb"
        />
        <StatsCard
          label="Active Doctors"
          value={doctors.length}
          subtext="Across 6 specialties"
          icon={Stethoscope}
          color="#0284c7"
          bg="#f0f9ff"
        />
        <StatsCard
          label="Registered Patients"
          value={patients.length}
          subtext="Total clinical profiles"
          icon={Users}
          color="#6366f1"
          bg="#eef2ff"
        />
      </div>

      {/* Dashboard Two-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Upcoming Consultations */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Upcoming Consultations
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Most recent scheduled patient appointments
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('appointments')}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="state-container" style={{ padding: '32px 16px' }}>
              <p className="state-text">No scheduled appointments found.</p>
              <button className="btn btn-book-primary btn-sm" onClick={onOpenBookingModal}>
                Book First Appointment
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient & Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {apt.patientName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {apt.doctorName} • {apt.specialty}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                          {formatDate(apt.date)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {apt.time} ({apt.type})
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={apt.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => onSelectAppointment(apt)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Doctors on Duty */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Doctors on Duty
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Specialists available for booking today
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('doctors')}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              <span>Directory</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {doctors.slice(0, 4).map((doctor) => (
              <div
                key={doctor.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {doctor.name}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {doctor.specialty} • {doctor.room}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Fee: {formatCurrency(doctor.fee)} • Rating: ★ {doctor.rating}
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-book-primary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                  onClick={() => onOpenBookingWithDoctor(doctor)}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
