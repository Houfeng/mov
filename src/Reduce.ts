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

export type Reduces<V extends Values> = {
  /**
   * 设置帧率（每秒触发 effect 的次数）
   * @param value 帧率
   * @returns
   */
  framerate: (value: number) => Reduces<V>;

  /**
   * 设置持续时间
   * @param value 持续时间，单位毫秒
   * @returns
   */
  duration: (value: number) => Reduces<V>;

  /**
   * 设置初始值
   * @param values 初始值
   * @returns
   */
  from: (values: V) => Reduces<V>;

  /**
   * 设置终止值
   * @param values 终止值
   * @returns
   */
  to: (values: V) => Reduces<V>;

  /**
   * 设置动画使用的缓动函数
   * @param handler 缓动函数
   * @returns
   */
  easing: (handler: EasingHandler) => Reduces<V>;

  /**
   * 设置休眠时间，多次设置会累加为总休眠时间
   * @param value 休眠时间
   * @returns
   */
  sleep: (value: number) => Reduces<V>;

  /**
   * 设置动画处理函数，并开始执行动画
   * @param handler 处理函数
   * @returns
   */
  effect: (handler: EffectHandler<V>) => Reduces<V>;

  /**
   * 定义连接上一个动画的动画，新动画将在前一个动画完成后启动
   * 上一个动画的 to 将作为新动作的 from，可直接设置新的 to
   * @returns
   */
  next: () => Reduces<V>;

  /**
   * 停止动画执行
   * @returns
   */
  stop: () => Reduces<V>;
};

export const reduce = <V extends Values>(context: Context<V>): Reduces<V> => {
  return {
    framerate: (value: number) => reduce(framerate(context, value)),
    duration: (value: number) => reduce(duration(context, value)),
    from: (values: V) => reduce(from(context, values)),
    to: (values: V) => reduce(to<V>(context, values)),
    easing: (handler: EasingHandler) => reduce(easing(context, handler)),
    sleep: (value: number) => reduce(sleep(context, value)),
    effect: (handler: EffectHandler<V>) => reduce(execute(context, handler)),
    next: () => reduce(next(context)),
    stop: () => reduce(stop(context)),
  };
};
