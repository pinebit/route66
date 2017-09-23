import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import * as types from '../types';
import * as actions from '../actions';

function* authenticate(apiFunc, action) {
  try {
    const response = yield call(apiFunc, action.params);
    if (!response.ok) {
      throw new Error(response.data ? response.data.message : 'Unknown error');
    }
    yield put(actions.authSucceded(response.data.user, response.data.token));
  } catch (e) {
    yield put(actions.authFailed(e.message));
  }
}

function* authSaga() {
  yield takeLatest(types.AUTH_SIGNIN, authenticate, api.signIn);
  yield takeLatest(types.AUTH_SIGNUP, authenticate, api.signUp);
}

export default authSaga;
