import { combineReducers } from 'redux';
import authReducer from './authReducer';
import usersReducer from './usersReducer';
import repairsReducer from './repairsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  repairs: repairsReducer,
});

export default rootReducer;
