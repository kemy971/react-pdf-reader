import React, { Component } from "react";
import PropTypes from "prop-types";
import "pdfjs-dist/webpack";
import "pdfjs-dist/web/compatibility";
import Viewer from './Viewer'

const PDFJS = window.PDFJS;

class PDFReader extends Component {
  state = {
    pdf: {},
    pageLoading: true,
    isLoading: true,
  };

  componentWillMount() {
    this.loadDocument(this.props.file);
  }

  /**
     * Called when a document is loaded successfully.
     */
  onDocumentLoad = pdf => {
    this.setState({
      pdf
    });
    this.loadPages();
  };

  /**
     * Called when a document fails to load.
     */
  onDocumentError = error => {
    this.setState({
      pdf: false
    });
  };

  /**
   * Load document
   * @param {*} args 
   */
  loadDocument(...args) {
    PDFJS.getDocument(...args)
      .then(this.onDocumentLoad)
      .catch(this.onDocumentError);
  }

  loadPages() {
    let { pdf } = this.state;
    let pagesPromises = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      pagesPromises.push(pdf.getPage(i))
    }

    Promise.all(pagesPromises).then((pages) => {
        this.setState({pages: pages, pageLoading: false})
    })
  }

  viewLoaded = () => {
    this.setState({isLoading: false})
  };



  render() {
    const { pages, isLoading, pageLoading} = this.state;
      return (
          <div className="pdf-reader">
              {
                isLoading ?
                  <div className="pdf-loading">
                    <h3>PDF Document Loading ...</h3>
                  </div>
                  :null
              }
              {!pageLoading?
                  <Viewer pages={pages} onViewLoadComplete={this.viewLoaded} {...this.props}/>
                  :null
              }
          </div>
      );
  }
}

PDFReader.defaultProps = {
  rotate: 0,
  scale: 1
};

PDFReader.propTypes = {
  file: PropTypes.string,
  rotate: PropTypes.number,
  scale: PropTypes.number,
  width: PropTypes.number
};

export default PDFReader;
