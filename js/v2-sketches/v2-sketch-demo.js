'use strict';

function v2SketchDemo() {
  this.conf = {
    name: 'V2 Sketch Demo',
    date: '08.13.2017'
  };

  this.setup = function () {
    
  };

  /**
   * Perform frame by frame behavior.
   * @param delta elapsed time since last frame
   * @param g reference to sm.gfx.
   */
  this.update = function (delta, g) {

    g.clear(Color.black);
  };
}