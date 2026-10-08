import { useState, useMemo } from 'react';

/**
 * Custom hook to encapsulate appointment filtering, searching, and sorting logic.
 * Decouples complex multi-criteria data operations from UI components.
 */
export function useAppointmentFilter(appointments, initialSearch = '') {
  const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        // 1. Status Filter
        if (selectedStatusTab !== 'ALL' && apt.status.toUpperCase() !== selectedStatusTab) {
          return false;
        }

        // 2. Specialty Filter
        if (selectedSpecialty !== 'All Specialties' && apt.specialty !== selectedSpecialty) {
          return false;
        }

        // 3. Date Filter
        if (filterDate && apt.date !== filterDate) {
          return false;
        }

        // 4. Multi-field Keyword Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchesPatient = (apt.patientName || '').toLowerCase().includes(query);
          const matchesDoctor = (apt.doctorName || '').toLowerCase().includes(query);
          const matchesId = (apt.id || '').toLowerCase().includes(query);
          const matchesReason = (apt.reason || '').toLowerCase().includes(query);
          const matchesSpecialty = (apt.specialty || '').toLowerCase().includes(query);

          if (!matchesPatient && !matchesDoctor && !matchesId && !matchesReason && !matchesSpecialty) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':
            return new Date(a.date) - new Date(b.date);
          case 'date-desc':
            return new Date(b.date) - new Date(a.date);
          case 'patient':
            return (a.patientName || '').localeCompare(b.patientName || '');
          case 'doctor':
            return (a.doctorName || '').localeCompare(b.doctorName || '');
          case 'fee-desc':
            return (b.fee || 0) - (a.fee || 0);
          default:
            return 0;
        }
      });
  }, [appointments, selectedStatusTab, selectedSpecialty, filterDate, searchQuery, sortBy]);

  const statusCounts = useMemo(() => {
    return {
      ALL: appointments.length,
      CONFIRMED: appointments.filter((a) => a.status === 'Confirmed').length,
      PENDING: appointments.filter((a) => a.status === 'Pending').length,
      COMPLETED: appointments.filter((a) => a.status === 'Completed').length,
      CANCELLED: appointments.filter((a) => a.status === 'Cancelled').length
    };
  }, [appointments]);

  const clearFilters = () => {
    setSelectedStatusTab('ALL');
    setSearchQuery('');
    setSelectedSpecialty('All Specialties');
    setFilterDate('');
    setSortBy('date-desc');
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedSpecialty !== 'All Specialties' ||
    filterDate ||
    selectedStatusTab !== 'ALL'
  );

  return {
    filteredAppointments,
    statusCounts,
    selectedStatusTab,
    setSelectedStatusTab,
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    filterDate,
    setFilterDate,
    sortBy,
    setSortBy,
    clearFilters,
    hasActiveFilters
  };
}
