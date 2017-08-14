'use strict';

function v2SketchDemo() {
  this.conf = {
    name: 'V2 Sketch Demo',
    date: '08.13.2017'
  };

  var rect;
  var rotation = 0;

  this.setup = function () {
    rect = SPoly.polySquare(128);
  };

  /**
   * Perform frame by frame behavior.
   * @param delta elapsed time since last frame
   * @param g reference to sm.gfx.
   */
  this.update = function (delta, g) {
    g.clear(Color.black);
    g.text('Hello World');

    rotation += Math.PI / 16 * delta;
    g.setStrokeColor(Color.white);
    g.drawPolygon(rect, sm.input.state.cursor, false, rotation);
  };
}