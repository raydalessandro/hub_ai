import React from 'react';
import { Pause, Play, X, MessageSquare } from 'lucide-react';

const ChatHeader = ({ 
  activeView, 
  aiAgents, 
  isAIConversation, 
  isPaused, 
  setIsPaused, 
  aiConversationTurns,
  startAIConversation,
  stopAIConversation,
  isLoading
}) => {
  const getTitle = () => {
    if (activeView === 'group') return 'Group Conversation';
    if (activeView === 'ai-conversation') return 'AI-to-AI Conversation';
    if (activeView.startsWith('private-')) {
      const agent = aiAgents.find(a => a.id === activeView.replace('private-', ''));
      return `Private Chat: ${agent?.name}`;
    }
    return 'Conversation';
  };

  const getSubtitle = () => {
    if (activeView === 'group') return 'Collaborate with all AI agents';
    if (activeView === 'ai-conversation') {
      return isAIConversation 
        ? `AI Discussion in progress (Turn ${aiConversationTurns}/10)`
        : 'Start or observe AI agents discussing';
    }
    return 'One-on-one conversation (other AIs cannot see this)';
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{getTitle()}</h2>
        <p className="text-xs text-gray-400">{getSubtitle()}</p>
      </div>
      
      {activeView === 'ai-conversation' && (
        <div className="flex gap-2">
          {isAIConversation && (
            <>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={stopAIConversation}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2"
              >
                <X size={18} />
                Stop
              </button>
            </>
          )}
          {!isAIConversation && (
            <button
              onClick={startAIConversation}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center gap-2"
              disabled={isLoading}
            >
              <MessageSquare size={18} />
              Start AI Discussion
            </button>
          )}
        </div>
      )}
    </div>
  );
};
