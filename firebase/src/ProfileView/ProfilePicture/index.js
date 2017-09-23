import React from 'react';
import { Image } from 'semantic-ui-react';
import Gravatar from 'react-gravatar';
import firebase from '../../firebase';

const ProfilePicture = () => {
  const user = firebase.auth().currentUser;
  if (!user) {
    return null;
  }

  return (
    <Image shape="rounded" spaced verticalAlign="top">
      <Gravatar email={user.email} size={128} />
    </Image>
  );
};

export default ProfilePicture;
