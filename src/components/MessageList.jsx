import React from 'react';
import Message from './Message';

const MessageList = ({ messages, activeView, isLoading, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">
            {activeView === 'ai-conversation' 
              ? 'Click "Start AI Discussion" to watch AI agents converse'
              : 'Start a conversation below'}
          </p>
        </div>
      )}
      
      {messages.map((msg) => (
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

export default MessageList;
