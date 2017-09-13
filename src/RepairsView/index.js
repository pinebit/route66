import React from 'react';
import {
  Header,
  Table,
  Segment,
  Confirm,
  Dropdown,
} from 'semantic-ui-react';
import EditRepairModal from './EditRepairModal';
import RepairsFilterModal from './RepairsFilterModal';
import CommentsModal from './CommentsModal';
import firebase from '../firebase';
import { storeShape } from '../shapes';

class RepairsView extends React.PureComponent {
  static DefaultFilter = {
    startDate: null,
    endDate: null,
    description: '',
    user: '',
    state: '*',
  }

  state = {
    confirm: null,
    filter: RepairsView.DefaultFilter,
    filtering: false,
    showComments: false,
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

  onShowComments = (repair) => {
    this.setState({
      ...this.state,
      showComments: true,
      showCommentsRepair: repair,
    });
  }

  onCloseComments = () => {
    this.setState({
      ...this.state,
      showComments: false,
      showCommentsRepair: null,
    });
  }

  onAddComment = (repair, comments) => {
    const newRepair = { ...repair };
    newRepair.comments = (newRepair.comments && Array.isArray(newRepair.comments) ? newRepair.comments : []);
    newRepair.comments.push(comments);
    this.updateRepair(newRepair);
    this.onCloseComments();
  }

  updateRepair = (repair) => {
    const record = { ...repair, date: repair.date.format() };
    firebase.database().ref(`repairs/${repair.key}`).update(record);
    this.closeConfirm();
  };

  deleteRepair = (repair) => {
    firebase.database().ref(`repairs/${repair.key}`).remove();
    this.closeConfirm();
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

  renderActions = (repair) => {
    const thisUser = this.props.store.user;
    const notUser = thisUser.role !== 'user';
    const myRepair = thisUser.key === repair.uid;
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
    const user = this.props.store.users.find(u => u.key === uid);
    if (!user) {
      return '-';
    }
    return user.name;
  }

  renderCommentsLink = (repair) => {
    const handleLinkClick = (e) => {
      e.preventDefault();
      this.onShowComments(repair);
    };

    return (
      <a href="" onClick={handleLinkClick}>
        {repair.comments ? `${repair.comments.length} comment(s)` : 'Add comment'}
      </a>
    );
  }

  render() {
    const repairs = this.props.store.repairs.filter(this.repairsFilter);

    return (
      <div>
        <Header as="h3" attached="top" block color={this.state.filtering ? 'blue' : undefined}>
          Repairs ({repairs.length})
          <RepairsFilterModal
            filtering={this.state.filtering}
            filter={this.state.filter}
            onFilterChange={this.onFilterChange}
            users={this.props.store.users}
          />
          {this.props.store.user.role !== 'user' &&
            <EditRepairModal
              users={this.props.store.users}
              repairs={this.props.store.repairs}
            />
          }
        </Header>
        <Segment attached>
          <Table striped>
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
                  <Table.Cell>{this.renderCommentsLink(repair)}</Table.Cell>
                  <Table.Cell>
                    {this.renderActions(repair)}
                    {this.props.store.user.role !== 'user' &&
                      <EditRepairModal
                        users={this.props.store.users}
                        repair={repair}
                        repairs={this.props.store.repairs}
                      />
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
          {this.state.showComments &&
            <CommentsModal
              onClose={this.onCloseComments}
              users={this.props.store.users}
              comments={this.state.showCommentsRepair.comments || []}
              onAddComment={c => this.onAddComment(this.state.showCommentsRepair, c)}
            />
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

RepairsView.propTypes = {
  store: storeShape.isRequired,
};

export default RepairsView;
