import { useState, useRef } from 'react';
import { sendMessageToAI } from '../services/aiService';
import { getAIContext, getConversationHistory } from '../utils/contextUtils';

export const useAIConversation = (messages, addMessage, aiAgents, documents, setIsLoading) => {
  const [isAIConversation, setIsAIConversation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aiConversationTurns, setAiConversationTurns] = useState(0);
  const conversationTimeout = useRef(null);

  const continueAIConversation = async () => {
    if (isPaused || !isAIConversation) return;

    setIsLoading(true);
    const activeAgents = aiAgents.filter(a => a.active);
    
    if (activeAgents.length < 2) {
      console.error('Need at least 2 active AI agents for conversation');
      setIsLoading(false);
      return;
    }

    const [ai1, ai2] = activeAgents;
    
    try {
      // Determina quale AI deve parlare (si alternano)
      const lastAISender = messages.filter(m => m.sender !== 'human').slice(-1)[0]?.sender;
      const nextAI = !lastAISender || lastAISender === ai2.id ? ai1 : ai2;
      const previousAI = lastAISender === ai1.id ? ai1 : ai2;

      const context = getAIContext(nextAI, documents);
      
      // Costruisci history SOLO con messaggi AI-AI (escludi umano durante conversazione)
      const aiOnlyMessages = messages.filter(m => {
        // Include solo messaggi delle AI durante la conversazione AI-AI
        return m.sender === ai1.id || m.sender === ai2.id;
      });
      
      const conversationHistory = aiOnlyMessages.map(m => ({
        role: m.sender === nextAI.id ? 'assistant' : 'user',
        content: m.content
      }));

      const lastMessage = messages.slice(-1)[0];
      
      let prompt;
      if (aiConversationTurns === 0) {
        // Primo messaggio - inizia la discussione
        prompt = `${context}\n\nYou are ${nextAI.name}, starting a professional discussion with ${previousAI.name} (a ${previousAI.role}) about marketing strategy for a tech client. Start the conversation by sharing your perspective on innovative marketing approaches.`;
      } else {
        // Messaggi successivi - rispondi all'altro AI
        prompt = `${context}\n\nYou are ${nextAI.name} in a professional discussion with ${previousAI.name}. ${previousAI.name} just said: "${lastMessage.content}"\n\nRespond directly to ${previousAI.name}'s point, building on what they said. Keep it conversational and collaborative.`;
      }

      const response = await sendMessageToAI(nextAI.id, prompt, conversationHistory);

      addMessage({
        id: Date.now(),
        sender: nextAI.id,
        senderName: nextAI.name,
        content: response,
        timestamp: new Date().toLocaleTimeString(),
        color: nextAI.color
      });

      const newTurnCount = aiConversationTurns + 1;
      setAiConversationTurns(newTurnCount);

      // Continua se non in pausa e non superato il limite
      if (!isPaused && isAIConversation && newTurnCount < 10) {
        conversationTimeout.current = setTimeout(() => continueAIConversation(), 3000);
      } else if (newTurnCount >= 10) {
        // Raggiunto limite turni
        addMessage({
          id: Date.now(),
          sender: 'system',
          senderName: 'System',
          content: 'AI conversation completed (10 turns reached). You can start a new one or continue the group chat.',
          timestamp: new Date().toLocaleTimeString(),
          color: 'bg-blue-600'
        });
        stopAIConversation();
      }
    } catch (error) {
      console.error('Error in AI conversation:', error);
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: `Error in AI conversation: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-red-600'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startAIConversation = async () => {
    const activeAgents = aiAgents.filter(a => a.active);
    
    if (activeAgents.length < 2) {
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: 'Please activate at least 2 AI agents to start an AI-to-AI conversation.',
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-red-600'
      });
      return;
    }

    setIsAIConversation(true);
    setAiConversationTurns(0);
    setIsLoading(true);

    try {
      const [ai1] = activeAgents;
      const topic = "innovative marketing strategies for a tech sector client";

      const context = getAIContext(ai1, documents);
      
      // Primo messaggio - solo contesto base
      const initialPrompt = `${context}\n\nYou are ${ai1.name}, starting a professional discussion about ${topic}. Share your initial perspective and invite collaboration.`;
      
      const response = await sendMessageToAI(ai1.id, initialPrompt, []);

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

      // Avvia la conversazione alternata
      conversationTimeout.current = setTimeout(() => continueAIConversation(), 3000);
    } catch (error) {
      console.error('Error starting AI conversation:', error);
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: `Error starting AI conversation: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-red-600'
      });
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
    if (isPaused && isAIConversation) {
      // Se riprende dalla pausa, continua la conversazione
      conversationTimeout.current = setTimeout(() => continueAIConversation(), 1000);
    }
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
