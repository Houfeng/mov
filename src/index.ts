import { Reduces, reduce } from "./Reduce";

import { Defer } from "./Defer";
import { Easing } from "./Easing";
import { Values } from "./Values";

export * from "./Easing";

/**
 * 设置初始值，并创建一个动画
 * @param values 初始值
 * @returns
 */
export const mov = <V1 extends Values>(values: V1): Reduces<V1> => {
  return reduce<V1>({
    from: values,
    framerate: 60,
    duration: 600,
    easing: Easing.Linear,
    prevDefer: null,
    defer: Defer<V1>(),
  });
};

/**
 * 设置初始值
 * @param values 初始值
 * @returns
 */
mov.from = mov as <V2 extends Values>(values: V2) => Reduces<V2>;

/**
 * 内建的常用缓动函数
 */
mov.easing = Easing;
