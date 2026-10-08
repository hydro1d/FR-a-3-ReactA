import React, { useState, useMemo } from 'react';
import { Search, UserPlus, Phone, Mail, FileText, AlertTriangle, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function PatientsPage({
  patients,
  onOpenBookingWithPatient,
  onSelectPatient
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');

  const filteredPatients = useMemo(() => {
    return patients.filter((pat) => {
      if (selectedBloodGroup !== 'ALL' && pat.bloodGroup !== selectedBloodGroup) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = pat.name.toLowerCase().includes(query);
        const matchesPhone = pat.phone.toLowerCase().includes(query);
        const matchesId = pat.id.toLowerCase().includes(query);
        const matchesEmail = pat.email.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesId && !matchesEmail) {
          return false;
        }
      }
      return true;
    });
  }, [patients, selectedBloodGroup, searchQuery]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Patient Records Directory</h2>
          <p className="page-description">
            Access medical records, allergies, contact references, and past visits.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="filter-input"
            style={{ width: '100%' }}
            placeholder="Search patient by name, phone, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-input"
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            aria-label="Filter by Blood Group"
          >
            <option value="ALL">All Blood Groups</option>
            <option value="O+">O+</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="O-">O-</option>
            <option value="A-">A-</option>
            <option value="AB-">AB-</option>
          </select>

          {(searchQuery || selectedBloodGroup !== 'ALL') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedBloodGroup('ALL');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Patients Table */}
      {filteredPatients.length === 0 ? (
        <div className="state-container">
          <h3 className="state-title">No patient records found</h3>
          <p className="state-text">
            No patient matched the query '{searchQuery}'. Try another search query.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name & Demographics</th>
                <th>Contact Information</th>
                <th>Allergies & Medical History</th>
                <th>Last Visit</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((pat) => (
                <tr key={pat.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {pat.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {pat.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {pat.age} yrs • {pat.gender} • <strong style={{ color: '#0d9488' }}>{pat.bloodGroup}</strong>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8125rem' }}>{pat.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pat.email}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      {pat.allergies.map((allergy) => (
                        <span
                          key={allergy}
                          style={{
                            fontSize: '0.7rem',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: allergy === 'None' ? '#f1f5f9' : '#fef2f2',
                            color: allergy === 'None' ? '#64748b' : '#dc2626',
                            border: `1px solid ${allergy === 'None' ? '#e2e8f0' : '#fecaca'}`
                          }}
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pat.medicalHistory}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {formatDate(pat.lastVisit)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectPatient(pat)}
                        title="View Medical Record"
                      >
                        Profile
                      </button>
                      <button
                        className="btn btn-book-primary btn-sm"
                        onClick={() => onOpenBookingWithPatient(pat)}
                        title="Book an Appointment"
                      >
                        Book Visit
                      </button>
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
