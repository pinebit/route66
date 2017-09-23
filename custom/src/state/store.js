import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import allSagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = {
  /* eslint-disable no-underscore-dangle */
  ...createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(sagaMiddleware),
  ),
  runSaga: allSagas.forEach(saga => sagaMiddleware.run(saga)),
};

export default store;
