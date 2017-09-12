import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';
import firebase, { readArrayAsync } from './firebase';
import AppMenu from './AppMenu';
import PrivateRoute from './PrivateRoute';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import SignOutForm from './SignOutForm';
import ProfileView from './ProfileView';
import RepairsView from './RepairsView';
import UsersView from './UsersView';
import AppFooter from './AppFooter';
import './App.css';

class App extends Component {
  static InitialState = {
    user: null,
    users: [],
    repairs: [],
    loading: true,
  }

  state = App.InitialState;

  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  componentWillUnmount() {
    this.detachDatabase();
  }

  onAuthStateChanged = (user) => {
    if (user) {
      this.attachDatabase(user);
    } else {
      this.detachDatabase();
    }
  };

  attachDatabase = (user) => {
    readArrayAsync('users', (users) => {
      this.setState({
        ...this.state,
        users,
        user: users.find(u => u.key === user.uid),
      });
    });

    readArrayAsync('repairs', (repairs) => {
      this.setState({
        ...this.state,
        repairs: this.convertRepairs(repairs),
        loading: false,
      });
    });
  }

  convertRepairs = (repairs) => {
    const myRepairs = repair => repair.uid === this.state.user.key;
    const allRepairs = () => true;

    return repairs
      .filter(this.state.user.role === 'user' ? myRepairs : allRepairs)
      .map(repair => ({ ...repair, date: moment(repair.date) }))
      .sort((a, b) => a.date > b.date);
  }

  detachDatabase = () => {
    firebase.database().ref('users').off('value');
    firebase.database().ref('repairs').off('value');
    this.setState(App.InitialState);
  }

  render() {
    return (
      <div className="app">
        <AppMenu user={this.state.user} />
        <Switch>
          <Route exact path="/signin" component={SignInForm} />
          <Route exact path="/signup" component={SignUpForm} />
          <Route exact path="/signout" component={SignOutForm} />
          <PrivateRoute path="/repairs" component={RepairsView} store={this.state} />
          <PrivateRoute path="/users" component={UsersView} store={this.state} />
          <PrivateRoute path="/profile" component={ProfileView} store={this.state} />
        </Switch>
        <AppFooter />
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(App);
