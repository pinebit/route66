import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import CenteredForm from '../CenteredForm'
import firebase from '../firebase'
import { withRouter } from 'react-router-dom'

class SignOutForm extends React.Component {
  componentDidMount () {
    firebase.auth().signOut()
      .then(() => {
        this.props.history.push('/')
      })
  }

  render () {
    return (
      <CenteredForm>
        <Dimmer active inverted>
          <Loader>Signing out...</Loader>
        </Dimmer>
      </CenteredForm>
    )
  }
}

export default withRouter(SignOutForm)
