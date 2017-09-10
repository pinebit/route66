import React from 'react';
import {
  Header,
  Table,
  Segment,
  Loader,
  Confirm,
  Dropdown,
} from 'semantic-ui-react';
import UsersFilterModal from './UsersFilterModal';
import firebase from '../firebase';

class UsersView extends React.PureComponent {
  static DefaultFilter = {
    name: '',
    email: '',
    role: '*',
    state: '*',
  }

  state = {
    users: null,
    confirm: null,
    filter: UsersView.DefaultFilter,
    filtering: false,
  }

  componentDidMount() {
    firebase.database().ref('users').on('value', (snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
      const users = keys.map(key => data[key]);

      this.setState({
        ...this.state,
        users,
        confirm: null,
      });
    });
  }

  componentWillUnmount() {
    firebase.database().ref('users').off('value');
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
        action: () => this.updateUser({ ...user, role: 'manager' }),
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

  updateUser = (user) => {
    firebase.database().ref(`users/${user.uid}`).update(user);
  };

  closeConfirm = () => {
    this.setState({
      ...this.state,
      confirm: null,
    });
  }

  renderActions = user => (
    <Dropdown item text="Actions">
      <Dropdown.Menu>
        {user.disabled ?
          <Dropdown.Item onClick={() => this.onEnable(user)}>Enable</Dropdown.Item>
          :
          <Dropdown.Item onClick={() => this.onDisable(user)}>Disable</Dropdown.Item>
        }
        {user.role === 'user' &&
          <Dropdown.Item onClick={() => this.onPromote(user)}>Promote to Manager</Dropdown.Item>
        }
      </Dropdown.Menu>
    </Dropdown>
  );

  render() {
    return (
      <div>
        <Header as="h3" attached="top" block color={this.state.filtering ? 'blue' : undefined}>
          Users ({this.state.users ? this.state.users.length : '-'})
          <UsersFilterModal
            filtering={this.state.filtering}
            filter={this.state.filter}
            onFilterChange={this.onFilterChange}
          />
        </Header>
        <Segment attached>
          {this.state.users === null
            ? <Loader active inline="centered" />
            : <Table striped>
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
                {this.state.users.map(user => (
                  <Table.Row key={user.uid}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>{user.disabled ? 'Disabled' : 'Enabled'}</Table.Cell>
                    <Table.Cell>{user.role !== 'admin' && this.renderActions(user)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          }
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

export default UsersView;
