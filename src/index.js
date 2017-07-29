import React from 'react';
import ReactDOM from 'react-dom';
import './pdf-reader.css';
import './js/plugin/TextLayerBuilder.css'
import PDFReader from './js/components/App.js';

let ToggleBtn = <button>toggle panel</button>;

ReactDOM.render( <PDFReader 
    file="/sample.pdf"  renderType="svg" btnToggle={ToggleBtn}/> ,
    document.getElementById('root'));
