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