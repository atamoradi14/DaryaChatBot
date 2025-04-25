// models/chat-turn.ts
export interface ChatTurn {
    role: 'user' | 'assistant';
    content: string;
  }
  
  // models/chat-history-dto.ts
  export interface ChatHistoryDto {
    turns: ChatTurn[];
  }
  
  // models/chat-response.ts
  export interface ChatResponse {
    sender: 'bot';
    text?: string;
    imageUrl?: string;
    timestamp: string;
  }
  