import PropTypes from 'prop-types';

const firebaseUser = PropTypes.shape({
  email: PropTypes.string,
  displayName: PropTypes.string,
});

const userRecord = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
});

const repairRecord = PropTypes.shape({
  date: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  uid: PropTypes.string,
  comments: PropTypes.string,
});

export {
  firebaseUser,
  userRecord,
  repairRecord,
};

