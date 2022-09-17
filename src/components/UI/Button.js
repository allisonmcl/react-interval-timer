import React from 'react';

const Button = (props) => {
 
  return (
    <button 
      {...props.attributes}
      className="disabled:opacity-25 border-0 text-white min-w-12 min-h-12 m-2 p-4 rounded-full bg-darkGreen">
      {props.children}
    </button>
  )
}

export default Button;