'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ThumbnailViewer = function (_Component) {
    _inherits(ThumbnailViewer, _Component);

    function ThumbnailViewer() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ThumbnailViewer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ThumbnailViewer.__proto__ || Object.getPrototypeOf(ThumbnailViewer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            isLoading: true
        }, _this.renderThumbnails = function () {
            var pages = _this.props.pages;

            var rotate = 0;
            var pixelRatio = window.devicePixelRatio || 1;
            var scale = 1;
            var width = 100;

            var pageScale = width / pages[0].getViewport(scale, rotate).width;
            pageScale = scale * pageScale;

            var viewport = pages[0].getViewport(pageScale * pixelRatio, rotate);

            var renderPromises = [];
            _this.thumbnails = [];

            //Render thumbnail canvas for all pages
            pages.forEach(function (page) {
                var canvas = document.createElement('canvas');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.style.height = viewport.height / pixelRatio + 'px';
                canvas.style.width = viewport.width / pixelRatio + 'px';
                _this.thumbnails.push({
                    pageIndex: page.pageIndex,
                    canvas: canvas
                });
                var canvasContext = canvas.getContext("2d");
                var renderContext = {
                    canvasContext: canvasContext,
                    viewport: viewport
                };
                renderPromises.push(page.render(renderContext));
            });

            //Wait all thumbnail canvas rendered
            Promise.all(renderPromises).then(function () {

                //Get thumbnails images
                _this.thumbnails.map(function (thumbnail) {
                    thumbnail.src = thumbnail.canvas.toDataURL();
                    thumbnail.canvas.width = 0;
                    thumbnail.canvas.height = 0;

                    //Destroy unused canvas
                    delete thumbnail.canvas;
                });

                _this.setState({ isLoading: false });
                _this.props.onLoaded();
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ThumbnailViewer, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.renderThumbnails();
        }
    }, {
        key: 'render',
        value: function render() {
            var isLoading = this.state.isLoading;
            var _props = this.props,
                currentPage = _props.currentPage,
                _onSelect = _props.onSelect;

            return _react2.default.createElement(
                'section',
                { className: 'pdf-thumbnail-viewer' },
                !isLoading ? this.thumbnails.map(function (_ref2, index) {
                    var pageIndex = _ref2.pageIndex,
                        src = _ref2.src;
                    return _react2.default.createElement(Thumbnail, { key: index, src: src, pageIndex: pageIndex,
                        isCurrentPage: currentPage === pageIndex,
                        onSelect: function onSelect() {
                            return _onSelect(pageIndex);
                        } });
                }) : null
            );
        }
    }]);

    return ThumbnailViewer;
}(_react.Component);

function Thumbnail(_ref3) {
    var isCurrentPage = _ref3.isCurrentPage,
        onSelect = _ref3.onSelect,
        pageIndex = _ref3.pageIndex,
        src = _ref3.src;

    return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)("pdf-thumbnail", { "active": isCurrentPage }) },
        _react2.default.createElement('img', { src: src, onClick: onSelect }),
        _react2.default.createElement(
            'h5',
            null,
            pageIndex + 1
        )
    );
}

exports.default = ThumbnailViewer;