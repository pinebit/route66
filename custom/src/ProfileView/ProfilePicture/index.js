import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import Gravatar from 'react-gravatar';
import { connect } from 'react-redux';

const ProfilePicture = ({ email }) => {
  if (!email) {
    return null;
  }

  return (
    <Image shape="rounded" spaced verticalAlign="top">
      <Gravatar email={email} size={128} />
    </Image>
  );
};

ProfilePicture.defaultProps = {
  email: null,
};

ProfilePicture.propTypes = {
  email: PropTypes.string,
};

const mapStateToProps = state => ({
  email: state.auth.user ? state.auth.user.email : null,
});

export default connect(mapStateToProps)(ProfilePicture);
