import { createAsyncAction } from '@lib/redux';

export const {
  getPhotos,
  getPhotosSuccess,
  getPhotosFail
} = createAsyncAction('getVideos', 'GET_PHOTOS');

export const {
  editPhoto,
  editPhotoSuccess,
  editPhotoFail
} = createAsyncAction('editVideos', 'EDIT_PHOTO');

export const {
  deletePhoto,
  deletePhotoSuccess,
  deletePhotoFail
} = createAsyncAction('deletePhotos', 'DELETE_PHOTO');
