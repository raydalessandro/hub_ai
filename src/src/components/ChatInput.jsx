import React from 'react';
import { Send, Hand } from 'lucide-react';

const ChatInput = ({ 
  activeView, 
  inputMessage, 
  setInputMessage, 
  isLoading, 
  isAIConversation, 
  handleSendMessage 
}) => {
  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(activeView === 'ai-conversation' && isAIConversation)}
          placeholder={
            activeView === 'ai-conversation' && isAIConversation
              ? "Intervene in AI conversation..."
              : "Type your message..."
          }
          className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
        {activeView === 'ai-conversation' && isAIConversation ? (
          <button
            onClick={() => handleSendMessage(true)}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center gap-2"
          >
            <Hand size={18} />
            Intervene
          </button>
        ) : (
          <button
            onClick={() => handleSendMessage(false)}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
