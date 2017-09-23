import React from 'react';
import {
  Segment,
  Header,
  Label,
  Form,
  Message,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import CenteredForm from '../CenteredForm';
import ProfilePicture from './ProfilePicture';
import { userRecordShape } from '../shapes';

const ProfileView = ({ user }) => (
  <CenteredForm>
    <Header as="h2" attached="top" block content="Profile" />
    <Segment attached textAlign="left">
      <Segment secondary>
        <ProfilePicture />
        <Label color="green" content={user.role} tag />
        <Message>
          Use <a href="https://gravatar.com">gravatar.com</a> to update your picture profile.
        </Message>
      </Segment>
      <Form>
        <Form.Input
          fluid
          icon="user"
          iconPosition="left"
          placeholder="Name"
          readOnly
          value={user.name}
        />
        <Form.Input
          fluid
          icon="mail"
          iconPosition="left"
          placeholder="E-mail"
          readOnly
          value={user.email}
        />
        <Form.Button disabled fluid>
          Change Password
        </Form.Button>
      </Form>
    </Segment>
  </CenteredForm>
);

ProfileView.propTypes = {
  user: userRecordShape.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfileView);
