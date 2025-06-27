import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import MainMenu from './MainMenu';
import * as FiIcons from 'react-icons/fi';

const { FiChevronDown, FiChevronUp, FiPlus, FiFolder, FiCheck } = FiIcons;

const ProjectHeader = ({ projects, activeProjectId, onProjectSwitch, onNewProject, userRole }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProjectSelect = (projectId) => {
    onProjectSwitch(projectId);
    setIsDropdownOpen(false);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    if (progress >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        {/* Left Side - Menu and Project Info */}
        <div className="flex items-center space-x-4">
          {/* Main Menu Button */}
          <MainMenu />

          {/* Active Project Info */}
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiFolder} className="text-blue-600 text-xl" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeProject?.project_name || 'No Project Selected'}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(activeProject?.progress || 0)}`}
                      style={{ width: `${activeProject?.progress || 0}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getProgressTextColor(activeProject?.progress || 0)}`}>
                    {activeProject?.progress || 0}%
                  </span>
                </div>
                {activeProject?.progress === 100 && (
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Project Controls */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            {/* New Project Button - Only for admins */}
            {userRole === 'admin' && (
              <button
                onClick={onNewProject}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="text-sm" />
                <span className="text-sm font-medium">New Project</span>
              </button>
            )}

            {/* Project Dropdown */}
            {projects.length > 1 && (
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  Switch Project ({projects.length})
                </span>
                <SafeIcon 
                  icon={isDropdownOpen ? FiChevronUp : FiChevronDown} 
                  className="text-gray-500" 
                />
              </button>
            )}
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Select Project</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectSelect(project.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      project.id === activeProjectId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm font-medium truncate ${
                            project.id === activeProjectId ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {project.project_name}
                          </h4>
                          {project.id === activeProjectId && (
                            <SafeIcon icon={FiCheck} className="text-blue-600 text-sm flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {project.project_info}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${getProgressTextColor(project.progress)}`}>
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectHeader;