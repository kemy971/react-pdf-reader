import React, { Component } from "react";
import classnames from "classnames";
import "waypoints/lib/noframework.waypoints.js";
import "waypoints/lib/shortcuts/inview.js";

let Waypoint = window.Waypoint;

class Thumbnail extends Component {
  componentWillMount() {
    const pixelRatio = window.devicePixelRatio || 1;
    let viewport = this.getViewport();
    this.imgPlaceholder = {
      width: viewport.width / pixelRatio,
      height: viewport.height / pixelRatio
    };
  }

  componentDidMount() {
    new Waypoint.Inview({
      element: this.thumbnailContainer,
      context: document.querySelector(".pdf-thumbnail-viewer"),
      enter: () => {
        this.renderThumbnail();
      }
    });
  }

  getViewport = () => {
    const { page } = this.props;
    const rotate = 0;
    const pixelRatio = window.devicePixelRatio || 1;
    const scale = 1;
    const width = 100;

    let pageScale = width / page.getViewport(scale, rotate).width;
    pageScale = scale * pageScale;

    return page.getViewport(pageScale * pixelRatio, rotate);
  };

  renderThumbnail = () => {
    const { page } = this.props;
    const pixelRatio = window.devicePixelRatio || 1;

    let viewport = this.getViewport();

    //Render thumbnail canvas for all pages

    let canvas = document.createElement("canvas");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.height = `${viewport.height / pixelRatio}px`;
    canvas.style.width = `${viewport.width / pixelRatio}px`;
    const canvasContext = canvas.getContext("2d");
    const renderContext = {
      canvasContext,
      viewport
    };

    page.render(renderContext).then(() => {
      this.thumbnail.src = canvas.toDataURL();
      canvas.width = 0;
      canvas.height = 0;
    });
  };

  render() {
    let { isCurrentPage, onSelect, pageIndex } = this.props;
    return (
      <div
        ref={div => (this.thumbnailContainer = div)}
        className={classnames("pdf-thumbnail", { active: isCurrentPage })}
      >
        <img
          width={this.imgPlaceholder.width}
          height={this.imgPlaceholder.height}
          ref={img => (this.thumbnail = img)}
          onClick={onSelect}
        />
        <h5>
          {pageIndex + 1}
        </h5>
      </div>
    );
  }
}

export default Thumbnail;
