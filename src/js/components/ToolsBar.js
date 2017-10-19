import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

function elementWrapper(_element, _props) {
  const ElementType = _element.type;
  const props = { ..._element.props, ..._props };
  return <ElementType {...props} />;
}

class ToolsBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPage: props.currentPage + 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPage + 1 !== this.state.inputPage) {
      this.setState({ inputPage: nextProps.currentPage + 1 });
    }
  }

  getButton = (button, clickHandler) => (React.isValidElement(button)
    ? elementWrapper(button, { onClick: clickHandler })
    : <Button {...button} clickHandler={clickHandler} />);

  _handleChange = (e) => {
    const { numPages } = this.props;
    const { value } = e.target;
    if (value > 0 && value <= numPages) {
      this.setState({ inputPage: e.target.value });
    }
  }

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  }

  render() {
    const {
      currentPage,
      btnToggle,
      btnZoomIn,
      btnZoomOut,
      btnUp,
      btnDown,
      btnFitWidth,
      scrollToPageHandler,
      zoomHandler,
      toggleHandler,
      pageCountLabel,
      numPages,
    } = this.props;

    const {
      inputPage,
    } = this.state;

    return (
      <div className="pdf-reader-header">
        <div className="toggle-sidebar">
          {this.getButton(btnToggle, toggleHandler)}
        </div>
        <div className="zoom-actions">
          {this.getButton(btnZoomOut, () => zoomHandler('out'))}
          {this.getButton(btnZoomIn, () => zoomHandler('in'))}
          {this.getButton(btnFitWidth, () => zoomHandler('fitWidth'))}
        </div>
        <span>
          {this.getButton(btnUp, () => scrollToPageHandler(currentPage - 1))}
          <strong className="count-page">
            <input
              type="number"
              value={inputPage}
              onChange={this._handleChange}
              onBlur={() => scrollToPageHandler(inputPage - 1)}
              onKeyPress={this._handleKeyPress}
            /> {pageCountLabel} {numPages || 0}
          </strong>
          {this.getButton(btnDown, () => scrollToPageHandler(currentPage + 1))}
        </span>
      </div>
    );
  }
}

ToolsBar.propTypes = {
  currentPage: PropTypes.number.isRequired,
  numPages: PropTypes.number.isRequired,
  btnToggle: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool,
    }),
    PropTypes.element,
  ]),
  btnUp: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool,
    }),
    PropTypes.element,
  ]),
  btnDown: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool,
    }),
    PropTypes.element,
  ]),
  btnZoomIn: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool,
    }),
    PropTypes.element,
  ]),
  btnZoomOut: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool,
    }),
    PropTypes.element,
  ]),
  btnFitWidth: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      classname: PropTypes.string,
      iconClassname: PropTypes.string,
      iconButton: PropTypes.bool,
    }),
    PropTypes.element,
  ]),
  pageCountLabel: PropTypes.string,
  scrollToPageHandler: PropTypes.func.isRequired,
  zoomHandler: PropTypes.func.isRequired,
  toggleHandler: PropTypes.func.isRequired,
};

export default ToolsBar;
