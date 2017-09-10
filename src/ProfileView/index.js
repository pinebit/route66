import React from 'react';
import {
  Segment,
  Header,
  Image,
  Label,
  Form,
  Message,
  Button,
  Popup,
} from 'semantic-ui-react';
import Gravatar from 'react-gravatar';
import CenteredForm from '../CenteredForm';
import firebase from '../firebase';

const ProfilePicture = () => {
  const user = firebase.auth().currentUser;

  return (
    <Image shape="rounded" spaced verticalAlign="top">
      <Gravatar email={user.email} size={128} />
    </Image>
  );
};

class ProfileView extends React.PureComponent {
  state = {
    name: firebase.auth().currentUser.displayName || '',
    error: false,
    success: false,
    updating: false,
  };

  onDisplayNameUpdate = () => {
    this.setState({
      ...this.state,
      updating: true,
      error: false,
      success: false,
    });

    firebase.auth().currentUser.updateProfile({
      displayName: this.state.name,
    })
      .then(() => {
        this.setState({
          ...this.state,
          updating: false,
          success: true,
        });
      })
      .catch(() => {
        this.setState({
          ...this.state,
          updating: false,
          error: true,
        });
      });
  };

  onDisplayNameChange = (e) => {
    this.setState({
      ...this.state,
      name: e.target.value,
    });
  };

  render() {
    const user = firebase.auth().currentUser;
    const canUpdate = user.displayName !== this.state.name && this.state.name.length > 0;

    return (
      <CenteredForm>
        <Header as="h2" attached="top" block content="Profile" />
        <Segment attached textAlign="left">
          <Segment secondary>
            <ProfilePicture />
            <Label as="a" color="blue" content="gravatar.com" href="https://gravatar.com" tag />
          </Segment>
          <Form
            success={this.state.success}
            error={this.state.error}
            loading={this.state.updating}
          >
            <Popup
              trigger={
                <Form.Input
                  error={!user.emailVerified}
                  fluid
                  icon="at"
                  iconPosition="left"
                  placeholder="E-mail address"
                  type="email"
                  readOnly
                  value={user.email}
                />
              }
              content="You cannot modify the e-mail address."
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Display Name"
              autoFocus
              value={this.state.name}
              onChange={this.onDisplayNameChange}
            />
            <Button
              fluid
              primary
              type="submit"
              onClick={this.onDisplayNameUpdate}
              disabled={!canUpdate}
            >
              Update
            </Button>
            <Message
              error
              content="Failed to update. Please try again."
            />
            <Message
              success
              content="Profile updated."
            />
          </Form>
        </Segment>
      </CenteredForm>
    );
  }
}

export default ProfileView;
