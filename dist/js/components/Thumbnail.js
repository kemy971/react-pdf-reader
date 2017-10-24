'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('waypoints/lib/noframework.waypoints');

require('waypoints/lib/shortcuts/inview');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Thumbnail = function (_Component) {
  _inherits(Thumbnail, _Component);

  function Thumbnail() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Thumbnail);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Thumbnail.__proto__ || Object.getPrototypeOf(Thumbnail)).call.apply(_ref, [this].concat(args))), _this), _this.getViewport = function () {
      var page = _this.props.page;

      var rotate = 0;
      var pixelRatio = window.devicePixelRatio || 1;
      var scale = 1;
      var width = 100;

      var pageScale = width / page.getViewport(scale, rotate).width;
      pageScale *= scale;

      return page.getViewport(pageScale * pixelRatio, rotate);
    }, _this.renderThumbnail = function () {
      var page = _this.props.page;

      var pixelRatio = window.devicePixelRatio || 1;

      var viewport = _this.getViewport();

      // Render thumbnail canvas for all pages

      var canvas = document.createElement('canvas');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.height = viewport.height / pixelRatio + 'px';
      canvas.style.width = viewport.width / pixelRatio + 'px';
      var canvasContext = canvas.getContext('2d');
      var renderContext = {
        canvasContext: canvasContext,
        viewport: viewport
      };

      page.render(renderContext).then(function () {
        _this.thumbnail.src = canvas.toDataURL();
        canvas.width = 0;
        canvas.height = 0;
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Thumbnail, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var pixelRatio = window.devicePixelRatio || 1;
      var viewport = this.getViewport();
      this.imgPlaceholder = {
        width: viewport.width / pixelRatio,
        height: viewport.height / pixelRatio
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _window = window,
          Waypoint = _window.Waypoint;

      this.waypoint = new Waypoint.Inview({
        element: this.thumbnailContainer,
        context: document.querySelector('.pdf-thumbnail-viewer'),
        enter: function enter() {
          _this2.renderThumbnail();
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          isCurrentPage = _props.isCurrentPage,
          onSelect = _props.onSelect,
          pageIndex = _props.pageIndex;

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(div) {
            return _this3.thumbnailContainer = div;
          },
          className: (0, _classnames2.default)('pdf-thumbnail', { active: isCurrentPage })
        },
        _react2.default.createElement('img', {
          width: this.imgPlaceholder.width,
          height: this.imgPlaceholder.height,
          ref: function ref(img) {
            return _this3.thumbnail = img;
          },
          alt: 'pdf-thumbnail-' + (pageIndex + 1),
          onClick: onSelect,
          role: 'presentation'
        }),
        _react2.default.createElement(
          'h5',
          null,
          pageIndex + 1
        )
      );
    }
  }]);

  return Thumbnail;
}(_react.Component);

Thumbnail.propTypes = {
  page: _propTypes2.default.object.isRequired,
  isCurrentPage: _propTypes2.default.bool.isRequired,
  onSelect: _propTypes2.default.func.isRequired,
  pageIndex: _propTypes2.default.number.isRequired
};

exports.default = Thumbnail;