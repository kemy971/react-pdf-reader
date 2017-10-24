'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = function Button(_ref) {
  var label = _ref.label,
      classname = _ref.classname,
      iconClassname = _ref.iconClassname,
      clickHandler = _ref.clickHandler,
      iconButton = _ref.iconButton;
  return _react2.default.createElement(
    'button',
    { className: classname, onClick: clickHandler },
    iconClassname ? _react2.default.createElement('i', { className: iconClassname }) : null,
    !iconButton ? label : null
  );
};

Button.propTypes = {
  label: _propTypes2.default.string,
  classname: _propTypes2.default.string,
  iconClassname: _propTypes2.default.string,
  clickHandler: _propTypes2.default.func.isRequired,
  iconButton: _propTypes2.default.bool
};

Button.defaultProps = {
  label: '',
  classname: '',
  iconClassname: null,
  iconButton: false
};

exports.default = Button;