import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit2, FiCheck, FiX } = FiIcons;

const EditableField = ({ value, onSave, multiline = false, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (!multiline && e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        )}
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            <SafeIcon icon={FiCheck} className="mr-1" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            <SafeIcon icon={FiX} className="mr-1" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors ${className}`}
      onClick={handleEdit}
    >
      <div className="flex items-start justify-between">
        <span className={multiline ? 'whitespace-pre-wrap' : ''}>
          {value || 'Click to edit...'}
        </span>
        <SafeIcon 
          icon={FiEdit2} 
          className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" 
        />
      </div>
    </div>
  );
};

export default EditableField;