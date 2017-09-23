import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Form,
  Icon,
} from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';
import { userRecordShape, usersFilterShape } from '../../shapes';
import { States } from '../../const';

class RepairsFilterModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      filter: this.props.filter,
      datePickerFocus: null,
    };
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

  onApply = () => {
    this.onClose();
    this.props.onFilterChange(this.state.filter);
  }

  onReset = () => {
    this.onClose();
    this.props.onFilterChange(null);
  }

  onFieldChange = (field, e) => {
    const filter = { ...this.state.filter };
    filter[field] = e.target.value;
    this.setState({
      ...this.state,
      filter,
    });
  }

  onStateChanged = (e, data) => {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        state: data.value,
      },
    });
  }

  onDateFocusChange = (focusedInput) => {
    this.setState({
      ...this.state,
      datePickerFocus: focusedInput,
    });
  }

  onDateRangeChange = ({ startDate, endDate }) => {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        startDate,
        endDate,
      },
      datePickerFocus: null,
    });
  }

  onUserChange = (e, { value }) => {
    const filter = {
      ...this.state.filter,
      user: value,
    };
    this.setState({
      ...this.state,
      filter,
    });
  }

  selectUsers = () => this.props.users
    .map(user => ({
      text: `<${user.name}> ${user.email}`,
      value: user.key,
    }))

  stateOptions = [
    { text: 'Any', value: '*' },
    { text: 'New', value: States.New },
    { text: 'Assigned', value: States.Assigned },
    { text: 'Complete', value: States.Complete },
    { text: 'Approved', value: States.Approved },
  ]

  render() {
    return (
      <Modal
        open={this.state.open}
        onOpen={this.onOpen}
        onClose={this.onClose}
        size="small"
        trigger={
          <Button floated="right" compact primary={this.props.filtering}>
            <Icon name="filter" />
            Filter...
          </Button>
        }
      >
        <Modal.Header>Filters</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input label="Filter by Dates">
              <DateRangePicker
                keepOpenOnDateSelect
                showDefaultInputIcon
                numberOfMonths={2}
                daySize={40}
                isOutsideRange={() => false}
                focusedInput={this.state.datePickerFocus}
                startDate={this.state.filter.startDate}
                endDate={this.state.filter.endDate}
                onDatesChange={this.onDateRangeChange}
                onFocusChange={this.onDateFocusChange}
              />
            </Form.Input>
            <Form.Input
              autoFocus
              label="Filter by Description"
              placeholder="Leave blank to not filter by Description"
              value={this.state.filter.description}
              onChange={e => this.onFieldChange('description', e)}
            />
            <Form.Select
              label="Filter by User"
              fluid
              options={this.selectUsers()}
              value={this.state.filter.user}
              onChange={this.onUserChange}
            />
            <Form.Select
              label="Filter by State"
              options={this.stateOptions}
              value={this.state.filter.state}
              onChange={this.onStateChanged}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Reset Filter" color="brown" floated="left" disabled={!this.props.filtering} onClick={this.onReset} />
          <Button content="Cancel" onClick={this.onClose} />
          <Button icon="check" primary content="Apply" onClick={this.onApply} />
        </Modal.Actions>
      </Modal>
    );
  }
}

RepairsFilterModal.propTypes = {
  filtering: PropTypes.bool.isRequired,
  filter: usersFilterShape.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(userRecordShape).isRequired,
};

export default RepairsFilterModal;
