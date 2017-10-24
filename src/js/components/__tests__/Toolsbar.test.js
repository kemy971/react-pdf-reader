import React from 'react';
import { shallow } from 'enzyme';
import '../../testconfig/enzyme.config';
import ToolsBar from '../ToolsBar';
import Button from '../Button';

describe('<ToolsBar />', () => {
  it('Render toolsbar with defaults props', () => {
    const toolsbar = shallow(<ToolsBar
      currentPage={1}
      btnToggle={{
        label: 'toggle Panel',
      }}
      btnZoomIn={{
        label: 'Zoom In',
      }}
      btnZoomOut={{
        label: 'Zoom out',
      }}
      btnUp={{
        label: 'Up',
        classname: 'btn-up',
      }}
      btnDown={{
        label: 'Down',
        classname: 'btn-up',
      }}
      btnFitWidth={{
        label: 'Zoom fit',
      }}
      scrollToPageHandler={() => {}}
      zoomHandler={() => {}}
      toggleHandler={() => {}}
      pageCountLabel="On"
      numPages={10}
    />);

    expect(toolsbar.find(Button).length).toEqual(6);
  });
});
