import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Productivity from './components/Productivity';
import ProjectsInProgress from './components/ProjectsInProgress';

function App() {
  // Global date range state - default to show all data (wide range)
  const getDefaultDateRange = () => {
    const end = new Date();
    const start = new Date('2023-01-01'); // Start from beginning of 2023 to capture all API data
    return { start, end };
  };

  const [globalDateRange, setGlobalDateRange] = useState(getDefaultDateRange());
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ 
      display: 'flex', 
      background: '#b8c5d0', 
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <Sidebar />
      <div style={{ 
        flexGrow: 1, 
        padding: '20px 30px',
        maxWidth: 'calc(100% - 240px)'
      }}>
        <Header 
          dateRange={globalDateRange}
          onDateRangeChange={setGlobalDateRange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <TaskList 
          dateRange={globalDateRange}
          searchQuery={searchQuery}
        />
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 400px', minWidth: '350px' }}>
            <Productivity dateRange={globalDateRange} />
          </div>
          <div style={{ flex: '1 1 400px', minWidth: '350px' }}>
            <ProjectsInProgress 
              dateRange={globalDateRange}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
