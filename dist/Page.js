"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("pdfjs-dist/webpack");

require("pdfjs-dist/web/compatibility");

require("waypoints/lib/noframework.waypoints.js");

var _TextLayerBuilder = require("../plugin/TextLayerBuilder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PDFJS = window.PDFJS;
var Waypoint = window.Waypoint;

var Page = function (_Component) {
    _inherits(Page, _Component);

    function Page(props) {
        _classCallCheck(this, Page);

        var _this = _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).call(this, props));

        _this.initViewer = function () {
            var page = _this.props.page;

            var _this$getViewport = _this.getViewport(),
                viewport = _this$getViewport.viewport,
                viewportDefaultRatio = _this$getViewport.viewportDefaultRatio;

            _this.renderPagePlaceholder(viewportDefaultRatio);
            _this.initWaypoint(viewport.height);
            if (page.pageIndex === 0) {
                _this.renderPage();
            }
        };

        _this.initWaypoint = function (pageHeight) {
            var _this$props = _this.props,
                page = _this$props.page,
                onVisibleOnViewport = _this$props.onVisibleOnViewport;

            _this.waypoints = [new Waypoint({
                offset: pageHeight / 4,
                element: _this._page,
                handler: function handler(direction) {
                    if (direction === "down") {
                        onVisibleOnViewport(page.pageIndex);
                    }
                }
            }), new Waypoint({
                offset: -pageHeight / 3,
                element: _this._page,
                handler: function handler(direction) {
                    if (direction === "up") {
                        onVisibleOnViewport(page.pageIndex);
                    }
                }
            }), new Waypoint({
                offset: pageHeight,
                element: _this._page,
                handler: function handler() {
                    if (!_this.pageRendered) {
                        _this.renderPage();
                    }
                }
            })];
        };

        _this.resetWaypoint = function () {
            _this.waypoints.forEach(function (waypoint) {
                waypoint.destroy();
            });

            _this.initWaypoint(_this.getViewport().viewportDefaultRatio.height);
        };

        _this.getViewport = function () {
            var page = _this.props.page;

            var rotate = _this.props.rotate || 0;
            var pixelRatio = window.devicePixelRatio || 1;
            var viewport = page.getViewport(_this.getPageScale(page) * pixelRatio, rotate);

            var viewportDefaultRatio = page.getViewport(_this.getPageScale(page), rotate);

            return {
                viewport: viewport,
                viewportDefaultRatio: viewportDefaultRatio
            };
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
            _this._page.style.width = viewportDefaultRatio.width + "px";
            _this._page.style.height = viewportDefaultRatio.height + "px";
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
                _this._svg.innerHTML = "";
                _this._svg.appendChild(svg);
            });
        };

        _this.renderPageCanvas = function (page, pixelRatio, _ref2) {
            var viewport = _ref2.viewport;


            _this._canvas.height = viewport.height;
            _this._canvas.width = viewport.width;
            _this._canvas.style.height = viewport.height / pixelRatio + "px";
            _this._canvas.style.width = viewport.width / pixelRatio + "px";
            var canvasContext = _this._canvas.getContext("2d");
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
                _this._textLayerDiv.innerHTML = "";
                _this._textLayer = new _TextLayerBuilder.TextLayerBuilder({
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
                    _this._textLayer = new _TextLayerBuilder.TextLayerBuilder({
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
            scale: props.scale
        };
        return _this;
    }

    _createClass(Page, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.initViewer();
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var _this2 = this;

            if (nextProps.scale !== this.state.scale) {
                this.setState({ scale: nextProps.scale }, function () {
                    _this2.renderPagePlaceholder(_this2.getViewport().viewportDefaultRatio);
                    _this2.resetWaypoint();
                    if (_this2.pageRendered) {
                        _this2.renderPage();
                    }
                });
            }
        }
    }, {
        key: "getPageScale",
        value: function getPageScale(page) {
            var _props = this.props,
                rotate = _props.rotate,
                width = _props.width;
            var scale = this.state.scale;

            // Be default, we'll render page at 100% * scale width.

            var pageScale = 1;

            // If width is defined, calculate the scale of the page so it could be of desired width.
            if (width) {
                pageScale = width / page.getViewport(scale, rotate).width;
            }

            return scale * pageScale;
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var page = this.props.page;

            return _react2.default.createElement(
                "div",
                { ref: function ref(div) {
                        return _this3._page = div;
                    }, className: "pdf-page", id: "pdf-page-" + page.pageIndex },
                _react2.default.createElement("div", { ref: function ref(div) {
                        return _this3._textLayerDiv = div;
                    }, className: "textLayer" }),
                _react2.default.createElement("div", { ref: function ref(div) {
                        return _this3._svg = div;
                    }, className: "svg" }),
                _react2.default.createElement("canvas", { ref: function ref(canvas) {
                        return _this3._canvas = canvas;
                    } })
            );
        }
    }]);

    return Page;
}(_react.Component);

exports.default = Page;