export const getAIContext = (agent, documents) => {
  const agentDocs = documents.filter(d => d.assignedTo === agent.id || d.assignedTo === 'all');
  
  let context = `You are ${agent.name}, a ${agent.role} at Nodo432.com, an innovative marketing agency.

Your role: ${agent.role}

IMPORTANT: This is part of an ongoing conversation. Consider the full context of previous messages.
`;
  
  if (agentDocs.length > 0) {
    context += `\nRelevant documents:\n${agentDocs.map(d => `- ${d.name}: ${d.content}`).join('\n')}`;
  }
  
  return context;
};

export const getConversationHistory = (messages) => {
  return messages.map(m => ({
    role: m.sender === 'human' ? 'user' : 'assistant',
    content: `[${m.senderName || 'Human'}]: ${m.content}`
  }));
};
