import * as types from './types';

export const authSignIn = (email, password) => ({
  type: types.AUTH_SIGNIN,
  params: {
    email,
    password,
  },
});

export const authSignUp = (name, email, password) => ({
  type: types.AUTH_SIGNUP,
  params: {
    name,
    email,
    password,
  },
});

export const authSignOut = () => ({
  type: types.AUTH_SIGNOUT,
});

export const authFailed = error => ({
  type: types.AUTH_FAILED,
  error,
});

export const authSucceded = (user, token) => ({
  type: types.AUTH_SUCCEDED,
  user,
  token,
});

export const readUsers = () => ({
  type: types.READ_USERS,
});

export const usersReceived = users => ({
  type: types.USERS_RECEIVED,
  users,
});

export const removeUser = uid => ({
  type: types.REMOVE_USER,
  uid,
});

export const patchUser = (uid, user) => ({
  type: types.PATCH_USER,
  uid,
  user,
});

export const usersFailed = error => ({
  type: types.USERS_FAILED,
  error,
});

export const readRepairs = () => ({
  type: types.READ_REPAIRS,
});

export const repairsReceived = repairs => ({
  type: types.REPAIRS_RECEIVED,
  repairs,
});

export const removeRepair = rid => ({
  type: types.REMOVE_REPAIR,
  rid,
});

export const patchRepair = (rid, repair) => ({
  type: types.PATCH_REPAIR,
  rid,
  repair,
});

export const createRepair = repair => ({
  type: types.CREATE_REPAIR,
  repair,
});

export const repairsFailed = error => ({
  type: types.REPAIRS_FAILED,
  error,
});
