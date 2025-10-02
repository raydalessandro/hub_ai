import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatArea = ({ 
  activeView,
  messages,
  inputMessage,
  setInputMessage,
  isLoading,
  isAIConversation,
  isPaused,
  setIsPaused,
  aiConversationTurns,
  aiAgents,
  handleSendMessage,
  startAIConversation,
  stopAIConversation,
  messagesEndRef
}) => {
  const filteredMessages = activeView.startsWith('private-') 
    ? messages.filter(m => {
        const aiId = activeView.replace('private-', '');
        return m.sender === 'human' || m.sender === aiId;
      })
    : messages;

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader 
        activeView={activeView}
        aiAgents={aiAgents}
        isAIConversation={isAIConversation}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        aiConversationTurns={aiConversationTurns}
        startAIConversation={startAIConversation}
        stopAIConversation={stopAIConversation}
        isLoading={isLoading}
      />

      <MessageList 
        messages={filteredMessages}
        activeView={activeView}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput 
        activeView={activeView}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        isAIConversation={isAIConversation}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatArea;
