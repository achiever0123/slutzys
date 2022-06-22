import { getGlobalConfig } from 'src/services';
import { APIRequest } from './api-request';

export class PerformerService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/performers/search', query));
  }

  me(headers?: { [key: string]: string }) {
    return this.get('/performers/me', headers);
  }

  findOne(id: string, headers?: { [key: string]: string }) {
    return this.get(`/performers/${encodeURI(id)}`, headers);
  }

  getAvatarUploadUrl() {
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/performers/avatar/upload`;
  }

  getCoverUploadUrl() {
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/performers/cover/upload`;
  }

  getVideoUploadUrl() {
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/performers/welcome-video/upload`;
  }

  updateMe(id: string, payload: any) {
    return this.put(`/performers/${id}`, payload);
  }

  checkSubscribe(id: string) {
    return this.post(`/performers/${id}/check-subscribe`);
  }

  updateBanking(id: string, payload: any) {
    return this.put(`/performers/${id}/banking-settings`, payload);
  }

  updatePaymentGateway(id, payload) {
    return this.put(`/performers/${id}/payment-gateway-settings`, payload);
  }

  getDocumentUploadUrl() {
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/performers/documents/upload`;
  }
}

export const performerService = new PerformerService();
