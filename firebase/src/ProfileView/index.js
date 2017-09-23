import React from 'react';
import {
  Segment,
  Header,
  Label,
  Form,
  Message,
} from 'semantic-ui-react';
import CenteredForm from '../CenteredForm';
import ProfilePicture from './ProfilePicture';
import { storeShape } from '../shapes';

const ProfileView = ({ store }) => (
  <CenteredForm>
    <Header as="h2" attached="top" block content="Profile" />
    <Segment attached textAlign="left">
      <Segment secondary>
        <ProfilePicture />
        <Label color="green" content={store.user.role} tag />
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
          value={store.user.name}
        />
        <Form.Input
          fluid
          icon="mail"
          iconPosition="left"
          placeholder="E-mail"
          readOnly
          value={store.user.email}
        />
        <Form.Button disabled fluid>
          Change Password
        </Form.Button>
      </Form>
    </Segment>
  </CenteredForm>
);

ProfileView.propTypes = {
  store: storeShape.isRequired,
};

export default ProfileView;
