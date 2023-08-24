import { EasingHandler } from "./EasingHandler";
import { EffectHandler } from "./EffectHandler";
import { Values } from "./Values";

export type Actuator<V extends Values> = {
  /**
   * 设置帧率（每秒触发 effect 的次数）
   * @param value 帧率
   * @returns
   */
  framerate: (value: number) => Actuator<V>;

  /**
   * 设置持续时间
   * @param value 持续时间，单位毫秒
   * @returns
   */
  duration: (value: number) => Actuator<V>;

  /**
   * 设置初始值
   * @param values 初始值
   * @returns
   */
  from: (values: V) => Actuator<V>;

  /**
   * 设置终止值
   * @param values 终止值
   * @returns
   */
  to: (values: V) => Actuator<V>;

  /**
   * 设置动画使用的缓动函数
   * @param handler 缓动函数
   * @returns
   */
  easing: (handler: EasingHandler) => Actuator<V>;

  /**
   * 设置休眠时间，多次设置会累加为总休眠时间
   * @param value 休眠时间
   * @returns
   */
  sleep: (value: number) => Actuator<V>;

  /**
   * 设置动画处理函数，并开始执行动画
   * @param handler 处理函数
   * @returns
   */
  effect: (handler: EffectHandler<V>) => Actuator<V>;

  /**
   * 定义连接上一个动画的动画，新动画将在前一个动画完成后启动
   * 上一个动画的 to 将作为新动作的 from，可直接设置新的 to
   * @returns
   */
  next: () => Actuator<V>;

  /**
   * 停止动画执行
   * @returns
   */
  stop: () => Actuator<V>;
};
