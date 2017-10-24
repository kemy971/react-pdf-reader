import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  label, classname, iconClassname, clickHandler, iconButton,
}) => (
  <button className={classname} onClick={clickHandler}>
    {iconClassname ? <i className={iconClassname} /> : null}
    {!iconButton ? label : null}
  </button>
);

Button.propTypes = {
  label: PropTypes.string,
  classname: PropTypes.string,
  iconClassname: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  iconButton: PropTypes.bool,
};

Button.defaultProps = {
  label: '',
  classname: '',
  iconClassname: null,
  iconButton: false,
};

export default Button;
