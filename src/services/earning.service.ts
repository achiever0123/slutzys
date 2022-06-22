import { APIRequest } from './api-request';

export class EarningService extends APIRequest {
  performerStarts(param?: any) {
    return this.get(this.buildUrl('/earning/performer/stats', param));
  }

  performerSearch(param?: any) {
    return this.get(this.buildUrl('/earning/performer/search', param));
  }
}

export const earningService = new EarningService();
