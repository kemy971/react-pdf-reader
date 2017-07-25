import React from 'react';
import ReactDOM from 'react-dom';
import './pdf-reader.css';
import './components/plugin/TextLayerBuilder.css'
import PDFReader from './components/PDFReader';

ReactDOM.render( <PDFReader 
    file="/sample.pdf" scale={1}  renderType="svg"/> ,
    document.getElementById('root'));
