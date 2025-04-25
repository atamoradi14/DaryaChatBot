import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatuiComponent } from './chatui/chatui.component';
import { Chatui2Component } from './chatui2/chatui2.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

export const routes: Routes = [
    { path: '', component: ChatbotComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'chatui', component: ChatuiComponent },
    { path: 'chatui2', component: Chatui2Component },
    { path: 'chatbot', component: ChatbotComponent}
];
