import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import PatientsPage from './pages/PatientsPage';

import BookingModal from './components/appointments/BookingModal';
import RescheduleModal from './components/appointments/RescheduleModal';
import AppointmentDetailModal from './components/appointments/AppointmentDetailModal';
import DoctorDetailModal from './components/doctors/DoctorDetailModal';
import PatientDetailModal from './components/patients/PatientDetailModal';
import Toast from './components/common/Toast';

import { useAppointments } from './hooks/useAppointments';
import { INITIAL_DOCTORS, INITIAL_PATIENTS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDoctorId, setBookingDoctorId] = useState(null);
  const [bookingPatientId, setBookingPatientId] = useState(null);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);

  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState(null);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State management for appointments via custom hook
  const {
    appointments,
    isLoading,
    addAppointment,
    updateStatus,
    cancelAppointment,
    rescheduleAppointment,
    resetToDefault,
    simulateRefresh
  } = useAppointments();

  // Booking Modal handlers
  const handleOpenBooking = () => {
    setBookingDoctorId(null);
    setBookingPatientId(null);
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithDoctor = (doctor) => {
    setBookingDoctorId(doctor.id);
    setBookingPatientId(null);
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithPatient = (patient) => {
    setBookingDoctorId(null);
    setBookingPatientId(patient.id);
    setIsBookingOpen(true);
  };

  const handleSaveNewAppointment = (newApt) => {
    addAppointment(newApt);
    addToast(`Appointment scheduled successfully for ${newApt.patientName}!`);
  };

  const handleUpdateStatus = (id, newStatus) => {
    updateStatus(id, newStatus);
    addToast(`Appointment ${id} status updated to ${newStatus}.`);
  };

  const handleCancelAppointment = (id) => {
    cancelAppointment(id);
    addToast(`Appointment ${id} cancelled.`, 'error');
  };

  const handleSaveReschedule = (id, newDate, newTime) => {
    rescheduleAppointment(id, newDate, newTime);
    addToast(`Appointment rescheduled to ${newDate} at ${newTime}.`);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query && activeTab !== 'appointments') {
      setActiveTab('appointments');
    }
  };

  const handleResetData = () => {
    resetToDefault();
    addToast('Demo data restored to initial state.');
  };

  const handleRefresh = () => {
    simulateRefresh();
    addToast('Clinic records synchronized.');
  };

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenBookingModal={handleOpenBooking}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onResetData={handleResetData}
      appointmentCount={appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending').length}
    >
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Main Pages Conditional Rendering */}
      {activeTab === 'dashboard' && (
        <DashboardPage
          appointments={appointments}
          doctors={INITIAL_DOCTORS}
          patients={INITIAL_PATIENTS}
          onNavigateTab={setActiveTab}
          onOpenBookingModal={handleOpenBooking}
          onOpenBookingWithDoctor={handleOpenBookingWithDoctor}
          onSelectAppointment={(apt) => setSelectedAppointment(apt)}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'appointments' && (
        <AppointmentsPage
          appointments={appointments}
          externalSearchQuery={searchQuery}
          onOpenBookingModal={handleOpenBooking}
          onSelectAppointment={(apt) => setSelectedAppointment(apt)}
          onOpenReschedule={(apt) => setReschedulingAppointment(apt)}
          onUpdateStatus={handleUpdateStatus}
          onCancelAppointment={handleCancelAppointment}
        />
      )}

      {activeTab === 'doctors' && (
        <DoctorsPage
          doctors={INITIAL_DOCTORS}
          onOpenBookingWithDoctor={handleOpenBookingWithDoctor}
          onSelectDoctorProfile={(doc) => setSelectedDoctorProfile(doc)}
        />
      )}

      {activeTab === 'patients' && (
        <PatientsPage
          patients={INITIAL_PATIENTS}
          onOpenBookingWithPatient={handleOpenBookingWithPatient}
          onSelectPatient={(pat) => setSelectedPatientProfile(pat)}
        />
      )}

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctors={INITIAL_DOCTORS}
        patients={INITIAL_PATIENTS}
        existingAppointments={appointments}
        initialDoctorId={bookingDoctorId}
        initialPatientId={bookingPatientId}
        onSaveAppointment={handleSaveNewAppointment}
      />

      <RescheduleModal
        isOpen={!!reschedulingAppointment}
        onClose={() => setReschedulingAppointment(null)}
        appointment={reschedulingAppointment}
        doctors={INITIAL_DOCTORS}
        onSaveReschedule={handleSaveReschedule}
      />

      <AppointmentDetailModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onUpdateStatus={handleUpdateStatus}
        onOpenReschedule={(apt) => setReschedulingAppointment(apt)}
      />

      <DoctorDetailModal
        isOpen={!!selectedDoctorProfile}
        onClose={() => setSelectedDoctorProfile(null)}
        doctor={selectedDoctorProfile}
        onOpenBooking={(doc) => handleOpenBookingWithDoctor(doc)}
      />

      <PatientDetailModal
        isOpen={!!selectedPatientProfile}
        onClose={() => setSelectedPatientProfile(null)}
        patient={selectedPatientProfile}
        onOpenBooking={(pat) => handleOpenBookingWithPatient(pat)}
      />
    </MainLayout>
  );
}
