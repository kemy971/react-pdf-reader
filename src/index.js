import React from 'react';
import { render } from 'react-dom';
import './PdfReader.css';
import './TextLayerBuilder.css';
import PDFReader from './js/index';

render(
  <PDFReader
    file="/sample.pdf"
    renderType="canvas"
  />,
  document.getElementById('root'),
);
