import React from 'react'

const Button = ({label = "", classname = "", iconClassname = null, clickHandler, iconButton = false}) => {
    return (
        <button className={classname} onClick={clickHandler}>
            {iconClassname ? <i className={iconClassname}/> : null}
            {!iconButton ? label : null}
        </button>
    );
}

export default Button