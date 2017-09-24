'use strict';
if (!sc) {
  var sc = {};
}


sc.color = {
  clear: new Color(0, 0, 0, 0),
  white : SColor.colorForHex("#FFFFFF"),
  black : SColor.colorForHex("#000000"),
  red : SColor.colorForHex("#FF0000"),
  green : SColor.colorForHex("#00FF00"),
  blue : SColor.colorForHex("#0000FF"),
  pink : SColor.colorForHex("#FF00FF"),
  yellow : SColor.colorForHex("#FFFF00"),
  cyan : SColor.colorForHex("#00FFFF"),
  orange : SColor.colorForHex("#FF8800"),
  dark_blue : SColor.colorForHex("#000180")
};

/**
 * @return {string}
 */
sc.color.RGBA = function (R, G, B, A) {
  return 'rgba(' + R + ", " + G + ', ' + B + ', ' + A + ')';
};

sc.color.randColor = function () {
  return sc.color.RGBA(
      Math.floor(SMath.rand(0, 255)),
      Math.floor(SMath.rand(0, 255)),
      Math.floor(SMath.rand(0, 255)),
      SFormat.float_two_pt(SMath.rand(0, 1))
  );
};