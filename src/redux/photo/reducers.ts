import { createReducers } from '@lib/redux';
import { merge } from 'lodash';
import {
  getPhotos,
  getPhotosSuccess,
  getPhotosFail
} from './actions';

const initialState = {
  listPhotos: {
    loading: false,
    data: null,
    error: null,
    success: false
  }
};

const photoReducer = [
  {
    on: getPhotos,
    reducer(state: any) {
      return {
        ...state,
        listPhotos: {
          loading: true,
          data: null,
          error: null,
          success: false
        }
      };
    }
  },
  {
    on: getPhotosSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        listPhotos: {
          loading: false,
          data: data.payload,
          error: null,
          success: true
        }
      };
    }
  },
  {
    on: getPhotosFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        listPhotos: {
          loading: false,
          data: null,
          error: data.payload,
          success: false
        }
      };
    }
  }
];

export default merge({}, createReducers('photo', [photoReducer], initialState));
