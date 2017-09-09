import React from 'react';
import {
  Menu,
  Header,
  Image,
} from 'semantic-ui-react';
import Gravatar from 'react-gravatar';
import logoIcon from '../img/logo.svg';
import MenuLink from './MenuLink';
import * as proptypes from '../proptypes';

const AppMenu = ({ user }) => {
  const authenticated = !!user;

  return (
    <Menu pointing size="large">
      <Menu.Item header>
        <Header
          as="h1"
          style={{ fontSize: '1.5em', fontWeight: 'bold' }}
          image={logoIcon}
          content="Car Repair Shop"
        />
      </Menu.Item>
      <MenuLink to="/repairs" visible={authenticated}>
        Repairs
      </MenuLink>
      <MenuLink to="/users" visible={authenticated}>
        Users
      </MenuLink>
      <Menu.Menu position="right">
        <MenuLink to="/profile" visible={authenticated}>
          {user &&
            <Image avatar>
              <Gravatar email={user.email} size={64} />
            </Image>
          }
          {user ? (user.displayName || user.email) : ''}
        </MenuLink>
        <MenuLink to="/signout" visible={authenticated}>
          Sign Out
        </MenuLink>
        <MenuLink to="/signin" visible={!authenticated}>
          Sign In
        </MenuLink>
        <MenuLink to="/signup" visible={!authenticated}>
          Sign Up
        </MenuLink>
      </Menu.Menu>
    </Menu>
  );
};

AppMenu.defaultProps = {
  user: null,
};

AppMenu.propTypes = {
  user: proptypes.firebaseUser,
};

export default AppMenu;
