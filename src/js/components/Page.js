import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'pdfjs-dist/build/pdf.combined';
import 'pdfjs-dist/web/compatibility';
import 'waypoints/lib/noframework.waypoints';
import 'waypoints/lib/shortcuts/inview';
import { getViewport } from '../lib/Viewport';
import TextLayerBuilder from '../lib/TextLayerBuilder';

const { PDFJS, Waypoint } = window;

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: props.scale,
      isInview: false,
      scaleChange: false,
    };
  }

  componentDidMount() {
    this.initPage();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scale !== this.state.scale) {
      this.setState({ scale: nextProps.scale }, () => {
        this.updatePage(nextProps.scale);
      });
    }
  }

  getViewport = () => {
    const { page } = this.props;
    const { scale } = this.state;
    const rotate = this.props.rotate || 0;

    return getViewport(page, scale, rotate);
  };

  refreshWaypoints = () => {
    Waypoint.refreshAll();
  }

  initWaypoint = (pageHeight) => {
    const { page, onVisibleOnViewport } = this.props;
    const context = document.querySelector('.pdf-viewer');
    this.waypoints = [
      new Waypoint({
        offset: pageHeight / 4,
        element: this._page,
        context,
        handler: (direction) => {
          if (direction === 'down') {
            onVisibleOnViewport(page.pageIndex);
          }
        },
      }),

      new Waypoint({
        offset: -pageHeight / 3,
        element: this._page,
        context,
        handler: (direction) => {
          if (direction === 'up') {
            onVisibleOnViewport(page.pageIndex);
          }
        },
      }),

      new Waypoint.Inview({
        element: this._page,
        context,
        enter: () => {
          this.setState({ isInview: true }, () => {
            if (!this.pageRendered) {
              this.renderPage();
            } else if (this.state.scaleChange) {
              this.setState({ scaleChange: false }, () => {
                this.renderPage();
              });
            }
          });
        },
        exited: () => {
          this.setState({ isInview: false });
        },
      }),
    ];
  };

  cleanPage = () => {
    if (this.props.renderType === 'svg') {
      this._svg.innerHTML = '';
    } else {
      const ctx = this._canvas.getContext('2d');
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }

  initPage = () => {
    const { viewport, viewportDefaultRatio } = this.getViewport();
    this.renderPagePlaceholder(viewportDefaultRatio);
    this.initWaypoint(viewport.height);
  };

  updatePage = () => {
    this.renderPagePlaceholder(this.getViewport().viewportDefaultRatio);
    this.refreshWaypoints();
    this.cleanPage();
    if (this.state.isInview) {
      this.renderPage();
    } else {
      this.setState({ scaleChange: true });
    }
  }

  renderPage = () => {
    const { page, renderType } = this.props;
    const viewports = this.getViewport();
    const pixelRatio = window.devicePixelRatio || 1;

    this.renderPagePlaceholder(viewports.viewportDefaultRatio);
    if (renderType === 'svg') {
      this.renderPageSVG(page, pixelRatio, viewports);
    } else {
      this.renderPageCanvas(page, pixelRatio, viewports);
    }

    this.renderTextLayer(page, viewports.viewportDefaultRatio);

    this.pageRendered = true;
  };

  renderPagePlaceholder = (viewportDefaultRatio) => {
    this._page.style.width = `${viewportDefaultRatio.width}px`;
    this._page.style.height = `${viewportDefaultRatio.height}px`;
  };

  renderPageSVG = (page, pixelRatio, { viewportDefaultRatio }) => {
    this._svg.style.width = `${viewportDefaultRatio.width}px`;
    this._svg.style.height = `${viewportDefaultRatio.height}px`;

    // SVG rendering by PDF.js
    page
      .getOperatorList()
      .then((opList) => {
        const svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
        return svgGfx.getSVG(opList, viewportDefaultRatio);
      })
      .then((svg) => {
        this._svg.innerHTML = '';
        this._svg.appendChild(svg);
      });
  };

  renderPageCanvas = (page, pixelRatio, { viewport }) => {
    this._canvas.height = viewport.height;
    this._canvas.width = viewport.width;
    this._canvas.style.height = `${viewport.height / pixelRatio}px`;
    this._canvas.style.width = `${viewport.width / pixelRatio}px`;
    const canvasContext = this._canvas.getContext('2d');
    const renderContext = {
      canvasContext,
      viewport,
    };

    if (this.pageRender && this.pageRender._internalRenderTask.running) {
      this.pageRender._internalRenderTask.cancel();
    }

    this.pageRender = page.render(renderContext);
  };

  renderTextLayer = (page, viewportDefaultRatio) => {
    if (this._textContent) {
      this._textLayerDiv.innerHTML = '';
      this._textLayer = new TextLayerBuilder({
        textLayerDiv: this._textLayerDiv,
        pageIndex: page.pageIndex,
        viewport: viewportDefaultRatio,
      });

      // Set text-fragments
      this._textLayer.setTextContent(this._textContent);

      // Render text-fragments
      this._textLayer.render();
    } else {
      page.getTextContent().then((textContent) => {
        this._textContent = textContent;
        this._textLayer = new TextLayerBuilder({
          textLayerDiv: this._textLayerDiv,
          pageIndex: page.pageIndex,
          viewport: viewportDefaultRatio,
        });

        // Set text-fragments
        this._textLayer.setTextContent(textContent);

        // Render text-fragments
        this._textLayer.render();
      });
    }
  };

  render() {
    const { page, renderType } = this.props;
    return (
      <div
        ref={div => (this._page = div)}
        className="pdf-page"
        id={`pdf-page-${page.pageIndex}`}
      >
        <div ref={div => (this._textLayerDiv = div)} className="textLayer" />
        {renderType === 'svg'
          ? <div ref={div => (this._svg = div)} className="svg" />
          : <canvas ref={canvas => (this._canvas = canvas)} />}
      </div>
    );
  }
}

Page.propTypes = {
  scale: PropTypes.number.isRequired,
  renderType: PropTypes.string.isRequired,
  page: PropTypes.object.isRequired,
  onVisibleOnViewport: PropTypes.func.isRequired,
  rotate: PropTypes.number.isRequired,
};

export default Page;
