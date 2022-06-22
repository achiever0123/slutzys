import { merge } from 'lodash';
import { combineReducers } from 'redux';

// load reducer here
import settings from './settings/reducers';
import ui from './ui/reducers';
import user from './user/reducers';
import auth from './auth/reducers';
import performer from './performer/reducers';
import video from './video/reducers';
import photo from './photo/reducers';
import gallery from './gallery/reducers';
import product from './product/reducers';
import comment from './comment/reducers';
import cart from './cart/reducers';
import banner from './banner/reducers';
import message from './message/reducers';

const reducers = merge(
  settings,
  ui,
  user,
  auth,
  performer,
  gallery,
  video,
  photo,
  product,
  comment,
  cart,
  banner,
  message
);

export default combineReducers(reducers);
