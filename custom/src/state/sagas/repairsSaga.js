import { call, put, takeLatest, select } from 'redux-saga/effects';
import moment from 'moment';
import * as api from './api';
import * as types from '../types';
import * as actions from '../actions';

const getToken = state => state.auth.token;

const convertRepairs = repairs => repairs
  .map(repair => ({ ...repair, date: moment(repair.date) }))
  .sort((a, b) => a.date > b.date);

function* readRepairs() {
  try {
    const token = yield select(getToken);
    const response = yield call(api.readRepairs, token);
    if (!response.ok) {
      throw new Error(response.data ? response.data.message : 'Unknown error');
    }
    const repairs = convertRepairs(response.data);
    yield put(actions.repairsReceived(repairs));
  } catch (e) {
    yield put(actions.repairsFailed(e.message));
  }
}

function* removeRepair(action) {
  try {
    const token = yield select(getToken);
    const response = yield call(api.removeRepair, token, action.rid);
    if (!response.ok) {
      throw new Error(response.data ? response.data.message : 'Unknown error');
    }
    yield readRepairs();
  } catch (e) {
    yield put(actions.repairsFailed(e.message));
  }
}

function* patchRepair(action) {
  try {
    const token = yield select(getToken);
    const response = yield call(api.patchRepair, token, action.rid, action.repair);
    if (!response.ok) {
      throw new Error(response.data ? response.data.message : 'Unknown error');
    }
    yield readRepairs();
  } catch (e) {
    yield put(actions.repairsFailed(e.message));
  }
}

function* createRepair(action) {
  try {
    const token = yield select(getToken);
    const response = yield call(api.createRepair, token, action.repair);
    if (!response.ok) {
      throw new Error(response.data ? response.data.message : 'Unknown error');
    }
    yield readRepairs();
  } catch (e) {
    yield put(actions.repairsFailed(e.message));
  }
}

function* RepairsSaga() {
  yield takeLatest(types.READ_REPAIRS, readRepairs);
  yield takeLatest(types.REMOVE_REPAIR, removeRepair);
  yield takeLatest(types.PATCH_REPAIR, patchRepair);
  yield takeLatest(types.CREATE_REPAIR, createRepair);
}

export default RepairsSaga;

