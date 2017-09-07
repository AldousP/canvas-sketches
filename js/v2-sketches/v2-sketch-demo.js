'use strict';

function v2SketchDemo() {
  this.conf = {
    name: 'V2 Sketch Demo',
    description: 'A basic scene in SM.',
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
    this.update(0, sm.gfx);

    this.entities.buildEntity([
	    new PositionComponent(),
	    new RotationComponent(),
      new ColorComponent()
    ]);

	  this.entities.buildEntity([
		  new PositionComponent(),
	  ]);

    this.systems.addSystem(new SampleSystem());
    this.systems.process(this.entities);
    console.log(this.entities);
  };

  /**
   * Perform frame by frame behavior.
   * @param delta elapsed time since last frame
   * @param g, shorthand reference to sm.gfx.
   */
  this.update = function (delta, g) {
    g.clear(sc.color.black);
    g.text(sm.input.state.cursor);

    rotation += Math.PI / 16 * delta;
    g.setFillColor(sc.color.white);
    g.setStrokeColor(sc.color.white);
  };
}