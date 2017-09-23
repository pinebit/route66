import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as api from './api';
import * as types from '../types';
import * as actions from '../actions';

const getToken = state => state.auth.token;

function* readUsers() {
  try {
    const token = yield select(getToken);
    const response = yield call(api.readUsers, token);
    if (!response.ok) {
      throw new Error(response.data ? response.data.message : 'Unknown error');
    }
    yield put(actions.usersReceived(response.data));
  } catch (e) {
    yield put(actions.usersFailed(e.message));
  }
}

function* removeUser(action) {
  try {
    const token = yield select(getToken);
    const response = yield call(api.removeUser, token, action.uid);
    if (!response.ok) {
      throw new Error(response.data ? response.data.message : 'Unknown error');
    }
    yield readUsers();
  } catch (e) {
    yield put(actions.usersFailed(e.message));
  }
}

function* patchUser(action) {
  try {
    const token = yield select(getToken);
    const response = yield call(api.patchUser, token, action.uid, action.user);
    if (!response.ok) {
      throw new Error(response.data ? response.data.message : 'Unknown error');
    }
    yield readUsers();
  } catch (e) {
    yield put(actions.usersFailed(e.message));
  }
}

function* usersSaga() {
  yield takeLatest(types.READ_USERS, readUsers);
  yield takeLatest(types.REMOVE_USER, removeUser);
  yield takeLatest(types.PATCH_USER, patchUser);
}

export default usersSaga;

