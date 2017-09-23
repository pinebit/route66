import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import WelcomeView from '../WelcomeView';

describe('<DisabledView />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<WelcomeView />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

