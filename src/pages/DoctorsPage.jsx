import React, { useState, useMemo } from 'react';
import { Stethoscope } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { SPECIALTIES } from '../data/mockData';

export default function DoctorsPage({
  doctors,
  onOpenBookingWithDoctor,
  onSelectDoctorProfile
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (selectedSpecialty !== 'All Specialties' && doc.specialty !== selectedSpecialty) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesSpec = doc.specialty.toLowerCase().includes(query);
        const matchesTitle = (doc.title || '').toLowerCase().includes(query);
        if (!matchesName && !matchesSpec && !matchesTitle) {
          return false;
        }
      }
      return true;
    });
  }, [doctors, selectedSpecialty, searchQuery]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Medical Specialists Directory</h2>
          <p className="page-description">
            Explore active doctors, specialties, consulting hours, and schedule consultations.
          </p>
        </div>
      </div>

      {/* Specialty Filter Pills & Search */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {SPECIALTIES.map((spec) => (
            <button
              key={spec}
              className={`tab-btn ${selectedSpecialty === spec ? 'active' : ''}`}
              onClick={() => setSelectedSpecialty(spec)}
              style={{
                border: '1px solid var(--border)',
                backgroundColor: selectedSpecialty === spec ? 'var(--primary)' : 'var(--bg-card)',
                color: selectedSpecialty === spec ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              {spec}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '240px' }}>
          <input
            type="text"
            className="filter-input"
            style={{ width: '100%' }}
            placeholder="Search doctor by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="state-container">
          <div className="state-icon-box">
            <Stethoscope size={28} />
          </div>
          <h3 className="state-title">No specialists found</h3>
          <p className="state-text">
            No doctors matched your specialty or search term. Try resetting your filters.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSelectedSpecialty('All Specialties');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="doctor-card">
              <div className="doctor-card-header">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="doctor-avatar"
                  loading="lazy"
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="doctor-info-title">{doc.name}</h3>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: doc.status === 'Available' ? '#ecfdf5' : '#fef3c7',
                        color: doc.status === 'Available' ? '#047857' : '#b45309',
                        border: `1px solid ${doc.status === 'Available' ? '#a7f3d0' : '#fde68a'}`
                      }}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <span className="doctor-specialty-pill">{doc.specialty}</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {doc.title}
                  </p>
                </div>
              </div>

              {/* Bio snippet */}
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
                {doc.bio}
              </p>

              {/* Quick Specs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  backgroundColor: 'var(--bg-card-subtle)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  fontSize: '0.75rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Experience:</span>{' '}
                  <strong style={{ color: 'var(--text-main)' }}>{doc.experience}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Rating:</span>{' '}
                  <strong style={{ color: 'var(--text-main)' }}>★ {doc.rating} ({doc.reviewsCount})</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Location:</span>{' '}
                  <strong style={{ color: 'var(--text-main)' }}>{doc.room}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Fee:</span>{' '}
                  <strong style={{ color: 'var(--primary)' }}>{formatCurrency(doc.fee)}</strong>
                </div>
              </div>

              {/* Availability Badges */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  CLINIC DAYS:
                </span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {doc.availableDays.map((day) => (
                    <span
                      key={day}
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#f1f5f9',
                        color: '#334155'
                      }}
                    >
                      {day.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onSelectDoctorProfile(doc)}
                >
                  View Details
                </button>
                <button
                  className="btn btn-book-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onOpenBookingWithDoctor(doc)}
                >
                  Book Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
