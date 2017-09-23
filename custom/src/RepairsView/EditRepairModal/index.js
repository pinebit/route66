import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Modal,
  Button,
  Form,
  Icon,
  Message,
} from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import { userRecordShape, repairRecordShape } from '../../shapes';
import { States, Roles } from '../../const';
import {
  patchRepair,
  createRepair,
} from '../../state/actions';

class EditRepairModal extends React.PureComponent {
  static NewRepair = {
    date: moment(),
    user: '',
    description: '',
  }

  constructor(props) {
    super(props);

    const repair = this.props.repair || EditRepairModal.NewRepair;
    // eslint-disable-next-line
    const hour = (repair.date.hour() + 11) % 12 + 1;
    const ampm = repair.date.hour() >= 12 ? 'pm' : 'am';

    this.state = {
      open: false,
      repair,
      ampm,
      hour,
      datePickerFocus: false,
    };

    this.hours = [...Array(12)].map((_, hh) => ({
      text: `${hh}:00`,
      value: hh,
    }));

    this.occupied = new Set(
      this.props.repairs
        .filter(r => (this.props.repair ? r.date !== this.props.repair.date : true))
        .map(r => r.date.format()),
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading && nextProps.error === null) {
      this.setState({
        ...this.state,
        open: false,
      });
    }
  }

  onOpen = () => {
    this.setState({
      ...this.state,
      open: true,
    });
  }

  onClose = () => {
    this.setState({
      ...this.state,
      open: false,
    });
  }

  onDateChange = (date) => {
    this.setState({
      ...this.state,
      repair: {
        ...this.state.repair,
        date,
      },
      datePickerFocus: false,
    });
  }

  onDateFocusChange = ({ focused }) => {
    this.setState({
      ...this.state,
      datePickerFocus: focused,
    });
  }

  onDescriptionChange = (e) => {
    const repair = {
      ...this.state.repair,
      description: e.target.value,
    };
    this.setState({
      ...this.state,
      repair,
    });
  }

  onAmPmChange = (e, { value }) => {
    this.setState({
      ...this.state,
      ampm: value,
    });
  }

  onUserChange = (e, { value }) => {
    const repair = {
      ...this.state.repair,
      user: value,
    };
    this.setState({
      ...this.state,
      repair,
    });
  }

  onHourChange = (e, { value }) => {
    this.setState({
      ...this.state,
      hour: value,
    });
  }

  onSave = () => {
    const { key, ...repair } = { ...this.state.repair };
    repair.date = this.buildDateTime().format();

    if (repair.user && repair.state) {
      repair.state = repair.state === States.New ? States.Assigned : repair.state;
    } else {
      repair.state = States.New;
    }

    repair.comments = this.addComment(repair.comments);

    if (this.props.repair) {
      this.props.patchRepair(repair._id, repair);
    } else {
      this.props.createRepair(repair);
    }
  }

  addComment = (comments) => {
    const newComments = (comments && Array.isArray(comments)) ? comments : [];

    newComments.push({
      date: moment().format('DD MMM YYYY h:mma'),
      user: this.props.user._id,
      comment: this.props.repair ? 'Repair edited' : 'Repair created',
    });

    return newComments;
  }

  buildDateTime = () => {
    const pm = this.state.ampm === 'pm';
    // eslint-disable-next-line
    const hour = this.state.hour === 12 ? pm ? 12 : 0 : pm ? this.state.hour + 12 : this.state.hour;
    const datetime = this.state.repair.date.clone();
    datetime.set({ hour, minute: 0, second: 0, millisecond: 0 });
    return datetime;
  }

  selectUsers = () => this.props.users
    .filter(user => user.role === Roles.User && !user.disabled)
    .map(user => ({
      text: `<${user.name}> ${user.email}`,
      value: user._id,
    }))

  render() {
    const editing = !!this.props.repair;
    const date = this.buildDateTime().format();
    const duplicate = this.occupied.has(date);
    const canSave = this.state.repair.date.isValid() && this.state.repair.description && !duplicate;

    return (
      <Modal
        open={this.state.open}
        onOpen={this.onOpen}
        onClose={this.onClose}
        size="small"
        trigger={
          <Button floated="right" compact color={editing ? 'grey' : 'blue'}>
            <Icon name={editing ? 'edit' : 'add'} />
            {editing ? 'Edit Repair' : 'Add Repair'}
          </Button>
        }
      >
        <Modal.Header>{editing ? 'Edit Repair' : 'Create Repair'}</Modal.Header>
        <Modal.Content>
          <Form loading={this.props.loading} error={this.props.error !== null || duplicate}>
            <Form.Group inline>
              <Form.Input inline label="Date" required>
                <SingleDatePicker
                  required
                  placeholder="Select Date"
                  keepOpenOnDateSelect
                  showDefaultInputIcon
                  numberOfMonths={1}
                  daySize={40}
                  isOutsideRange={() => false}
                  focused={this.state.datePickerFocus}
                  date={this.state.repair.date}
                  onDateChange={this.onDateChange}
                  onFocusChange={this.onDateFocusChange}
                />
              </Form.Input>
              <Form.Select label="Time" options={this.hours} value={this.state.hour} onChange={this.onHourChange} />
              <Form.Radio label="AM" value="am" name="timeGroup" checked={this.state.ampm === 'am'} onChange={this.onAmPmChange} />
              <Form.Radio label="PM" value="pm" name="timeGroup" checked={this.state.ampm === 'pm'} onChange={this.onAmPmChange} />
            </Form.Group>
            <Message error>
              {this.props.error || 'Selected date/time slot is occupied by another repair. Please change the date or time.'}
            </Message>
            <Form.Select
              inline
              label="User"
              fluid
              options={this.selectUsers()}
              value={this.state.repair.user}
              onChange={this.onUserChange}
            />
            <Form.Input
              label="Description"
              required
              fluid
              value={this.state.repair.description}
              onChange={this.onDescriptionChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel" onClick={this.onClose} />
          <Button
            icon="check"
            primary
            disabled={!canSave}
            onClick={this.onSave}
            content={editing ? 'Save' : 'Create'}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

EditRepairModal.defaultProps = {
  repair: null,
  error: null,
};

EditRepairModal.propTypes = {
  users: PropTypes.arrayOf(userRecordShape).isRequired,
  repairs: PropTypes.arrayOf(repairRecordShape).isRequired,
  repair: repairRecordShape,
  user: userRecordShape.isRequired,
  patchRepair: PropTypes.func.isRequired,
  createRepair: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

const mapStateToProps = state => ({
  users: state.users.users,
  repairs: state.repairs.repairs,
  loading: state.repairs.loading,
  error: state.repairs.error,
  user: state.auth.user,
});

const componentActions = {
  patchRepair,
  createRepair,
};

export default connect(mapStateToProps, componentActions)(EditRepairModal);
