import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTasks } from '../services/api';
import DateRangePicker from './DateRangePicker';

const Productivity = ({ dateRange }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localDateRange, setLocalDateRange] = useState(dateRange);

  useEffect(() => {
    setLocalDateRange(dateRange);
  }, [dateRange]);

  useEffect(() => {
    setLoading(true);
    // Re-fetch from API whenever localDateRange changes
    // Note: Current API doesn't support date parameters, but this structure
    // allows for easy integration if API is updated to support date filtering
    getTasks()
      .then((res) => {
        const data = res.data;
        if (data && data.tasks) {
          const tasksArray = Object.entries(data.tasks).map(([id, task]) => ({
            id,
            ...task
          }));
          setTasks(tasksArray);
        } else {
          setTasks([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setTasks([]);
        setLoading(false);
      });
  }, [localDateRange]); // Re-fetch when localDateRange changes

  // Parse date from API format
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Generate chart data from tasks - group by week for better visualization
  const generateChartData = () => {
    if (!localDateRange || tasks.length === 0) {
      return [];
    }

    const { start, end } = localDateRange;
    
    // Filter tasks within date range
    const filteredTasks = tasks.filter(task => {
      const assignedDate = parseDate(task.assigned_on);
      if (!assignedDate) return false;
      return assignedDate >= start && assignedDate <= end;
    });

    if (filteredTasks.length === 0) {
      return [];
    }

    // Group tasks by week
    const weeklyData = {};
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    filteredTasks.forEach(task => {
      const assignedDate = parseDate(task.assigned_on);
      if (!assignedDate) return;
      
      const dayOfWeek = assignedDate.getDay();
      const dayName = daysOfWeek[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // Convert Sunday (0) to index 6
      
      if (!weeklyData[dayName]) {
        weeklyData[dayName] = { Research: 0, Design: 0 };
      }
      
      // Map task types to Research or Design categories
      const type = task.type || '';
      if (type.includes('Research') || type.includes('Meeting') || type.includes('Client')) {
        weeklyData[dayName].Research += 1;
      } else {
        weeklyData[dayName].Design += 1;
      }
    });

    // Create chart data for all days of week
    const chartData = daysOfWeek.map(day => ({
      day,
      Research: weeklyData[day]?.Research || 0,
      Design: weeklyData[day]?.Design || 0
    }));

    return chartData;
  };

  const chartData = generateChartData();
  
  // Fixed types for the chart
  const type1 = 'Research';
  const type2 = 'Design';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      return (
        <div style={{
          background: '#1e293b',
          padding: '8px 12px',
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{
            margin: 0,
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {total} {total === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        textAlign: 'center',
        color: '#64748b'
      }}>
        Loading productivity data...
      </div>
    );
  }

  return (
    <div style={{
      background: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '4px'
          }}>
            Productivity
          </h3>
        </div>
        
        {/* Date Selector */}
        <DateRangePicker
          selectedRange={localDateRange}
          onRangeChange={setLocalDateRange}
          buttonStyle={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: '#f8fafc',
            borderRadius: '8px',
            transition: 'background 0.2s ease',
            fontSize: '13px',
            fontWeight: '500',
            color: '#64748b'
          }}
        />
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#06b6d4',
            display: 'inline-block'
          }}></span>
          <span style={{
            fontSize: '13px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            {type1}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#a855f7',
            display: 'inline-block'
          }}></span>
          <span style={{
            fontSize: '13px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            {type2}
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <p style={{
        fontSize: '12px',
        color: '#94a3b8',
        marginBottom: '20px'
      }}>
        Data updates every 3 hours
      </p>

      {/* Chart */}
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart 
            data={chartData}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={type1}
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#06b6d4' }}
            />
            <Line 
              type="monotone" 
              dataKey={type2}
              stroke="#a855f7" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#a855f7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div style={{
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: '14px'
        }}>
          No data available for the selected date range
        </div>
      )}
    </div>
  );
};

export default Productivity;
