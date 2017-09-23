import React from 'react';
import {
  Header,
  Segment,
  Button,
  Form,
  Message,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import CenteredForm from '../CenteredForm';
import firebase from '../firebase';
import logoIcon from '../img/logo.svg';
import { Roles } from '../const';

class SignUpForm extends React.Component {
  state = {
    name: '',
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

  handleSignUp = () => {
    this.setState({
      ...this.state,
      loading: true,
      error: null,
    });

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        this.registerNewUser(user);
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          loading: false,
          error,
        });
      }, this);
  };

  registerNewUser = (user) => {
    const userData = {
      uid: user.uid,
      name: this.state.name,
      email: this.state.email,
      disabled: false,
      role: Roles.User,
    };

    return firebase.database().ref(`/users/${user.uid}`).set(userData);
  }

  render() {
    const canSubmit = this.state.name && this.state.email && this.state.password;

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
          <Form loading={this.state.loading} error={this.state.error !== null}>
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
              content={this.state.error ? this.state.error.message : 'Unknown Error'}
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

export default SignUpForm;
