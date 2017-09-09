import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

const MenuLink = ({ to, children, location, visible }) => (
  visible
    ?
    (
      <Menu.Item as={Link} to={to} active={location.pathname === to}>
        {children}
      </Menu.Item>
    )
    :
    null
);

MenuLink.defaultProps = {
  visible: false,
};

MenuLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  location: PropTypes.string.isRequired,
  visible: PropTypes.bool,
};

export default withRouter(MenuLink);
