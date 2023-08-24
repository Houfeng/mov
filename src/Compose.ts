import { Actuator } from "./Actuator";
import { Context } from "./Context";
import { Defer } from "./Defer";
import { EasingHandler } from "./EasingHandler";
import { EffectHandler } from "./EffectHandler";
import { Values } from "./Values";

/**
 * 向指定 context 设置初始值，并产生一个新 context
 * @param context 原始上下文
 * @param values 初始值
 * @returns
 */
const from = <V extends Values>(
  context: Context<V>,
  values: V
): Context<V> => ({ ...context, from: values });

/**
 * 向指定 context 设置终止值，并产生一个新 context
 * @param context 原始上下文
 * @param values 终止值
 * @returns
 */
const to = <V extends Values>(context: Context<V>, values: V): Context<V> => ({
  ...context,
  to: values,
});

/**
 * 向指定 context 设置持续时间，并产生一个新 context
 * @param context 原始上下文
 * @param value 持续时间
 * @returns
 */
const duration = <V extends Values>(
  context: Context<V>,
  value: number
): Context<V> => ({ ...context, duration: value });

/**
 * 向指定 context 设置缓动函数，并产生一个新的 context
 * @param context 原始上下文
 * @param handler 缓动函数
 * @returns
 */
const easing = <V extends Values>(
  context: Context<V>,
  handler: EasingHandler
): Context<V> => ({ ...context, easing: handler });

/**
 * 向指定 context 设置帧率，并产生一个新的 context
 * @param context 原始上下文
 * @param value 帧率
 * @returns
 */
const framerate = <V extends Values>(
  context: Context<V>,
  value: number
): Context<V> => ({ ...context, framerate: value });

/**
 * 向当指定 context 设置休眠时间，多次设置会累加为总休眠时间，并产生一个新的 context
 * @param context 原始上下文
 * @param value 休眠时间，单位毫秒
 * @returns
 */
const sleep = <V extends Values>(
  context: Context<V>,
  value: number
): Context<V> => {
  const originPrevDefer = context.prevDefer;
  const prevDefer = Defer<void>();
  setTimeout(() => {
    return originPrevDefer
      ? originPrevDefer.promise.then(prevDefer.resolve)
      : prevDefer.resolve();
  }, value);
  return { ...context, prevDefer };
};

/**
 * 生成一个新的 context，并在上一个 context 执行完成后启动
 * @param context 原始上下文
 * @returns
 */
const next = <V extends Values>(context: Context<V>): Context<V> => ({
  ...context,
  prevDefer: context.defer,
  from: context.to,
  to: null,
});

/**
 * 在指定的 context 上启动动画执行
 * @param context 动画上下文对象
 * @param handler 动画处理函数
 * @returns
 */
const execute = <V extends Values>(
  context: Context<V>,
  handler: EffectHandler<V>
): Context<V> => {
  const { from, to } = context;
  if (!from) throw new Error("Invalid from values");
  if (!to) throw new Error("Invalid to values");
  const { duration, framerate, easing, defer, prevDefer } = context;
  let timer: ReturnType<typeof setInterval>;
  const start = () => {
    const keys = Object.keys(from);
    const increments = keys.reduce<Values>(
      (map, k) => ({ ...map, [k]: (to[k] || 0) - (from[k] || 0) }),
      {}
    );
    const interval = 1000 / framerate;
    const count = Math.round(duration / interval);
    let step = 0;
    timer = setInterval(() => {
      const values = keys.reduce<V>(
        (map, k) => ({
          ...map,
          [k]: easing(step, from[k] || 0, increments[k], count),
        }),
        {} as V
      );
      const complete = step >= count;
      handler(values, complete);
      if (complete) {
        clearInterval(timer);
        defer.resolve(values);
      }
      step++;
    }, interval);
  };
  const stop = () => {
    clearInterval(timer);
    defer.resolve(null);
  };
  if (prevDefer) prevDefer.promise.then(start);
  else start();
  return { ...context, stop };
};

const stop = <V extends Values>(context: Context<V>): Context<V> => {
  if (context.stop) context.stop();
  return { ...context };
};

export const compose = <V extends Values>(context: Context<V>): Actuator<V> => {
  return {
    framerate: (value: number) => compose(framerate(context, value)),
    duration: (value: number) => compose(duration(context, value)),
    from: (values: V) => compose(from(context, values)),
    to: (values: V) => compose(to<V>(context, values)),
    easing: (handler: EasingHandler) => compose(easing(context, handler)),
    sleep: (value: number) => compose(sleep(context, value)),
    effect: (handler: EffectHandler<V>) => compose(execute(context, handler)),
    next: () => compose(next(context)),
    stop: () => compose(stop(context)),
  };
};
