import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';
import { ChatMessage } from '../types';

const INACTIVITY_MS = 30 * 60 * 1000;

export function useChatSession(instanceKey: string = 'default') {
  const SESSION_KEY = `viabilityChat_${instanceKey}`;

  const [history, setHistory] = useState<ChatMessage[]>(() => {
    const saved = getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setItem(SESSION_KEY, JSON.stringify(history));
  }, [history, SESSION_KEY]);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeItem(SESSION_KEY);
      setHistory([]);
    }, INACTIVITY_MS);
    return () => clearTimeout(timer);
  }, [history, SESSION_KEY]);

  const addMessage = useCallback((role: ChatMessage['role'], text: string) => {
    setHistory(prev => [...prev, { role, text, timestamp: Date.now() }]);
  }, []);

  const clear = useCallback(() => {
    removeItem(SESSION_KEY);
    setHistory([]);
  }, [SESSION_KEY]);

  return { history, addMessage, clear };
}