import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import firebase from '../firebase';
import { storeShape } from '../shapes';

const PrivateRoute = ({ component: Component, store, ...rest }) => (
  <Route
    {...rest}
    render={(renderProps) => {
      if (store.loading) {
        return <Loader active inline="centered" size="large">Loading...</Loader>;
      }

      return (
        firebase.auth().currentUser ? (
          <Component {...renderProps} store={store} />
        ) : (
          <Redirect to={{ pathname: '/signin', state: { from: renderProps.location } }} />
        )
      );
    }
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  store: storeShape.isRequired,
};

export default PrivateRoute;
