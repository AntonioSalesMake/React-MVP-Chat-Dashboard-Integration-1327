import React, { useState, useEffect } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import supabase from '../lib/supabase';

const { FiUsers, FiMail, FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSearch, FiFilter } = FiIcons;

const UserManagement = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('clients');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'client',
    name: '',
    projectIds: []
  });

  // Fetch users and projects on component mount
  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_um2024')
        .select(`
          *,
          project_assignments_um2024 (
            project_id,
            projects_um2024 (
              id,
              project_name
            )
          )
        `);
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects_um2024')
        .select('*');
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user profile
      const { data: userData, error: userError } = await supabase
        .from('user_profiles_um2024')
        .insert({
          email: inviteData.email,
          name: inviteData.name,
          role: inviteData.role,
          status: 'invited',
          invited_at: new Date().toISOString()
        })
        .select()
        .single();

      if (userError) throw userError;

      // Assign projects if any selected
      if (inviteData.projectIds.length > 0) {
        const assignments = inviteData.projectIds.map(projectId => ({
          user_id: userData.id,
          project_id: projectId
        }));

        const { error: assignmentError } = await supabase
          .from('project_assignments_um2024')
          .insert(assignments);

        if (assignmentError) throw assignmentError;
      }

      // Send invitation email (simulate for now)
      await sendInvitationEmail(inviteData.email, inviteData.role);

      // Reset form and refresh data
      setInviteData({ email: '', role: 'client', name: '', projectIds: [] });
      setShowInviteForm(false);
      await fetchUsers();

      alert(`${inviteData.role === 'client' ? 'Client' : 'Specialist'} invited successfully!`);
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Failed to invite user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendInvitationEmail = async (email, role) => {
    // Simulate sending email - in production, this would trigger an actual email
    console.log(`Sending invitation email to ${email} for role: ${role}`);
    
    // You would integrate with your email service here
    // For now, we'll just simulate the process
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      
      // Delete project assignments first
      await supabase
        .from('project_assignments_um2024')
        .delete()
        .eq('user_id', userId);

      // Delete user profile
      const { error } = await supabase
        .from('user_profiles_um2024')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAssignment = async (userId, projectId, isAssigned) => {
    try {
      if (isAssigned) {
        // Remove assignment
        const { error } = await supabase
          .from('project_assignments_um2024')
          .delete()
          .eq('user_id', userId)
          .eq('project_id', projectId);

        if (error) throw error;
      } else {
        // Add assignment
        const { error } = await supabase
          .from('project_assignments_um2024')
          .insert({ user_id: userId, project_id: projectId });

        if (error) throw error;
      }

      await fetchUsers();
    } catch (error) {
      console.error('Error updating project assignment:', error);
      alert('Failed to update project assignment');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'all' || user.role === activeTab.slice(0, -1);
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getUserAssignedProjects = (user) => {
    return user.project_assignments_um2024?.map(assignment => assignment.projects_um2024) || [];
  };

  const isProjectAssigned = (user, projectId) => {
    return user.project_assignments_um2024?.some(assignment => assignment.project_id === projectId) || false;
  };

  const tabs = [
    { id: 'clients', label: 'Clients', count: users.filter(u => u.role === 'client').length },
    { id: 'specialists', label: 'Specialists', count: users.filter(u => u.role === 'specialist').length },
    { id: 'all', label: 'All Users', count: users.length }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiUsers} className="text-2xl" />
            <div>
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="text-gray-300 text-sm">Manage clients and specialists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiX} className="text-2xl" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Invite Button */}
            <button
              onClick={() => setShowInviteForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiUserPlus} />
              <span>Invite User</span>
            </button>
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon icon={FiUsers} className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <SafeIcon 
                            icon={user.role === 'client' ? FiUsers : FiUserPlus} 
                            className="text-blue-600" 
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'client' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'client' ? 'Client' : 'Specialist'}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Assigned Projects */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Projects</h4>
                        <div className="flex flex-wrap gap-2">
                          {projects.map((project) => {
                            const isAssigned = isProjectAssigned(user, project.id);
                            return (
                              <button
                                key={project.id}
                                onClick={() => handleProjectAssignment(user.id, project.id, isAssigned)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  isAssigned
                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {isAssigned && <SafeIcon icon={FiCheck} className="inline mr-1" />}
                                {project.project_name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite Form Modal */}
        {showInviteForm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Invite User</h3>
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteData.name}
                    onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="client">Client</option>
                    <option value="specialist">Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Projects
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {projects.map((project) => (
                      <label key={project.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={inviteData.projectIds.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setInviteData({
                                ...inviteData,
                                projectIds: [...inviteData.projectIds, project.id]
                              });
                            } else {
                              setInviteData({
                                ...inviteData,
                                projectIds: inviteData.projectIds.filter(id => id !== project.id)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{project.project_name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;