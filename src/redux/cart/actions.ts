import { createAsyncAction } from '@lib/redux';

export const { addCart } = createAsyncAction('addCart', 'ADD_CART');

export const { removeCart } = createAsyncAction('removeCart', 'REMOVE_CART');
export const { clearCart } = createAsyncAction('clearCart', 'CLEAR_CART');
