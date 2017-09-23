import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'react-dates/lib/css/_datepicker.css';
import AppMenu from './AppMenu';
import AppFooter from './AppFooter';
import WelcomeView from './WelcomeView';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import SignOutForm from './SignOutForm';
import PrivateRoute from './PrivateRoute';
import ProfileView from './ProfileView';
import UsersView from './UsersView';
import RepairsView from './RepairsView';
import { userRecordShape } from './shapes';
import './App.css';

const App = ({ user }) => (
  <div className="app">
    <AppMenu user={user} />
    <Switch>
      <Route exact path="/" component={WelcomeView} />
      <Route exact path="/signin" component={SignInForm} />
      <Route exact path="/signup" component={SignUpForm} />
      <Route exact path="/signout" component={SignOutForm} />
      <PrivateRoute path="/profile" component={ProfileView} />
      <PrivateRoute path="/users" component={UsersView} />
      <PrivateRoute path="/repairs" component={RepairsView} />
    </Switch>
    <AppFooter />
  </div>
);

App.defaultProps = {
  user: null,
};

App.propTypes = {
  user: userRecordShape,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default withRouter(connect(mapStateToProps)(App));
