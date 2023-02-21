type AnyToVoidFunction = (...args: any[]) => void;
type AnyToVoidFuncWithThis<T> = (this: T, ...args: any[]) => void;
