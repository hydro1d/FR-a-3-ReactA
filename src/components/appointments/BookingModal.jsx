import React, { useState, useId } from 'react';
import Modal from '../common/Modal';
import { getTodayString, generateAppointmentId } from '../../utils/formatters';
import { AlertCircle } from 'lucide-react';

function BookingForm({
  doctors,
  patients,
  existingAppointments,
  initialDoctorId,
  initialPatientId,
  onSaveAppointment,
  onClose
}) {
  const formId = useId();
  const today = getTodayString();

  const defaultDoctor = doctors.find((d) => d.id === initialDoctorId) || doctors[0];
  const defaultPatient = patients.find((p) => p.id === initialPatientId) || patients[0];

  const [patientMode, setPatientMode] = useState('existing');
  const [selectedPatientId, setSelectedPatientId] = useState(defaultPatient ? defaultPatient.id : '');
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');

  const [selectedDoctorId, setSelectedDoctorId] = useState(defaultDoctor ? defaultDoctor.id : '');
  const [appointmentDate, setAppointmentDate] = useState(today);
  const [appointmentTime, setAppointmentTime] = useState(
    defaultDoctor?.timeSlots?.[0] || '10:00 AM'
  );
  const [appointmentType, setAppointmentType] = useState('In-person');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || defaultDoctor;

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    setSelectedDoctorId(docId);
    const newDoc = doctors.find((d) => d.id === docId);
    if (newDoc && newDoc.timeSlots && newDoc.timeSlots.length > 0) {
      setAppointmentTime(newDoc.timeSlots[0]);
    }
  };

  // Collision detection
  const isSlotOccupied = (timeSlot) => {
    if (!selectedDoctorId || !appointmentDate || !timeSlot) return false;
    return existingAppointments.some(
      (apt) =>
        apt.doctorId === selectedDoctorId &&
        apt.date === appointmentDate &&
        apt.time === timeSlot &&
        apt.status !== 'Cancelled'
    );
  };

  const validate = () => {
    const errs = {};
    if (patientMode === 'existing') {
      if (!selectedPatientId) errs.patient = 'Please select an existing registered patient.';
    } else {
      if (!newPatientName.trim()) errs.newPatientName = 'Patient full name is required.';
      if (!newPatientPhone.trim()) errs.newPatientPhone = 'Valid phone number is required.';
    }

    if (!selectedDoctorId) errs.doctor = 'Please select a specialist.';
    if (!appointmentDate) {
      errs.date = 'Appointment date is required.';
    } else if (appointmentDate < today) {
      errs.date = 'Appointment date cannot be in the past.';
    }

    if (!appointmentTime) {
      errs.time = 'Please select an appointment time slot.';
    } else if (isSlotOccupied(appointmentTime)) {
      errs.time = 'This time slot is already reserved for this specialist. Please choose another slot.';
    }

    if (!reason.trim()) {
      errs.reason = 'Please provide the clinical reason for the visit.';
    } else if (reason.trim().length < 4) {
      errs.reason = 'Reason description must be at least 4 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    let patientName = '';
    let patientId = '';

    if (patientMode === 'existing') {
      const p = patients.find((pat) => pat.id === selectedPatientId);
      patientName = p ? p.name : 'Unknown Patient';
      patientId = selectedPatientId;
    } else {
      patientName = newPatientName.trim();
      patientId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newAppointment = {
      id: generateAppointmentId(),
      patientId,
      patientName,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: appointmentDate,
      time: appointmentTime,
      status: 'Confirmed',
      type: appointmentType,
      reason: reason.trim(),
      notes: notes.trim(),
      fee: selectedDoctor.fee
    };

    onSaveAppointment(newAppointment);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-describedby={`${formId}-desc`}>
      <p id={`${formId}-desc`} className="sr-only" style={{ display: 'none' }}>
        Form to schedule a new patient appointment with an attending doctor.
      </p>

      {/* Patient Selection Tabs */}
      <div className="form-group">
        <label className="form-label" id={`${formId}-patient-mode-label`}>
          Patient Record Selection
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }} role="group" aria-labelledby={`${formId}-patient-mode-label`}>
          <button
            type="button"
            className={`btn btn-sm ${patientMode === 'existing' ? 'btn-book-primary' : 'btn-secondary'}`}
            onClick={() => setPatientMode('existing')}
            aria-pressed={patientMode === 'existing'}
          >
            Registered Patient
          </button>
          <button
            type="button"
            className={`btn btn-sm ${patientMode === 'new' ? 'btn-book-primary' : 'btn-secondary'}`}
            onClick={() => setPatientMode('new')}
            aria-pressed={patientMode === 'new'}
          >
            + Quick Register New Patient
          </button>
        </div>

        {patientMode === 'existing' ? (
          <div>
            <label htmlFor={`${formId}-patient-select`} className="sr-only" style={{ display: 'none' }}>
              Select Registered Patient
            </label>
            <select
              id={`${formId}-patient-select`}
              className={`form-control ${errors.patient ? 'has-error' : ''}`}
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                setErrors((prev) => ({ ...prev, patient: undefined }));
              }}
              aria-invalid={Boolean(errors.patient)}
              aria-describedby={errors.patient ? `${formId}-patient-error` : undefined}
            >
              <option value="">Select a registered patient...</option>
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.name} ({pat.id}) — {pat.phone}
                </option>
              ))}
            </select>
            {errors.patient && (
              <p id={`${formId}-patient-error`} className="form-error" role="alert">
                <AlertCircle size={14} />
                <span>{errors.patient}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="form-grid-2">
            <div>
              <label htmlFor={`${formId}-new-name`} className="form-label">
                Patient Full Name *
              </label>
              <input
                id={`${formId}-new-name`}
                type="text"
                placeholder="e.g. Rachel Adams"
                className={`form-control ${errors.newPatientName ? 'has-error' : ''}`}
                value={newPatientName}
                onChange={(e) => {
                  setNewPatientName(e.target.value);
                  setErrors((prev) => ({ ...prev, newPatientName: undefined }));
                }}
                aria-invalid={Boolean(errors.newPatientName)}
                aria-describedby={errors.newPatientName ? `${formId}-new-name-error` : undefined}
              />
              {errors.newPatientName && (
                <p id={`${formId}-new-name-error`} className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.newPatientName}</span>
                </p>
              )}
            </div>
            <div>
              <label htmlFor={`${formId}-new-phone`} className="form-label">
                Phone Number *
              </label>
              <input
                id={`${formId}-new-phone`}
                type="tel"
                placeholder="e.g. +1 555-0199"
                className={`form-control ${errors.newPatientPhone ? 'has-error' : ''}`}
                value={newPatientPhone}
                onChange={(e) => {
                  setNewPatientPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, newPatientPhone: undefined }));
                }}
                aria-invalid={Boolean(errors.newPatientPhone)}
                aria-describedby={errors.newPatientPhone ? `${formId}-new-phone-error` : undefined}
              />
              {errors.newPatientPhone && (
                <p id={`${formId}-new-phone-error`} className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.newPatientPhone}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Doctor Selection */}
      <div className="form-group">
        <label className="form-label" htmlFor={`${formId}-doctor-select`}>
          Attending Specialist & Specialty *
        </label>
        <select
          id={`${formId}-doctor-select`}
          className={`form-control ${errors.doctor ? 'has-error' : ''}`}
          value={selectedDoctorId}
          onChange={handleDoctorChange}
          aria-invalid={Boolean(errors.doctor)}
          aria-describedby={errors.doctor ? `${formId}-doctor-error` : undefined}
        >
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} — {doc.specialty} (${doc.fee})
            </option>
          ))}
        </select>
        {errors.doctor && (
          <p id={`${formId}-doctor-error`} className="form-error" role="alert">
            <AlertCircle size={14} />
            <span>{errors.doctor}</span>
          </p>
        )}
      </div>

      {/* Date and Time Grid */}
      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor={`${formId}-date-input`}>
            Appointment Date *
          </label>
          <input
            id={`${formId}-date-input`}
            type="date"
            min={today}
            className={`form-control ${errors.date ? 'has-error' : ''}`}
            value={appointmentDate}
            onChange={(e) => {
              setAppointmentDate(e.target.value);
              setErrors((prev) => ({ ...prev, date: undefined }));
            }}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? `${formId}-date-error` : undefined}
          />
          {errors.date && (
            <p id={`${formId}-date-error`} className="form-error" role="alert">
              <AlertCircle size={14} />
              <span>{errors.date}</span>
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor={`${formId}-time-select`}>
            Available Time Slot *
          </label>
          <select
            id={`${formId}-time-select`}
            className={`form-control ${errors.time ? 'has-error' : ''}`}
            value={appointmentTime}
            onChange={(e) => {
              setAppointmentTime(e.target.value);
              setErrors((prev) => ({ ...prev, time: undefined }));
            }}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? `${formId}-time-error` : undefined}
          >
            {selectedDoctor && selectedDoctor.timeSlots ? (
              selectedDoctor.timeSlots.map((slot) => {
                const occupied = isSlotOccupied(slot);
                return (
                  <option key={slot} value={slot} disabled={occupied}>
                    {slot} {occupied ? '(Reserved)' : '(Available)'}
                  </option>
                );
              })
            ) : (
              <option value="10:00 AM">10:00 AM</option>
            )}
          </select>
          {errors.time && (
            <p id={`${formId}-time-error`} className="form-error" role="alert">
              <AlertCircle size={14} />
              <span>{errors.time}</span>
            </p>
          )}
        </div>
      </div>

      {/* Consultation Mode */}
      <div className="form-group">
        <label className="form-label">Consultation Mode</label>
        <div style={{ display: 'flex', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input
              type="radio"
              name={`${formId}-aptType`}
              value="In-person"
              checked={appointmentType === 'In-person'}
              onChange={() => setAppointmentType('In-person')}
            />
            In-Person Clinic Visit ({selectedDoctor ? selectedDoctor.room : 'Suite'})
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input
              type="radio"
              name={`${formId}-aptType`}
              value="Telehealth"
              checked={appointmentType === 'Telehealth'}
              onChange={() => setAppointmentType('Telehealth')}
            />
            Virtual Telehealth Call
          </label>
        </div>
      </div>

      {/* Reason */}
      <div className="form-group">
        <label className="form-label" htmlFor={`${formId}-reason-input`}>
          Reason for Consultation / Symptoms *
        </label>
        <input
          id={`${formId}-reason-input`}
          type="text"
          placeholder="e.g. Annual cardiac review, sharp joint pain, routine refill"
          className={`form-control ${errors.reason ? 'has-error' : ''}`}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setErrors((prev) => ({ ...prev, reason: undefined }));
          }}
          aria-invalid={Boolean(errors.reason)}
          aria-describedby={errors.reason ? `${formId}-reason-error` : undefined}
        />
        {errors.reason && (
          <p id={`${formId}-reason-error`} className="form-error" role="alert">
            <AlertCircle size={14} />
            <span>{errors.reason}</span>
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" htmlFor={`${formId}-notes-input`}>
          Clinical Triage Notes (Optional)
        </label>
        <textarea
          id={`${formId}-notes-input`}
          rows={2}
          placeholder="Special requests, patient mobility notes, allergy precautions..."
          className="form-control"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          id="modal-submit-booking"
          className="btn btn-book-primary"
          onClick={handleSubmit}
        >
          Confirm & Schedule
        </button>
      </div>
    </form>
  );
}

export default function BookingModal({
  isOpen,
  onClose,
  doctors,
  patients,
  existingAppointments = [],
  initialDoctorId,
  initialPatientId,
  onSaveAppointment
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule New Clinic Appointment"
      maxWidth="620px"
    >
      <BookingForm
        key={`${initialDoctorId || 'none'}-${initialPatientId || 'none'}-${isOpen}`}
        doctors={doctors}
        patients={patients}
        existingAppointments={existingAppointments}
        initialDoctorId={initialDoctorId}
        initialPatientId={initialPatientId}
        onSaveAppointment={onSaveAppointment}
        onClose={onClose}
      />
    </Modal>
  );
}
