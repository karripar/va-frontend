/**
 * AI Chat API Integration
 * Connects to the OpenAI Responses API via the proxy server
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamChunk {
  type: 'text' | 'tool_call' | 'error' | 'done';
  content?: string;
  tool?: {
    type: string;
    name?: string;
    status?: string;
  };
  error?: string;
}

/**
 * Send a message to the AI and get a streaming response
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  onChunk: (chunk: StreamChunk) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  const apiUrl =
    process.env.NEXT_PUBLIC_CHAT_API || 'http://localhost:3001/api/v1/ai/chat';

  try {
    const response = await fetch(`${apiUrl}/turn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        toolsState: {
          fileSearchEnabled: true,
          webSearchEnabled: false,
          codeInterpreterEnabled: false,
          vectorStore: process.env.NEXT_PUBLIC_VECTOR_STORE_ID
            ? {
                id: process.env.NEXT_PUBLIC_VECTOR_STORE_ID,
              }
            : undefined,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        const data = await response.json();
        throw new Error(
          data.message || 'Liikaa pyyntöjä. Yritä hetken kuluttua uudelleen.'
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    // Read the SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) continue;

        const data = line.slice(6); // Remove 'data: ' prefix

        console.log('[SSE DEBUG] Raw data:', data);

        if (data === '[DONE]') {
          onComplete();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          console.log('[SSE DEBUG] Parsed event:', parsed);

          // The backend wraps events in { event: type, data: actualData }
          const eventType = parsed.event || parsed.type;
          const eventData = parsed.data || parsed;

          // Handle different event types
          if (eventType === 'response.output_text.delta') {
            onChunk({
              type: 'text',
              content: eventData.delta || '',
            });
          } else if (eventType === 'response.output_text.done') {
            // Text output complete
            onChunk({ type: 'done' });
          } else if (eventType === 'rate_limit_error') {
            onChunk({
              type: 'error',
              error: eventData.error?.message || 'Liikaa pyyntöjä',
            });
          } else if (eventType === 'error') {
            onChunk({
              type: 'error',
              error:
                eventData.error?.message || 'Virhe vastauksen käsittelyssä',
            });
          } else if (eventType?.includes('tool_call')) {
            // Tool call events (file search, etc.)
            const toolType = eventType.split('.')[1]; // e.g., 'file_search_call'
            onChunk({
              type: 'tool_call',
              tool: {
                type: toolType,
                name: eventData.name,
                status: eventType.includes('done')
                  ? 'completed'
                  : 'in_progress',
              },
            });
          }
        } catch (parseError) {
          console.error('Error parsing SSE data:', parseError);
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}

/**
 * Format messages for display
 */
export function formatMessageForDisplay(content: string): string {
  // Basic markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/\n/g, '<br/>'); // Line breaks
}

/**
 * Extract citations from response
 */
export function extractCitations(content: string): string[] {
  const citations: string[] = [];
  const citationMatch = content.match(/Lähteet?:\s*([\s\S]*?)$/i);

  if (citationMatch) {
    const citationText = citationMatch[1];
    const lines = citationText.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && (trimmed.startsWith('-') || trimmed.startsWith('•'))) {
        citations.push(trimmed.replace(/^[-•]\s*/, ''));
      }
    }
  }

  return citations;
}
