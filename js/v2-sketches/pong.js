'use strict';

function Pong() {
  this.conf = {
    name: 'Pong.',
    description: 'Pong in SM.',
    date: '09.14.2017'
  };

  this.setup = function () {
    this.update(0, sm.gfx);

    // Player paddle
    this.entities.buildEntity([
	    new TransformComponent(),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(SPoly.polySquare(64))
    ]);

    // AI paddle
    this.entities.buildEntity([
      new TransformComponent(),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(SPoly.polySquare(64))
    ]);

    // ball
    this.entities.buildEntity([
      new TransformComponent(),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(SPoly.polyCircle(16))
    ]);

    this.systems.addSystem(new PongSystem());
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