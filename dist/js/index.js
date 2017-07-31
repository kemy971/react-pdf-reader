"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _Viewport = require("./lib/Viewport");

var _Viewer = require("./components/Viewer");

var _Viewer2 = _interopRequireDefault(_Viewer);

var _ThumbnailViewer = require("./components/ThumbnailViewer");

var _ThumbnailViewer2 = _interopRequireDefault(_ThumbnailViewer);

var _ToolsBar = require("./components/ToolsBar");

var _ToolsBar2 = _interopRequireDefault(_ToolsBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
      pages: [],
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
    key: "render",
    value: function render() {
      var _state2 = this.state,
          pages = _state2.pages,
          isLoading = _state2.isLoading,
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
          btnFitWidth = _props.btnFitWidth,
          loadingLabel = _props.loadingLabel,
          pageCountLabel = _props.pageCountLabel,
          renderType = _props.renderType;


      return _react2.default.createElement(
        "div",
        {
          className: (0, _classnames2.default)("pdf-reader", {
            "tumbnails-open": thumbnailsViewOpen
          })
        },
        isLoading ? _react2.default.createElement(
          "div",
          { className: "pdf-loading" },
          _react2.default.createElement(
            "h3",
            null,
            loadingLabel
          )
        ) : _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(_ToolsBar2.default, {
            btnToggle: btnToggle,
            toggleHandler: this.toggleThumbnailsView,
            btnUp: btnUp,
            btnDown: btnDown,
            scrollToPageHandler: this.scrollToPage,
            btnZoomIn: btnZoomIn,
            btnZoomOut: btnZoomOut,
            btnFitWidth: btnFitWidth,
            zoomHandler: this.zoom,
            currentPage: currentPage,
            numPages: pages.length,
            pageCountLabel: pageCountLabel
          }),
          _react2.default.createElement(_ThumbnailViewer2.default, {
            pages: pages,
            currentPage: currentPage,
            onSelect: this.scrollToPage
          }),
          _react2.default.createElement(_Viewer2.default, {
            pages: pages,
            onPageChange: this.changePage,
            scale: scale,
            rotate: rotate,
            width: width,
            renderType: renderType
          })
        )
      );
    }
  }]);

  return PDFReader;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onDocumentLoad = function (pdf) {
    _this2.setState({
      pdf: pdf
    });
    _this2.loadFirstPage();
  };

  this.onDocumentError = function (error) {
    _this2.setState({
      pdf: false
    });
  };

  this.loadFirstPage = function () {
    var pdf = _this2.state.pdf;


    pdf.getPage(1).then(function (page) {
      _this2.setState(function (_state) {
        return { pages: [].concat(_toConsumableArray(_state.pages), [page]), isLoading: false };
      }, function () {
        _this2.loadPages();
      });
    });
  };

  this.loadPages = function () {
    var _state3 = _this2.state,
        pdf = _state3.pdf,
        pages = _state3.pages;

    var pagesPromises = [];
    console.log(pages);

    for (var i = 2; i <= pdf.numPages; i++) {
      pagesPromises.push(pdf.getPage(i));
    }

    Promise.all(pagesPromises).then(function (pages) {
      _this2.setState(function (_state) {
        return { pages: [].concat(_toConsumableArray(_state.pages), _toConsumableArray(pages)), isLoading: false };
      });
    });
  };

  this.zoom = function (direction) {
    var _state4 = _this2.state,
        scale = _state4.scale,
        pages = _state4.pages;

    var container = document.querySelector(".pdf-viewer");
    _this2.minZoomScale = (0, _Viewport.getMinZoomScale)(pages[0], container);

    switch (direction) {
      case "in":
        _this2.setState({ scale: scale + 0.1 });
        break;
      case "out":
        _this2.setState(function (_state) {
          return {
            scale: _state.scale - 0.1 > _this2.minZoomScale ? _state.scale - 0.1 : _this2.minZoomScale
          };
        });
        break;
      case "fitWidth":
        _this2.setState({ scale: (0, _Viewport.getFitWidthScale)(pages[0], container) });
        break;
    }
  };

  this.changePage = function (pageIndex) {
    _this2.setState({ currentPage: pageIndex });
  };

  this.scrollToPage = function (pageIndex) {
    var page = document.getElementById("pdf-page-" + pageIndex);
    var context = document.querySelector(".pdf-viewer");
    (0, _velocityAnimate2.default)(page, "scroll", {
      container: context,
      duration: 0,
      queue: false
    });
  };

  this.onLoaded = function () {
    _this2.props.onViewLoadComplete();
  };

  this.toggleThumbnailsView = function () {
    _this2.setState(function (_state) {
      return { thumbnailsViewOpen: !_state.thumbnailsViewOpen };
    });
  };
};

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
  file: _propTypes2.default.string,
  rotate: _propTypes2.default.number,
  renderType: _propTypes2.default.string,
  scale: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  width: _propTypes2.default.number,
  btnToggle: _propTypes2.default.oneOfType([_propTypes2.default.shape({
    label: _propTypes2.default.string,
    classname: _propTypes2.default.string,
    iconClassname: _propTypes2.default.string,
    iconButton: _propTypes2.default.bool
  }), _propTypes2.default.element]),
  btnUp: _propTypes2.default.oneOfType([_propTypes2.default.shape({
    label: _propTypes2.default.string,
    classname: _propTypes2.default.string,
    iconClassname: _propTypes2.default.string,
    iconButton: _propTypes2.default.bool
  }), _propTypes2.default.element]),
  btnDown: _propTypes2.default.oneOfType([_propTypes2.default.shape({
    label: _propTypes2.default.string,
    classname: _propTypes2.default.string,
    iconClassname: _propTypes2.default.string,
    iconButton: _propTypes2.default.bool
  }), _propTypes2.default.element]),
  btnZoomIn: _propTypes2.default.oneOfType([_propTypes2.default.shape({
    label: _propTypes2.default.string,
    classname: _propTypes2.default.string,
    iconClassname: _propTypes2.default.string,
    iconButton: _propTypes2.default.bool
  }), _propTypes2.default.element]),
  btnZoomOut: _propTypes2.default.oneOfType([_propTypes2.default.shape({
    label: _propTypes2.default.string,
    classname: _propTypes2.default.string,
    iconClassname: _propTypes2.default.string,
    iconButton: _propTypes2.default.bool
  }), _propTypes2.default.element]),
  btnFitWidth: _propTypes2.default.oneOfType([_propTypes2.default.shape({
    label: _propTypes2.default.string,
    classname: _propTypes2.default.string,
    iconClassname: _propTypes2.default.string,
    iconButton: _propTypes2.default.bool
  }), _propTypes2.default.element]),
  loadingLabel: _propTypes2.default.string,
  pageCountLabel: _propTypes2.default.string
};

exports.default = PDFReader;