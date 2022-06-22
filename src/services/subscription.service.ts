import { APIRequest } from './api-request';

class SubscriptionService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/subscriptions/performer/search', query));
  }

  userSearch(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/subscriptions/user/search', query));
  }
}
export const subscriptionService = new SubscriptionService();
