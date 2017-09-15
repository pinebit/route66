import React from 'react';
import {
  Menu,
  Header,
  Image,
} from 'semantic-ui-react';
import Gravatar from 'react-gravatar';
import logoIcon from '../img/logo.svg';
import MenuLink from './MenuLink';
import { userRecordShape } from '../shapes';
import { Roles } from '../const';

const AppMenu = ({ user }) => {
  const enabled = user ? !user.disabled : false;

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
      <MenuLink to="/repairs" visible={enabled}>
        Repairs
      </MenuLink>
      <MenuLink to="/users" visible={enabled && user.role !== Roles.User}>
        Users
      </MenuLink>
      <Menu.Menu position="right">
        <MenuLink to="/profile" visible={enabled}>
          {user &&
            <Image avatar>
              <Gravatar email={user.email} size={64} />
            </Image>
          }
          {user ? (user.displayName || user.email) : ''}
        </MenuLink>
        <MenuLink to="/signout" visible={enabled}>
          Sign Out
        </MenuLink>
        <MenuLink to="/signin" visible={!enabled}>
          Sign In
        </MenuLink>
        <MenuLink to="/signup" visible={!enabled}>
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
  user: userRecordShape,
};

export default AppMenu;
