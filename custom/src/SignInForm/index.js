import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, Redirect } from 'react-router-dom';
import {
  Header,
  Segment,
  Button,
  Form,
  Message,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import CenteredForm from '../CenteredForm';
import logoIcon from '../img/logo.svg';
import { authSignIn } from '../state/actions';

class SignInForm extends React.Component {
  state = {
    email: '',
    password: '',
  };

  onFieldChange = (field, e) => {
    const state = { ...this.state };
    state[field] = e.target.value;
    this.setState(state);
  };

  handleSignIn = () => {
    this.props.authSignIn(this.state.email, this.state.password);
  };

  render() {
    const canSubmit = this.state.email.length > 0 && this.state.password.length > 0;
    const auth = this.props.auth;

    if (auth.token) {
      return <Redirect to="/repairs" />;
    }

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
          <Form loading={auth.loading} error={auth.error !== null}>
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
              content={auth.error || 'Unknown Error'}
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
  auth: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  authSignIn: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const componentActions = {
  authSignIn,
};

export default withRouter(connect(mapStateToProps, componentActions)(SignInForm));
