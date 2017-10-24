'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Page = require('./Page');

var _Page2 = _interopRequireDefault(_Page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Viewer(_ref) {
  var pages = _ref.pages,
      rotate = _ref.rotate,
      renderType = _ref.renderType,
      scale = _ref.scale,
      onPageChange = _ref.onPageChange;

  return _react2.default.createElement(
    'section',
    { className: 'pdf-viewer' },
    pages.map(function (page, index) {
      return _react2.default.createElement(_Page2.default, {
        key: index,
        page: page,
        scale: scale,
        rotate: rotate,
        renderType: renderType,
        onVisibleOnViewport: onPageChange
      });
    })
  );
}

Viewer.propTypes = {
  pages: _propTypes2.default.array.isRequired,
  rotate: _propTypes2.default.number.isRequired,
  renderType: _propTypes2.default.string.isRequired,
  scale: _propTypes2.default.number.isRequired,
  onPageChange: _propTypes2.default.func.isRequired
};

exports.default = Viewer;