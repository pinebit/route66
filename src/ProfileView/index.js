import React from 'react';
import {
  Segment,
  Header,
  Label,
  Form,
  Message,
} from 'semantic-ui-react';
import CenteredForm from '../CenteredForm';
import firebase from '../firebase';
import ProfilePicture from './ProfilePicture';

class ProfileView extends React.PureComponent {
  state = {
    user: {
      name: '',
      email: '',
    },
    loading: true,
    error: false,
  };

  componentDidMount() {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref(`users/${user.uid}`).once('value')
        .then((snapshot) => {
          this.setState({
            ...this.state,
            user: snapshot.val(),
            loading: false,
          });
        })
        .catch(() => {
          this.setState({
            ...this.state,
            loading: false,
            error: true,
          });
        });
    }
  }

  render() {
    return (
      <CenteredForm>
        <Header as="h2" attached="top" block content="Profile" />
        <Segment attached textAlign="left">
          <Segment secondary>
            <ProfilePicture />
            <Label color="green" content={this.state.user.role} tag />
            <Message>
              Use <a href="https://gravatar.com">gravatar.com</a> to update your picture profile.
            </Message>
          </Segment>
          <Form loading={this.state.loading} error={this.state.error}>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Name"
              readOnly
              value={this.state.user.name}
            />
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="E-mail"
              readOnly
              value={this.state.user.email}
            />
            <Message
              error
              content="Failed to retreive your profile data."
            />
            <Form.Button disabled fluid>
              Change Password
            </Form.Button>
          </Form>
        </Segment>
      </CenteredForm>
    );
  }
}

export default ProfileView;
