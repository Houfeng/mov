import { compose } from "./Compose";
import { Actuator } from "./Actuator";

import { Defer } from "./Defer";
import { Easing } from "./Easing";
import { Values } from "./Values";

export { Easing } from "./Easing";

export { type Actuator } from "./Actuator";
export { type Values } from "./Values";
export { type EasingHandler } from "./EasingHandler";
export { type EffectHandler } from "./EffectHandler";

/**
 * 设置初始值，并创建一个动画
 * @param values 初始值
 * @returns
 */
export const mov = <V extends Values>(values: V): Actuator<V> =>
  compose<V>({
    from: values,
    framerate: 60,
    duration: 600,
    easing: Easing.Linear,
    prevDefer: null,
    defer: Defer<V>(),
  });

/**
 * 设置初始值
 * @param values 初始值
 * @returns
 */
mov.from = mov as <V extends Values>(values: V) => Actuator<V>;

/**
 * 内建的常用缓动函数
 */
mov.easing = Easing;
