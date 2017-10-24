import React from 'react';
import { shallow } from 'enzyme';
import '../../testconfig/enzyme.config';
import Button from '../Button';

describe('<Button />', () => {
  it('Render button with label', () => {
    const button = shallow(<Button label="text" clickHandler={() => {}} />);
    expect(button.text()).toEqual('text');
    expect(button.contains(<i className="icon-text" />)).toEqual(false);
  });

  it('Render button with icon and label', () => {
    const button = shallow(<Button label="text" iconClassname="icon-text" clickHandler={() => {}} />);
    expect(button.text()).toEqual('text');
    expect(button.contains(<i className="icon-text" />)).toEqual(true);
  });

  it('Render button with icon only', () => {
    const button = shallow(<Button iconClassname="icon-text" iconButton clickHandler={() => {}} />);
    expect(button.text()).toEqual('');
    expect(button.contains(<i className="icon-text" />)).toEqual(true);
  });

  it('Render button primary class', () => {
    const button = shallow(<Button iconClassname="icon-text" classname="btn-primary" iconButton clickHandler={() => {}} />);
    expect(button.text()).toEqual('');
    expect(button.contains(<i className="icon-text" />)).toEqual(true);
    expect(button.hasClass('btn-primary')).toEqual(true);
  });
});
