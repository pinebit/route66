import PropTypes from 'prop-types';

const userRecordShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
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
  user: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
});

const repairRecordShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  user: PropTypes.string,
  comments: PropTypes.arrayOf(commentRecordShape),
});

const repairsFilterShape = PropTypes.shape({
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  description: PropTypes.string,
  state: PropTypes.string,
  user: PropTypes.string,
});

export {
  userRecordShape,
  usersFilterShape,
  commentRecordShape,
  repairRecordShape,
  repairsFilterShape,
};

