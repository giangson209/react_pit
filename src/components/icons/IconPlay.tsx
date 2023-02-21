import React from "react";
import { IconProps } from "./type";

const IconPlay = (props: IconProps) => {
  const { size = 24 } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M36 24L14 37L14 11L36 24Z" fill="currentColor" />
    </svg>
  );
};

export default IconPlay;
