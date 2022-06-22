import { getGlobalConfig } from 'src/services';
import { APIRequest } from './api-request';

export class UserService extends APIRequest {
  me(headers?: { [key: string]: string }) {
    return this.get('/users/me', headers);
  }

  updateMe(payload: any) {
    return this.put('/users', payload);
  }

  getAvatarUploadUrl(userId?: string) {
    if (userId) {
      return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/users/${userId}/avatar/upload`;
    }
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/users/avatar/upload`;
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/users/search', query));
  }

  findById(id: string) {
    return this.get(`/users/view/${id}`);
  }
}

export const userService = new UserService();
