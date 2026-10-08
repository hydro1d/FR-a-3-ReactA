import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { formatDate, getTodayString } from '../../utils/formatters';

export default function RescheduleModal({
  isOpen,
  onClose,
  appointment,
  doctors,
  onSaveReschedule
}) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [error, setError] = useState('');

  const today = getTodayString();

  const doctor = doctors.find((d) => d.id === appointment?.doctorId) || doctors[0];

  useEffect(() => {
    if (appointment && isOpen) {
      setNewDate(appointment.date);
      setNewTime(appointment.time);
      setError('');
    }
  }, [appointment, isOpen]);

  const handleSave = () => {
    if (!newDate) {
      setError('Please select a valid date.');
      return;
    }
    if (newDate < today) {
      setError('Rescheduled date cannot be in the past.');
      return;
    }
    if (!newTime) {
      setError('Please select an available time slot.');
      return;
    }

    onSaveReschedule(appointment.id, newDate, newTime);
    onClose();
  };

  if (!appointment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Appointment"
      maxWidth="500px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-book-primary" onClick={handleSave}>
            Save New Schedule
          </button>
        </>
      }
    >
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Patient: {appointment.patientName} ({appointment.id})
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Doctor: {appointment.doctorName} • {appointment.specialty}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '4px' }}>
          Current Slot: {formatDate(appointment.date)} at {appointment.time}
        </p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reschedule-date">
          New Appointment Date
        </label>
        <input
          id="reschedule-date"
          type="date"
          min={today}
          className="form-control"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reschedule-time">
          Available Time Slot
        </label>
        <select
          id="reschedule-time"
          className="form-control"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        >
          {doctor && doctor.timeSlots ? (
            doctor.timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))
          ) : (
            <option value="10:00 AM">10:00 AM</option>
          )}
        </select>
      </div>

      {error && <p className="form-error" style={{ marginBottom: '12px' }}>{error}</p>}
    </Modal>
  );
}
