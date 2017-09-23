import { create } from 'apisauce';

const api = create({
  baseURL: 'http://localhost:3003',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const signIn = params => api.post('/auth/signin', params);
const signUp = params => api.post('/auth/signup', params);

const readUsers = token => api.get('/users', { token });
const patchUser = (token, uid, user) => api.post(`/users/${uid}?token=${token}`, user);
const removeUser = (token, uid) => api.delete(`/users/${uid}`, { token });

const readRepairs = token => api.get('/repairs', { token });
const patchRepair = (token, rid, repair) => api.post(`/repairs/${rid}?token=${token}`, repair);
const removeRepair = (token, rid) => api.delete(`/repairs/${rid}`, { token });
const createRepair = (token, repair) => api.post(`/repairs?token=${token}`, repair);

export {
  signIn,
  signUp,
  readUsers,
  patchUser,
  removeUser,
  readRepairs,
  patchRepair,
  removeRepair,
  createRepair,
};

