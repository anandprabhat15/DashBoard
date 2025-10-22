import React, { useState, useRef, useEffect } from 'react';

const DateRangePicker = ({ selectedRange, onRangeChange, buttonStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDateRange = (start, end) => {
    if (!start || !end) return null;
    
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    
    // If same month and year
    if (startMonth === endMonth && startYear === endYear) {
      return `${startDay.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')} ${startMonth}`;
    }
    
    // If different months or years
    if (startYear === endYear) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    }
    
    // If different years, show full dates
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  };

  const applyPreset = (preset) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (preset) {
      case 'last7':
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        end = new Date(today);
        break;
      case 'last30':
        start = new Date(today);
        start.setDate(today.getDate() - 29);
        end = new Date(today);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
    onRangeChange({ start, end });
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (startDate && endDate) {
      onRangeChange({ start: startDate, end: endDate });
      setIsOpen(false);
    }
  };

  const displayText = selectedRange 
    ? formatDateRange(selectedRange.start, selectedRange.end)
    : formatDateRange(startDate, endDate) || 'Select Date Range';

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...buttonStyle,
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <span style={{
          fontSize: buttonStyle?.fontSize || '14px',
          fontWeight: buttonStyle?.fontWeight || '500',
          color: buttonStyle?.color || '#64748b'
        }}>
          {displayText}
        </span>
        <span style={{
          fontSize: '12px',
          color: '#94a3b8',
          marginLeft: '8px'
        }}>
          ▼
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          padding: '16px',
          zIndex: 1000,
          minWidth: '280px',
          border: '1px solid #e2e8f0'
        }}>
          {/* Preset Options */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Quick Select
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { label: 'Last 7 Days', value: 'last7' },
                { label: 'Last 30 Days', value: 'last30' },
                { label: 'This Month', value: 'thisMonth' },
                { label: 'Last Month', value: 'lastMonth' }
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => applyPreset(preset.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#1e293b',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Selection */}
          <div style={{
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Custom Range
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{
                  fontSize: '12px',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                />
              </div>
              <div>
                <label style={{
                  fontSize: '12px',
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  min={startDate ? startDate.toISOString().split('T')[0] : ''}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                />
              </div>
              <button
                onClick={handleApplyCustom}
                disabled={!startDate || !endDate}
                style={{
                  marginTop: '8px',
                  padding: '10px',
                  background: startDate && endDate ? '#1e293b' : '#e2e8f0',
                  color: startDate && endDate ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: startDate && endDate ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (startDate && endDate) {
                    e.target.style.background = '#334155';
                  }
                }}
                onMouseLeave={(e) => {
                  if (startDate && endDate) {
                    e.target.style.background = '#1e293b';
                  }
                }}
              >
                Apply Custom Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
