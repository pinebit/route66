import React from 'react';
import { Header, Table, Button, Segment, Loader, Confirm } from 'semantic-ui-react';
import firebase from '../firebase';

class UsersView extends React.PureComponent {
  state = {
    users: null,
    confirm: null,
  }

  componentDidMount() {
    firebase.database().ref('users').on('value', (snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
      const users = keys.map(key => data[key]);

      this.setState({
        ...this.state,
        users,
      });
    });
  }

  componentWillUnmount() {
    firebase.database().ref('users').off('value');
  }

  onDelete = (uid) => {
    this.setState({
      ...this.state,
      confirm: {
        content: 'Do you want to delete the user?',
        action: () => this.onDeleteConfirmed(uid),
      },
    });
  }

  onDeleteConfirmed = (uid) => {
    this.closeConfirm();
    firebase.database().ref(`users/${uid}`).remove();
  };

  closeConfirm = () => {
    this.setState({
      ...this.state,
      confirm: null,
    });
  }

  render() {
    return (
      <div>
        <Header as="h3" attached="top" block>
          Users ({this.state.users ? this.state.users.length : '-'})
          <Button floated="right" compact>Filter</Button>
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
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.users.map(user => (
                  <Table.Row key={user.uid}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>
                      {user.role !== 'admin' &&
                        <Button color="red" compact onClick={() => this.onDelete(user.uid)}>
                          Delete
                        </Button>
                      }
                      {user.role === 'user' &&
                        <Button color="brown" compact>
                          Promote to Manager
                        </Button>
                      }
                    </Table.Cell>
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
