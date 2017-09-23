import React from 'react';
import { shallow } from 'enzyme';
import { Header } from 'semantic-ui-react';
import AppMenu from '../AppMenu';
import MenuLink from '../AppMenu/MenuLink';
import { Roles } from '../const';

const ValidUser = {
  _id: 'abc123',
  name: 'Andrei',
  email: 'andrei.smirnov@toptal.com',
  role: Roles.User,
  disabled: false,
};

const ValidManager = {
  _id: 'abc123',
  name: 'Andrei',
  email: 'andrei.smirnov@toptal.com',
  role: Roles.Manager,
  disabled: false,
};

const getVisibleLinks = wrapper => wrapper.find(MenuLink).filter({ visible: true });

describe('<AppMenu />', () => {
  it('should render one <Header /> components', () => {
    const wrapper = shallow(<AppMenu user={null} />);
    expect(wrapper.find(Header).length).toBe(1);
  });

  it('should render /routes link for a valid user', () => {
    const wrapper = shallow(<AppMenu user={ValidUser} />);
    expect(getVisibleLinks(wrapper).find({ to: '/repairs' }).length).toBe(1);
  });

  it('should render /users link for a valid manager', () => {
    const wrapper = shallow(<AppMenu user={ValidManager} />);
    expect(getVisibleLinks(wrapper).find({ to: '/users' }).length).toBe(1);
  });

  it('should not render /users link for the user role', () => {
    const wrapper = shallow(<AppMenu user={ValidUser} />);
    expect(getVisibleLinks(wrapper).find({ to: '/users' }).length).toBe(0);
  });
});
