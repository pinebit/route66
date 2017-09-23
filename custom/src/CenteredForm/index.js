import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

class CenteredForm extends React.PureComponent {
  render() {
    return (
      <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          {this.props.children}
        </Grid.Column>
      </Grid>
    );
  }
}

CenteredForm.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CenteredForm;
