import { createAsyncAction, createAction } from '@lib/redux';

export const { login, loginSuccess, loginFail } = createAsyncAction(
  'login',
  'LOGIN'
);

export const { registerFan, registerFanSuccess, registerFanFail } = createAsyncAction(
  'registerFan',
  'REGISTERFAN'
);

export const { registerPerformer, registerPerformerSuccess, registerPerformerFail } = createAsyncAction(
  'registerPerformer',
  'REGISTERPERFORMER'
);

export const { forgot, forgotSuccess, forgotFail } = createAsyncAction(
  'forgot',
  'FORGOT'
);

export const logout = createAction('logout');
