import React, { Component } from "react";
import PropTypes from "prop-types";
import Velocity from "velocity-animate";
import classnames from "classnames";
import "pdfjs-dist/webpack";
import "pdfjs-dist/web/compatibility";
import {getMinZoomScale, getFitWidthScale} from './lib/Viewport'
import Viewer from "./components/Viewer";
import ThumbnailViewer from "./components/ThumbnailViewer";
import ToolsBar from './components/ToolsBar';

const PDFJS = window.PDFJS;

class PDFReader extends Component {
  constructor(props) {
    super(props);
    const { scale, currentPage } = props;
    this.state = {
      pdf: {},
      pages: [],
      isLoading: true,
      currentPage: currentPage,
      scale: scale,
      thumbnailsViewOpen: true
    };
  }

  componentWillMount() {
    this.loadDocument(this.props.file);
  }

  /**
     * Load document
     * @param {*} args
     */
  loadDocument(...args) {
    PDFJS.getDocument(...args)
      .then(this.onDocumentLoad)
      .catch(this.onDocumentError);
  }

  /**
     * Called when a document is loaded successfully.
     */
  onDocumentLoad = pdf => {
    this.setState({
      pdf
    });
    this.loadFirstPage();
  };

  /**
     * Called when a document fails to load.
     */
  onDocumentError = error => {
    this.setState({
      pdf: false
    });
  };

  loadFirstPage = () => {
    let { pdf } = this.state;

    pdf.getPage(1)
    .then( page => {
      this.setState(_state => ({pages: [..._state.pages,page], isLoading: false}),() => {
        this.loadPages()
      })
    })
  }


  loadPages = () => {
    let { pdf, pages } = this.state;
    let pagesPromises = [];
    console.log(pages)

    for (let i = 2; i <= pdf.numPages; i++) {
      pagesPromises.push(pdf.getPage(i));
    }

    Promise.all(pagesPromises).then(pages => {
      this.setState(_state => ({ pages: [..._state.pages,...pages], isLoading: false }));
    });
  }

  zoom = (direction) => {
    let { scale , pages} = this.state;
    let container = document.querySelector(".pdf-viewer");
    this.minZoomScale = getMinZoomScale(pages[0],container);

    switch(direction){
      case "in":
        this.setState({ scale: scale + 0.1 });
        break;
      case "out":
        this.setState(_state => ({
          scale: _state.scale - 0.1 > this.minZoomScale ? _state.scale - 0.1 : this.minZoomScale
        }));
        break;
      case "fitWidth":
        this.setState({scale: getFitWidthScale(pages[0], container)});
        break;
    }
  };

  changePage = pageIndex => {
    this.setState({ currentPage: pageIndex });
  };

  scrollToPage = pageIndex => {
    let page = document.getElementById(`pdf-page-${pageIndex}`);
    let context = document.querySelector(".pdf-viewer");
    Velocity(page, "scroll", {
      container: context,
      duration: 0,
      queue: false
    });
  };

  onLoaded = () => {
    this.props.onViewLoadComplete();
  };

      toggleThumbnailsView = () => {
        this.setState(_state => ({thumbnailsViewOpen: !_state.thumbnailsViewOpen}))
    };

  render() {
    const {
      pages,
      isLoading,
      currentPage,
      scale,
      thumbnailsViewOpen
    } = this.state;

    const {
      width,
      rotate,
      btnToggle,
      btnUp,
      btnDown,
      btnZoomIn,
      btnZoomOut,
      btnFitWidth,
      loadingLabel,
      pageCountLabel,
      renderType
    } = this.props;

    return (
      <div
        className={classnames("pdf-reader", {
          "tumbnails-open": thumbnailsViewOpen
        })}
      >
        {isLoading
          ? <div className="pdf-loading">
              <h3>
                {loadingLabel}
              </h3>
            </div>
          : <div>
          <ToolsBar 
            btnToggle={btnToggle}
            toggleHandler={this.toggleThumbnailsView} 
            btnUp={btnUp}
            btnDown={btnDown}
            scrollToPageHandler={this.scrollToPage}
            btnZoomIn={btnZoomIn}
            btnZoomOut={btnZoomOut}
            btnFitWidth={btnFitWidth}
            zoomHandler={this.zoom}
            currentPage={currentPage}
            numPages={pages.length}
            pageCountLabel={pageCountLabel}
            />
              <ThumbnailViewer
                pages={pages}
                currentPage={currentPage}
                onSelect={this.scrollToPage}
              />
              <Viewer
                pages={pages}
                onPageChange={this.changePage}
                scale={scale}
                rotate={rotate}
                width={width}
                renderType={renderType}
              />
            </div>}
      </div>
    );
  }
}

PDFReader.defaultProps = {
  rotate: 0,
  scale: 1,
  renderType: "canvas",
  currentPage: 0,
  btnToggle: {
    label: "toggle thumbnails"
  },
  btnUp: {
    label: "Up"
  },
  btnDown: {
    label: "Down"
  },
  btnZoomIn: {
    label: "Zoom In"
  },
  btnZoomOut: {
    label: "Zoom Out"
  },
  btnFitWidth: {
    label: "Fit Width"
  },
  loadingLabel: "PDF Document Loading ...",
  pageCountLabel: "in"
};

PDFReader.propTypes = {
  file: PropTypes.string,
  rotate: PropTypes.number,
  renderType: PropTypes.string,
  scale: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  width: PropTypes.number,
  btnToggle: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool
    }),
    PropTypes.element
  ]),
  btnUp: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool
    }),
    PropTypes.element
  ]),
  btnDown: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool
    }),
    PropTypes.element
  ]),
  btnZoomIn: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool
    }),
    PropTypes.element
  ]),
  btnZoomOut: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool
    }),
    PropTypes.element
  ]),
  btnFitWidth: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool
    }),
    PropTypes.element
  ]),
  loadingLabel: PropTypes.string,
  pageCountLabel: PropTypes.string
};

export default PDFReader;
