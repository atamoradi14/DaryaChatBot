import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  image?: SafeUrl; // Use SafeUrl for sanitized URLs
}

@Component({
  selector: 'app-chatui2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatui2.component.html',
  styleUrls: ['./chatui2.component.css']
})
export class Chatui2Component {
  messages: ChatMessage[] = [];
  userInput: string = '';

  constructor(private sanitizer: DomSanitizer) {
    const stored = sessionStorage.getItem('chat-session');
    if (stored) {
      this.messages = JSON.parse(stored);
    }
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({ role: 'user', content: text });
    this.userInput = '';
    this.save();

    // Simulated bot reply
    setTimeout(() => {
      const reply: ChatMessage = {
        role: 'bot',
        content: 'Here is an image from the galaxy ✨',
        image: this.sanitizer.bypassSecurityTrustUrl('https://wallpaperaccess.com/full/3257597.jpg')
      };
      this.messages.push(reply);
      this.save();
      this.scrollToBottom();
    }, 800);

    this.scrollToBottom();
  }

  save() {
    sessionStorage.setItem('chat-session', JSON.stringify(this.messages));
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = document.getElementById('chat-scroll');
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }
}