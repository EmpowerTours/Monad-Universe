import React, { useState, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { GalaxyScene } from './components/GalaxyScene';
import { Interface } from './components/Interface';
import { Login } from './components/Login';
import { PROJECTS } from './constants';
import { Project, FilterType } from './types';

const App: React.FC = () => {
  const { ready, authenticated, user } = usePrivy();
  const [filter, setFilter] = useState<FilterType>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter logic combined (Category + Search)
  const displayedProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      const matchesCategory = filter === 'All' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchTerm]);

  if (!ready) {
    return <div className="h-screen w-screen bg-[#050505] flex items-center justify-center text-[#836EF9]">Initializing Link...</div>;
  }

  if (!authenticated) {
    return <Login />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      <GalaxyScene 
        projects={displayedProjects} 
        filter={filter}
        onProjectSelect={setSelectedProject}
      />
      <Interface 
        onFilterChange={setFilter}
        onSearch={setSearchTerm}
        selectedProject={selectedProject}
        onCloseModal={() => setSelectedProject(null)}
        userAddress={user?.wallet?.address}
      />
    </div>
  );
};

export default App;