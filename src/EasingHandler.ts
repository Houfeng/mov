export type EasingHandler = (
  step: number,
  start: number,
  increment: number,
  count: number,
  ...args: number[]
) => number;
