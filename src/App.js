import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import firebase from './firebase';
import AppMenu from './AppMenu';
import PrivateRoute from './PrivateRoute';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import SignOutForm from './SignOutForm';
import ProfileView from './ProfileView';
import RepairsView from './RepairsView';
import UsersView from './UsersView';

class App extends Component {
  state = {
    user: null,
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = (user) => {
    this.setState({
      ...this.state,
      user,
    });

    if (user) {
      this.props.history.push('/log');
    }
  };

  render() {
    return (
      <div style={{ minWidth: 1300 }}>
        <AppMenu user={this.state.user} />
        <Container>
          {this.props.children}
        </Container>
        <Switch>
          <Route exact path="/signin" component={SignInForm} />
          <Route exact path="/signup" component={SignUpForm} />
          <Route exact path="/signout" component={SignOutForm} />
          <PrivateRoute path="/repairs" component={RepairsView} />
          <PrivateRoute path="/users" component={UsersView} />
          <PrivateRoute path="/profile" component={ProfileView} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  children: PropTypes.node.isRequired,
};

export default withRouter(App);
