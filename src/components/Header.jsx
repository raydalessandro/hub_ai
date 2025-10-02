import React from 'react';
import { Pause, Play, X, MessageSquare, Zap, ZapOff } from 'lucide-react';

const Header = ({
  activeView,
  aiAgents,
  isAIConversation,
  isPaused,
  autoMode,
  aiConversationTurns,
  onTogglePause,
  onToggleAutoMode,
  onStopConversation,
  onStartConversation,
  isLoading
}) => {
  const getTitle = () => {
    if (activeView === 'group') return 'Group Conversation';
    if (activeView === 'ai-conversation') return 'AI-to-AI Conversation';
    if (activeView.startsWith('private-')) {
      const agent = aiAgents.find(a => a.id === activeView.replace('private-', ''));
      return `Private Chat: ${agent?.name}`;
    }
    return '';
  };

  const getSubtitle = () => {
    if (activeView === 'group') return 'Collaborate with all AI agents';
    if (activeView === 'ai-conversation') {
      if (!isAIConversation) return 'Start or observe AI agents discussing';
      const modeText = autoMode ? '🤖 Auto Mode' : '✋ Manual Mode';
      return `${modeText} - Turn ${aiConversationTurns}/20`;
    }
    if (activeView.startsWith('private-')) return 'One-on-one conversation (other AIs cannot see this)';
    return '';
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{getTitle()}</h2>
        <p className="text-xs text-gray-400">{getSubtitle()}</p>
      </div>
      
      {activeView === 'ai-conversation' && (
        <div className="flex gap-2">
          {isAIConversation ? (
            <>
              <button
                onClick={onToggleAutoMode}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  autoMode 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
                title={autoMode ? 'Switch to Manual Mode' : 'Switch to Auto Mode'}
              >
                {autoMode ? <Zap size={18} /> : <ZapOff size={18} />}
                {autoMode ? 'Auto' : 'Manual'}
              </button>
              <button
                onClick={onTogglePause}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={onStopConversation}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2"
              >
                <X size={18} />
                Stop
              </button>
            </>
          ) : (
            <button
              onClick={onStartConversation}
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

export default Header;
