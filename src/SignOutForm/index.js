import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import CenteredForm from '../CenteredForm';
import firebase from '../firebase';

class SignOutForm extends React.Component {
  componentDidMount() {
    firebase.auth().signOut()
      .then(() => {
        this.props.history.push('/');
      });
  }

  render() {
    return (
      <CenteredForm>
        <Dimmer active inverted>
          <Loader>Signing out...</Loader>
        </Dimmer>
      </CenteredForm>
    );
  }
}

SignOutForm.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(SignOutForm);
