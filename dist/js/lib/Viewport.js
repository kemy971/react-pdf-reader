"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Get the page viewport
 * @param { PageProxy } page
 * @param { Number } scale
 * @param { Number } rotate
 */
var getViewport = exports.getViewport = function getViewport(page) {
  var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var rotate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var pixelRatio = window.devicePixelRatio || 1;

  var viewport = page.getViewport(scale * pixelRatio, rotate);

  var viewportDefaultRatio = page.getViewport(scale, rotate);

  return {
    viewport: viewport,
    viewportDefaultRatio: viewportDefaultRatio
  };
};

var getMinZoomScale = exports.getMinZoomScale = function getMinZoomScale(page, container) {
  var _getViewport = getViewport(page),
      viewportDefaultRatio = _getViewport.viewportDefaultRatio;

  var containerHeight = container.offsetHeight * 0.9;
  var pageHeight = viewportDefaultRatio.height;
  return containerHeight / pageHeight;
};

var getFitWidthScale = exports.getFitWidthScale = function getFitWidthScale(page, container) {
  var _getViewport2 = getViewport(page),
      viewportDefaultRatio = _getViewport2.viewportDefaultRatio;

  var containerWidth = container.offsetWidth * 0.9;
  var pageWidth = viewportDefaultRatio.width;
  return containerWidth / pageWidth;
};