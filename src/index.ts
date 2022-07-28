import { Defer } from "./Defer";
import { Easing } from "./Easing";
import { Values } from "./Values";
import { reduce } from "./Reduce";

export * from "./Easing";

export const mov = <V extends Values>(from: V) =>
  reduce<V>({
    from: from,
    framerate: 60,
    duration: 600,
    easing: Easing.Linear,
    beforeDefer: null,
    defer: Defer<V>(),
  });

mov.from = mov;
mov.easing = Easing;