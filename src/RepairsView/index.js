import React from 'react';
import {
  Header,
  Table,
  Segment,
  Loader,
  Confirm,
  Dropdown,
} from 'semantic-ui-react';
import moment from 'moment';
import EditRepairModal from './EditRepairModal';
import RepairsFilterModal from './RepairsFilterModal';
import firebase, { readArrayAsync } from '../firebase';

class RepairsView extends React.PureComponent {
  static DefaultFilter = {
    startDate: null,
    endDate: null,
    description: '',
    user: '',
    state: '*',
  }

  state = {
    repairs: null,
    users: [],
    confirm: null,
    filter: RepairsView.DefaultFilter,
    filtering: false,
    user: {},
  }

  componentDidMount() {
    // reading users
    readArrayAsync('users', (users) => {
      this.setState({
        ...this.state,
        users,
        user: users.find(user => user.key === firebase.auth().currentUser.uid),
        confirm: null,
      });
    });

    // reading repairs
    readArrayAsync('repairs', (repairs) => {
      this.setState({
        ...this.state,
        repairs: this.convertRepairs(repairs),
        confirm: null,
      });
    });
  }

  componentWillUnmount() {
    firebase.database().ref('users').off('value');
    firebase.database().ref('repairs').off('value');
  }

  onFilterChange = (filter) => {
    this.setState({
      ...this.state,
      filter: filter || RepairsView.DefaultFilter,
      filtering: !!filter,
    });
  }

  onResetFilter = (e) => {
    e.preventDefault();
    this.onFilterChange(null);
  }

  onComplete = (repair) => {
    this.setState({
      ...this.state,
      confirm: {
        content: 'Do you want to mark the repair as completed?',
        action: () => this.updateRepair({ ...repair, state: 'complete' }),
      },
    });
  }

  onApprove = (repair) => {
    this.setState({
      ...this.state,
      confirm: {
        content: 'Do you want to approve the completed repair?',
        action: () => this.updateRepair({ ...repair, state: 'approved' }),
      },
    });
  }

  onDelete = (repair) => {
    this.setState({
      ...this.state,
      confirm: {
        content: 'Do you want to delete this repair?',
        action: () => this.deleteRepair(repair),
      },
    });
  }

  updateRepair = (repair) => {
    const record = { ...repair, date: repair.date.format() };
    firebase.database().ref(`repairs/${repair.key}`).update(record);
  };

  deleteRepair = (repair) => {
    firebase.database().ref(`repairs/${repair.key}`).remove();
  };

  closeConfirm = () => {
    this.setState({
      ...this.state,
      confirm: null,
    });
  }

  repairsFilter = (repair) => {
    if (!this.state.filtering) {
      return true;
    }

    if (this.state.filter.description !== '' &&
      repair.description.toUpperCase().indexOf(this.state.filter.description.toUpperCase()) < 0) {
      return false;
    }

    if (this.state.filter.state !== '*' && this.state.filter.state !== repair.state) {
      return false;
    }

    if (this.state.filter.startDate &&
      this.state.filter.startDate.isValid() &&
      this.state.filter.startDate > repair.date) {
      return false;
    }

    if (this.state.filter.endDate &&
      this.state.filter.endDate.isValid() &&
      this.state.filter.endDate < repair.date) {
      return false;
    }

    if (this.state.filter.user && this.state.filter.user !== repair.uid) {
      return false;
    }

    return true;
  }

  convertRepairs = (repairs) => {
    const myRepairs = repair => repair.uid === this.state.user.key;
    const allRepairs = () => true;

    return repairs
      .filter(this.state.user.role === 'user' ? myRepairs : allRepairs)
      .map(repair => ({ ...repair, date: moment(repair.date) }))
      .sort((a, b) => a.date > b.date);
  }

  renderActions = (repair) => {
    const notUser = this.state.user.role !== 'user';
    const myRepair = this.state.user.key === repair.uid;
    const canComplete = repair.state === 'assigned' && myRepair;
    const canApprove = repair.state === 'complete' && notUser;

    if (!notUser && !canComplete) {
      return null;
    }

    return (
      <Dropdown item text="Actions">
        <Dropdown.Menu>
          {canComplete &&
            <Dropdown.Item icon="check" text="Complete" onClick={() => this.onComplete(repair)} />
          }
          {canApprove &&
            <Dropdown.Item text="Approve" onClick={() => this.onApprove(repair)} />
          }
          {notUser &&
            <Dropdown.Item icon="delete" text="Delete" onClick={() => this.onDelete(repair)} />
          }
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  renderUser = (uid) => {
    const user = this.state.users.find(u => u.key === uid);
    if (!user) {
      return '-';
    }
    return user.name;
  }

  render() {
    const repairs = this.state.repairs ? this.state.repairs.filter(this.repairsFilter) : [];

    return (
      <div>
        <Header as="h3" attached="top" block color={this.state.filtering ? 'blue' : undefined}>
          Repairs ({repairs.length})
          <RepairsFilterModal
            filtering={this.state.filtering}
            filter={this.state.filter}
            onFilterChange={this.onFilterChange}
            users={this.state.users}
          />
          {this.state.user.role !== 'user' && <EditRepairModal users={this.state.users} />}
        </Header>
        <Segment attached>
          {this.state.repairs === null
            ? <Loader active inline="centered" />
            : <Table striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Time</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>User</Table.HeaderCell>
                  <Table.HeaderCell>State</Table.HeaderCell>
                  <Table.HeaderCell>Comments</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {repairs.map(repair => (
                  <Table.Row key={repair.key}>
                    <Table.Cell>{repair.date.format('DD MMM YYYY')}</Table.Cell>
                    <Table.Cell>{repair.date.format('h:mmA')}</Table.Cell>
                    <Table.Cell>{repair.description}</Table.Cell>
                    <Table.Cell>{this.renderUser(repair.uid)}</Table.Cell>
                    <Table.Cell>{repair.state}</Table.Cell>
                    <Table.Cell>{repair.comments}</Table.Cell>
                    <Table.Cell>
                      {this.renderActions(repair)}
                      {this.state.user.role !== 'user' &&
                        <EditRepairModal users={this.state.users} repair={repair} />
                      }
                    </Table.Cell>
                  </Table.Row>
                ))}
                {repairs.length === 0 &&
                  <Table.Row>
                    <Table.Cell>
                      No records found. {this.state.filtering && <a href="" onClick={this.onResetFilter}>Reset Filter</a>}
                    </Table.Cell>
                  </Table.Row>
                }
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

export default RepairsView;
