import { useEffect, useRef, useState } from "react";
import { InnerChildGUI, innerGUI } from "./gui";

export function useGui<T extends Record<string, any>>(name: string, defaultValues: T) {
  const cacheObject = useRef<T>(defaultValues);
  const object = useRef<T>(defaultValues);
  const gui = useRef<InnerChildGUI<T>>();

  useEffect(() => {
    gui.current = innerGUI.addObject(name);
    object.current = gui.current.object;
    addValues();
    return () => {
      innerGUI.deleteObject(name);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  function addValues() {
    const folder = gui.current;
    if (!folder) return;
    const listKeys = Object.keys(defaultValues);
    listKeys.forEach((key) => {
      update(key, defaultValues[key]);
    }, []);
  }

  function update(key: string, defaultValue: string | number | boolean) {
    const folder = gui.current;
    const k = key as unknown as keyof T;
    (cacheObject.current as any)[key] = defaultValue;
    if (!folder || Object.hasOwn(folder.object, k)) return;
    folder.object[k] = defaultValue as any;
    folder.add(key).listen();
  }

  function assign(o: Partial<T>) {
    Object.assign(object.current, o);
  }

  return { gui: gui, object, update, assign };
}
