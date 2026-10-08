import React from 'react';
import Modal from '../common/Modal';
import { formatCurrency } from '../../utils/formatters';
import { Star, MapPin, Mail, Phone, Calendar, Clock } from 'lucide-react';

export default function DoctorDetailModal({
  isOpen,
  onClose,
  doctor,
  onOpenBooking
}) {
  if (!doctor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Specialist Profile"
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
              onOpenBooking(doctor);
            }}
          >
            Book Appointment with {doctor.name}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img
            src={doctor.avatar}
            alt={doctor.name}
            style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
          />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{doctor.name}</h3>
            <span className="doctor-specialty-pill">{doctor.specialty}</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {doctor.title}
            </p>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
            About & Clinical Experience
          </h4>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
            {doctor.bio}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: 'var(--bg-card-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Experience:</span>
            <div style={{ fontWeight: 600 }}>{doctor.experience}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clinic Room:</span>
            <div style={{ fontWeight: 600 }}>{doctor.room}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consultation Fee:</span>
            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(doctor.fee)}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating:</span>
            <div style={{ fontWeight: 600 }}>★ {doctor.rating} / 5.0 ({doctor.reviewsCount} reviews)</div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Available Time Slots
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {doctor.timeSlots.map((slot) => (
              <span
                key={slot}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {slot}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
