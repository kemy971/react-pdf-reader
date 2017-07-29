# React PDF Reader
A React component to read PDF Document.


## Usage
```jsx
import PDFReader from "react-pdf-reader";
```

```jsx
<PDFReader
file="pdf/sample.pdf"
/>
```

## Prop types
Prop|Description|Sample
 --- | --- | ---
file| Define the url of the PDF Document.|`file="pdf/sample.pdf"`
renderType| Define the type of the PDF display render. You have the choice between "canvas" and "svg"|<ul><li> Make render by SVG :<br/> `renderType="svg"`</li><br/><li>Make render by canvas : <br/> `renderType="canvas"`</li></ul>
