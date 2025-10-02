import React from 'react';
import { Users, User, FileText, Bot, Settings } from 'lucide-react';

const Sidebar = ({
  activeView,
  setActiveView,
  aiAgents,
  documents,
  messages,
  showDocuments,
  setShowDocuments,
  isAIConversation,
  onSettingsClick
}) => {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-purple-400">Nodo432</h1>
        <p className="text-xs text-gray-400">AI Communication Hub</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">CONVERSATIONS</h3>
          <button
            onClick={() => setActiveView('group')}
            className={`w-full flex items-center gap-2 p-2 rounded mb-1 transition ${
              activeView === 'group' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <Users size={18} />
            <span className="text-sm">Group Chat</span>
            <span className="ml-auto text-xs bg-gray-900 px-2 py-0.5 rounded">
              {messages.length}
            </span>
          </button>
          <button
            onClick={() => setActiveView('ai-conversation')}
            className={`w-full flex items-center gap-2 p-2 rounded mb-1 transition ${
              activeView === 'ai-conversation' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <Bot size={18} />
            <span className="text-sm">AI ↔ AI Watch</span>
            {isAIConversation && (
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">PRIVATE CHATS</h3>
          {aiAgents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setActiveView(`private-${agent.id}`)}
              className={`w-full flex items-center gap-2 p-2 rounded mb-1 transition ${
                activeView === `private-${agent.id}` ? 'bg-purple-600' : 'hover:bg-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${agent.color}`}></div>
              <User size={18} />
              <div className="flex-1 text-left">
                <div className="text-sm">{agent.name}</div>
                <div className="text-xs text-gray-400">{agent.role}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">MANAGEMENT</h3>
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition mb-1"
          >
            <FileText size={18} />
            <span className="text-sm">Documents ({documents.length})</span>
          </button>
          <button
            onClick={onSettingsClick}
            className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition"
          >
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>

      <div className="p-3 border-t border-gray-700">
        <h3 className="text-xs font-semibold text-gray-400 mb-2">AI AGENTS</h3>
        {aiAgents.map(agent => (
          <div key={agent.id} className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${agent.active ? agent.color : 'bg-gray-600'}`}></div>
            <span className="text-xs flex-1">{agent.name}</span>
            <span className="text-xs text-gray-500">{agent.active ? 'Active' : 'Idle'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
