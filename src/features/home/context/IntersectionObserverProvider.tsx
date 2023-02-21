import React, { createContext, useContext } from "react";
import {
  useIntersectionObserver,
  ObserveFn,
  UseIntersectionObserverOptions,
  UseIntersectionObserverCallback,
} from "src/hooks/useIntersectionObserver";

type Props = {
  children?: React.ReactNode;
  options?: UseIntersectionObserverOptions;
  rootCallback?: UseIntersectionObserverCallback;
};

const ObserverContext = createContext<{ observer: ObserveFn }>({
  observer() {
    return () => {};
  },
});
const IntersectionObserverProvider = (props: Props) => {
  const { observer } = useIntersectionObserver(props.options, props.rootCallback);
  return <ObserverContext.Provider value={{ observer }}>{props.children}</ObserverContext.Provider>;
};
const useObserverContext = () => useContext(ObserverContext);

export default IntersectionObserverProvider;
export { useObserverContext };
