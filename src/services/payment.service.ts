import { APIRequest } from './api-request';

export class PaymentService extends APIRequest {
  subscribe(payload: any) {
    return this.post('/payment/subscribe/performers', payload);
  }

  getListTransactions(payload) {
    return this.get(this.buildUrl('/payment/transactions', payload));
  }

  userSearchTransactions(payload) {
    return this.get(this.buildUrl('/transactions/user/search', payload));
  }

  purchaseVideo(payload) {
    return this.post('/payment/purchase-video', payload);
  }

  purchaseProducts(products: any) {
    return this.post('/payment/purchase-products', products);
  }

  applyCoupon(code: any) {
    return this.post(`/coupons/${code}/apply-coupon`);
  }

  cancelSubscription(id: string) {
    return this.post(`/subscriptions/cancel/${id}`);
  }
}

export const paymentService = new PaymentService();
