// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export function throttle<T extends (...args: any[]) => unknown>(
  func: T,
  wait: number,
  options: { trailing?: boolean; leading?: boolean } = {}
): (...params: Parameters<T>) => ReturnType<T> {
  var context: any, args: any[], result: ReturnType<T>;
  let timeout: NodeJS.Timeout | null = null;
  var previous = 0;

  function resetParams() {
    context = null;
    args = null as unknown as any;
  }

  if (!options) options = {};
  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args) as ReturnType<T>;
    if (!timeout) resetParams();
  };
  return function (this: any) {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments as unknown as any[];
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args) as ReturnType<T>;
      if (!timeout) resetParams();
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
