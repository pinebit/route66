import PropTypes from 'prop-types';

const firebaseUser = PropTypes.shape({
  email: PropTypes.string,
  displayName: PropTypes.string,
});

export {
  firebaseUser,
};
