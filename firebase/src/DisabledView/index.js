import React from 'react';
import { Segment, Header } from 'semantic-ui-react';

const DisabledView = () => (
  <Segment textAlign="center" padded="very" piled>
    <Header as="h2" color="red">
            Your account is disabled. Please contact any Manager to enable your account.
    </Header>
  </Segment>
);

export default DisabledView;
