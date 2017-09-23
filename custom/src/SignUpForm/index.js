import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Segment,
  Button,
  Form,
  Message,
} from 'semantic-ui-react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import CenteredForm from '../CenteredForm';
import logoIcon from '../img/logo.svg';
import { authSignUp } from '../state/actions';

class SignUpForm extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
  };

  onFieldChange = (field, e) => {
    const state = { ...this.state };
    state[field] = e.target.value;
    this.setState(state);
  };

  handleSignUp = () => {
    this.props.authSignUp(this.state.name, this.state.email, this.state.password);
  };

  render() {
    const canSubmit = this.state.name && this.state.email && this.state.password;
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
          content="Create New Account"
        />
        <Segment attached>
          <Form loading={auth.loading} error={auth.error !== null}>
            <Form.Input
              fluid
              autoFocus
              icon="user"
              iconPosition="left"
              placeholder="Name"
              value={this.state.name}
              required
              onChange={e => this.onFieldChange('name', e)}
            />
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
              header="Sign Up Failed"
              content={auth.error || 'Unknown Error'}
            />
            <Button
              primary
              type="submit"
              fluid
              disabled={!canSubmit}
              onClick={this.handleSignUp}
            >Sign Up</Button>
          </Form>
        </Segment>
        <Message>
          Already registered?
          <Link style={{ marginLeft: '0.5em' }} to="/signin">Sign In</Link>
        </Message>
      </CenteredForm>
    );
  }
}

SignUpForm.propTypes = {
  auth: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  authSignUp: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const componentActions = {
  authSignUp,
};

export default withRouter(connect(mapStateToProps, componentActions)(SignUpForm));

