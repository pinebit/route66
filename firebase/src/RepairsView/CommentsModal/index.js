import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Form,
  Table,
  Message,
} from 'semantic-ui-react';
import moment from 'moment';
import firebase from '../../firebase';
import { commentRecordShape, userRecordShape } from '../../shapes';

class CommentsModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
    };

    this.userMap = new Map();
    this.props.users.forEach(user => this.userMap.set(user.key, user.name));
  }

  onCommentChange = (e) => {
    this.setState({
      ...this.state,
      comment: e.target.value,
    });
  }

  onAddComment = () => {
    this.props.onAddComment({
      date: moment().format('DD MMM YYYY h:mma'),
      uid: firebase.auth().currentUser.uid,
      comment: this.state.comment,
    });
  }

  addComment = (comments) => {
    const newComments = (comments && Array.isArray(comments)) ? comments : [];

    newComments.push({
      date: moment().format('DD MMM YYYY h:mma'),
      uid: firebase.auth().currentUser.uid,
      comment: this.state.comment,
    });

    return newComments;
  }

  render() {
    const comments = this.props.comments.map((comment, index) => ({ ...comment, key: index }));

    return (
      <Modal open onClose={this.props.onClose} size="small" >
        <Modal.Header>Comments</Modal.Header>
        <Modal.Content>
          <Message hidden={this.props.comments && this.props.comments.length > 0}>
            No comments found for this repair.
          </Message>
          {this.props.comments && this.props.comments.length > 0 &&
            <Table striped padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>User</Table.HeaderCell>
                  <Table.HeaderCell>Comment</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {comments.map(c => (
                  <Table.Row key={c.key}>
                    <Table.Cell collapsing>{c.date}</Table.Cell>
                    <Table.Cell collapsing>{this.userMap.get(c.uid) || '-'}</Table.Cell>
                    <Table.Cell>{c.comment}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          }
          <Form>
            <Form.TextArea
              autoFocus
              required
              label="Enter a new comment"
              value={this.state.comment}
              onChange={this.onCommentChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel" onClick={this.props.onClose} />
          <Button
            icon="check"
            disabled={!this.state.comment}
            primary
            content="Add Comment"
            onClick={this.onAddComment}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

CommentsModal.propTypes = {
  comments: PropTypes.arrayOf(commentRecordShape).isRequired,
  onAddComment: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(userRecordShape).isRequired,
};

export default CommentsModal;
