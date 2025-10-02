import React, { useState } from 'react';
import { Send, Hand } from 'lucide-react';
import { sendMessageToAI } from '../services/aiService';
import { getAIContext, getConversationHistory } from '../utils/contextUtils';

const InputArea = ({
  activeView,
  isAIConversation,
  autoMode,
  isLoading,
  messages,
  aiAgents,
  documents,
  addMessage,
  setIsLoading,
  onToggleAutoMode
}) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async (isIntervention = false) => {
    if (!inputMessage.trim() || isLoading) return;

    // Se intervieni in auto mode, NON disattivare - lascia che continui
    const newMessage = {
      id: Date.now(),
      sender: 'human',
      senderName: 'You',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      isIntervention: isIntervention
    };

    addMessage(newMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (activeView === 'group' || isIntervention) {
        for (const agent of aiAgents.filter(a => a.active)) {
          const context = getAIContext(agent, documents);
          const conversationHistory = getConversationHistory(messages);

          const response = await sendMessageToAI(
            agent.id,
            `${context}\n\nHuman said: ${inputMessage}\n\nRespond naturally.`,
            conversationHistory
          );

          addMessage({
            id: Date.now() + Math.random(),
            sender: agent.id,
            senderName: agent.name,
            content: response,
            timestamp: new Date().toLocaleTimeString(),
            color: agent.color
          });

          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Dopo l'intervento, se era auto mode, continuerà automaticamente
      } else if (activeView.startsWith('private-')) {
        const aiId = activeView.replace('private-', '');
        const agent = aiAgents.find(a => a.id === aiId);
        const context = getAIContext(agent, documents);
        const conversationHistory = getConversationHistory(messages);

        const response = await sendMessageToAI(
          aiId,
          `${context}\n\nPrivate chat. Human: ${inputMessage}`,
          conversationHistory
        );

        addMessage({
          id: Date.now(),
          sender: aiId,
          senderName: agent.name,
          content: response,
          timestamp: new Date().toLocaleTimeString(),
          color: agent.color
        });
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: `Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-red-600'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showInterventionButton = activeView === 'ai-conversation' && isAIConversation;
  const isInputDisabled = showInterventionButton && autoMode && isLoading;

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isInputDisabled && handleSendMessage(showInterventionButton)}
          placeholder={
            showInterventionButton
              ? autoMode 
                ? "Intervene anytime (AIs will continue after)..."
                : "Type to respond (click Auto to resume)..."
              : "Type your message..."
          }
          className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading && !showInterventionButton}
        />
        {showInterventionButton ? (
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
      {showInterventionButton && autoMode && (
        <p className="text-xs text-gray-400 mt-2">
          💡 Auto mode is ON - AIs are conversing automatically. You can intervene anytime!
        </p>
      )}
    </div>
  );
};

export default InputArea;
