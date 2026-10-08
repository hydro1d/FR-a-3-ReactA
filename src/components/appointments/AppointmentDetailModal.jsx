import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Calendar, Clock, Stethoscope, User, DollarSign, FileText } from 'lucide-react';

export default function AppointmentDetailModal({
  isOpen,
  onClose,
  appointment,
  onUpdateStatus,
  onOpenReschedule
}) {
  if (!appointment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Appointment Details — ${appointment.id}`}
      maxWidth="580px"
      footer={
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {appointment.status === 'Pending' && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ color: '#059669', borderColor: '#a7f3d0' }}
                onClick={() => {
                  onUpdateStatus(appointment.id, 'Confirmed');
                  onClose();
                }}
              >
                Confirm Booking
              </button>
            )}
            {appointment.status === 'Confirmed' && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ color: '#2563eb', borderColor: '#bfdbfe' }}
                onClick={() => {
                  onUpdateStatus(appointment.id, 'Completed');
                  onClose();
                }}
              >
                Mark Completed
              </button>
            )}
            {appointment.status !== 'Cancelled' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onClose();
                  onOpenReschedule(appointment);
                }}
              >
                Reschedule
              </button>
            )}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Status header banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</span>
            <div>
              <StatusBadge status={appointment.status} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consultation Type</span>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{appointment.type}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consultation Fee</span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
              {formatCurrency(appointment.fee)}
            </div>
          </div>
        </div>

        {/* Patient and Doctor Cards */}
        <div className="form-grid-2">
          <div style={{ padding: '14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <User size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Patient</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{appointment.patientName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {appointment.patientId}</div>
          </div>

          <div style={{ padding: '14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Stethoscope size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Specialist</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{appointment.doctorName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{appointment.specialty}</div>
          </div>
        </div>

        {/* Date & Time Slot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--primary)" />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatDate(appointment.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--primary)" />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{appointment.time}</span>
          </div>
        </div>

        {/* Clinical Reason */}
        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Reason for Consultation
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', backgroundColor: 'var(--bg-page)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
            {appointment.reason || 'General medical review'}
          </p>
        </div>

        {/* Clinical Notes */}
        {appointment.notes && (
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Triage / Clinical Notes
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', backgroundColor: '#fff', border: '1px dashed var(--border)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
              {appointment.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
