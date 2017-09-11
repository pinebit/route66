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
import firebase, { readArrayAsync } from '../firebase';

class RepairsView extends React.PureComponent {
  static DefaultFilter = {
    date: '',
    time: '',
    repair: '',
    uid: '',
    status: '*',
    comment: '',
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
    // reading repairs
    readArrayAsync('repairs', (repairs) => {
      this.setState({
        ...this.state,
        repairs: this.convertRepairs(repairs),
        confirm: null,
      });
    });

    // reading users
    readArrayAsync('users', (users) => {
      this.setState({
        ...this.state,
        users,
        user: users.find(user => user.key === firebase.auth().currentUser.uid),
        confirm: null,
      });
    });
  }

  componentWillUnmount() {
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

  closeConfirm = () => {
    this.setState({
      ...this.state,
      confirm: null,
    });
  }

  repairsFilter = () => {
    if (!this.state.filtering) {
      return true;
    }

    return false;
  }

  convertRepairs = repairs =>
    repairs
      .map(repair => ({ ...repair, date: moment(repair.date) }))
      .sort((a, b) => a.date > b.date);

  renderActions = repair => (
    <Dropdown item text="Actions">
      <Dropdown.Menu>
        {repair.state === 'assigned' && <Dropdown.Item>Complete</Dropdown.Item>}
        {repair.state === 'complete' && <Dropdown.Item>Approve</Dropdown.Item>}
        {repair.state === 'new' && this.state.user.role !== 'user' && <Dropdown.Item>Assign User</Dropdown.Item>}
      </Dropdown.Menu>
    </Dropdown>
  );

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
          {this.state.user.role !== 'user' && <EditRepairModal createMode users={this.state.users} />}
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
                    <Table.Cell>{this.renderActions(repair)}</Table.Cell>
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
