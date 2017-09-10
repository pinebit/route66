import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Form,
  Icon,
} from 'semantic-ui-react';

class EditRepairModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
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

  render() {
    return (
      <Modal
        open={this.state.open}
        onOpen={this.onOpen}
        onClose={this.onClose}
        size="small"
        trigger={
          <Button floated="right" compact positive>
            {this.props.createMode && <Icon name="add" />}
            {this.props.createMode ? 'Add Repair' : 'Edit Repair'}
          </Button>
        }
      >
        <Modal.Header>{this.props.createMode ? 'Create Repair' : 'Edit Repair'}</Modal.Header>
        <Modal.Content>
          <Form />
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel" onClick={this.onClose} />
          <Button icon="check" primary content={this.props.createMode ? 'Create' : 'Save'} />
        </Modal.Actions>
      </Modal>
    );
  }
}

EditRepairModal.propTypes = {
  createMode: PropTypes.bool.isRequired,
};

export default EditRepairModal;
