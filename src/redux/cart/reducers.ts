import { merge } from 'lodash';
import { createReducers } from '@lib/redux';
import {
  addCart, removeCart, clearCart
} from './actions';

const initialState = {
  total: 0,
  items: []
};

const cartReducers = [
  {
    on: addCart,
    reducer(state: any, data: any) {
      let total = 0;
      let valid = true;
      data.payload.forEach((item) => {
        if (state.items.findIndex((i) => i._id === item._id) > -1) {
          valid = false;
        }
        total += 1;
      });
      if (!valid) {
        return {
          ...state
        };
      }
      return {
        ...state,
        total: state.total + total,
        items: [...state.items, ...data.payload]
      };
    }
  },
  {
    on: removeCart,
    reducer(state: any, data: any) {
      return {
        ...state,
        total: state.total - (data.payload || []).length,
        items: [
          ...state.items.filter((item) => data.payload.indexOf(item) > -1)
        ]
      };
    }
  },
  {
    on: clearCart,
    reducer() {
      return {
        ...initialState
      };
    }
  }
];

export default merge({}, createReducers('cart', [cartReducers], initialState));
