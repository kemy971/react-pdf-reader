import React from 'react'

const Button = ({label = "", classname = "", iconClassname = null, clickHandler}) => {
    return (<button className={classname} onClick={clickHandler}>
        {label}
        </button>);
}

export default Button