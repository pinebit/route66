import React from 'react';
import { Header } from 'semantic-ui-react';

const AndreiSmirnovLink = () => (
  <a href="https://www.toptal.com/resume/andrei-smirnov" target="_blank" rel="noopener noreferrer">Andrei Smirnov</a>
);

const AppFooter = () => (
  <div style={{ marginTop: '1em' }}>
    <Header as="h6" floated="right" color="grey" size="tiny" sub>
      Developed by <AndreiSmirnovLink /> for Toptal React Academy.
    </Header>
  </div>
);

export default AppFooter;
