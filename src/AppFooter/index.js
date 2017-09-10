import React from 'react';
import { Header } from 'semantic-ui-react';

const AndreiSmirnovLink = () => (
  <a href="https://www.toptal.com/resume/andrei-smirnov" target="_blank" rel="noopener noreferrer">Andrei Smirnov</a>
);

const AppFooter = () => (
  <Header as="p" floated="right" color="grey" size="tiny">
    <pre>Developed by <AndreiSmirnovLink /> for Toptal React Academy.</pre>
  </Header>
);

export default AppFooter;
