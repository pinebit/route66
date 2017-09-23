import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DisabledView from '../DisabledView';

describe('<DisabledView />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<DisabledView />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
