import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MessagesPanel from './components/MessagesPanel';
import InputArea from './components/InputArea';
import DocumentsPanel from './components/DocumentsPanel';
import SettingsModal from './components/SettingsModal';
import { useMessages } from './hooks/useMessages';
import { useAIAgents } from './hooks/useAIAgents';
import { useDocuments } from './hooks/useDocuments';
import { useAIConversation } from './hooks/useAIConversation';

const App = () => {
  const [activeView, setActiveView] = useState('group');
  const [showDocuments, setShowDocuments] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { messages, addMessage, isLoading, setIsLoading } = useMessages();
  const { aiAgents, updateAgent } = useAIAgents();
  const { documents, addDocument, assignDocument } = useDocuments();
  const {
    isAIConversation,
    isPaused,
    autoMode,
    aiConversationTurns,
    startAIConversation,
    stopAIConversation,
    togglePause,
    toggleAutoMode
  } = useAIConversation(messages, addMessage, aiAgents, documents, setIsLoading);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        aiAgents={aiAgents}
        documents={documents}
        messages={messages}
        showDocuments={showDocuments}
        setShowDocuments={setShowDocuments}
        isAIConversation={isAIConversation}
        onSettingsClick={() => setShowSettings(true)}
      />

      <div className="flex-1 flex flex-col">
        <Header
          activeView={activeView}
          aiAgents={aiAgents}
          isAIConversation={isAIConversation}
          isPaused={isPaused}
          autoMode={autoMode}
          aiConversationTurns={aiConversationTurns}
          onTogglePause={togglePause}
          onToggleAutoMode={toggleAutoMode}
          onStopConversation={stopAIConversation}
          onStartConversation={startAIConversation}
          isLoading={isLoading}
        />

        <MessagesPanel
          messages={messages}
          activeView={activeView}
          isLoading={isLoading}
        />

        <InputArea
          activeView={activeView}
          isAIConversation={isAIConversation}
          autoMode={autoMode}
          isLoading={isLoading}
          messages={messages}
          aiAgents={aiAgents}
          documents={documents}
          addMessage={addMessage}
          setIsLoading={setIsLoading}
          onStopAutoMode={toggleAutoMode}
        />
      </div>

      {showDocuments && (
        <DocumentsPanel
          documents={documents}
          aiAgents={aiAgents}
          onClose={() => setShowDocuments(false)}
          onUpload={addDocument}
          onAssign={assignDocument}
        />
      )}

      {showSettings && (
        <SettingsModal
          aiAgents={aiAgents}
          updateAgent={updateAgent}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
