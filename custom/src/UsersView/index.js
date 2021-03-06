import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Table,
  Segment,
  Confirm,
  Dropdown,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import UsersFilterModal from './UsersFilterModal';
import { userRecordShape } from '../shapes';
import { Roles } from '../const';
import {
  readUsers,
  patchUser,
  removeUser,
} from '../state/actions';

class UsersView extends React.PureComponent {
  static DefaultFilter = {
    name: '',
    email: '',
    role: '*',
    disabled: '*',
  }

  state = {
    confirm: null,
    filter: UsersView.DefaultFilter,
    filtering: false,
  }

  componentDidMount() {
    this.props.readUsers();
  }

  onDisable = (user) => {
    this.setState({
      ...this.state,
      confirm: {
        content: `Do you want to disable ${user.name} account?`,
        action: () => this.updateUser({ ...user, disabled: true }),
      },
    });
  }

  onEnable = (user) => {
    this.setState({
      ...this.state,
      confirm: {
        content: `Do you want to enable ${user.name} account?`,
        action: () => this.updateUser({ ...user, disabled: false }),
      },
    });
  }

  onPromote = (user) => {
    this.setState({
      ...this.state,
      confirm: {
        content: `Do you want ${user.name} to become a Manager?`,
        action: () => this.updateUser({ ...user, role: Roles.Manager }),
      },
    });
  }

  onDelete = (user) => {
    this.setState({
      ...this.state,
      confirm: {
        content: `Do you want to delete user ${user.name}?`,
        action: () => this.removeUser(user._id),
      },
    });
  }

  onFilterChange = (filter) => {
    this.setState({
      ...this.state,
      filter: filter || UsersView.DefaultFilter,
      filtering: !!filter,
    });
  }

  onResetFilter = (e) => {
    e.preventDefault();
    this.onFilterChange(null);
  }

  closeConfirm = () => {
    this.setState({
      ...this.state,
      confirm: null,
    });
  }

  updateUser = (user) => {
    this.props.patchUser(user._id, user);
    this.closeConfirm();
  };

  removeUser = (uid) => {
    this.props.removeUser(uid);
    this.closeConfirm();
  }

  usersFilter = (user) => {
    if (!this.state.filtering) {
      return true;
    }

    if (this.state.filter.disabled !== '*' && Boolean(this.state.filter.disabled) !== user.disabled) {
      return false;
    }

    if (this.state.filter.role !== '*' && this.state.filter.role !== user.role) {
      return false;
    }

    if (this.state.filter.name !== '' &&
      user.name.toUpperCase().indexOf(this.state.filter.name.toUpperCase()) < 0) {
      return false;
    }

    if (this.state.filter.email !== '' &&
      user.email.toUpperCase().indexOf(this.state.filter.email.toUpperCase()) < 0) {
      return false;
    }

    return true;
  }

  renderActions = user => (
    <Dropdown item text="Actions">
      <Dropdown.Menu>
        {user.disabled ?
          <Dropdown.Item onClick={() => this.onEnable(user)}>Enable</Dropdown.Item>
          :
          <Dropdown.Item onClick={() => this.onDisable(user)}>Disable</Dropdown.Item>
        }
        {user.role === Roles.User &&
          <Dropdown.Item onClick={() => this.onPromote(user)}>Promote to Manager</Dropdown.Item>
        }
        <Dropdown.Item onClick={() => this.onDelete(user)}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  render() {
    const users = this.props.records.filter(this.usersFilter);

    return (
      <div>
        <Header as="h3" attached="top" block color={this.state.filtering ? 'blue' : undefined}>
          Users ({users.length})
          <UsersFilterModal
            filtering={this.state.filtering}
            filter={this.state.filter}
            onFilterChange={this.onFilterChange}
          />
        </Header>
        <Segment attached>
          <Table striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>E-mail</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map(user => (
                <Table.Row key={user._id} negative={user.disabled}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.disabled ? 'Disabled' : 'Enabled'}</Table.Cell>
                  <Table.Cell>{user.role !== Roles.Admin && this.renderActions(user)}</Table.Cell>
                </Table.Row>
              ))}
              {users.length === 0 &&
                <Table.Row>
                  <Table.Cell>
                    No records found. {this.state.filtering && <a href="" onClick={this.onResetFilter}>Reset Filter</a>}
                  </Table.Cell>
                </Table.Row>
              }
            </Table.Body>
          </Table>
        </Segment>
        {this.state.confirm &&
          <Confirm
            open
            content={this.state.confirm.content}
            onCancel={this.closeConfirm}
            onConfirm={this.state.confirm.action}
          />
        }
      </div>
    );
  }
}

UsersView.propTypes = {
  records: PropTypes.arrayOf(userRecordShape).isRequired,
  readUsers: PropTypes.func.isRequired,
  patchUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  records: state.users.users,
});

const componentActions = {
  readUsers,
  patchUser,
  removeUser,
};

export default connect(mapStateToProps, componentActions)(UsersView);
