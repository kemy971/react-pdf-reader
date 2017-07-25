"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = function Button(_ref) {
    var _ref$label = _ref.label,
        label = _ref$label === undefined ? "" : _ref$label,
        _ref$classname = _ref.classname,
        classname = _ref$classname === undefined ? "" : _ref$classname,
        _ref$iconClassname = _ref.iconClassname,
        iconClassname = _ref$iconClassname === undefined ? null : _ref$iconClassname,
        clickHandler = _ref.clickHandler;

    return _react2.default.createElement(
        "button",
        { className: classname, onClick: clickHandler },
        label
    );
};

exports.default = Button;