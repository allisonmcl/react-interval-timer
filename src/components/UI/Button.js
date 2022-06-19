import classes from './Button.module.scss';
import React from 'react';

const Button = (props) => {
 
  return (
    <button 
      {...props.attributes}
      className="border-0 text-white w-12 h-12 m-2 rounded-full bg-darkGreen">
      {props.children}
    </button>
  )
}

export default Button;