import { useState, useRef } from 'react';
import { sendMessageToAI } from '../services/aiService';
import { getAIContext, getConversationHistory } from '../utils/contextUtils';

export const useAIConversation = (messages, addMessage, aiAgents, documents, setIsLoading) => {
  const [isAIConversation, setIsAIConversation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aiConversationTurns, setAiConversationTurns] = useState(0);
  const conversationTimeout = useRef(null);

  const continueAIConversation = async (apiKeys) => {
    if (isPaused || !isAIConversation) return;

    setIsLoading(true);
    const activeAgents = aiAgents.filter(a => a.active);
    const [ai1, ai2] = activeAgents;
    
    try {
      const lastAISender = messages.filter(m => m.sender !== 'human').slice(-1)[0]?.sender;
      const nextAI = lastAISender === ai1.id ? ai2 : ai1;
      const previousAI = lastAISender === ai1.id ? ai1 : ai2;

      const context = getAIContext(nextAI, documents);
      const conversationHistory = getConversationHistory(messages);
      
      const lastMessage = messages.slice(-1)[0];
      const prompt = `${context}\
\
You are in a discussion with ${previousAI.name}. ${previousAI.name} just said: \"${lastMessage.content}\"\
\
Respond naturally and continue the discussion.`;

      const response = await sendMessageToAI(nextAI.id, prompt, conversationHistory, apiKeys);

      addMessage({
        id: Date.now(),
        sender: nextAI.id,
        senderName: nextAI.name,
        content: response,
        timestamp: new Date().toLocaleTimeString(),
        color: nextAI.color
      });

      setAiConversationTurns(prev => prev + 1);

      if (!isPaused && isAIConversation && aiConversationTurns < 10) {
        conversationTimeout.current = setTimeout(() => continueAIConversation(apiKeys), 3000);
      }
    } catch (error) {
      console.error('Error in AI conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startAIConversation = async (apiKeys) => {
    setIsAIConversation(true);
    setAiConversationTurns(0);
    setIsLoading(true);

    try {
      const activeAgents = aiAgents.filter(a => a.active);
      const [ai1] = activeAgents;
const topic = "Discutete insieme la migliore strategia per una campagna marketing innovativa per un cliente del settore tech, considerando il contesto della conversazione fino ad ora.";
      const context = getAIContext(ai1, documents);
      const conversationHistory = getConversationHistory(messages);
      const initialPrompt = `${context}\
\
You are starting a focused discussion. Topic: ${topic}\
\
Start the conversation with your perspective.`;
      
      const response = await sendMessageToAI(ai1.id, initialPrompt, conversationHistory, apiKeys);

      addMessage({
        id: Date.now(),
        sender: ai1.id,
        senderName: ai1.name,
        content: response,
        timestamp: new Date().toLocaleTimeString(),
        color: ai1.color
      });

      setIsLoading(false);
      setAiConversationTurns(1);

      conversationTimeout.current = setTimeout(() => continueAIConversation(apiKeys), 3000);
    } catch (error) {
      console.error('Error starting AI conversation:', error);
      setIsLoading(false);
    }
  };

  const stopAIConversation = () => {
    setIsAIConversation(false);
    setIsPaused(false);
    setAiConversationTurns(0);
    if (conversationTimeout.current) {
      clearTimeout(conversationTimeout.current);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return {
    isAIConversation,
    isPaused,
    aiConversationTurns,
    startAIConversation,
    stopAIConversation,
    togglePause
  };
};
