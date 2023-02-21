import { createContext } from "react";
import { voidFunc } from "src/utils/func";

type GetPosition = (element: HTMLElement) => number;

export type Options = {
  getTopPosition?: GetPosition;
  speedIn?: number;
  speedOut?: number;
  offset?: [number, number];
};
export type RegisterScroll = (
  element: HTMLElement,
  position: number,
  options?: Options
) => () => void;
type ScrollFullContextState = {
  register: RegisterScroll;
  unregister(position: number): void;
  disableFullPage(): void;
  activeFullPage(): void;
};
export const ScrollFullContext = createContext<ScrollFullContextState>({
  register() {
    return voidFunc;
  },
  unregister: voidFunc,
  disableFullPage: voidFunc,
  activeFullPage: voidFunc,
});
