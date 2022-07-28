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
  return { promise, resolve, reject };
}
