import { Defer } from "./Defer";
import { EasingHandler } from "./EasingHandler";
import { Values } from "./Values";

export type Context<V extends Values> = {
  from?: V;
  to?: V;
  duration: number;
  easing: EasingHandler;
  framerate: number;
  prevDefer: Defer<any>;
  defer: Defer<any>;
  stop?: () => void;
};
