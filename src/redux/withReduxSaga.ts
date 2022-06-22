import nextReduxWrapper from 'next-redux-wrapper';
import nextReduxSaga from 'next-redux-saga';
import store from './store';

export default function withReduxSafa(BaseComponent: any) {
  return nextReduxWrapper(store as any)(nextReduxSaga(BaseComponent));
}
