import React from 'react';
import Modal from '../common/Modal';
import { formatDate } from '../../utils/formatters';
import { User, Phone, Mail, AlertTriangle, HeartPulse, Calendar } from 'lucide-react';

export default function PatientDetailModal({
  isOpen,
  onClose,
  patient,
  onOpenBooking
}) {
  if (!patient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Patient Record — ${patient.name}`}
      maxWidth="550px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-book-primary"
            onClick={() => {
              onClose();
              onOpenBooking(patient);
            }}
          >
            Schedule Appointment
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{patient.name}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {patient.age} years • {patient.gender} • ID: {patient.id}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blood Group</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
              {patient.bloodGroup}
            </div>
          </div>
        </div>

        <div className="form-grid-2">
          <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              Direct Contact
            </span>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{patient.phone}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{patient.email}</div>
          </div>

          <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              Emergency Contact
            </span>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{patient.emergencyContact}</div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <AlertTriangle size={15} /> Known Drug & Environmental Allergies
          </h4>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {patient.allergies.map((allergy) => (
              <span
                key={allergy}
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: allergy === 'None' ? '#f1f5f9' : '#fef2f2',
                  color: allergy === 'None' ? '#475569' : '#dc2626',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: `1px solid ${allergy === 'None' ? '#e2e8f0' : '#fecaca'}`
                }}
              >
                {allergy}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <HeartPulse size={15} color="var(--primary)" /> Medical History & Chronic Conditions
          </h4>
          <p style={{ fontSize: '0.875rem', backgroundColor: 'var(--bg-page)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}>
            {patient.medicalHistory}
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Last Recorded Clinic Consultation: <strong>{formatDate(patient.lastVisit)}</strong>
        </div>
      </div>
    </Modal>
  );
}
