import { useCallback, useMemo } from "react";
import { throttle } from "src/utils/throttle";

function useThrottled<T extends AnyToVoidFunction>(
  fn: T,
  deps: any[],
  ms: number,
  leading?: boolean,
  trailing?: boolean
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fnMemo = useCallback(fn, deps);

  return useMemo(() => {
    return throttle(fnMemo, ms, { leading, trailing });
  }, [fnMemo, leading, ms, trailing]);
}

export default useThrottled;
