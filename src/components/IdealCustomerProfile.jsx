import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiX, FiEdit2, FiCheck, FiMapPin, FiUsers, FiBriefcase, FiGlobe, FiLink, FiGift } = FiIcons;

const IdealCustomerProfile = ({ data, onUpdate }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const sections = [
    { key: 'job_titles', title: 'Job Titles', icon: FiBriefcase, placeholder: 'e.g., Marketing Director, VP of Sales', color: 'blue' },
    { key: 'industry', title: 'Industry', icon: FiGlobe, placeholder: 'e.g., SaaS, Healthcare, Finance', color: 'green' },
    { key: 'location', title: 'Location', icon: FiMapPin, placeholder: 'e.g., North America, Remote', color: 'purple' },
    { key: 'company_size', title: 'Company Size', icon: FiUsers, placeholder: 'e.g., 50-500 employees, $5M-$50M ARR', color: 'orange' },
    { key: 'meeting_links', title: 'Meeting Links', icon: FiLink, placeholder: 'e.g., https://calendly.com/your-link', color: 'indigo' },
    { key: 'campaign_offers', title: 'Campaign Offers', icon: FiGift, placeholder: 'e.g., Free audit, 30-day trial', color: 'pink' }
  ];

  const getColorClasses = (color, type = 'bg') => {
    const colorMap = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600', button: 'bg-orange-600 hover:bg-orange-700' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-600', button: 'bg-indigo-600 hover:bg-indigo-700' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: 'text-pink-600', button: 'bg-pink-600 hover:bg-pink-700' }
    };
    return colorMap[color]?.[type] || colorMap.blue[type];
  };

  const addItem = (sectionKey) => {
    setEditingSection(sectionKey);
    setEditingIndex('new');
    setTempValue('');
  };

  const editItem = (sectionKey, index) => {
    setEditingSection(sectionKey);
    setEditingIndex(index);
    setTempValue(data[sectionKey][index]);
  };

  const saveItem = () => {
    if (!tempValue.trim()) return;

    const currentItems = data[editingSection] || [];
    let newItems;

    if (editingIndex === 'new') {
      newItems = [...currentItems, tempValue.trim()];
    } else {
      newItems = [...currentItems];
      newItems[editingIndex] = tempValue.trim();
    }

    onUpdate(`ideal_customer_profile.${editingSection}`, newItems);
    cancelEdit();
  };

  const removeItem = (sectionKey, index) => {
    const currentItems = data[sectionKey] || [];
    const newItems = currentItems.filter((_, i) => i !== index);
    onUpdate(`ideal_customer_profile.${sectionKey}`, newItems);
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditingIndex(null);
    setTempValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveItem();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
        <SafeIcon icon={FiBriefcase} className="mr-2" />
        Ideal Customer Profile
      </h3>

      <div className="space-y-4">
        {sections.map((section) => {
          const items = data[section.key] || [];
          const isEditing = editingSection === section.key;

          return (
            <div key={section.key} className={`p-4 rounded-lg border ${getColorClasses(section.color, 'bg')} ${getColorClasses(section.color, 'border')}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={section.icon} className={`${getColorClasses(section.color, 'icon')}`} />
                  <h4 className={`text-sm font-medium ${getColorClasses(section.color, 'text')}`}>
                    {section.title}
                  </h4>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {items.length}
                  </span>
                </div>
                <button
                  onClick={() => addItem(section.key)}
                  className={`p-2 text-white rounded-full ${getColorClasses(section.color, 'button')} transition-colors`}
                >
                  <SafeIcon icon={FiPlus} className="text-sm" />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200 group">
                    {isEditing && editingIndex === index ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={saveItem}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <SafeIcon icon={FiCheck} className="text-sm" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <SafeIcon icon={FiX} className="text-sm" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm text-gray-700 flex-1">{item}</span>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => editItem(section.key, index)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <SafeIcon icon={FiEdit2} className="text-sm" />
                          </button>
                          <button
                            onClick={() => removeItem(section.key, index)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <SafeIcon icon={FiX} className="text-sm" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Add New Item Input */}
                {isEditing && editingIndex === 'new' && (
                  <div className="flex items-center space-x-2 bg-white p-3 rounded-md border-2 border-dashed border-gray-300">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={section.placeholder}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={saveItem}
                      className="p-1 text-green-600 hover:text-green-700"
                    >
                      <SafeIcon icon={FiCheck} className="text-sm" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <SafeIcon icon={FiX} className="text-sm" />
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {items.length === 0 && !isEditing && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-2">No {section.title.toLowerCase()} added yet</p>
                    <button
                      onClick={() => addItem(section.key)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add your first {section.title.toLowerCase()}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IdealCustomerProfile;