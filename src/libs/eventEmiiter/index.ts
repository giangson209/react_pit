export class EventEmitter<T extends string = string> {
  _callbacks: Map<T, Set<AnyToVoidFunction>> = new Map();
  on(type: T, callback: AnyToVoidFuncWithThis<this>) {
    if (!this._callbacks.has(type)) this._callbacks.set(type, new Set());
    callback.bind(this);
    this._callbacks.get(type)!.add(callback);
    return this;
  }

  off(type: T, callback: AnyToVoidFunction) {
    if (!this._callbacks.has(type)) return this;
    this._callbacks.get(type)!.delete(callback);
    return this;
  }

  emit(type: T, ...args: any[]) {
    if (!this._callbacks.has(type)) return this;
    this._callbacks.get(type)!.forEach((fn) => fn.bind(this)(...args));
    return this;
  }
}
