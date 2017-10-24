'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function elementWrapper(_element, _props) {
  var ElementType = _element.type;
  var props = _extends({}, _element.props, _props);
  return _react2.default.createElement(ElementType, props);
}

var ToolsBar = function (_Component) {
  _inherits(ToolsBar, _Component);

  function ToolsBar(props) {
    _classCallCheck(this, ToolsBar);

    var _this = _possibleConstructorReturn(this, (ToolsBar.__proto__ || Object.getPrototypeOf(ToolsBar)).call(this, props));

    _this.getButton = function (button, clickHandler) {
      return _react2.default.isValidElement(button) ? elementWrapper(button, { onClick: clickHandler }) : _react2.default.createElement(_Button2.default, _extends({}, button, { clickHandler: clickHandler }));
    };

    _this._handleChange = function (e) {
      var numPages = _this.props.numPages;
      var value = e.target.value;

      if (value > 0 && value <= numPages) {
        _this.setState({ inputPage: e.target.value });
      }
    };

    _this._handleKeyPress = function (e) {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    };

    _this.state = {
      inputPage: props.currentPage + 1
    };
    return _this;
  }

  _createClass(ToolsBar, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.currentPage + 1 !== this.state.inputPage) {
        this.setState({ inputPage: nextProps.currentPage + 1 });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          currentPage = _props2.currentPage,
          btnToggle = _props2.btnToggle,
          btnZoomIn = _props2.btnZoomIn,
          btnZoomOut = _props2.btnZoomOut,
          btnUp = _props2.btnUp,
          btnDown = _props2.btnDown,
          btnFitWidth = _props2.btnFitWidth,
          scrollToPageHandler = _props2.scrollToPageHandler,
          zoomHandler = _props2.zoomHandler,
          toggleHandler = _props2.toggleHandler,
          pageCountLabel = _props2.pageCountLabel,
          numPages = _props2.numPages;
      var inputPage = this.state.inputPage;


      return _react2.default.createElement(
        'div',
        { className: 'pdf-reader-header' },
        _react2.default.createElement(
          'div',
          { className: 'toggle-sidebar' },
          this.getButton(btnToggle, toggleHandler)
        ),
        _react2.default.createElement(
          'div',
          { className: 'zoom-actions' },
          this.getButton(btnZoomOut, function () {
            return zoomHandler('out');
          }),
          this.getButton(btnZoomIn, function () {
            return zoomHandler('in');
          }),
          this.getButton(btnFitWidth, function () {
            return zoomHandler('fitWidth');
          })
        ),
        _react2.default.createElement(
          'span',
          null,
          this.getButton(btnUp, function () {
            return scrollToPageHandler(currentPage - 1);
          }),
          _react2.default.createElement(
            'strong',
            { className: 'count-page' },
            _react2.default.createElement('input', {
              type: 'number',
              value: inputPage,
              onChange: this._handleChange,
              onBlur: function onBlur() {
                return scrollToPageHandler(inputPage - 1);
              },
              onKeyPress: this._handleKeyPress
            }),
            ' ',
            pageCountLabel,
            ' ',
            numPages || 0
          ),
          this.getButton(btnDown, function () {
            return scrollToPageHandler(currentPage + 1);
          })
        )
      );
    }
  }]);

  return ToolsBar;
}(_react.Component);

ToolsBar.propTypes = {
  currentPage: _propTypes2.default.number.isRequired,
  numPages: _propTypes2.default.number.isRequired,
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
  pageCountLabel: _propTypes2.default.string,
  scrollToPageHandler: _propTypes2.default.func.isRequired,
  zoomHandler: _propTypes2.default.func.isRequired,
  toggleHandler: _propTypes2.default.func.isRequired
};

exports.default = ToolsBar;