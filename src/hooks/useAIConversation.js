import { useState, useRef } from 'react';
import { sendMessageToAI } from '../services/aiService';
import { getAIContext, getConversationHistory } from '../utils/contextUtils';

export const useAIConversation = (messages, addMessage, aiAgents, documents, setIsLoading) => {
  const [isAIConversation, setIsAIConversation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aiConversationTurns, setAiConversationTurns] = useState(0);
  const [autoMode, setAutoMode] = useState(true); // Nuova: modalità automatica
  const conversationTimeout = useRef(null);

  const continueAIConversation = async () => {
    if (isPaused || !isAIConversation || !autoMode) return;

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
      const aiMessages = messages.filter(m => m.sender === ai1.id || m.sender === ai2.id);
      const lastAISender = aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].sender : null;
      const nextAI = !lastAISender || lastAISender === ai2.id ? ai1 : ai2;
      const previousAI = lastAISender === ai1.id ? ai1 : ai2;

      const context = getAIContext(nextAI, documents);
      
      // Costruisci history completo ma con ruoli corretti
      const conversationHistory = messages
        .filter(m => m.sender !== 'system')
        .map(m => {
          if (m.sender === 'human') {
            return { role: 'user', content: `[Human intervened]: ${m.content}` };
          } else if (m.sender === nextAI.id) {
            return { role: 'assistant', content: m.content };
          } else {
            return { role: 'user', content: `[${m.senderName}]: ${m.content}` };
          }
        });

      const lastMessage = messages.slice(-1)[0];
      
      let prompt;
      if (aiConversationTurns === 0 && (!lastMessage || lastMessage.sender !== 'human')) {
        // Primo messaggio - inizia la discussione
        prompt = `${context}\n\nYou are ${nextAI.name}, starting a professional discussion with ${previousAI.name} (a ${previousAI.role}) about innovative marketing strategies for a tech client. Start the conversation naturally.`;
      } else if (lastMessage && lastMessage.sender === 'human') {
        // Ultima cosa era un intervento umano - rispondi all'umano
        prompt = `${context}\n\nThe human just intervened in your discussion with ${previousAI.name}. They said: "${lastMessage.content}"\n\nRespond to the human's point, then naturally bring ${previousAI.name} back into the conversation.`;
      } else {
        // Conversazione normale AI-AI
        prompt = `${context}\n\nYou are ${nextAI.name} in discussion with ${previousAI.name}. ${previousAI.name} just said: "${lastMessage.content}"\n\nRespond directly to their point and continue the discussion naturally.`;
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

      // Continua automaticamente se in auto mode
      if (!isPaused && isAIConversation && autoMode && newTurnCount < 20) {
        conversationTimeout.current = setTimeout(() => continueAIConversation(), 4000);
      } else if (newTurnCount >= 20) {
        addMessage({
          id: Date.now(),
          sender: 'system',
          senderName: 'System',
          content: '🎯 AI conversation reached 20 turns. Click "Resume Auto" to continue or "Stop" to end.',
          timestamp: new Date().toLocaleTimeString(),
          color: 'bg-blue-600'
        });
        setAutoMode(false);
      }
    } catch (error) {
      console.error('Error in AI conversation:', error);
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: `❌ Error: ${error.message}`,
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
        content: '⚠️ Please activate at least 2 AI agents to start an AI-to-AI conversation.',
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-red-600'
      });
      return;
    }

    setIsAIConversation(true);
    setAutoMode(true);
    setAiConversationTurns(0);
    setIsLoading(true);

    try {
      const [ai1] = activeAgents;
      const context = getAIContext(ai1, documents);
      
      const initialPrompt = `${context}\n\nYou are ${ai1.name}, starting a professional discussion about innovative marketing strategies for a tech client. Share your initial perspective naturally.`;
      
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

      // Avvia la conversazione automatica
      conversationTimeout.current = setTimeout(() => continueAIConversation(), 4000);
    } catch (error) {
      console.error('Error starting AI conversation:', error);
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: `❌ Error starting: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-red-600'
      });
      setIsLoading(false);
    }
  };

  const stopAIConversation = () => {
    setIsAIConversation(false);
    setIsPaused(false);
    setAutoMode(true);
    setAiConversationTurns(0);
    if (conversationTimeout.current) {
      clearTimeout(conversationTimeout.current);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused && isAIConversation && autoMode) {
      // Riprende dalla pausa
      conversationTimeout.current = setTimeout(() => continueAIConversation(), 1000);
    }
  };

  const toggleAutoMode = () => {
    const newAutoMode = !autoMode;
    setAutoMode(newAutoMode);
    
    if (newAutoMode && isAIConversation && !isPaused) {
      // Riattiva modalità automatica
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: '▶️ Auto mode resumed - AIs will continue conversing automatically',
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-green-600'
      });
      conversationTimeout.current = setTimeout(() => continueAIConversation(), 2000);
    } else if (!newAutoMode) {
      // Disattiva modalità automatica
      if (conversationTimeout.current) {
        clearTimeout(conversationTimeout.current);
      }
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: '⏸️ Auto mode paused - AIs will wait for your intervention',
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-yellow-600'
      });
    }
  };

  const resumeAfterIntervention = () => {
    if (isAIConversation && !autoMode) {
      setAutoMode(true);
      conversationTimeout.current = setTimeout(() => continueAIConversation(), 2000);
    }
  };

  return {
    isAIConversation,
    isPaused,
    autoMode,
    aiConversationTurns,
    startAIConversation,
    stopAIConversation,
    togglePause,
    toggleAutoMode,
    resumeAfterIntervention
  };
};
