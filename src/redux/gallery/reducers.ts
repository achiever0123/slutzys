import { createReducers } from '@lib/redux';
import { merge } from 'lodash';
import {
  getGalleries, getGalleriesSuccess, getGalleriesFail, resetGalleryState,
  moreGalleries, moreGalleriesFail, moreGalleriesSuccess,
  getRelatedGalleries, getRelatedGalleriesFail, getRelatedGalleriesSuccess,
  getPosts,getPostsFail,getPostsSuccess,
  morePosts,morePostsFail,morePostsSuccess,  
} from './actions';

const initialState = {
  galleries: {
    requesting: false,
    items: [],
    total: 0,
    error: null,
    success: false
  },
  posts: {
    requesting: false,
    items: [],
    total: 0,
    error: null,
    success: false
  },
  relatedGalleries: {
    requesting: false,
    error: null,
    success: false,
    items: [],
    total: 0
  }
};

const galleryReducer = [
  {
    on: getGalleries,
    reducer(state: any) {
      return {
        ...state,
        galleries: {
          ...state.galleries,
          requesting: true
        }
      };
    }
  },
  {
    on: getGalleriesSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        galleries: {
          requesting: false,
          items: data.payload.data,
          total: data.payload.total,
          success: true
        }
      };
    }
  },
  {
    on: getGalleriesFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        galleries: {
          ...state.galleries,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: moreGalleries,
    reducer(state: any) {
      return {
        ...state,
        galleries: {
          ...state.galleries,
          requesting: true,
          error: null,
          success: false
        }
      };
    }
  },
  {
    on: moreGalleriesSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        galleries: {
          requesting: false,
          total: data.payload.total,
          items: [...state.galleries.items, ...data.payload.data],
          success: true
        }
      };
    }
  },
  {
    on: moreGalleriesFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        galleries: {
          ...state.galleries,
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },

  {
    on: getPosts,
    reducer(state: any) {
      return {
        ...state,
        posts: {
          ...state.posts,
          requesting: true
        }
      };
    }
  },
  {
    on: getPostsSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        posts: {
          requesting: false,
          items: data.payload.data,
          total: data.payload.total,
          success: true
        }
      };
    }
  },
  {
    on: getPostsFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        posts: {
          ...state.posts,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: morePosts,
    reducer(state: any) {
      return {
        ...state,
        posts: {
          ...state.posts,
          requesting: true,
          error: null,
          success: false
        }
      };
    }
  },
  {
    on: morePostsSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        posts: {
          requesting: false,
          total: data.payload.total,
          items: [...state.posts.items, ...data.payload.data],
          success: true
        }
      };
    }
  },
  {
    on: morePostsFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        posts: {
          ...state.posts,
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },

  {
    on: getRelatedGalleries,
    reducer(state: any) {
      return {
        ...state,
        related: {
          ...state.videos,
          requesting: true
        }
      };
    }
  },
  {
    on: getRelatedGalleriesSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        relatedGalleries: {
          requesting: false,
          items: data.payload.data,
          total: data.payload.total,
          success: true
        }
      };
    }
  },
  {
    on: getRelatedGalleriesFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        relatedGalleries: {
          ...state.galleries,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: resetGalleryState,
    reducer() {
      return {
        ...initialState
      };
    }
  }
];

export default merge({}, createReducers('gallery', [galleryReducer], initialState));
