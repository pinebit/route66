import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import DisabledView from '../DisabledView';

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(renderProps) => {
      if (auth.loading) {
        return <Loader active inline="centered" size="large">Loading...</Loader>;
      }
      if (auth.user && auth.user.disabled) {
        return <DisabledView />;
      }

      return (
        auth.token ? (
          <Component {...renderProps} />
        ) : (
          <Redirect to={{ pathname: '/signin', state: { from: renderProps.location } }} />
        )
      );
    }
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  component: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
