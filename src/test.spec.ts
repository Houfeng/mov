import { mov } from "./index";

mov
  .from({ x: 100, y: 100 })
  .to({ x: 0, y: 10 })
  .effect(({ x, y }) => {
    console.log("x:", x, "y:", y);
  });
