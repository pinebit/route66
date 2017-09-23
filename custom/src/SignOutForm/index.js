import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import CenteredForm from '../CenteredForm';
import { authSignOut } from '../state/actions';

class SignOutForm extends React.Component {
  componentDidMount() {
    this.props.authSignOut();
  }

  render() {
    if (this.props.token === null) {
      return <Redirect to="/signin" />;
    }

    return (
      <CenteredForm>
        <Dimmer active inverted>
          <Loader>Signing out...</Loader>
        </Dimmer>
      </CenteredForm>
    );
  }
}

SignOutForm.defaultProps = {
  token: null,
};

SignOutForm.propTypes = {
  token: PropTypes.string,
  authSignOut: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  token: state.auth.token,
});

const componentActions = {
  authSignOut,
};

export default connect(mapStateToProps, componentActions)(SignOutForm);
