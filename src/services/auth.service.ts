import cookie from 'js-cookie';
import { ILogin, IFanRegister, IForgot } from 'src/interfaces';
import { APIRequest, TOKEN } from './api-request';

export class AuthService extends APIRequest {
  login(data: ILogin) {
    return this.post('/auth/login', data);
  }

  setToken(token: string, remember = false): void {
    // https://github.com/js-cookie/js-cookie
    // since Safari does not support, need a better solution
    const expired = { expires: !remember ? 1 : 365 };
    cookie.set(TOKEN, token, expired);
    this.setAuthHeaderToken(token);
  }

  getToken(): string {
    return cookie.get(TOKEN);
  }

  removeToken(): void {
    cookie.remove(TOKEN);
  }

  updatePassword(password: string, source = 'user') {
    return this.put('/auth/users/me/password', { password, source });
  }

  resetPassword(data: IForgot) {
    return this.post('/auth/users/forgot', data);
  }

  register(data: IFanRegister) {
    return this.post('/auth/users/register', data);
  }

  registerPerformer(documents: {
    file: File;
    fieldname: string;
  }[], data: any, onProgress?: Function) {
    return this.upload('/auth/performers/register', documents, {
      onProgress,
      customData: data
    });
  }

  resendVerificationEmail(data: {email: string}) {
    return this.post('/verification/resend', data);
  }
}

export const authService = new AuthService();
