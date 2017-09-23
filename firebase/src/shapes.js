import PropTypes from 'prop-types';

const userRecordShape = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
});

const usersFilterShape = PropTypes.shape({
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  disabled: PropTypes.string,
});

const commentRecordShape = PropTypes.shape({
  date: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
});

const repairRecordShape = PropTypes.shape({
  date: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  uid: PropTypes.string,
  comments: PropTypes.arrayOf(commentRecordShape),
});

const repairsFilterShape = PropTypes.shape({
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  description: PropTypes.string,
  state: PropTypes.string,
  user: PropTypes.string,
});

const storeShape = PropTypes.shape({
  user: userRecordShape,
  users: PropTypes.arrayOf(userRecordShape).isRequired,
  repairs: PropTypes.arrayOf(repairRecordShape).isRequired,
  loading: PropTypes.bool.isRequired,
});

export {
  userRecordShape,
  usersFilterShape,
  commentRecordShape,
  repairRecordShape,
  repairsFilterShape,
  storeShape,
};

