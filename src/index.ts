import { Reduces, reduce } from "./Reduce";

import { Defer } from "./Defer";
import { Easing } from "./Easing";
import { Values } from "./Values";

export * from "./Easing";

export const mov = <V1 extends Values>(values: V1): Reduces<V1> => {
  return reduce<V1>({
    from: values,
    framerate: 60,
    duration: 600,
    easing: Easing.Linear,
    beforeDefer: null,
    defer: Defer<V1>(),
  });
};

mov.from = mov as <V2 extends Values>(values: V2) => Reduces<V2>;
mov.easing = Easing;
