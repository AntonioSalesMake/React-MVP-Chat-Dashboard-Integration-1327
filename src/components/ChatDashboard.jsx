import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import ChatInterface from './ChatInterface';
import Dashboard from './Dashboard';
import ProjectHeader from './ProjectHeader';
import supabase from '../lib/supabase';

const ChatDashboard = () => {
  const { userProfile, assignedProjects, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && userProfile) {
      loadProjects();
    }
  }, [authLoading, userProfile]);

  const loadProjects = async () => {
    try {
      if (userProfile.role === 'admin') {
        // Admin sees all projects
        const { data, error } = await supabase
          .from('projects_um2024')
          .select('*');
        
        if (error) throw error;
        setProjects(data || []);
      } else {
        // Clients and specialists see only assigned projects
        setProjects(assignedProjects || []);
      }

      // Set active project to first available project
      const availableProjects = userProfile.role === 'admin' ? 
        (await supabase.from('projects_um2024').select('*')).data || [] : 
        assignedProjects || [];
      
      if (availableProjects.length > 0) {
        setActiveProjectId(availableProjects[0].id);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDashboardData = async (field, value) => {
    if (!activeProjectId) return;

    try {
      const updateData = {};
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        // For nested updates, we need to fetch current data first
        const { data: currentProject } = await supabase
          .from('projects_um2024')
          .select(parent)
          .eq('id', activeProjectId)
          .single();

        updateData[parent] = {
          ...currentProject[parent],
          [child]: value
        };
      } else {
        updateData[field] = value;
      }

      const { error } = await supabase
        .from('projects_um2024')
        .update(updateData)
        .eq('id', activeProjectId);

      if (error) throw error;

      // Update local state
      setProjects(prevProjects =>
        prevProjects.map(project => {
          if (project.id === activeProjectId) {
            if (field.includes('.')) {
              const [parent, child] = field.split('.');
              return {
                ...project,
                [parent]: {
                  ...project[parent],
                  [child]: value
                }
              };
            } else {
              return {
                ...project,
                [field]: value
              };
            }
          }
          return project;
        })
      );
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project data');
    }
  };

  const handleProjectSwitch = (projectId) => {
    setActiveProjectId(projectId);
  };

  const handleNewProject = async () => {
    if (userProfile.role !== 'admin') {
      alert('Only administrators can create new projects');
      return;
    }

    try {
      const newProject = {
        project_name: `New Project ${projects.length + 1}`,
        project_info: 'New project description - click to edit',
        specialist_name: 'Unassigned',
        progress: 0,
        emails_sent: 0,
        meetings_booked: 0,
        client_info: {
          name: '',
          email: '',
          company: ''
        },
        ideal_customer_profile: {
          job_titles: [],
          industry: [],
          location: [],
          company_size: [],
          meeting_links: [],
          campaign_offers: []
        }
      };

      const { data, error } = await supabase
        .from('projects_um2024')
        .insert(newProject)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [...prev, data]);
      setActiveProjectId(data.id);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create new project');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Project Header */}
      <ProjectHeader
        projects={projects}
        activeProjectId={activeProjectId}
        onProjectSwitch={handleProjectSwitch}
        onNewProject={handleNewProject}
        userRole={userProfile?.role}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Interface - Left Half */}
        <div className="w-1/2 border-r border-gray-300">
          <ChatInterface
            progress={activeProject?.progress || 0}
            onProgressUpdate={(value) => updateDashboardData('progress', value)}
          />
        </div>

        {/* Dashboard - Right Half */}
        <div className="w-1/2">
          <Dashboard
            data={activeProject || {}}
            onUpdate={updateDashboardData}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;