import React, { Component } from "react";
import Button from "./Button";

function elementWrapper(_element, _props) {
  const ElementType = _element.type;
  const props = { ..._element.props, ..._props };
  return <ElementType {...props} />;
}

class ToolsBar extends Component {
  getButton = (button, clickHandler) => {
    console.log(button);
    return React.isValidElement(button)
      ? elementWrapper(button, { onClick: clickHandler })
      : <Button {...button} clickHandler={clickHandler} />;
  };

  render() {
    const {
      currentPage,
      btnToggle,
      btnZoomIn,
      btnZoomOut,
      btnUp,
      btnDown,
      scrollToPageHandler,
      zoomHandler,
      toggleHandler,
      pageCountLabel,
      numPages
    } = this.props;
    return (
      <div className="pdf-reader-header">
        <div className="toggle-sidebar">
          {this.getButton(btnToggle, toggleHandler)}
        </div>
        <div className="zoom-actions">
          {this.getButton(btnZoomIn, () => zoomHandler("in"))}
          {this.getButton(btnZoomOut, () => zoomHandler("out"))}
        </div>
        <span>
          {this.getButton(btnUp, () => scrollToPageHandler(currentPage - 1))}
          <strong className="count-page">
            {currentPage + 1} {pageCountLabel} {numPages || 0}
          </strong>
          {this.getButton(btnDown, () => scrollToPageHandler(currentPage + 1))}
        </span>
      </div>
    );
  }
}

export default ToolsBar;
