import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronDown, FiChevronUp, FiCheck, FiCircle, FiExternalLink, FiEye } = FiIcons;

const ProgressBar = ({ progress, onUpdate }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stepLinks, setStepLinks] = useState({
    onboarding: '',
    mailboxes: '',
    templates: '',
    sampleList: ''
  });
  const [campaignsLive, setCampaignsLive] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);

  const steps = [
    { 
      id: 1, 
      title: 'Onboarding document filled', 
      value: 20,
      key: 'onboarding',
      requiresLink: true
    },
    { 
      id: 2, 
      title: 'Mailboxes are warming up', 
      value: 40,
      key: 'mailboxes',
      requiresLink: true
    },
    { 
      id: 3, 
      title: 'Email templates are created', 
      subtitle: '(option for the client to approve)', 
      value: 60,
      key: 'templates',
      requiresLink: true
    },
    { 
      id: 4, 
      title: 'Sample list created', 
      value: 80,
      key: 'sampleList',
      requiresLink: true
    },
    { 
      id: 5, 
      title: 'Campaigns are live', 
      value: 100,
      requiresCheckbox: true
    }
  ];

  const getCompletedSteps = () => {
    return steps.filter(step => isStepCompleted(step)).length;
  };

  const handleLinkChange = (stepKey, value) => {
    const newStepLinks = { ...stepLinks, [stepKey]: value };
    setStepLinks(newStepLinks);
    
    // Auto-advance progress when link is added
    if (value.trim()) {
      const step = steps.find(s => s.key === stepKey);
      if (step && progress < step.value) {
        onUpdate(step.value);
      }
    }
  };

  const handleCampaignsLiveToggle = (checked) => {
    setCampaignsLive(checked);
    if (checked && progress < 100) {
      onUpdate(100);
    } else if (!checked && progress === 100) {
      // If unchecked, revert to previous step's progress
      onUpdate(80);
    }
  };

  const toggleStepExpansion = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  const isStepCompleted = (step) => {
    if (step.requiresLink) {
      return stepLinks[step.key]?.trim() && progress >= step.value;
    }
    if (step.requiresCheckbox) {
      return campaignsLive && progress >= step.value;
    }
    return progress >= step.value;
  };

  const canExpandStep = (step) => {
    if (step.requiresLink) {
      // Allow expansion if either not completed (to add link) or completed (to view link)
      return true;
    }
    if (step.requiresCheckbox) {
      return progress >= 80; // Can only access campaigns live after sample list is done
    }
    return false;
  };

  return (
    <div className="space-y-3">
      {/* Progress Overview */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Progress</span>
        <span className="text-sm font-medium text-gray-900">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Progress Summary */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {getCompletedSteps()} of {steps.length} steps completed
        </span>
        <button
          onClick={toggleDetails}
          className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>Details</span>
          <SafeIcon 
            icon={isDetailsOpen ? FiChevronUp : FiChevronDown} 
            className="text-sm" 
          />
        </button>
      </div>

      {/* Detailed Steps */}
      {isDetailsOpen && (
        <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700">Project Steps</h4>
          <div className="space-y-2">
            {steps.map((step) => {
              const isCompleted = isStepCompleted(step);
              const canExpand = canExpandStep(step);
              const isExpanded = expandedStep === step.id;
              const hasLink = step.requiresLink && stepLinks[step.key]?.trim();

              return (
                <div
                  key={step.id}
                  className={`rounded-lg border transition-colors ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div 
                    className={`flex items-start space-x-3 p-3 ${
                      canExpand ? 'cursor-pointer hover:bg-opacity-80' : ''
                    }`}
                    onClick={() => canExpand && toggleStepExpansion(step.id)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <SafeIcon 
                        icon={isCompleted ? FiCheck : FiCircle} 
                        className={`text-sm ${
                          isCompleted 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${
                            isCompleted 
                              ? 'text-green-800 font-medium' 
                              : 'text-gray-600'
                          }`}>
                            {step.title}
                          </p>
                          {step.subtitle && (
                            <p className={`text-xs ${
                              isCompleted 
                                ? 'text-green-600' 
                                : 'text-gray-500'
                            }`}>
                              {step.subtitle}
                            </p>
                          )}
                          {/* Show link indicator for completed steps with links */}
                          {isCompleted && hasLink && (
                            <div className="flex items-center space-x-1 mt-1">
                              <SafeIcon icon={FiExternalLink} className="text-xs text-green-600" />
                              <span className="text-xs text-green-600">Link attached</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isCompleted 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {step.value}%
                          </span>
                          {canExpand && (
                            <SafeIcon 
                              icon={isExpanded ? FiChevronUp : FiChevronDown}
                              className="text-sm text-gray-400"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-gray-200 bg-white">
                      {step.requiresLink && (
                        <div className="pt-3">
                          {isCompleted && hasLink ? (
                            // Show link view for completed steps
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-2">
                                <SafeIcon icon={FiEye} className="inline mr-1" />
                                Attached Link
                              </label>
                              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                <SafeIcon icon={FiExternalLink} className="text-green-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-green-800 truncate">
                                    {stepLinks[step.key]}
                                  </p>
                                  <p className="text-xs text-green-600">Click to open link</p>
                                </div>
                                <a
                                  href={stepLinks[step.key]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 border border-green-300 rounded-md transition-colors font-medium text-sm"
                                >
                                  Open
                                </a>
                              </div>
                            </div>
                          ) : (
                            // Show link input for incomplete steps
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-2">
                                Add Link
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="url"
                                  value={stepLinks[step.key] || ''}
                                  onChange={(e) => handleLinkChange(step.key, e.target.value)}
                                  placeholder="https://..."
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {stepLinks[step.key] && (
                                  <a
                                    href={stepLinks[step.key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-2 text-blue-600 hover:text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                                  >
                                    <SafeIcon icon={FiExternalLink} className="text-sm" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {step.requiresCheckbox && (
                        <div className="pt-3">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleCampaignsLiveToggle(!campaignsLive)}
                              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                                campaignsLive
                                  ? 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                                  : 'border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-500'
                              }`}
                            >
                              {campaignsLive && (
                                <SafeIcon icon={FiCheck} className="text-lg" />
                              )}
                            </button>
                            <div>
                              <p className={`text-sm font-medium ${
                                campaignsLive ? 'text-green-800' : 'text-gray-700'
                              }`}>
                                Mark campaigns as live
                              </p>
                              <p className="text-xs text-gray-500">
                                Click to confirm campaigns are running
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;