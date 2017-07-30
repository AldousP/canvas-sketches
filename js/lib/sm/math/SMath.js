var SMath = {
  rand: function (floor, ceil) {
    return (ceil - floor) * Math.random() + floor;
  },

  project: function (val, originRangeA, originRangeB, targetRangeA, targetRangeB ) {
    var originSpan = originRangeB - originRangeA;
    var targetSpan = targetRangeB - targetRangeA;
    return (val / originSpan) * targetSpan + targetRangeA;
  },

  /**
   * Returns the interpolated value between two colors.
   */
  lerpColor: function (colorA, colorB, alpha) {
    return colorA;
  },

  /**
   * Returns the interpolated value between two constants.
   */
  lerp: function (valA, valB, alpha) {
    return valA + (valB - valA) * alpha;
  }
};