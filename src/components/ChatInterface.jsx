import React, { useState, useRef, useEffect } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSend, FiUser, FiMessageCircle } = FiIcons;

const ChatInterface = ({ progress, onProgressUpdate }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to SalesMake! I am your SalesMake assistant.",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const progressSteps = [
    { value: 20, message: "✅ Onboarding document has been completed and reviewed." },
    { value: 40, message: "✅ Mailboxes are now warming up to ensure optimal deliverability." },
    { value: 60, message: "✅ Email templates have been created and are ready for your review and approval." },
    { value: 80, message: "✅ Sample prospect list has been created and validated." },
    { value: 100, message: "🚀 Campaigns are now live! Your outreach is actively running." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for progress updates and add notifications
  useEffect(() => {
    if (progress > 0) {
      const completedSteps = progressSteps.filter(step => progress >= step.value);
      const currentMessages = messages.filter(msg => !msg.isProgressNotification);
      const existingNotifications = messages.filter(msg => msg.isProgressNotification);

      // Only add new notifications for steps not already notified
      const newNotifications = completedSteps.filter(step => 
        !existingNotifications.some(notification => notification.stepValue === step.value)
      );

      if (newNotifications.length > 0) {
        const notificationMessages = newNotifications.map((step, index) => ({
          id: Date.now() + index,
          text: step.message,
          sender: 'assistant',
          timestamp: new Date(),
          isProgressNotification: true,
          stepValue: step.value
        }));

        setMessages(prev => [...prev, ...notificationMessages]);
      }
    }
  }, [progress]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantResponse = {
        id: Date.now() + 1,
        text: "Thanks for your message! I'll help you with that right away.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantResponse]);
    }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center space-x-3">
        <SafeIcon icon={FiMessageCircle} className="text-xl" />
        <h2 className="text-lg font-semibold">Project Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.isProgressNotification
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <SafeIcon icon={FiUser} className="text-sm opacity-70" />
                <span className="text-xs opacity-70">
                  {message.sender === 'user' ? 'You' : 'SalesMake Assistant'}
                </span>
                <span className="text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <SafeIcon icon={FiSend} className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;