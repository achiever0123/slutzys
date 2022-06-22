import { merge } from 'lodash';
import { createReducers } from '@lib/redux';
import {
  login,
  loginSuccess,
  loginFail,
  registerFanSuccess,
  registerFanFail,
  registerFan,
  registerPerformerSuccess,
  registerPerformer,
  registerPerformerFail,
  forgotSuccess,
  forgotFail,
  logout
} from './actions';

const initialState = {
  loggedIn: false,
  authUser: null,
  loginAuth: {
    requesting: false,
    error: null,
    data: null,
    success: false
  },
  registerFanData: {
    requesting: false,
    error: null,
    data: null,
    success: false
  },
  registerPerformerData: {
    requesting: false,
    error: null,
    data: null,
    success: false
  },
  forgotData: {
    requesting: false,
    error: null,
    data: null,
    success: false
  }
};

const authReducers = [
  {
    on: login,
    reducer(state: any) {
      return {
        ...state,
        loginAuth: {
          requesting: true,
          error: null,
          data: null,
          success: false
        }
      };
    }
  },
  {
    on: loginSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        loggedIn: true,
        loginAuth: {
          requesting: false,
          error: null,
          data: data.payload,
          success: true
        }
      };
    }
  },
  {
    on: loginFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        loggedIn: false,
        loginAuth: {
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: registerFan,
    reducer(state: any) {
      return {
        ...state,
        registerFanData: {
          requesting: true,
          error: null,
          success: false
        }
      };
    }
  },
  {
    on: registerFanSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        registerFanData: {
          requesting: false,
          error: null,
          data: data.payload,
          success: true
        }
      };
    }
  },
  {
    on: registerFanFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        registerFanData: {
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: registerPerformer,
    reducer(state: any) {
      return {
        ...state,
        registerPerformerData: {
          requesting: true,
          error: null,
          success: false
        }
      };
    }
  },
  {
    on: registerPerformerSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        registerPerformerData: {
          requesting: false,
          error: null,
          data: data.payload,
          success: true
        }
      };
    }
  },
  {
    on: registerPerformerFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        registerPerformerData: {
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: forgotSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        registerFanData: {
          requesting: false,
          data: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: forgotFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        registerFanData: {
          requesting: false,
          data: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: logout,
    reducer() {
      return {
        ...initialState
      };
    }
  }
];

export default merge({}, createReducers('auth', [authReducers], initialState));
