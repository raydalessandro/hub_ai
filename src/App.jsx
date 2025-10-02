import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import DocumentPanel from './components/DocumentPanel';
import { sendMessageToClaude, sendMessageToDeepSeek } from './services/aiService';
import { getAIContext, getConversationHistory } from './utils/contextManager';

const App = () => {
  // State Management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeView, setActiveView] = useState('group');
  const [aiAgents, setAiAgents] = useState([
    { id: 'claude', name: 'Claude', role: 'Strategist', model: 'claude-sonnet-4-20250514', color: 'bg-purple-500', active: true },
    { id: 'deepseek', name: 'DeepSeek', role: 'Analyst', model: 'deepseek-chat', color: 'bg-blue-500', active: true }
  ]);
  const [isAIConversation, setIsAIConversation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aiConversationTurns, setAiConversationTurns] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({ claude: '', deepseek: '' });

  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Message Send
  const handleSendMessage = async (isIntervention = false) => {
    if (!inputMessage.trim() || isLoading) return;

    const newMessage = {
      id: Date.now(),
      sender: 'human',
      senderName: 'You',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      isIntervention: isIntervention
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (activeView === 'group' || isIntervention) {
        // Group conversation - all AI respond
        for (const agent of aiAgents.filter(a => a.active)) {
          const context = getAIContext(agent, documents);
          const conversationHistory = getConversationHistory(messages);

          let response;
          if (agent.id === 'claude') {
            response = await sendMessageToClaude(
              `${context}\n\nRespond naturally to the conversation. Latest message from Human: ${inputMessage}`,
              conversationHistory
            );
          } else {
            response = await sendMessageToDeepSeek(
              `${context}\n\nRespond to the conversation. Latest from Human: ${inputMessage}`,
              conversationHistory
            );
          }

          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: agent.id,
            senderName: agent.name,
            content: response,
            timestamp: new Date().toLocaleTimeString(),
            color: agent.color
          }]);

          await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (isIntervention && isAIConversation && !isPaused) {
          setTimeout(() => continueAIConversation(), 2000);
        }
      } else if (activeView.startsWith('private-')) {
        // Private chat
        const aiId = activeView.replace('private-', '');
        const agent = aiAgents.find(a => a.id === aiId);
        const context = getAIContext(agent, documents);
        const conversationHistory = getConversationHistory(messages);

        let response;
        if (aiId === 'claude') {
          response = await sendMessageToClaude(
            `${context}\n\nThis is a private conversation. Respond to: ${inputMessage}`,
            conversationHistory
          );
        } else {
          response = await sendMessageToDeepSeek(
            `${context}\n\nPrivate conversation. Respond to: ${inputMessage}`,
            conversationHistory
          );
        }

        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: aiId,
          senderName: agent.name,
          content: response,
          timestamp: new Date().toLocaleTimeString(),
          color: agent.color
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Continue AI Conversation
  const continueAIConversation = async () => {
    if (isPaused || !isAIConversation) return;

    setIsLoading(true);
    const [ai1, ai2] = aiAgents.filter(a => a.active);
    
    try {
      const lastAISender = messages.filter(m => m.sender !== 'human').slice(-1)[0]?.sender;
      const nextAI = lastAISender === ai1.id ? ai2 : ai1;
      const previousAI = lastAISender === ai1.id ? ai1 : ai2;

      const context = getAIContext(nextAI, documents);
      const conversationHistory = getConversationHistory(messages);
      
      const lastMessage = messages.slice(-1)[0];
      const prompt = `${context}\n\nYou are in a discussion with ${previousAI.name}. ${previousAI.name} just said: "${lastMessage.content}"\n\nRespond naturally and continue the discussion.`;

      let response;
      if (nextAI.id === 'claude') {
        response = await sendMessageToClaude(prompt, conversationHistory);
      } else {
        response = await sendMessageToDeepSeek(prompt, conversationHistory);
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: nextAI.id,
        senderName: nextAI.name,
        content: response,
        timestamp: new Date().toLocaleTimeString(),
        color: nextAI.color
      }]);

      setAiConversationTurns(prev => prev + 1);

      if (!isPaused && isAIConversation && aiConversationTurns < 10) {
        setTimeout(() => continueAIConversation(), 3000);
      }
    } catch (error) {
      console.error('Error in AI conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start AI Conversation
  const startAIConversation = async () => {
    if (isPaused || isLoading) return;
    
    setIsAIConversation(true);
    setAiConversationTurns(0);
    setIsLoading(true);

    try {
      const [ai1, ai2] = aiAgents.filter(a => a.active);
      const topic = "Discutete insieme la migliore strategia per una campagna marketing innovativa per un cliente del settore tech, considerando il contesto della conversazione fino ad ora.";

      const context1 = getAIContext(ai1, documents);
      const conversationHistory = getConversationHistory(messages);
      const initialPrompt = `${context1}\n\nYou are starting a focused discussion with ${ai2.name} (${ai2.role}). Topic: ${topic}\n\nStart the conversation with your perspective, considering what has been discussed so far.`;
      
      let response1;
      if (ai1.id === 'claude') {
        response1 = await sendMessageToClaude(initialPrompt, conversationHistory);
      } else {
        response1 = await sendMessageToDeepSeek(initialPrompt, conversationHistory);
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: ai1.id,
        senderName: ai1.name,
        content: response1,
        timestamp: new Date().toLocaleTimeString(),
        color: ai1.color
      }]);

      setIsLoading(false);
      setAiConversationTurns(1);

      setTimeout(() => continueAIConversation(), 3000);

    } catch (error) {
      console.error('Error in AI conversation:', error);
      setIsLoading(false);
    }
  };

  const stopAIConversation = () => {
    setIsAIConversation(false);
    setIsPaused(false);
    setAiConversationTurns(0);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        aiAgents={aiAgents}
        messages={messages}
        isAIConversation={isAIConversation}
        documents={documents}
        setShowDocuments={setShowDocuments}
      />
      
      <ChatArea 
        activeView={activeView}
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        isAIConversation={isAIConversation}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        aiConversationTurns={aiConversationTurns}
        aiAgents={aiAgents}
        handleSendMessage={handleSendMessage}
        startAIConversation={startAIConversation}
        stopAIConversation={stopAIConversation}
        messagesEndRef={messagesEndRef}
      />

      {showDocuments && (
        <DocumentPanel 
          documents={documents}
          setDocuments={setDocuments}
          aiAgents={aiAgents}
          setShowDocuments={setShowDocuments}
        />
      )}
    </div>
  );
};

export default App;
