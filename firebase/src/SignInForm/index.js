import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import {
  Header,
  Segment,
  Button,
  Form,
  Message,
} from 'semantic-ui-react';
import CenteredForm from '../CenteredForm';
import firebase from '../firebase';
import logoIcon from '../img/logo.svg';

class SignInForm extends React.Component {
  state = {
    email: '',
    password: '',
    loading: false,
    error: null,
  };

  onFieldChange = (field, e) => {
    const state = { ...this.state };
    state[field] = e.target.value;
    state.error = null;
    this.setState(state);
  };

  navigateToLog = () => {
    this.props.history.push('/repairs');
  };

  handleSignIn = () => {
    this.setState({
      ...this.state,
      loading: true,
      error: null,
    });

    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(this.navigateToLog)
      .catch((error) => {
        this.setState({
          ...this.state,
          loading: false,
          error,
        });
      }, this);
  };

  render() {
    const canSubmit = this.state.email.length > 0 && this.state.password.length > 0;

    return (
      <CenteredForm>
        <Header
          as="h2"
          attached="top"
          block
          image={logoIcon}
          content="Sign in to your account"
        />
        <Segment attached>
          <Form loading={this.state.loading} error={this.state.error !== null}>
            <Form.Input
              fluid
              icon="at"
              iconPosition="left"
              placeholder="E-mail address"
              type="email"
              value={this.state.email}
              required
              onChange={e => this.onFieldChange('email', e)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={this.state.password}
              required
              onChange={e => this.onFieldChange('password', e)}
            />
            <Message
              error
              header="Sign In Failed"
              content={this.state.error ? this.state.error.message : 'Unknown Error'}
            />
            <Button
              primary
              type="submit"
              fluid
              disabled={!canSubmit}
              onClick={this.handleSignIn}
            >Sign In</Button>
          </Form>
        </Segment>
        <Message>
          First time user?
          <Link style={{ marginLeft: '0.5em' }} to="/signup">Sign Up</Link>
        </Message>
      </CenteredForm>
    );
  }
}

SignInForm.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(SignInForm);
