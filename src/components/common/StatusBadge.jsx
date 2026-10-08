import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();
  
  return (
    <span className={`status-badge status-${normalized}`}>
      <span className="status-badge-dot" />
      <span>{status}</span>
    </span>
  );
}
