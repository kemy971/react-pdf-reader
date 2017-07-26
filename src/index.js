import React from 'react';
import ReactDOM from 'react-dom';
import './pdf-reader.css';
import './components/plugin/TextLayerBuilder.css'
import PDFReader from './components/PDFReader';

let ToggleBtn = <button>toggle panel</button>;

ReactDOM.render( <PDFReader 
    file="/sample.pdf" scale={1}  renderType="svg" btnToggle={ToggleBtn}/> ,
    document.getElementById('root'));
