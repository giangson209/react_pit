import React from "react";
import { ForwardSize } from "./utils";

const IconChevronLeft = ForwardSize((props) => {
  return (
    <svg viewBox="0 0 31 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M28 2L4 30L28 58" stroke="currentColor" strokeWidth="6" />
    </svg>
  );
});

export default IconChevronLeft;
