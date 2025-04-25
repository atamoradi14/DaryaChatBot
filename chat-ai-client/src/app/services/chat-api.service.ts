// services/chat-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ChatHistoryDto, ChatResponse, ChatTurn } from '../Interfaces/chat-turn';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.apiUrl;
  }

  /** Send full history and get a single ChatResponse */
  send(turns: ChatTurn[]) {
    const dto: ChatHistoryDto = { turns };
    return this.http.post<ChatResponse>(`${this.apiUrl}/api/Chat`, dto);
  }

  /** Example of converting the Observable to a Promise if you prefer async/await */
  async sendAwait(turns: ChatTurn[]) {
    return await firstValueFrom(this.send(turns));
  }

  /** OPTIONAL: stream tokens with SSE/WebSocket */
  stream(turns: ChatTurn[]) {
    // depends on how you expose streaming on the backend
    return this.http.post(`${this.apiUrl}/api/Chat/stream`, turns, {
      responseType: 'text',  // SSE is text/event-stream
    });
  }
}
