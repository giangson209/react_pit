import { useRef } from "react";

const EMPTY = {};
export function useInstance<T extends Record<string, any>>(value: T | (() => T) = {} as T): T {
  const ref = useRef<T>(EMPTY as any);
  if (ref.current === EMPTY) {
    ref.current = typeof value === "function" ? value() : value;
  }
  return ref.current;
}
