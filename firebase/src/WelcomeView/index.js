import React from 'react';
import { Segment, Header, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const WelcomeView = () => (
  <Segment textAlign="center" padded="very" piled>
    <Header as="h1">
      Welcome to ROUTE66 Car Repair Shop!
    </Header>
    <Message>
      If you are the first time user, then <Link to="/signup">Sign Up</Link> to create your account.
            Otherwise, please <Link to="/signin">Sign In</Link> to authenticate yourself.
    </Message>
  </Segment>
);

export default WelcomeView;
