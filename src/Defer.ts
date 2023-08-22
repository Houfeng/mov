export type Defer<V = unknown> = {
  promise: Promise<V>;
  resolve: Parameters<ConstructorParameters<typeof Promise<V>>[0]>[0];
  reject: Parameters<ConstructorParameters<typeof Promise<V>>[0]>[1];
};

export function Defer<V = unknown>(): Defer<V> {
  let resolve: Parameters<ConstructorParameters<typeof Promise<V>>[0]>[0];
  let reject: Parameters<ConstructorParameters<typeof Promise<V>>[0]>[1];
  const promise = new Promise<V>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  /**
   * 在 reject 时，从不在 console 打印错误
   */
  promise.catch(() => void 0);
  return { promise, resolve, reject };
}
