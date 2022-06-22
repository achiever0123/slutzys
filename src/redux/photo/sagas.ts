import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '@lib/redux';
import { photoService } from '@services/index';
import { IReduxAction, IReducerFieldUpdate } from 'src/interfaces';
import {
  getPhotos,
  getPhotosSuccess,
  getPhotosFail,
  editPhoto,
  editPhotoSuccess,
  editPhotoFail,
  deletePhoto,
  deletePhotoSuccess,
  deletePhotoFail
} from './actions';

const photoSagas = [
  {
    on: getPhotos,
    * worker(data: IReduxAction<any>) {
      try {
        const resp = yield photoService.searchByUser(data.payload);
        yield put(getPhotosSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(getPhotosFail(error));
      }
    }
  },
  {
    on: editPhoto,
    * worker(data: IReducerFieldUpdate<any>) {
      try {
        const resp = yield photoService.update(data.field, data.data);
        yield put(editPhotoSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(editPhotoFail(error));
      }
    }
  },
  {
    on: deletePhoto,
    * worker(data: IReducerFieldUpdate<any>) {
      try {
        const resp = yield photoService.delete(data.field);
        yield put(deletePhotoSuccess(resp));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(deletePhotoFail(error));
      }
    }
  }
];

export default flatten([createSagas(photoSagas)]);
