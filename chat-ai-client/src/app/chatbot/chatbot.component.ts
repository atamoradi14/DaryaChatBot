import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { ChatApiService } from '../services/chat-api.service';
import { ChatResponse, ChatTurn } from '../Interfaces/chat-turn';

interface ChatMessage {
  sender: 'user' | 'bot';
  text?: string;
  imageUrl?: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone : true,
  imports    : [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls  : ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  private chatApi = inject(ChatApiService);

  // --- UI state -------------------------------------------------------------
  messages: ChatMessage[] = [];
  userInput = '';
  isGenerating = false;

  // --- initialise from sessionStorage --------------------------------------
  ngOnInit() {
    const saved = sessionStorage.getItem('cosmos-history');
    if (saved) {
      this.messages = JSON.parse(saved);
    } else {
      this.messages = [{
        sender: 'bot',
        text  : 'Hi —I’m CosmosBot 🌌.  How can I help you today?',
        timestamp: new Date()
      }];
    }
  }

  // --- hotkey: Shift+Enter for newline, Enter for send ----------------------
  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(evt: KeyboardEvent) {
    if (!evt.shiftKey) {
      evt.preventDefault();
      this.sendMessage();
    }
  }

  // --- main send ------------------------------------------------------------
  sendMessage() {
    const text = this.userInput.trim();
    if (!text) { return; }

    // push local user message
    this.messages.push({ sender: 'user', text, timestamp: new Date() });
    this.userInput = '';
    this.scrollToBottom();
    this.persist();

    // build history → ChatTurn[]
    const turns: ChatTurn[] = this.messages.map(m => ({
      role   : m.sender === 'user' ? 'user' : 'assistant',
      content: m.text ?? ''
    }));

    // call API
    this.isGenerating = true;
    this.chatApi.send(turns).subscribe({
      next: (resp: ChatResponse) => {
        this.messages.push({
          sender    : 'bot',
          text      : resp.text,
          imageUrl  : resp.imageUrl ?? undefined,
          timestamp : new Date(resp.timestamp)
        });
        this.isGenerating = false;
        this.scrollToBottom();
        this.persist();
      },
      error: err => {
        console.error(err);
        this.isGenerating = false;
      }
    });
  }

  // --- helpers --------------------------------------------------------------
  private scrollToBottom() {
    setTimeout(() => {
      const el = document.getElementById('chat-scroll-container');
      if (el) { el.scrollTop = el.scrollHeight; }
    });
  }

  private persist() {
    sessionStorage.setItem('cosmos-history', JSON.stringify(this.messages));
  }
}
