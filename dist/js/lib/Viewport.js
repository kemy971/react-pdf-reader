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