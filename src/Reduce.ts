import { Context } from "./Context";
import { Defer } from "./Defer";
import { EasingHandler } from "./EasingHandler";
import { EffectHandler } from "./EffectHandler";
import { Values } from "./Values";

const from = <V extends Values>(
  context: Context<V>,
  values: V
): Context<V> => ({ ...context, from: values });

const to = <V extends Values>(context: Context<V>, values: V): Context<V> => ({
  ...context,
  to: values,
});

const duration = <V extends Values>(
  context: Context<V>,
  value: number
): Context<V> => ({ ...context, duration: value });

const easing = <V extends Values>(
  context: Context<V>,
  handler: EasingHandler
): Context<V> => ({ ...context, easing: handler });

const framerate = <V extends Values>(
  context: Context<V>,
  value: number
): Context<V> => ({ ...context, framerate: value });

const sleep = <V extends Values>(
  context: Context<V>,
  value: number
): Context<V> => {
  const originBeforeDefer = context.beforeDefer;
  const beforeDefer = Defer<void>();
  setTimeout(() => {
    return originBeforeDefer
      ? originBeforeDefer.promise.then(beforeDefer.resolve)
      : beforeDefer.resolve();
  }, value);
  return { ...context, beforeDefer };
};

const next = <V extends Values>(context: Context<V>): Context<V> => ({
  ...context,
  beforeDefer: context.defer,
  from: context.to,
  to: null,
});

const execute = <V extends Values>(
  context: Context<V>,
  handler: EffectHandler<V>
): Context<V> => {
  const { from, to } = context;
  if (!from) throw new Error("Invalid from values");
  if (!to) throw new Error("Invalid to values");
  const { duration, framerate, easing, defer, beforeDefer } = context;
  const startTimer = () => {
    const keys = Object.keys(from);
    const increments = keys.reduce<Values>(
      (map, k) => ({ ...map, [k]: (to[k] || 0) - (from[k] || 0) }),
      {}
    );
    const interval = 1000 / framerate;
    const count = Math.round(duration / interval);
    let step = 0;
    const timer = setInterval(() => {
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
  if (beforeDefer) beforeDefer.promise.then(startTimer);
  else startTimer();
  return { ...context };
};

export const reduce = <V extends Values>(context: Context<V>) => {
  return {
    framerate: (value: number) => reduce(framerate(context, value)),
    duration: (value: number) => reduce(duration(context, value)),
    from: (value: V) => reduce(from(context, value)),
    to: (value: V) => reduce(to<V>(context, value)),
    next: () => reduce(next(context)),
    easing: (handler: EasingHandler) => reduce(easing(context, handler)),
    sleep: (value: number) => reduce(sleep(context, value)),
    effect: (handler: EffectHandler<V>) => reduce(execute(context, handler)),
  };
};
