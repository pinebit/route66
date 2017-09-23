import * as types from '../types';

const initialState = {
  repairs: [],
  error: null,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.REPAIRS_RECEIVED:
      return {
        ...state,
        repairs: action.repairs,
        error: null,
        loading: false,
      };
    case types.READ_REPAIRS:
    case types.CREATE_REPAIR:
    case types.PATCH_REPAIR:
    case types.REMOVE_REPAIR:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case types.REPAIRS_FAILED:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
