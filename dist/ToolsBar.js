"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Button = require("./Button");

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

  function ToolsBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ToolsBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ToolsBar.__proto__ || Object.getPrototypeOf(ToolsBar)).call.apply(_ref, [this].concat(args))), _this), _this.getButton = function (button, clickHandler) {
      return _react2.default.isValidElement(button) ? elementWrapper(button, { onClick: clickHandler }) : _react2.default.createElement(_Button2.default, _extends({}, button, { clickHandler: clickHandler }));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ToolsBar, [{
    key: "render",
    value: function render() {
      var _props2 = this.props,
          currentPage = _props2.currentPage,
          btnToggle = _props2.btnToggle,
          btnZoomIn = _props2.btnZoomIn,
          btnZoomOut = _props2.btnZoomOut,
          btnUp = _props2.btnUp,
          btnDown = _props2.btnDown,
          scrollToPageHandler = _props2.scrollToPageHandler,
          zoomHandler = _props2.zoomHandler,
          toggleHandler = _props2.toggleHandler,
          pageCountLabel = _props2.pageCountLabel,
          numPages = _props2.numPages;

      return _react2.default.createElement(
        "div",
        { className: "pdf-reader-header" },
        _react2.default.createElement(
          "div",
          { className: "toggle-sidebar" },
          this.getButton(btnToggle, toggleHandler)
        ),
        _react2.default.createElement(
          "div",
          { className: "zoom-actions" },
          this.getButton(btnZoomOut, function () {
            return zoomHandler("out");
          }),
          this.getButton(btnZoomIn, function () {
            return zoomHandler("in");
          })
        ),
        _react2.default.createElement(
          "span",
          null,
          this.getButton(btnUp, function () {
            return scrollToPageHandler(currentPage - 1);
          }),
          _react2.default.createElement(
            "strong",
            { className: "count-page" },
            currentPage + 1,
            " ",
            pageCountLabel,
            " ",
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

exports.default = ToolsBar;