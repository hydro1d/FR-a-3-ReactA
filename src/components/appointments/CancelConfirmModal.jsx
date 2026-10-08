import React from 'react';
import Modal from '../common/Modal';
import { AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function CancelConfirmModal({
  isOpen,
  onClose,
  appointment,
  onConfirmCancel
}) {
  if (!appointment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Cancellation"
      maxWidth="460px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Keep Appointment
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onConfirmCancel(appointment.id);
              onClose();
            }}
          >
            Yes, Cancel Booking
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
            Are you sure you want to cancel this booking?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            This will mark appointment <strong>{appointment.id}</strong> for{' '}
            <strong>{appointment.patientName}</strong> with{' '}
            <strong>{appointment.doctorName}</strong> on {formatDate(appointment.date)} as Cancelled.
          </p>
          <p style={{ fontSize: '0.75rem', color: '#b91c1c', backgroundColor: '#fef2f2', padding: '6px 10px', borderRadius: '4px' }}>
            Warning: The specialist's calendar slot will become unreserved.
          </p>
        </div>
      </div>
    </Modal>
  );
}
