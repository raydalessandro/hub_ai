export const sendMessageToClaude = async (prompt, conversationHistory = []) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [...conversationHistory, { role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return 'Error: Unable to reach Claude API';
  }
};

export const sendMessageToDeepSeek = async (prompt, conversationHistory = []) => {
  // TODO: Implement real DeepSeek API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[DeepSeek Response] Analizzando: "${prompt.substring(0, 50)}..."\n\nCome analista, considero:\n- Dati quantitativi\n- Pattern identificabili\n- Insight basati su evidenze`);
    }, 1500);
  });
};
