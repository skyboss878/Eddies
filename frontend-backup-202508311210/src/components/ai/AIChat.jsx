// src/components/ai/AIChat.jsx - Chat component for /api/ai/chat endpoint
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, UserIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import { aiService } from '../../services/aiService';
import LoadingSpinner from '../LoadingSpinner';

const AIChat = ({ vehicleContext = null }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm Eddie, your AI automotive assistant. I can help with diagnostics, repair advice, cost estimates, and general automotive questions. What can I help you with today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await aiService.sendChatMessage({
        message: currentMessage,
        history: messages.slice(-10), // Last 10 messages for context
        vehicle_context: vehicleContext
      });

      if (response.success) {
        const assistantMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: response.timestamp || new Date().toISOString()
        };
        setMessages([...newMessages, assistantMessage]);
      } else {
        throw new Error(response.error || 'Failed to get AI response');
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared! How can I help you with your automotive needs?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-full">
            <CpuChipIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Eddie AI Assistant</h3>
            <p className="text-sm text-gray-600">Automotive Expert</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
        >
          Clear Chat
        </button>
      </div>

      {/* Vehicle Context Display */}
      {vehicleContext && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-800">
            Context: {vehicleContext.year} {vehicleContext.make} {vehicleContext.model}
            {vehicleContext.mileage && ` • ${vehicleContext.mileage} miles`}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-600' 
                  : message.isError
                  ? 'bg-red-500'
                  : 'bg-gray-600'
              }`}>
                {message.role === 'user' ? (
                  <UserIcon className="h-4 w-4 text-white" />
                ) : (
                  <CpuChipIcon className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.isError
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className={`text-xs mt-2 opacity-75 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <CpuChipIcon className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <LoadingSpinner size="small" />
                <span className="ml-2 text-sm text-gray-600">Eddie is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about diagnostics, repairs, estimates..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                height: 'auto',
                overflowY: currentMessage.split('\n').length > 3 ? 'scroll' : 'hidden'
              }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default AIChat;
