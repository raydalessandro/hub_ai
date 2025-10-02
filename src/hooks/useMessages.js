import { useState } from 'react';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return { messages, addMessage, clearMessages, isLoading, setIsLoading };
};
