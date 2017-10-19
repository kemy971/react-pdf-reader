import React from 'react';
import { render } from 'react-dom';
import './PdfReader.css';
import './TextLayerBuilder.css';
import PDFReader from './js/index';

const ToggleBtn = <button>toggle panel</button>;

render(
  <PDFReader
    file="/sample.pdf"
    renderType="canvas"
    btnToggle={ToggleBtn}
  />,
  document.getElementById('root'),
);
