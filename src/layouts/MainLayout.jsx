import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout({
  children,
  activeTab,
  setActiveTab,
  onOpenBookingModal,
  searchQuery,
  onSearchChange,
  appointmentCount
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        appointmentCount={appointmentCount}
      />
      <div className="main-layout">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenBookingModal={onOpenBookingModal}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <main className="page-container" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
