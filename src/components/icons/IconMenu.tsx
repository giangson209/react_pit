import React from "react";
import { ForwardSize } from "./utils";

const IconMenu = ForwardSize((props) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 8H22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 16H22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
});

export default IconMenu;
