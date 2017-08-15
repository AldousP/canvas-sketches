'use strict';

function v2SketchDemo() {
  this.conf = {
    name: 'V2 Sketch Demo',
    date: '08.13.2017'
  };

  var rect;
  var circ;
  var rotation = 0;
  var chime;

  this.setup = function () {
    rect = SPoly.polySquare(128);
    circ = SPoly.polyCircle(64);
    chime = sm.sfx.loadSound('assets/sfx/UI_cmaj8_arp.mp3');
  };

  /**
   * Perform frame by frame behavior.
   * @param delta elapsed time since last frame
   * @param g reference to sm.gfx.
   */
  this.update = function (delta, g) {
    g.clear(sc.color.black);
    g.text(sm.input.state.cursor);

    rotation += Math.PI / 16 * delta;
    g.setStrokeColor(sc.color.white);
    g.drawPolygon(rect, null, false, rotation);
    g.drawPolygon(circ, sm.input.state.cursor, false, rotation);

  };
}