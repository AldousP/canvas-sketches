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
      new GameplayComponent(),
	    new PositionComponent(0, 0),
	    new RotationComponent(),
      new RenderableComponent(),
      new MovementComponent(),
      new PolygonComponent(SPoly.polySquare(64))
    ]);

	  this.systems.addSystem(new SampleSystemA());
	  this.systems.addSystem(new MovementSystem());
    this.systems.addSystem(new RenderingSystem());
  };

  /**
   * Perform frame by frame behavior.
   * @param delta elapsed time since last frame
   * @param g, shorthand reference to sm.gfx.
   */
  this.update = function (delta, g) {
    g.clear(sc.color.black);
    this.systems.process(this.entities, delta);
  };
}