import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import EditableField from './EditableField';
import StatCard from './StatCard';
import IdealCustomerProfile from './IdealCustomerProfile';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart3, FiUser, FiMail, FiCalendar, FiFolderOpen, FiChevronDown, FiChevronUp, FiUsers } = FiIcons;

const Dashboard = ({ data, onUpdate }) => {
  const [isClientInfoExpanded, setIsClientInfoExpanded] = useState(false);

  const toggleClientInfo = () => {
    setIsClientInfoExpanded(!isClientInfoExpanded);
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiBarChart3} className="text-xl" />
          <h2 className="text-lg font-semibold">Project Dashboard</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress Bar */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Project Progress</h3>
          <ProgressBar 
            progress={data.progress || 0} 
            onUpdate={(value) => onUpdate('progress', value)} 
          />
        </div>

        {/* Project Details - Combined Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <SafeIcon icon={FiFolderOpen} className="mr-2" />
            Project Details
          </h3>

          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block font-medium">Project Name</label>
              <EditableField
                value={data.project_name || data.projectName || ''}
                onSave={(value) => onUpdate('project_name', value)}
                className="text-lg font-semibold text-gray-900 bg-white rounded-md border border-gray-200"
              />
            </div>

            {/* Project Information */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block font-medium">Project Information</label>
              <EditableField
                value={data.project_info || data.projectInfo || ''}
                onSave={(value) => onUpdate('project_info', value)}
                multiline={true}
                className="text-gray-600 bg-white rounded-md border border-gray-200"
              />
            </div>

            {/* Specialist */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block font-medium flex items-center">
                <SafeIcon icon={FiUser} className="mr-1" />
                Assigned Specialist
              </label>
              <EditableField
                value={data.specialist_name || data.specialistName || ''}
                onSave={(value) => onUpdate('specialist_name', value)}
                className="text-gray-900 font-medium bg-white rounded-md border border-gray-200"
              />
            </div>

            {/* Client Information Dropdown */}
            <div className="border border-gray-200 rounded-lg bg-white">
              <button
                onClick={toggleClientInfo}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUsers} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Client Information</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {(data.client_info?.name || data.clientInfo?.name) || 'Not set'}
                  </span>
                </div>
                <SafeIcon
                  icon={isClientInfoExpanded ? FiChevronUp : FiChevronDown}
                  className="text-gray-400 transition-transform duration-200"
                />
              </button>

              {/* Expandable Client Info Content */}
              {isClientInfoExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-2 block font-medium">Client Name</label>
                      <EditableField
                        value={(data.client_info?.name || data.clientInfo?.name) || ''}
                        onSave={(value) => onUpdate('client_info.name', value)}
                        className="text-gray-900 bg-white rounded-md border border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-2 block font-medium">Email Address</label>
                      <EditableField
                        value={(data.client_info?.email || data.clientInfo?.email) || ''}
                        onSave={(value) => onUpdate('client_info.email', value)}
                        className="text-gray-900 bg-white rounded-md border border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-2 block font-medium">Company</label>
                      <EditableField
                        value={(data.client_info?.company || data.clientInfo?.company) || ''}
                        onSave={(value) => onUpdate('client_info.company', value)}
                        className="text-gray-900 bg-white rounded-md border border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={FiMail}
            title="Emails Sent"
            value={data.emails_sent || data.emailsSent || 0}
            onUpdate={(value) => onUpdate('emails_sent', parseInt(value) || 0)}
          />
          <StatCard
            icon={FiCalendar}
            title="Meetings Booked"
            value={data.meetings_booked || data.meetingsBooked || 0}
            onUpdate={(value) => onUpdate('meetings_booked', parseInt(value) || 0)}
          />
        </div>

        {/* Ideal Customer Profile */}
        <IdealCustomerProfile
          data={data.ideal_customer_profile || data.idealCustomerProfile || {}}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
};

export default Dashboard;