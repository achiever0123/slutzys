export class PaymentProductModel {
  name: string;

  description?: string;

  price: number;

  extraInfo?: any;

  productType?: string;

  productId?: string;
}

export interface ITransaction {
  paymentGateway: string;
  source: string;
  sourceId: string;
  target: string;
  targetId: string;
  type: string;
  paymentResponseInfo: any;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  products: PaymentProductModel[];
}

export interface ICoupon {
  _id: string;
  name: string;
  description: string;
  code: string;
  value: number;
  expiredDate: string | Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: string;

  orderId: string;

  orderNumber: string;

  buyerId: string;

  buyerSource: string;

  sellerId: string;

  sellerSource: string;

  productType: string;

  productId: string;

  name: string;

  description: string;

  unitPrice: number;

  originalPrice: number;

  status: string;

  payBy: string;

  quantity: number;

  totalPrice: number;

  deliveryStatus: string;

  deliveryAddress: string;

  shippingCode: string;

  paymentStatus: string;

  postalCode: string;

  phoneNumber: string;

  paymentGateway: string;

  couponInfo: any;

  seller: any;

  buyer: any;

  createdAt: Date;

  updatedAt: Date;
}
