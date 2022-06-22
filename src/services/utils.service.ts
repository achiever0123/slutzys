import { APIRequest } from './api-request';

export class UtilsService extends APIRequest {
  private _countries = [] as any;

  async countriesList() {
    if (this._countries.length) {
      return this._countries;
    }
    const resp = await this.get('/countries/list');
    this._countries = resp;
    return resp;
  }

  async statesList(countryCode: string) {
    const resp = await this.get(`/states/${countryCode}`);
    return resp;
  }

  async citiesList(countryCode: string, state: string) {
    const resp = await this.get(`/cities/${countryCode}/${state}`);
    return resp;
  }

  languagesList() {
    return this.get('/languages/list');
  }

  phoneCodesList() {
    return this.get('/phone-codes/list');
  }

  bodyInfo() {
    return this.get('/user-additional');
  }
}

export const utilsService = new UtilsService();
