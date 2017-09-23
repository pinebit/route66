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
import EditRepairModal from './EditRepairModal';
import RepairsFilterModal from './RepairsFilterModal';
import CommentsModal from './CommentsModal';
import { repairRecordShape, userRecordShape } from '../shapes';
import { States, Roles } from '../const';
import {
  readUsers,
  readRepairs,
  patchRepair,
  removeRepair,
} from '../state/actions';

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

  componentDidMount() {
    this.props.readUsers();
    this.props.readRepairs();
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
        action: () => this.updateRepair({ ...repair, state: States.Complete }),
      },
    });
  }

  onApprove = (repair) => {
    this.setState({
      ...this.state,
      confirm: {
        content: 'Do you want to approve the completed repair?',
        action: () => this.updateRepair({ ...repair, state: States.Approved }),
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
    const hasComments = newRepair.comments && Array.isArray(newRepair.comments);
    newRepair.comments = (hasComments ? newRepair.comments : []);
    newRepair.comments.push(comments);
    this.updateRepair(newRepair);
    this.onCloseComments();
  }

  updateRepair = (repair) => {
    this.props.patchRepair(repair._id, repair);
    this.closeConfirm();
  };

  deleteRepair = (repair) => {
    this.props.removeRepair(repair._id);
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

    if (this.state.filter.user && this.state.filter.user !== repair.user) {
      return false;
    }

    return true;
  }

  renderActions = (repair) => {
    const thisUser = this.props.user;
    const notUser = thisUser.role !== Roles.User;
    const myRepair = thisUser._id === repair.user;
    const canComplete = repair.state === States.Assigned && myRepair;
    const canApprove = repair.state === States.Complete && notUser;

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
    const user = this.props.users.find(u => u._id === uid);
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
    const repairs = this.props.repairs.filter(this.repairsFilter);

    return (
      <div>
        <Header as="h3" attached="top" block color={this.state.filtering ? 'blue' : undefined}>
          Repairs ({repairs.length})
          <RepairsFilterModal
            filtering={this.state.filtering}
            filter={this.state.filter}
            onFilterChange={this.onFilterChange}
            users={this.props.users}
          />
          {this.props.user.role !== Roles.User &&
            <EditRepairModal />
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
                <Table.Row key={repair._id} positive={repair.state === States.Approved}>
                  <Table.Cell>{repair.date.format('DD MMM YYYY')}</Table.Cell>
                  <Table.Cell>{repair.date.format('h:mmA')}</Table.Cell>
                  <Table.Cell>{repair.description}</Table.Cell>
                  <Table.Cell>{this.renderUser(repair.user)}</Table.Cell>
                  <Table.Cell>{repair.state}</Table.Cell>
                  <Table.Cell>{this.renderCommentsLink(repair)}</Table.Cell>
                  <Table.Cell>
                    {this.renderActions(repair)}
                    {this.props.user.role !== Roles.User && <EditRepairModal repair={repair} />}
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
              user={this.props.user}
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
  repairs: PropTypes.arrayOf(repairRecordShape).isRequired,
  users: PropTypes.arrayOf(userRecordShape).isRequired,
  user: userRecordShape.isRequired,
  readUsers: PropTypes.func.isRequired,
  readRepairs: PropTypes.func.isRequired,
  patchRepair: PropTypes.func.isRequired,
  removeRepair: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  repairs: state.repairs.repairs,
  users: state.users.users,
  user: state.auth.user,
});

const componentActions = {
  readUsers,
  readRepairs,
  patchRepair,
  removeRepair,
};

export default connect(mapStateToProps, componentActions)(RepairsView);
