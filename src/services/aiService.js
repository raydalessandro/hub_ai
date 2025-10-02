const BACKEND_URL = 'http://localhost:3001';

export const sendMessageToAI = async (aiId, prompt, conversationHistory) => {
  if (aiId === 'claude') {
    return await sendMessageToClaude(prompt, conversationHistory);
  } else if (aiId === 'deepseek') {
    return await sendMessageToDeepSeek(prompt, conversationHistory);
  }
  throw new Error(`Unknown AI: ${aiId}`);
};

const sendMessageToClaude = async (prompt, conversationHistory = []) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [...conversationHistory, { role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Claude API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude via backend:', error);
    throw error;
  }
};

const sendMessageToDeepSeek = async (prompt, conversationHistory = []) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/deepseek`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [...conversationHistory, { role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek via backend:', error);
    throw error;
  }
};
