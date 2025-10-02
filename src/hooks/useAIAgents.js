import { useState } from 'react';

const initialAgents = [
  { 
    id: 'claude', 
    name: 'Claude', 
    role: 'Strategist', 
    model: 'claude-sonnet-4-20250514', 
    color: 'bg-purple-500', 
    active: true 
  },
  { 
    id: 'deepseek', 
    name: 'DeepSeek', 
    role: 'Analyst', 
    model: 'deepseek-chat', 
    color: 'bg-blue-500', 
    active: true 
  }
];

export const useAIAgents = () => {
  const [aiAgents, setAiAgents] = useState(initialAgents);

  const updateAgent = (agentId, updates) => {
    setAiAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  };

  const addAgent = (agent) => {
    setAiAgents(prev => [...prev, agent]);
  };

  return { aiAgents, updateAgent, addAgent };
};
