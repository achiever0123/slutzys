class CartService {
  getCartItems(): Promise<any> {
    let existCart = localStorage.getItem('cart') as any;
    existCart = existCart && existCart.length ? (JSON.parse(existCart)) : [];
    return existCart;
  }
}

export const cartService = new CartService();
