import { createAsyncAction, createAction } from '@lib/redux';

export const {
  getGalleries,
  getGalleriesSuccess,
  getGalleriesFail
} = createAsyncAction('getGalleries', 'GET_GALLERIES');

export const {
  moreGalleries, moreGalleriesSuccess, moreGalleriesFail
} = createAsyncAction('moreGalleries', 'MORE_GALLERIES');

export const {
  getRelatedGalleries, getRelatedGalleriesSuccess, getRelatedGalleriesFail
} = createAsyncAction('getRelatedGalleries', 'GET_RELATED_GALLERIES');

export const resetGalleryState = createAction('resetGalleryState');


export const {
  getPosts,
  getPostsSuccess,
  getPostsFail
} = createAsyncAction('getPosts', 'GET_POSTS');

export const {
  morePosts, morePostsSuccess, morePostsFail
} = createAsyncAction('morePosts', 'MORE_POSTS');

export const resetPostState = createAction('resetPostState');
