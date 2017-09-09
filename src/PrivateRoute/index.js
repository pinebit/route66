import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import firebase from '../firebase'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    firebase.auth().currentUser ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/signin',
        state: { from: props.location }
      }} />
    )
  )} />
)

export default PrivateRoute
