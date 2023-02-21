import React from "react";
import { IconProps } from "./type";

export function ForwardSize<Props = {}>(
  Component: React.ComponentType<React.SVGProps<SVGSVGElement>>
) {
  return function Icon(props: IconProps<Props & React.SVGProps<SVGSVGElement>>) {
    const { size, ...rest } = props;
    return <Component width={size} height={size} {...(rest as any)} />;
  };
}
