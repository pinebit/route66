import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import firebase from '../firebase';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={renderProps => (
      firebase.auth().currentUser ? (
        <Component {...renderProps} />
      ) : (
        <Redirect to={{ pathname: '/signin', state: { from: renderProps.location } }} />
      )
    )}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
