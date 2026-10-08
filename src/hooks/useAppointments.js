import { useState, useEffect, useCallback } from 'react';
import { INITIAL_APPOINTMENTS } from '../data/mockData';

const STORAGE_KEY = 'medicare_appointments_v1';

export function useAppointments() {
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse appointments from localStorage:', e);
    }
    return INITIAL_APPOINTMENTS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Failed to save appointments to localStorage:', e);
    }
  }, [appointments]);

  const addAppointment = useCallback((appointmentData) => {
    setAppointments((prev) => [appointmentData, ...prev]);
  }, []);

  const updateStatus = useCallback((id, status) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  }, []);

  const cancelAppointment = useCallback((id) => {
    updateStatus(id, 'Cancelled');
  }, [updateStatus]);

  const rescheduleAppointment = useCallback((id, date, time) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, date, time, status: 'Confirmed' } : apt
      )
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setAppointments(INITIAL_APPOINTMENTS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Simulate network fetch for demonstration of loading states
  const simulateRefresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  return {
    appointments,
    isLoading,
    error,
    addAppointment,
    updateStatus,
    cancelAppointment,
    rescheduleAppointment,
    resetToDefault,
    simulateRefresh
  };
}
