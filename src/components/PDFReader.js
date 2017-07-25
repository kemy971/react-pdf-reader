import React, {Component} from "react"
import PropTypes from "prop-types";
import Velocity from 'velocity-animate'
import classnames from 'classnames'
import "pdfjs-dist/webpack"
import "pdfjs-dist/web/compatibility"
import Viewer from './Viewer'
import ThumbnailViewer from './ThumbnailViewer'
import Button from './Button'

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
        let context = document.querySelector('.pdf-viewer');
        Velocity(page, 'scroll', {
            container: context,
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
        const {width, rotate, btnToggle, btnUp, btnDown, btnZoomIn, btnZoomOut, loadingLabel, pageCountLabel} = this.props;
        console.log(btnToggle)
        return (
            <div className={classnames("pdf-reader", {"tumbnails-open": thumbnailsViewOpen})}>
                {
                    isLoading ?
                        <div className="pdf-loading">
                            <h3>{loadingLabel}</h3>
                        </div>
                        : null
                }
                {!pageLoading ?
                    <div>
                        <div className="pdf-reader-header">
                            <div className="toggle-sidebar">
                            <Button {...btnToggle} clickHandler={this.toggleThumbnailsView}/>
                            </div>
                            <div className="zoom-actions">
                                <Button {...btnZoomIn} clickHandler={this.zoomIn} />
                                <Button {...btnZoomOut} clickHandler={this.zoomOut} />
                            </div>
                            <span>
                                <strong className="count-page">
                                    <Button {...btnUp} clickHandler={() => this.scrollToPage(currentPage - 1)} />
                                    {currentPage + 1} {pageCountLabel} {pages.length || 0}
                                    <Button {...btnDown} clickHandler={() => this.scrollToPage(currentPage + 1)} />
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
    loadingLabel: "PDF Document Loading ...",
    pageCountLabel: "in"
};

PDFReader.propTypes = {
    file: PropTypes.string,
    rotate: PropTypes.number,
    scale: PropTypes.number,
    width: PropTypes.number,
    btnToggle: PropTypes.shape({
        label: PropTypes.string,
        classname: PropTypes.string,
        iconClassname: PropTypes.string,
        iconButton: PropTypes.bool
    }),
    btnUp: PropTypes.shape({
        label: PropTypes.string,
        classname: PropTypes.string,
        iconClassname: PropTypes.string,
        iconButton: PropTypes.bool
    }),
    btnDown: PropTypes.shape({
        label: PropTypes.string,
        classname: PropTypes.string,
        iconClassname: PropTypes.string,
        iconButton: PropTypes.bool
    }),
    btnZoomIn: PropTypes.shape({
        label: PropTypes.string,
        classname: PropTypes.string,
        iconClassname: PropTypes.string,
        iconButton: PropTypes.bool
    }),
    btnZoomOut: PropTypes.shape({
        label: PropTypes.string,
        classname: PropTypes.string,
        iconClassname: PropTypes.string,
        iconButton: PropTypes.bool
    }),
    loadingLabel: PropTypes.string,
    pageCountLabel: PropTypes.string

};

export default PDFReader;
