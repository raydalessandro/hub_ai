export const sendMessageToAI = async (aiId, prompt, conversationHistory, apiKeys) => {
  if (aiId === 'claude') {
    return await sendMessageToClaude(prompt, conversationHistory, apiKeys.claude);
  } else if (aiId === 'deepseek') {
    return await sendMessageToDeepSeek(prompt, conversationHistory, apiKeys.deepseek);
  }
  throw new Error(`Unknown AI: ${aiId}`);
};

const sendMessageToClaude = async (prompt, conversationHistory = [], apiKey) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [...conversationHistory, { role: "user", content: prompt }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
};

const sendMessageToDeepSeek = async (prompt, conversationHistory = [], apiKey) => {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [...conversationHistory, { role: "user", content: prompt }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
};
