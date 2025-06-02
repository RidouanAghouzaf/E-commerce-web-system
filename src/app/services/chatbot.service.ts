// chatbot.service.ts
import { Injectable } from '@angular/core';
import { SessionsClient } from '@google-cloud/dialogflow';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private sessionClient: any;
  private sessionPath: string;

  constructor() {
    this.sessionClient = new SessionsClient({
      keyFilename: 'path/to/your/service-account.json'
    });
    this.sessionPath = this.sessionClient.projectAgentSessionPath(
      'your-project-id',
      'unique-session-id'
    );
  }

  async sendMessage(message: string) {
    const request = {
      session: this.sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    const responses = await this.sessionClient.detectIntent(request);
    return responses[0].queryResult.fulfillmentText;
  }
}