(function () {
  // Operations on or yielding colors.
  var SColor = {};

  // Const for color. 1-255/RGB 0-1/A
  window.Color = function (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  };
  
  SColor.rand = function (target) {
    target.r = Math.floor(SMath.rand(0, 255));
    target.g = Math.floor(SMath.rand(0, 255));
    target.b = Math.floor(SMath.rand(0, 255));
    target.a = 1;
    return target;
  };

  SColor.lerp = function (target, colorA, colorB, alpha) {
    target.r = (colorB.r - colorA.r) * alpha;
    target.g = (colorB.g - colorA.g) * alpha;
    target.b = (colorB.b - colorA.b) * alpha;
    target.a = (colorB.a - colorA.a) * alpha;
  };
  
  SColor.colorFromColor = function (color) {
    return new Color(color.r, color.g, color.b, color.a);
  };

  SColor.colorForHex = function (hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new Color(
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      1) : new Color(0, 0, 0, 0);
  };
  
  SColor.colorString = function (r, g, b, a) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  };

  // Sets the cached hex value on the
  SColor.updateColorString = function (color) {
    color.colorString = SColor.colorString(color.r, color.g, color.b, color.a);
  };

  window.SColor = SColor;
}());