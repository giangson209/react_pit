import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions {
  root?: RefObject<HTMLElement>;
  margin?: number;
  threshold?: number | number[];
}
export type UseIntersectionObserverCallback = (entires: IntersectionObserverEntry[]) => void;
export type TargetCallback = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void;
interface IntersectionController {
  observer: IntersectionObserver;
  callbacks: Map<HTMLElement, TargetCallback>;
}
export type ObserveFn = (target: HTMLElement, targetCallback?: TargetCallback) => () => void;

export function useIntersectionObserver(
  options?: UseIntersectionObserverOptions,
  rootCallback?: UseIntersectionObserverCallback
) {
  const { root, margin, threshold } = options || {};

  const controllerRef = useRef<IntersectionController>();
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.observer.disconnect();
        controllerRef.current.callbacks.clear();
        controllerRef.current = undefined;
      }
    };
  }, []);

  // Hàm khởi tạo IntersectionObserver
  function initController() {
    const callbacks = new Map();
    const observer = new IntersectionObserver(
      function callback(entries, observer) {
        if (rootCallback) rootCallback(entries);

        entries.forEach((entry) => {
          const callback = callbacks.get(entry.target);
          if (callback) callback(entry, observer);
        });
      },
      {
        root: root?.current,
        rootMargin: margin ? `${margin}px` : undefined,
        threshold: threshold,
      }
    );

    controllerRef.current = { observer, callbacks };
  }

  // Hàm thêm element vào IntersectionObserver
  const observer = useCallback((target: HTMLElement, targetCallback?: TargetCallback) => {
    if (!controllerRef.current) initController();

    const controller = controllerRef.current!;
    controller.observer.observe(target);

    if (targetCallback) controller.callbacks.set(target, targetCallback);

    return () => {
      if (targetCallback) controller.callbacks.delete(target);
      controller.observer.unobserve(target);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { observer };
}

export function useOnIntersect(
  observe?: ObserveFn,
  callback?: TargetCallback,
  options?: { onceOnly?: boolean }
) {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!observe || !ref || !callback) return () => {};
    const unsubcribe = observe(ref, function (...e) {
      const [entry, observer] = e;
      // self.unobse
      callback(...e);
      entry.isIntersecting &&
        options?.onceOnly &&
        (observer.unobserve(entry.target), unsubcribe?.());
    });
    return unsubcribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observe, ref]);
  return { ref: setRef };
}
export function useOnIntersectRef(
  ref: React.RefObject<HTMLElement>,
  observe?: ObserveFn,
  callback?: TargetCallback,
  options?: { onceOnly?: boolean }
) {
  useEffect(() => {
    if (!observe || !ref.current) return () => {};
    const unsubcribe = observe(ref.current, function (...e) {
      const [entry, observer] = e;
      // self.unobse
      callback?.(...e);
      entry.isIntersecting &&
        options?.onceOnly &&
        (observer.unobserve(entry.target), unsubcribe?.());
    });
    return unsubcribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observe]);
}
