import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Form,
  Icon,
  Message,
} from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import './customDatePicker.css';
import { userRecord, repairRecord } from '../../proptypes';
import firebase from '../../firebase';

class EditRepairModal extends React.PureComponent {
  static NewRepair = {
    date: moment(),
    uid: '',
    description: '',
    comments: '',
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
      saving: false,
      error: null,
    };

    this.hours = [...Array(12)].map((_, hh) => ({
      text: `${hh}:00`,
      value: hh,
    }));
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
      saving: false,
      error: null,
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

  onCommentsChange = (e) => {
    const repair = {
      ...this.state.repair,
      comments: e.target.value,
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
      uid: value,
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
    this.setState({
      ...this.state,
      saving: true,
    });

    const repair = { ...this.state.repair };
    const pm = this.state.ampm === 'pm';
    // eslint-disable-next-line
    const hour = this.state.hour === 12 ? pm ? 12 : 0 : pm ? this.state.hour + 12 : this.state.hour;
    repair.date = repair.date.set({ hour, minute: 0, second: 0, millisecond: 0 }).format();
    repair.state = repair.uid ? 'assigned' : 'new';
    repair.manager = firebase.auth().currentUser.uid;

    const promise = this.props.repair ?
      firebase.database().ref(`repairs/${this.props.repair.key}`).update(repair)
      :
      firebase.database().ref('repairs').push().set(repair);

    promise
      .then(() => {
        this.onClose();
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          saving: false,
          error,
        });
      });
  }

  selectUsers = () => this.props.users
    .filter(user => user.role === 'user' && !user.disabled)
    .map(user => ({
      text: `<${user.name}> ${user.email}`,
      value: user.key,
    }))

  render() {
    const canSave = this.state.repair.date.isValid() && this.state.repair.description;

    return (
      <Modal
        open={this.state.open}
        onOpen={this.onOpen}
        onClose={this.onClose}
        size="small"
        trigger={
          <Button floated="right" compact color={this.props.repair ? 'grey' : 'blue'}>
            <Icon name={this.props.repair ? 'edit' : 'add'} />
            {this.props.repair ? 'Edit Repair' : 'Add Repair'}
          </Button>
        }
      >
        <Modal.Header>{this.props.repair ? 'Edit Repair' : 'Create Repair'}</Modal.Header>
        <Modal.Content>
          <Form loading={this.state.saving} error={this.state.error}>
            <Message error>
              {this.state.error}
            </Message>
            <Form.Group inline>
              <Form.Input inline label="Date" required>
                <SingleDatePicker
                  required
                  placeholder="Select Date"
                  keepOpenOnDateSelect
                  showDefaultInputIcon
                  numberOfMonths={1}
                  daySize={40}
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
            <Form.Select
              inline
              label="User"
              fluid
              options={this.selectUsers()}
              value={this.state.repair.uid}
              onChange={this.onUserChange}
            />
            <Form.Input
              label="Description"
              required
              fluid
              value={this.state.repair.description}
              onChange={this.onDescriptionChange}
            />
            <Form.TextArea
              label="Comments"
              value={this.state.repair.comments}
              onChange={this.onCommentsChange}
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
            content={this.props.repair ? 'Save' : 'Create'}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

EditRepairModal.defaultProps = {
  repair: null,
};

EditRepairModal.propTypes = {
  users: PropTypes.arrayOf(userRecord).isRequired,
  repair: repairRecord,
};

export default EditRepairModal;
