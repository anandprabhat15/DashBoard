import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/api';

const ProjectsInProgress = ({ dateRange, searchQuery }) => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTasks()
      .then((res) => {
        const data = res.data;
        if (data && data.tasks) {
          const tasksArray = Object.entries(data.tasks).map(([id, task]) => ({
            id,
            ...task
          }));
          
          // Filter for in-progress tasks (current_status = "1")
          const inProgressTasks = tasksArray.filter(task => task.current_status === '1');
          
          // Filter by date range if provided
          const dateFilteredTasks = filterTasksByDateRange(inProgressTasks);
          
          // Filter by search query
          const searchFilteredTasks = filterTasksBySearch(dateFilteredTasks);
          
          // Map to project format
          const projectsData = searchFilteredTasks.map(task => ({
            title: task.task,
            date: formatDate(task.assigned_on),
            tags: generateTags(task.type),
            avatars: generateAvatars(task.assignee),
            comments: generateRandomNumber(5, 20),
            files: generateRandomNumber(0, 8),
            type: task.type // Keep original type for search
          }));
          
          setProjects(projectsData);
        } else {
          setProjects([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setLoading(false);
      });
  }, [dateRange, searchQuery]);

  // Parse date from API format
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
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
      // Search in project/task title
      const titleMatch = task.task && task.task.toLowerCase().includes(query);
      
      // Search in task type
      const typeMatch = task.type && task.type.toLowerCase().includes(query);
      
      // Search in assignee name
      const assigneeMatch = task.assignee && task.assignee.toLowerCase().includes(query);
      
      return titleMatch || typeMatch || assigneeMatch;
    });
  };

  // Format date to DD.MM.YY
  const formatDate = (dateStr) => {
    const date = parseDate(dateStr);
    if (!date) return 'N/A';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    
    return `${day}.${month}.${year}`;
  };

  // Generate tags based on task type
  const generateTags = (type) => {
    const tagColors = {
      'Enhancement': '#06b6d4',
      'Meeting': '#22c55e',
      'Client Engagement': '#a855f7',
      'New Feature': '#3b82f6',
      'Bug Fix': '#ef4444'
    };

    const tags = [
      { name: type || 'Task', color: tagColors[type] || '#64748b' }
    ];

    // Add additional random tags
    const additionalTags = ['Design', 'Backend', 'Frontend', 'Testing', 'Documentation'];
    const randomTag = additionalTags[Math.floor(Math.random() * additionalTags.length)];
    const randomColor = ['#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'][Math.floor(Math.random() * 4)];
    
    tags.push({ name: randomTag, color: randomColor });

    return tags;
  };

  // Generate avatar URLs
  const generateAvatars = (assignee) => {
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 avatars
    const avatars = [];
    
    for (let i = 0; i < count; i++) {
      const seed = assignee ? (assignee.charCodeAt(0) + i) % 70 : i + 1;
      avatars.push(`https://i.pravatar.cc/150?img=${seed}`);
    }
    
    return avatars;
  };

  // Generate random number in range
  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff'
      }}>
        Loading projects...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minHeight: '380px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#ffffff',
          marginBottom: '24px'
        }}>
          Projects in progress:
        </h3>
        <div style={{
          color: '#94a3b8',
          textAlign: 'center',
          padding: '40px',
          fontSize: '14px'
        }}>
          {searchQuery 
            ? `No projects found matching "${searchQuery}"` 
            : 'No projects in progress for the selected date range'}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      position: 'relative',
      minHeight: '380px'
    }}>
      {/* Header */}
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '24px'
      }}>
        Projects in progress:
      </h3>

      {/* Card Stack Container */}
      <div style={{
        position: 'relative',
        height: '280px'
      }}>
        {/* Stacked Cards Effect - Background Cards */}
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '20px',
          width: '85%',
          height: '240px',
          background: '#64748b',
          borderRadius: '16px',
          opacity: 0.3,
          transform: 'rotate(2deg)'
        }}></div>
        <div style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          width: '90%',
          height: '240px',
          background: '#64748b',
          borderRadius: '16px',
          opacity: 0.5,
          transform: 'rotate(1deg)'
        }}></div>

        {/* Main Card */}
        <div style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          width: '95%',
          height: '240px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease'
        }}>
          {/* Tags */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            {projects[currentIndex].tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: tag.color
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Project Title */}
          <h4 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '8px',
            lineHeight: '1.4'
          }}>
            {projects[currentIndex].title}
          </h4>

          {/* Date */}
          <p style={{
            fontSize: '13px',
            color: '#64748b',
            marginBottom: 'auto'
          }}>
            {projects[currentIndex].date}
          </p>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            {/* Avatars */}
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              {projects[currentIndex].avatars.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt={`Avatar ${i + 1}`}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid #ffffff',
                    marginLeft: i > 0 ? '-10px' : '0',
                    objectFit: 'cover',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
              ))}
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontSize: '16px' }}>💬</span>
                <span style={{
                  fontSize: '13px',
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  {projects[currentIndex].comments} comments
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontSize: '16px' }}>📎</span>
                <span style={{
                  fontSize: '13px',
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  {projects[currentIndex].files} files
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Button */}
        {projects.length > 1 && (
          <button
            onClick={nextCard}
            style={{
              position: 'absolute',
              right: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ffffff',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#1e293b',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            →
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      {projects.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '20px'
        }}>
          {projects.map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i === currentIndex ? '#ffffff' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsInProgress;
