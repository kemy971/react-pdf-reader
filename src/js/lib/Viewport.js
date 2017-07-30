/**
 * Get the page viewport
 * @param { PageProxy } page 
 * @param { Number } scale 
 * @param { Number } rotate 
 */
export const getViewport = (page, scale = 1, rotate = 0) => {
    const pixelRatio = window.devicePixelRatio || 1;

    let viewport = page.getViewport(
      scale * pixelRatio,
      rotate
    );

    let viewportDefaultRatio = page.getViewport(
      scale,
      rotate
    );

    return {
      viewport,
      viewportDefaultRatio
    };
  };

  export const getMinZoomScale = (page, container) => {
    let {viewportDefaultRatio} = getViewport(page);
    let containerHeight = container.offsetHeight * .9;
    let pageHeight = viewportDefaultRatio.height;
    return containerHeight / pageHeight;
  }

  export const getFitWidthScale = (page, container) => {
    let {viewportDefaultRatio} = getViewport(page);
    let containerWidth = container.offsetWidth * .9;
    let pageWidth = viewportDefaultRatio.width;
    return containerWidth / pageWidth;
  }