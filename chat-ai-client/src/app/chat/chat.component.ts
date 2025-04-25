import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: ChatMessage[] = [];
  userInput: string = '';

  constructor() {
    const saved = sessionStorage.getItem('chat-history');
    if (saved) {
      this.messages = JSON.parse(saved);
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: this.userInput
    };
    this.messages.push(userMsg);
    this.userInput = '';
    this.saveHistory();

    // Simulate bot response
    setTimeout(() => {
      this.messages.push({
        role: 'bot',
        content: '🤖 This is a simulated AI response.'
      });
      this.saveHistory();
    }, 600);
  }

  saveHistory(): void {
    sessionStorage.setItem('chat-history', JSON.stringify(this.messages));
  }
}
