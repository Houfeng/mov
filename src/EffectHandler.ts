import { Values } from "./Values";

export type EffectHandler<V extends Values> = (
  values: V,
  complete: boolean
) => void;
