import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit2 } = FiIcons;

const StatCard = ({ icon, title, value, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const handleSave = () => {
    onUpdate(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <SafeIcon icon={icon} className="text-blue-600 text-lg" />
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <SafeIcon icon={FiEdit2} className="text-sm" />
          </button>
        )}
      </div>
      
      <h4 className="text-sm text-gray-600 mb-1">{title}</h4>
      
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-2 py-1 text-lg font-bold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex space-x-1">
            <button
              onClick={handleSave}
              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p 
          className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleEdit}
        >
          {value}
        </p>
      )}
    </div>
  );
};

export default StatCard;