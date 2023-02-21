type TypeEventByElement<E extends HTMLElement | Window | Document> = E extends Window
  ? keyof WindowEventMap
  : E extends Document
  ? keyof DocumentEventMap
  : keyof HTMLElementEventMap;

type Listener = <E extends HTMLElement | Window | Document, K extends TypeEventByElement<E>>(
  target: E,
  type: K,
  listener: E extends Window
    ? K extends keyof WindowEventMap
      ? (this: Window, ev: WindowEventMap[K]) => any
      : never
    : (
        this: E,
        ev: K extends keyof HTMLElementEventMap
          ? HTMLElementEventMap[K]
          : K extends keyof DocumentEventMap
          ? DocumentEventMap[K]
          : never
      ) => any,
  options?: boolean | AddEventListenerOptions
) => void;
export const on: Listener = function on(target, type, listener, options) {
  target.addEventListener(type, listener as any, options);
};

export const off: Listener = function off(target, type, listener, options) {
  target.removeEventListener(type, listener as any, options);
};
