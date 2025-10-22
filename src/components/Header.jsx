import React, { useState } from 'react';
import DateRangePicker from './DateRangePicker';

const Header = ({ dateRange, onDateRangeChange, searchQuery, onSearchChange }) => {
  const [viewMode, setViewMode] = useState('card');
  
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const day = today.getDate();
  const month = today.toLocaleDateString('en-US', { month: 'long' });
  
  // Function to get ordinal suffix
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formattedDate = `${dayOfWeek}, ${day}${getOrdinalSuffix(day)} ${month}`;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      background: '#ffffff',
      padding: '16px 24px',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      {/* Search Input */}
      <div style={{
        position: 'relative',
        flex: '1 1 300px',
        minWidth: '250px',
        maxWidth: '500px'
      }}>
        <span style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '18px',
          color: '#94a3b8'
        }}>
          🔍
        </span>
        <input
          type="text"
          placeholder="Search tasks, projects, assignees..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 48px',
            border: 'none',
            background: '#f8fafc',
            borderRadius: '12px',
            fontSize: '15px',
            color: '#1e293b',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.background = '#f1f5f9';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.background = '#f8fafc';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Right Section: Date and View Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Date with Dropdown */}
        <DateRangePicker
          selectedRange={dateRange}
          onRangeChange={onDateRangeChange}
          buttonStyle={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'background 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
            color: '#64748b'
          }}
        />

        {/* View Toggle Buttons */}
        <div style={{
          display: 'flex',
          background: '#1e293b',
          borderRadius: '12px',
          padding: '4px',
          gap: '4px'
        }}>
          <button
            onClick={() => setViewMode('card')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: viewMode === 'card' ? '#334155' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '16px' }}>▦</span>
            <span>Card</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: viewMode === 'list' ? '#334155' : 'transparent',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '16px' }}>☰</span>
            <span>List</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
