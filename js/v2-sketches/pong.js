'use strict';

function Pong () {
  this.conf = {
    name: 'Pong.',
    description: 'Pong in SM.',
    date: '09.14.2017'
  };

  this.setup = function () {
    this.update(0, sm.gfx);

    var paddlePoly = SPoly.polySquare(64);
    SPoly.scalePoly(paddlePoly, new SVec.Vector(.55, 2.75));

    // Player paddle
    var player = this.entities.buildEntity([
	    new TransformComponent(-256, 0),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(paddlePoly),
      new ColliderComponent(paddlePoly)
    ]);

    // AI paddle
    var AIPaddle = this.entities.buildEntity([
      new TransformComponent(256, 0),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(paddlePoly),
      new ColliderComponent(paddlePoly)
    ]);

    // ball
    var ball = this.entities.buildEntity([
      new TransformComponent(),
      new RenderableComponent(),
      new GameplayComponent(),
      new VelocityComponent(.5, 0),
      new PolygonComponent(SPoly.polyCircle(16)),
      new ColliderComponent(SPoly.polyCircle(16))
    ]);

    this.entities.tagEntity(ball.ID, 'ball');
    this.entities.tagEntity(AIPaddle.ID, 'AIPaddle');
    this.entities.tagEntity(player.ID, 'player');

    this.systems.addSystem(new PongSystem());
    this.systems.addSystem(new VelocitySystem());
    this.systems.addSystem(new RenderingSystem());
  };

  this.update = function (delta, g) {
    g.clear("#114b53");
    this.systems.process(this.entities, delta);
  };
}