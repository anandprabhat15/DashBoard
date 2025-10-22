import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/api';

const TaskList = ({ dateRange, searchQuery }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Re-fetch from API whenever dateRange changes
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
  }, [dateRange]); // Re-fetch when dateRange changes

  // Parse date from API format "DD MMM YYYY" to Date object
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Generate avatar URL based on assignee name
  const getAvatarUrl = (name) => {
    const seed = name ? name.charCodeAt(0) % 70 : 1;
    return `https://i.pravatar.cc/150?img=${seed}`;
  };

  // Format status
  const getStatusInfo = (status) => {
    switch (status) {
      case '2':
        return { label: 'Done', bgColor: '#dcfce7', textColor: '#16a34a' };
      case '1':
        return { label: 'In progress', bgColor: '#dbeafe', textColor: '#2563eb' };
      case '0':
        return { label: 'Pending', bgColor: '#fef3c7', textColor: '#d97706' };
      default:
        return { label: 'Unknown', bgColor: '#f1f5f9', textColor: '#64748b' };
    }
  };

  // Filter tasks by date range
  const filterTasksByDateRange = (tasks) => {
    if (!dateRange) return tasks;
    
    return tasks.filter(task => {
      const assignedDate = parseDate(task.assigned_on);
      const dueDate = parseDate(task.due_date);
      
      if (!assignedDate && !dueDate) return true;
      
      const start = dateRange.start;
      const end = dateRange.end;
      
      // Include task if either assigned_on or due_date falls within range
      const assignedInRange = assignedDate && assignedDate >= start && assignedDate <= end;
      const dueInRange = dueDate && dueDate >= start && dueDate <= end;
      
      return assignedInRange || dueInRange;
    });
  };

  // Filter tasks by search query
  const filterTasksBySearch = (tasks) => {
    if (!searchQuery || searchQuery.trim() === '') return tasks;
    
    const query = searchQuery.toLowerCase().trim();
    
    return tasks.filter(task => {
      // Search in task name/title
      const taskNameMatch = task.task && task.task.toLowerCase().includes(query);
      
      // Search in assignee name
      const assigneeMatch = task.assignee && task.assignee.toLowerCase().includes(query);
      
      // Search in task type
      const typeMatch = task.type && task.type.toLowerCase().includes(query);
      
      // Search in status
      const statusInfo = getStatusInfo(task.current_status);
      const statusMatch = statusInfo.label.toLowerCase().includes(query);
      
      return taskNameMatch || assigneeMatch || typeMatch || statusMatch;
    });
  };

  const dateFilteredTasks = filterTasksByDateRange(tasks);
  const filteredTasks = filterTasksBySearch(dateFilteredTasks);
  
  // Calculate statistics
  const totalTasks = filteredTasks.length;
  const doneTasks = filteredTasks.filter(task => task.current_status === '2').length;
  const inProgressTasks = filteredTasks.filter(task => task.current_status === '1').length;

  // Format run time from estimated days
  const formatRunTime = (days) => {
    if (!days) return 'N/A';
    const numDays = parseInt(days);
    if (numDays < 7) return `${numDays} ${numDays === 1 ? 'day' : 'days'}`;
    if (numDays < 30) {
      const weeks = Math.round(numDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    }
    const months = Math.round(numDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  };

  // Format finish date
  const formatFinishDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = parseDate(dateStr);
    if (!date) return dateStr;
    
    const day = date.getDate();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${day} ${dayName}`;
  };

  // Calculate member count from API data
  // Count how many unique people are assigned to tasks with the same name
  const getMemberCount = (task) => {
    if (!task.task) return 0;
    
    // Find all tasks with the same name
    const sameTasks = tasks.filter(t => t.task === task.task);
    
    // Collect unique assignees and assigned_by for these tasks
    const uniqueMembers = new Set();
    sameTasks.forEach(t => {
      if (t.assignee) uniqueMembers.add(t.assignee);
      if (t.assigned_by) uniqueMembers.add(t.assigned_by);
    });
    
    return uniqueMembers.size;
  };

  if (loading) {
    return (
      <div style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginTop: '20px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        Loading tasks...
      </div>
    );
  }

  return (
    <div style={{
      background: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      marginTop: '20px'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '4px'
          }}>
            Last tasks
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b'
          }}>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>{totalTasks} total</span>, proceed to resolve them
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              lineHeight: '1'
            }}>
              {doneTasks}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#64748b',
              marginTop: '4px'
            }}>
              Done
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              lineHeight: '1'
            }}>
              {inProgressTasks}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#64748b',
              marginTop: '4px'
            }}>
              In progress
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0
        }}>
          <thead>
            <tr>
              <th style={{
                ...headerCellStyle,
                width: '5%'
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
              </th>
              <th style={{ ...headerCellStyle, textAlign: 'left', width: '30%' }}>Name</th>
              <th style={{ ...headerCellStyle, textAlign: 'left', width: '15%' }}>Admin</th>
              <th style={{ ...headerCellStyle, textAlign: 'left', width: '12%' }}>Members</th>
              <th style={{ ...headerCellStyle, textAlign: 'left', width: '15%' }}>Status</th>
              <th style={{ ...headerCellStyle, textAlign: 'left', width: '12%' }}>Run time</th>
              <th style={{ ...headerCellStyle, textAlign: 'left', width: '11%' }}>Finish date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ ...bodyCellStyle, textAlign: 'center', color: '#64748b' }}>
                  {searchQuery ? `No tasks found matching "${searchQuery}"` : 'No tasks found for the selected date range'}
                </td>
              </tr>
            ) : (
              filteredTasks.map((task, i) => {
                const statusInfo = getStatusInfo(task.current_status);
                return (
                  <tr key={task.id} style={{
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={bodyCellStyle}>
                      <input
                        type="checkbox"
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    <td style={bodyCellStyle}>
                      <span style={{
                        fontSize: '14px',
                        color: '#1e293b',
                        fontWeight: '500'
                      }}>
                        {task.task}
                      </span>
                    </td>
                    <td style={bodyCellStyle}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <img
                          src={getAvatarUrl(task.assignee)}
                          alt={task.assignee}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          color: '#64748b'
                        }}>
                          {task.assignee}
                        </span>
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      <span style={{
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        {getMemberCount(task)}
                      </span>
                    </td>
                    <td style={bodyCellStyle}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '500',
                        background: statusInfo.bgColor,
                        color: statusInfo.textColor
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: statusInfo.textColor
                        }}></span>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={bodyCellStyle}>
                      <span style={{
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        {formatRunTime(task.estimated_days)}
                      </span>
                    </td>
                    <td style={bodyCellStyle}>
                      <span style={{
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        {formatFinishDate(task.due_date)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const headerCellStyle = {
  padding: '12px 16px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '1px solid #e2e8f0'
};

const bodyCellStyle = {
  padding: '16px',
  borderBottom: '1px solid #f1f5f9'
};

export default TaskList;
