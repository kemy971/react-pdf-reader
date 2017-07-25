"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _velocityAnimate = require("velocity-animate");

var _velocityAnimate2 = _interopRequireDefault(_velocityAnimate);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

require("pdfjs-dist/webpack");

require("pdfjs-dist/web/compatibility");

var _Viewer = require("./Viewer");

var _Viewer2 = _interopRequireDefault(_Viewer);

var _ThumbnailViewer = require("./ThumbnailViewer");

var _ThumbnailViewer2 = _interopRequireDefault(_ThumbnailViewer);

var _Button = require("./Button");

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PDFJS = window.PDFJS;

var PDFReader = function (_Component) {
    _inherits(PDFReader, _Component);

    function PDFReader(props) {
        _classCallCheck(this, PDFReader);

        var _this = _possibleConstructorReturn(this, (PDFReader.__proto__ || Object.getPrototypeOf(PDFReader)).call(this, props));

        _initialiseProps.call(_this);

        var scale = props.scale,
            currentPage = props.currentPage;

        _this.state = {
            pdf: {},
            pageLoading: true,
            isLoading: true,
            currentPage: currentPage,
            scale: scale,
            thumbnailsViewOpen: true
        };
        return _this;
    }

    _createClass(PDFReader, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.loadDocument(this.props.file);
        }

        /**
         * Load document
         * @param {*} args
         */

    }, {
        key: "loadDocument",
        value: function loadDocument() {
            PDFJS.getDocument.apply(PDFJS, arguments).then(this.onDocumentLoad).catch(this.onDocumentError);
        }

        /**
         * Called when a document is loaded successfully.
         */


        /**
         * Called when a document fails to load.
         */

    }, {
        key: "loadPages",
        value: function loadPages() {
            var _this2 = this;

            var pdf = this.state.pdf;

            var pagesPromises = [];

            for (var i = 1; i <= pdf.numPages; i++) {
                pagesPromises.push(pdf.getPage(i));
            }

            Promise.all(pagesPromises).then(function (pages) {
                _this2.setState({ pages: pages, pageLoading: false });
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var _state2 = this.state,
                pages = _state2.pages,
                isLoading = _state2.isLoading,
                pageLoading = _state2.pageLoading,
                currentPage = _state2.currentPage,
                scale = _state2.scale,
                thumbnailsViewOpen = _state2.thumbnailsViewOpen;
            var _props = this.props,
                width = _props.width,
                rotate = _props.rotate,
                btnToggle = _props.btnToggle,
                btnUp = _props.btnUp,
                btnDown = _props.btnDown,
                btnZoomIn = _props.btnZoomIn,
                btnZoomOut = _props.btnZoomOut,
                loadingLabel = _props.loadingLabel,
                pageCountLabel = _props.pageCountLabel;

            console.log(btnToggle);
            return _react2.default.createElement(
                "div",
                { className: (0, _classnames2.default)("pdf-reader", { "tumbnails-open": thumbnailsViewOpen }) },
                isLoading ? _react2.default.createElement(
                    "div",
                    { className: "pdf-loading" },
                    _react2.default.createElement(
                        "h3",
                        null,
                        loadingLabel
                    )
                ) : null,
                !pageLoading ? _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement(
                        "div",
                        { className: "pdf-reader-header" },
                        _react2.default.createElement(
                            "div",
                            { className: "toggle-sidebar" },
                            _react2.default.createElement(_Button2.default, _extends({}, btnToggle, { clickHandler: this.toggleThumbnailsView }))
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "zoom-actions" },
                            _react2.default.createElement(_Button2.default, _extends({}, btnZoomIn, { onClick: this.zoomIn })),
                            _react2.default.createElement(_Button2.default, _extends({}, btnZoomOut, { onClick: this.zoomOut }))
                        ),
                        _react2.default.createElement(
                            "span",
                            null,
                            _react2.default.createElement(
                                "strong",
                                { className: "count-page" },
                                _react2.default.createElement(_Button2.default, _extends({}, btnUp, { onClick: function onClick() {
                                        return _this3.scrollToPage(currentPage - 1);
                                    } })),
                                currentPage + 1,
                                " ",
                                pageCountLabel,
                                " ",
                                pages.length || 0,
                                _react2.default.createElement(_Button2.default, _extends({}, btnDown, { onClick: function onClick() {
                                        return _this3.scrollToPage(currentPage + 1);
                                    } }))
                            )
                        )
                    ),
                    _react2.default.createElement(_ThumbnailViewer2.default, { pages: pages, currentPage: currentPage, onSelect: this.scrollToPage,
                        onLoaded: this.viewLoaded }),
                    _react2.default.createElement(_Viewer2.default, { pages: pages, onPageChange: this.changePage, scale: scale, rotate: rotate,
                        width: width })
                ) : null
            );
        }
    }]);

    return PDFReader;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
    var _this4 = this;

    this.onDocumentLoad = function (pdf) {
        _this4.setState({
            pdf: pdf
        });
        _this4.loadPages();
    };

    this.onDocumentError = function (error) {
        _this4.setState({
            pdf: false
        });
    };

    this.viewLoaded = function () {
        _this4.setState({ isLoading: false });
    };

    this.zoomIn = function () {
        var scale = _this4.state.scale;

        _this4.setState({ scale: scale + .1 });
    };

    this.zoomOut = function () {
        _this4.setState(function (_state) {
            return { scale: _state.scale - .1 > 0 ? _state.scale - .1 : 0 };
        });
    };

    this.changePage = function (pageIndex) {
        _this4.setState({ currentPage: pageIndex });
    };

    this.scrollToPage = function (pageIndex) {
        var page = document.getElementById("pdf-page-" + pageIndex);
        var context = document.querySelector('.pdf-viewer');
        (0, _velocityAnimate2.default)(page, 'scroll', {
            container: context,
            duration: 300,
            queue: false
        });
    };

    this.onLoaded = function () {
        _this4.props.onViewLoadComplete();
    };

    this.toggleThumbnailsView = function () {
        _this4.setState(function (_state) {
            return { thumbnailsViewOpen: !_state.thumbnailsViewOpen };
        });
    };
};

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
    file: _propTypes2.default.string,
    rotate: _propTypes2.default.number,
    scale: _propTypes2.default.number,
    width: _propTypes2.default.number,
    btnToggle: _propTypes2.default.shape({
        label: _propTypes2.default.string,
        classname: _propTypes2.default.string,
        iconClassname: _propTypes2.default.string,
        iconButton: _propTypes2.default.bool
    }),
    btnUp: _propTypes2.default.shape({
        label: _propTypes2.default.string,
        classname: _propTypes2.default.string,
        iconClassname: _propTypes2.default.string,
        iconButton: _propTypes2.default.bool
    }),
    btnDown: _propTypes2.default.shape({
        label: _propTypes2.default.string,
        classname: _propTypes2.default.string,
        iconClassname: _propTypes2.default.string,
        iconButton: _propTypes2.default.bool
    }),
    btnZoomIn: _propTypes2.default.shape({
        label: _propTypes2.default.string,
        classname: _propTypes2.default.string,
        iconClassname: _propTypes2.default.string,
        iconButton: _propTypes2.default.bool
    }),
    btnZoomOut: _propTypes2.default.shape({
        label: _propTypes2.default.string,
        classname: _propTypes2.default.string,
        iconClassname: _propTypes2.default.string,
        iconButton: _propTypes2.default.bool
    }),
    loadingLabel: _propTypes2.default.string,
    pageCountLabel: _propTypes2.default.string

};

exports.default = PDFReader;