import React, {Component} from "react"
import PropTypes from "prop-types";
import Velocity from 'velocity-animate'
import classnames from 'classnames'
import "pdfjs-dist/webpack"
import "pdfjs-dist/web/compatibility"
import Viewer from './Viewer'
import ThumbnailViewer from './ThumbnailViewer'

const PDFJS = window.PDFJS;

class PDFReader extends Component {
    constructor(props) {
        super(props);
        const {scale, currentPage} = props;
        this.state = {
            pdf: {},
            pageLoading: true,
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

    loadPages() {
        let {pdf} = this.state;
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

    zoomIn = () => {
        let {scale} = this.state;
        this.setState({scale: scale + .1})
    };

    zoomOut = () => {
        this.setState(_state => ({scale: _state.scale - .1 > 0 ? _state.scale - .1 : 0 }))
    };

    changePage = (pageIndex) => {
        this.setState({currentPage: pageIndex});
    };

    scrollToPage = (pageIndex) => {
        let page = document.getElementById(`pdf-page-${pageIndex}`);
        Velocity(page, 'scroll', {
            duration: 300,
            queue: false
        });
    };

    onLoaded = () => {
        this.props.onViewLoadComplete()
    };

    toggleThumbnailsView = () => {
        this.setState(_state => ({thumbnailsViewOpen: !_state.thumbnailsViewOpen}))
    };

    render() {
        const {pages, isLoading, pageLoading, currentPage, scale, thumbnailsViewOpen} = this.state;
        const {width, rotate} = this.props;
        return (
            <div className={classnames("pdf-reader", {"tumbnails-open": thumbnailsViewOpen})}>
                {
                    isLoading ?
                        <div className="pdf-loading">
                            <h3>PDF Document Loading ...</h3>
                        </div>
                        : null
                }
                {!pageLoading ?
                    <div>
                        <div className="pdf-reader-header">
                            <div className="toggle-sidebar">
                                <button onClick={this.toggleThumbnailsView}>Toggle
                                    Thumbnails
                                </button>
                            </div>
                            <div className="zoom-actions">
                                <button onClick={this.zoomIn}>Zoom +</button>
                                <button onClick={this.zoomOut}>Zoom -</button>
                            </div>
                            <span>
                                <strong className="count-page">
                                    <button onClick={() => this.scrollToPage(currentPage - 1)}>up</button>
                                    {currentPage + 1} sur {pages.length || 0}
                                    <button onClick={() => this.scrollToPage(currentPage + 1)}>down</button>
                                </strong>
                            </span>
                        </div>
                        <ThumbnailViewer pages={pages} currentPage={currentPage} onSelect={this.scrollToPage}
                                         onLoaded={this.viewLoaded}/>
                        <Viewer pages={pages} onPageChange={this.changePage} scale={scale} rotate={rotate}
                                width={width}/>
                    </div>
                    : null
                }
            </div>
        );
    }
}

PDFReader.defaultProps = {
    rotate: 0,
    scale: 1,
    currentPage: 0
};

PDFReader.propTypes = {
    file: PropTypes.string,
    rotate: PropTypes.number,
    scale: PropTypes.number,
    width: PropTypes.number
};

export default PDFReader;
