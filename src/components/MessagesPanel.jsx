import React, { useRef, useEffect } from 'react';
import Message from './Message';

const MessagesPanel = ({ messages, activeView, isLoading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredMessages = activeView.startsWith('private-') 
    ? messages.filter(m => {
        const aiId = activeView.replace('private-', '');
        return m.sender === 'human' || m.sender === aiId;
      })
    : messages;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {filteredMessages.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">
            {activeView === 'ai-conversation' 
              ? 'Click "Start AI Discussion" to watch AI agents converse'
              : 'Start a conversation below'}
          </p>
        </div>
      )}
      
      {filteredMessages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesPanel;
