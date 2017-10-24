'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('pdfjs-dist/build/pdf.combined');

require('pdfjs-dist/web/compatibility');

require('waypoints/lib/noframework.waypoints');

require('waypoints/lib/shortcuts/inview');

var _Viewport = require('../lib/Viewport');

var _TextLayerBuilder = require('../lib/TextLayerBuilder');

var _TextLayerBuilder2 = _interopRequireDefault(_TextLayerBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window = window,
    PDFJS = _window.PDFJS,
    Waypoint = _window.Waypoint;

var Page = function (_Component) {
  _inherits(Page, _Component);

  function Page(props) {
    _classCallCheck(this, Page);

    var _this = _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).call(this, props));

    _this.getViewport = function () {
      var page = _this.props.page;
      var scale = _this.state.scale;

      var rotate = _this.props.rotate || 0;

      return (0, _Viewport.getViewport)(page, scale, rotate);
    };

    _this.refreshWaypoints = function () {
      Waypoint.refreshAll();
    };

    _this.initWaypoint = function (pageHeight) {
      var _this$props = _this.props,
          page = _this$props.page,
          onVisibleOnViewport = _this$props.onVisibleOnViewport;

      var context = document.querySelector('.pdf-viewer');
      _this.waypoints = [new Waypoint({
        offset: pageHeight / 4,
        element: _this._page,
        context: context,
        handler: function handler(direction) {
          if (direction === 'down') {
            onVisibleOnViewport(page.pageIndex);
          }
        }
      }), new Waypoint({
        offset: -pageHeight / 3,
        element: _this._page,
        context: context,
        handler: function handler(direction) {
          if (direction === 'up') {
            onVisibleOnViewport(page.pageIndex);
          }
        }
      }), new Waypoint.Inview({
        element: _this._page,
        context: context,
        enter: function enter() {
          _this.setState({ isInview: true }, function () {
            if (!_this.pageRendered) {
              _this.renderPage();
            } else if (_this.state.scaleChange) {
              _this.setState({ scaleChange: false }, function () {
                _this.renderPage();
              });
            }
          });
        },
        exited: function exited() {
          _this.setState({ isInview: false });
        }
      })];
    };

    _this.cleanPage = function () {
      if (_this.props.renderType === 'svg') {
        _this._svg.innerHTML = '';
      } else {
        var ctx = _this._canvas.getContext('2d');
        ctx.clearRect(0, 0, _this._canvas.width, _this._canvas.height);
      }
    };

    _this.initPage = function () {
      var _this$getViewport = _this.getViewport(),
          viewport = _this$getViewport.viewport,
          viewportDefaultRatio = _this$getViewport.viewportDefaultRatio;

      _this.renderPagePlaceholder(viewportDefaultRatio);
      _this.initWaypoint(viewport.height);
    };

    _this.updatePage = function () {
      _this.renderPagePlaceholder(_this.getViewport().viewportDefaultRatio);
      _this.refreshWaypoints();
      _this.cleanPage();
      if (_this.state.isInview) {
        _this.renderPage();
      } else {
        _this.setState({ scaleChange: true });
      }
    };

    _this.renderPage = function () {
      var _this$props2 = _this.props,
          page = _this$props2.page,
          renderType = _this$props2.renderType;

      var viewports = _this.getViewport();
      var pixelRatio = window.devicePixelRatio || 1;

      _this.renderPagePlaceholder(viewports.viewportDefaultRatio);
      if (renderType === 'svg') {
        _this.renderPageSVG(page, pixelRatio, viewports);
      } else {
        _this.renderPageCanvas(page, pixelRatio, viewports);
      }

      _this.renderTextLayer(page, viewports.viewportDefaultRatio);

      _this.pageRendered = true;
    };

    _this.renderPagePlaceholder = function (viewportDefaultRatio) {
      _this._page.style.width = viewportDefaultRatio.width + 'px';
      _this._page.style.height = viewportDefaultRatio.height + 'px';
    };

    _this.renderPageSVG = function (page, pixelRatio, _ref) {
      var viewportDefaultRatio = _ref.viewportDefaultRatio;

      _this._svg.style.width = viewportDefaultRatio.width + 'px';
      _this._svg.style.height = viewportDefaultRatio.height + 'px';

      // SVG rendering by PDF.js
      page.getOperatorList().then(function (opList) {
        var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
        return svgGfx.getSVG(opList, viewportDefaultRatio);
      }).then(function (svg) {
        _this._svg.innerHTML = '';
        _this._svg.appendChild(svg);
      });
    };

    _this.renderPageCanvas = function (page, pixelRatio, _ref2) {
      var viewport = _ref2.viewport;

      _this._canvas.height = viewport.height;
      _this._canvas.width = viewport.width;
      _this._canvas.style.height = viewport.height / pixelRatio + 'px';
      _this._canvas.style.width = viewport.width / pixelRatio + 'px';
      var canvasContext = _this._canvas.getContext('2d');
      var renderContext = {
        canvasContext: canvasContext,
        viewport: viewport
      };

      if (_this.pageRender && _this.pageRender._internalRenderTask.running) {
        _this.pageRender._internalRenderTask.cancel();
      }

      _this.pageRender = page.render(renderContext);
    };

    _this.renderTextLayer = function (page, viewportDefaultRatio) {
      if (_this._textContent) {
        _this._textLayerDiv.innerHTML = '';
        _this._textLayer = new _TextLayerBuilder2.default({
          textLayerDiv: _this._textLayerDiv,
          pageIndex: page.pageIndex,
          viewport: viewportDefaultRatio
        });

        // Set text-fragments
        _this._textLayer.setTextContent(_this._textContent);

        // Render text-fragments
        _this._textLayer.render();
      } else {
        page.getTextContent().then(function (textContent) {
          _this._textContent = textContent;
          _this._textLayer = new _TextLayerBuilder2.default({
            textLayerDiv: _this._textLayerDiv,
            pageIndex: page.pageIndex,
            viewport: viewportDefaultRatio
          });

          // Set text-fragments
          _this._textLayer.setTextContent(textContent);

          // Render text-fragments
          _this._textLayer.render();
        });
      }
    };

    _this.state = {
      scale: props.scale,
      isInview: false,
      scaleChange: false
    };
    return _this;
  }

  _createClass(Page, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initPage();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (nextProps.scale !== this.state.scale) {
        this.setState({ scale: nextProps.scale }, function () {
          _this2.updatePage(nextProps.scale);
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          page = _props.page,
          renderType = _props.renderType;

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(div) {
            return _this3._page = div;
          },
          className: 'pdf-page',
          id: 'pdf-page-' + page.pageIndex
        },
        _react2.default.createElement('div', { ref: function ref(div) {
            return _this3._textLayerDiv = div;
          }, className: 'textLayer' }),
        renderType === 'svg' ? _react2.default.createElement('div', { ref: function ref(div) {
            return _this3._svg = div;
          }, className: 'svg' }) : _react2.default.createElement('canvas', { ref: function ref(canvas) {
            return _this3._canvas = canvas;
          } })
      );
    }
  }]);

  return Page;
}(_react.Component);

Page.propTypes = {
  scale: _propTypes2.default.number.isRequired,
  renderType: _propTypes2.default.string.isRequired,
  page: _propTypes2.default.object.isRequired,
  onVisibleOnViewport: _propTypes2.default.func.isRequired,
  rotate: _propTypes2.default.number.isRequired
};

exports.default = Page;