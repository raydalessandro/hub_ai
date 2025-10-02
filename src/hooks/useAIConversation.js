import { useState, useRef, useEffect } from 'react';
import { sendMessageToAI } from '../services/aiService';
import { getAIContext, getConversationHistory } from '../utils/contextUtils';

export const useAIConversation = (messages, addMessage, aiAgents, documents, setIsLoading) => {
  const [isAIConversation, setIsAIConversation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aiConversationTurns, setAiConversationTurns] = useState(0);
  const [autoMode, setAutoMode] = useState(true);
  const conversationTimeout = useRef(null);

  // Effetto che monitora quando può continuare la conversazione
  useEffect(() => {
    if (isAIConversation && autoMode && !isPaused && !setIsLoading) {
      // Controlla se può continuare
      const aiMessages = messages.filter(m => 
        m.sender !== 'human' && m.sender !== 'system'
      );
      
      // Se ci sono messaggi AI e siamo in auto mode, continua
      if (aiMessages.length > 0 && aiConversationTurns < 20) {
        if (conversationTimeout.current) {
          clearTimeout(conversationTimeout.current);
        }
        conversationTimeout.current = setTimeout(() => {
          continueAIConversation();
        }, 4000);
      }
    }

    return () => {
      if (conversationTimeout.current) {
        clearTimeout(conversationTimeout.current);
      }
    };
  }, [messages, isAIConversation, autoMode, isPaused]);

  const continueAIConversation = async () => {
    if (isPaused || !isAIConversation || !autoMode) return;

    const activeAgents = aiAgents.filter(a => a.active);
    
    if (activeAgents.length < 2) {
      console.error('Need at least 2 active AI agents');
      return;
    }

    setIsLoading(true);
    const [ai1, ai2] = activeAgents;
    
    try {
      // Determina quale AI deve parlare
      const aiMessages = messages.filter(m => 
        m.sender === ai1.id || m.sender === ai2.id
      );
      const lastAISender = aiMessages.length > 0 
        ? aiMessages[aiMessages.length - 1].sender 
        : null;
      
      const nextAI = !lastAISender || lastAISender === ai2.id ? ai1 : ai2;
      const previousAI = lastAISender === ai1.id ? ai1 : ai2;

      const context = getAIContext(nextAI, documents);
      
      // History completo
      const conversationHistory = messages
        .filter(m => m.sender !== 'system')
        .map(m => {
          if (m.sender === 'human') {
            return { role: 'user', content: `[Human]: ${m.content}` };
          } else if (m.sender === nextAI.id) {
            return { role: 'assistant', content: m.content };
          } else {
            return { role: 'user', content: `[${m.senderName}]: ${m.content}` };
          }
        });

      const lastMessage = messages.slice(-1)[0];
      
      let prompt;
      if (!lastMessage || (lastMessage.sender !== ai1.id && lastMessage.sender !== ai2.id)) {
        // Se non ci sono messaggi AI o l'ultimo è umano
        if (lastMessage && lastMessage.sender === 'human') {
          prompt = `${context}\n\nThe human just said: "${lastMessage.content}"\n\nYou are ${nextAI.name}. Respond to the human, then continue your discussion with ${previousAI.name}.`;
        } else {
          prompt = `${context}\n\nYou are ${nextAI.name}. Continue or start the discussion with ${previousAI.name} about innovative marketing strategies.`;
        }
      } else {
        // Conversazione AI-AI normale
        prompt = `${context}\n\nYou are ${nextAI.name}. ${previousAI.name} just said: "${lastMessage.content}"\n\nRespond naturally and continue the discussion.`;
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

      if (newTurnCount >= 20) {
        addMessage({
          id: Date.now() + 1,
          sender: 'system',
          senderName: 'System',
          content: '🎯 20 turns reached. Click "Auto" to continue or "Stop" to end.',
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
        content: '⚠️ Activate at least 2 AI agents first.',
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
      
      const initialPrompt = `${context}\n\nYou are ${ai1.name}. Start a professional discussion about innovative marketing strategies for a tech client.`;
      
      const response = await sendMessageToAI(ai1.id, initialPrompt, []);

      addMessage({
        id: Date.now(),
        sender: ai1.id,
        senderName: ai1.name,
        content: response,
        timestamp: new Date().toLocaleTimeString(),
        color: ai1.color
      });

      setAiConversationTurns(1);
      setIsLoading(false);

      // Il useEffect si occuperà di continuare
    } catch (error) {
      console.error('Error starting:', error);
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: `❌ ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-red-600'
      });
      setIsLoading(false);
    }
  };

  const stopAIConversation = () => {
    if (conversationTimeout.current) {
      clearTimeout(conversationTimeout.current);
    }
    setIsAIConversation(false);
    setIsPaused(false);
    setAutoMode(true);
    setAiConversationTurns(0);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleAutoMode = () => {
    setAutoMode(!autoMode);
    
    if (!autoMode && isAIConversation && !isPaused) {
      // Riattiva auto mode
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: '▶️ Auto mode resumed',
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-green-600'
      });
    } else if (autoMode) {
      // Disattiva auto mode
      if (conversationTimeout.current) {
        clearTimeout(conversationTimeout.current);
      }
      addMessage({
        id: Date.now(),
        sender: 'system',
        senderName: 'System',
        content: '⏸️ Auto mode paused',
        timestamp: new Date().toLocaleTimeString(),
        color: 'bg-yellow-600'
      });
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
    toggleAutoMode
  };
};
