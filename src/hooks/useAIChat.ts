/**
 * React Hook for AI Chat
 */

import { useState, useCallback, useRef } from 'react';
import { sendChatMessage, ChatMessage, StreamChunk } from '@/lib/aiChatApi';

export interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  citations?: string[];
  timestamp: Date;
}

export function useAIChat() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamingMessageRef = useRef<string>('');
  const streamingIdRef = useRef<string>('');

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      setError(null);
      setIsLoading(true);

      // Add user message
      const userMsg: DisplayMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: userMessage.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Prepare conversation history for API
      const conversationHistory: ChatMessage[] = [
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        {
          role: 'user',
          content: userMessage.trim(),
        },
      ];

      // Create assistant message placeholder
      const assistantId = crypto.randomUUID();
      streamingIdRef.current = assistantId;
      streamingMessageRef.current = '';

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          isStreaming: true,
          timestamp: new Date(),
        },
      ]);

      // Stream the response
      await sendChatMessage(
        conversationHistory,
        // onChunk
        (chunk: StreamChunk) => {
          if (chunk.type === 'text' && chunk.content) {
            streamingMessageRef.current += chunk.content;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, content: streamingMessageRef.current }
                  : msg
              )
            );
          } else if (chunk.type === 'error') {
            setError(chunk.error || 'Virhe vastauksen käsittelyssä');
          }
        },
        // onComplete
        () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, isStreaming: false } : msg
            )
          );
          setIsLoading(false);
          streamingMessageRef.current = '';
        },
        // onError
        (error: Error) => {
          setError(error.message);
          setIsLoading(false);
          // Remove the failed assistant message
          setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
          streamingMessageRef.current = '';
        }
      );
    },
    [messages, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
