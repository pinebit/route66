import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Form,
  Icon,
} from 'semantic-ui-react';
import { usersFilterShape } from '../../shapes';

class UsersFilterModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      filter: this.props.filter,
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

  onRoleChanged = (e, data) => {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        role: data.value,
      },
    });
  }

  onStateChanged = (e, data) => {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        disabled: data.value,
      },
    });
  }

  stateOptions = [
    { text: 'Any', value: '*' },
    { text: 'Enabled', value: 'false' },
    { text: 'Disabled', value: 'true' },
  ]

  roleOptions = [
    { text: 'Any', value: '*' },
    { text: 'Admin', value: 'admin' },
    { text: 'Manager', value: 'manager' },
    { text: 'User', value: 'user' },
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
            <Form.Input
              autoFocus
              label="Filter by Name"
              placeholder="Leave blank to not filter by Name"
              value={this.state.filter.name}
              onChange={e => this.onFieldChange('name', e)}
            />
            <Form.Input
              label="Filter by E-mail"
              placeholder="Leave blank to not filter by E-mail"
              value={this.state.filter.email}
              onChange={e => this.onFieldChange('email', e)}
            />
            <Form.Select
              label="Role"
              options={this.roleOptions}
              value={this.state.filter.role}
              onChange={this.onRoleChanged}
            />
            <Form.Select
              label="State"
              options={this.stateOptions}
              value={this.state.filter.disabled}
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

UsersFilterModal.propTypes = {
  filtering: PropTypes.bool.isRequired,
  filter: usersFilterShape.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default UsersFilterModal;
