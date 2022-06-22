import { getGlobalConfig } from 'src/services';
import { APIRequest } from './api-request';

export class MessageService extends APIRequest {
  getConversations(query?: Record<string, any>) {
    return this.get(this.buildUrl('/conversations', query));
  }

  searchConversations(query?: Record<string, any>) {
    return this.get(this.buildUrl('/conversations/search', query));
  }

  createConversation(data: Record<string, string>) {
    return this.post('/conversations', data);
  }

  getConversationDetail(id: string) {
    return this.get(`/conversations/${id}`);
  }

  getMessages(conversationId: string, query?: Record<string, any>) {
    return this.get(this.buildUrl(`/messages/conversations/${conversationId}`, query));
  }

  sendMessage(conversationId: string, data: Record<string, any>) {
    return this.post(`/messages/conversations/${conversationId}`, data);
  }

  countTotalNotRead() {
    return this.get('/messages/counting-not-read-messages');
  }

  readAllInConversation(conversationId: string) {
    return this.post(`/messages/read-all/${conversationId}`);
  }

  getMessageUploadUrl() {
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/messages/private/file`;
  }
}

export const messageService = new MessageService();
