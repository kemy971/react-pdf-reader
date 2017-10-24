# React PDF Reader
[![npm version](https://badge.fury.io/js/react-pdf-reader.svg)](https://badge.fury.io/js/react-pdf-reader)
![Travis build](https://travis-ci.org/kemy971/react-pdf-reader.svg?branch=feature%2Ftravisci)
[![CircleCI](https://circleci.com/gh/kemy971/react-pdf-reader.svg?style=svg)](https://circleci.com/gh/kemy971/react-pdf-reader)

A React component to read PDF Document.

## Installation

### npm

```bash
npm install react-pdf-reader --save
```

### yarn

```bash
yarn add react-pdf-reader
```

## Usage
Import the component in your React app :
```js
import PDFReader from "react-pdf-reader";
```

```jsx
<PDFReader
    file="pdf/sample.pdf"
    renderType="canvas"
/>
```

Import TextLayer stylesheet : 
```js
import "react-pdf-reader/dist/TextLayerBuilder.css";
//OR 
import "react-pdf-reader/dist/sass/TextLayerBuilder.scss";
```
Or copy `/node_modules/react-pdf-reader/dist/TextLayerBuilder.css` in your static files folder and import :
```html
<link rel="stylesheet" href="css/TextLayerBuilder.css" />
```

Import default reader stylesheet ( Optional but recommended :) )  : 
```js
import "react-pdf-reader/dist/PdfReader.css";
//OR 
import "react-pdf-reader/dist/sass/PdfReader.scss";
```
Or copy `/node_modules/react-pdf-reader/dist/PdfReader.css` in your static files folder and import :
```html
<link rel="stylesheet" href="css/PdfReader.css" />
```

## Prop types
Prop|Description|Sample
 --- | --- | ---
file| Define the url of the PDF Document.|`file="pdf/sample.pdf"`
renderType| Define the type of the PDF display render. You have the choice between "canvas" and "svg". Default : `svg`|<ul><li> Make render by SVG :<br/> `renderType="svg"`</li><br/><li>Make render by canvas : <br/> `renderType="canvas"`</li></ul>
