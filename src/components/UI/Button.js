import classes from './Button.module.scss';
import React from 'react';

const Button = (props) => {
 
  return (
    <button 
      {...props.attributes}
      className={classes.iconbtn}>
      {props.children}
    </button>
  )
}

export default Button;