import { APIRequest } from './api-request';

class PayoutRequestService extends APIRequest {
  calculate(payload: any) {
    return this.post('/payout-requests/performer/calculate', payload);
  }

  stats() {
    return this.post('/payout-requests/performer/stats');
  }

  search(query: { [key: string]: any }) {
    return this.get(this.buildUrl('/payout-requests/performer/search', query));
  }

  create(body: any) {
    return this.post('/payout-requests/performer', body);
  }

  update(id: string, body: any) {
    return this.put(`/payout-requests/performer/${id}`, body);
  }

  detail(
    id: string,
    headers: {
      [key: string]: string;
    }
  ): Promise<any> {
    return this.get(`/payout-requests/performer/${id}/view`, headers);
  }
}

export const payoutRequestService = new PayoutRequestService();
