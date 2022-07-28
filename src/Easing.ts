export const Easing = {
  Linear: function (t: number, b: number, c: number, d: number) {
    return (c * t) / d + b;
  },
  Quad: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
      return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
  },
  Cubic: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
      return (c / 2) * ((t -= 2) * t * t + 2) + b;
    },
  },
  Quart: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
      return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
    },
  },
  Quint: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
      return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
  },
  Sine: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
    },
  },
  Expo: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if (t == 0) return b;
      if (t == d) return b + c;
      if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
      return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
    },
  },
  Circ: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
      return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
  },
  Elastic: {
    easeIn: function (
      t: number,
      b: number,
      c: number,
      d: number,
      a: number,
      p: number
    ) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * 0.3;
      if (!a || a < Math.abs(c)) {
        a = c;
        // eslint-disable-next-line
        var s = p / 4;
      }
      // eslint-disable-next-line
      else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return (
        -(
          a *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p)
        ) + b
      );
    },
    easeOut: function (
      t: number,
      b: number,
      c: number,
      d: number,
      a: number,
      p: number
    ) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * 0.3;
      // eslint-disable-next-line
      if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
      // eslint-disable-next-line
      else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return (
        a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
        c +
        b
      );
    },
    easeInOut: function (
      t: number,
      b: number,
      c: number,
      d: number,
      a: number,
      p: number
    ) {
      // eslint-disable-next-line
      if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
      // eslint-disable-next-line
      if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
      // eslint-disable-next-line
      else var s = p / (2 * Math.PI) * Math.asin(c / a);
      if (t < 1)
        return (
          -0.5 *
            (a *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
          b
        );
      return (
        a *
          Math.pow(2, -10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
          0.5 +
        c +
        b
      );
    },
  },
  Back: {
    easeIn: function (t: number, b: number, c: number, d: number, s: number) {
      if (s == undefined) s = 1.70158;
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number, s: number) {
      if (s == undefined) s = 1.70158;
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOut: function (
      t: number,
      b: number,
      c: number,
      d: number,
      s: number
    ) {
      if (s == undefined) s = 1.70158;
      if ((t /= d / 2) < 1)
        return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
  },
  Bounce: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c - Easing.Bounce.easeOut(d - t, 0, c, d) + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
      }
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if (t < d / 2) return Easing.Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
      else return Easing.Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    },
  },
};
