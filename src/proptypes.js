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

const usersFilter = PropTypes.shape({
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  disabled: PropTypes.string,
});

const repairRecord = PropTypes.shape({
  date: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  uid: PropTypes.string,
  comments: PropTypes.string,
});

const repairsFilter = PropTypes.shape({
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  description: PropTypes.string,
  state: PropTypes.string,
  user: PropTypes.string,
});

export {
  firebaseUser,
  userRecord,
  usersFilter,
  repairRecord,
  repairsFilter,
};

