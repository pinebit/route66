import PropTypes from 'prop-types';

const firebaseUser = PropTypes.shape({
  email: PropTypes.string,
  displayName: PropTypes.string,
});

const userRecord = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.number.isRequired,
});

export {
  firebaseUser,
  userRecord,
};

