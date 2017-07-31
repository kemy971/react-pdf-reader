import React from 'react';
import ReactDOM from 'react-dom';
import './PdfReader.css';
import './TextLayerBuilder.css'
import PDFReader from './js/index.js';

let ToggleBtn = <button>toggle panel</button>;

ReactDOM.render( <PDFReader 
    file="/sample.pdf"  renderType="canvas" btnToggle={ToggleBtn}/> ,
    document.getElementById('root'));
