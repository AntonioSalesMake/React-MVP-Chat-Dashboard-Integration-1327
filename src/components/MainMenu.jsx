import React, { useState, useRef, useEffect } from 'react';
import SafeIcon from '../common/SafeIcon';
import UserManagement from './UserManagement';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiSettings, FiLink, FiUsers, FiX, FiChevronRight } = FiIcons;

const MainMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      id: 'settings',
      title: 'Settings',
      icon: FiSettings,
      description: 'Configure app preferences',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: FiLink,
      description: 'Connect external services',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'user-management',
      title: 'User Management',
      icon: FiUsers,
      description: 'Invite clients & assign specialists',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  const handleMenuItemClick = (itemId) => {
    if (itemId === 'user-management') {
      setShowUserManagement(true);
    } else {
      console.log(`Clicked: ${itemId}`);
      // TODO: Implement other menu functionality
    }
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Menu Button */}
        <button
          onClick={toggleMenu}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
            isOpen 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
          aria-label="Main menu"
        >
          <SafeIcon 
            icon={isOpen ? FiX : FiMenu} 
            className="text-lg transition-transform duration-200" 
          />
        </button>

        {/* Menu Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            {/* Menu Panel */}
            <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">Main Menu</h3>
                <p className="text-xs text-gray-500 mt-1">Access settings and tools</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left transition-colors ${item.hoverColor} group`}
                  >
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${item.bgColor} mr-3 group-hover:scale-105 transition-transform`}>
                      <SafeIcon icon={item.icon} className={`text-lg ${item.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <SafeIcon 
                      icon={FiChevronRight} 
                      className="text-gray-400 group-hover:text-gray-600 transition-colors" 
                    />
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  SalesMake Dashboard v1.0
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Management Modal */}
      {showUserManagement && (
        <UserManagement onClose={() => setShowUserManagement(false)} />
      )}
    </>
  );
};

export default MainMenu;