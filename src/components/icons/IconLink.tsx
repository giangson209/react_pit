import React from "react";
import { IconProps } from "./type";

const IconLink = (props: IconProps) => {
  const { size = 24, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M37 11L11 37" stroke="currentColor" strokeWidth="4" />
      <path d="M13.4941 11H36.9482V34.4541" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
};

export default IconLink;
