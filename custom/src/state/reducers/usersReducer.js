import * as types from '../types';

const initialState = {
  users: [],
  error: null,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.USERS_RECEIVED:
      return {
        ...state,
        users: action.users,
        error: null,
        loading: false,
      };
    case types.READ_USERS:
    case types.PATCH_USER:
    case types.REMOVE_USER:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case types.USERS_FAILED:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
