import * as types from '../types';

const initialState = {
  token: null,
  user: null,
  error: null,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.AUTH_SUCCEDED:
      return {
        ...state,
        user: action.user,
        token: action.token,
        loading: false,
      };
    case types.AUTH_FAILED:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case types.AUTH_SIGNIN:
    case types.AUTH_SIGNUP:
      return {
        ...initialState,
        loading: true,
      };
    case types.AUTH_SIGNOUT:
      return initialState;
    default:
      return state;
  }
}
