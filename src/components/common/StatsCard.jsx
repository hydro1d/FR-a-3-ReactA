import React from 'react';

export default function StatsCard({ label, value, subtext, icon: Icon, color = '#0d9488', bg = '#f0fdfa' }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-box" style={{ backgroundColor: bg, color }}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
    </div>
  );
}
