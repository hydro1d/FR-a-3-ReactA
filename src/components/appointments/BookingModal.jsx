import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { getTodayString, generateAppointmentId } from '../../utils/formatters';

export default function BookingModal({
  isOpen,
  onClose,
  doctors,
  patients,
  initialDoctorId,
  initialPatientId,
  onSaveAppointment
}) {
  const [patientMode, setPatientMode] = useState('existing'); // 'existing' | 'new'
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');

  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('In-person');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});

  const today = getTodayString();

  // Reset and pre-populate fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setPatientMode('existing');
      setSelectedDoctorId(initialDoctorId || (doctors[0] ? doctors[0].id : ''));
      setSelectedPatientId(initialPatientId || (patients[0] ? patients[0].id : ''));
      setNewPatientName('');
      setNewPatientPhone('');
      setAppointmentDate(today);
      setAppointmentType('In-person');
      setReason('');
      setNotes('');
    }
  }, [isOpen, initialDoctorId, initialPatientId, doctors, patients, today]);

  // Selected doctor object to derive time slots and fee
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  useEffect(() => {
    if (selectedDoctor && selectedDoctor.timeSlots && selectedDoctor.timeSlots.length > 0) {
      setAppointmentTime(selectedDoctor.timeSlots[0]);
    }
  }, [selectedDoctorId, selectedDoctor]);

  const validate = () => {
    const errs = {};
    if (patientMode === 'existing') {
      if (!selectedPatientId) errs.patient = 'Please select a registered patient';
    } else {
      if (!newPatientName.trim()) errs.newPatientName = 'Patient full name is required';
      if (!newPatientPhone.trim()) errs.newPatientPhone = 'Patient phone is required';
    }

    if (!selectedDoctorId) errs.doctor = 'Please select a specialist';
    if (!appointmentDate) {
      errs.date = 'Appointment date is required';
    } else if (appointmentDate < today) {
      errs.date = 'Appointment date cannot be in the past';
    }

    if (!appointmentTime) errs.time = 'Please select an appointment time slot';
    if (!reason.trim()) errs.reason = 'Please provide the clinical reason for the visit';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule New Clinic Appointment"
      maxWidth="620px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-book-primary"
            onClick={handleSubmit}
          >
            Confirm & Schedule
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Patient Selection Tabs */}
        <div className="form-group">
          <label className="form-label">Patient Record</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              type="button"
              className={`btn btn-sm ${patientMode === 'existing' ? 'btn-book-primary' : 'btn-secondary'}`}
              onClick={() => setPatientMode('existing')}
            >
              Registered Patient
            </button>
            <button
              type="button"
              className={`btn btn-sm ${patientMode === 'new' ? 'btn-book-primary' : 'btn-secondary'}`}
              onClick={() => setPatientMode('new')}
            >
              + Quick Register Patient
            </button>
          </div>

          {patientMode === 'existing' ? (
            <div>
              <select
                id="booking-patient-select"
                className={`form-control ${errors.patient ? 'has-error' : ''}`}
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="">Select a patient...</option>
                {patients.map((pat) => (
                  <option key={pat.id} value={pat.id}>
                    {pat.name} ({pat.id}) — {pat.phone}
                  </option>
                ))}
              </select>
              {errors.patient && <p className="form-error">{errors.patient}</p>}
            </div>
          ) : (
            <div className="form-grid-2">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={`form-control ${errors.newPatientName ? 'has-error' : ''}`}
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                />
                {errors.newPatientName && <p className="form-error">{errors.newPatientName}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={`form-control ${errors.newPatientPhone ? 'has-error' : ''}`}
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                />
                {errors.newPatientPhone && <p className="form-error">{errors.newPatientPhone}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Selection */}
        <div className="form-group">
          <label className="form-label" htmlFor="booking-doctor-select">
            Attending Specialist & Specialty
          </label>
          <select
            id="booking-doctor-select"
            className={`form-control ${errors.doctor ? 'has-error' : ''}`}
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} — {doc.specialty} (${doc.fee})
              </option>
            ))}
          </select>
          {errors.doctor && <p className="form-error">{errors.doctor}</p>}
        </div>

        {/* Date and Time Grid */}
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="booking-date-input">
              Appointment Date
            </label>
            <input
              id="booking-date-input"
              type="date"
              min={today}
              className={`form-control ${errors.date ? 'has-error' : ''}`}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
            {errors.date && <p className="form-error">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="booking-time-select">
              Available Time Slot
            </label>
            <select
              id="booking-time-select"
              className={`form-control ${errors.time ? 'has-error' : ''}`}
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            >
              {selectedDoctor && selectedDoctor.timeSlots ? (
                selectedDoctor.timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))
              ) : (
                <option value="10:00 AM">10:00 AM</option>
              )}
            </select>
            {errors.time && <p className="form-error">{errors.time}</p>}
          </div>
        </div>

        {/* Consultation Mode */}
        <div className="form-group">
          <label className="form-label">Consultation Mode</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="radio"
                name="aptType"
                value="In-person"
                checked={appointmentType === 'In-person'}
                onChange={() => setAppointmentType('In-person')}
              />
              In-Person Clinic Visit ({selectedDoctor ? selectedDoctor.room : 'Suite'})
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="radio"
                name="aptType"
                value="Telehealth"
                checked={appointmentType === 'Telehealth'}
                onChange={() => setAppointmentType('Telehealth')}
              />
              Virtual Telehealth Call
            </label>
          </div>
        </div>

        {/* Chief Complaint / Reason */}
        <div className="form-group">
          <label className="form-label" htmlFor="booking-reason-input">
            Reason for Visit / Primary Symptoms *
          </label>
          <input
            id="booking-reason-input"
            type="text"
            placeholder="e.g. Annual cardiac review, sharp joint pain, routine refill"
            className={`form-control ${errors.reason ? 'has-error' : ''}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {errors.reason && <p className="form-error">{errors.reason}</p>}
        </div>

        {/* Clinical Notes */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="booking-notes-input">
            Desk Notes / Triage Instructions (Optional)
          </label>
          <textarea
            id="booking-notes-input"
            rows={2}
            placeholder="Patient requests assistance with mobility, interpreter required, etc."
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
