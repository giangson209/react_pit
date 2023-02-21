import React, { useImperativeHandle, useRef } from "react";

const useForwardRef = <T extends HTMLElement = HTMLElement>(
  ref: React.ForwardedRef<T>
): React.RefObject<T> => {
  const innerRef = useRef<T>(null);
  useImperativeHandle(ref, () => innerRef.current!);
  return innerRef;
};

export default useForwardRef;
