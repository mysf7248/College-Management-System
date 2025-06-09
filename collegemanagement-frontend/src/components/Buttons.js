import React from "react";
const Button = ({ children, ...props }) => (
  <button className="btn btn-primary" {...props}>
    {children}
  </button>
);
export default Button;