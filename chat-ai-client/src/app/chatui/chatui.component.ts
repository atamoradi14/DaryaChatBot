import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

@Component({
  selector: 'app-chatui',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatui.component.html',
  styleUrls: ['./chatui.component.css']
})
export class ChatuiComponent {
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

    const newMessage: ChatMessage = {
      role: 'user',
      content: this.userInput
    };
    this.messages.push(newMessage);
    this.userInput = '';
    this.saveHistory();

    setTimeout(() => {
      this.messages.push({
        role: 'bot',
        content: '🌠 Simulated response from the stars...'
      });
      this.saveHistory();
    }, 800);
  }

  saveHistory() {
    sessionStorage.setItem('chat-history', JSON.stringify(this.messages));
  }
}
