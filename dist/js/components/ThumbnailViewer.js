'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Thumbnail = require('./Thumbnail');

var _Thumbnail2 = _interopRequireDefault(_Thumbnail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ThumbnailViewer(_ref) {
  var currentPage = _ref.currentPage,
      _onSelect = _ref.onSelect,
      pages = _ref.pages;

  return _react2.default.createElement(
    'section',
    { className: 'pdf-thumbnail-viewer' },
    pages.map(function (page, index) {
      return _react2.default.createElement(_Thumbnail2.default, {
        key: index,
        page: page,
        pageIndex: page.pageIndex,
        isCurrentPage: currentPage === page.pageIndex,
        onSelect: function onSelect() {
          return _onSelect(page.pageIndex);
        }
      });
    })
  );
}

ThumbnailViewer.propTypes = {
  currentPage: _propTypes2.default.number.isRequired,
  onSelect: _propTypes2.default.func.isRequired,
  pages: _propTypes2.default.array.isRequired
};

exports.default = ThumbnailViewer;