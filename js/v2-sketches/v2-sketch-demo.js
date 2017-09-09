'use strict';

function v2SketchDemo() {
  this.conf = {
    name: 'V2 Sketch Demo',
    description: 'A basic scene in SM.',
    date: '08.13.2017'
  };


  this.setup = function () {
    this.update(0, sm.gfx);

    this.entities.buildEntity([
	    new PositionComponent(),
	    new RotationComponent(),
      new RenderableComponent(),
      new ColorComponent()
    ]);

    this.systems.addSystem(new SampleSystemA());
    this.systems.process(this.entities);
    console.log(this.systems.eventStore);
    this.systems.process(this.entities);
    console.log(this.systems.eventStore);
  };

  /**
   * Perform frame by frame behavior.
   * @param delta elapsed time since last frame
   * @param g, shorthand reference to sm.gfx.
   */
  this.update = function (delta, g) {
    g.clear(sc.color.black);
    g.text('Standby...');

    g.setFillColor(sc.color.white);
    g.setStrokeColor(sc.color.white);
  };
}